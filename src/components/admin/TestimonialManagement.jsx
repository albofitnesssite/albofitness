import React, { useEffect, useState } from 'react';
import { Check, Clipboard, Link2, Trash2, X } from 'lucide-react';
import { supabase } from '../../services/supabase';

export default function TestimonialManagement() {
  const [reviews, setReviews] = useState([]);
  const [pending, setPending] = useState([]);
  const [invites, setInvites] = useState([]);
  const [days, setDays] = useState(7);
  const [newLink, setNewLink] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const [reviewRes, pendingRes, inviteRes] = await Promise.all([
      supabase.from('testimonials').select('*').order('id', { ascending: false }),
      supabase.from('review_submissions').select('*').eq('status', 'pending').order('created_at', { ascending: false }),
      supabase.from('review_invites').select('id, expires_at, used_at, created_at').order('created_at', { ascending: false }).limit(20),
    ]);
    if (reviewRes.error) console.error(reviewRes.error);
    if (pendingRes.error) console.error(pendingRes.error);
    if (inviteRes.error) console.error(inviteRes.error);
    setReviews(reviewRes.data || []);
    setPending(pendingRes.data || []);
    setInvites(inviteRes.data || []);
  };

  useEffect(() => { load(); }, []);

  const createLink = async () => {
    setLoading(true);
    setNewLink('');
    const { data, error } = await supabase.rpc('create_review_invite', { valid_days: Number(days) });
    setLoading(false);
    if (error || !data?.token) return alert(error?.message || 'Could not create review link.');
    setNewLink(`${window.location.origin}/review/${data.token}`);
    load();
  };

  const copyLink = async (link = newLink) => {
    await navigator.clipboard.writeText(link);
    alert('Private client review link copied.');
  };

  const approve = async (submission) => {
    const { error: insertError } = await supabase.from('testimonials').insert([{
      client_name: submission.client_name,
      message: submission.message,
      rating: submission.rating,
    }]);
    if (insertError) return alert(insertError.message);
    const { error } = await supabase.from('review_submissions').update({ status: 'approved' }).eq('id', submission.id);
    if (error) return alert(error.message);
    load();
  };

  const reject = async (id) => {
    const { error } = await supabase.from('review_submissions').update({ status: 'rejected' }).eq('id', id);
    if (error) return alert(error.message);
    load();
  };

  const removeReview = async (id) => {
    if (!window.confirm('Delete this published review?')) return;
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) return alert(error.message);
    load();
  };

  return (
    <div className="space-y-10">
      <section className="border border-gray-800 bg-[#0B0B0B] p-6">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#E85D2A]">Private feedback invite</p>
        <h2 className="mt-2 text-2xl font-black uppercase text-white">Create client review link</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
          Send this one-time link to one client. They only see the feedback form. The link expires and cannot open the admin dashboard.
        </p>
        <div className="mt-5 flex flex-col gap-3 md:flex-row">
          <select value={days} onChange={(e) => setDays(e.target.value)} className="border border-gray-700 bg-[#111] px-4 py-3 text-white">
            <option value="1">Expires in 1 day</option>
            <option value="3">Expires in 3 days</option>
            <option value="7">Expires in 7 days</option>
            <option value="14">Expires in 14 days</option>
          </select>
          <button onClick={createLink} disabled={loading} className="flex items-center justify-center gap-2 bg-[#E85D2A] px-6 py-3 font-black uppercase text-white hover:bg-[#C9471B] disabled:opacity-50">
            <Link2 size={18} /> {loading ? 'Creating...' : 'Generate Private Link'}
          </button>
        </div>
        {newLink && (
          <div className="mt-5 flex gap-2">
            <input readOnly value={newLink} className="min-w-0 flex-1 border border-[#E85D2A]/50 bg-black p-3 text-sm text-gray-300" />
            <button onClick={() => copyLink()} className="grid w-12 place-items-center border border-[#E85D2A] text-[#E85D2A]" aria-label="Copy review link"><Clipboard size={19} /></button>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-5 text-2xl font-black uppercase text-white">Pending client feedback ({pending.length})</h2>
        <div className="space-y-4">
          {pending.length === 0 && <div className="border border-gray-800 p-6 text-gray-500">No feedback waiting for approval.</div>}
          {pending.map(item => (
            <article key={item.id} className="border border-gray-800 bg-[#0B0B0B] p-5">
              <div className="flex flex-col justify-between gap-5 md:flex-row">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-black uppercase text-white">{item.client_name}</p>
                    <span className="text-xs font-bold text-[#E85D2A]">{item.rating}/5 STARS</span>
                  </div>
                  <p className="mt-3 leading-7 text-gray-400">“{item.message}”</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => approve(item)} className="flex items-center gap-2 bg-green-600 px-4 py-2 font-bold text-white"><Check size={17}/> Approve</button>
                  <button onClick={() => reject(item.id)} className="flex items-center gap-2 bg-red-600 px-4 py-2 font-bold text-white"><X size={17}/> Reject</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-5 text-2xl font-black uppercase text-white">Published reviews ({reviews.length})</h2>
        <div className="space-y-4">
          {reviews.map(item => (
            <article key={item.id} className="flex justify-between gap-5 border border-gray-800 bg-[#0B0B0B] p-5">
              <div>
                <p className="font-black uppercase text-white">{item.client_name}</p>
                <p className="mt-2 text-gray-400">{item.message}</p>
                <p className="mt-2 text-xs font-bold text-[#E85D2A]">{item.rating || 5}/5 STARS</p>
              </div>
              <button onClick={() => removeReview(item.id)} className="text-red-500" aria-label="Delete review"><Trash2 size={19}/></button>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-black uppercase text-gray-400">Recent invite status</h2>
        <div className="space-y-2">
          {invites.map(invite => (
            <div key={invite.id} className="flex justify-between border border-gray-800 bg-black px-4 py-3 text-xs">
              <span className="text-gray-500">{new Date(invite.created_at).toLocaleString()}</span>
              <span className={invite.used_at ? 'font-bold text-green-500' : new Date(invite.expires_at) < new Date() ? 'font-bold text-red-500' : 'font-bold text-[#E85D2A]'}>
                {invite.used_at ? 'USED' : new Date(invite.expires_at) < new Date() ? 'EXPIRED' : 'ACTIVE'}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
