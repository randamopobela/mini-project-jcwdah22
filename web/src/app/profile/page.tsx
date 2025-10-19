"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Button } from "flowbite-react";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Shield,
    Gift,
    Calendar,
    LogOut,
    Trophy,
    Settings,
} from "lucide-react";

export default function ProfilePage() {
    const { user, isLoading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Memuat...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary-600 to-blue-700 text-white py-12 shadow-lg">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-2">Profil Saya</h1>
                    <p className="text-blue-100 text-lg">
                        Kelola identitas dan informasi akun Anda di sini
                    </p>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-4 py-12">
                {/* Profil Card */}
                <div className="bg-white rounded-2xl shadow-md p-8 mb-10">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        <div className="relative">
                            <img
                                src={
                                    user.profilePicture || "/images/avatar.png"
                                }
                                alt="Profile Avatar"
                                className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow-md"
                            />
                            <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-full">
                                Ganti Foto
                            </button>
                        </div>

                        <div className="flex-1">
                            <h2 className="text-3xl font-bold text-gray-900 mb-1">
                                {user.firstName} {user.lastName}
                            </h2>
                            <p className="text-gray-600 mb-4 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-blue-500" />{" "}
                                {user.email}
                            </p>

                            <div className="flex flex-wrap gap-3">
                                <Link href="/profile/edit-profile">
                                    <Button
                                        color="gray"
                                        className="px-5 py-2.5 font-semibold"
                                    >
                                        <Settings className="w-4 h-4 mr-2" />{" "}
                                        Edit Profil
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-8"></div>

                    {/* Informasi Pribadi */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoCard
                            icon={<Phone className="w-5 h-5 text-blue-600" />}
                            label="Nomor Telepon"
                            value={user.phone || "-"}
                        />
                        <InfoCard
                            icon={<MapPin className="w-5 h-5 text-blue-600" />}
                            label="Alamat"
                            value={user.address || "-"}
                        />
                        <InfoCard
                            icon={<Shield className="w-5 h-5 text-blue-600" />}
                            label="Role Akun"
                            value={
                                user.role === "ORGANIZER"
                                    ? "Organizer"
                                    : "Customer"
                            }
                        />
                        <InfoCard
                            icon={<Gift className="w-5 h-5 text-blue-600" />}
                            label="Kode Referral"
                            value={user.referralCode || "-"}
                        />
                    </div>
                </div>

                {/* Statistik Pengguna */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard
                        icon={<Calendar className="w-6 h-6 text-blue-600" />}
                        title="Event Diikuti"
                        value="12"
                    />
                    <StatCard
                        icon={<Trophy className="w-6 h-6 text-amber-600" />}
                        title="Total Poin"
                        value="240"
                    />
                    <StatCard
                        icon={<User className="w-6 h-6 text-green-600" />}
                        title="Bergabung Sejak"
                        value="Jan 2024"
                    />
                </div>

                {/* Section Tambahan */}
                <div className="bg-white rounded-2xl shadow-md p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Aktivitas Terbaru ("Akan diganti ke Log Point")
                    </h3>
                    <ul className="divide-y divide-gray-200">
                        <li className="py-3 flex justify-between">
                            <span className="text-gray-700">
                                Bergabung pada event{" "}
                                <strong>Jakarta Marathon 2025</strong>
                            </span>
                            <span className="text-gray-500 text-sm">
                                15 Okt 2025
                            </span>
                        </li>
                        <li className="py-3 flex justify-between">
                            <span className="text-gray-700">
                                Mengundang teman dengan kode referral
                            </span>
                            <span className="text-gray-500 text-sm">
                                10 Okt 2025
                            </span>
                        </li>
                        <li className="py-3 flex justify-between">
                            <span className="text-gray-700">
                                Memperbarui profil akun
                            </span>
                            <span className="text-gray-500 text-sm">
                                5 Okt 2025
                            </span>
                        </li>
                    </ul>
                </div>
            </main>
        </div>
    );
}

/* 🔹 Komponen Reusable Kecil */
function InfoCard({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
}) {
    return (
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:shadow-sm transition">
            <h4 className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                {icon} {label}
            </h4>
            <p className="text-gray-900 font-medium">{String(value)}</p>
        </div>
    );
}

function StatCard({
    icon,
    title,
    value,
}: {
    icon: React.ReactNode;
    title: string;
    value: string;
}) {
    return (
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="flex justify-center mb-3">{icon}</div>
            <p className="text-gray-500 text-sm mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    );
}
