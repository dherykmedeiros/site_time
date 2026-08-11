import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

function parseArgs(): Record<string, string> {
  const args: Record<string, string> = {};
  process.argv.slice(2).forEach((arg) => {
    if (arg.startsWith("--")) {
      const [key, ...valueParts] = arg.slice(2).split("=");
      args[key] = valueParts.join("=").replace(/^["']|["']$/g, "");
    }
  });
  return args;
}

async function getPrismaClient() {
  const rawUrl =
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DIRECT_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL;

  if (!rawUrl) {
    return new PrismaClient();
  }

  const url = new URL(rawUrl);
  const isLocal =
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1" ||
    url.hostname.startsWith("192.168.");
  if (!url.searchParams.has("sslmode")) {
    url.searchParams.set("sslmode", isLocal ? "disable" : "require");
  }
  if (!url.searchParams.has("uselibpqcompat")) {
    url.searchParams.set("uselibpqcompat", "true");
  }
  const adapter = new PrismaPg({ connectionString: url.toString() });
  return new PrismaClient({ adapter });
}

async function main() {
  const args = parseArgs();
  const slug = args.slug || "real-madruga-fc";

  console.log(`🗑️ Removendo o time com slug "${slug}" do banco de dados...`);

  const prisma = await getPrismaClient();

  try {
    const team = await prisma.team.findUnique({ where: { slug } });

    if (!team) {
      console.log(`⚠️ Nenhum time encontrado com o slug "${slug}".`);
      return;
    }

    // Delete associated Users
    const deletedUsers = await prisma.user.deleteMany({
      where: { teamId: team.id },
    });
    console.log(`✅ ${deletedUsers.count} usuário(s) associado(s) deletado(s).`);

    // Delete associated Matches (and cascade child tables)
    const deletedMatches = await prisma.match.deleteMany({
      where: { teamId: team.id },
    });
    console.log(`✅ ${deletedMatches.count} partida(s) associada(s) deletada(s).`);

    // Delete associated Players
    const deletedPlayers = await prisma.player.deleteMany({
      where: { teamId: team.id },
    });
    console.log(`✅ ${deletedPlayers.count} jogador(es) associado(s) deletado(s).`);

    // Delete Team itself
    await prisma.team.delete({
      where: { id: team.id },
    });

    console.log(`🎉 Time "${team.name}" (ID: ${team.id}) foi completamente apagado com sucesso!`);
  } catch (error) {
    console.error("❌ Erro ao apagar o time:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
