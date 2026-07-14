import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Public Components
import Header from './components/Header';
import Hero from './components/Hero';
import WhyChooseUs from './components/WhyChooseUs';
import TrainerSlider from './components/TrainerSlider';
import Testimonials from './components/Testimonials';
import Transformations from './components/Transformations';
import FAQSection from './components/FAQSection';
import EnquiryForm from './components/EnquiryForm';
import GymInfo from './components/GymInfo';
import Footer from './components/Footer';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ReviewForm from './pages/ReviewForm';
import { supabase } from './services/supabase';

import './App.css';
import './index.css';

// Admin routes require a real Supabase Auth session.
function ProtectedRoute({ children }) {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return <div className="grid min-h-screen place-items-center bg-black text-[#E85D2A]">Checking admin session...</div>;
  }

  return session ? children : <Navigate to="/admin" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Public Website */}
        <Route 
          path="/" 
          element={
            <div className="bg-black text-white">
              <Header />
              <Hero />
              <WhyChooseUs />
              <section id="trainers"><TrainerSlider /></section>
              <Testimonials />
              <Transformations />
              <section id="faqs"><FAQSection /></section>
              <section id="contact"><EnquiryForm /></section>
              <GymInfo />
              <Footer />
            </div>
          } 
        />

        {/* Private one-time client feedback page */}
        <Route path="/review/:token" element={<ReviewForm />} />

        {/* 2. Admin Login Page (Publicly accessible) */}
        <Route path="/admin" element={<AdminLogin />} />
        
        {/* 3. Admin Dashboard (Protected - Requires Login) */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;