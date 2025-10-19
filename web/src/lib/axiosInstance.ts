import axios from "axios";

const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000", // ganti sesuai backend kamu
    // withCredentials: true, // kalau pakai cookie/session
    headers: {
        common: {
            "Content-Type": "application/json",
        },
    },
});

export default API;
