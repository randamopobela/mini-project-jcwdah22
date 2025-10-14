interface User {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    phone?: number | null;
    role: "CUSTOMER" | "ORGANIZER";
    referralCode?: string | null;
    isActive?: boolean;
    profilePicture?: string | null;
    address?: string | null;
    createdAt: string;
    updatedAt: string;
}

interface UserRegister extends User {
    password?: string;
    confirmPassword?: string;
}

export type { User, UserRegister };
