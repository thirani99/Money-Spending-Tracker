// import Link from 'next/link'
// import React from 'react'


// const Navbar = () => {
//   return (
//     <nav className="bg-purple-900 text-white p-4">
//       <div className="max-w-6xl mx-auto flex justify-between items-center">
//         <h1 className="text-lg font-semibold">MyApp</h1>

//         <div className="space-x-6">
//           <Link href="/" className="hover:text-gray-200">Home</Link>
//           <Link href="/register" className="hover:text-gray-200">Sinup</Link>
//           <Link href="/login" className="hover:text-gray-200">Login</Link>
//         </div>
//       </div>
//     </nav>
//   )
// }

// export default Navbar




"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    console.log("logged token", token)
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = "/login"; 
  };

  return (
    <nav className="bg-pink-800 text-white p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-lg font-semibold">SpendWise</h1>

        <div className="space-x-6">
          {!isLoggedIn ? (
            <>
              <Link href="/" className="hover:text-gray-200">Home</Link>
              <Link href="/register" className="hover:text-gray-200">Signup</Link>
              <Link href="/login" className="hover:text-gray-200">Login</Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="hover:text-gray-200">Dashboard</Link>
              <Link href="/income" className="hover:text-gray-200">Incomes</Link>
              <Link href="/expenses" className="hover:text-gray-200">Expense</Link>
              <button
                onClick={handleLogout}
                className="hover:text-gray-200 bg-red-600 px-2 py-1 rounded-md ml-2"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
