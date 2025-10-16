import axios from "axios";

// Create a reusable Axios instance
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api", 
  headers: {
    "Content-Type": "application/json",
  },
  
});

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   console.log("Token being sent:", token);
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("Sending request to:", config.url);
  console.log("Token:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
