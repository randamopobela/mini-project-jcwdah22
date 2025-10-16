export type TTransaction = {
    id: number;
    eventId: number;
    event: TEvent;
    userId: string;
    user: TUser;
    ticketQuantity: number;
    totalPrice: number;
    discountPoints: number;
    discountVouchers: number;
    discountCoupons: number;
    finalPrice: number;
    status: string;
    paymentProof: string;
    paymentMethod: string;
    expiredAt: Date;
    createdAt: Date;
    updatedAt: Date;
};
