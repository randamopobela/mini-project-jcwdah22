import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { jwt_secret, prisma } from "../config";
import { compare } from "bcrypt";
import { ErrorHandler } from "../helpers/response.handler";
import { getUserByEmail } from "../helpers/user.prisma";
import { UserLogin } from "../interfaces/user.interface";
import { sign } from "jsonwebtoken";
import { hashedPassword } from "../helpers/bcrypt";
import { generateReferralCode } from "../helpers/generate.referral";
import { generateIdUser } from "../helpers/generate.id.table";

class authService {
    async login(req: Request) {
        const { email, password } = req.body;

        const user = (await getUserByEmail(email)) as UserLogin;
        if (!user) {
            throw new ErrorHandler("Email is incorrect", 401);
        } else if (user.isActive === false) {
            throw new ErrorHandler("User is not active", 401);
        } else if (!(await compare(password, user.password as string))) {
            throw new ErrorHandler("Password is incorrect", 401);
        }

        delete user.password;
        const token = sign(user, jwt_secret, {
            expiresIn: "5m",
        });

        return { token };
    }
    async register(req: Request, next: NextFunction) {
        try {
            const {
                email,
                password,
                firstName,
                lastName,
                profilePicture,
                role,
                referredBy,
                // points,
                // pointsExpiration,
            } = req.body;

            const newUser = await prisma.user.create({
                data: {
                    id: await generateIdUser(),
                    email,
                    password: await hashedPassword(password),
                    firstName,
                    lastName,
                    profilePicture: profilePicture ?? null,
                    role,
                    referralCode: generateReferralCode(),
                    referredBy: referredBy ?? null,
                    // points: points ?? 0,
                    // pointsExpiration: pointsExpiration ?? null,
                },
            });

            if (referredBy) {
                const referrer = await prisma.user.findUnique({
                    where: { referralCode: referredBy },
                });

                // Menambahkan data referral ke tabel Referral
                if (referrer) {
                    const referrerPoints = 10; // Jumlah poin untuk referrer
                    const referredPoints = referrerPoints * 5; // Jumlah poin untuk referensi

                    await prisma.referral.create({
                        data: {
                            referrerId: referrer.id,
                            referredId: newUser.id,
                            referrerPoint: referrerPoints, // Jumlah poin untuk referensi
                            referredPoint: referredPoints, // Jumlah poin untuk referensi
                        },
                    });

                    // Update point untuk kedua referrer dan referred
                    // Tambahkan poin untuk referrer
                    await prisma.user.update({
                        where: { id: referrer.id },
                        data: {
                            points: { increment: referrerPoints },
                            pointsExpiration: {
                                set: new Date(
                                    new Date().setDate(
                                        new Date().getDate() + 30 // Masa berlaku poin selama 30 hari
                                    )
                                ),
                            },
                        },
                    });

                    // Tambahkan poin untuk user baru
                    await prisma.user.update({
                        where: { id: newUser.id },
                        data: {
                            points: { increment: referredPoints },
                            pointsExpiration: {
                                set: new Date(
                                    new Date().setDate(
                                        new Date().getDate() + 30 // Masa berlaku poin selama 30 hari
                                    )
                                ),
                            },
                        },
                    });

                    // Log points activity for both users
                    await prisma.pointsLog.createMany({
                        data: [
                            {
                                userId: referrer.id,
                                description: "REFERRAL_BONUS",
                                points: referrerPoints,
                            },
                            {
                                userId: newUser.id,
                                description: "WELCOME_BONUS",
                                points: referredPoints,
                            },
                        ],
                    });
                }
            }
        } catch (error) {
            next(error);
        }
    }

    async logout(req: Request) {}
}

export default new authService();
