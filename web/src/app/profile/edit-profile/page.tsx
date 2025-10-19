"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, Label, TextInput } from "flowbite-react";
import { toast } from "sonner";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Save,
    ArrowLeft,
    ShieldOff,
    KeyRound,
} from "lucide-react";
import API from "@/lib/axiosInstance"; // pastikan instance Axios kamu di sini
import { decodeToken, removeToken, setToken } from "@/utils/auth";

// Schema Validasi
const ProfileSchema = Yup.object().shape({
    firstName: Yup.string().required("Nama depan wajib diisi"),
    lastName: Yup.string(),
    phone: Yup.string().matches(/^[0-9]*$/, "Nomor telepon tidak valid"),
    address: Yup.string(),
});

export default function EditProfilePage() {
    const { user, updateUser, logout, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        try {
            const response = await API.post("/user/update", values);

            // Memperbarui token dari response.data.data ke dalam localStorage
            const userToken = response.data?.data?.token;
            removeToken();
            setToken(userToken);

            const userDecoded = decodeToken(userToken);
            updateUser(userDecoded);

            toast.success("Profil berhasil diperbarui!");

            router.push("/profile");
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Gagal memperbarui profil."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeactivate = async () => {
        if (!user) {
            toast.error("User tidak ditemukan.");
            return;
        }

        try {
            if (
                confirm(
                    "Apakah Anda yakin ingin menonaktifkan akun ini? Akun tidak bisa diaktifkan kembali."
                )
            ) {
                await API.patch("/user/deactivate", {
                    id: user.id,
                });

                toast.success("Akun berhasil dinonaktifkan.");
                logout();
            }
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Gagal menonaktifkan akun."
            );
        }
    };

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
                    <h1 className="text-4xl font-bold mb-2">Edit Profil</h1>
                    <p className="text-blue-100 text-lg">
                        Ubah informasi pribadi Anda di bawah ini
                    </p>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white rounded-2xl shadow-md p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <User className="w-6 h-6 text-blue-600" />
                            Informasi Pribadi
                        </h2>
                        <Button
                            color="gray"
                            onClick={() => router.push("/profile")}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kembali
                        </Button>
                    </div>

                    <Formik
                        initialValues={{
                            email: user.email,
                            userName: user.userName,
                            firstName: user.firstName,
                            lastName: user.lastName || "",
                            phone: user.phone || "",
                            address: user.address || "",
                            referralCode: user.referralCode,
                            isActive: user.isActive,
                            role: user.role,
                        }}
                        validationSchema={ProfileSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, errors, touched }) => (
                            <Form className="space-y-6">
                                {/* Username */}
                                <div>
                                    <Label htmlFor="userName">Username</Label>
                                    <Field
                                        as={TextInput}
                                        id="userName"
                                        name="userName"
                                        type="text"
                                        icon={User}
                                        color={
                                            errors.userName && touched.userName
                                                ? "failure"
                                                : undefined
                                        }
                                    />
                                    <ErrorMessage
                                        name="userName"
                                        component="p"
                                        className="text-red-600 text-sm mt-1"
                                    />
                                </div>

                                {/* Nama Depan & Belakang */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="firstName">
                                            Nama Depan
                                        </Label>
                                        <Field
                                            as={TextInput}
                                            id="firstName"
                                            name="firstName"
                                            type="text"
                                            icon={User}
                                            color={
                                                errors.firstName &&
                                                touched.firstName
                                                    ? "failure"
                                                    : undefined
                                            }
                                        />
                                        <ErrorMessage
                                            name="firstName"
                                            component="p"
                                            className="text-red-600 text-sm mt-1"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="lastName">
                                            Nama Belakang
                                        </Label>
                                        <Field
                                            as={TextInput}
                                            id="lastName"
                                            name="lastName"
                                            type="text"
                                            icon={User}
                                        />
                                        <ErrorMessage
                                            name="lastName"
                                            component="p"
                                            className="text-red-600 text-sm mt-1"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <TextInput
                                        id="email"
                                        type="email"
                                        value={user.email}
                                        icon={Mail}
                                        disabled
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Email tidak dapat diubah
                                    </p>
                                </div>

                                {/* Telepon */}
                                <div>
                                    <Label htmlFor="phone">Nomor Telepon</Label>
                                    <Field
                                        as={TextInput}
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="08123456789"
                                        icon={Phone}
                                    />
                                    <ErrorMessage
                                        name="phone"
                                        component="p"
                                        className="text-red-600 text-sm mt-1"
                                    />
                                </div>

                                {/* Alamat */}
                                <div>
                                    <Label htmlFor="address">Alamat</Label>
                                    <Field
                                        as={TextInput}
                                        id="address"
                                        name="address"
                                        type="text"
                                        placeholder="Alamat lengkap Anda"
                                        icon={MapPin}
                                    />
                                    <ErrorMessage
                                        name="address"
                                        component="p"
                                        className="text-red-600 text-sm mt-1"
                                    />
                                </div>

                                {/* Referral Code */}
                                <div>
                                    <Label htmlFor="referralCode">
                                        Kode Referral
                                    </Label>
                                    <TextInput
                                        id="referralCode"
                                        type="text"
                                        value={user.referralCode}
                                        disabled
                                        icon={KeyRound}
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Kode referral tidak dapat diubah
                                    </p>
                                </div>

                                {/* Tombol Aksi */}
                                <div className="flex justify-between items-center pt-4 border-t">
                                    <Button
                                        color="red"
                                        onClick={handleDeactivate}
                                        className="flex items-center gap-2"
                                    >
                                        <ShieldOff className="w-4 h-4" />
                                        Nonaktifkan Akun
                                    </Button>

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        color="blue"
                                        className="flex items-center gap-2 px-6"
                                    >
                                        <Save className="w-4 h-4" />
                                        {isSubmitting
                                            ? "Menyimpan..."
                                            : "Simpan Perubahan"}
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </main>
        </div>
    );
}
