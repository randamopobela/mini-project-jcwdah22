"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "flowbite-react";
import {
    Calendar,
    MapPin,
    Ticket,
    Eye,
    CreditCard,
    Clock,
    ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import API from "@/lib/axiosInstance";

import type { TTransaction } from "@/types/transaction.type";
import type { IEventData } from "@/types/event.type";

const statusStyles: Record<string, string> = {
    AWAITING_PAYMENT: "bg-amber-100 text-amber-800",
    PENDING_CONFIRMATION: "bg-yellow-100 text-yellow-800",
    PAID: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    EXPIRED: "bg-gray-100 text-gray-800",
    CANCELED: "bg-gray-200 text-gray-600",
};

export default function TransactionsPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    const [transactions, setTransactions] = useState<
        (TTransaction & { event?: IEventData })[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        if (!isLoading && !user) router.push("/login");
    }, [user, isLoading, router]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await API.get("/transaction", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                });
                setTransactions(res.data.data);
            } catch {
                toast.error("Gagal memuat transaksi.");
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchTransactions();
    }, [user]);

    if (isLoading || loading)
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Memuat transaksi...
            </div>
        );

    const filteredTransactions = transactions.filter((t) => {
        if (activeTab === 0) return true;
        if (activeTab === 1) return t.status === "PENDING_CONFIRMATION";
        if (activeTab === 2) return t.status === "PAID";
        return ["REJECTED", "EXPIRED"].includes(t.status);
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-blue-700 text-white py-12 shadow-lg">
                <div className="max-w-7xl mx-auto px-4">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="inline-flex items-center space-x-2 text-white hover:text-blue-100 mb-4 transition"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span>Kembali ke Dashboard</span>
                    </button>
                    <h1 className="text-4xl font-bold mb-2">Transaksi Tiket</h1>
                    <p className="text-blue-100 text-lg">
                        Lihat daftar transaksi event Anda
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex border-b border-gray-200 overflow-x-auto mb-6">
                    {[
                        { id: 0, label: "Semua Transaksi" },
                        { id: 1, label: "Menunggu Konfirmasi" },
                        { id: 2, label: "Sudah Dibayar" },
                        { id: 3, label: "Ditolak / Kadaluarsa" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors ${
                                activeTab === tab.id
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredTransactions.length === 0 ? (
                        <div className="col-span-full text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                Tidak ada transaksi
                            </h3>
                            <p className="text-gray-500">
                                Belum ada transaksi pada kategori ini.
                            </p>
                        </div>
                    ) : (
                        filteredTransactions.map((t) => (
                            <div
                                key={t.id}
                                className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 border border-gray-100"
                            >
                                <div className="flex flex-col md:flex-row gap-6">
                                    <img
                                        src={
                                            t.event?.eventPicture
                                                ? `${process.env.NEXT_PUBLIC_API_URL}${t.event.eventPicture}`
                                                : "https://images.pexels.com/photos/2524739/pexels-photo-2524739.jpeg?auto=compress&cs=tinysrgb&w=400"
                                        }
                                        alt={t.event?.title}
                                        className="w-full md:w-48 h-32 rounded-lg object-cover"
                                    />

                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-lg font-bold text-gray-900">
                                                    {t.event?.title}
                                                </h3>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                        statusStyles[
                                                            t.status
                                                        ] ||
                                                        "bg-gray-100 text-gray-700"
                                                    }`}
                                                >
                                                    {t.status.replaceAll(
                                                        "_",
                                                        " "
                                                    )}
                                                </span>
                                            </div>

                                            <div className="space-y-1 text-sm text-gray-600">
                                                <p className="flex items-center">
                                                    <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                                                    {t.event?.location}
                                                </p>
                                                <p className="flex items-center">
                                                    <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                                                    {new Date(
                                                        t.event?.startDate ?? ""
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                        {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                </p>
                                                <p className="flex items-center">
                                                    <Ticket className="w-4 h-4 mr-2 text-blue-500" />
                                                    {t.ticketQuantity} Tiket
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            <div>
                                                <p className="text-xl font-bold text-blue-600">
                                                    Rp{" "}
                                                    {t.finalPrice.toLocaleString(
                                                        "id-ID"
                                                    )}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    ID: TRX-
                                                    {t.id
                                                        ?.toString()
                                                        .padStart(6, "0")}
                                                </p>
                                            </div>

                                            <Link
                                                href={`/transactions/${t.id}`}
                                            >
                                                <Button
                                                    size="sm"
                                                    color="blue"
                                                    className="w-full flex items-center justify-center"
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Detail
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
