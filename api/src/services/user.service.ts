import { Request, NextFunction } from "express";
import { jwtSecret, prisma } from "../config/config";
import { getUserByEmail, getUserForDeactivate } from "../helpers/user.prisma";
import { IUserDeactivate, IUserLogin } from "../interfaces/user.interface";
import { generateJWT } from "../helpers/jwt";
import { compare } from "bcrypt";
import { ErrorHandler } from "../helpers/response.handler";
import { hashedPassword } from "../helpers/bcrypt";
import { sign } from "jsonwebtoken";

class userService {
    async update(req: Request) {
        if (!req.user) {
            throw new ErrorHandler("User not authenticated.", 401);
        }

        const { userName, firstName, lastName, phone, address } = req.body;

        await prisma.user.update({
            where: { id: req.user.id },
            data: {
                userName,
                firstName,
                lastName,
                phone,
                address,
            },
        });

        const updatedUser = (await getUserByEmail(req.user.email)) as IUserLogin;
        delete updatedUser.password;
        const token = generateJWT(updatedUser);

        return { token };
    }

    async changePassword(req: Request) {
        const { email, currentPassword, newPassword } = req.body;

        const user = (await getUserByEmail(email)) as IUserLogin;

        if (!(await compare(currentPassword, user.password as string))) {
            throw new ErrorHandler("Password is incorrect.", 401);
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { password: await hashedPassword(newPassword) },
        });

        delete user.password;
        const token = sign(user, jwtSecret, {
            expiresIn: "30m",
        });

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
        if (!req.user) {
            throw new ErrorHandler("User not authenticated.", 401);
        }

        const user = (await getUserForDeactivate(req.user.id)) as IUserDeactivate;
        if (!user) {
            throw new ErrorHandler("User not found.", 404);
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { isActive: false },
        });

        return { success: true };
    }
}

export default new userService();
