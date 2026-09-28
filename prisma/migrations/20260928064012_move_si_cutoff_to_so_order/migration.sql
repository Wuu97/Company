/*
  Warnings:

  - You are about to drop the column `siCutoffText` on the `Sailing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sailing" DROP COLUMN "siCutoffText";

-- AlterTable
ALTER TABLE "SoOrder" ADD COLUMN     "siCutoffText" TEXT;
