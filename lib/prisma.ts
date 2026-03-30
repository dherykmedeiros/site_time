import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const rawUrl = process.env.DATABASE_URL!;
  // Remove sslmode da URL para evitar o aviso de depreciação do pg;
  // SSL é gerenciado explicitamente via { ssl: { rejectUnauthorized: true } }
  const connectionString = rawUrl.replace(/[&?]sslmode=[^&]*/g, "");
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: true },
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
