"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, MapPin, Users, DollarSign } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function EventDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [event, setEvent] = useState<any>(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/event/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                );
                setEvent(res.data);
            } catch {
                toast.error("Gagal memuat data event");
            }
        };
        fetchEvent();
    }, [id]);

    const handlePublish = async () => {
        try {
            await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/event/${id}/publish`,
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
        return <div className="p-10 text-center text-gray-500">Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto py-10 px-6">
            <img
                src={`${process.env.NEXT_PUBLIC_API_URL}${event.image}`}
                alt={event.title}
                className="w-full h-72 object-cover rounded-xl mb-6"
            />
            <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
            <p className="text-gray-500 mb-6">{event.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="flex items-center space-x-2">
                    <Calendar className="text-blue-500" />
                    <span>
                        {new Date(event.date).toLocaleDateString("id-ID")}
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <MapPin className="text-red-500" />
                    <span>{event.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Users className="text-green-500" />
                    <span>{event.participants || 0} peserta</span>
                </div>
                <div className="flex items-center space-x-2">
                    <DollarSign className="text-amber-500" />
                    <span>{event.revenue || "Rp 0"}</span>
                </div>
            </div>

            <div className="flex gap-4">
                {event.status === "DRAFT" && (
                    <button
                        onClick={handlePublish}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
                    >
                        Publish Event
                    </button>
                )}
                <button
                    onClick={() => router.push("/dashboard")}
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
                >
                    Kembali
                </button>
            </div>
        </div>
    );
}
