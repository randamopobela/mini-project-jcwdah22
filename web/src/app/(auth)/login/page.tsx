"use client";

import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { toast } from "sonner";
import { Card, Label, TextInput, Checkbox, Button } from "flowbite-react";
import { Calendar, Mail, Lock } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email("Email tidak valid")
        .required("Email harus diisi"),
    password: Yup.string()
        .min(8, "Password minimal 8 karakter")
        .required("Password harus diisi"),
});

export default function LoginPage() {
    const router = useRouter();
    const { login, user, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && user) {
            router.push("/");
        }
    }, [user, isLoading, router]);

    const handleLogin = async (values: { email: string; password: string }) => {
        try {
            //Mengirimkan data login ke backend
            await login(values.email, values.password);
            toast.success("Login berhasil!");
            router.push("/");
        } catch (error: any) {
            //Menghandle error saat registrasi
            toast.error(
                `Login gagal! Periksa kembali email dan password Anda. ${error.message}`
            );
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Memuat...
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen py-12 px-4">
            <Card className="max-w-md w-full">
                <div className="text-center mb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center space-x-2 mb-4"
                    >
                        <Calendar className="h-10 w-10 text-orange-600" />
                        <span className="text-2xl font-bold text-gray-900">
                            RunEvent
                        </span>
                    </Link>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Log in
                    </h2>
                    <p className="text-gray-600">
                        Welcome back! Please enter your details
                    </p>
                </div>

                <Formik
                    initialValues={{ email: "", password: "", remember: false }}
                    validationSchema={LoginSchema}
                    onSubmit={handleLogin}
                >
                    {({
                        isSubmitting,
                        touched,
                        errors,
                        values,
                        handleChange,
                    }) => (
                        <Form className="flex flex-col gap-4">
                            <div>
                                <Label htmlFor="email">Email *</Label>
                                <TextInput
                                    id="email"
                                    name="email"
                                    type="email"
                                    icon={Mail}
                                    placeholder="name@company.com"
                                    value={values.email}
                                    onChange={handleChange}
                                    color={
                                        touched.email && errors.email
                                            ? "failure"
                                            : "gray"
                                    }
                                />
                                <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="text-red-600 text-sm mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="password">Password *</Label>
                                <TextInput
                                    id="password"
                                    name="password"
                                    type="password"
                                    icon={Lock}
                                    placeholder="••••••••"
                                    value={values.password}
                                    onChange={handleChange}
                                    color={
                                        touched.password && errors.password
                                            ? "failure"
                                            : "gray"
                                    }
                                />
                                <ErrorMessage
                                    name="password"
                                    component="div"
                                    className="text-red-600 text-sm mt-1"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        onChange={handleChange}
                                    />
                                    <Label htmlFor="remember">
                                        Remember me
                                    </Label>
                                </div>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-orange-600 hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                color="blue"
                                disabled={isSubmitting}
                                size="lg"
                            >
                                {isSubmitting ? "Signing in..." : "Sign in"}
                            </Button>
                        </Form>
                    )}
                </Formik>

                <div className="mt-6 text-center text-sm">
                    <span className="text-gray-600">
                        Don&apos;t have an account?{" "}
                    </span>
                    <Link
                        href="/register"
                        className="text-orange-600 hover:underline font-semibold"
                    >
                        Sign up
                    </Link>
                </div>
            </Card>
        </div>
    );
}
