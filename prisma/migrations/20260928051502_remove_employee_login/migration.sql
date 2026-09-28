/*
  Warnings:

  - You are about to drop the column `userId` on the `OperationLog` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OperationLog" DROP CONSTRAINT "OperationLog_userId_fkey";

-- AlterTable
ALTER TABLE "OperationLog" DROP COLUMN "userId";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "Role";
