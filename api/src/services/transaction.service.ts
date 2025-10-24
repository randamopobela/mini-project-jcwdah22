import { Request } from "express";
import { prisma } from "../config/config";
import { ErrorHandler } from "../helpers/response.handler";

class TransactionService {
    // Semua transaksi event milik organizer
    async findAllByOrganizer(req: Request) {
        const organizerId = (req as any).user?.id;

        if (!organizerId) throw new ErrorHandler("Unauthorized", 401);

        const transactions = await prisma.transaction.findMany({
            where: {
                event: { organizerId },
            },
            include: {
                event: {
                    select: {
                        id: true,
                        title: true,
                        category: true,
                        location: true,
                        startDate: true,
                        price: true,
                        eventPicture: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return transactions;
    }

    // Detail transaksi by ID
    async findById(req: Request) {
        const { id } = req.params;
        const organizerId = (req as any).user?.id;

        if (!organizerId) throw new ErrorHandler("Unauthorized", 401);

        const transaction = await prisma.transaction.findFirst({
            where: {
                id: Number(id),
                event: { organizerId },
            },
            include: {
                event: true,
                user: true,
            },
        });

        if (!transaction)
            throw new ErrorHandler("Transaksi tidak ditemukan", 404);

        return transaction;
    }

    // Update status transaksi (accept / reject)
    async updateStatus(req: Request) {
        const { id } = req.params;
        const { status } = req.body;
        const organizerId = (req as any).user?.id;

        if (!organizerId) throw new ErrorHandler("Unauthorized", 401);
        if (!["PAID", "REJECTED"].includes(status))
            throw new ErrorHandler("Status tidak valid", 400);

        // Cek apakah transaksi milik event organizer
        const trx = await prisma.transaction.findFirst({
            where: {
                id: Number(id),
                event: { organizerId },
            },
        });

        if (!trx)
            throw new ErrorHandler(
                "Transaksi tidak ditemukan atau bukan milik event Anda",
                404
            );

        const updated = await prisma.transaction.update({
            where: { id: Number(id) },
            data: {
                status,
                updatedAt: new Date(),
            },
            include: {
                event: true,
                user: true,
            },
        });

        return updated;
    }
}

export default new TransactionService();
