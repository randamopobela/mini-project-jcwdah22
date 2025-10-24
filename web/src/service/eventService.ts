// src/services/eventService.js
import axios from "axios";
// 🚀 DIUBAH: Impor BASE_API_URL dari config
import { BASE_API_URL } from "../config/app.config";

/**
 * Mengambil semua event publik dari backend.
 */
export const getAllPublicEvents = async () => {
  try {
    // 🚀 DIUBAH: Menggunakan variabel config
    const response = await axios.get(`${BASE_API_URL}/events`);
    return response.data.data; // Kembalikan array 'data'
  } catch (error) {
    console.error("Gagal mengambil event:", error);
    throw error;
  }
};
