import { Request, Response, NextFunction } from "express";
import purchaseService from "../services/purchase.service";
import { responseHandler } from "../helpers/response.handler";

class PurchaseController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await purchaseService.create(req, res);
            responseHandler(res, "Transaksi berhasil dibuat", data, 201);
        } catch (error) {
            next(error);
        }
    }
    async findByUser(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await purchaseService.findByUser(req);
            responseHandler(
                res,
                "Daftar transaksi berhasil diambil",
                data,
                200
            );
        } catch (error: any) {
            responseHandler(
                res,
                "Gagal mengambil daftar transaksi",
                error.message,
                500
            );
        }
    }

    async findById(req: Request, res: Response, next: NextFunction) {
        try {
            await purchaseService.findById(req, res);
        } catch (error) {
            next(error);
        }
    }

    async uploadProof(req: Request, res: Response, next: NextFunction) {
        try {
            await purchaseService.uploadProof(req, res);
        } catch (error) {
            next(error);
        }
    }
}

export default new PurchaseController();
