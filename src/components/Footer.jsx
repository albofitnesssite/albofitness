import React from 'react';
import { MapPin, Phone, Mail, Star, Heart, Share2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-20 border-t-2 border-orange-500">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-black mb-4 text-orange-500 uppercase">ALBO</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Transform your body, transform your life. Excellence in every rep.
            </p>
            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors p-2 hover:bg-gray-900 rounded-full">
                <Star size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors p-2 hover:bg-gray-900 rounded-full">
                <Heart size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors p-2 hover:bg-gray-900 rounded-full">
                <Share2 size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-orange-500 uppercase">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#home" className="text-gray-400 hover:text-orange-500 transition-colors">Home</a></li>
              <li><a href="#trainers" className="text-gray-400 hover:text-orange-500 transition-colors">Trainers</a></li>
              <li><a href="#faqs" className="text-gray-400 hover:text-orange-500 transition-colors">FAQs</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-orange-500 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-orange-500 uppercase">Services</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Personal Training</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Group Classes</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Nutrition</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Membership</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-orange-500 uppercase">Contact</h4>
            <div className="space-y-4">
              <div className="flex gap-3 text-sm">
                <MapPin size={20} className="text-orange-500 flex-shrink-0 mt-1" />
                <span className="text-gray-400">Trichy, Tamil Nadu</span>
              </div>
              <div className="flex gap-3 text-sm">
                <Phone size={20} className="text-orange-500 flex-shrink-0" />
                <a href="tel:" className="text-gray-400 hover:text-orange-500 transition-colors">+91 9876543210</a>
              </div>
              <div className="flex gap-3 text-sm">
                <Mail size={20} className="text-orange-500 flex-shrink-0" />
                <a href="mailto:" className="text-gray-400 hover:text-orange-500 transition-colors">info@albofitness.com</a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>&copy; 2026 ALBO FITNESS. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-orange-500 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}