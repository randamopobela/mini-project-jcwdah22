"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, Label, TextInput } from "flowbite-react";
import { toast } from "sonner";
import { User, Mail, Phone, MapPin, ArrowLeft, Save } from "lucide-react";

// 📋 Schema Validasi Yup
const ProfileSchema = Yup.object().shape({
    firstName: Yup.string().required("Nama depan wajib diisi"),
    lastName: Yup.string().required("Nama belakang wajib diisi"),
    phone: Yup.string().matches(/^[0-9]+$/, "Nomor telepon tidak valid"),
    address: Yup.string(),
});

export default function EditProfilePage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // simulasi API
            toast.success("Profil berhasil diperbarui!");
            setSubmitting(false);
            router.push("/profile");
        } catch (error: any) {
            toast.error(error.message || "Gagal memperbarui profil.");
            setSubmitting(false);
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

                    {/* Formik Form */}
                    <Formik
                        initialValues={{
                            firstName: user.firstName || "",
                            lastName: user.lastName || "",
                            phone: user.phone || "",
                            address: user.address || "",
                        }}
                        validationSchema={ProfileSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, errors, touched }) => (
                            <Form className="space-y-6">
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
                                            color={
                                                errors.lastName &&
                                                touched.lastName
                                                    ? "failure"
                                                    : undefined
                                            }
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

                                {/* Nomor Telepon */}
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

                                {/* Tombol Simpan */}
                                <div className="flex justify-end">
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
