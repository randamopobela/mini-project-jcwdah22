import { Router } from "express";
import searchController from "../controllers/search.controller";

export const searchRouter = () => {
    const router = Router();

    router.get("/users", searchController.user);
    router.get("/events", searchController.event);

    return router;
};
