"use client";

import Link from "next/link";
import {
    Calendar,
    Plus,
    Users,
    DollarSign,
    TrendingUp,
    Eye,
    Edit,
    Trash2,
    MoreVertical,
} from "lucide-react";
import { useState } from "react";

const myEvents = [
    {
        id: 1,
        title: "Jakarta Marathon 2025",
        date: "2025-11-15",
        location: "Jakarta",
        status: "PUBLISHED",
        participants: 1500,
        revenue: "Rp 375.000.000",
        image: "https://images.pexels.com/photos/2524739/pexels-photo-2524739.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
        id: 2,
        title: "Bali Sunrise Run",
        date: "2025-12-01",
        location: "Bali",
        status: "PUBLISHED",
        participants: 800,
        revenue: "Rp 120.000.000",
        image: "https://images.pexels.com/photos/2524738/pexels-photo-2524738.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
        id: 3,
        title: "Bandung Trail Challenge",
        date: "2025-11-20",
        location: "Bandung",
        status: "DRAFT",
        participants: 0,
        revenue: "Rp 0",
        image: "https://images.pexels.com/photos/2524734/pexels-photo-2524734.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
];

const statusStyles = {
    PUBLISHED: "bg-green-100 text-green-800",
    DRAFT: "bg-gray-100 text-gray-800",
    ONGOING: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-purple-100 text-purple-800",
    CANCELED: "bg-red-100 text-red-800",
};

export default function DashboardPage() {
    const [activeMenu, setActiveMenu] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-r from-primary-600 to-blue-700 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold mb-2">
                        Dashboard Organizer
                    </h1>
                    <p className="text-blue-100 text-lg">
                        Kelola event lari Anda dengan mudah
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                                        Peserta
                                    </th>
                                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                                        Revenue
                                    </th>
                                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {myEvents.map((event) => (
                                    <tr
                                        key={event.id}
                                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="py-4 px-4">
                                            <div className="flex items-center space-x-3">
                                                <img
                                                    src={event.image}
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
                                                event.date
                                            ).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
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
                                        <td className="py-4 px-4 text-gray-700">
                                            {event.participants}
                                        </td>
                                        <td className="py-4 px-4 text-gray-700">
                                            {event.revenue}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center space-x-2">
                                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Eye className="h-5 w-5" />
                                                </button>
                                                <button className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                                                    <Edit className="h-5 w-5" />
                                                </button>
                                                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {myEvents.length === 0 && (
                        <div className="text-center py-12">
                            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                Belum Ada Event
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Mulai buat event lari pertama Anda sekarang
                            </p>
                            <Link
                                href="/dashboard/create-event"
                                className="inline-flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                            >
                                <Plus className="h-5 w-5" />
                                <span>Buat Event Baru</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
