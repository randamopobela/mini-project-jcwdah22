// Interface untuk UserRegister
export interface UserRegister {
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
export interface UserLogin {
    id: string;
    email: string;
    password?: string;
    role: string;
    isActive: boolean;
}

export interface UserResetPassword {
    id: string;
    email: string;
    firstName: string;
    password?: string;
    isActive: boolean;
}
