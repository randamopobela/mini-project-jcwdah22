"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { TUser } from "@/types/user.type";
import API from "@/lib/axiosInstance";
import { jwtDecode } from "jwt-decode";
import { getToken, removeToken, setToken } from "@/utils/auth";

interface AuthContextType {
    user: TUser | null;
    login: (email: string, password: string) => Promise<void>;
    // register: (data: UserRegister) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<TUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Mengambil data user dari localStorage setelah refresh halaman, jika ada
        // agar tidak perlu login lagi.
        const token = getToken();
        if (token) {
            const userDecoded: TUser = jwtDecode(token);
            setUser(userDecoded);
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await API.post(
                "/auth/login",
                { email, password }
                // { withCredentials: true } // opsional, kalau backend pakai cookie
            );

            API.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${response.data?.data?.token}`;

            // Menyimpan token dari response.data.data ke dalam localStorage
            const userToken = response.data?.data?.token;
            setToken(userToken);

            // Mengambil data user dari token
            const userDecoded: TUser = jwtDecode(userToken);
            setUser(userDecoded);
        } catch (error: any) {
            const message = error.response?.data?.message;
            throw new Error(message);
        }
    };

    // const register = async (data: UserRegister) => {
    //     const mockUser: User = {
    //         id: "1",
    //         email: data.email,
    //         userName: data.email.split("@")[0],
    //         firstName: data.firstName,
    //         lastName: data.lastName,
    //         role: data.role as UserRole,
    //         referralCode:
    //             "REF" +
    //             Math.random().toString(36).substring(2, 10).toUpperCase(),
    //         isActive: true,
    //         createdAt: new Date().toISOString(),
    //         updatedAt: new Date().toISOString(),
    //     };

    //     setUser(mockUser);
    //     localStorage.setItem("user", JSON.stringify(mockUser));
    // };

    const logout = () => {
        setUser(null);
        removeToken();
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
