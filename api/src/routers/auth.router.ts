import { Router } from "express";
import authController from "../controllers/auth.controller";

export const authRouter = () => {
    const router = Router();

    router.post("/register", authController.register);
    router.post("/login", authController.login);
    // router.post("/logout", authController.logout);
    // router.post("/forgot-password", authController.forgotPassword);

    return router;
};
