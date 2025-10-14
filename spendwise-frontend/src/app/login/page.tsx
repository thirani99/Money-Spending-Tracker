"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await api.post("/login", {
        email,
        password,
      });
      console.log(response.data);
      alert("login successfully!");

        console.log(" Redirecting to login page");
      router.push("/expenses");
      
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      alert("login failed!");
    }
  };


  return (
    <main className="flex justify-center items-center h-screen">
      <form onSubmit={handleLogin} className="p-6 border rounded shadow-md w-80">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />
        <div className="flex justify-between gap-4">
          <button type="submit" className="w-1/2 bg-purple-600 text-white p-2 rounded">
          Login
        </button>
        {/* <button className="w-1/2 bg-blue-600 text-white p-2 rounded">
          Sign up
        </button> */}
        </div>
        
      </form>
    </main>
  );
}
