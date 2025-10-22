export type IEventData = {
    id: number;
    title: string;
    description: string;
    category: string;
    eventPicture?: string;
    location: string;
    startDate: Date;
    endDate: Date;
    price: number;
    availableSlots: number;
    totalSlots: number;
    organizerId: string;
    status: string;
    isFree: boolean;
    createdAt: Date;
    updatedAt: Date;
};
