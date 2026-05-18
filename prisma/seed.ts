import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const rawUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.DIRECT_URL || process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL!;
const url = new URL(rawUrl);
const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname.startsWith("192.168.");
if (!url.searchParams.has("sslmode")) {
  url.searchParams.set("sslmode", isLocal ? "disable" : "require");
}
if (!url.searchParams.has("uselibpqcompat")) url.searchParams.set("uselibpqcompat", "true");
const adapter = new PrismaPg({ connectionString: url.toString() });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando limpeza completa do banco de dados para primeiro acesso...");

  // 1. Delete all existing records in reverse dependency order
  await prisma.pushSubscription.deleteMany({});
  await prisma.achievement.deleteMany({});
  await prisma.membershipPayment.deleteMany({});
  await prisma.inviteToken.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.openMatchSlot.deleteMany({});
  await prisma.friendlyRequest.deleteMany({});
  await prisma.matchStats.deleteMany({});
  await prisma.rSVP.deleteMany({});
  await prisma.matchPositionLimit.deleteMany({});
  await prisma.matchLineupSelection.deleteMany({});
  await prisma.matchAttendance.deleteMany({});
  await prisma.matchChecklistItem.deleteMany({});
  await prisma.match.deleteMany({});
  await prisma.playerAvailabilityRule.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.player.deleteMany({});
  await prisma.season.deleteMany({});
  await prisma.team.deleteMany({});

  console.log("🗑️ Banco de dados limpo com sucesso!");

  // 2. Create single active ADMIN user with teamId null for setup
  const passwordHash = await bcrypt.hash("Admin123456", 12);
  const admin = await prisma.user.create({
    data: {
      email: "admin@admin.com",
      name: "Administrador Geral",
      passwordHash,
      role: "ADMIN",
      teamId: null, // Sem time vinculado para permitir cadastro no primeiro acesso
    },
  });

  console.log("✅ Administrador ativado:");
  console.log(`   E-mail: ${admin.email}`);
  console.log("   Senha: Admin123456");
  console.log("\n🎉 Banco de dados pronto para o primeiro acesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao rodar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
