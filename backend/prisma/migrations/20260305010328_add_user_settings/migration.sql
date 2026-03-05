/*
  Warnings:

  - A unique constraint covering the columns `[customLink]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "altEmail" TEXT,
ADD COLUMN     "customLink" TEXT,
ADD COLUMN     "github" TEXT,
ADD COLUMN     "isWhatsApp" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "primaryEmailChoice" TEXT DEFAULT 'google',
ADD COLUMN     "profileVisibility" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "publicEmail" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showLocation" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showSocial" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "User_customLink_key" ON "User"("customLink");
