import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import React from 'react'

export default function PublicLayout({ children }) {
  return (
    <div className="flex min-h-screen">

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
       <Navbar/>

        {/* Page content */}
        <main className="flex-1 p-6 bg-gray-40">
          {children}
        </main>

         {/* Footer */}
        <Footer/>
      </div>
    </div>
  )
}