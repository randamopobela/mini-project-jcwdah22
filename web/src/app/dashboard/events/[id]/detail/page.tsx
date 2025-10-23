"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Calendar,
    MapPin,
    Users,
    DollarSign,
    ArrowLeft,
    CheckCircle,
    XCircle,
} from "lucide-react";
import API from "@/lib/axiosInstance";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function EventDetailPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Redirect jika belum login
    useEffect(() => {
        if (!isLoading && !user) router.push("/login");
    }, [user, isLoading, router]);

    // Fetch data event
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await API.get(`/myevent/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                });
                setEvent(res.data.data);
            } catch {
                toast.error("Gagal memuat data event");
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchEvent();
    }, [id]);

    // Tombol Publish
    const handlePublish = async () => {
        try {
            await API.patch(
                `/myevent/${id}/publish`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            toast.success("Event berhasil dipublish!");
            router.refresh();
            router.push("/dashboard/events");
        } catch {
            toast.error("Gagal mempublish event.");
        }
    };

    // Tombol Cancel
    const handleCancel = async () => {
        const confirmCancel = window.confirm(
            "Apakah Anda yakin ingin membatalkan event ini? Tindakan ini tidak dapat dibatalkan."
        );
        if (!confirmCancel) return;

        try {
            await API.patch(
                `/myevent/${id}/cancel`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            toast.success("Event berhasil dibatalkan!");
            router.push("/dashboard/events");
        } catch {
            toast.error("Gagal membatalkan event.");
        }
    };

    if (loading || !event)
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Memuat data event...
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-blue-700 text-white py-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() => router.push("/dashboard/events")}
                        className="inline-flex items-center space-x-2 text-white hover:text-blue-100 mb-4 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span>Kembali</span>
                    </button>
                    <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
                    <p className="text-blue-100 text-lg">Detail event Anda</p>
                </div>
            </div>

            {/* Konten */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                {/* Gambar */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}${event.eventPicture}`}
                        alt={event.title}
                        className="w-full h-72 object-cover"
                    />
                    <div className="p-8 space-y-8">
                        {/* Info Utama */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-3">
                                {event.title}
                            </h2>
                            <p className="text-gray-600">{event.description}</p>
                        </div>

                        {/* Detail Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 border-t border-gray-100 pt-6">
                            <div className="flex items-center space-x-2">
                                <Calendar className="text-blue-500 h-5 w-5" />
                                <span>
                                    {new Date(
                                        event.startDate
                                    ).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <MapPin className="text-red-500 h-5 w-5" />
                                <span>{event.location}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Users className="text-green-500 h-5 w-5" />
                                <span>
                                    {event.availableSlots}/{event.totalSlots}{" "}
                                    slot tersedia
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <DollarSign className="text-amber-500 h-5 w-5" />
                                <span>
                                    {event.isFree
                                        ? "Gratis"
                                        : `Rp ${event.price.toLocaleString(
                                              "id-ID"
                                          )}`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ✅ Status Section (dipertahankan sesuai permintaanmu) */}
                <div className="bg-white p-6 rounded-xl shadow-md mb-10 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                Status Event
                            </h3>
                            <p className="text-gray-500 text-sm">
                                {event.status === "PUBLISHED"
                                    ? "Event Anda sudah dipublikasikan dan terlihat oleh peserta."
                                    : event.status === "CANCELED"
                                    ? "Event ini telah dibatalkan dan tidak lagi tersedia untuk peserta."
                                    : "Event masih berstatus draft, Anda bisa mempublikasikannya kapan saja."}
                            </p>
                        </div>
                        {event.status === "PUBLISHED" ? (
                            <CheckCircle className="text-green-500 h-8 w-8" />
                        ) : event.status === "CANCELED" ? (
                            <XCircle className="text-red-500 h-8 w-8" />
                        ) : (
                            <CheckCircle className="text-gray-300 h-8 w-8" />
                        )}
                    </div>
                </div>

                {/* 🔘 Tombol Aksi di Bagian Bawah */}
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                    {event.status === "DRAFT" && (
                        <button
                            onClick={handlePublish}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md inline-flex items-center"
                        >
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Publish Event
                        </button>
                    )}

                    {event.status === "PUBLISHED" && (
                        <button
                            onClick={handleCancel}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md inline-flex items-center"
                        >
                            <XCircle className="h-5 w-5 mr-2" />
                            Batalkan Event
                        </button>
                    )}

                    {/* <button
                        onClick={() => router.push("/dashboard")}
                        className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
                    >
                        Kembali
                    </button> */}
                </div>
            </div>
        </div>
    );
}
