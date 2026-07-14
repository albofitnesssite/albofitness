import React, { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';

import TrainerManagement from './admin/TrainerManagement';
import TestimonialManagement from './admin/TestimonialManagement';
import FAQManagement from './admin/FAQManagement';
import GymInfoManagement from './admin/GymInfoManagement';
import EnquiriesViewer from './admin/EnquiriesViewer';

import { login, logout, getCurrentUser } from '../services/authService';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('trainers');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const user = await getCurrentUser();

    if (user) {
      setIsLoggedIn(true);
    }
  };

  const handleLogin = async () => {
    try {
      await login(email, password);

      setIsLoggedIn(true);

      setEmail('');
      setPassword('');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-lg shadow-2xl p-8 max-w-md w-full border-2 border-orange-500">
          <h1 className="text-3xl font-black text-center mb-6 text-white uppercase">
            ALBO FITNESS Admin
          </h1>

          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-700 bg-gray-800 text-white rounded-lg mb-4 focus:outline-none focus:border-orange-500 placeholder-gray-500 font-semibold"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleLogin();
            }}
            className="w-full px-4 py-3 border-2 border-gray-700 bg-gray-800 text-white rounded-lg mb-4 focus:outline-none focus:border-orange-500 placeholder-gray-500 font-semibold"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-orange-500 text-black py-3 rounded-lg font-black hover:bg-orange-300 transition uppercase tracking-wide"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Header */}

      <header className="bg-black text-white p-4 shadow-lg border-b-2 border-orange-500">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-black uppercase tracking-tight">
            ALBO FITNESS Admin
          </h1>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 hover:bg-gray-900 hover:text-orange-500 px-4 py-2 rounded transition font-bold uppercase"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </header>

      {/* Tabs */}

      <div className="bg-gray-950 border-b-2 border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-wrap">
          {[
            { id: 'trainers', label: 'Trainers' },
            { id: 'testimonials', label: 'Testimonials' },
            { id: 'faqs', label: 'FAQs' },
            { id: 'gym-info', label: 'Gym Info' },
            { id: 'enquiries', label: 'Enquiries' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-black uppercase transition tracking-wide ${
                activeTab === tab.id
                  ? 'text-black bg-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-400 hover:text-orange-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}

      <div className="max-w-7xl mx-auto p-4">
        {activeTab === 'trainers' && <TrainerManagement />}
        {activeTab === 'testimonials' && <TestimonialManagement />}
        {activeTab === 'faqs' && <FAQManagement />}
        {activeTab === 'gym-info' && <GymInfoManagement />}
        {activeTab === 'enquiries' && <EnquiriesViewer />}
      </div>
    </div>
  );
}