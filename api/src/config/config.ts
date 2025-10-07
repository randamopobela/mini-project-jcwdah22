import { config } from "dotenv";
import { resolve } from "path";
import { PrismaClient } from "@prisma/client";

export const NODE_ENV = process.env.NODE_ENV || "development";
const envFile = NODE_ENV === "development" ? "../.env.local" : ".env";

config({ path: resolve(__dirname, `../${envFile}`), override: true });

export const PORT = process.env.PORT || 8000;

export const prisma = new PrismaClient();

export const jwt_secret = process.env.JWT_SECRET || "";

export const jwt_reset_secret = process.env.JWT_RESET_SECRET || "";

export const nodemailer_account = {
    user: process.env.NODEMAILER_USER || "",
    pass: process.env.NODEMAILER_PASS || "",
};
