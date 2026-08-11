import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

// Utility function to parse CLI arguments like --name="Real Madruga" --email="admin@madruga.com"
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

  const teamName = args.name || "Real Madruga FC";
  const slug =
    args.slug ||
    teamName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const city = args.city || "São Paulo";
  const region = args.region || "Zona Leste";
  const primaryColor = args.primaryColor || "#10b981";
  const secondaryColor = args.secondaryColor || "#0b0f11";
  const fieldType = (args.fieldType || "SOCIETY").toUpperCase();
  const competitiveLevel = (args.competitiveLevel || "INTERMEDIATE").toUpperCase();

  const adminName = args.adminName || `Diretoria ${teamName}`;
  const adminEmail = args.email || `admin@${slug}.com`;
  const rawPassword = args.password || "Admin123456";

  console.log("⚡ [SISTEMA IA VARzea] Criando novo time e conta de administrador...");
  console.log(`📌 Time: ${teamName} (Slug: /${slug})`);
  console.log(`👤 Admin: ${adminName} (${adminEmail})`);

  const prisma = await getPrismaClient();

  try {
    // 1. Check or create Team
    let team = await prisma.team.findUnique({ where: { slug } });

    if (!team) {
      team = await prisma.team.create({
        data: {
          name: teamName,
          slug,
          city,
          region,
          primaryColor,
          secondaryColor,
          fieldType: fieldType as any,
          competitiveLevel: competitiveLevel as any,
          publicDirectoryOptIn: true,
          description: `Portal oficial da equipe ${teamName}.`,
        },
      });
      console.log(`✅ Equipe "${team.name}" criada com sucesso (ID: ${team.id})`);
    } else {
      console.log(`ℹ️ Equipe "${team.name}" já existia no banco.`);
    }

    // 2. Check or create Admin User
    const existingUser = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (existingUser) {
      // Update teamId and role if needed
      await prisma.user.update({
        where: { email: adminEmail },
        data: {
          teamId: team.id,
          role: "ADMIN",
        },
      });
      console.log(`✅ Usuário existente "${adminEmail}" foi vinculado como ADMIN da equipe ${team.name}.`);
    } else {
      const passwordHash = await bcrypt.hash(rawPassword, 12);
      await prisma.user.create({
        data: {
          email: adminEmail,
          name: adminName,
          passwordHash,
          role: "ADMIN",
          teamId: team.id,
        },
      });
      console.log(`✅ Novo usuário admin "${adminEmail}" criado com sucesso!`);
    }

    console.log("\n🎉 [CONCLUÍDO COM SUCESSO]");
    console.log("-----------------------------------------");
    console.log(`🌐 Arena Pública do Time: http://localhost:3000/${slug}`);
    console.log(`🔐 Painel Admin: http://localhost:3000/login`);
    console.log(`📧 E-mail: ${adminEmail}`);
    console.log(`🔑 Senha: ${rawPassword}`);
    console.log("-----------------------------------------\n");
  } catch (error) {
    console.error("❌ Erro ao criar time e admin:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
