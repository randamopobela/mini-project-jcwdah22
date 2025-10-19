import { NextFunction, Request, Response } from "express";
import { responseHandler } from "../helpers/response.handler";
import userService from "../services/user.service";

class UserController {
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await userService.update(req);
            responseHandler(res, "Edit profile success.", data);
        } catch (error) {
            next(error);
        }
    }

    async changeProfilePicture(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await userService.changeProfilePicture(req, next);
            responseHandler(res, "Profile picture updated successfully.", data);
        } catch (error) {
            next(error);
        }
    }

    async deactivate(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await userService.deactivate(req);
            responseHandler(res, "Deactivate account success.", data);
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();
