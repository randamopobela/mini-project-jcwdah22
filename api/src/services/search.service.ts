import { NextFunction, Request, Response } from "express";
import { prisma } from "../config";

class searchService {
    async user(req: Request, res: Response, next: NextFunction) {
        try {
            // const { email, firstName, lastName } = req.body;

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
            });
        } catch (error) {
            next(error);
        }
    }
    async event(req: Request, res: Response, next: NextFunction) {
        try {
            return await prisma.event.findMany({
                select: {
                    id: true,
                    title: true,
                    description: true,
                    category: true,
                    eventPicture: true,
                    location: true,
                    startDate: true,
                    endDate: true,
                    price: true,
                    availableSeats: true,
                    totalSeats: true,
                    organizer: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new searchService();
