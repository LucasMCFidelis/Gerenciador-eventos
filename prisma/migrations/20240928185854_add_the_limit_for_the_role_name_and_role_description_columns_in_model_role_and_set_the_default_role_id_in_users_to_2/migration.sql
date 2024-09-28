/*
  Warnings:

  - You are about to alter the column `roleName` on the `roles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `roleDescription` on the `roles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(80)`.

*/
-- AlterTable
ALTER TABLE "roles" ALTER COLUMN "roleName" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "roleDescription" SET DATA TYPE VARCHAR(80);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "roleId" SET DEFAULT 2;
