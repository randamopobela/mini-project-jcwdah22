import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../helpers/response.handler";
import { prisma } from "../config/config";

class eventService {
    async new(req: Request, _res: Response, next: NextFunction) {
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
                totalSlots,
                organizerId,
            } = req.body;

            if (!organizerId) {
                throw new ErrorHandler("Organizer ID is required", 400);
            }

            const event = await prisma.event.create({
                data: {
                    title,
                    description,
                    category,
                    eventPicture: eventPicture ?? null,
                    location,
                    startDate: new Date(startDate),
                    endDate: endDate ? new Date(endDate) : new Date(startDate),
                    price,
                    availableSlots: totalSlots,
                    totalSlots,
                    organizer: {
                        connect: {
                            id: organizerId,
                        },
                    },
                },
            });

            return event;
        } catch (error) {
            next(error);
        }
    }
}

export default new eventService();
