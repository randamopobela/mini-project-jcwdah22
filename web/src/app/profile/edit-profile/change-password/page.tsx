"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, Label, TextInput } from "flowbite-react";
import { Lock, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import API from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { decodeToken, removeToken, setToken } from "@/utils/auth";
import { useEffect } from "react";

const ResetPasswordSchema = Yup.object().shape({
    currentPassword: Yup.string()
        .min(6, "Minimal 6 karakter")
        .required("Password lama wajib diisi"),
    newPassword: Yup.string()
        .min(8, "Password minimal 8 karakter")
        .matches(/[a-z]/, "Password harus mengandung huruf kecil")
        .matches(/[A-Z]/, "Password harus mengandung huruf besar")
        .matches(/[0-9]/, "Password harus mengandung angka")
        .required("Password harus diisi"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Konfirmasi password tidak cocok")
        .required("Konfirmasi password wajib diisi"),
});

export default function ResetPasswordPage() {
    const router = useRouter();
    const { user, updateUser, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    const handleSubmit = async (
        values: any,
        { setSubmitting, resetForm }: any
    ) => {
        try {
            const response = await API.post(
                "/user/change-password",
                { ...values, email: user?.email },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            console.log(response);

            // Perbarui token
            const userToken = response.data?.data?.token;
            removeToken();
            setToken(userToken);

            // perbarui data user
            const userDecoded = decodeToken(userToken);
            updateUser(userDecoded);

            toast.success(
                "Password berhasil diperbarui. Silakan login kembali.",
                response.data?.message
            );

            resetForm();
            router.push("/profile/edit-profile");
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Gagal memperbarui password."
            );

            console.log(error.response?.data?.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Lock className="w-6 h-6 text-blue-600" />
                        Reset Password
                    </h2>
                    <Button
                        color="gray"
                        onClick={() => router.back()}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali
                    </Button>
                </div>

                <Formik
                    initialValues={{
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                    }}
                    validationSchema={ResetPasswordSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-6">
                            {/* Password Lama */}
                            <div>
                                <Label htmlFor="currentPassword">
                                    Password Lama
                                </Label>
                                <Field
                                    as={TextInput}
                                    id="currentPassword"
                                    name="currentPassword"
                                    type="password"
                                    icon={Lock}
                                />
                                <ErrorMessage
                                    name="currentPassword"
                                    component="p"
                                    className="text-red-600 text-sm mt-1"
                                />
                            </div>

                            {/* Password Baru */}
                            <div>
                                <Label htmlFor="newPassword">
                                    Password Baru
                                </Label>
                                <Field
                                    as={TextInput}
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    icon={Lock}
                                />
                                <ErrorMessage
                                    name="newPassword"
                                    component="p"
                                    className="text-red-600 text-sm mt-1"
                                />
                            </div>

                            {/* Konfirmasi Password */}
                            <div>
                                <Label htmlFor="confirmPassword">
                                    Konfirmasi Password Baru
                                </Label>
                                <Field
                                    as={TextInput}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    icon={Lock}
                                />
                                <ErrorMessage
                                    name="confirmPassword"
                                    component="p"
                                    className="text-red-600 text-sm mt-1"
                                />
                            </div>

                            {/* Keterangan Password */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-gray-700 font-medium mb-2">
                                    Password harus memenuhi kriteria:
                                </p>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Minimal 8 karakter</li>
                                    <li>• Mengandung huruf besar dan kecil</li>
                                    <li>• Mengandung angka</li>
                                </ul>
                            </div>

                            {/* Tombol Simpan */}
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                color="blue"
                                className="flex items-center gap-2 w-full justify-center"
                            >
                                <Save className="w-4 h-4" />
                                {isSubmitting
                                    ? "Menyimpan..."
                                    : "Simpan Password Baru"}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
