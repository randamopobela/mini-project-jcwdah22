// src/components/EventCard.jsx
import React from "react";
import { Card, Badge, Button } from "flowbite-react";
import { Calendar, MapPin, Users } from "lucide-react";
import { BASE_URL } from "@/config/app.config";
import { IEvent } from "@/types/event.type";
import Link from "next/link";
// 🚀 DIUBAH: Impor BASE_URL dari config

interface EventCardProps {
  event: IEvent;
}
// Menerima satu 'event' sebagai properti (props)
function EventCard({ event }: EventCardProps) {
  // Fungsi untuk memformat harga
  const displayPrice = event.isFree
    ? "Gratis"
    : `Rp ${event.price.toLocaleString("id-ID")}`;

  // Fungsi untuk memformat tanggal
  const formattedDate = new Date(event.startDate).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Link href={`/events/${event.id}`} passHref>
      <Card
        className="hover:shadow-xl transition-shadow cursor-pointer max-w-sm"
        imgAlt={event.title}
        // 🚀 DIUBAH: Menggunakan BASE_URL untuk path gambar
        imgSrc={`${BASE_URL}${event.eventPicture}`}
      >
        <div className="mb-2">
          <Badge color="warning" size="sm">
            {event.category}
          </Badge>
        </div>
        <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
          {event.title}
        </h5>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            <span>Sisa slot: {event.availableSlots}</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t dark:border-gray-700 flex justify-between items-center">
          <span className="text-xl font-bold text-orange-600">
            {displayPrice}
          </span>
          <Button size="sm" color="warning">
            Get tickets
          </Button>
        </div>
      </Card>
    </Link>
  );
}

export default EventCard;
