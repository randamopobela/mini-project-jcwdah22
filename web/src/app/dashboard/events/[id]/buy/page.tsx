"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import {
    Calendar,
    MapPin,
    Users,
    ArrowLeft,
    CreditCard,
    TicketPercent,
} from "lucide-react";
import { Button, Label, Select, TextInput } from "flowbite-react";
import API from "@/lib/axiosInstance";
import { useAuth } from "@/contexts/AuthContext";
import { TTransaction } from "@/types/transaction.type";

const TransactionSchema = Yup.object().shape({
    ticketQuantity: Yup.number()
        .min(1, "Minimal 1 tiket")
        .required("Jumlah tiket harus diisi"),
    paymentMethod: Yup.string().required("Pilih metode pembayaran"),
});

const handleSubmitTransaction = async (
    values: TTransaction,
    event: any,
    router: any,
    setLoading: (v: boolean) => void,
    setSubmitting: FormikHelpers<TTransaction>["setSubmitting"]
) => {
    setLoading(true);
    try {
        const payload = {
            ...values,
            totalPrice: event.price * values.ticketQuantity,
            finalPrice:
                event.price * values.ticketQuantity -
                (values.discountPoints +
                    values.discountVouchers +
                    values.discountCoupons),
        };

        const res = await API.post("/transaction/create", payload);
        toast.success("Pemesanan tiket berhasil!");
        router.push(`/purchase/${res.data.data.id}`);
    } catch (error: any) {
        toast.error(
            error.response?.data?.message || "Terjadi kesalahan saat memesan."
        );
    } finally {
        setSubmitting(false);
        setLoading(false);
    }
};

export default function BuyTicketPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const { user } = useAuth();

    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Ambil detail event
    useEffect(() => {
        if (!user) {
            toast.info("Silakan login terlebih dahulu untuk membeli tiket.");
            router.push("/login");
            return;
        }

        const fetchEvent = async () => {
            try {
                const res = await API.get(`/events/${id}`);
                setEvent(res.data.data);
            } catch (error) {
                toast.error("Gagal memuat data event.");
            }
        };

        fetchEvent();
    }, [id, user, router]);

    if (!event)
        return (
            <div className="flex justify-center items-center min-h-screen">
                Memuat data event...
            </div>
        );

    return (
        <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            {/* HEADER */}
            <div className="flex items-center gap-3 mb-8">
                <Link
                    href={`/events/${id}`}
                    className="text-gray-600 hover:text-orange-600"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">
                    Pemesanan Tiket Event
                </h1>
            </div>

            {/* EVENT INFO */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-10">
                <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${event.eventPicture}`}
                    alt={event.title}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    {event.title}
                </h2>
                <div className="flex flex-wrap gap-4 text-gray-600 text-sm mb-4">
                    <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(event.startDate).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })}
                    </div>
                    <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {event.location}
                    </div>
                    <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        {event.totalSlots - event.availableSlots} peserta
                        terdaftar
                    </div>
                </div>
                <p className="text-gray-700">{event.description}</p>
            </div>

            {/* FORM PEMESANAN */}
            <Formik
                initialValues={
                    {
                        eventId: event.id,
                        userId: user?.id || "",
                        ticketQuantity: 1,
                        totalPrice: event.price,
                        discountPoints: 0,
                        discountVouchers: 0,
                        discountCoupons: 0,
                        finalPrice: event.price,
                        status: "AWAITING_PAYMENT",
                        paymentProof: "",
                        paymentMethod: "BANK_TRANSFER",
                        expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 jam
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    } as TTransaction
                }
                validationSchema={TransactionSchema}
                onSubmit={(values, { setSubmitting }) =>
                    handleSubmitTransaction(
                        values,
                        event,
                        router,
                        setLoading,
                        setSubmitting
                    )
                }
            >
                {({ values, handleChange, setFieldValue, isSubmitting }) => {
                    const total = event.price * values.ticketQuantity;
                    const final =
                        total -
                        (values.discountPoints +
                            values.discountVouchers +
                            values.discountCoupons);

                    return (
                        <Form className="bg-white rounded-xl shadow-md p-6 space-y-6">
                            {/* Jumlah Tiket */}
                            <div>
                                <Label htmlFor="ticketQuantity">
                                    Jumlah Tiket
                                </Label>
                                <Field
                                    as={TextInput}
                                    id="ticketQuantity"
                                    name="ticketQuantity"
                                    type="number"
                                    min={1}
                                    max={event.availableSlots}
                                    onChange={(e: any) => {
                                        const val =
                                            parseInt(e.target.value) || 1;
                                        setFieldValue("ticketQuantity", val);
                                        setFieldValue(
                                            "totalPrice",
                                            event.price * val
                                        );
                                        setFieldValue(
                                            "finalPrice",
                                            event.price * val
                                        );
                                    }}
                                />
                                <ErrorMessage
                                    name="ticketQuantity"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Tersisa {event.availableSlots} tiket
                                    tersedia.
                                </p>
                            </div>

                            {/* Voucher / Coupon */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="discountVouchers">
                                        Kode Voucher
                                    </Label>
                                    <Field
                                        as={TextInput}
                                        id="discountVouchers"
                                        name="discountVouchers"
                                        type="text"
                                        placeholder="Masukkan kode voucher"
                                        onChange={(e: any) => {
                                            // kamu bisa tambahkan validasi kode di sini
                                            handleChange(e);
                                        }}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="discountCoupons">
                                        Kode Kupon
                                    </Label>
                                    <Field
                                        as={TextInput}
                                        id="discountCoupons"
                                        name="discountCoupons"
                                        type="text"
                                        placeholder="Masukkan kode kupon"
                                        onChange={(e: any) => {
                                            handleChange(e);
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Metode Pembayaran */}
                            <div>
                                <Label htmlFor="paymentMethod">
                                    Metode Pembayaran
                                </Label>
                                <Field
                                    as={Select}
                                    id="paymentMethod"
                                    name="paymentMethod"
                                    onChange={handleChange}
                                >
                                    <option value="BANK_TRANSFER">
                                        Transfer Bank
                                    </option>
                                    <option value="EWALLET">E-Wallet</option>
                                    <option value="CREDIT_CARD">
                                        Kartu Kredit
                                    </option>
                                </Field>
                                <ErrorMessage
                                    name="paymentMethod"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            {/* RINGKASAN HARGA */}
                            <div className="border-t pt-4 mt-4 text-gray-800">
                                <div className="flex justify-between mb-2">
                                    <span>Harga Tiket</span>
                                    <span>
                                        Rp {event.price.toLocaleString("id-ID")}
                                    </span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Jumlah</span>
                                    <span>{values.ticketQuantity} tiket</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Diskon</span>
                                    <span>
                                        Rp{" "}
                                        {(
                                            values.discountPoints +
                                            values.discountVouchers +
                                            values.discountCoupons
                                        ).toLocaleString("id-ID")}
                                    </span>
                                </div>
                                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                                    <span>Total Bayar</span>
                                    <span>
                                        Rp {final.toLocaleString("id-ID")}
                                    </span>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                color="green"
                                className="w-full"
                                disabled={isSubmitting || loading}
                            >
                                {loading
                                    ? "Memproses..."
                                    : "Lanjutkan Pembayaran"}
                                <CreditCard className="ml-2 h-5 w-5" />
                            </Button>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
}
