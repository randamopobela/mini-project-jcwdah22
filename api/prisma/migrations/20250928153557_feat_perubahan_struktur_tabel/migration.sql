/*
  Warnings:

  - The values [PENDING_PAYMENT] on the enum `TransactionStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `user_id` on the `coupons` table. All the data in the column will be lost.
  - You are about to drop the column `available_seats` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `total_seats` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `pointsBalance` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[coupon_code]` on the table `coupons` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `coupon_code` to the `coupons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `coupons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maximal_discount` to the `coupons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minimal_purchase` to the `coupons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `coupons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `coupons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valid_from` to the `coupons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `available_slots` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_slots` to the `events` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `notifications` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `type` to the `points_log` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PointsLogType" AS ENUM ('REFERRAL_BONUS', 'PURCHASE', 'REDEMPTION', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('TRANSACTION', 'EVENT_UPDATE', 'REMINDER', 'SYSTEM');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EventStatus" ADD VALUE 'ONGOING';
ALTER TYPE "EventStatus" ADD VALUE 'COMPLETED';

-- AlterEnum
BEGIN;
CREATE TYPE "TransactionStatus_new" AS ENUM ('AWAITING_PAYMENT', 'PENDING_CONFIRMATION', 'DONE', 'REJECTED', 'EXPIRED', 'CANCELED');
ALTER TABLE "transactions" ALTER COLUMN "status" TYPE "TransactionStatus_new" USING ("status"::text::"TransactionStatus_new");
ALTER TYPE "TransactionStatus" RENAME TO "TransactionStatus_old";
ALTER TYPE "TransactionStatus_new" RENAME TO "TransactionStatus";
DROP TYPE "TransactionStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "coupons" DROP CONSTRAINT "coupons_user_id_fkey";

-- DropIndex
DROP INDEX "users_id_key";

-- AlterTable
ALTER TABLE "coupons" DROP COLUMN "user_id",
ADD COLUMN     "coupon_code" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "maximal_discount" INTEGER NOT NULL,
ADD COLUMN     "minimal_purchase" INTEGER NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "valid_from" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "events" DROP COLUMN "available_seats",
DROP COLUMN "category",
DROP COLUMN "total_seats",
ADD COLUMN     "available_slots" INTEGER NOT NULL,
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD COLUMN     "isFree" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "total_slots" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "type",
ADD COLUMN     "type" "NotificationType" NOT NULL;

-- AlterTable
ALTER TABLE "points_log" ADD COLUMN     "type" "PointsLogType" NOT NULL;

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "title" TEXT;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "expired_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" DROP COLUMN "pointsBalance",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "vouchers" ADD COLUMN     "isEarlyBird" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "EventCategory";

-- CreateTable
CREATE TABLE "event_categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupon_assignments" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "coupon_id" INTEGER NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "coupon_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "badges" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_badges" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "event_id" INTEGER NOT NULL,
    "badge_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_badges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_categories_name_key" ON "event_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "badges_name_key" ON "badges"("name");

-- CreateIndex
CREATE UNIQUE INDEX "coupons_coupon_code_key" ON "coupons"("coupon_code");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "event_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon_assignments" ADD CONSTRAINT "coupon_assignments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon_assignments" ADD CONSTRAINT "coupon_assignments_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "coupons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_badge_id_fkey" FOREIGN KEY ("badge_id") REFERENCES "badges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
