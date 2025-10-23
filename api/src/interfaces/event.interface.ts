import { Event, EventCategory, EventStatus } from "@prisma/client";

// Tipe data untuk input agar lebih jelas dan aman
export interface IEventData {
    title: string;
    description: string;
    category: EventCategory;
    eventPicture: string;
    location: string;
    startDate: Date;
    endDate: Date;
    price: number;
    totalSlots: number;
    organizerId: string;
    status: EventStatus;
    isFree: boolean;
}

export interface IEventDataSearch extends IEventData {
    id: number;
    availableSlots: number;
    createdAt: Date;
    updatedAt: Date;
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
