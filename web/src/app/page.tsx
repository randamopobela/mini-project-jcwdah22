"use client";

import EventList from "@/components/events/eventList";
import { useAuth } from "@/contexts/AuthContext";
import { getAllPublicEvents } from "@/service/eventService";
import { IEvent } from "@/types/event.type";
import { Button, TextInput } from "flowbite-react";
import {
  ArrowRight,
  Award,
  Heart,
  MapPin,
  Mountain,
  Search,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const eventCategories = [
  { name: "Fun Run", icon: Heart, color: "pink" },
  { name: "5K", icon: Zap, color: "info" },
  { name: "10K", icon: Target, color: "success" },
  { name: "Half Marathon", icon: TrendingUp, color: "warning" },
  { name: "Marathon", icon: Award, color: "failure" },
  { name: "Trail Run", icon: Mountain, color: "purple" },
];

export default function HomePage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getAllPublicEvents();
        // 👇 PASTIKAN SET STATE KE 'events' (jamak)
        setEvents(data);
      } catch {
        setError("Gagal mengambil data event.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="bg-gray-50">
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
                <Button color="warning" size="lg" className="whitespace-nowrap">
                  <Search className="mr-2 h-5 w-5" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Browse by category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {eventCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link
                  key={category.name}
                  href="/"
                  className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  <IconComponent className="h-8 w-8 text-orange-600 mb-2" />
                  <span className="font-medium text-sm text-center">
                    {category.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-black">Event Terbaru</h1>

        {/* Menggunakan .slice(0, 4) untuk mengambil 4 event pertama */}
        <EventList events={events.slice(0, 4)} />

        <div className="text-center mt-8">
          <Link
            href="/events"
            className="text-orange-600 font-semibold hover:underline"
          >
            Lihat Semua Event &rarr;
          </Link>
        </div>
      </section>

      <section className="py-16 bg-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Make your running event happen
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Create and manage events with ease using our platform
          </p>
          {!user ? (
            <Link href="/login">
              <Button size="xl" color="light">
                Create an event
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Link href="/dashboard">
              <Button size="xl" color="light">
                Create an event
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Why choose RunEvent?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
