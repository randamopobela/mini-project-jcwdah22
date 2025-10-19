export type TTransaction = {
    id?: number;
    eventId: number;
    userId: string;
    ticketQuantity: number;
    totalPrice: number;
    discountPoints: number;
    discountVouchers: number;
    discountCoupons: number;
    finalPrice: number;
    status: string; // enum di prisman = AWAITING_PAYMENT, PENDING_CONFIRMATION, PAID, REJECTED, EXPIRED, CANCELED
    paymentProof: string;
    paymentMethod: string; // enum di prisman = BANK_TRANSFER, CREDIT_CARD, E_WALLET
    expiredAt: Date;
    createdAt: Date;
    updatedAt: Date;
};
