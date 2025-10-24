import { Router } from "express";
import { organizerGuard, verifyToken } from "../middlewares/auth.middleware";
import transactionController from "../controllers/transaction.controller";

export const transactionRouter = () => {
    const router = Router();

    router.use(verifyToken);
    router.use(organizerGuard);

    router.get("/", transactionController.findAllByOrganizer);
    router.get("/:id", transactionController.findById);
    router.patch("/:id/status", transactionController.updateStatus);

    return router;
};
