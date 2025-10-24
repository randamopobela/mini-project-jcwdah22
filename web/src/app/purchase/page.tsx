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
    ArrowLeft,
} from "lucide-react";
import API from "@/lib/axiosInstance";
import { toast } from "sonner";
import { TTransaction } from "@/types/transaction.type";

const statusStyles: Record<string, string> = {
    PAID: "bg-green-100 text-green-800",
    AWAITING_PAYMENT: "bg-amber-100 text-amber-800",
    PENDING_CONFIRMATION: "bg-blue-100 text-blue-800",
    REJECTED: "bg-red-100 text-red-800",
    EXPIRED: "bg-gray-100 text-gray-800",
};

export default function TransactionsPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [transactions, setTransactions] = useState<TTransaction[]>([]);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        } else {
            fetchTransactions();
        }
    }, [user, isLoading]);

    const fetchTransactions = async () => {
        try {
            const res = await API.get("/purchase");
            setTransactions(res.data.data || []);
        } catch (error) {
            toast.error("Gagal memuat transaksi Anda.");
        }
    };

    console.log(transactions);
    const filteredTransactions = transactions.filter((t) => {
        if (activeTab === 0) return true;
        if (activeTab === 1) return t.status === "AWAITING_PAYMENT";
        if (activeTab === 2) return t.status === "PAID";
        return t.status === "REJECTED" || t.status === "EXPIRED";
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Memuat...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/*  Hero Section */}
            <div className="bg-gradient-to-r from-primary-600 to-blue-700 text-white py-12 shadow-lg">
                <div className="max-w-7xl mx-auto px-4">
                    <button
                        onClick={() => router.push("/")}
                        className="inline-flex items-center space-x-2 text-white hover:text-orange-100 mb-4 transition"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span>Kembali ke Beranda</span>
                    </button>
                    <h1 className="text-4xl font-bold mb-2">Pembelian Tiket</h1>
                    <p className="text-blue-100 text-lg">
                        Lihat dan kelola pembelian tiket event Anda
                    </p>
                </div>
            </div>

            {/*  Tabs */}
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

                {/*  Daftar Transaksi */}
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
                                            transaction.event?.eventPicture
                                                ? `${process.env.NEXT_PUBLIC_API_URL}${transaction.event.eventPicture}`
                                                : "https://images.pexels.com/photos/2524739/pexels-photo-2524739.jpeg?auto=compress&cs=tinysrgb&w=400"
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
                                                    {transaction.status.replaceAll(
                                                        "_",
                                                        " "
                                                    )}
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
                                                    {transaction.ticketQuantity}{" "}
                                                    Tiket
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
                                                    {transaction.finalPrice.toLocaleString(
                                                        "id-ID"
                                                    )}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    ID: TRX-
                                                    {transaction.id
                                                        ?.toString()
                                                        .padStart(6, "0")}
                                                </p>
                                            </div>

                                            <div className="flex flex-col gap-2 w-32">
                                                <Link
                                                    href={`/purchase/${transaction.id}`}
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
                                                    "AWAITING_PAYMENT" && (
                                                    <>
                                                        {/* Jika sudah ada bukti pembayaran */}
                                                        {transaction.paymentProof ? (
                                                            <div className="w-full text-center">
                                                                <p className="text-sm text-gray-700 mb-2 font-medium">
                                                                    Bukti
                                                                    Pembayaran
                                                                </p>

                                                                {/* Tampilkan gambar atau PDF */}
                                                                {transaction.paymentProof.endsWith(
                                                                    ".pdf"
                                                                ) ? (
                                                                    <a
                                                                        href={`${process.env.NEXT_PUBLIC_API_URL}${transaction.paymentProof}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-blue-600 underline text-sm"
                                                                    >
                                                                        Lihat
                                                                        File PDF
                                                                    </a>
                                                                ) : (
                                                                    <img
                                                                        src={`${process.env.NEXT_PUBLIC_API_URL}${transaction.paymentProof}`}
                                                                        alt="Bukti Pembayaran"
                                                                        className="rounded-lg w-full h-40 object-cover border border-gray-200 shadow-sm"
                                                                    />
                                                                )}
                                                            </div>
                                                        ) : (
                                                            // Jika belum ada bukti pembayaran
                                                            <Link
                                                                href={`/purchase/${transaction.id}`}
                                                            >
                                                                <Button
                                                                    size="sm"
                                                                    color="gray"
                                                                    className="w-full flex items-center justify-center"
                                                                >
                                                                    <Upload className="mr-2 h-4 w-4" />
                                                                    Upload Bukti
                                                                </Button>
                                                            </Link>
                                                        )}
                                                    </>
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
