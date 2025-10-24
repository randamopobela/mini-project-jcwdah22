"use client";

import React, { useState, useEffect } from "react";
import { Spinner } from "flowbite-react"; // Import spinner dari Flowbite
import { IEvent } from "@/types/event.type";
import { getAllPublicEvents } from "@/service/eventService";
import EventList from "@/components/events/eventList";

function AllEventsPage() {
  // State untuk menyimpan daftar event
  const [events, setEvents] = useState<IEvent[]>([]);
  // State untuk status loading
  const [loading, setLoading] = useState<boolean>(true);
  // State untuk pesan error
  const [error, setError] = useState<string | null>(null);

  // useEffect untuk mengambil data saat komponen dimuat
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true); // Mulai loading
        setError(null); // Reset error
        const data = await getAllPublicEvents(); // Panggil API
        setEvents(data); // Simpan data ke state
      } catch (err) {
        setError("Gagal mengambil data event. Silakan coba lagi nanti."); // Set pesan error
        console.error(err); // Log error asli ke konsol
      } finally {
        setLoading(false); // Selesai loading
      }
    };

    fetchEvents(); // Jalankan fungsi fetch
  }, []); // Array kosong berarti efek ini hanya berjalan sekali saat mount

  // Tampilkan indikator loading jika sedang memuat
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" aria-label="Memuat data event..." />
      </div>
    );
  }

  // Tampilkan pesan error jika terjadi kesalahan
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-600">
        <p>Terjadi Kesalahan: {error}</p>
      </div>
    );
  }

  // Tampilkan daftar event jika data berhasil dimuat
  return (
    <div className="container mx-auto px-4 py-8 bg-white">
      <h1 className="text-3xl font-bold mb-6 text-center text-black">
        Semua Event
      </h1>

      {/* Render komponen EventList dan kirimkan SEMUA data event
        yang ada di state 'events' sebagai props.
      */}
      {events.length > 0 ? (
        <EventList events={events} />
      ) : (
        <p className="text-center text-gray-500">
          Belum ada event yang tersedia saat ini.
        </p>
      )}

      {/* Anda bisa menambahkan fitur filter atau paginasi di sini nanti */}
    </div>
  );
}

export default AllEventsPage;
