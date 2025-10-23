"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Badge, Button } from "flowbite-react";
import {
    ArrowLeft,
    Calendar,
    MapPin,
    CreditCard,
    Clock,
    Ticket,
    Upload,
} from "lucide-react";
import API from "@/lib/axiosInstance";
import { toast } from "sonner";
import { TTransaction } from "@/types/transaction.type";

const statusColors: Record<string, string> = {
    AWAITING_PAYMENT: "bg-amber-100 text-amber-800",
    PENDING_CONFIRMATION: "bg-blue-100 text-blue-800",
    PAID: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    EXPIRED: "bg-gray-100 text-gray-800",
    CANCELED: "bg-gray-200 text-gray-700",
};

export default function PurchaseDetailPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const [transaction, setTransaction] = useState<TTransaction | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransaction();
    }, [id]);

    const fetchTransaction = async () => {
        try {
            const res = await API.get(`/purchase/${id}`);
            setTransaction(res.data.data);
        } catch (error) {
            toast.error("Gagal memuat detail transaksi.");
            router.push("/purchases");
        } finally {
            setLoading(false);
        }
    };

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen">
                Memuat detail transaksi...
            </div>
        );

    if (!transaction)
        return (
            <div className="text-center py-20">
                <h2 className="text-xl text-gray-600">
                    Transaksi tidak ditemukan
                </h2>
                <Link href="/purchases">
                    <Button color="blue" className="mt-4">
                        Kembali ke Daftar
                    </Button>
                </Link>
            </div>
        );

    const event = transaction.eventId;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-blue-700 text-white py-12 shadow-lg">
                <div className="max-w-7xl mx-auto px-4">
                    <button
                        onClick={() => router.push("/purchase")}
                        className="inline-flex items-center space-x-2 text-white hover:text-orange-100 mb-4 transition"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span>Kembali</span>
                    </button>
                    <h1 className="text-4xl font-bold mb-2">
                        Detail Transaksi
                    </h1>
                    <p className="text-blue-100 text-lg">
                        Lihat dan kelola pembelian tiket event Anda
                    </p>
                </div>
            </div>

            {/* Konten Detail */}
            <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                    {/* Event Info */}
                    <img
                        src={
                            event?.eventPicture
                                ? `${process.env.NEXT_PUBLIC_API_URL}${event.eventPicture}`
                                : "https://images.pexels.com/photos/2524739/pexels-photo-2524739.jpeg?auto=compress&cs=tinysrgb&w=400"
                        }
                        alt={event?.title}
                        className="w-full h-56 object-cover rounded-lg mb-4"
                    />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {event?.title}
                    </h2>
                    <div className="flex flex-wrap gap-3 text-gray-600 text-sm mb-6">
                        <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(event?.startDate).toLocaleDateString(
                                "id-ID",
                                {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                }
                            )}
                        </span>
                        <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />{" "}
                            {event?.location}
                        </span>
                    </div>

                    {/* Detail Transaksi */}
                    <div className="border-t border-gray-200 pt-4 space-y-3">
                        <div className="flex justify-between">
                            <span>ID Transaksi</span>
                            <span className="font-semibold">
                                TRX-
                                {transaction.id?.toString().padStart(6, "0")}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Status</span>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    statusColors[transaction.status]
                                }`}
                            >
                                {transaction.status.replaceAll("_", " ")}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Jumlah Tiket</span>
                            <span>{transaction.ticketQuantity}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Metode Pembayaran</span>
                            <span>{transaction.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Total Harga</span>
                            <span className="font-semibold text-blue-600">
                                Rp{" "}
                                {transaction.finalPrice.toLocaleString("id-ID")}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Dibuat pada</span>
                            <span>
                                {new Date(transaction.createdAt).toLocaleString(
                                    "id-ID"
                                )}
                            </span>
                        </div>
                    </div>

                    {/* Bukti Pembayaran */}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">
                            Bukti Pembayaran
                        </h3>
                        {transaction.paymentProof ? (
                            <img
                                src={`${process.env.NEXT_PUBLIC_API_URL}${transaction.paymentProof}`}
                                alt="Bukti Pembayaran"
                                className="w-full h-64 object-contain rounded-md border"
                            />
                        ) : (
                            <div className="text-gray-500 border border-dashed rounded-lg p-8 text-center">
                                Belum ada bukti pembayaran diunggah.
                            </div>
                        )}

                        {transaction.status === "AWAITING_PAYMENT" && (
                            <Link
                                href={`/purchase/${transaction.id}/upload-proof`}
                            >
                                <Button color="blue" className="mt-4">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload Bukti Pembayaran
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
