"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { User, UserRegister } from "@/types/user";
import API from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    // register: (data: UserRegister) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
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

            const userData = response.data?.user || response.data; // tergantung struktur response

            setUser(userData);

            localStorage.setItem("user", JSON.stringify(userData));
        } catch (error: any) {
            const msg = error.response?.data?.message || "Login gagal!";
            console.error("Login error:", msg);
            throw new Error(msg);
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
        localStorage.removeItem("user");
        router.push("/"); // Redirect ke beranda setelah logout
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
