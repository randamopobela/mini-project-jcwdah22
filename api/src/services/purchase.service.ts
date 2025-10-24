import { Request, Response } from "express";
import { prisma } from "../config/config";
import { responseHandler } from "../helpers/response.handler";
import type { Prisma } from "../generated/prisma";

class PurchaseService {
    async create(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId)
                return responseHandler(res, "User tidak valid", null, 401);

            const data = await prisma.transaction.create({
                data: {
                    userId: userId,
                    eventId: req.body.eventId,
                    ticketQuantity: req.body.ticketQuantity,
                    totalPrice: req.body.totalPrice,
                    discountPoints: req.body.discountPoints,
                    discountVouchers: req.body.discountVouchers,
                    discountCoupons: req.body.discountCoupons,
                    finalPrice: req.body.finalPrice,
                    status: req.body.status,
                    paymentProof: req.body.paymentProof,
                    paymentMethod: req.body.paymentMethod,
                    expiredAt: req.body.expiredAt,
                },
            });

            return responseHandler(res, "Transaksi berhasil dibuat", data, 201);
        } catch (error: any) {
            return responseHandler(res, error.message, null, 400);
        }
    }
    async findByUser(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId)
                return responseHandler(res, "User tidak valid", null, 401);

            const transactions = await prisma.transaction.findMany({
                where: { userId },
                include: {
                    event: true, // ambil data event agar bisa diakses di frontend
                },
                orderBy: { createdAt: "desc" },
            });

            type TransactionWithEvent = Prisma.TransactionGetPayload<{
                include: { event: true };
            }>;

            const formatted = transactions.map((transaction: TransactionWithEvent) => ({
                id: transaction.id,
                userId: transaction.userId,
                eventId: transaction.eventId,
                event: transaction.event,
                ticketQuantity: transaction.ticketQuantity,
                totalPrice: transaction.totalPrice,
                discountPoints: transaction.discountPoints,
                discountVouchers: transaction.discountVouchers,
                discountCoupons: transaction.discountCoupons,
                finalPrice: transaction.finalPrice,
                status: transaction.status,
                paymentProof: transaction.paymentProof,
                paymentMethod: transaction.paymentMethod,
                expiredAt: transaction.expiredAt,
                createdAt: transaction.createdAt,
                updatedAt: transaction.updatedAt,
            }));

            return responseHandler(
                res,
                "Daftar transaksi berhasil diambil",
                formatted,
                200
            );
        } catch (error: any) {
            return responseHandler(
                res,
                "Gagal mengambil daftar transaksi",
                error.message,
                500
            );
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            const { id } = req.params;

            const trx = await prisma.transaction.findFirst({
                where: { id: Number(id), userId },
                include: { event: true },
            });

            if (!trx)
                return responseHandler(
                    res,
                    "Transaksi tidak ditemukan",
                    null,
                    404
                );

            const formatted = {
                id: trx.id,
                userId: trx.userId,
                eventId: trx.eventId,
                event: trx.event,
                ticketQuantity: trx.ticketQuantity,
                totalPrice: trx.totalPrice,
                discountPoints: trx.discountPoints,
                discountVouchers: trx.discountVouchers,
                discountCoupons: trx.discountCoupons,
                finalPrice: trx.finalPrice,
                status: trx.status,
                paymentProof: trx.paymentProof,
                paymentMethod: trx.paymentMethod,
                expiredAt: trx.expiredAt,
                createdAt: trx.createdAt,
                updatedAt: trx.updatedAt,
            };

            return responseHandler(
                res,
                "Detail transaksi berhasil diambil",
                formatted,
                200
            );
        } catch (error: any) {
            return responseHandler(
                res,
                "Gagal mengambil detail transaksi",
                error.message,
                500
            );
        }
    }

    async uploadProof(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = (req as any).user?.id;
            const file = req.file?.filename;

            if (!file)
                return responseHandler(res, "File tidak ditemukan", null, 400);

            const trx = await prisma.transaction.findFirst({
                where: { id: Number(id), userId },
            });

            if (!trx)
                return responseHandler(
                    res,
                    "Transaksi tidak ditemukan",
                    null,
                    404
                );

            const updated = await prisma.transaction.update({
                where: { id: Number(id) },
                data: {
                    paymentProof: `/PROOF/${file}`,
                    status: "PENDING_CONFIRMATION",
                    updatedAt: new Date(),
                },
            });

            return responseHandler(
                res,
                "Bukti pembayaran berhasil diunggah",
                updated,
                200
            );
        } catch (error: any) {
            return responseHandler(res, error.message, null, 500);
        }
    }
}

export default new PurchaseService();
