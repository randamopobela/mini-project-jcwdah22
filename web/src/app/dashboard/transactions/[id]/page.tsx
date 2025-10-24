"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Spinner, Badge } from "flowbite-react";
import {
    ArrowLeft,
    Calendar,
    MapPin,
    CheckCircle,
    XCircle,
    CreditCard,
    User,
    Ticket,
    Clock,
} from "lucide-react";
import API from "@/lib/axiosInstance";
import { toast } from "sonner";
import { TTransaction } from "@/types/transaction.type";

export default function TransactionDetailPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();

    const [transaction, setTransaction] = useState<TTransaction | null>(null);
    const [loading, setLoading] = useState(true);

    // ✅ Fetch detail transaksi
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

    // ✅ Update status transaksi (Approve / Reject)
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
            router.push("/dashboard/transactions");
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

    // ✅ Gabungkan URL bukti pembayaran
    const paymentProofUrl = transaction.paymentProof
        ? `${process.env.NEXT_PUBLIC_API_URL}${transaction.paymentProof}`
        : null;

    // ✅ Format tanggal
    const formatDate = (date: string | Date) =>
        new Date(date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-blue-700 text-white py-12 shadow-lg">
                <div className="max-w-7xl mx-auto px-4">
                    <button
                        onClick={() => router.push("/dashboard/transactions")}
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
                    {/* 🧾 Info Event */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {transaction.event?.title}
                        </h2>
                        <Badge
                            color={
                                transaction.status === "PAID"
                                    ? "success"
                                    : transaction.status ===
                                      "PENDING_CONFIRMATION"
                                    ? "warning"
                                    : transaction.status === "REJECTED"
                                    ? "failure"
                                    : "gray"
                            }
                        >
                            {transaction.status.replaceAll("_", " ")}
                        </Badge>
                    </div>

                    <div className="text-gray-600 space-y-2 text-sm">
                        <p className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {transaction.event?.location}
                        </p>
                        <p className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {formatDate(transaction.event?.startDate ?? "")}
                        </p>
                    </div>

                    {/* 👤 Info Pembeli */}
                    <div className="mt-6 border-t pt-4">
                        <h3 className="font-semibold mb-3 flex items-center">
                            <User className="w-4 h-4 mr-2" /> Informasi Pembeli
                        </h3>
                        <p className="text-sm text-gray-700">
                            <span className="font-semibold">
                                {transaction.user?.firstName}{" "}
                                {transaction.user?.lastName}
                            </span>
                        </p>
                        <p className="text-sm text-gray-600">
                            {transaction.user?.email}
                        </p>
                    </div>

                    {/* 💳 Info Pembayaran */}
                    <div className="mt-6 border-t pt-4">
                        <h3 className="font-semibold mb-3 flex items-center">
                            <CreditCard className="w-4 h-4 mr-2" /> Detail
                            Pembayaran
                        </h3>

                        <ul className="text-sm text-gray-700 space-y-1">
                            <li>
                                <Ticket className="inline w-4 h-4 mr-1 text-blue-500" />
                                Jumlah Tiket:{" "}
                                <span className="font-semibold">
                                    {transaction.ticketQuantity}
                                </span>
                            </li>
                            <li>
                                <Clock className="inline w-4 h-4 mr-1 text-blue-500" />
                                Tanggal Transaksi:{" "}
                                {formatDate(transaction.createdAt)}
                            </li>
                            <li>
                                Metode Pembayaran:{" "}
                                <span className="font-semibold uppercase">
                                    {transaction.paymentMethod || "-"}
                                </span>
                            </li>
                            <li>
                                Total Harga:{" "}
                                <span className="font-bold text-blue-600">
                                    Rp{" "}
                                    {transaction.finalPrice.toLocaleString(
                                        "id-ID"
                                    )}
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* 📎 Bukti Pembayaran */}
                    <div className="mt-6 border-t pt-4">
                        <h3 className="font-semibold mb-3">Bukti Pembayaran</h3>
                        {paymentProofUrl ? (
                            paymentProofUrl.endsWith(".pdf") ? (
                                <a
                                    href={paymentProofUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline text-sm"
                                >
                                    Lihat Bukti Pembayaran (PDF)
                                </a>
                            ) : (
                                <img
                                    src={paymentProofUrl}
                                    alt="Bukti Pembayaran"
                                    className="rounded-lg border max-w-full shadow-sm"
                                />
                            )
                        ) : (
                            <p className="text-gray-500 text-sm">
                                Belum ada bukti pembayaran.
                            </p>
                        )}
                    </div>

                    {/* ✅ Tombol Approve / Reject */}
                    {transaction.status === "PENDING_CONFIRMATION" && (
                        <div className="flex gap-4 mt-6">
                            <Button
                                color="green"
                                onClick={() => handleStatusUpdate("PAID")}
                                className="flex-1"
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Terima Pembayaran
                            </Button>
                            <Button
                                color="red"
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
