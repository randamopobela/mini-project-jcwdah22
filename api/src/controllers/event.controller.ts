import { NextFunction, Request, Response } from "express";
import { responseHandler } from "../helpers/response.handler";
import eventService from "../services/event.service";

class EventController {
    async new(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await eventService.new(req, res, next);
            responseHandler(res, "New event successfully added", data);
        } catch (error) {
            next(error);
        }
    }
}

export default new EventController();
