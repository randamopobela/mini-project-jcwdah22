import { EventCategory, EventStatus, Prisma } from "../generated/prisma";
import { prisma } from "../config/config";
import { ErrorHandler } from "../helpers/response.handler";
import {
    IEventData,
    IEventUpdateData,
    IVoucherData,
} from "../interfaces/event.interface";
import { sendEmail } from "../helpers/nodemailer";

class MyEventsService {
    //   membuat event baru
    async create(data: IEventData) {
        return prisma.event.create({
            data: {
                title: data.title,
                description: data.description,
                location: data.location,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                isFree: data.isFree,
                eventPicture: data.eventPicture,
                organizerId: data.organizerId,
                status: data.status,
                category: data.category,
                price: data.price,
                totalSlots: data.totalSlots,
                availableSlots: data.totalSlots, // Saat dibuat, slot tersedia = total slot
            },
        });
    }

    //   mengambil semua event milik seorang organizer
    async findAllByOrganizer(organizerId: string) {
        return prisma.event.findMany({
            where: { organizerId },
            select: {
                id: true,
                title: true,
                location: true,
                startDate: true,
                endDate: true,
                status: true,
                totalSlots: true,
                availableSlots: true,
                price: true,
                eventPicture: true,
            },
            orderBy: { createdAt: "desc" },
        });
    }

    //   mengambil satu event milik seorang organizer berdasarkan ID
    async findByIdAndOrganizer(id: number, organizerId: string) {
        return prisma.event.findFirst({
            where: { id, organizerId },
            select: {
                id: true,
                title: true,
                description: true,
                category: true,
                location: true,
                startDate: true,
                endDate: true,
                status: true,
                totalSlots: true,
                availableSlots: true,
                price: true,
                eventPicture: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { createdAt: "desc" },
        });
    }

    //    Mempublikasikan event milik seorang organizer.
    async publish(id: number, organizerId: string) {
        // Validasi kepemilikan sebelum update
        const event = await this.findByIdAndOrganizer(id, organizerId);
        if (!event) {
            throw new ErrorHandler(
                "Event tidak ditemukan atau Anda tidak memiliki akses.",
                404
            );
        }
        return prisma.event.update({
            where: { id },
            data: { status: "PUBLISHED" },
        });
    }

    //    Mengedit event milik seorang organizer.
    async editmyEvent(id: number, organizerId: string, data: IEventUpdateData) {
        return prisma.$transaction(async (tx) => {
            // 1. Validasi kepemilikan event
            const event = await tx.event.findFirst({
                where: { id, organizerId },
            });

            if (!event) {
                throw new ErrorHandler(
                    "Event tidak ditemukan atau Anda tidak memiliki akses.",
                    404
                );
            }

            // 2. Siapkan objek data untuk diupdate secara dinamis
            const dataToUpdate: Prisma.EventUpdateInput = {};

            if (data.title) dataToUpdate.title = data.title;
            if (data.description) dataToUpdate.description = data.description;
            if (data.location) dataToUpdate.location = data.location;
            if (data.startDate)
                dataToUpdate.startDate = new Date(data.startDate);
            if (data.endDate) dataToUpdate.endDate = new Date(data.endDate);
            if (data.isFree !== undefined) dataToUpdate.isFree = data.isFree;
            if (data.eventPicture)
                dataToUpdate.eventPicture = data.eventPicture;
            if (data.category) dataToUpdate.category = data.category;
            if (data.price !== undefined) dataToUpdate.price = data.price;

            // Logika khusus untuk update totalSlots agar availableSlots tetap sinkron
            if (data.totalSlots !== undefined) {
                const newTotalSlots = data.totalSlots;
                const slotsSold = event.totalSlots - event.availableSlots;

                if (newTotalSlots < slotsSold) {
                    throw new ErrorHandler(
                        `Total slot baru (${newTotalSlots}) tidak boleh kurang dari jumlah tiket yang sudah terjual (${slotsSold}).`,
                        400
                    );
                }
                dataToUpdate.totalSlots = newTotalSlots;
                dataToUpdate.availableSlots = newTotalSlots - slotsSold;
            }

            // 3. Eksekusi update di database
            const updatedEvent = await tx.event.update({
                where: { id },
                data: dataToUpdate,
            });

            return updatedEvent;
        });
    }

    //    Mengubah status event menjadi CANCELLED
    async updateStatus(eventId: string, newStatus: EventStatus) {
        return prisma.event.update({
            where: { id: Number(eventId) },
            data: { status: newStatus },
        });
    }

    //   Menghapus event milik seorang organizer.
    async delete(id: number, organizerId: string) {
        return prisma.event.delete({
            where: { id, organizerId },
        });
    }

    //   membuat voucher untuk event milik seorang organizer.
    async createVoucher(
        eventId: number,
        organizerId: string,
        data: IVoucherData
    ) {
        // Validasi kepemilikan event sebelum membuat voucher
        const event = await prisma.event.findFirst({
            where: { id: eventId, organizerId },
        });

        if (!event) {
            throw new ErrorHandler(
                "Event tidak ditemukan atau Anda tidak memiliki akses.",
                404
            );
        }

        return prisma.voucher.create({
            data: {
                eventId,
                ...data,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
            },
        });
    }

    //   mengambil semua transaksi untuk event milik seorang organizer.
    async findTransactionsByEvent(eventId: number, organizerId: string) {
        // Langkah 1: Validasi dulu apakah event ini benar milik organizer
        const event = await prisma.event.findFirst({
            where: { id: eventId, organizerId: organizerId },
        });

        // Jika event tidak ditemukan atau bukan milik organizer ini, lempar error
        if (!event) {
            throw new ErrorHandler(
                "Event tidak ditemukan atau Anda tidak memiliki akses.",
                404
            );
        }

        // Langkah 2: Jika valid, ambil semua transaksinya
        return prisma.transaction.findMany({
            where: {
                eventId: eventId,
            },
            include: {
                // Sertakan data user agar bisa menampilkan nama pembeli di frontend
                user: {
                    select: {
                        id: true,
                        userName: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc", // Tampilkan transaksi yang paling baru di atas
            },
        });
    }

    async acceptTransaction(transactionId: number, organizerId: string) {
        return prisma.$transaction(async (tx) => {
            // 1. Ambil data transaksi beserta data event-nya untuk validasi
            const transaction = await tx.transaction.findUnique({
                where: { id: transactionId },
                include: {
                    // Kita butuh data event untuk mencocokkan organizerId
                    event: true,
                    user: true, // Sertakan data user untuk email notifikasi
                },
            });

            // 2. Lakukan serangkaian validasi penting
            if (!transaction) {
                throw new ErrorHandler("Transaksi tidak ditemukan.", 404);
            }
            if (transaction.event.organizerId !== organizerId) {
                throw new ErrorHandler(
                    "Anda tidak memiliki akses ke transaksi ini.",
                    403
                );
            }
            if (transaction.status !== "PENDING_CONFIRMATION") {
                throw new ErrorHandler(
                    `Transaksi ini tidak bisa diterima (status saat ini: ${transaction.status}).`,
                    400
                );
            }

            // 3. Update status transaksi menjadi PAID
            const updatedTransaction = await tx.transaction.update({
                where: { id: transactionId },
                data: { status: "PAID" },
            });

            // 4. Siapkan data untuk tiket-tiket baru yang akan dibuat
            const ticketsToCreate = [];
            for (let i = 0; i < transaction.ticketQuantity; i++) {
                ticketsToCreate.push({
                    eventId: transaction.eventId,
                    userId: transaction.userId,
                    transactionId: transaction.id,
                    // Buat kode tiket yang unik
                    ticketCode: `EVT${
                        transaction.eventId
                    }-USR${transaction.userId.substring(
                        0,
                        4
                    )}-${Date.now()}-${i}`,
                });
            }

            // 5. Buat semua tiket dalam satu perintah
            await tx.ticket.createMany({
                data: ticketsToCreate,
            });

            // mailer
            await sendEmail(
                transaction.user.email,
                `Pembayaran Diterima untuk ${transaction.event.title}`,
                "transaction-accepted", // Nama file template: transaction-accepted.hbs
                {
                    name: transaction.user.firstName,
                    eventName: transaction.event.title,
                    link: `http://localhost:3000/my-tickets`, // Ganti dengan URL frontend-mu
                }
            );

            // 6. Kembalikan data transaksi yang sudah diupdate
            return updatedTransaction;
        });
    }

    async rejectTransaction(transactionId: number, organizerId: string) {
        return prisma.$transaction(async (tx) => {
            // 1. Ambil data transaksi beserta data event-nya untuk validasi
            const transaction = await tx.transaction.findUnique({
                where: { id: transactionId },
                include: { event: true, user: true },
            });

            // 2. Lakukan serangkaian validasi
            if (!transaction) {
                throw new ErrorHandler("Transaksi tidak ditemukan.", 404);
            }
            if (transaction.event.organizerId !== organizerId) {
                throw new ErrorHandler(
                    "Anda tidak memiliki akses ke transaksi ini.",
                    403
                );
            }
            if (transaction.status !== "PENDING_CONFIRMATION") {
                throw new ErrorHandler(
                    `Transaksi ini tidak bisa ditolak (status saat ini: ${transaction.status}).`,
                    400
                );
            }

            // 3. Update status transaksi menjadi REJECTED
            const updatedTransaction = await tx.transaction.update({
                where: { id: transactionId },
                data: { status: "REJECTED" },
            });

            // 4. KEMBALIKAN SLOT EVENT
            await tx.event.update({
                where: { id: transaction.eventId },
                data: {
                    availableSlots: {
                        increment: transaction.ticketQuantity,
                    },
                },
            });

            // ======================================================
            // ===== LOGIKA BARU UNTUK MENGEMBALIKAN SUMBER DAYA =====
            // ======================================================

            // Cek dan kembalikan VOUCHER jika digunakan
            if (transaction.discountVouchers > 0) {
                await tx.voucherAssignment.deleteMany({
                    where: { transactionId: transaction.id },
                });
            }

            // Cek dan kembalikan KUPON jika digunakan
            if (transaction.discountCoupons > 0) {
                await tx.coupon.updateMany({
                    where: { transactionId: transaction.id },
                    data: {
                        isUsed: false,
                        usedAt: null,
                    },
                });
            }

            // Cek dan kembalikan POIN jika digunakan
            if (transaction.discountPoints > 0) {
                // Tambah kembali total poin pengguna
                await tx.userPoints.update({
                    where: { userId: transaction.userId },
                    data: {
                        totalPoints: {
                            increment: transaction.discountPoints,
                        },
                    },
                });
                // Buat log pengembalian poin untuk riwayat
                await tx.pointsLog.create({
                    data: {
                        userId: transaction.userId,
                        type: "REFUND",
                        description: `Pengembalian poin dari transaksi #${transaction.id} yang ditolak.`,
                        points: transaction.discountPoints,
                        expiredAt: new Date(
                            new Date().setFullYear(new Date().getFullYear() + 1)
                        ),
                    },
                });
            }

            await sendEmail(
                transaction.user.email, // Sekarang `transaction.user` sudah ada
                `Informasi Pembayaran untuk ${transaction.event.title}`,
                "transaction-rejected",
                {
                    name: transaction.user.firstName,
                    eventName: transaction.event.title,
                }
            );

            // 5. Kembalikan data transaksi yang sudah diupdate
            return updatedTransaction;
        });
    }

    async getDashboardStats(eventId: number, organizerId: string) {
        // 1. Validasi kepemilikan event terlebih dahulu
        const event = await prisma.event.findFirst({
            where: { id: eventId, organizerId: organizerId },
        });

        if (!event) {
            throw new ErrorHandler(
                "Event tidak ditemukan atau Anda tidak memiliki akses.",
                404
            );
        }

        // 2. DIUBAH: Kita ganti 'groupBy' dengan beberapa 'count' dan 'aggregate' yang lebih jelas
        const [
            revenueData,
            ticketsSoldData,
            pendingCount,
            paidCount,
            rejectedCount,
        ] = await prisma.$transaction([
            // Hitung total pendapatan
            prisma.transaction.aggregate({
                _sum: { finalPrice: true },
                where: { eventId: eventId, status: "PAID" },
            }),
            // Hitung total tiket terjual
            prisma.transaction.aggregate({
                _sum: { ticketQuantity: true },
                where: { eventId: eventId, status: "PAID" },
            }),
            // Hitung transaksi PENDING_CONFIRMATION
            prisma.transaction.count({
                where: { eventId: eventId, status: "PENDING_CONFIRMATION" },
            }),
            // Hitung transaksi PAID
            prisma.transaction.count({
                where: { eventId: eventId, status: "PAID" },
            }),
            // Hitung transaksi REJECTED
            prisma.transaction.count({
                where: { eventId: eventId, status: "REJECTED" },
            }),
        ]);

        // 3. Susun semua data menjadi satu objek respons
        return {
            totalRevenue: revenueData._sum.finalPrice || 0,
            ticketsSold: ticketsSoldData._sum.ticketQuantity || 0,
            availableSlots: event.availableSlots,
            totalSlots: event.totalSlots,
            transactionCounts: {
                PENDING_CONFIRMATION: pendingCount,
                PAID: paidCount,
                REJECTED: rejectedCount,
            },
        };
    }

    async findAttendeesByEvent(eventId: number, organizerId: string) {
        // 1. Validasi kepemilikan event
        const event = await prisma.event.findFirst({
            where: { id: eventId, organizerId: organizerId },
        });

        if (!event) {
            throw new ErrorHandler(
                "Event tidak ditemukan atau Anda tidak memiliki akses.",
                404
            );
        }

        // 2. Ambil semua transaksi yang sudah lunas (PAID) untuk event ini
        const paidTransactions = await prisma.transaction.findMany({
            where: {
                eventId: eventId,
                status: "PAID",
            },
            // Pilih data yang relevan untuk ditampilkan
            select: {
                id: true, // ID transaksi
                ticketQuantity: true,
                finalPrice: true,
                // Ambil data pengguna yang terkait dengan transaksi ini
                user: {
                    select: {
                        userName: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: "asc", // Urutkan dari pendaftar pertama
            },
        });

        return paidTransactions;
    }

    async getSalesReport(eventId: number, organizerId: string, period: string) {
        // 1. Validasi kepemilikan event
        const event = await prisma.event.findFirst({
            where: { id: eventId, organizerId: organizerId },
        });

        if (!event) {
            throw new ErrorHandler(
                "Event tidak ditemukan atau Anda tidak memiliki akses.",
                404
            );
        }

        // 2. Ambil semua transaksi yang lunas (PAID)
        const paidTransactions = await prisma.transaction.findMany({
            where: {
                eventId: eventId,
                status: "PAID",
            },
            select: {
                createdAt: true,
                finalPrice: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        // 3. Proses data di JavaScript untuk mengelompokkan berdasarkan periode
        const salesData = paidTransactions.reduce((acc, transaction) => {
            // Buat kunci grup berdasarkan periode (misal: '2025-10-16' untuk harian)
            const dateKey = transaction.createdAt
                .toISOString()
                .slice(0, period === "monthly" ? 7 : 10);

            // Jika kunci belum ada, inisialisasi. Jika sudah ada, tambahkan nilainya.
            if (!acc[dateKey]) {
                acc[dateKey] = 0;
            }
            acc[dateKey] += transaction.finalPrice;

            return acc;
        }, {} as Record<string, number>);

        // 4. Ubah format objek menjadi array agar mudah dikonsumsi oleh library grafik di frontend
        const formattedReport = Object.keys(salesData).map((key) => ({
            date: key,
            totalSales: salesData[key],
        }));

        return formattedReport;
    }
}

export default new MyEventsService();
