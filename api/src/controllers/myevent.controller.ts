// src/controllers/myEvents.controller.ts

import { NextFunction, Request, Response } from "express";
import { EventCategory, EventStatus } from "../generated/prisma";
import { ErrorHandler } from "../helpers/response.handler";
import myEventService from "../services/myEvent.service";

class MyEventsController {
    async createEvent(req: Request, res: Response, next: NextFunction) {
        try {
            // 1. Validasi Autentikasi & File
            if (!req.user?.id)
                return next(
                    new ErrorHandler("User tidak terautentikasi.", 401)
                );

            if (!req.file)
                return next(
                    new ErrorHandler("Gambar event wajib diunggah.", 400)
                );

            const organizerId = req.user.id;
            const eventPicture = `/images/${req.file.filename}`;

            // 2. Ambil dan Proses Body
            const {
                title,
                description,
                location,
                startDate,
                endDate,
                isFree,
                category,
                price,
                totalSlots,
            } = req.body;
            const isFreeBool = isFree === "true";

            // 3. Validasi Input
            if (!title || !location || !startDate || !category || !totalSlots) {
                return next(
                    new ErrorHandler(
                        "Data wajib (judul, lokasi, tanggal, kategori, total slot) tidak boleh kosong.",
                        400
                    )
                );
            }
            if (!isFreeBool && (!price || Number(price) <= 0)) {
                return next(
                    new ErrorHandler(
                        "Event berbayar harus memiliki harga yang valid.",
                        400
                    )
                );
            }
            if (!(category in EventCategory)) {
                return next(
                    new ErrorHandler(`Kategori '${category}' tidak valid.`, 400)
                );
            }

            // 4. Panggil Service
            const newEvent = await myEventService.create({
                title,
                description,
                location,
                startDate,
                endDate,
                organizerId,
                eventPicture,
                isFree: isFreeBool,
                status: EventStatus.DRAFT,
                category: category as EventCategory,
                price: Number(price || 0),
                totalSlots: Number(totalSlots),
            });

            // 5. Kirim Respons
            res.status(201).json({
                message: "Event berhasil dibuat!",
                data: newEvent,
            });
        } catch (error: any) {
            next(
                new ErrorHandler(`Gagal membuat event: ${error.message}`, 500)
            );
        }
    }

    async getAllmyEvents(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user?.id)
                return next(
                    new ErrorHandler("User tidak terautentikasi.", 401)
                );

            const events = await myEventService.findAllByOrganizer(req.user.id);

            res.status(200).json({
                message: "Berhasil mengambil event milik organizer.",
                data: events,
            });
        } catch (error: any) {
            next(
                new ErrorHandler(`Gagal mengambil event: ${error.message}`, 500)
            );
        }
    }

    async getMyEventById(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user?.id)
                return next(
                    new ErrorHandler("User tidak terautentikasi.", 401)
                );

            const event = await myEventService.findByIdAndOrganizer(
                Number(req.params.id),
                req.user.id
            );

            if (!event) {
                return next(
                    new ErrorHandler(
                        "Event tidak ditemukan atau Anda tidak memiliki akses.",
                        404
                    )
                );
            }

            res.status(200).json({
                message: "Berhasil mengambil detail event.",
                data: event,
            });
        } catch (error: any) {
            next(
                new ErrorHandler(
                    `Gagal mengambil detail event: ${error.message}`,
                    500
                )
            );
        }
    }

    async publishmyEvent(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user?.id)
                return next(
                    new ErrorHandler("User tidak terautentikasi.", 401)
                );

            const event = await myEventService.publish(
                Number(req.params.id),
                req.user.id
            );

            res.status(200).json({
                message: "Event berhasil dipublikasikan!",
                data: event,
            });
        } catch (error: any) {
            if (error instanceof ErrorHandler) return next(error);
            if (error.code === "P2025") {
                return next(
                    new ErrorHandler(
                        "Event tidak ditemukan atau Anda tidak memiliki akses.",
                        404
                    )
                );
            }
            next(
                new ErrorHandler(
                    `Gagal mempublikasikan event: ${error.message}`,
                    500
                )
            );
        }
    }

    async editmyEvent(req: Request, res: Response, next: NextFunction) {
        try {
            // 1. Validasi Autentikasi dan ambil ID
            if (!req.user?.id) {
                return next(
                    new ErrorHandler("User tidak terautentikasi.", 401)
                );
            }
            const organizerId = req.user.id;
            const eventId = Number(req.params.id);

            // 2. Siapkan payload data untuk dikirim ke service
            const dataToUpdate: any = { ...req.body };

            if (req.file) {
                dataToUpdate.eventPicture = `/images/${req.file.filename}`;
            }
            if (req.body.isFree !== undefined) {
                dataToUpdate.isFree = req.body.isFree === "true";
            }
            if (req.body.price !== undefined) {
                dataToUpdate.price = Number(req.body.price);
            }
            if (req.body.totalSlots !== undefined) {
                dataToUpdate.totalSlots = Number(req.body.totalSlots);
            }
            // Validasi jika kategori dikirim, pastikan nilainya valid
            if (req.body.category && !(req.body.category in EventCategory)) {
                return next(
                    new ErrorHandler(
                        `Kategori '${req.body.category}' tidak valid.`,
                        400
                    )
                );
            }

            // 3. Panggil service untuk melakukan update
            const updatedEvent = await myEventService.editmyEvent(
                eventId,
                organizerId,
                dataToUpdate
            );

            // 4. Kirim respons sukses
            res.status(200).json({
                message: "Event berhasil diperbarui!",
                data: updatedEvent,
            });
        } catch (error: any) {
            // Tangani error khusus dari service (misal: 404 Not Found)
            if (error instanceof ErrorHandler) {
                return next(error);
            }
            next(
                new ErrorHandler(
                    `Gagal memperbarui event: ${error.message}`,
                    500
                )
            );
        }
    }

    async cancelEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const updatedEvent = await myEventService.updateStatus(
                id,
                EventStatus.CANCELED
            );
            res.status(200).json({
                message: "Event berhasil dibatalkan.",
                data: updatedEvent,
            });
        } catch (error: any) {
            next(
                new ErrorHandler(
                    `Gagal membatalkan event: ${error.message}`,
                    500
                )
            );
        }
    }

    async deletemyEvent(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user?.id)
                return next(
                    new ErrorHandler("User tidak terautentikasi.", 401)
                );

            await myEventService.delete(Number(req.params.id), req.user.id);

            res.status(200).json({ message: "Event berhasil dihapus." });
        } catch (error: any) {
            if (error.code === "P2025") {
                return next(
                    new ErrorHandler(
                        "Event tidak ditemukan atau Anda tidak memiliki akses.",
                        404
                    )
                );
            }
            next(
                new ErrorHandler(`Gagal menghapus event: ${error.message}`, 500)
            );
        }
    }

    async createVoucher(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("ini req.body dari controller: ", req.body);
            if (!req.user?.id)
                return next(
                    new ErrorHandler("User tidak terautentikasi.", 401)
                );

            const {
                eventId,
                voucherCode,
                discountAmount,
                minimalPurchase,
                maximalDiscount,
                startDate,
                endDate,
            } = req.body;

            if (!voucherCode || !discountAmount || !startDate || !endDate) {
                return next(
                    new ErrorHandler(
                        "Data wajib (kode, nilai diskon, tanggal) harus diisi.",
                        400
                    )
                );
            }

            const newVoucher = await myEventService.createVoucher(
                Number(req.params.id),
                req.user.id,
                {
                    ...req.body,
                    eventId: Number(eventId),
                    discountAmount: Number(discountAmount),
                    minimalPurchase: Number(minimalPurchase || 0),
                    maximalDiscount: Number(maximalDiscount || 0),
                }
            );

            console.log("ini newVoucher: ", newVoucher);

            res.status(201).json({
                message: "Voucher baru berhasil dibuat!",
                data: newVoucher,
            });
        } catch (error: any) {
            if (error instanceof ErrorHandler) return next(error);
            if (error.code === "P2002") {
                return next(
                    new ErrorHandler("Kode voucher ini sudah digunakan.", 409)
                );
            }
            next(
                new ErrorHandler(`Gagal membuat voucher: ${error.message}`, 500)
            );
        }
    }

    async getTransactionsByEvent(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const eventId = Number(req.params.id);
            const organizerId = req.user!.id; // Tanda seru (!) karena middleware sudah memastikan req.user ada

            // Panggil service untuk mengambil data transaksi
            const transactions = await myEventService.findTransactionsByEvent(
                eventId,
                organizerId
            );

            res.status(200).json({
                message: "Berhasil mengambil daftar transaksi.",
                data: transactions,
            });
        } catch (error: any) {
            // Teruskan error dari service (misal: event tidak ditemukan)
            if (error instanceof ErrorHandler) {
                return next(error);
            }
            next(
                new ErrorHandler(
                    `Gagal mengambil transaksi: ${error.message}`,
                    500
                )
            );
        }
    }

    async acceptTransaction(req: Request, res: Response, next: NextFunction) {
        try {
            const transactionId = Number(req.params.transactionId);
            const organizerId = req.user!.id;

            const updatedTransaction = await myEventService.acceptTransaction(
                transactionId,
                organizerId
            );

            res.status(200).json({
                message: "Transaksi berhasil diterima dan tiket telah dibuat.",
                data: updatedTransaction,
            });
        } catch (error: any) {
            if (error instanceof ErrorHandler) {
                return next(error);
            }
            next(
                new ErrorHandler(
                    `Gagal menerima transaksi: ${error.message}`,
                    500
                )
            );
        }
    }

    async rejectTransaction(req: Request, res: Response, next: NextFunction) {
        try {
            const transactionId = Number(req.params.transactionId);
            const organizerId = req.user!.id;

            const updatedTransaction = await myEventService.rejectTransaction(
                transactionId,
                organizerId
            );

            res.status(200).json({
                message:
                    "Transaksi berhasil ditolak dan sumber daya telah dikembalikan.",
                data: updatedTransaction,
            });
        } catch (error: any) {
            if (error instanceof ErrorHandler) {
                return next(error);
            }
            next(
                new ErrorHandler(
                    `Gagal menolak transaksi: ${error.message}`,
                    500
                )
            );
        }
    }

    async getDashboardStats(req: Request, res: Response, next: NextFunction) {
        try {
            const eventId = Number(req.params.id);
            const organizerId = req.user!.id;

            const stats = await myEventService.getDashboardStats(
                eventId,
                organizerId
            );

            res.status(200).json({
                message: "Berhasil mengambil statistik dashboard.",
                data: stats,
            });
        } catch (error: any) {
            if (error instanceof ErrorHandler) {
                return next(error);
            }
            next(
                new ErrorHandler(
                    `Gagal mengambil statistik: ${error.message}`,
                    500
                )
            );
        }
    }

    async getAttendeesByEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const eventId = Number(req.params.id);
            const organizerId = req.user!.id;

            const attendees = await myEventService.findAttendeesByEvent(
                eventId,
                organizerId
            );

            res.status(200).json({
                message: "Berhasil mengambil daftar peserta.",
                data: attendees,
            });
        } catch (error: any) {
            if (error instanceof ErrorHandler) {
                return next(error);
            }
            next(
                new ErrorHandler(
                    `Gagal mengambil daftar peserta: ${error.message}`,
                    500
                )
            );
        }
    }

    async getSalesReport(req: Request, res: Response, next: NextFunction) {
        try {
            const eventId = Number(req.params.id);
            const organizerId = req.user!.id;

            // Ambil periode dari query string, default-nya 'daily'
            const period = (req.query.period as string) || "daily";

            const report = await myEventService.getSalesReport(
                eventId,
                organizerId,
                period
            );

            res.status(200).json({
                message: "Berhasil mengambil laporan penjualan.",
                data: report,
            });
        } catch (error: any) {
            if (error instanceof ErrorHandler) {
                return next(error);
            }
            next(
                new ErrorHandler(
                    `Gagal mengambil laporan penjualan: ${error.message}`,
                    500
                )
            );
        }
    }
}

export default new MyEventsController();
