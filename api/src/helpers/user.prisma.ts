import { prisma } from "../config";

export const getUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({
        select: {
            id: true,
            password: true,
            role: true,
            isActive: true,
        },
        where: {
            email,
        },
    });
};
