// src/lib/api.ts
import axios from "axios";

// Create a reusable Axios instance
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api", // unified base URL
  headers: {
    "Content-Type": "application/json",
  },
});
