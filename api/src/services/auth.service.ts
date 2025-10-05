import { NextFunction, Request, Response } from "express";
import { PointsLogType, Prisma } from "@prisma/client";
import { jwt_secret, prisma } from "../config/config";
import { compare } from "bcrypt";
import { ErrorHandler } from "../helpers/response.handler";
import { getNewUserName, getUserByEmail } from "../helpers/user.prisma";
import { UserLogin } from "../interfaces/user.interface";
import { sign } from "jsonwebtoken";
import { hashedPassword } from "../helpers/bcrypt";
import { generateReferralCode } from "../helpers/generate.referral";
import { generateIdUser } from "../helpers/generate.id";

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
                userName,
                profilePicture,
                role,
                phone,
                address,
                referredBy,
            } = req.body;

            const newUser = await prisma.user.create({
                data: {
                    id: await generateIdUser(),
                    email,
                    password: await hashedPassword(password),
                    firstName,
                    lastName: lastName ?? null,
                    userName: await getNewUserName(firstName, userName ?? null),
                    profilePicture: profilePicture ?? null,
                    role,
                    phone: phone ?? null,
                    address: address ?? null,
                    referralCode: generateReferralCode(),
                },
            });

            if (referredBy) {
                const referrer = await prisma.user.findUnique({
                    where: { referralCode: referredBy },
                });

                if (!referrer) {
                    throw new ErrorHandler("Invalid referral code", 400);
                }

                // Update point untuk referrer atau pemberi kode referral
                await prisma.pointsLog.create({
                    data: {
                        user: { connect: { id: referrer.id } },
                        type: PointsLogType.REFERRAL_BONUS,
                        description: `Referral bonus from ${newUser.userName}`,
                        points: 10000,
                        // expiredAt: new Date(
                        //     new Date().setMonth(
                        //             new Date().getMonth() + 3 // Masa berlaku kupon selama 3 bulan
                        //         )
                        // )
                    },
                });

                // Membuat kupon untuk user baru
                await prisma.coupon.create({
                    data: {
                        title: "Referral Bonus Coupon",
                        description: `Welcoming coupon special for ${newUser.userName}`,
                        couponCode: `REF-${newUser.userName.toUpperCase()}`,
                        discountAmount: 10,
                        expiredAt: new Date(
                            new Date().setMonth(
                                new Date().getMonth() + 3 // Masa berlaku kupon selama 3 bulan
                            )
                        ),
                        user: { connect: { id: newUser.id } },
                    },
                });

                // Update data referral
                await prisma.referral.create({
                    data: {
                        referrer: { connect: { id: referrer.id } },
                        referred: { connect: { id: newUser.id } },
                    },
                });
            }
        } catch (error) {
            next(error);
        }
    }

    // async logout(req: Request) {}

    // async forgotPassword(req: Request) {}
}

export default new authService();
