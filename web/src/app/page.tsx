// src/app/page.tsx
"use client";

import EventList from "@/components/events/eventList"; // Pastikan path ini benar
import CategoryBrowser from "@/components/category/categoryBrowser"; // 🚀 Impor komponen kategori
import { useAuth } from "@/contexts/AuthContext";
import { getAllPublicEvents } from "@/service/eventService"; // Pastikan path ini benar
import { IEvent } from "@/types/event.type"; // Pastikan path ini benar
import { Button, Spinner, TextInput, Alert } from "flowbite-react";
import { ArrowRight, Award, MapPin, Search, Users, Zap } from "lucide-react"; // Ikon yang digunakan di bagian lain
import Link from "next/link";
import { useRouter } from "next/navigation"; // 🚀 Impor useRouter
import { useEffect, useState } from "react";

// Hapus array eventCategories yang hardcoded

export default function HomePage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // 🚀 Inisialisasi router

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error
        const data = await getAllPublicEvents();
        setEvents(data);
      } catch (err) {
        // Tangkap error spesifik jika perlu
        setError("Gagal mengambil data event.");
        console.error(err); // Log error asli
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // 🚀 Fungsi untuk menangani pencarian
  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (searchQuery) queryParams.set("search", searchQuery);
    if (location) queryParams.set("location", location);
    router.push(`/events?${queryParams.toString()}`);
  };

  return (
    <div className="bg-gray-50">
      {/* --- Hero Section & Search Bar --- */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Discover your next experience
            </h1>
            <p className="text-xl md:text-2xl text-orange-100">
              Find running events that match your passion
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-2xl p-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <TextInput
                    icon={Search}
                    placeholder="Search for events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sizing="lg"
                  />
                </div>
                <div className="md:w-64">
                  <TextInput
                    icon={MapPin}
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    sizing="lg"
                  />
                </div>
                {/* 🚀 Tambahkan onClick={handleSearch} */}
                <Button
                  color="dark"
                  size="lg"
                  className="whitespace-nowrap"
                  onClick={handleSearch}
                >
                  <Search className="mr-2 h-5 w-5" /> Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Browse by Category Section --- */}
      {/* 🚀 Ganti bagian ini dengan komponen dinamis */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Browse by category
          </h2>
          <CategoryBrowser /> {/* Panggil komponen dinamis */}
        </div>
      </section>

      {/* --- Event Terbaru Section --- */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-black">Event Terbaru</h1>
          <Link
            href="/events"
            className="text-orange-600 font-semibold hover:underline"
          >
            Lihat Semua Event &rarr;
          </Link>
        </div>

        {/* Tampilkan loading atau error jika perlu */}
        {loading && (
          <div className="text-center py-10">
            <Spinner size="xl" />
          </div>
        )}
        {error && <Alert color="failure">{error}</Alert>}
        {!loading &&
          !error &&
          // Tampilkan event list jika tidak loading dan tidak error
          (events.length > 0 ? (
            <EventList events={events.slice(0, 4)} />
          ) : (
            <p className="text-center text-gray-500">
              Belum ada event terbaru.
            </p>
          ))}
      </section>

      {/* --- Call to Action Section --- */}
      <section className="py-16 bg-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Make your running event happen
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Create and manage events with ease using our platform
          </p>
          {/* Logika tombol create event tetap sama */}
          {!user ? (
            <Link href="/login">
              <Button size="xl" color="light">
                Create an event <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          ) : (
            // Arahkan ke dashboard jika sudah login (sesuaikan path jika perlu)
            <Link
              href={
                user.role === "ORGANIZER" || user.role === "ADMIN"
                  ? "/dashboard"
                  : "/profile"
              }
            >
              <Button size="xl" color="light">
                {user.role === "ORGANIZER" || user.role === "ADMIN"
                  ? "Go to Dashboard"
                  : "View Profile"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* --- Why Choose Us Section --- */}
      {/* Bagian ini bisa dibiarkan hardcoded karena kontennya statis */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Why choose RunEvent?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Kolom 1 */}
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Quality Events
              </h3>
              <p className="text-gray-600">
                Hundreds of trusted and verified running events across Indonesia
              </p>
            </div>
            {/* Kolom 2 */}
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Fast Process
              </h3>
              <p className="text-gray-600">
                Easy registration and tickets sent directly to your email
              </p>
            </div>
            {/* Kolom 3 */}
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Active Community
              </h3>
              <p className="text-gray-600">
                Join thousands of runners and find new running friends
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
