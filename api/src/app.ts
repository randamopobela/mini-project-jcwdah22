import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import { PORT } from "./config/config";
import { ErrorHandler } from "./helpers/response.handler";
import { authRouter } from "./routers/auth.router";
import { eventRouter } from "./routers/events.router";
import { myeventRouter } from "./routers/myEvent.route";
import { userRouter } from "./routers/user.router";

export class App {
    private app: Application;

    constructor() {
        this.app = express();
        this.configure();
        this.routes();
        this.handleError();
    }

    private routes() {
        this.app.use("/api/auth", authRouter());
        this.app.use("/api/events", eventRouter());
        this.app.use("/api/myevent", myeventRouter());
        this.app.use("/api/user", userRouter());
    }

    private configure() {
        this.app.use(express.json());
        this.app.use(cors());
        this.app.use(
            "/images",
            express.static(path.join(__dirname, "../public/images"))
        );
    }

    private handleError() {
        //not found handler
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            res.status(404).send("Not found !");
        });

        //error handler
        this.app.use(
            (
                err: ErrorHandler,
                req: Request,
                res: Response,
                next: NextFunction
            ) => {
                res.status(err.code || 500).send({
                    message: err.message,
                });
            }
        );
    }

    start() {
        this.app.listen(PORT, () => {
            console.log(`Mini Project is running on port ${PORT}`);
        });
    }
}
