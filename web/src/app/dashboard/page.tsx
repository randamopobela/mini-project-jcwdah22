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
    TicketPlus,
    CreditCard,
} from "lucide-react";
import { useRouter } from "next/navigation";
import API from "@/lib/axiosInstance";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const statusStyles = {
    PUBLISHED: "bg-green-100 text-green-800",
    DRAFT: "bg-gray-100 text-gray-800",
    ONGOING: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-purple-100 text-purple-800",
    CANCELED: "bg-red-100 text-red-800",
};

export default function DashboardPage() {
    const [events, setEvents] = useState<any[]>([]);
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) router.push("/login");
    }, [user, isLoading, router]);

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
            } catch (err) {
                console.error(err);
            }
        };

        fetchMyEvents();
    }, []);

    const handleDelete = async (eventId: string) => {
        // Konfirmasi sebelum menghapus
        const confirmDelete = window.confirm(
            "Apakah Anda yakin ingin menghapus event ini? Tindakan ini tidak dapat dibatalkan."
        );

        if (!confirmDelete) return;

        try {
            // Panggil endpoint delete
            await API.delete(`/myevent/${eventId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            // Tampilkan notifikasi sukses
            toast.success("Event berhasil dihapus!");

            // Refresh daftar event setelah dihapus
            setEvents((prev) => prev.filter((e: any) => e.id !== eventId));
        } catch (error: any) {
            console.error(error);
            toast.error("Gagal menghapus event. Silakan coba lagi.");
        }
    };

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

                <div className="md:grid-cols-4 gap-6 mb-8">
                    {/* Section Event */}
                    <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100 hover:shadow-xl transition">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <Calendar className="text-primary-600 h-6 w-6" />
                                Event Saya
                            </h2>
                            <Link
                                href="/dashboard/events"
                                className="text-primary-600 hover:text-primary-700 font-semibold"
                            >
                                Lihat Semua →
                            </Link>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Kelola dan pantau seluruh event yang Anda buat.
                        </p>
                        <Link
                            href="/dashboard/events/create"
                            className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                        >
                            <Calendar className="h-5 w-5 mr-2" /> Buat Event
                            Baru
                        </Link>
                    </div>

                    {/* Section Voucher */}
                    <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100 hover:shadow-xl transition">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <TicketPlus className="text-amber-600 h-6 w-6" />
                                Voucher Saya
                            </h2>
                            <Link
                                href="/dashboard/vouchers"
                                className="text-amber-600 hover:text-amber-700 font-semibold"
                            >
                                Lihat Semua →
                            </Link>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Buat dan kelola voucher promosi untuk event Anda.
                        </p>
                        <Link
                            href="/dashboard/vouchers/create"
                            className="inline-flex items-center bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                        >
                            <TicketPlus className="h-5 w-5 mr-2" /> Buat Voucher
                            Baru
                        </Link>
                    </div>

                    {/* 💳 Section Transaksi */}
                    <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100 hover:shadow-xl transition">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <CreditCard className="text-green-600 h-6 w-6" />
                                Transaksi Saya
                            </h2>
                            <Link
                                href="/dashboard/transactions"
                                className="text-green-600 hover:text-green-700 font-semibold"
                            >
                                Lihat Semua →
                            </Link>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Pantau pembayaran dan status transaksi peserta di
                            setiap event Anda.
                        </p>
                        <Link
                            href="/dashboard/transactions"
                            className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                        >
                            <CreditCard className="h-5 w-5 mr-2" /> Lihat
                            Transaksi
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
