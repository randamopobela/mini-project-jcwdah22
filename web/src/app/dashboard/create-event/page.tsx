"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import {
    Calendar,
    MapPin,
    DollarSign,
    Users,
    FileText,
    Image as ImageIcon,
    Save,
    ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext"; // ✅ ambil user login dari context
import API from "@/lib/axiosInstance";

const eventSchema = Yup.object().shape({
    title: Yup.string()
        .min(5, "Judul minimal 5 karakter")
        .required("Judul event harus diisi"),
    description: Yup.string()
        .min(20, "Deskripsi minimal 20 karakter")
        .required("Deskripsi event harus diisi"),
    category: Yup.string()
        .oneOf(
            [
                "FUN_RUN",
                "FIVE_K",
                "TEN_K",
                "HALF_MARATHON",
                "MARATHON",
                "ULTRA_MARATHON",
                "TRAIL_RUN",
                "VIRTUAL_RUN",
            ],
            "Pilih kategori yang valid"
        )
        .required("Kategori harus dipilih"),
    location: Yup.string().required("Lokasi harus diisi"),
    startDate: Yup.date()
        .min(new Date(), "Tanggal mulai harus di masa depan")
        .required("Tanggal mulai harus diisi"),
    endDate: Yup.date()
        .min(
            Yup.ref("startDate"),
            "Tanggal selesai harus setelah tanggal mulai"
        )
        .required("Tanggal selesai harus diisi"),
    price: Yup.number()
        .min(0, "Harga tidak boleh negatif")
        .required("Harga harus diisi"),
    isFree: Yup.boolean(),
    totalSlots: Yup.number()
        .min(1, "Minimal 1 slot")
        .required("Total slot harus diisi"),
    eventPicture: Yup.string().nullable(),
});

const categories = [
    { value: "FUN_RUN", label: "Fun Run" },
    { value: "FIVE_K", label: "5K" },
    { value: "TEN_K", label: "10K" },
    { value: "HALF_MARATHON", label: "Half Marathon" },
    { value: "MARATHON", label: "Marathon" },
    { value: "ULTRA_MARATHON", label: "Ultra Marathon" },
    { value: "TRAIL_RUN", label: "Trail Run" },
    { value: "VIRTUAL_RUN", label: "Virtual Run" },
];

export default function CreateEventPage() {
    const [eventPicture, setEventPicture] = useState<string | null>(null);
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setFieldValue: any
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEventPicture(reader.result as string);
                setFieldValue("eventPicture", reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreateEvent = async (values: any) => {
        try {
            const payload = {
                ...values,
                availableSlots: values.totalSlots,
                status: "DRAFT",
                organizerId: "USR001", // ✅ ambil dari user login
            };

            const user = JSON.parse(localStorage.getItem("user") || "{}");
            const token = user.data.token;

            console.log("Token:", token, payload);

            await API.post("/myevent/create", payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Payload event:", payload);
            toast.success("Event berhasil dibuat!");
            router.push("/dashboard");
        } catch (error) {
            toast.error("Gagal membuat event. Silakan coba lagi.");
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
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-blue-700 text-white py-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center space-x-2 text-white hover:text-blue-100 mb-4 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span>Kembali ke Dashboard</span>
                    </Link>
                    <h1 className="text-4xl font-bold mb-2">Buat Event Baru</h1>
                    <p className="text-blue-100 text-lg">
                        Isi formulir di bawah untuk membuat event lari
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <Formik
                        initialValues={{
                            title: "",
                            description: "",
                            category: "FUN_RUN",
                            location: "",
                            startDate: "",
                            endDate: "",
                            price: 0,
                            isFree: false,
                            totalSlots: 100,
                            eventPicture: "",
                        }}
                        validationSchema={eventSchema}
                        onSubmit={handleCreateEvent}
                    >
                        {({
                            isSubmitting,
                            touched,
                            errors,
                            values,
                            setFieldValue,
                        }) => (
                            <Form className="space-y-8">
                                {/* Informasi Event */}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                                        <FileText className="h-6 w-6 text-primary-600" />
                                        <span>Informasi Event</span>
                                    </h2>

                                    <div className="space-y-6">
                                        {/* Judul */}
                                        <div>
                                            <label
                                                htmlFor="title"
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                            >
                                                Judul Event *
                                            </label>
                                            <Field
                                                type="text"
                                                name="title"
                                                id="title"
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                                    touched.title &&
                                                    errors.title
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                }`}
                                                placeholder="Contoh: Jakarta Marathon 2025"
                                            />
                                            <ErrorMessage
                                                name="title"
                                                component="div"
                                                className="text-red-500 text-sm mt-1"
                                            />
                                        </div>

                                        {/* Deskripsi */}
                                        <div>
                                            <label
                                                htmlFor="description"
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                            >
                                                Deskripsi Event *
                                            </label>
                                            <Field
                                                as="textarea"
                                                name="description"
                                                id="description"
                                                rows={6}
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none ${
                                                    touched.description &&
                                                    errors.description
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                }`}
                                                placeholder="Jelaskan detail event Anda..."
                                            />
                                            <ErrorMessage
                                                name="description"
                                                component="div"
                                                className="text-red-500 text-sm mt-1"
                                            />
                                        </div>

                                        {/* Kategori */}
                                        <div>
                                            <label
                                                htmlFor="category"
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                            >
                                                Kategori Event *
                                            </label>
                                            <Field
                                                as="select"
                                                name="category"
                                                id="category"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            >
                                                {categories.map((cat) => (
                                                    <option
                                                        key={cat.value}
                                                        value={cat.value}
                                                    >
                                                        {cat.label}
                                                    </option>
                                                ))}
                                            </Field>
                                        </div>

                                        {/* Gambar Event */}
                                        <div>
                                            <label
                                                htmlFor="eventPicture"
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                            >
                                                Gambar Event
                                            </label>
                                            <div className="flex items-center space-x-4">
                                                {eventPicture && (
                                                    <img
                                                        src={eventPicture}
                                                        alt="Event Preview"
                                                        className="w-32 h-32 object-cover rounded-lg border"
                                                    />
                                                )}
                                                <label className="flex items-center justify-center px-6 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                                                    <ImageIcon className="h-5 w-5 text-gray-400 mr-2" />
                                                    <span className="text-gray-600">
                                                        {eventPicture
                                                            ? "Ganti Gambar"
                                                            : "Upload Gambar"}
                                                    </span>
                                                    <input
                                                        type="file"
                                                        id="eventPicture"
                                                        accept="image/*"
                                                        onChange={(e) =>
                                                            handleImageChange(
                                                                e,
                                                                setFieldValue
                                                            )
                                                        }
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Lokasi & Waktu */}
                                <div className="border-t border-gray-200 pt-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                                        <MapPin className="h-6 w-6 text-primary-600" />
                                        <span>Lokasi & Waktu</span>
                                    </h2>

                                    <div className="space-y-6">
                                        <div>
                                            <label
                                                htmlFor="location"
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                            >
                                                Lokasi *
                                            </label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                                <Field
                                                    type="text"
                                                    name="location"
                                                    id="location"
                                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                                        touched.location &&
                                                        errors.location
                                                            ? "border-red-500"
                                                            : "border-gray-300"
                                                    }`}
                                                    placeholder="Contoh: Jakarta, Indonesia"
                                                />
                                            </div>
                                            <ErrorMessage
                                                name="location"
                                                component="div"
                                                className="text-red-500 text-sm mt-1"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label
                                                    htmlFor="startDate"
                                                    className="block text-sm font-medium text-gray-700 mb-2"
                                                >
                                                    Tanggal Mulai *
                                                </label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                                    <Field
                                                        type="datetime-local"
                                                        name="startDate"
                                                        id="startDate"
                                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                                            touched.startDate &&
                                                            errors.startDate
                                                                ? "border-red-500"
                                                                : "border-gray-300"
                                                        }`}
                                                    />
                                                </div>
                                                <ErrorMessage
                                                    name="startDate"
                                                    component="div"
                                                    className="text-red-500 text-sm mt-1"
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="endDate"
                                                    className="block text-sm font-medium text-gray-700 mb-2"
                                                >
                                                    Tanggal Selesai *
                                                </label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                                    <Field
                                                        type="datetime-local"
                                                        name="endDate"
                                                        id="endDate"
                                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                                            touched.endDate &&
                                                            errors.endDate
                                                                ? "border-red-500"
                                                                : "border-gray-300"
                                                        }`}
                                                    />
                                                </div>
                                                <ErrorMessage
                                                    name="endDate"
                                                    component="div"
                                                    className="text-red-500 text-sm mt-1"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Harga & Kapasitas */}
                                <div className="border-t border-gray-200 pt-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                                        <DollarSign className="h-6 w-6 text-primary-600" />
                                        <span>Harga & Kapasitas</span>
                                    </h2>

                                    <div className="space-y-6">
                                        <div className="flex items-center space-x-3">
                                            <Field
                                                type="checkbox"
                                                name="isFree"
                                                id="isFree"
                                                className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>
                                                ) => {
                                                    setFieldValue(
                                                        "isFree",
                                                        e.target.checked
                                                    );
                                                    if (e.target.checked)
                                                        setFieldValue(
                                                            "price",
                                                            0
                                                        );
                                                }}
                                            />
                                            <label
                                                htmlFor="isFree"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Event ini gratis
                                            </label>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label
                                                    htmlFor="price"
                                                    className="block text-sm font-medium text-gray-700 mb-2"
                                                >
                                                    Harga Tiket (Rp) *
                                                </label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                                    <Field
                                                        type="number"
                                                        name="price"
                                                        id="price"
                                                        disabled={values.isFree}
                                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                                            touched.price &&
                                                            errors.price
                                                                ? "border-red-500"
                                                                : "border-gray-300"
                                                        } ${
                                                            values.isFree
                                                                ? "bg-gray-100"
                                                                : ""
                                                        }`}
                                                        placeholder="0"
                                                    />
                                                </div>
                                                <ErrorMessage
                                                    name="price"
                                                    component="div"
                                                    className="text-red-500 text-sm mt-1"
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="totalSlots"
                                                    className="block text-sm font-medium text-gray-700 mb-2"
                                                >
                                                    Total Slot Peserta *
                                                </label>
                                                <div className="relative">
                                                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                                    <Field
                                                        type="number"
                                                        name="totalSlots"
                                                        id="totalSlots"
                                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                                            touched.totalSlots &&
                                                            errors.totalSlots
                                                                ? "border-red-500"
                                                                : "border-gray-300"
                                                        }`}
                                                        placeholder="100"
                                                    />
                                                </div>
                                                <ErrorMessage
                                                    name="totalSlots"
                                                    component="div"
                                                    className="text-red-500 text-sm mt-1"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tombol Aksi */}
                                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                                    <Link
                                        href="/dashboard"
                                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
                                    >
                                        Batal
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
                                    >
                                        <Save className="h-5 w-5" />
                                        <span>
                                            {isSubmitting
                                                ? "Menyimpan..."
                                                : "Buat Event"}
                                        </span>
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}
