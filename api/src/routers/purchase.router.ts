import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import purchaseController from "../controllers/purchase.controller";
import { uploader } from "../middlewares/express/uploader";

export const purchaseRouter = () => {
    const router = Router();

    router.use(verifyToken);

    router.get("/", purchaseController.findByUser);

    router.get("/:id", purchaseController.findById);

    router.patch(
        "/:id/upload-proof",
        uploader("PROOF", "/payments").single("paymentProof"),
        purchaseController.uploadProof
    );

    return router;
};
