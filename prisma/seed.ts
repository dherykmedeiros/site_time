import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL!;
const adapter = new PrismaPg(connectionString);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando seed...");

  // 1. Create admin user
  const passwordHash = await bcrypt.hash("Admin@123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@sitetime.com.br" },
    update: {},
    create: {
      email: "admin@sitetime.com.br",
      name: "Carlos Eduardo Silva",
      passwordHash,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin criado:", admin.email);

  // 2. Create team
  const team = await prisma.team.upsert({
    where: { slug: "fc-trovao-azul" },
    update: {},
    create: {
      name: "FC Trovão Azul",
      slug: "fc-trovao-azul",
      description:
        "Time de futebol amador do bairro Vila Nova. Fundado em 2018, jogamos todos os domingos no campinho do Parque Municipal.",
      primaryColor: "#1e3a8a",
      secondaryColor: "#fbbf24",
      defaultVenue: "Campo do Parque Municipal - Vila Nova",
    },
  });

  // Link admin to team
  await prisma.user.update({
    where: { id: admin.id },
    data: { teamId: team.id },
  });
  console.log("✅ Time criado:", team.name);

  // 3. Create 5 players
  const playersData = [
    { name: "Rafael Oliveira", position: "GOALKEEPER" as const, shirtNumber: 1 },
    { name: "Bruno Santos", position: "DEFENDER" as const, shirtNumber: 3 },
    { name: "Thiago Mendes", position: "MIDFIELDER" as const, shirtNumber: 8 },
    { name: "Lucas Ferreira", position: "FORWARD" as const, shirtNumber: 9 },
    { name: "Gabriel Costa", position: "FORWARD" as const, shirtNumber: 11 },
  ];

  const players = [];
  for (const p of playersData) {
    const player = await prisma.player.upsert({
      where: { teamId_shirtNumber: { teamId: team.id, shirtNumber: p.shirtNumber } },
      update: {},
      create: {
        name: p.name,
        position: p.position,
        shirtNumber: p.shirtNumber,
        status: "ACTIVE",
        teamId: team.id,
      },
    });
    players.push(player);
  }
  console.log(`✅ ${players.length} jogadores criados`);

  // 4. Create 3 matches (1 completed, 1 scheduled, 1 completed)
  const now = new Date();

  const match1 = await prisma.match.create({
    data: {
      date: new Date(now.getFullYear(), now.getMonth() - 1, 15, 10, 0),
      venue: "Campo do Parque Municipal - Vila Nova",
      opponent: "Estrela Vermelha FC",
      type: "FRIENDLY",
      status: "COMPLETED",
      homeScore: 3,
      awayScore: 1,
      teamId: team.id,
    },
  });

  const match2 = await prisma.match.create({
    data: {
      date: new Date(now.getFullYear(), now.getMonth() - 2, 8, 16, 0),
      venue: "Estádio Municipal São Jorge",
      opponent: "Unidos da Serra",
      type: "CHAMPIONSHIP",
      status: "COMPLETED",
      homeScore: 2,
      awayScore: 2,
      teamId: team.id,
    },
  });

  const match3 = await prisma.match.create({
    data: {
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 10, 0),
      venue: "Campo do Parque Municipal - Vila Nova",
      opponent: "Atlético Bairro Alto",
      type: "FRIENDLY",
      status: "SCHEDULED",
      teamId: team.id,
    },
  });
  console.log("✅ 3 partidas criadas");

  // 5. Create RSVPs for scheduled match
  for (const player of players) {
    await prisma.rSVP.create({
      data: {
        playerId: player.id,
        matchId: match3.id,
        status: player.shirtNumber <= 8 ? "CONFIRMED" : "PENDING",
        respondedAt: player.shirtNumber <= 8 ? new Date() : null,
      },
    });
  }
  console.log("✅ RSVPs criados para partida futura");

  // 6. Create match stats for completed matches
  // Match 1: 3-1 win
  const statsMatch1 = [
    { playerId: players[3].id, matchId: match1.id, goals: 2, assists: 0, yellowCards: 0, redCards: 0 },
    { playerId: players[4].id, matchId: match1.id, goals: 1, assists: 1, yellowCards: 1, redCards: 0 },
    { playerId: players[2].id, matchId: match1.id, goals: 0, assists: 2, yellowCards: 0, redCards: 0 },
    { playerId: players[1].id, matchId: match1.id, goals: 0, assists: 0, yellowCards: 1, redCards: 0 },
    { playerId: players[0].id, matchId: match1.id, goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
  ];

  // Match 2: 2-2 draw
  const statsMatch2 = [
    { playerId: players[3].id, matchId: match2.id, goals: 1, assists: 0, yellowCards: 1, redCards: 0 },
    { playerId: players[4].id, matchId: match2.id, goals: 1, assists: 0, yellowCards: 0, redCards: 0 },
    { playerId: players[2].id, matchId: match2.id, goals: 0, assists: 1, yellowCards: 0, redCards: 0 },
    { playerId: players[1].id, matchId: match2.id, goals: 0, assists: 1, yellowCards: 0, redCards: 1 },
    { playerId: players[0].id, matchId: match2.id, goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
  ];

  for (const stat of [...statsMatch1, ...statsMatch2]) {
    await prisma.matchStats.create({ data: stat });
  }
  console.log("✅ Estatísticas criadas para partidas finalizadas");

  // 7. Create sample transactions
  const transactionsData = [
    {
      type: "INCOME" as const,
      amount: 50.0,
      description: "Mensalidade Janeiro - Rafael Oliveira",
      category: "MEMBERSHIP" as const,
      date: new Date(now.getFullYear(), now.getMonth() - 1, 5),
    },
    {
      type: "INCOME" as const,
      amount: 50.0,
      description: "Mensalidade Janeiro - Bruno Santos",
      category: "MEMBERSHIP" as const,
      date: new Date(now.getFullYear(), now.getMonth() - 1, 5),
    },
    {
      type: "INCOME" as const,
      amount: 50.0,
      description: "Mensalidade Janeiro - Thiago Mendes",
      category: "MEMBERSHIP" as const,
      date: new Date(now.getFullYear(), now.getMonth() - 1, 7),
    },
    {
      type: "INCOME" as const,
      amount: 200.0,
      description: "Cota amistoso vs Estrela Vermelha FC",
      category: "FRIENDLY_FEE" as const,
      date: new Date(now.getFullYear(), now.getMonth() - 1, 15),
    },
    {
      type: "EXPENSE" as const,
      amount: 120.0,
      description: "Aluguel do campo - Parque Municipal",
      category: "VENUE_RENTAL" as const,
      date: new Date(now.getFullYear(), now.getMonth() - 1, 15),
    },
    {
      type: "EXPENSE" as const,
      amount: 80.0,
      description: "Arbitragem - Amistoso vs Estrela Vermelha",
      category: "REFEREE" as const,
      date: new Date(now.getFullYear(), now.getMonth() - 1, 15),
    },
    {
      type: "EXPENSE" as const,
      amount: 250.0,
      description: "Kit 10 coletes de treino",
      category: "EQUIPMENT" as const,
      date: new Date(now.getFullYear(), now.getMonth() - 1, 20),
    },
    {
      type: "INCOME" as const,
      amount: 150.0,
      description: "Cota amistoso vs Unidos da Serra",
      category: "FRIENDLY_FEE" as const,
      date: new Date(now.getFullYear(), now.getMonth() - 2, 8),
    },
  ];

  for (const tx of transactionsData) {
    await prisma.transaction.create({
      data: { ...tx, teamId: team.id },
    });
  }
  console.log("✅ 8 transações de exemplo criadas");

  // 8. Create a sample friendly request (pending)
  await prisma.friendlyRequest.create({
    data: {
      requesterTeamName: "Dragões do Subúrbio",
      contactEmail: "dragoes@email.com",
      contactPhone: "(11) 99876-5432",
      suggestedDates: "Próximos 2 domingos - manhã ou tarde",
      suggestedVenue: "Campo do Parque Municipal",
      proposedFee: 150.0,
      status: "PENDING",
      teamId: team.id,
    },
  });
  console.log("✅ Solicitação de amistoso pendente criada");

  console.log("\n🎉 Seed finalizado com sucesso!");
  console.log("   Email: admin@sitetime.com.br");
  console.log("   Senha: Admin@123");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
