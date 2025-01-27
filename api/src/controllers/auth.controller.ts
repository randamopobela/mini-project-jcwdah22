import { NextFunction, Request, Response } from "express";
import { responseHandler } from "../helpers/response.handler";
import authService from "../services/auth.service";

class AuthController {
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await authService.login(req);
            responseHandler(res, "Login success", data);
        } catch (error) {
            next(error);
        }
    }

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await authService.register(req, next);
            responseHandler(res, "Registration success", data);
        } catch (error) {
            next(error);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {}
}

export default new AuthController();
