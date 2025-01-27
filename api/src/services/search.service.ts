import { NextFunction, Request, Response } from "express";
import { prisma } from "../config";

class searchService {
    async searchData(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, firstName, lastName } = req.body;

            return await prisma.user.findMany({
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    profilePicture: true,
                    role: true,
                    referralCode: true,
                    referredBy: true,
                    points: true,
                    pointsExpiration: true,
                    isActive: true,
                },
                // where: {
                //     OR: [
                //         { email: { contains: email } },
                //         { firstName: { contains: firstName } },
                //         { lastName: { contains: lastName } },
                //     ],
                // },
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new searchService();
