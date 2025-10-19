/*
  Warnings:

  - The values [ADJUSTMENT] on the enum `PointsLogType` will be removed. If these variants are still used in the database, this will fail.
  - The values [DONE] on the enum `TransactionStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `categoryId` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `read` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `referred_point` on the `referrals` table. All the data in the column will be lost.
  - You are about to drop the column `referrer_point` on the `referrals` table. All the data in the column will be lost.
  - You are about to drop the column `points` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `points_expiration` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `referred_by` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `coupon_assignments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `coupons` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `event_categories` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[bib_number]` on the table `tickets` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_name]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `final_price` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Made the column `expired_at` on table `transactions` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `user_name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maximal_discount` to the `vouchers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minimal_purchase` to the `vouchers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('FUN_RUN', 'FIVE_K', 'TEN_K', 'HALF_MARATHON', 'MARATHON', 'ULTRA_MARATHON', 'TRAIL_RUN', 'VIRTUAL_RUN');

-- CreateEnum
CREATE TYPE "VoucherStatus" AS ENUM ('ISSUED', 'CANCELED');

-- AlterEnum
BEGIN;
CREATE TYPE "PointsLogType_new" AS ENUM ('REFERRAL_BONUS', 'PURCHASE', 'PROMOTION', 'REDEMPTION', 'REFUND');
ALTER TABLE "points_log" ALTER COLUMN "type" TYPE "PointsLogType_new" USING ("type"::text::"PointsLogType_new");
ALTER TYPE "PointsLogType" RENAME TO "PointsLogType_old";
ALTER TYPE "PointsLogType_new" RENAME TO "PointsLogType";
DROP TYPE "PointsLogType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TransactionStatus_new" AS ENUM ('AWAITING_PAYMENT', 'PENDING_CONFIRMATION', 'PAID', 'REJECTED', 'EXPIRED', 'CANCELED');
ALTER TABLE "transactions" ALTER COLUMN "status" TYPE "TransactionStatus_new" USING ("status"::text::"TransactionStatus_new");
ALTER TYPE "TransactionStatus" RENAME TO "TransactionStatus_old";
ALTER TYPE "TransactionStatus_new" RENAME TO "TransactionStatus";
DROP TYPE "TransactionStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "coupon_assignments" DROP CONSTRAINT "coupon_assignments_coupon_id_fkey";

-- DropForeignKey
ALTER TABLE "coupon_assignments" DROP CONSTRAINT "coupon_assignments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_categoryId_fkey";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "categoryId",
ADD COLUMN     "category" "EventCategory" NOT NULL;

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "read",
ADD COLUMN     "is_read" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "referrals" DROP COLUMN "referred_point",
DROP COLUMN "referrer_point";

-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "bib_number" TEXT;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "discount_coupons" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "discount_points" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "discount_vouchers" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "final_price" INTEGER NOT NULL,
ALTER COLUMN "expired_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "points",
DROP COLUMN "points_expiration",
DROP COLUMN "referred_by",
ADD COLUMN     "user_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "vouchers" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maximal_discount" INTEGER NOT NULL,
ADD COLUMN     "minimal_purchase" INTEGER NOT NULL;

-- DropTable
DROP TABLE "coupon_assignments";

-- DropTable
DROP TABLE "coupons";

-- DropTable
DROP TABLE "event_categories";

-- CreateTable
CREATE TABLE "voucher_assignments" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "voucher_id" INTEGER NOT NULL,
    "transaction_id" INTEGER NOT NULL,
    "status" "VoucherStatus" NOT NULL DEFAULT 'ISSUED',
    "used_at" TIMESTAMP(3),

    CONSTRAINT "voucher_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coupon" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "coupon_code" TEXT NOT NULL,
    "discount_amount" INTEGER NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "transaction_id" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_coupon_code_key" ON "Coupon"("coupon_code");

-- CreateIndex
CREATE UNIQUE INDEX "tickets_bib_number_key" ON "tickets"("bib_number");

-- CreateIndex
CREATE UNIQUE INDEX "users_user_name_key" ON "users"("user_name");

-- AddForeignKey
ALTER TABLE "voucher_assignments" ADD CONSTRAINT "voucher_assignments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voucher_assignments" ADD CONSTRAINT "voucher_assignments_voucher_id_fkey" FOREIGN KEY ("voucher_id") REFERENCES "vouchers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voucher_assignments" ADD CONSTRAINT "voucher_assignments_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
