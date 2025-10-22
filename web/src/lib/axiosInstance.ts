import axios from "axios";

const apiBaseUrl =
    (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000") + "/api";

const API = axios.create({
    baseURL: apiBaseUrl,
    // withCredentials: true, // kalau pakai cookie/session
    headers: {
        common: {
            "Content-Type": "application/json",
        },
    },
});

export default API;
