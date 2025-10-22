"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Calendar,
    MapPin,
    Users,
    DollarSign,
    ArrowLeft,
    Tag,
    Clock,
    CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import API from "@/lib/axiosInstance";
import { IEventData } from "@/types/event.type";

export default function EventDetailPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const [event, setEvent] = useState<IEventData | null>(null);
    const { user, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !user) router.push("/login");
    }, [user, isLoading, router]);

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
            }
        };
        if (id) fetchEvent();
    }, [id]);

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
            toast.success("Event berhasil dipublish");
            router.push("/dashboard");
        } catch {
            toast.error("Gagal mempublish event");
        }
    };

    if (!event)
        return (
            <div className="flex items-center justify-center h-[60vh] text-gray-500 text-lg">
                Memuat detail event...
            </div>
        );

    const formatDate = (date: Date) =>
        new Date(date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);

    const statusColors: Record<string, string> = {
        PUBLISHED: "bg-green-100 text-green-700",
        DRAFT: "bg-gray-100 text-gray-700",
        ONGOING: "bg-blue-100 text-blue-700",
        COMPLETED: "bg-purple-100 text-purple-700",
        CANCELED: "bg-red-100 text-red-700",
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Tombol kembali */}
                <button
                    onClick={() => router.push("/dashboard")}
                    className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Kembali ke Dashboard
                </button>

                {/* Gambar event */}
                <div className="relative w-full h-80 md:h-96 rounded-2xl overflow-hidden shadow-lg">
                    <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}${event.eventPicture}`}
                        alt={event.title}
                        className="object-cover w-full h-full"
                    />
                    <span
                        className={`absolute top-4 right-4 px-4 py-1.5 text-sm font-semibold rounded-full shadow-md ${
                            statusColors[event.status] ||
                            "bg-gray-100 text-gray-700"
                        }`}
                    >
                        {event.status}
                    </span>
                </div>

                {/* Header */}
                <div className="mt-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        {event.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-gray-500 mb-6">
                        <div className="flex items-center gap-1">
                            <Tag className="w-4 h-4 text-primary-600" />
                            <span className="text-sm capitalize">
                                {event.category
                                    .replaceAll("_", " ")
                                    .toLowerCase()}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">
                                Dibuat: {formatDate(event.createdAt)}
                            </span>
                        </div>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed mb-8">
                        {event.description}
                    </p>
                </div>

                {/* Informasi utama */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white shadow-md rounded-xl p-5 flex items-center space-x-3">
                        <Calendar className="text-blue-600 h-6 w-6" />
                        <div>
                            <p className="text-gray-500 text-sm">
                                Tanggal Event
                            </p>
                            <p className="font-semibold text-gray-900">
                                {formatDate(event.startDate)} –{" "}
                                {formatDate(event.endDate)}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-xl p-5 flex items-center space-x-3">
                        <MapPin className="text-red-600 h-6 w-6" />
                        <div>
                            <p className="text-gray-500 text-sm">Lokasi</p>
                            <p className="font-semibold text-gray-900">
                                {event.location}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-xl p-5 flex items-center space-x-3">
                        <Users className="text-green-600 h-6 w-6" />
                        <div>
                            <p className="text-gray-500 text-sm">
                                Slot Peserta
                            </p>
                            <p className="font-semibold text-gray-900">
                                {event.totalSlots - event.availableSlots} /{" "}
                                {event.totalSlots}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-xl p-5 flex items-center space-x-3">
                        <DollarSign className="text-amber-600 h-6 w-6" />
                        <div>
                            <p className="text-gray-500 text-sm">Harga Tiket</p>
                            <p className="font-semibold text-gray-900">
                                {event.isFree || event.price === 0
                                    ? "Gratis"
                                    : formatCurrency(event.price)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Status Section */}
                <div className="bg-white p-6 rounded-xl shadow-md mb-10 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                Status Event
                            </h3>
                            <p className="text-gray-500 text-sm">
                                {event.status === "PUBLISHED"
                                    ? "Event Anda sudah dipublikasikan dan terlihat oleh peserta."
                                    : "Event masih berstatus draft, Anda bisa mempublikasikannya kapan saja."}
                            </p>
                        </div>
                        {event.status === "PUBLISHED" ? (
                            <CheckCircle className="text-green-500 h-8 w-8" />
                        ) : (
                            <button
                                onClick={handlePublish}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md"
                            >
                                Publish Sekarang
                            </button>
                        )}
                    </div>
                </div>

                {/* Tombol kembali */}
                <div className="flex justify-center mt-8">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="px-8 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
                    >
                        Kembali ke Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
