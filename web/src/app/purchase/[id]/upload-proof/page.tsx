"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UploadCloud } from "lucide-react";
import { Button, FileInput } from "flowbite-react";
import API from "@/lib/axiosInstance";
import { toast } from "sonner";

export default function UploadProofPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {
        if (!file) {
            toast.warning("Pilih file terlebih dahulu!");
            return;
        }

        const formData = new FormData();
        formData.append("paymentProof", file);

        setLoading(true);
        try {
            await API.patch(`/purchase/${id}/upload-proof`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("Bukti pembayaran berhasil diunggah!");
            router.push(`/purchase/${id}`);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Upload gagal.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 🔹 Header */}
            <div className="bg-gradient-to-r from-primary-600 to-blue-700 text-white py-12 shadow-lg">
                <div className="max-w-7xl mx-auto px-4">
                    <Link
                        href={`/purchase/${id}`}
                        className="inline-flex items-center space-x-2 text-white hover:text-orange-100 mb-4 transition"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span>Kembali</span>
                    </Link>
                    <h1 className="text-4xl font-bold mb-2">
                        Upload Bukti Pembayaran
                    </h1>
                    <p className="text-blue-100 text-lg">
                        Unggah bukti pembayaran untuk konfirmasi transaksi Anda
                    </p>
                </div>
            </div>

            {/* 🔹 Konten Upload */}
            <main className="max-w-lg mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 text-center">
                    <UploadCloud className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                        Unggah bukti pembayaran dalam format{" "}
                        <b>JPG, PNG, atau PDF</b>.
                    </p>

                    <FileInput
                        id="file-upload"
                        accept="image/*,application/pdf"
                        onChange={(e) =>
                            setFile(e.target.files ? e.target.files[0] : null)
                        }
                    />
                    {file && (
                        <p className="text-sm text-gray-600 mt-2">
                            File terpilih:{" "}
                            <span className="font-medium">{file.name}</span>
                        </p>
                    )}

                    <Button
                        color="blue"
                        onClick={handleUpload}
                        className="mt-6 w-full"
                        disabled={loading}
                    >
                        {loading ? "Mengunggah..." : "Upload Sekarang"}
                    </Button>
                </div>
            </main>
        </div>
    );
}
