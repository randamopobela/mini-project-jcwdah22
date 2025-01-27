import { NextFunction, Request, Response } from "express";
import { responseHandler } from "../helpers/response.handler";
import searchService from "../services/search.service";

class SearchController {
    async searchData(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await searchService.searchData(req, res, next);
            responseHandler(res, "Searching success", data);
        } catch (error) {
            next(error);
        }
    }

    // async helloWorld(req: Request, res: Response, next: NextFunction) {
    //     res.json({ message: "Hello World!" });
    // }
}

export default new SearchController();
