"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Calendar, DollarSign, Save, ArrowLeft } from "lucide-react";
import API from "@/lib/axiosInstance";
import { useAuth } from "@/contexts/AuthContext";

const voucherSchema = Yup.object().shape({
    eventId: Yup.number().required("Pilih event terlebih dahulu"),
    voucherCode: Yup.string().required("Kode voucher wajib diisi"),
    discountAmount: Yup.number().min(1).required(),
    minimalPurchase: Yup.number().min(0),
    maximalDiscount: Yup.number().min(0),
    startDate: Yup.date().required(),
    endDate: Yup.date().min(Yup.ref("startDate")),
});

export default function CreateVoucherPage() {
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {
        if (!isLoading && !user) router.push("/login");
    }, [user, isLoading, router]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await API.get("/myevent/all", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                });
                setEvents(res.data.data);
            } catch {
                toast.error("Gagal memuat daftar event.");
            }
        };
        fetchEvents();
    }, []);

    const handleCreateVoucher = async (values: any) => {
        try {
            await API.post(`/myevent/${values.eventId}/vouchers`, values, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            toast.success("Voucher berhasil dibuat!");
            router.push("/dashboard");
        } catch {
            toast.error("Gagal membuat voucher. Silakan coba lagi.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 to-orange-500 text-white py-12">
                <div className="max-w-5xl mx-auto px-4">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="inline-flex items-center space-x-2 text-white hover:text-orange-100 mb-4 transition"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span>Kembali</span>
                    </button>
                    <h1 className="text-4xl font-bold mb-2">
                        Buat Voucher Baru
                    </h1>
                    <p className="text-orange-100 text-lg">
                        Tambahkan voucher ke event Anda
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-10">
                <div className="bg-white p-8 rounded-2xl shadow-xl">
                    <Formik
                        initialValues={{
                            eventId: "",
                            voucherCode: "",
                            discountAmount: 0,
                            minimalPurchase: 0,
                            maximalDiscount: 0,
                            startDate: "",
                            endDate: "",
                        }}
                        validationSchema={voucherSchema}
                        onSubmit={handleCreateVoucher}
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-6">
                                {/* Pilih Event */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Pilih Event *
                                    </label>
                                    <Field
                                        as="select"
                                        name="eventId"
                                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    >
                                        <option value="">
                                            -- Pilih Event --
                                        </option>
                                        {events.map((ev) => (
                                            <option key={ev.id} value={ev.id}>
                                                {ev.title}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage
                                        name="eventId"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                {/* Kode Voucher, Diskon, Tanggal, dll */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Kode Voucher *
                                        </label>
                                        <Field
                                            type="text"
                                            name="voucherCode"
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            placeholder="Contoh: RUN2025"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nilai Diskon (Rp)
                                        </label>
                                        <Field
                                            type="number"
                                            name="discountAmount"
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Nominal */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Minimal Pembelian
                                        </label>
                                        <Field
                                            type="number"
                                            name="minimalPurchase"
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Maksimal Diskon
                                        </label>
                                        <Field
                                            type="number"
                                            name="maximalDiscount"
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Tanggal */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tanggal Mulai
                                        </label>
                                        <Field
                                            type="datetime-local"
                                            name="startDate"
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tanggal Berakhir
                                        </label>
                                        <Field
                                            type="datetime-local"
                                            name="endDate"
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Tombol */}
                                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.push("/dashboard")
                                        }
                                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold inline-flex items-center space-x-2"
                                    >
                                        <Save className="h-5 w-5" />
                                        <span>
                                            {isSubmitting
                                                ? "Menyimpan..."
                                                : "Buat Voucher"}
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
