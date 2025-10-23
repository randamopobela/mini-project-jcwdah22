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
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import API from "@/lib/axiosInstance";

const eventSchema = Yup.object().shape({
    title: Yup.string()
        .min(5, "Judul minimal 5 karakter")
        .required("Judul event harus diisi"),
    description: Yup.string()
        .min(20, "Deskripsi minimal 20 karakter")
        .required("Deskripsi event harus diisi"),
    category: Yup.string().required("Kategori harus dipilih"),
    location: Yup.string().required("Lokasi harus diisi"),
    startDate: Yup.date().required("Tanggal mulai harus diisi"),
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
    eventPicture: Yup.mixed().nullable(),
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

export default function EditEventPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const { user, isLoading } = useAuth();

    const [event, setEvent] = useState<any>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        if (!isLoading && !user) router.push("/login");
    }, [user, isLoading, router]);

    // Fetch existing event data
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await API.get(`/myevent/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                });
                setEvent(res.data.data);
                setPreview(
                    `${process.env.NEXT_PUBLIC_API_URL}${res.data.data.eventPicture}`
                );
            } catch {
                toast.error("Gagal memuat data event");
            }
        };
        if (id) fetchEvent();
    }, [id]);

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setFieldValue: any
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setFieldValue("eventPicture", file.name);

            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateEvent = async (values: any) => {
        try {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                if (key !== "eventPicture") formData.append(key, value as any);
            });
            if (selectedFile) formData.append("eventPicture", selectedFile);

            await API.patch(`/myevent/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Event berhasil diperbarui!");
            router.push(`/dashboard/events/${id}/detail`);
        } catch (error) {
            console.error(error);
            toast.error("Gagal memperbarui event. Silakan coba lagi.");
        }
    };

    if (!event)
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600">
                Memuat...
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-blue-700 text-white py-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/dashboard/events"
                        className="inline-flex items-center space-x-2 text-white hover:text-blue-100 mb-4 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span>Kembali</span>
                    </Link>
                    <h1 className="text-4xl font-bold mb-2">Edit Event</h1>
                    <p className="text-blue-100 text-lg">
                        Perbarui informasi event Anda
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <Formik
                        initialValues={{
                            title: event.title,
                            description: event.description,
                            category: event.category,
                            location: event.location,
                            startDate: new Date(event.startDate)
                                .toISOString()
                                .slice(0, 16),
                            endDate: new Date(event.endDate)
                                .toISOString()
                                .slice(0, 16),
                            price: event.price,
                            isFree: event.isFree,
                            totalSlots: event.totalSlots,
                            eventPicture: "",
                        }}
                        validationSchema={eventSchema}
                        onSubmit={handleUpdateEvent}
                        enableReinitialize
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
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Judul Event *
                                            </label>
                                            <Field
                                                type="text"
                                                name="title"
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                                                    touched.title &&
                                                    errors.title
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                }`}
                                            />
                                            <ErrorMessage
                                                name="title"
                                                component="div"
                                                className="text-red-500 text-sm mt-1"
                                            />
                                        </div>

                                        {/* Deskripsi */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Deskripsi *
                                            </label>
                                            <Field
                                                as="textarea"
                                                name="description"
                                                rows={6}
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                                                    touched.description &&
                                                    errors.description
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                }`}
                                            />
                                            <ErrorMessage
                                                name="description"
                                                component="div"
                                                className="text-red-500 text-sm mt-1"
                                            />
                                        </div>

                                        {/* Kategori */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Kategori *
                                            </label>
                                            <Field
                                                as="select"
                                                name="category"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
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
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Gambar Event
                                            </label>
                                            <div className="flex items-center space-x-4">
                                                {preview && (
                                                    <img
                                                        src={preview}
                                                        alt="Preview"
                                                        className="w-32 h-32 object-cover rounded-lg border"
                                                    />
                                                )}
                                                <label
                                                    className={`flex items-center justify-center px-6 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                                                        touched.eventPicture &&
                                                        errors.eventPicture
                                                            ? "border-red-500 hover:border-red-500"
                                                            : "border-gray-300 hover:border-primary-500"
                                                    }`}
                                                >
                                                    <ImageIcon className="h-5 w-5 text-gray-400 mr-2" />
                                                    <span className="text-gray-600">
                                                        Ganti Gambar
                                                    </span>
                                                    <input
                                                        type="file"
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
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Lokasi *
                                            </label>
                                            <Field
                                                type="text"
                                                name="location"
                                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 border-gray-300"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Tanggal Mulai *
                                                </label>
                                                <Field
                                                    type="datetime-local"
                                                    name="startDate"
                                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 border-gray-300"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Tanggal Selesai *
                                                </label>
                                                <Field
                                                    type="datetime-local"
                                                    name="endDate"
                                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 border-gray-300"
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
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Harga Tiket (Rp) *
                                                </label>
                                                <Field
                                                    type="number"
                                                    name="price"
                                                    disabled={values.isFree}
                                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                                                        touched.price &&
                                                        errors.price
                                                            ? "border-red-500"
                                                            : "border-gray-300"
                                                    } ${
                                                        values.isFree
                                                            ? "bg-gray-100"
                                                            : ""
                                                    }`}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Total Slot Peserta *
                                                </label>
                                                <Field
                                                    type="number"
                                                    name="totalSlots"
                                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                                                        touched.totalSlots &&
                                                        errors.totalSlots
                                                            ? "border-red-500"
                                                            : "border-gray-300"
                                                    }`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tombol Aksi */}
                                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                                    <Link
                                        href="/dashboard/events"
                                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold"
                                    >
                                        Batal
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold disabled:opacity-50 inline-flex items-center space-x-2"
                                    >
                                        <Save className="h-5 w-5" />
                                        <span>
                                            {isSubmitting
                                                ? "Menyimpan..."
                                                : "Simpan Perubahan"}
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
