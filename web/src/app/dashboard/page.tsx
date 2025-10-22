"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
    Calendar,
    Plus,
    Eye,
    Edit,
    Trash2,
    TrendingUp,
    DollarSign,
    Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import API from "@/lib/axiosInstance";

const statusStyles = {
    PUBLISHED: "bg-green-100 text-green-800",
    DRAFT: "bg-gray-100 text-gray-800",
    ONGOING: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-purple-100 text-purple-800",
    CANCELED: "bg-red-100 text-red-800",
};

export default function DashboardPage() {
    const [events, setEvents] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchMyEvents = async () => {
            try {
                const response = await API.get("/myevent/all", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                });
                setEvents(response.data.data); // karena backend kirim { message, data: events }
                console.log(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchMyEvents();
    }, []);

    console.log("isi dari fetch event: ", typeof events, events);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-r from-primary-600 to-blue-700 text-white py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-2">
                        Dashboard Organizer
                    </h1>
                    <p className="text-blue-100 text-lg">
                        Kelola event lari Anda dengan mudah
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <Calendar className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium mb-1">
                            Total Event
                        </h3>
                        <p className="text-3xl font-bold text-gray-900">12</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-green-100 p-3 rounded-lg">
                                <Users className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium mb-1">
                            Total Peserta
                        </h3>
                        <p className="text-3xl font-bold text-gray-900">
                            2,345
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-amber-100 p-3 rounded-lg">
                                <DollarSign className="h-6 w-6 text-amber-600" />
                            </div>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium mb-1">
                            Total Revenue
                        </h3>
                        <p className="text-3xl font-bold text-gray-900">
                            Rp 495M
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <TrendingUp className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium mb-1">
                            Pertumbuhan
                        </h3>
                        <p className="text-3xl font-bold text-gray-900">+23%</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Event Saya
                        </h2>
                        <Link
                            href="/dashboard/create-event"
                            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold inline-flex items-center space-x-2"
                        >
                            <Plus className="h-5 w-5" />
                            <span>Buat Event Baru</span>
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                                        Event
                                    </th>
                                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                                        Tanggal
                                    </th>
                                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                                        Status
                                    </th>
                                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map((event) => (
                                    <tr
                                        key={event.id}
                                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="py-4 px-4">
                                            <div className="flex items-center space-x-3">
                                                <img
                                                    src={`${process.env.NEXT_PUBLIC_API_URL}${event.eventPicture}`}
                                                    alt={event.title}
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {event.title}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {event.location}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="py-4 px-4 text-gray-700">
                                            {new Date(
                                                event.startDate
                                            ).toLocaleDateString("id-ID")}
                                        </td>

                                        <td className="py-4 px-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    statusStyles[
                                                        event.status as keyof typeof statusStyles
                                                    ]
                                                }`}
                                            >
                                                {event.status}
                                            </span>
                                        </td>

                                        <td className="py-4 px-4">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                    onClick={() =>
                                                        router.push(
                                                            `/dashboard/event/${event.id}`
                                                        )
                                                    }
                                                >
                                                    <Eye className="h-5 w-5" />
                                                </button>
                                                <button className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg">
                                                    <Edit className="h-5 w-5" />
                                                </button>
                                                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {events.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            Belum ada event dibuat.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
