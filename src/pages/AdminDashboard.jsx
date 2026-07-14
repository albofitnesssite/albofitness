import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  MessageSquareQuote, 
  HelpCircle, 
  Info, 
  LogOut, 
  Mail,
  Images
} from 'lucide-react';

// Import your management components from the admin folder
import EnquiriesViewer from '../components/admin/EnquiriesViewer';
import TrainerManagement from '../components/admin/TrainerManagement';
import TestimonialManagement from '../components/admin/TestimonialManagement';
import TransformationManagement from '../components/admin/TransformationManagement';
import FAQManagement from '../components/admin/FAQManagement';
import GymInfoManagement from '../components/admin/GymInfoManagement';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('enquiries');
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { supabase } = await import('../services/supabase');
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const menuItems = [
    { id: 'enquiries', label: 'Enquiries', icon: Mail, component: <EnquiriesViewer /> },
    { id: 'trainers', label: 'Trainers', icon: Users, component: <TrainerManagement /> },
    { id: 'testimonials', label: 'Reviews', icon: MessageSquareQuote, component: <TestimonialManagement /> },
    { id: 'transformations', label: 'Transformations', icon: Images, component: <TransformationManagement /> },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle, component: <FAQManagement /> },
    { id: 'gyminfo', label: 'Gym Info', icon: Info, component: <GymInfoManagement /> },
  ];

  const activeComponent = menuItems.find(item => item.id === activeTab)?.component;
  const activeLabel = menuItems.find(item => item.id === activeTab)?.label;

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* ===== SIDEBAR ===== */}
      <aside className="w-64 bg-gray-950 border-r border-gray-800 flex flex-col fixed h-full z-20">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-black text-orange-500 tracking-tighter">ALBO FITNESS</h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-[3px] mt-1 font-bold">Admin Portal</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm uppercase tracking-wide ${
                  activeTab === item.id
                    ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20'
                    : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                }`}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-bold text-sm uppercase tracking-wide"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT AREA ===== */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto min-h-screen">
        {/* Top Header Bar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">
              {activeLabel}
            </h2>
            <p className="text-gray-500 text-sm mt-1">Manage your gym data securely</p>
          </div>
          
          {/* Admin Profile Badge */}
          <div className="flex items-center gap-3 bg-gray-900 px-4 py-2 rounded-full border border-gray-800">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-black font-black text-sm">
              A
            </div>
            <span className="text-sm font-bold text-gray-300 hidden md:inline">Administrator</span>
          </div>
        </div>

        {/* Dynamic Content Container */}
        <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6 md:p-8 min-h-[80vh] backdrop-blur-sm">
          {activeComponent}
        </div>
      </main>
    </div>
  );
}