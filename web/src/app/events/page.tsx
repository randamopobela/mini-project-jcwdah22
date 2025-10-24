"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Users, ArrowLeft, Search } from "lucide-react";
import { Card, Badge, TextInput, Button } from "flowbite-react";
import { toast } from "sonner";
import API from "@/lib/axiosInstance";
import { useAuth } from "@/contexts/AuthContext";

export default function EventsPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await API.get("/events");
                setEvents(res.data.data);
            } catch (error) {
                toast.error("Gagal memuat daftar event");
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const filteredEvents = events.filter((event) =>
        event.title.toLowerCase().includes(search.toLowerCase())
    );

    const handleGetTickets = (eventId: number) => {
        if (!user) {
            toast.info("Silakan login terlebih dahulu untuk membeli tiket.");
            router.push("/login");
            return;
        }
        router.push(`/purchase/${eventId}/buy`);
    };

    return (
        <div className="py-12 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="text-gray-600 hover:text-orange-600 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">
                            All Events
                        </h1>
                    </div>

                    <div className="relative w-64">
                        <TextInput
                            type="text"
                            placeholder="Cari event..."
                            icon={Search}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Event Grid */}
                {isLoading ? (
                    <p className="text-gray-500 text-center py-20">
                        Loading events...
                    </p>
                ) : filteredEvents.length === 0 ? (
                    <p className="text-gray-500 text-center py-20">
                        Tidak ada event yang cocok dengan pencarian.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredEvents.map((event) => (
                            <Card
                                key={event.id}
                                className="hover:shadow-xl transition-shadow cursor-pointer"
                                imgAlt={event.title}
                                imgSrc={`${process.env.NEXT_PUBLIC_API_URL}${event.eventPicture}`}
                            >
                                <div className="mb-2">
                                    <Badge color="warning" size="sm">
                                        {event.category}
                                    </Badge>
                                </div>
                                <h5 className="text-lg font-bold tracking-tight text-gray-900">
                                    {event.title}
                                </h5>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        <span>
                                            {new Date(
                                                event.startDate
                                            ).toLocaleDateString("id-ID", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-2" />
                                        <span>{event.location}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Users className="h-4 w-4 mr-2" />
                                        <span>
                                            {event.totalSlots -
                                                event.availableSlots}{" "}
                                            peserta
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                                    <span className="text-lg font-bold text-blue-600">
                                        Rp {event.price.toLocaleString("id-ID")}
                                    </span>
                                    <Button
                                        size="sm"
                                        color="green"
                                        onClick={() =>
                                            handleGetTickets(event.id)
                                        }
                                    >
                                        Get tickets
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
