"use client"; // Komponen ini perlu state dan effect

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Spinner, Alert } from "flowbite-react";
import { IEvent } from "@/types/event.type";
import { getPublicEventById } from "@/service/eventService";
import EventDetailDisplay from "@/components/events/eventDetail";

export default function EventDetailPage() {
  // State untuk menyimpan detail event
  const [event, setEvent] = useState<IEvent | null>(null);
  // State untuk status loading
  const [loading, setLoading] = useState<boolean>(true);
  // State untuk pesan error
  const [error, setError] = useState<string | null>(null);

  // Hook untuk mendapatkan parameter dari URL
  const params = useParams();
  // Ambil ID event dari parameter, pastikan tipenya string
  const eventId = params?.id as string;

  // useEffect untuk mengambil data saat komponen dimuat atau eventId berubah
  useEffect(() => {
    // Hanya fetch jika eventId ada dan valid
    if (eventId && !isNaN(Number(eventId))) {
      const fetchEventDetail = async () => {
        try {
          setLoading(true);
          setError(null);
          // Panggil fungsi API untuk mengambil detail event
          const data = await getPublicEventById(eventId);
          setEvent(data);
        } catch (err) {
          setError(
            "Gagal mengambil detail event. Event mungkin tidak ditemukan atau terjadi kesalahan server."
          );
          console.error("Fetch Event Detail Error:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchEventDetail();
    } else {
      // Handle jika ID tidak ada atau tidak valid
      setError("ID Event tidak valid.");
      setLoading(false);
    }
  }, [eventId]); // Dependensi: jalankan ulang jika eventId berubah

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Tampilkan loading spinner */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <Spinner size="xl" aria-label="Memuat detail event..." />
        </div>
      )}

      {/* Tampilkan pesan error jika ada */}
      {error && (
        <div className="py-10">
          <Alert color="failure">{error}</Alert>
        </div>
      )}

      {/* Tampilkan komponen EventDetailDisplay jika tidak loading, tidak error, dan data event ada */}
      {!loading && !error && event && <EventDetailDisplay event={event} />}

      {/* Tampilkan pesan jika event tidak ditemukan setelah fetch selesai */}
      {!loading && !error && !event && (
        <p className="text-center text-gray-500 py-10">
          Event tidak ditemukan.
        </p>
      )}
    </div>
  );
}
