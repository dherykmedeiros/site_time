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
  console.log("🌱 Iniciando limpeza completa do banco de dados...");

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

  const now = new Date();

  // 2. Create the Single Official Team
  const team = await prisma.team.create({
    data: {
      name: "FC Trovão Azul",
      slug: "fc-trovao-azul",
      description:
        "O Gigante da Zona Norte! Fundado em 2018, o FC Trovão Azul é movido pela paixão do futebol de várzea aos domingos. Foco em lealdade, competitividade e muita resenha no pós-jogo.",
      primaryColor: "#1e3a8a", // Azul Escuro
      secondaryColor: "#fbbf24", // Amarelo Ouro
      defaultVenue: "Campo do Parque Municipal - Vila Nova",
      city: "São Paulo",
      region: "Zona Norte",
      fieldType: "SOCIETY",
      competitiveLevel: "INTERMEDIATE",
      publicDirectoryOptIn: true,
    },
  });
  console.log("✅ Time criado:", team.name);

  // 3. Create Admin User
  const passwordHash = await bcrypt.hash("Admin@123", 12);
  const admin = await prisma.user.create({
    data: {
      email: "admin@sitetime.com.br",
      name: "Carlos Eduardo Silva",
      passwordHash,
      role: "ADMIN",
      teamId: team.id,
    },
  });
  console.log("✅ Admin criado:", admin.email);

  // 4. Create Squad (Players)
  const playersData = [
    { name: "Rafael Oliveira", position: "GOALKEEPER" as const, shirtNumber: 1, age: 28, phone: "(11) 98888-1111" },
    { name: "Bruno Santos", position: "DEFENDER" as const, shirtNumber: 3, age: 31, phone: "(11) 98888-2222" },
    { name: "Thiago Mendes", position: "MIDFIELDER" as const, shirtNumber: 8, age: 26, phone: "(11) 98888-3333" },
    { name: "Lucas Ferreira", position: "FORWARD" as const, shirtNumber: 9, age: 24, phone: "(11) 98888-4444" },
    { name: "Gabriel Costa", position: "FORWARD" as const, shirtNumber: 11, age: 27, phone: "(11) 98888-5555" },
  ];

  const players = [];
  for (const p of playersData) {
    const player = await prisma.player.create({
      data: {
        name: p.name,
        fullName: `${p.name} da Silva`,
        position: p.position,
        shirtNumber: p.shirtNumber,
        age: p.age,
        phone: p.phone,
        status: "ACTIVE",
        teamId: team.id,
      },
    });
    players.push(player);
  }
  console.log(`✅ ${players.length} jogadores criados no elenco`);

  // 5. Create Season
  const season = await prisma.season.create({
    data: {
      teamId: team.id,
      name: "Copa Varzeana Norte 2026",
      type: "LEAGUE",
      startDate: new Date(now.getFullYear(), now.getMonth() - 3, 1),
      status: "ACTIVE",
    },
  });
  console.log("✅ Temporada ativa criada:", season.name);

  // 6. Create Open Match Slots (Discovery for challenging teams)
  await prisma.openMatchSlot.createMany({
    data: [
      {
        teamId: team.id,
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10, 15, 0),
        timeLabel: "Sábado à tarde - 15:00",
        venueLabel: "Campo do Parque Municipal - Vila Nova",
        notes: "Preferência por amistoso com arbitragem dividida meio a meio.",
        status: "OPEN",
      },
      {
        teamId: team.id,
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 17, 9, 30),
        timeLabel: "Domingo de manhã - 09:30",
        venueLabel: "Campo do Parque Municipal - Vila Nova",
        notes: "Aceitamos visitas em campos da Zona Norte/Leste.",
        status: "OPEN",
      },
    ],
  });
  console.log("✅ Slots de agenda aberta criados");

  // 7. Create Matches
  // Match 1: Completed Friendly (3-1 win)
  const match1 = await prisma.match.create({
    data: {
      date: new Date(now.getFullYear(), now.getMonth() - 1, 15, 10, 0),
      venue: "Campo do Parque Municipal - Vila Nova",
      opponent: "Estrela Vermelha FC",
      type: "FRIENDLY",
      status: "COMPLETED",
      homeScore: 3,
      awayScore: 1,
      isHome: true,
      teamId: team.id,
    },
  });

  // Match 2: Completed Championship Match (2-2 Draw)
  const match2 = await prisma.match.create({
    data: {
      date: new Date(now.getFullYear(), now.getMonth() - 2, 8, 16, 0),
      venue: "Estádio Municipal São Jorge",
      opponent: "Unidos da Serra",
      type: "CHAMPIONSHIP",
      status: "COMPLETED",
      homeScore: 2,
      awayScore: 2,
      isHome: false, // Fora de casa, então FC Trovão Azul fez 2 e Unidos da Serra 2
      seasonId: season.id,
      teamId: team.id,
    },
  });

  // Match 3: Scheduled Friendly (Future)
  const match3 = await prisma.match.create({
    data: {
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 10, 0),
      venue: "Campo do Parque Municipal - Vila Nova",
      opponent: "Atlético Bairro Alto",
      type: "FRIENDLY",
      status: "SCHEDULED",
      seasonId: season.id,
      teamId: team.id,
    },
  });
  console.log("✅ 3 partidas (2 finalizadas, 1 futura) criadas");

  // 8. Create RSVPs for the upcoming Match 3
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
  console.log("✅ Confirmações (RSVPs) geradas para a próxima partida");

  // 9. Match Stats (Goals, Assists, Cards)
  // Match 1 Stats: 3-1 win
  const statsMatch1 = [
    { playerId: players[3].id, matchId: match1.id, goals: 2, assists: 0, yellowCards: 0, redCards: 0 }, // Lucas (shirt 9) 2 goals
    { playerId: players[4].id, matchId: match1.id, goals: 1, assists: 1, yellowCards: 1, redCards: 0 }, // Gabriel (shirt 11) 1 goal 1 assist
    { playerId: players[2].id, matchId: match1.id, goals: 0, assists: 2, yellowCards: 0, redCards: 0 }, // Thiago (shirt 8) 2 assists
    { playerId: players[1].id, matchId: match1.id, goals: 0, assists: 0, yellowCards: 1, redCards: 0 },
    { playerId: players[0].id, matchId: match1.id, goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
  ];

  // Match 2 Stats: 2-2 draw
  const statsMatch2 = [
    { playerId: players[3].id, matchId: match2.id, goals: 1, assists: 0, yellowCards: 1, redCards: 0 }, // Lucas 1 goal
    { playerId: players[4].id, matchId: match2.id, goals: 1, assists: 0, yellowCards: 0, redCards: 0 }, // Gabriel 1 goal
    { playerId: players[2].id, matchId: match2.id, goals: 0, assists: 1, yellowCards: 0, redCards: 0 }, // Thiago 1 assist
    { playerId: players[1].id, matchId: match2.id, goals: 0, assists: 1, yellowCards: 0, redCards: 1 }, // Bruno 1 assist 1 red card
    { playerId: players[0].id, matchId: match2.id, goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
  ];

  for (const stat of [...statsMatch1, ...statsMatch2]) {
    await prisma.matchStats.create({ data: stat });
  }
  console.log("✅ Estatísticas individuais inseridas");

  // 10. Financial Transactions (mensalidades, taxas, aluguel, arbitragem)
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
      description: "Cota de campo recolhida vs Estrela Vermelha FC",
      category: "FRIENDLY_FEE" as const,
      date: new Date(now.getFullYear(), now.getMonth() - 1, 15),
    },
    {
      type: "EXPENSE" as const,
      amount: 120.0,
      description: "Aluguel de quadra society - Parque Municipal",
      category: "VENUE_RENTAL" as const,
      date: new Date(now.getFullYear(), now.getMonth() - 1, 15),
    },
    {
      type: "EXPENSE" as const,
      amount: 80.0,
      description: "Pagamento arbitragem - Amistoso vs Estrela Vermelha",
      category: "REFEREE" as const,
      date: new Date(now.getFullYear(), now.getMonth() - 1, 15),
    },
    {
      type: "EXPENSE" as const,
      amount: 150.0,
      description: "Compra de bola oficial society Rainha",
      category: "EQUIPMENT" as const,
      date: new Date(now.getFullYear(), now.getMonth() - 1, 20),
    },
  ];

  for (const tx of transactionsData) {
    await prisma.transaction.create({
      data: { ...tx, teamId: team.id },
    });
  }
  console.log("✅ Lançamentos na caixinha financeira criados");

  // 11. Friendly Match Challenge Request
  await prisma.friendlyRequest.create({
    data: {
      requesterTeamName: "Dragões do Subúrbio FC",
      contactEmail: "dragoes.suburbio@email.com",
      contactPhone: "(11) 99999-7777",
      suggestedDates: "Domingo de manhã ou sábado à tarde",
      suggestedVenue: "Arena Dragões (nosso campo) ou dividimos o Parque Municipal",
      proposedFee: 150.0,
      status: "PENDING",
      teamId: team.id,
    },
  });
  console.log("✅ Solicitação pendente de amistoso criada");

  console.log("\n🎉 Seed reestruturado com sucesso!");
  console.log("   Time Principal: FC Trovão Azul");
  console.log("   Email Admin: admin@sitetime.com.br");
  console.log("   Senha: Admin@123");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao rodar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
