"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { User, UserRegister } from "@/types/user";

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

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const mockUser: User = {
            email,
            userName: email.split("@")[0],
            firstName: "John",
            lastName: "Doe",
            role: "CUSTOMER",
            referralCode: "REF123456",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        setUser(mockUser);
        localStorage.setItem("user", JSON.stringify(mockUser));
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
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
