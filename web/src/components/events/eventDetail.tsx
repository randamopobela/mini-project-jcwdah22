import React from "react";
import { Badge, Button } from "flowbite-react";
import { Calendar, MapPin, Ticket, Clock } from "lucide-react";
import { BASE_URL } from "@/config/app.config";
import { IEvent } from "@/types/event.type";
import Image from "next/image";

interface EventDetailDisplayProps {
  event: IEvent;
}

const EventDetailDisplay: React.FC<EventDetailDisplayProps> = ({ event }) => {
  // Fungsi format tanggal
  const formatDate = (dateInput: string | Date) => {
    // Terima string ATAU Date
    // Pastikan inputnya adalah objek Date sebelum memformat
    const dateObject =
      typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    return dateObject.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const displayPrice = event.isFree
    ? "Gratis"
    : `Rp ${event.price.toLocaleString("id-ID")}`;

  const imageUrl = `${BASE_URL}${event.eventPicture}`;

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Gambar Event */}
      {event.eventPicture && (
        <div className="relative w-full h-64 md:h-96">
          <Image
            src={imageUrl}
            alt={event.title}
            layout="fill" // Mengisi div pembungkus
            objectFit="cover" // Cara gambar mengisi area
            priority // Tambahkan ini jika gambar penting untuk LCP (misal: di atas lipatan)
          />
        </div>
      )}

      {/* Konten Detail */}
      <div className="p-6 md:p-8">
        {/* Kategori */}
        <div className="mb-4">
          <Badge color="warning" size="sm">
            {event.category}
          </Badge>
        </div>

        {/* Judul */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {event.title}
        </h1>

        {/* Harga & Tombol Tiket */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-gray-50 p-4 rounded-md">
          <div>
            <p className="text-sm text-gray-600">Harga mulai dari</p>
            <p className="text-2xl font-bold text-orange-600">{displayPrice}</p>
          </div>
          <Button color="warning" size="lg" className="mt-4 sm:mt-0">
            <Ticket className="mr-2 h-5 w-5" />
            Beli Tiket
          </Button>
        </div>

        {/* Detail Waktu & Lokasi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex items-start">
            <Calendar className="h-6 w-6 text-orange-600 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-800">Tanggal & Waktu</h3>
              <p className="text-gray-600">
                {formatDate(event.startDate)} - {formatDate(event.endDate)}
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <MapPin className="h-6 w-6 text-orange-600 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-800">Lokasi</h3>
              <p className="text-gray-600">{event.location}</p>
            </div>
          </div>
        </div>

        {/* Informasi Slot */}
        <div className="mb-6 flex items-center text-gray-600">
          <Clock className="h-5 w-5 mr-2 text-gray-500" />
          <span>Tersisa {event.availableSlots} slot</span>
        </div>

        {/* Deskripsi Event */}
        {/* 👇 DIUBAH: Hapus kelas 'prose', gunakan kelas Tailwind biasa */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Deskripsi Acara
          </h2>
          {/* Gunakan 'whitespace-pre-line' agar baris baru dari database tetap tampil */}
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventDetailDisplay;
