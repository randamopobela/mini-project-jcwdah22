import axios from "axios";

const API = axios.create({
    baseURL:
        `${process.env.NEXT_PUBLIC_API_URL}/api` || "http://localhost:8000", // ganti sesuai backend kamu
    // withCredentials: true, // kalau pakai cookie/session
    headers: {
        common: {
            "Content-Type": "application/json",
        },
    },
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;
