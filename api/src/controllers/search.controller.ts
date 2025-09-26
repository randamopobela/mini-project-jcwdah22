import { NextFunction, Request, Response } from "express";
import { responseHandler } from "../helpers/response.handler";
import searchService from "../services/search.service";

class SearchController {
    async user(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await searchService.user(req, res, next);
            responseHandler(res, "Searching success", data);
        } catch (error) {
            next(error);
        }
    }

    async event(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await searchService.event(req, res, next);
            responseHandler(res, "Searching success", data);
        } catch (error) {
            next(error);
        }
    }
}

export default new SearchController();
