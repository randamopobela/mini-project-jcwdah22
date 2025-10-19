"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Card, Badge, Button, Label, TextInput } from "flowbite-react";
import {
    Calendar,
    MapPin,
    Ticket,
    ArrowLeft,
    Upload,
    CheckCircle,
    XCircle,
    Clock,
    CreditCard,
} from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { TTransaction } from "@/types/transaction.type";

const PaymentProofSchema = Yup.object().shape({
    paymentProof: Yup.string()
        .url("URL tidak valid")
        .required("Bukti bayar wajib diisi"),
});

const mockTransaction: TTransaction = {
    id: 1,
    userId: "1",
    eventId: 1,
    quantity: 2,
    totalPrice: 500000,
    paymentMethod: "BANK_TRANSFER",
    paymentProof: "https://example.com/proof1.jpg",
    status: "PENDING",
    expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    event: {
        id: 1,
        title: "Jakarta Marathon 2024",
        category: "MARATHON",
        location: "Jakarta, Indonesia",
        startDate: "2024-11-15",
        endDate: "2024-11-15",
        price: 250000,
        availableSlots: 750,
        totalSlots: 1000,
        organizerId: "2",
        status: "PUBLISHED",
        isFree: false,
        description: "Marathon event di Jakarta",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    user: {
        id: "1",
        email: "john@example.com",
        userName: "john",
        firstName: "John",
        lastName: "Doe",
        role: "CUSTOMER",
        referralCode: "REF123456",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
};

export default function TransactionDetailPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const [transaction, setTransaction] = useState<Transaction | null>(
        mockTransaction
    );

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    const handleUploadProof = async (
        values: { paymentProof: string },
        { setSubmitting }: any
    ) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setTransaction({
                ...transaction!,
                paymentProof: values.paymentProof,
            });
            toast.success("Bukti pembayaran berhasil diupload!");
            setSubmitting(false);
        } catch (error: any) {
            toast.error(error.message || "Gagal mengupload bukti pembayaran.");
            setSubmitting(false);
        }
    };

    const handleApprove = async () => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setTransaction({ ...transaction!, status: "PAID" });
            toast.success("Pembayaran berhasil diapprove!");
        } catch (error: any) {
            toast.error(error.message || "Gagal mengapprove pembayaran.");
        }
    };

    const handleReject = async () => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setTransaction({
                ...transaction!,
                status: "REJECTED",
                paymentProof: undefined,
            });
            toast.success("Pembayaran berhasil ditolak.");
        } catch (error: any) {
            toast.error(error.message || "Gagal menolak pembayaran.");
        }
    };

    if (isLoading || !user || !transaction) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Memuat...
            </div>
        );
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PAID":
                return <Badge color="success">Dibayar</Badge>;
            case "PENDING":
                return <Badge color="warning">Menunggu Pembayaran</Badge>;
            case "REJECTED":
                return <Badge color="failure">Ditolak</Badge>;
            case "EXPIRED":
                return <Badge color="gray">Kadaluarsa</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const getPaymentMethodLabel = (method: string) => {
        switch (method) {
            case "BANK_TRANSFER":
                return "Transfer Bank";
            case "E_WALLET":
                return "E-Wallet";
            case "CREDIT_CARD":
                return "Kartu Kredit";
            default:
                return method;
        }
    };

    const isOrganizer =
        user.role === "ORGANIZER" && user.id === transaction.event?.organizerId;

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-4xl mx-auto px-4 py-12">
                <Link
                    href="/transactions"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Daftar Transaksi
                </Link>

                <div className="space-y-6">
                    <Card>
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h1 className="text-2xl font-bold mb-2">
                                    {transaction.event?.title}
                                </h1>
                                <p className="text-sm text-gray-500">
                                    ID Transaksi: TRX-
                                    {transaction.id.toString().padStart(6, "0")}
                                </p>
                            </div>
                            {getStatusBadge(transaction.status)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <h3 className="font-semibold mb-3">
                                    Detail Event
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-start">
                                        <MapPin className="mr-2 h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
                                        <span>
                                            {transaction.event?.location}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                                        {transaction.event &&
                                            new Date(
                                                transaction.event.startDate
                                            ).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                    </div>
                                    <div className="flex items-center">
                                        <Ticket className="mr-2 h-4 w-4 text-gray-500" />
                                        {transaction.event?.category.replace(
                                            "_",
                                            " "
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-3">
                                    Detail Pembelian
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Jumlah Tiket:
                                        </span>
                                        <span className="font-medium">
                                            {transaction.quantity} Tiket
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Harga per Tiket:
                                        </span>
                                        <span className="font-medium">
                                            Rp{" "}
                                            {transaction.event?.price.toLocaleString(
                                                "id-ID"
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t">
                                        <span className="font-semibold">
                                            Total:
                                        </span>
                                        <span className="font-bold text-blue-600 text-lg">
                                            Rp{" "}
                                            {transaction.totalPrice.toLocaleString(
                                                "id-ID"
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="font-semibold mb-3">
                                Informasi Pembayaran
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <CreditCard className="mr-2 h-4 w-4 text-gray-500" />
                                    <span className="text-sm">
                                        Metode:{" "}
                                        {getPaymentMethodLabel(
                                            transaction.paymentMethod
                                        )}
                                    </span>
                                </div>
                                {transaction.status === "PENDING" && (
                                    <div className="flex items-center text-orange-600">
                                        <Clock className="mr-2 h-4 w-4" />
                                        <span className="text-sm">
                                            Kadaluarsa:{" "}
                                            {new Date(
                                                transaction.expiredAt
                                            ).toLocaleString("id-ID", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>

                    {transaction.status === "PENDING" &&
                        !transaction.paymentProof &&
                        !isOrganizer && (
                            <Card>
                                <h3 className="font-semibold mb-4">
                                    Upload Bukti Pembayaran
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Silakan upload bukti transfer Anda. Format
                                    yang diterima: JPG, PNG, PDF
                                </p>
                                <Formik
                                    initialValues={{ paymentProof: "" }}
                                    validationSchema={PaymentProofSchema}
                                    onSubmit={handleUploadProof}
                                >
                                    {({ isSubmitting, errors, touched }) => (
                                        <Form className="space-y-4">
                                            <div>
                                                <Label htmlFor="paymentProof">
                                                    URL Bukti Pembayaran
                                                </Label>
                                                <Field
                                                    as={TextInput}
                                                    id="paymentProof"
                                                    name="paymentProof"
                                                    type="url"
                                                    placeholder="https://example.com/bukti-bayar.jpg"
                                                    color={
                                                        errors.paymentProof &&
                                                        touched.paymentProof
                                                            ? "failure"
                                                            : undefined
                                                    }
                                                />
                                                <ErrorMessage
                                                    name="paymentProof"
                                                    component="p"
                                                    className="text-red-600 text-sm mt-1"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Masukkan URL gambar bukti
                                                    pembayaran Anda
                                                </p>
                                            </div>
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                            >
                                                <Upload className="mr-2 h-4 w-4" />
                                                {isSubmitting
                                                    ? "Mengupload..."
                                                    : "Upload Bukti Pembayaran"}
                                            </Button>
                                        </Form>
                                    )}
                                </Formik>
                            </Card>
                        )}

                    {transaction.paymentProof && (
                        <Card>
                            <h3 className="font-semibold mb-4">
                                Bukti Pembayaran
                            </h3>
                            <div className="bg-gray-100 p-4 rounded-lg">
                                <img
                                    src={transaction.paymentProof}
                                    alt="Bukti Pembayaran"
                                    className="max-w-full h-auto rounded"
                                />
                            </div>
                            {isOrganizer &&
                                transaction.status === "PENDING" && (
                                    <div className="flex gap-4 mt-4">
                                        <Button
                                            color="success"
                                            onClick={handleApprove}
                                            className="flex-1"
                                        >
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            Approve Pembayaran
                                        </Button>
                                        <Button
                                            color="failure"
                                            onClick={handleReject}
                                            className="flex-1"
                                        >
                                            <XCircle className="mr-2 h-4 w-4" />
                                            Tolak Pembayaran
                                        </Button>
                                    </div>
                                )}
                        </Card>
                    )}

                    {transaction.status === "PAID" && (
                        <Card>
                            <div className="flex items-center justify-center py-8">
                                <div className="text-center">
                                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">
                                        Pembayaran Berhasil!
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Tiket Anda telah aktif dan siap
                                        digunakan
                                    </p>
                                    <div className="bg-gray-100 p-6 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-2">
                                            Kode Tiket:
                                        </p>
                                        <p className="text-2xl font-mono font-bold">
                                            TKT-
                                            {transaction.id
                                                .toString()
                                                .padStart(6, "0")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {transaction.status === "REJECTED" && (
                        <Card>
                            <div className="flex items-center justify-center py-8">
                                <div className="text-center">
                                    <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">
                                        Pembayaran Ditolak
                                    </h3>
                                    <p className="text-gray-600">
                                        Bukti pembayaran Anda ditolak. Silakan
                                        upload ulang bukti yang valid.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
}
