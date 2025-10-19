// Interface untuk UserRegister
export interface IUserRegister {
    id: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    profile_picture?: string | null;
    role: string;
    referral_code: string;
    referred_by?: string | null;
    points_expiration?: Date | null;
    is_active: boolean;
}

// interface untuk UserLogin
// export interface IUserLogin {
//     id: string;
//     email: string;
//     password?: string;
//     role: string;
//     isActive: boolean;
// }

export interface IUserLogin {
    id: string;
    email: string;
    password?: string;
    userName: string;
    firstName: string;
    lastName?: string;
    profilePicture: string;
    role: string;
    phone: string;
    address: string;
    referralCode: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserResetPassword {
    id: string;
    email: string;
    firstName: string;
    password?: string;
    isActive: boolean;
}
