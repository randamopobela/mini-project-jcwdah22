"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Spinner } from "flowbite-react";
import {
    ArrowLeft,
    Calendar,
    MapPin,
    CheckCircle,
    XCircle,
    CreditCard,
} from "lucide-react";
import API from "@/lib/axiosInstance";
import { toast } from "sonner";
import { TTransaction } from "@/types/transaction.type";

export default function TransactionDetailPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const [transaction, setTransaction] = useState<TTransaction | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                const res = await API.get(`/transaction/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                });
                setTransaction(res.data.data);
            } catch {
                toast.error("Gagal memuat detail transaksi.");
            } finally {
                setLoading(false);
            }
        };
        fetchTransaction();
    }, [id]);

    const handleStatusUpdate = async (status: string) => {
        try {
            await API.patch(
                `/transaction/${id}/status`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            toast.success(
                status === "PAID"
                    ? "Transaksi berhasil disetujui!"
                    : "Transaksi ditolak!"
            );
            router.push("/transactions");
        } catch {
            toast.error("Gagal memperbarui status transaksi.");
        }
    };

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );

    if (!transaction)
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Transaksi tidak ditemukan
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-blue-700 text-white py-12 shadow-lg">
                <div className="max-w-7xl mx-auto px-4">
                    <button
                        onClick={() => router.push("/transactions")}
                        className="inline-flex items-center space-x-2 text-white hover:text-orange-100 mb-4 transition"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span>Kembali</span>
                    </button>
                    <h1 className="text-4xl font-bold mb-2">
                        Detail Transaksi
                    </h1>
                    <p className="text-blue-100 text-lg">
                        Lihat dan kelola transaksi event Anda
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto py-12 px-6">
                <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
                    <h2 className="text-2xl font-bold mb-4">
                        {transaction.eventId?.title}
                    </h2>

                    <div className="text-gray-600 space-y-2 text-sm">
                        <p className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {transaction.eventId?.location}
                        </p>
                        <p className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(
                                transaction.eventId?.startDate ?? ""
                            ).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </p>
                        <p className="flex items-center">
                            <CreditCard className="w-4 h-4 mr-2" />
                            Metode Pembayaran: {transaction.paymentMethod}
                        </p>
                    </div>

                    <div className="mt-6">
                        <h3 className="font-semibold mb-2">Bukti Pembayaran</h3>
                        {transaction.paymentProof ? (
                            <img
                                src={transaction.paymentProof}
                                alt="Bukti Pembayaran"
                                className="rounded-lg border max-w-full"
                            />
                        ) : (
                            <p className="text-gray-500 text-sm">
                                Belum ada bukti pembayaran
                            </p>
                        )}
                    </div>

                    {transaction.status === "PENDING_CONFIRMATION" && (
                        <div className="flex gap-4 mt-6">
                            <Button
                                color="success"
                                onClick={() => handleStatusUpdate("PAID")}
                                className="flex-1"
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Terima Pembayaran
                            </Button>
                            <Button
                                color="failure"
                                onClick={() => handleStatusUpdate("REJECTED")}
                                className="flex-1"
                            >
                                <XCircle className="mr-2 h-4 w-4" />
                                Tolak Pembayaran
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
