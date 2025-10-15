"use client";

import { useAuth } from "@/contexts/AuthContext";
import API from "@/lib/axiosInstance";
import axios from "axios";
import {
    Button,
    Card,
    Checkbox,
    Label,
    Radio,
    TextInput,
} from "flowbite-react";
import { ErrorMessage, Form, Formik } from "formik";
import { Calendar, Mail, Phone, User, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import * as Yup from "yup";

const RegisterSchema = Yup.object().shape({
    firstName: Yup.string()
        .min(2, "Nama depan minimal 2 karakter")
        .required("Nama depan harus diisi"),
    lastName: Yup.string(),
    userName: Yup.string()
        .min(3, "Username minimal 3 karakter")
        .required("Username harus diisi"),
    email: Yup.string()
        .email("Email tidak valid")
        .required("Email harus diisi"),
    phone: Yup.string()
        .matches(/^[0-9]+$/, "Nomor telepon hanya boleh angka")
        .min(10, "Nomor telepon minimal 10 digit"),
    password: Yup.string()
        .min(8, "Password minimal 8 karakter")
        .matches(/[a-z]/, "Password harus mengandung huruf kecil")
        .matches(/[A-Z]/, "Password harus mengandung huruf besar")
        .matches(/[0-9]/, "Password harus mengandung angka")
        .required("Password harus diisi"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Password tidak cocok")
        .required("Konfirmasi password harus diisi"),
    role: Yup.string()
        .oneOf(["CUSTOMER", "ORGANIZER"], "Pilih role yang valid")
        .required("Role harus dipilih"),
    referralCode: Yup.string(),
    agreeToTerms: Yup.boolean()
        .oneOf([true], "Anda harus menyetujui syarat dan ketentuan")
        .required("Anda harus menyetujui syarat dan ketentuan"),
});

export default function RegisterPage() {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && user) {
            router.push("/");
        }
    }, [user, isLoading, router]);

    const handleRegister = async (values: any) => {
        try {
            //Mengirimkan data registrasi ke backend
            const response = await API.post("/auth/register", values);
            toast.success("Registrasi berhasil! Silakan login.");
            router.push("/login");

            console.log("Response register dari backend:", response.data);
        } catch (error: any) {
            //Menghandle error saat registrasi
            console.log(error);
            const message =
                error.response?.data?.message ||
                "Terjadi kesalahan saat registrasi.";
            console.log("Error register dari backend:", message);
            toast.error("Registrasi gagal! Silakan coba lagi.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen py-12 px-4">
            <Card className="max-w-2xl w-full">
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
                        Create an account
                    </h2>
                    <p className="text-gray-600">
                        Join our running community today
                    </p>
                </div>

                <Formik
                    initialValues={{
                        firstName: "",
                        lastName: "",
                        userName: "",
                        email: "",
                        phone: "",
                        password: "",
                        confirmPassword: "",
                        role: "CUSTOMER",
                        referralCode: "",
                        agreeToTerms: false,
                    }}
                    validationSchema={RegisterSchema}
                    onSubmit={handleRegister}
                >
                    {({
                        isSubmitting,
                        touched,
                        errors,
                        values,
                        handleChange,
                        setFieldValue,
                    }) => (
                        <Form className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="firstName">
                                        First Name *
                                    </Label>
                                    <TextInput
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        icon={User}
                                        placeholder="John"
                                        value={values.firstName}
                                        onChange={handleChange}
                                        color={
                                            touched.firstName &&
                                            errors.firstName
                                                ? "failure"
                                                : "gray"
                                        }
                                    />
                                    <ErrorMessage
                                        name="firstName"
                                        component="div"
                                        className="text-red-600 text-sm mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <TextInput
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        icon={User}
                                        placeholder="Doe"
                                        value={values.lastName}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="userName">Username *</Label>
                                <TextInput
                                    id="userName"
                                    name="userName"
                                    type="text"
                                    icon={User}
                                    placeholder="johndoe"
                                    value={values.userName}
                                    onChange={handleChange}
                                    color={
                                        touched.userName && errors.userName
                                            ? "failure"
                                            : "gray"
                                    }
                                />
                                <ErrorMessage
                                    name="userName"
                                    component="div"
                                    className="text-red-600 text-sm mt-1"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    <Label htmlFor="phone">Phone</Label>
                                    <TextInput
                                        id="phone"
                                        name="phone"
                                        type="text"
                                        icon={Phone}
                                        placeholder="08123456789"
                                        value={values.phone}
                                        onChange={handleChange}
                                        color={
                                            touched.phone && errors.phone
                                                ? "failure"
                                                : "gray"
                                        }
                                    />
                                    <ErrorMessage
                                        name="phone"
                                        component="div"
                                        className="text-red-600 text-sm mt-1"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="password">Password *</Label>
                                    <TextInput
                                        id="password"
                                        name="password"
                                        type="password"
                                        icon={Lock}
                                        placeholder="Min. 8 characters"
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

                                <div>
                                    <Label htmlFor="confirmPassword">
                                        Confirm Password *
                                    </Label>
                                    <TextInput
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        icon={Lock}
                                        placeholder="Repeat password"
                                        value={values.confirmPassword}
                                        onChange={handleChange}
                                        color={
                                            touched.confirmPassword &&
                                            errors.confirmPassword
                                                ? "failure"
                                                : "gray"
                                        }
                                    />
                                    <ErrorMessage
                                        name="confirmPassword"
                                        component="div"
                                        className="text-red-600 text-sm mt-1"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label className="mb-2">Register as *</Label>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2">
                                        <Radio
                                            id="customer"
                                            name="role"
                                            value="CUSTOMER"
                                            checked={values.role === "CUSTOMER"}
                                            onChange={handleChange}
                                        />
                                        <Label htmlFor="customer">
                                            Customer
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Radio
                                            id="organizer"
                                            name="role"
                                            value="ORGANIZER"
                                            checked={
                                                values.role === "ORGANIZER"
                                            }
                                            onChange={handleChange}
                                        />
                                        <Label htmlFor="organizer">
                                            Organizer
                                        </Label>
                                    </div>
                                </div>
                                <ErrorMessage
                                    name="role"
                                    component="div"
                                    className="text-red-600 text-sm mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="referralCode">
                                    Referral Code (Optional)
                                </Label>
                                <TextInput
                                    id="referralCode"
                                    name="referralCode"
                                    type="text"
                                    placeholder="Enter referral code"
                                    value={values.referralCode}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="agreeToTerms"
                                    name="agreeToTerms"
                                    checked={values.agreeToTerms}
                                    onChange={handleChange}
                                />
                                <Label htmlFor="agreeToTerms" className="flex">
                                    I agree with the{" "}
                                    <Link
                                        href="/terms"
                                        className="text-orange-600 hover:underline ml-1"
                                    >
                                        Terms and Conditions
                                    </Link>
                                </Label>
                            </div>
                            <ErrorMessage
                                name="agreeToTerms"
                                component="div"
                                className="text-red-600 text-sm"
                            />

                            <Button
                                type="submit"
                                color="warning"
                                disabled={isSubmitting}
                                size="lg"
                            >
                                {isSubmitting
                                    ? "Creating account..."
                                    : "Create account"}
                            </Button>
                        </Form>
                    )}
                </Formik>

                <div className="mt-6 text-center text-sm">
                    <span className="text-gray-600">
                        Already have an account?{" "}
                    </span>
                    <Link
                        href="/login"
                        className="text-orange-600 hover:underline font-semibold"
                    >
                        Sign in
                    </Link>
                </div>
            </Card>
        </div>
    );
}
