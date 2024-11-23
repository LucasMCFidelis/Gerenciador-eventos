/*
  Warnings:

  - You are about to drop the column `complement` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `neighborhood` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `events` table. All the data in the column will be lost.
  - Added the required column `addressNeighborhood` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressNumber` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressStreet` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventCategoryId` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventOrganizerId` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events" DROP COLUMN "complement",
DROP COLUMN "neighborhood",
DROP COLUMN "number",
DROP COLUMN "street",
ADD COLUMN     "addressComplement" VARCHAR(30),
ADD COLUMN     "addressNeighborhood" VARCHAR(20) NOT NULL,
ADD COLUMN     "addressNumber" VARCHAR(8) NOT NULL,
ADD COLUMN     "addressStreet" VARCHAR(120) NOT NULL,
ADD COLUMN     "eventCategoryId" TEXT NOT NULL,
ADD COLUMN     "eventOrganizerId" TEXT NOT NULL,
ADD COLUMN     "price" DECIMAL(8,2) NOT NULL;

-- CreateTable
CREATE TABLE "event_organizers" (
    "organizerId" TEXT NOT NULL,
    "organizerName" VARCHAR(100) NOT NULL,
    "organizerCnpj" VARCHAR(18) NOT NULL,
    "organizerEmail" VARCHAR(100) NOT NULL,
    "organizerPhoneNumber" VARCHAR(15),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_organizers_pkey" PRIMARY KEY ("organizerId")
);

-- CreateTable
CREATE TABLE "event_categories" (
    "categoryId" TEXT NOT NULL,
    "categoryName" VARCHAR(30) NOT NULL,
    "categoryDescription" VARCHAR(300),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_categories_pkey" PRIMARY KEY ("categoryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_organizers_organizerEmail_key" ON "event_organizers"("organizerEmail");

-- CreateIndex
CREATE UNIQUE INDEX "event_categories_categoryName_key" ON "event_categories"("categoryName");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_eventOrganizerId_fkey" FOREIGN KEY ("eventOrganizerId") REFERENCES "event_organizers"("organizerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_eventCategoryId_fkey" FOREIGN KEY ("eventCategoryId") REFERENCES "event_categories"("categoryId") ON DELETE RESTRICT ON UPDATE CASCADE;
