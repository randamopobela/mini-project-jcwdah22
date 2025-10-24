import { EventCategory, EventStatus, Prisma } from "../generated/prisma";
import { prisma } from "../config/config";

// Tipe data untuk query agar lebih rapi
interface IEventQuery {
  search?: string;
  category?: string;
  location?: string;
  page?: number;
  limit?: number;
}

class EventsService {
  /**
   * Mengambil semua event publik dengan filter dan paginasi.
   */
  async findAllPublic(query: IEventQuery) {
    const { search, category, location, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.EventWhereInput = {
      status: EventStatus.PUBLISHED,
    };

    if (search) {
      whereClause.title = { contains: search, mode: "insensitive" };
    }
    if (location) {
      whereClause.location = { contains: location, mode: "insensitive" };
    }
    // PERUBAHAN: Filter kategori sekarang langsung ke field enum
    if (category) {
      whereClause.category = category as EventCategory; // Gunakan enum langsung
    }

    const [events, totalEvents] = await prisma.$transaction([
      prisma.event.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { startDate: "asc" },
        include: {
          // PERUBAHAN: Ganti `businessName` menjadi `userName` dan hapus include categories
          organizer: { select: { userName: true } },
        },
      }),
      prisma.event.count({ where: whereClause }),
    ]);

    return { events, totalEvents };
  }

  /**
   * Mencari satu event publik berdasarkan ID.
   */
  async findPublicById(id: number) {
    return prisma.event.findFirst({
      where: { id, status: EventStatus.PUBLISHED },
      include: {
        // PERUBAHAN: Sesuaikan include dengan skema baru
        organizer: { select: { id: true, userName: true } },
        // Relasi 'categories' dan 'ticketTypes' sudah tidak ada di skema baru
      },
    });
  }

  /**
   * Mengambil semua kategori yang tersedia dari enum.
   */
  async findAllCategories() {
    // PERUBAHAN: Ambil daftar kategori langsung dari enum EventCategory
    return Object.values(EventCategory);
  }

  /**
   * Mengambil daftar lokasi unik dari event yang sudah publish.
   */
  async findUniqueLocations() {
    const locations = await prisma.event.findMany({
      where: { status: EventStatus.PUBLISHED },
      select: { location: true },
      distinct: ["location"],
    });
    return locations.map(({ location }) => location);
  }
}

export default new EventsService();
