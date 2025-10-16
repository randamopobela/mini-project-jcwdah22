// src/controllers/events.controller.ts
// TIDAK PERLU ADA PERUBAHAN DI SINI

import { NextFunction, Request, Response } from "express";
import eventsService from "../services/events.service";
import { ErrorHandler } from "../helpers/response.handler";

class EventsController {
  async getAllPublicEvents(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { page = 1, limit = 10 } = req.query;
      const pageNum = Number(page);
      const limitNum = Number(limit);

      const { events, totalEvents } = await eventsService.findAllPublic({
        ...req.query,
        page: pageNum,
        limit: limitNum,
      });

      res.status(200).json({
        message: "Berhasil mengambil daftar event.",
        data: events,
        meta: {
          total: totalEvents,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(totalEvents / limitNum),
        },
      });
    } catch (error: any) {
      next(
        new ErrorHandler(`Gagal mengambil daftar event: ${error.message}`, 500)
      );
    }
  }

  async getPublicEventById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const event = await eventsService.findPublicById(Number(id));

      if (!event) {
        return next(new ErrorHandler("Event tidak ditemukan.", 404));
      }

      res.status(200).json({
        message: "Berhasil mengambil detail event.",
        data: event,
      });
    } catch (error: any) {
      next(
        new ErrorHandler(`Gagal mengambil detail event: ${error.message}`, 500)
      );
    }
  }

  async getAllCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const categories = await eventsService.findAllCategories();
      res.status(200).json({
        message: "Berhasil mengambil daftar kategori.",
        data: categories,
      });
    } catch (error: any) {
      next(new ErrorHandler(`Gagal mengambil kategori: ${error.message}`, 500));
    }
  }

  async getUniqueLocations(req: Request, res: Response, next: NextFunction) {
    try {
      const locationNames = await eventsService.findUniqueLocations();
      res.status(200).json({ data: locationNames });
    } catch (error: any) {
      next(new ErrorHandler(`Gagal mengambil lokasi: ${error.message}`, 500));
    }
  }
}

export default new EventsController();
