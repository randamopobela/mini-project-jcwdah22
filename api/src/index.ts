import express, { Application, NextFunction, Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";

const app: Application = express();
const PORT = 8000;

// const prima = new PrismaClient();

app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
