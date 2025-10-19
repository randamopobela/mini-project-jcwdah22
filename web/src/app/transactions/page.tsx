"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Badge, Button } from "flowbite-react";
import {
    Calendar,
    MapPin,
    Ticket,
    Eye,
    Upload,
    CreditCard,
    Clock,
} from "lucide-react";

// import { Transaction } from "@/types";

// 🔹 Data Mock Transaksi
const mockTransactions: Transaction[] = [
    {
        id: 1,
        userId: "1",
        eventId: 1,
        quantity: 2,
        totalPrice: 500000,
        paymentMethod: "BANK_TRANSFER",
        paymentProof: "https://example.com/proof1.jpg",
        status: "PENDING",
        expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        event: {
            id: 1,
            title: "Jakarta Marathon 2024",
            category: "MARATHON",
            location: "Jakarta, Indonesia",
            startDate: "2024-11-15",
            endDate: "2024-11-15",
            price: 250000,
            availableSlots: 750,
            totalSlots: 1000,
            organizerId: "2",
            status: "PUBLISHED",
            isFree: false,
            description: "Marathon event di Jakarta",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    },
    {
        id: 2,
        userId: "1",
        eventId: 2,
        quantity: 1,
        totalPrice: 150000,
        paymentMethod: "E_WALLET",
        status: "PAID",
        expiredAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        event: {
            id: 2,
            title: "Bali Fun Run",
            category: "FUN_RUN",
            location: "Bali, Indonesia",
            startDate: "2024-11-22",
            endDate: "2024-11-22",
            price: 150000,
            availableSlots: 500,
            totalSlots: 500,
            organizerId: "2",
            status: "PUBLISHED",
            isFree: false,
            description: "Fun run di Bali",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    },
];

// 🔹 Mapping Status
const statusStyles: Record<string, string> = {
    PAID: "bg-green-100 text-green-800",
    PENDING: "bg-amber-100 text-amber-800",
    REJECTED: "bg-red-100 text-red-800",
    EXPIRED: "bg-gray-100 text-gray-800",
};

export default function TransactionsPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Memuat...
            </div>
        );
    }

    const filteredTransactions = mockTransactions.filter((t) => {
        if (activeTab === 0) return true;
        if (activeTab === 1) return t.status === "PENDING";
        if (activeTab === 2) return t.status === "PAID";
        return t.status === "REJECTED" || t.status === "EXPIRED";
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 🔹 Hero Section */}
            <div className="bg-gradient-to-r from-primary-600 to-blue-700 text-white py-12 shadow-lg">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-2">Transaksi Tiket</h1>
                    <p className="text-blue-100 text-lg">
                        Lihat dan kelola transaksi pembelian tiket event Anda
                    </p>
                </div>
            </div>

            {/* 🔹 Tabs */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex border-b border-gray-200 overflow-x-auto mb-6">
                    {[
                        { id: 0, label: "Semua Transaksi" },
                        { id: 1, label: "Menunggu Pembayaran" },
                        { id: 2, label: "Dibayar" },
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

                {/* 🔹 Daftar Transaksi */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredTransactions.length === 0 ? (
                        <div className="col-span-full text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                Belum Ada Transaksi
                            </h3>
                            <p className="text-gray-500">
                                Mulai ikuti event seru dan dapatkan tiketmu
                                sekarang!
                            </p>
                            <Link href="/events">
                                <Button color="info" className="mt-6">
                                    Lihat Event
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        filteredTransactions.map((transaction) => (
                            <div
                                key={transaction.id}
                                className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 border border-gray-100"
                            >
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Gambar Event */}
                                    <img
                                        src={
                                            transaction.event?.category ===
                                            "MARATHON"
                                                ? "https://images.pexels.com/photos/2524739/pexels-photo-2524739.jpeg?auto=compress&cs=tinysrgb&w=400"
                                                : "https://images.pexels.com/photos/2524738/pexels-photo-2524738.jpeg?auto=compress&cs=tinysrgb&w=400"
                                        }
                                        alt={transaction.event?.title}
                                        className="w-full md:w-48 h-32 rounded-lg object-cover"
                                    />

                                    {/* Detail Transaksi */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-lg font-bold text-gray-900">
                                                    {transaction.event?.title}
                                                </h3>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                        statusStyles[
                                                            transaction.status
                                                        ] || "bg-gray-100"
                                                    }`}
                                                >
                                                    {transaction.status ===
                                                    "PAID"
                                                        ? "Dibayar"
                                                        : transaction.status ===
                                                          "PENDING"
                                                        ? "Menunggu Pembayaran"
                                                        : transaction.status ===
                                                          "EXPIRED"
                                                        ? "Kadaluarsa"
                                                        : transaction.status ===
                                                          "REJECTED"
                                                        ? "Ditolak"
                                                        : transaction.status}
                                                </span>
                                            </div>

                                            <div className="space-y-1 text-sm text-gray-600">
                                                <p className="flex items-center">
                                                    <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                                                    {
                                                        transaction.event
                                                            ?.location
                                                    }
                                                </p>
                                                <p className="flex items-center">
                                                    <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                                                    {transaction.event &&
                                                        new Date(
                                                            transaction.event.startDate
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
                                                    {transaction.quantity} Tiket
                                                </p>
                                                <p className="flex items-center">
                                                    <Clock className="w-4 h-4 mr-2 text-blue-500" />
                                                    {new Date(
                                                        transaction.createdAt
                                                    ).toLocaleString("id-ID", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Harga + Tombol */}
                                        <div className="flex items-center justify-between mt-4">
                                            <div>
                                                <p className="text-xl font-bold text-blue-600">
                                                    Rp{" "}
                                                    {transaction.totalPrice.toLocaleString(
                                                        "id-ID"
                                                    )}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    ID: TRX-
                                                    {transaction.id
                                                        .toString()
                                                        .padStart(6, "0")}
                                                </p>
                                            </div>

                                            <div className="flex flex-col gap-2 w-32">
                                                <Link
                                                    href={`/transactions/${transaction.id}`}
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

                                                {transaction.status ===
                                                    "PENDING" &&
                                                    !transaction.paymentProof && (
                                                        <Button
                                                            size="sm"
                                                            color="gray"
                                                            className="w-full flex items-center justify-center"
                                                        >
                                                            <Upload className="mr-2 h-4 w-4" />
                                                            Upload Bukti
                                                        </Button>
                                                    )}
                                            </div>
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
