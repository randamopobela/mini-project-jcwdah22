"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Badge, Button, Card, TextInput } from "flowbite-react";
import {
    ArrowRight,
    Award,
    Calendar,
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
import API from "@/lib/axiosInstance";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface IEventData {
    id: string;
    title: string;
    description: string;
    category: string;
    eventPicture: string;
    location: string;
    startDate: string;
    endDate: string;
    price: number;
    totalSlots: number;
    availableSlots: number;
    status: string;
}

const eventCategories = [
    { name: "Fun Run", icon: Heart, color: "pink" },
    { name: "5K", icon: Zap, color: "info" },
    { name: "10K", icon: Target, color: "success" },
    { name: "Half Marathon", icon: TrendingUp, color: "warning" },
    { name: "Marathon", icon: Award, color: "failure" },
    { name: "Trail Run", icon: Mountain, color: "purple" },
];

export default function HomePage() {
    const router = useRouter();
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [location, setLocation] = useState("");
    const [events, setEvents] = useState<IEventData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await API.get("/events");
                // ambil hanya event yang sudah PUBLISHED
                const published = res.data.data.filter(
                    (ev: IEventData) =>
                        ev.status === "PUBLISHED" || ev.status === "CANCELLED"
                );
                setEvents(published);
            } catch (error) {
                console.error(error);
                toast.error("Gagal memuat data event");
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

    const formatCurrency = (value: number) =>
        value > 0
            ? new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
              }).format(value)
            : "Gratis";

    const handleGetTickets = (eventId: number) => {
        if (!user) {
            toast.info("Silakan login terlebih dahulu untuk membeli tiket.");
            router.push("/login");
            return;
        }
        router.push(`/dashboard/events/${eventId}/buy`);
    };

    return (
        <div className="bg-gray-50">
            {/* HERO SECTION */}
            <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Discover your next experience
                    </h1>
                    <p className="text-xl md:text-2xl text-orange-100 mb-10">
                        Find running events that match your passion
                    </p>

                    {/* Search bar */}
                    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-2xl p-4">
                        <div className="flex flex-col md:flex-row gap-3">
                            <div className="flex-1">
                                <TextInput
                                    icon={Search}
                                    placeholder="Search for events..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    sizing="lg"
                                />
                            </div>
                            <div className="md:w-64">
                                <TextInput
                                    icon={MapPin}
                                    placeholder="Location"
                                    value={location}
                                    onChange={(e) =>
                                        setLocation(e.target.value)
                                    }
                                    sizing="lg"
                                />
                            </div>
                            <Button
                                color="warning"
                                size="lg"
                                className="whitespace-nowrap"
                            >
                                <Search className="mr-2 h-5 w-5" />
                                Search
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* CATEGORY SECTION */}
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

            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Popular Events
                        </h2>
                        <Link
                            href="/events"
                            className="text-orange-600 hover:text-orange-700 font-semibold flex items-center"
                        >
                            See all
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </div>

                    {isLoading ? (
                        <p className="text-gray-500 text-center py-20">
                            Loading events...
                        </p>
                    ) : events.length === 0 ? (
                        <p className="text-gray-500 text-center py-20">
                            Belum ada event yang dipublikasikan.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {events.map((event: any) => (
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
                                                {formatDate(event.startDate)}
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
                                        <span className="text-xl font-bold text-blue-600">
                                            {formatCurrency(event.price)}
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
            </section>

            {/* WHY CHOOSE SECTION */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                        Why choose RunEvent?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Award,
                                title: "Quality Events",
                                desc: "Hundreds of trusted and verified running events across Indonesia",
                            },
                            {
                                icon: Zap,
                                title: "Fast Process",
                                desc: "Easy registration and tickets sent directly to your email",
                            },
                            {
                                icon: Users,
                                title: "Active Community",
                                desc: "Join thousands of runners and find new running friends",
                            },
                        ].map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.title} className="text-center">
                                    <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <Icon className="h-8 w-8 text-orange-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600">{item.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}
