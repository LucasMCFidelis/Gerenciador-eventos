/*
  Warnings:

  - A unique constraint covering the columns `[userEmail]` on the table `recovery_codes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "recovery_codes_userEmail_key" ON "recovery_codes"("userEmail");
