import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../helpers/response.handler";
import { prisma } from "../config";
import { log } from "console";

class eventService {
    async new(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                title,
                description,
                eventPicture,
                category,
                location,
                startDate,
                endDate,
                price,
                totalSeats,
                organizerId,
            } = req.body;

            const organizer = await prisma.user.findUnique({
                where: { id: organizerId },
            });

            if (organizer) {
                await prisma.event.create({
                    data: {
                        title,
                        description,
                        category,
                        eventPicture: eventPicture ?? null,
                        location,
                        startDate: new Date(startDate),
                        endDate: new Date(endDate) ?? startDate,
                        price,
                        availableSeats: totalSeats,
                        totalSeats,
                        organizerId,
                    },
                });
            }
        } catch (error) {
            next(error);
        }
    }
}

export default new eventService();
