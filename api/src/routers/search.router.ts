import { Router } from "express";
import searchController from "../controllers/search.controller";

export const searchRouter = () => {
    const router = Router();

    router.get("/cari-data", searchController.searchData);
    // router.get("/hello-world", searchController.helloWorld);

    return router;
};
