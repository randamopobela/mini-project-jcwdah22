import { Request, Response, NextFunction } from "express";
import transactionService from "../services/transaction.service";
import { responseHandler } from "../helpers/response.handler";

class TransactionController {
    // Get all transactions (by organizer)
    async findAllByOrganizer(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await transactionService.findAllByOrganizer(req);
            responseHandler(
                res,
                "Daftar transaksi berhasil diambil",
                data,
                200
            );
        } catch (error) {
            next(error);
        }
    }

    // Get single transaction by ID
    async findById(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await transactionService.findById(req);
            if (!data) {
                responseHandler(res, "Transaksi tidak ditemukan", null, 404);
            }
            responseHandler(
                res,
                "Detail transaksi berhasil diambil",
                data,
                200
            );
        } catch (error) {
            next(error);
        }
    }

    // Update transaction status (accept/reject)
    async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await transactionService.updateStatus(req);
            responseHandler(
                res,
                "Status transaksi berhasil diperbarui",
                data,
                200
            );
        } catch (error) {
            next(error);
        }
    }
}

export default new TransactionController();
