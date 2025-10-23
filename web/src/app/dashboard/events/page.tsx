"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Eye,
    Edit,
    Trash2,
    PlusCircle,
    Calendar,
    ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import API from "@/lib/axiosInstance";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function EventsPage() {
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoading && !user) router.push("/login");
    }, [user, isLoading, router]);

    // Warna untuk status event
    const statusStyles: Record<string, string> = {
        DRAFT: "bg-gray-100 text-gray-700",
        PUBLISHED: "bg-green-100 text-green-700",
        ONGOING: "bg-blue-100 text-blue-700",
        COMPLETED: "bg-indigo-100 text-indigo-700",
        CANCELED: "bg-red-100 text-red-700",
    };

    // Fetch data event organizer
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await API.get("/myevent/all", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                });
                setEvents(res.data.data);
            } catch (error) {
                toast.error("Gagal memuat daftar event.");
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    // Hapus event
    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm(
            "Apakah Anda yakin ingin menghapus event ini?"
        );
        if (!confirmDelete) return;

        try {
            await API.delete(`/myevent/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            toast.success("Event berhasil dihapus!");
            setEvents((prev) => prev.filter((e) => e.id !== id));
        } catch {
            toast.error("Gagal menghapus event.");
        }
    };

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Memuat daftar event...
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-blue-700 text-white py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center space-x-2 text-white hover:text-blue-100 mb-4 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span>Kembali ke Dashboard</span>
                    </Link>
                    <h1 className="text-4xl font-bold mb-2">Daftar Event</h1>
                    <p className="text-blue-100 text-lg">
                        Kelola semua event yang Anda buat
                    </p>
                </div>
            </div>

            {/* Konten */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Tombol tambah event */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Event Saya
                    </h2>
                    <button
                        onClick={() => router.push("/dashboard/events/create")}
                        className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-5 py-3 rounded-lg font-semibold transition"
                    >
                        <PlusCircle className="h-5 w-5 mr-2" />
                        Buat Event
                    </button>
                </div>

                {/* Tabel Event */}
                <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
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
                                    Total Kuota
                                </th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                                    Tersisa
                                </th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                                    Harga
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
                                    {/* Kolom Event */}
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

                                    {/* Kolom Tanggal */}
                                    <td className="py-4 px-4 text-gray-700">
                                        {new Date(
                                            event.startDate
                                        ).toLocaleDateString("id-ID")}
                                    </td>

                                    {/* Kolom Status */}
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

                                    {/* Kolom Kuota */}
                                    <td className="py-4 px-4 text-gray-700">
                                        {event.totalSlots.toLocaleString()}
                                    </td>

                                    <td className="py-4 px-4 text-gray-700">
                                        {event.availableSlots.toLocaleString()}
                                    </td>

                                    {/* Kolom Harga */}
                                    <td className="py-4 px-4 text-gray-700">
                                        {event.price && event.price > 0
                                            ? `Rp ${event.price.toLocaleString()}`
                                            : "Gratis"}
                                    </td>

                                    {/* Kolom Aksi */}
                                    <td className="py-4 px-4">
                                        <div className="flex items-center space-x-2">
                                            {/* Detail */}
                                            <button
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                onClick={() =>
                                                    router.push(
                                                        `/dashboard/events/${event.id}/detail`
                                                    )
                                                }
                                            >
                                                <Eye className="h-5 w-5" />
                                            </button>

                                            {/* Edit */}
                                            <button
                                                className={`p-2 rounded-lg transition-colors ${
                                                    [
                                                        "PUBLISHED",
                                                        "ONGOING",
                                                        "COMPLETED",
                                                        "CANCELED",
                                                    ].includes(event.status)
                                                        ? "text-gray-400 bg-gray-50 cursor-not-allowed"
                                                        : "text-amber-600 hover:bg-amber-50"
                                                }`}
                                                disabled={[
                                                    "PUBLISHED",
                                                    "ONGOING",
                                                    "COMPLETED",
                                                    "CANCELED",
                                                ].includes(event.status)}
                                                onClick={() => {
                                                    if (
                                                        ![
                                                            "PUBLISHED",
                                                            "ONGOING",
                                                            "COMPLETED",
                                                            "CANCELED",
                                                        ].includes(event.status)
                                                    ) {
                                                        router.push(
                                                            `/dashboard/events/${event.id}/edit`
                                                        );
                                                    }
                                                }}
                                            >
                                                <Edit className="h-5 w-5" />
                                            </button>

                                            {/* Hapus */}
                                            <button
                                                className={`p-2 rounded-lg transition-colors ${
                                                    ["DRAFT"].includes(
                                                        event.status
                                                    )
                                                        ? "text-red-600 hover:bg-red-50"
                                                        : "text-gray-400 bg-gray-50 cursor-not-allowed"
                                                }`}
                                                disabled={[
                                                    "PUBLISHED",
                                                    "ONGOING",
                                                    "COMPLETED",
                                                    "CANCELED",
                                                ].includes(event.status)}
                                                onClick={() => {
                                                    if (
                                                        ["DRAFT"].includes(
                                                            event.status
                                                        )
                                                    ) {
                                                        handleDelete(event.id);
                                                    }
                                                }}
                                                title={
                                                    ["DRAFT"].includes(
                                                        event.status
                                                    )
                                                        ? "Hapus event"
                                                        : "Event yang sedang berlangsung atau sudah selesai tidak bisa dihapus"
                                                }
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Jika belum ada event */}
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
