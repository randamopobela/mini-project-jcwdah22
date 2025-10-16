import { EventCategory } from "@prisma/client";

// Tipe data untuk input agar lebih jelas dan aman
export interface IEventData {
    title: string;
    description: string;
    location: string;
    startDate: string;
    endDate: string;
    isFree: boolean;
    eventPicture: string;
    organizerId: string;
    category: EventCategory;
    price: number;
    totalSlots: number;
}

export interface IVoucherData {
    voucherCode: string;
    discountAmount: number;
    minimalPurchase: number;
    maximalDiscount: number;
    startDate: string;
    endDate: string;
    isActive?: boolean;
}

export interface IEventUpdateData {
    title?: string;
    description?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    isFree?: boolean;
    eventPicture?: string;
    category?: EventCategory;
    price?: number;
    totalSlots?: number;
}
