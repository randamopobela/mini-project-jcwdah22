import { EventStatus, Prisma } from "../generated/prisma";
import { prisma } from "../config/config";
import { ErrorHandler } from "../helpers/response.handler";
import {
  IEventData,
  IEventUpdateData,
  IVoucherData,
} from "../interfaces/event.interface";

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
        status: EventStatus.DRAFT,
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
      orderBy: { createdAt: "desc" },
    });
  }

  //   mengambil satu event milik seorang organizer berdasarkan ID
  async findByIdAndOrganizer(id: number, organizerId: string) {
    return prisma.event.findFirst({
      where: { id, organizerId },
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
      if (data.startDate) dataToUpdate.startDate = new Date(data.startDate);
      if (data.endDate) dataToUpdate.endDate = new Date(data.endDate);
      if (data.isFree !== undefined) dataToUpdate.isFree = data.isFree;
      if (data.eventPicture) dataToUpdate.eventPicture = data.eventPicture;
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
}

export default new MyEventsService();
