"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { toast } from "sonner";
import { Calendar, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const resetPasswordSchema = Yup.object().shape({
    password: Yup.string()
        .min(8, "Password minimal 8 karakter")
        .matches(/[a-z]/, "Password harus mengandung huruf kecil")
        .matches(/[A-Z]/, "Password harus mengandung huruf besar")
        .matches(/[0-9]/, "Password harus mengandung angka")
        .required("Password harus diisi"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Password tidak cocok")
        .required("Konfirmasi password harus diisi"),
});

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams?.get("token") || ""; // ambil token dari URL

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleResetPassword = async (values: {
        password: string;
        confirmPassword: string;
    }) => {
        try {
            if (!token) {
                toast.error(
                    "Token tidak ditemukan. Silakan coba lagi dari email Anda."
                );
                return;
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password?token=${token}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token: token, // token dari URL
                        newPassword: values.password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Gagal mereset password");
            }

            toast.success(
                "Password berhasil direset! Silakan login dengan password baru."
            );

            console.log("✅ Reset Success:", data);
            router.push("/login"); // redirect ke login setelah sukses

            console.log(values);
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                "Terjadi kesalahan saat login.";
            console.log("Error forgot-password dari backend:", message);

            toast.error(
                error.message || "Gagal reset password. Silakan coba lagi."
            );
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center space-x-2 mb-4"
                    >
                        <Calendar className="h-10 w-10 text-primary-600" />
                        <span className="text-2xl font-bold text-gray-900">
                            RunEvent
                        </span>
                    </Link>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Reset Password
                    </h2>
                    <p className="text-gray-600">
                        Masukkan password baru untuk akun Anda
                    </p>
                </div>

                <Formik
                    initialValues={{ password: "", confirmPassword: "" }}
                    validationSchema={resetPasswordSchema}
                    onSubmit={handleResetPassword}
                >
                    {({ isSubmitting, touched, errors }) => (
                        <Form className="space-y-6">
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Password Baru
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <Field
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="password"
                                        id="password"
                                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                            touched.password && errors.password
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                        placeholder="Min. 8 karakter"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                <ErrorMessage
                                    name="password"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Konfirmasi Password Baru
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <Field
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                            touched.confirmPassword &&
                                            errors.confirmPassword
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                        placeholder="Ulangi password baru"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                <ErrorMessage
                                    name="confirmPassword"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

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

                            {isSubmitting ? (
                                <button
                                    type="submit"
                                    disabled
                                    className="w-full bg-primary-400 text-white py-3 rounded-lg font-semibold"
                                >
                                    Memproses...
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 font-semibold"
                                >
                                    Reset Password
                                </button>
                            )}
                        </Form>
                    )}
                </Formik>

                <div className="mt-6 text-center">
                    <Link
                        href="/login"
                        className="text-primary-600 hover:text-primary-700 font-semibold"
                    >
                        Kembali ke Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
