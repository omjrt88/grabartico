-- AlterTable
ALTER TABLE "pedidos" ADD COLUMN "token_acceso" TEXT;

-- Backfill existing rows with a random token
UPDATE "pedidos" SET "token_acceso" = md5(random()::text || clock_timestamp()::text) || md5(random()::text || id) WHERE "token_acceso" IS NULL;

-- Enforce NOT NULL now that every row has a value
ALTER TABLE "pedidos" ALTER COLUMN "token_acceso" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "pedidos_token_acceso_key" ON "pedidos"("token_acceso");
