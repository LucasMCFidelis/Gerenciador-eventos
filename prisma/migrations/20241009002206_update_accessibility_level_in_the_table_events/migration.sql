-- CreateEnum
CREATE TYPE "AccessibilityLevel" AS ENUM ('Sem Acessibilidade', 'Acessibilidade Básica', 'Acessibilidade Auditiva', 'Acessibilidade Visual', 'Acessibilidade Completa', 'Acessibilidade não informada');

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "accessibilityLevel" "AccessibilityLevel" NOT NULL DEFAULT 'Acessibilidade não informada';
