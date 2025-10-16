import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import { PORT } from "./config/config";
import { ErrorHandler } from "./helpers/response.handler";
import { authRouter } from "./routers/auth.router";
import { searchRouter } from "./routers/search.router";
import { eventRouter } from "./routers/events.router";

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
    this.app.use("/api/search", searchRouter());
  }

  private configure() {
    this.app.use(express.json());
    this.app.use(cors());
  }

  private handleError() {
    //not found handler
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.status(404).send("Not found !");
    });

    //error handler
    this.app.use(
      (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
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
