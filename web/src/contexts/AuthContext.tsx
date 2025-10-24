// src/contexts/AuthContext.tsx (atau .js)

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { TJwtPayload, TUser } from "@/types/user.type"; // Pastikan path import ini benar
import API from "@/lib/axiosInstance"; // Pastikan path import ini benar
import { decodeToken, getToken, removeToken, setToken } from "@/utils/auth"; // Pastikan path import ini benar
import { jwtDecode } from "jwt-decode";
import axios from "axios";

interface AuthContextType {
  user: TUser | null;
  login: (email: string, password: string) => Promise<void>;
  updateUser: (newUser: TUser) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Mulai dengan loading

  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        // 🚀 DIUBAH: Decode sebagai TJwtPayload
        const fullPayload: TJwtPayload = jwtDecode(token);
        // Cek kedaluwarsa menggunakan payload.exp
        if (fullPayload.exp * 1000 < Date.now()) {
          removeToken();
          setUser(null);
        } else {
          const userData: TUser = decodeToken(token); // Asumsi decodeToken mengembalikan TUser
          setUser(userData);
          API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
      } catch {
        removeToken();
        setUser(null);
      }
    }
    setIsLoading(false); // Selesai loading inisial
  }, []);

  const login = async (email: string, password: string) => {
    // PERBAIKAN 2: Set loading saat proses login dimulai
    setIsLoading(true);
    try {
      const response = await API.post("/auth/login", { email, password });

      const userToken = response.data?.data?.token;

      // Set default header untuk request selanjutnya
      API.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;

      setToken(userToken);
      const userDecoded = decodeToken(userToken);
      setUser(userDecoded);
    } catch (error) {
      // 🚀 DIUBAH: Hapus ': any' (atau ganti dengan ': unknown')
      let message = "Login gagal"; // Default message

      // 🚀 TAMBAHKAN: Cek apakah error berasal dari Axios
      if (axios.isAxiosError(error)) {
        // Jika ya, kita bisa aman mengakses error.response
        message = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        // Jika error biasa, gunakan pesannya
        message = error.message;
      }

      throw new Error(message);
    } finally {
      // PERBAIKAN 2: Pastikan loading selesai, baik berhasil maupun gagal
      setIsLoading(false);
    }
  };

  const updateUser = (newUser: TUser) => setUser(newUser);

  const logout = () => {
    setUser(null);
    removeToken();
    // PERBAIKAN 3: Hapus token dari default header axios
    delete API.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{ user, login, updateUser, logout, isLoading }}
    >
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
