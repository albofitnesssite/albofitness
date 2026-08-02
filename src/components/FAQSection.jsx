import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { ChevronDown } from 'lucide-react';

export default function FAQSection() {
  const [faqs, setFaqs] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const { data, error } = await supabase.from('faqs').select('*');
      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Loading FAQs...</div>;
  }

  return (
    <section className="py-24 bg-black">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-bold tracking-widest uppercase text-orange-500 mb-4">FAQ</p>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="text-xl text-gray-400">
            Find answers to common questions about ALBO Fitness
          </p>
        </div>

        {/* FAQs List */}
        <div className="space-y-4">
          {faqs.length === 0 ? (
            <p className="text-center text-gray-400 py-12">No FAQs added yet.</p>
          ) : (
            faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-gray-900 border-2 border-gray-800 rounded-lg overflow-hidden hover:border-orange-500 transition"
              >
                <button
                  onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                  className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-800 transition"
                >
                  <h3 className="text-xl font-bold text-white">{faq.question}</h3>
                  <ChevronDown
                    size={24}
                    className={`text-orange-500 transition-transform ${
                      expandedId === faq.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {expandedId === faq.id && (
                  <div className="px-6 pb-6 border-t border-gray-800">
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}