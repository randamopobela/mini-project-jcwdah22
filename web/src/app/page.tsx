"use client";

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
import { useState } from "react";

const eventCategories = [
    { name: "Fun Run", icon: Heart, color: "pink" },
    { name: "5K", icon: Zap, color: "info" },
    { name: "10K", icon: Target, color: "success" },
    { name: "Half Marathon", icon: TrendingUp, color: "warning" },
    { name: "Marathon", icon: Award, color: "failure" },
    { name: "Trail Run", icon: Mountain, color: "purple" },
];

const featuredEvents = [
    {
        id: 1,
        title: "Jakarta Marathon 2025",
        date: "2025-11-15",
        location: "Jakarta",
        price: "Rp 250.000",
        image: "https://images.pexels.com/photos/2524739/pexels-photo-2524739.jpeg?auto=compress&cs=tinysrgb&w=800",
        category: "Marathon",
        participants: 1500,
    },
    {
        id: 2,
        title: "Bali Sunrise Run",
        date: "2025-12-01",
        location: "Bali",
        price: "Rp 150.000",
        image: "https://images.pexels.com/photos/2524738/pexels-photo-2524738.jpeg?auto=compress&cs=tinysrgb&w=800",
        category: "10K",
        participants: 800,
    },
    {
        id: 3,
        title: "Bandung Trail Challenge",
        date: "2025-11-20",
        location: "Bandung",
        price: "Rp 200.000",
        image: "https://images.pexels.com/photos/2524734/pexels-photo-2524734.jpeg?auto=compress&cs=tinysrgb&w=800",
        category: "Trail Run",
        participants: 600,
    },
    {
        id: 4,
        title: "Surabaya City Run",
        date: "2025-11-30",
        location: "Surabaya",
        price: "Rp 100.000",
        image: "https://images.pexels.com/photos/3621084/pexels-photo-3621084.jpeg?auto=compress&cs=tinysrgb&w=800",
        category: "5K",
        participants: 1200,
    },
];

export default function HomePage() {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [location, setLocation] = useState("");

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

            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Popular events in Jakarta
                        </h2>
                        <Link
                            href="/"
                            className="text-orange-600 hover:text-orange-700 font-semibold flex items-center"
                        >
                            See all
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredEvents.map((event) => (
                            <Card
                                key={event.id}
                                className="hover:shadow-xl transition-shadow cursor-pointer"
                                imgAlt={event.title}
                                imgSrc={event.image}
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
                                                event.date
                                            ).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "long",
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
                                            {event.participants} participants
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                                    <span className="text-xl font-bold text-orange-600">
                                        {event.price}
                                    </span>
                                    <Button size="sm" color="warning">
                                        Get tickets
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
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
                                Hundreds of trusted and verified running events
                                across Indonesia
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
                                Easy registration and tickets sent directly to
                                your email
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
                                Join thousands of runners and find new running
                                friends
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
