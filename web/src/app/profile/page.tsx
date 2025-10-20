"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Button, FileInput, Spinner, Toast, Modal } from "flowbite-react";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Shield,
    Gift,
    Calendar,
    Trophy,
    Settings,
    Camera,
    CheckCircle2,
    XCircle,
    Upload,
    RotateCcw,
} from "lucide-react";
import API from "@/lib/axiosInstance";
import { decodeToken, removeToken, setToken } from "@/utils/auth";

export default function ProfilePage() {
    const { user, updateUser, isLoading } = useAuth();
    const router = useRouter();

    const [preview, setPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isLoading && !user) router.push("/login");
    }, [user, isLoading, router]);

    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="xl" />
            </div>
        );
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
        setOpenModal(true); // langsung buka modal preview
    };

    const handleCancelPreview = () => {
        setSelectedFile(null);
        setPreview(null);
        setOpenModal(false);

        //reset value input file
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        const formData = new FormData();
        formData.append("profilePicture", selectedFile);

        try {
            setUploading(true);
            setError(false);
            setSuccess(false);

            const response = await API.post("/user/profile-picture", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            // perbarui token
            const userToken = response.data?.data?.token;
            removeToken();
            setToken(userToken);

            // perbarui data user
            const userDecoded = decodeToken(userToken);
            updateUser(userDecoded);

            setUploading(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);

            // reset modal
            setOpenModal(false);
            setSelectedFile(null);
            setPreview(null);

            //reset value input file
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (err) {
            console.error(err);
            setUploading(false);
            setError(true);
            setTimeout(() => setError(false), 3000);
        }
    };

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
                <div className="bg-white rounded-2xl shadow-md p-8 mb-10">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        {/* FOTO PROFIL */}
                        <div className="relative flex flex-col items-center">
                            <img
                                src={
                                    user.profilePicture
                                        ? `${process.env.NEXT_PUBLIC_API_URL}${user.profilePicture}`
                                        : "/default-avatar.png"
                                }
                                alt="Profile Avatar"
                                className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow-md"
                            />

                            <Button
                                color="blue"
                                size="xs"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 flex items-center gap-1"
                            >
                                <Camera className="w-4 h-4" />
                                Ganti Foto
                            </Button>

                            <FileInput
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>

                        {/* DETAIL PROFIL */}
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold text-gray-900 mb-1">
                                {user.firstName} {user.lastName}
                            </h2>
                            <p className="text-gray-600 mb-4 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-blue-500" />
                                {user.email}
                            </p>

                            <div className="flex flex-wrap gap-3">
                                <Link href="/profile/edit-profile">
                                    <Button color="gray">
                                        <Settings className="w-4 h-4 mr-2" />
                                        Edit Profil
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* FEEDBACK */}
                    <div className="mt-4">
                        {success && (
                            <Toast>
                                <CheckCircle2 className="text-green-600 w-5 h-5" />
                                <div className="pl-2 text-sm font-medium text-green-700">
                                    Foto berhasil diperbarui!
                                </div>
                            </Toast>
                        )}
                        {error && (
                            <Toast>
                                <XCircle className="text-red-600 w-5 h-5" />
                                <div className="pl-2 text-sm font-medium text-red-700">
                                    Gagal mengunggah foto.
                                </div>
                            </Toast>
                        )}
                    </div>

                    <div className="border-t border-gray-200 my-8"></div>

                    {/* INFO USER */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoCard
                            icon={<User className="w-5 h-5 text-blue-600" />}
                            label="Username"
                            value={user.userName}
                        />
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
                            value={user.role}
                        />
                        <InfoCard
                            icon={<Gift className="w-5 h-5 text-blue-600" />}
                            label="Kode Referral"
                            value={user.referralCode || "-"}
                        />
                        <InfoCard
                            icon={
                                <Calendar className="w-5 h-5 text-blue-600" />
                            }
                            label="Bergabung Sejak"
                            value={new Date(user.createdAt).toLocaleDateString(
                                "id-ID",
                                { year: "numeric", month: "short" }
                            )}
                        />
                    </div>
                </div>

                {/* Statistik */}
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
                        title="Status Akun"
                        value={user.isActive ? "Aktif" : "Nonaktif"}
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

            {/* 🪟 Modal Preview Foto */}
            <Modal
                show={openModal}
                size="sm"
                onClose={handleCancelPreview}
                popup
            >
                <div className="p-6 text-center">
                    {preview ? (
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-40 h-40 rounded-full mx-auto mb-4 object-cover border-4 border-blue-100"
                        />
                    ) : (
                        <div className="h-40 flex items-center justify-center text-gray-400">
                            Tidak ada gambar
                        </div>
                    )}

                    <div className="flex justify-center gap-2 mt-3">
                        <Button
                            color="gray"
                            size="xs"
                            onClick={handleCancelPreview}
                        >
                            <RotateCcw className="w-4 h-4 mr-1" /> Kembali
                        </Button>
                        <Button
                            color="light"
                            size="xs"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Camera className="w-4 h-4 mr-1" /> Ganti Foto
                        </Button>
                        <Button
                            color="blue"
                            size="xs"
                            onClick={handleUpload}
                            disabled={uploading}
                        >
                            {uploading ? (
                                <>
                                    <Spinner size="sm" />{" "}
                                    <span className="ml-2">Mengunggah...</span>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4 mr-1" /> Upload
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

/* Komponen kecil */
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
