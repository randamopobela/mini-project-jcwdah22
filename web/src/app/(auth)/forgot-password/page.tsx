"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { toast } from "sonner";
import { Calendar, Mail, ArrowLeft } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
        .email("Email tidak valid")
        .required("Email harus diisi"),
});

export default function ForgotPasswordPage() {
    const handleForgotPassword = async (values: { email: string }) => {
        const router = useRouter();
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
                values
            );
            console.log(
                "Response forgot-password dari backend:",
                response.data
            );
            toast.success("Link reset password telah dikirim ke email Anda!");

            router.push("/login");

            console.log(values);
        } catch (error: any) {
            console.log(error);
            const message =
                error.response?.data?.message ||
                "Terjadi kesalahan saat login.";
            console.log("Error forgot-password dari backend:", message);
            toast.error(
                "Gagal mengirim link reset password. Silakan coba lagi."
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
                        Lupa Password?
                    </h2>
                    <p className="text-gray-600">
                        Masukkan email Anda dan kami akan mengirimkan link untuk
                        reset password
                    </p>
                </div>

                <Formik
                    initialValues={{ email: "" }}
                    validationSchema={ForgotPasswordSchema}
                    onSubmit={handleForgotPassword}
                >
                    {({ isSubmitting, touched, errors }) => (
                        <Form className="space-y-6">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <Field
                                        type="email"
                                        name="email"
                                        id="email"
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                            touched.email && errors.email
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                        placeholder="nama@email.com"
                                    />
                                </div>
                                <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting
                                    ? "Mengirim..."
                                    : "Kirim Link Reset Password"}
                            </button>
                        </Form>
                    )}
                </Formik>

                <div className="mt-6 text-center">
                    <Link
                        href="/login"
                        className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Kembali ke Login</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
