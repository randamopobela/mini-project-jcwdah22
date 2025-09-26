/*
  Warnings:

  - You are about to drop the `sql_transactions` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `category` on the `events` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Education', 'Entertainment', 'Social', 'Community', 'Sports', 'Health', 'Wedding', 'Family', 'Religious', 'Government', 'Public');

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "event_picture" TEXT,
DROP COLUMN "category",
ADD COLUMN     "category" "Category" NOT NULL;

-- DropTable
DROP TABLE "sql_transactions";
