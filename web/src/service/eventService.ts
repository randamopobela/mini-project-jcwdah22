// src/services/eventService.js
import axios from "axios";
// 🚀 DIUBAH: Impor BASE_API_URL dari config
import { BASE_API_URL } from "../config/app.config";

interface IEventFilters {
  search?: string | null;
  location?: string | null;
  category?: string | null;
}

export const getAllPublicEvents = async (filters: IEventFilters = {}) => {
  try {
    // 🚀 Buat query string dari objek filter
    const queryParams = new URLSearchParams();
    if (filters.search) queryParams.set("search", filters.search);
    if (filters.location) queryParams.set("location", filters.location);
    if (filters.category) queryParams.set("category", filters.category);

    // Gabungkan URL dengan query string (jika ada)
    const url = `${BASE_API_URL}/events?${queryParams.toString()}`;

    console.log("Memanggil API:", url); // Untuk debugging

    const response = await axios.get(url);
    return response.data.data;
  } catch (error) {
    console.error("Gagal mengambil event:", error);
    throw error;
  }
};

export const getAllCategories = async () => {
  try {
    // Panggil endpoint backend GET /api/categories
    // Sesuaikan URL jika endpoint kategori Anda berbeda
    const response = await axios.get(`${BASE_API_URL}/events/categories`);
    return response.data.data; // Kembalikan array string kategori
  } catch (error) {
    console.error("Gagal mengambil kategori:", error);
    throw error;
  }
};
