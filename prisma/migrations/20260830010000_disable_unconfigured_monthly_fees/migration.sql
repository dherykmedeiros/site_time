-- Mensalidades são opt-in: times existentes não devem exibir cobranças pendentes
-- até que um administrador ative explicitamente o recurso.
ALTER TABLE "teams" ALTER COLUMN "monthlyFeesEnabled" SET DEFAULT false;

UPDATE "teams"
SET "monthlyFeesEnabled" = false;
