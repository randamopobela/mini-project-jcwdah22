"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Calendar, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import API from "@/lib/axiosInstance";
import { useAuth } from "@/contexts/AuthContext";

export default function VouchersPage() {
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const [vouchers, setVouchers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoading && !user) router.push("/login");
    }, [user, isLoading, router]);

    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const res = await API.get("/vouchers", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                });
                setVouchers(res.data.data);
            } catch {
                toast.error("Gagal memuat daftar voucher.");
            } finally {
                setLoading(false);
            }
        };
        fetchVouchers();
    }, []);

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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {vouchers.map((v) => (
                            <div
                                key={v.id}
                                className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition"
                            >
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    {v.voucherCode}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Diskon: Rp{" "}
                                    {v.discountAmount.toLocaleString("id-ID")}{" "}
                                    <br />
                                    Min. Pembelian: Rp{" "}
                                    {v.minimalPurchase.toLocaleString(
                                        "id-ID"
                                    )}{" "}
                                    <br />
                                    Maks. Diskon: Rp{" "}
                                    {v.maximalDiscount.toLocaleString("id-ID")}
                                </p>
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <div className="flex items-center space-x-1">
                                        <Calendar className="h-4 w-4 text-amber-500" />
                                        <span>
                                            {new Date(
                                                v.startDate
                                            ).toLocaleDateString("id-ID")}{" "}
                                            -{" "}
                                            {new Date(
                                                v.endDate
                                            ).toLocaleDateString("id-ID")}
                                        </span>
                                    </div>
                                    <div
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            v.isActive
                                                ? "bg-green-100 text-green-800"
                                                : "bg-gray-100 text-gray-800"
                                        }`}
                                    >
                                        {v.isActive ? "Aktif" : "Tidak Aktif"}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
