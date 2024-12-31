/*
  Warnings:

  - You are about to drop the column `platform` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `private_key` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `public_key` on the `Account` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[eth_private_key]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[eth_public_key]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sol_private_key]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sol_public_key]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `eth_private_key` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eth_public_key` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sol_private_key` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sol_public_key` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Account_private_key_key";

-- DropIndex
DROP INDEX "Account_public_key_key";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "platform",
DROP COLUMN "private_key",
DROP COLUMN "public_key",
ADD COLUMN     "eth_private_key" TEXT NOT NULL,
ADD COLUMN     "eth_public_key" TEXT NOT NULL,
ADD COLUMN     "sol_private_key" TEXT NOT NULL,
ADD COLUMN     "sol_public_key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Account_eth_private_key_key" ON "Account"("eth_private_key");

-- CreateIndex
CREATE UNIQUE INDEX "Account_eth_public_key_key" ON "Account"("eth_public_key");

-- CreateIndex
CREATE UNIQUE INDEX "Account_sol_private_key_key" ON "Account"("sol_private_key");

-- CreateIndex
CREATE UNIQUE INDEX "Account_sol_public_key_key" ON "Account"("sol_public_key");
