import { BASE_API_URL } from "@/config/app.config";
import axios from "axios";

const API = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    common: {
      "Content-Type": "application/json",
    },
  },
});

export default API;
