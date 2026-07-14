import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import albologo from '/src/assets/albo.PNG'

export default function Header({ onAdminClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
      <header className="bg-black text-white sticky top-0 z-50 border-b-2 border-orange-500">
      <nav className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
        <img 
          src={albologo} 
          alt="ALBO FITNESS" 
          className="h-10 w-auto"
        />
      </div>
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#home" className="text-gray-300 hover:text-white font-medium transition-colors">
            Home
          </a>
          <a href="#trainers" className="text-gray-300 hover:text-white font-medium transition-colors">
            Trainers
          </a>
          <a href="#faqs" className="text-gray-300 hover:text-white font-medium transition-colors">
            FAQs
          </a>
          <a href="#contact" className="text-gray-300 hover:text-white font-medium transition-colors">
            Contact
          </a>
          {/* <button
            onClick={onAdminClick}
            className="px-6 py-2 rounded-full bg-white text-black hover:bg-gray-100 transition-colors font-semibold"
          >
            Admin
          </button> */}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          {/* <button
            onClick={onAdminClick}
            className="px-4 py-2 rounded-full bg-white text-black hover:bg-gray-100 transition-colors text-sm font-semibold"
          >
            Admin
          </button> */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800">
          <div className="flex flex-col p-4 space-y-3 max-w-7xl mx-auto">
            <a href="#home" className="py-2 text-gray-300 hover:text-white transition-colors">
              Home
            </a>
            <a href="#trainers" className="py-2 text-gray-300 hover:text-white transition-colors">
              Trainers
            </a>
            <a href="#faqs" className="py-2 text-gray-300 hover:text-white transition-colors">
              FAQs
            </a>
            <a href="#contact" className="py-2 text-gray-300 hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
