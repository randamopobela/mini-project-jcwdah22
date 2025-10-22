import { Router } from "express";
import eventController from "../controllers/event.controller";

export const eventCreationRouter = () => {
    const router = Router();

    router.post("/new", eventController.new);

    return router;
};
