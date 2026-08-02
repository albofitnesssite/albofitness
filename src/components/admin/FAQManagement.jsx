import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Trash2, Edit2, X, Check } from 'lucide-react';

export default function FAQManagement() {
  const [faqs, setFaqs] = useState([]);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      setError('');
      const { data, fetchError } = await supabase.from('faqs').select('*');
      if (fetchError) {
        setError('Error fetching FAQs: ' + fetchError.message);
        console.error(fetchError);
      } else {
        setFaqs(data || []);
      }
    } catch (err) {
      setError('Unexpected error: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addFaq = async () => {
    // Validation
    if (!newFaq.question || newFaq.question.trim() === '') {
      alert('❌ Question is required');
      return;
    }
    if (!newFaq.answer || newFaq.answer.trim() === '') {
      alert('❌ Answer is required');
      return;
    }

    try {
      setLoading(true);
      const faqData = {
        question: newFaq.question.trim(),
        answer: newFaq.answer.trim()
      };

      const { error: insertError } = await supabase.from('faqs').insert([faqData]);

      if (insertError) {
        alert('❌ Error adding FAQ: ' + insertError.message);
        console.error(insertError);
      } else {
        alert('✅ FAQ added successfully!');
        setNewFaq({ question: '', answer: '' });
        await fetchFaqs();
      }
    } catch (err) {
      alert('❌ Unexpected error: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (faq) => {
    setEditingId(faq.id);
    setEditingData({ ...faq });
  };

  const saveEdit = async () => {
    if (!editingData || !editingData.question || editingData.question.trim() === '') {
      alert('❌ Question is required');
      return;
    }
    if (!editingData.answer || editingData.answer.trim() === '') {
      alert('❌ Answer is required');
      return;
    }

    try {
      setLoading(true);

      // Prepare data - EXCLUDE id, created_at, updated_at
      const updateData = {
        question: editingData.question.trim(),
        answer: editingData.answer.trim()
      };

      const { error: updateError } = await supabase
        .from('faqs')
        .update(updateData)
        .eq('id', editingId);

      if (updateError) {
        alert('❌ Error updating FAQ: ' + updateError.message);
        console.error(updateError);
      } else {
        alert('✅ FAQ updated successfully!');
        setEditingId(null);
        setEditingData(null);
        await fetchFaqs();
      }
    } catch (err) {
      alert('❌ Unexpected error: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingData(null);
  };

  const deleteFaq = async (id) => {
    if (!window.confirm('🗑️ Are you sure you want to delete this FAQ?')) {
      return;
    }

    try {
      setLoading(true);
      const { error: deleteError } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);

      if (deleteError) {
        alert('❌ Error deleting FAQ: ' + deleteError.message);
        console.error(deleteError);
      } else {
        alert('✅ FAQ deleted successfully!');
        await fetchFaqs();
      }
    } catch (err) {
      alert('❌ Unexpected error: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 bg-black p-6 rounded-lg">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-600/20 border-2 border-red-600 rounded-lg text-red-300">
          {error}
        </div>
      )}

      {/* Add FAQ Form */}
      <div className="bg-gray-900 p-6 rounded-lg border-2 border-gray-800">
        <h2 className="text-2xl font-black mb-6 text-orange-500 uppercase">Add New FAQ</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Question *"
            value={newFaq.question}
            onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
            className="w-full p-3 bg-gray-800 text-white border-2 border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 placeholder-gray-500 font-semibold"
            disabled={loading}
          />
          <textarea
            placeholder="Answer *"
            value={newFaq.answer}
            onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
            className="w-full p-3 bg-gray-800 text-white border-2 border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 placeholder-gray-500 font-semibold min-h-32"
            disabled={loading}
          />
        </div>
        <button
          onClick={addFaq}
          disabled={loading}
          className="mt-4 w-full bg-orange-500 text-black py-3 rounded-lg hover:bg-orange-300 transition-all font-black uppercase disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '⏳ Adding...' : '✅ Add FAQ'}
        </button>
      </div>

      {/* FAQs List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-orange-500 uppercase">FAQs List ({faqs.length})</h2>
        {faqs.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No FAQs added yet.</p>
        ) : (
          faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-gray-900 p-6 rounded-lg border-2 border-gray-800 hover:border-orange-500 transition"
            >
              {editingId === faq.id && editingData ? (
                // EDIT MODE
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editingData.question || ''}
                    onChange={(e) => setEditingData({ ...editingData, question: e.target.value })}
                    className="w-full p-3 bg-gray-800 text-white border-2 border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 font-semibold"
                    placeholder="Question"
                    disabled={loading}
                  />
                  <textarea
                    value={editingData.answer || ''}
                    onChange={(e) => setEditingData({ ...editingData, answer: e.target.value })}
                    className="w-full p-3 bg-gray-800 text-white border-2 border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 font-semibold min-h-24"
                    placeholder="Answer"
                    disabled={loading}
                  />

                  {/* Edit Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      disabled={loading}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-black uppercase flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Check size={18} /> {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={cancelEdit}
                      disabled={loading}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-black uppercase flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <X size={18} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // VIEW MODE
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{faq.question}</h3>
                    <p className="text-gray-300 text-sm">{faq.answer.substring(0, 150)}...</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => startEdit(faq)}
                      disabled={loading}
                      className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Edit FAQ"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => deleteFaq(faq.id)}
                      disabled={loading}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete FAQ"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}