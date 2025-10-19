import { prisma } from "../config/config";

export const generateIdUser = async () => {
    // Mendapatkan ID terakhir dari tabel user
    const lastUser = await prisma.user.findFirst({
        orderBy: { id: "desc" },
    });

    let newId = "USR001"; // Default ID jika belum ada user
    if (lastUser) {
        const lastIdNumber = parseInt(lastUser.id.toString().substring(3)) || 0;
        newId = `USR${String(lastIdNumber + 1).padStart(3, "0")}`;
    }

    return newId;
};

// export const generateIdEvent = () => {};

// export const generateIdTicket = () => {};

// export const generateIdTransaction = () => {};

// export const generateIdVoucher = () => {};

// export const generateIdCoupon = () => {};

// export const generateIdReview = () => {};

// export const generateIdReferral = () => {};

// export const generateIdPointsLog = () => {};

// export const generateIdNotification = () => {};
