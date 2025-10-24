"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PlusCircle, Calendar, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import API from "@/lib/axiosInstance";
import { useAuth } from "@/contexts/AuthContext";

export default function VouchersPage() {
    const router = useRouter();
    const { id } = useParams() as { id: string };
    const { user, isLoading } = useAuth();
    const [vouchers, setVouchers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoading && !user) router.push("/login");
    }, [user, isLoading, router]);

    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const res = await API.get(`/myevent/${id}/vouchers`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                });
                setVouchers(res.data.data);
            } catch (err) {
                toast.error("Gagal memuat voucher untuk event ini.");
            }
        };
        fetchVouchers();
    }, []);

    console.log(vouchers);

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Memuat daftar voucher...
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 to-orange-500 text-white py-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="inline-flex items-center space-x-2 text-white hover:text-orange-100 mb-4 transition"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span>Kembali ke Dashboard</span>
                    </button>
                    <h1 className="text-4xl font-bold mb-2">Daftar Voucher</h1>
                    <p className="text-orange-100 text-lg">
                        Semua voucher yang Anda buat untuk event Anda
                    </p>
                </div>
            </div>

            {/* Konten */}
            <div className="max-w-5xl mx-auto px-4 py-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Voucher Saya
                    </h2>
                    <button
                        onClick={() =>
                            router.push("/dashboard/vouchers/create")
                        }
                        className="inline-flex items-center bg-amber-600 hover:bg-amber-700 text-white px-5 py-3 rounded-lg font-semibold transition"
                    >
                        <PlusCircle className="h-5 w-5 mr-2" />
                        Tambah Voucher
                    </button>
                </div>

                {vouchers.length === 0 ? (
                    <div className="text-center py-16 text-gray-500 border border-dashed rounded-xl">
                        Belum ada voucher yang dibuat.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vouchers.map((v) => (
                            <div
                                key={v.id}
                                className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-200"
                            >
                                {/* Header */}
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {v.voucherCode}
                                    </h3>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            v.isActive
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-600"
                                        }`}
                                    >
                                        {v.isActive ? "Aktif" : "Tidak Aktif"}
                                    </span>
                                </div>

                                {/* Detail Diskon */}
                                <div className="text-gray-700 text-sm space-y-2 mb-4">
                                    <p>
                                        <span className="font-semibold">
                                            Nominal Diskon:
                                        </span>{" "}
                                        Rp{" "}
                                        {v.discountAmount.toLocaleString(
                                            "id-ID"
                                        )}
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            Minimal Pembelian:
                                        </span>{" "}
                                        Rp{" "}
                                        {v.minimalPurchase.toLocaleString(
                                            "id-ID"
                                        )}
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            Maksimal Diskon:
                                        </span>{" "}
                                        Rp{" "}
                                        {v.maximalDiscount.toLocaleString(
                                            "id-ID"
                                        )}
                                    </p>
                                </div>

                                {/* Tanggal Berlaku */}
                                <div className="flex items-center text-sm text-gray-500 mb-4">
                                    <Calendar className="h-4 w-4 text-amber-500 mr-2" />
                                    <span>
                                        {new Date(
                                            v.startDate
                                        ).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}{" "}
                                        –{" "}
                                        {new Date(v.endDate).toLocaleDateString(
                                            "id-ID",
                                            {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            }
                                        )}
                                    </span>
                                </div>

                                {/* Info Event (jika ada relasi event di API) */}
                                {v.event && (
                                    <div className="mt-2 border-t pt-3">
                                        <p className="text-sm text-gray-500">
                                            <span className="font-semibold text-gray-700">
                                                {v.event.title}
                                            </span>{" "}
                                            • {v.event.location}
                                        </p>
                                    </div>
                                )}

                                {/* Tombol Aksi */}
                                <div className="mt-6 flex justify-between items-center">
                                    <button
                                        className="px-4 py-2 text-sm bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 font-medium transition"
                                        onClick={() =>
                                            console.log("Edit voucher", v.id)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className={`px-4 py-2 text-sm rounded-lg font-medium transition ${
                                            v.isActive
                                                ? "bg-red-50 text-red-600 hover:bg-red-100"
                                                : "bg-green-50 text-green-700 hover:bg-green-100"
                                        }`}
                                        onClick={() =>
                                            console.log("Toggle active", v.id)
                                        }
                                    >
                                        {v.isActive
                                            ? "Nonaktifkan"
                                            : "Aktifkan"}
                                    </button>
                                </div>
                            </div>
                        ))}

                        {vouchers.length === 0 && (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                Belum ada voucher yang dibuat.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
