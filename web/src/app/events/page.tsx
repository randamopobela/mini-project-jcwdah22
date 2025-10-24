"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // Impor useRouter
import { Spinner, Alert, TextInput, Button } from "flowbite-react"; // Impor komponen form
import { Search, MapPin, RefreshCcw } from "lucide-react"; // Impor ikon
import { IEvent } from "@/types/event.type";
import { getAllPublicEvents } from "@/service/eventService";
import CategoryBrowser from "@/components/category/categoryBrowser";
import EventList from "@/components/events/eventList";

export default function AllEventsPage() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter(); // 🚀 Inisialisasi router

  // 🚀 State lokal untuk input search bar di halaman ini
  const [searchQuery, setSearchQuery] = useState(
    searchParams?.get("search") || ""
  );
  const [location, setLocation] = useState(searchParams?.get("location") || "");

  useEffect(() => {
    // Ambil filter awal dari URL saat halaman dimuat
    const initialSearch = searchParams?.get("search") || "";
    const initialLocation = searchParams?.get("location") || "";
    const initialCategory = searchParams?.get("category") || "";

    // Update state lokal jika URL berubah (misal: user klik link kategori)
    setSearchQuery(initialSearch);
    setLocation(initialLocation);

    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        // Panggil API dengan filter dari URL
        const data = await getAllPublicEvents({
          search: initialSearch,
          location: initialLocation,
          category: initialCategory,
        });
        setEvents(data);
      } catch (err) {
        setError("Gagal mengambil data event. Silakan coba lagi nanti.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [searchParams]); // Jalankan ulang effect jika URL query params berubah

  // 🚀 Fungsi untuk menangani pencarian DARI halaman ini
  const handleSearch = () => {
    const queryParams = new URLSearchParams(searchParams?.toString()); // Ambil params yang sudah ada
    // Set atau hapus parameter berdasarkan input lokal
    if (searchQuery) queryParams.set("search", searchQuery);
    else queryParams.delete("search");
    if (location) queryParams.set("location", location);
    else queryParams.delete("location");
    // Hapus parameter kategori jika melakukan pencarian teks/lokasi baru
    queryParams.delete("category");

    // Navigasi ke URL baru dengan query params yang diperbarui
    router.push(`/events?${queryParams.toString()}`);
  };

  const handleClearFilters = () => {
    setSearchQuery(""); // Reset state lokal
    setLocation(""); // Reset state lokal
    router.push("/events"); // Navigasi ke URL dasar tanpa filter
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Temukan Event Lari
      </h1>

      {/* =========================================== */}
      {/* ===== 🚀 TAMBAHKAN SEARCH BAR DI SINI 🚀 ===== */}
      {/* =========================================== */}
      <div className="max-w-4xl mx-auto mb-10">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <TextInput
                icon={Search}
                placeholder="Cari event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sizing="md" // Ukuran bisa disesuaikan
              />
            </div>
            <div className="md:w-64">
              <TextInput
                icon={MapPin}
                placeholder="Lokasi"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                sizing="md"
              />
            </div>
            <Button
              color="dark"
              size="md"
              className="whitespace-nowrap"
              onClick={handleSearch} // Panggil handleSearch
            >
              <Search className="mr-2 h-5 w-5" />
              Cari
            </Button>
            <Button
              color="gray" // Warna abu-abu agar tidak terlalu menonjol
              size="md"
              className="whitespace-nowrap"
              onClick={handleClearFilters} // Panggil fungsi clear
              // Opsional: Hanya tampilkan jika ada filter aktif
              // disabled={!searchQuery && !location && !searchParams?.get('category')}
            >
              <RefreshCcw className="mr-2 h-5 w-5" /> {/* Atau ikon XCircle */}
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* =========================================== */}
      {/* ===== 🚀 TAMBAHKAN CATEGORY BROWSER DI SINI 🚀 ===== */}
      {/* =========================================== */}
      <section className="mb-10 bg-gray-50 p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Telusuri Berdasarkan Kategori
        </h2>
        <CategoryBrowser /> {/* Panggil komponen kategori */}
      </section>

      {/* --- Bagian Hasil Event --- */}
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Hasil Pencarian</h2>
      {loading && (
        <div className="flex justify-center items-center py-10">
          <Spinner size="xl" aria-label="Memuat data event..." />
        </div>
      )}
      {error && (
        <div className="py-10">
          <Alert color="failure">{error}</Alert>
        </div>
      )}
      {!loading &&
        !error &&
        (events.length > 0 ? (
          <EventList events={events} />
        ) : (
          <p className="text-center text-gray-500 py-10">
            Tidak ada event yang cocok dengan kriteria pencarian Anda.
          </p>
        ))}
    </div>
  );
}
