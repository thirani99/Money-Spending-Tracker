import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <nav className="bg-purple-900 text-white p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-lg font-semibold">MyApp</h1>

        <div className="space-x-6">
          <Link href="/" className="hover:text-gray-200">Home</Link>
          <Link href="/register" className="hover:text-gray-200">Sinup</Link>
          <Link href="/login" className="hover:text-gray-200">Login</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar