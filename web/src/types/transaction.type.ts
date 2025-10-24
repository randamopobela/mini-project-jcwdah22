import { IEventData } from "./event.type";
import { TUser } from "./user.type";

export type TTransaction = {
    id?: number;
    eventId: IEventData;
    event: IEventData;
    userId: TUser;
    user: TUser;
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
