import express, { Application, NextFunction, Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";

const app: Application = express();
const PORT = 8000;

// const prima = new PrismaClient();

app.use(express.json());
// class ErrorHandler extends Error {
//     code: number;
//     constructor(message: string, code?: number) {
//         super(message);
//         this.code = code || 500;
//     }
// }

app.get("/", async (req: Request, res: Response) => {
    res.send("Hello World!");
});

// app.get(
//     "/branches",
//     async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             const where: Prisma.BranchWhereInput = {};
//             const { name, address, page, limit } = req.query;
//             const take = Number(limit);
//             const skip = (Number(page) - 1) * take;
//             const config: { take?: number; skip?: number } = {};
//             if (page != undefined) {
//                 config.take = take;
//                 config.skip = skip;
//             }
//             if (name)
//                 where.name = {
//                     contains: name as string,
//                 };
//             if (address)
//                 where.address = {
//                     contains: address as string,
//                 };
//             const data = await prisma.branch.findMany({
//                 select: {
//                     id: true,
//                     name: true,
//                     address: true,
//                 },
//                 where,
//                 ...config,
//             });

//             res.send({
//                 message: "fetch branches",
//                 data,
//             });
//         } catch (error) {
//             next(error);
//         }
//     }
// );

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
