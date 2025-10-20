import { Router } from "express";
import eventController from "../controllers/event.controller";

export const eventRouter = () => {
    const router = Router();

    router.post("/new", eventController.new);
    // router.post("/login", authController.login);
    // router.post("/logout", authController.logout);

    return router;
};
