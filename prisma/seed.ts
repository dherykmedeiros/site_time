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
  console.log("🌱 Iniciando seed completo do banco de dados...");
  const now = new Date();

  // 1. Clear existing data safely
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

  // 2. Create Teams
  const team = await prisma.team.create({
    data: {
      name: "FC Trovão Azul",
      slug: "fc-trovao-azul",
      description: "Equipe principal de futebol society da zona norte.",
      primaryColor: "#1e3a8a",
      secondaryColor: "#fbbf24",
      defaultVenue: "Campo do Parque Municipal - Vila Nova",
      city: "São Paulo",
      region: "Zona Norte",
      fieldType: "SOCIETY",
      competitiveLevel: "INTERMEDIATE",
      publicDirectoryOptIn: true,
    },
  });

  const team2 = await prisma.team.create({
    data: {
      name: "União Leste FC",
      slug: "uniao-leste-fc",
      description: "Equipe de amistosos de fim de semana.",
      primaryColor: "#0c6f5d",
      secondaryColor: "#f4d35e",
      defaultVenue: "Campo da Praça do Sol",
      city: "Guarulhos",
      region: "Leste",
      fieldType: "GRASS",
      competitiveLevel: "CASUAL",
      publicDirectoryOptIn: true,
    },
  });

  console.log("✅ Times criados:", team.name, "|", team2.name);

  // 3. Create Admin User linked to Team A
  const passwordHash = await bcrypt.hash("Admin123456", 12);
  const admin = await prisma.user.create({
    data: {
      email: "admin@admin.com",
      name: "Administrador Geral",
      passwordHash,
      role: "ADMIN",
      teamId: team.id,
    },
  });
  console.log("✅ Usuário admin criado e vinculado ao time:", admin.email);

  // 4. Create Season
  const season = await prisma.season.create({
    data: {
      name: `Temporada ${now.getFullYear()}`,
      type: "LEAGUE",
      startDate: new Date(now.getFullYear(), 0, 1),
      endDate: new Date(now.getFullYear(), 11, 31),
      teamId: team.id,
    },
  });
  console.log("✅ Temporada criada:", season.name);

  // 5. Create Open Match Slots for Discovery
  await prisma.openMatchSlot.createMany({
    data: [
      {
        teamId: team.id,
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10, 15, 0),
        timeLabel: "Sábado à tarde",
        venueLabel: "Campo do Parque Municipal - Vila Nova",
        notes: "Preferência por amistoso com arbitragem dividida.",
        status: "OPEN",
      },
      {
        teamId: team2.id,
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 12, 10, 0),
        timeLabel: "Domingo 10h",
        venueLabel: "Campo da Praça do Sol",
        notes: "Campo de grama natural.",
        status: "OPEN",
      },
    ],
  });
  console.log("✅ Slots abertos de discovery criados");

  // 6. Create Players for Team A
  const playersData = [
    { name: "Rafael Oliveira", position: "GOALKEEPER" as const, shirtNumber: 1 },
    { name: "Bruno Santos", position: "DEFENDER" as const, shirtNumber: 3 },
    { name: "Thiago Mendes", position: "MIDFIELDER" as const, shirtNumber: 8 },
    { name: "Lucas Ferreira", position: "FORWARD" as const, shirtNumber: 9 },
    { name: "Gabriel Costa", position: "FORWARD" as const, shirtNumber: 11 },
  ];

  const players = [];
  for (const p of playersData) {
    const player = await prisma.player.create({
      data: {
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

  // 7. Create Matches (2 completed, 1 scheduled)
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
  console.log("✅ 3 partidas criadas (2 finalizadas, 1 agendada)");

  // 8. Create RSVPs for scheduled match
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
  console.log("✅ RSVPs criados para partida agendada");

  // 9. Create Match Stats
  const statsMatch1 = [
    { playerId: players[3].id, matchId: match1.id, goals: 2, assists: 0, yellowCards: 0, redCards: 0 },
    { playerId: players[4].id, matchId: match1.id, goals: 1, assists: 1, yellowCards: 1, redCards: 0 },
    { playerId: players[2].id, matchId: match1.id, goals: 0, assists: 2, yellowCards: 0, redCards: 0 },
    { playerId: players[1].id, matchId: match1.id, goals: 0, assists: 0, yellowCards: 1, redCards: 0 },
    { playerId: players[0].id, matchId: match1.id, goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
  ];

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

  // 10. Create Transactions
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
  ];

  for (const tx of transactionsData) {
    await prisma.transaction.create({
      data: { ...tx, teamId: team.id },
    });
  }
  console.log("✅ 7 transações de exemplo criadas");

  // 11. Create Friendly Request
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

  console.log("\n🎉 Seed concluído com sucesso!");
  console.log("   E-mail Admin: admin@admin.com");
  console.log("   Senha Admin: Admin123456");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao rodar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
