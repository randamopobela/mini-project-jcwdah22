import { Request, Response, NextFunction } from "express";
import purchaseService from "../services/purchase.service";

class PurchaseController {
    async findByUser(req: Request, res: Response, next: NextFunction) {
        try {
            await purchaseService.findByUser(req, res);
        } catch (error) {
            next(error);
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
