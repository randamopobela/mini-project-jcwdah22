import { Request, NextFunction } from "express";
import { prisma } from "../config/config";
import { getUserByEmail, getUserForDeactivate } from "../helpers/user.prisma";
import {
    IUser,
    IUserDeactivate,
    IUserLogin,
} from "../interfaces/user.interface";
import { generateJWT } from "../helpers/jwt";

class userService {
    async update(req: Request) {
        const { email, userName, firstName, lastName, phone, address } =
            req.body;

        const user = (await getUserByEmail(email)) as IUser;

        await prisma.user.update({
            where: { id: user.id },
            data: {
                userName: userName,
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                address: address,
            },
        });

        const updatedUser = (await getUserByEmail(email)) as IUserLogin;
        delete updatedUser.password;
        const token = generateJWT(updatedUser);

        return { token };
    }

    async changeProfilePicture(req: Request, next: NextFunction) {
        // Validasi file
        if (!req.file) {
            throw new Error("Tidak ada file yang diupload.");
        }

        // Buat path public-nya
        const imagePath = `/images/profile/${req.file.filename}`;

        // Update data user
        const user = await prisma.user.update({
            where: { id: (req as any).user.id }, // tergantung auth middleware kamu
            data: { profilePicture: imagePath },
        });

        const updatedUser = (await getUserByEmail(user.email)) as IUserLogin;
        delete updatedUser.password;
        const token = generateJWT(updatedUser);

        return { token };
    }

    async deactivate(req: Request) {
        const { id } = req.body;
        const user = (await getUserForDeactivate(id)) as IUserDeactivate;

        await prisma.user.update({
            where: { id: user.id },
            data: { isActive: false },
        });
    }
}

export default new userService();
