import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, Loader2, ShieldCheck, Star } from 'lucide-react';
import { supabase } from '../services/supabase';

export default function ReviewForm() {
  const { token } = useParams();
  const [status, setStatus] = useState('checking');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const validate = async () => {
      const { data, error } = await supabase.rpc('validate_review_invite', {
        invite_token: token,
      });
      if (error || !data?.valid) {
        setStatus(data?.reason === 'used' ? 'used' : 'invalid');
        return;
      }
      setStatus('ready');
    };
    validate();
  }, [token]);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSending(true);
    setError('');

    const { data, error } = await supabase.rpc('submit_invited_review', {
      invite_token: token,
      review_name: name.trim(),
      review_message: message.trim(),
      review_rating: rating,
    });

    setSending(false);
    if (error || !data?.success) {
      setError(data?.message || error?.message || 'Could not submit your review.');
      return;
    }
    setStatus('success');
  };

  if (status === 'checking') {
    return <Screen><Loader2 className="animate-spin text-[#E85D2A]" size={38} /><p className="mt-5 text-gray-400">Checking your review link...</p></Screen>;
  }

  if (status === 'invalid' || status === 'used') {
    return (
      <Screen>
        <ShieldCheck size={44} className="text-[#E85D2A]" />
        <h1 className="mt-6 text-3xl font-black uppercase text-white">
          {status === 'used' ? 'Review already submitted' : 'Link unavailable'}
        </h1>
        <p className="mt-4 max-w-md text-center leading-7 text-gray-400">
          {status === 'used'
            ? 'This private review link has already been used.'
            : 'This private review link is invalid or has expired. Please ask ALBO Fitness for a new link.'}
        </p>
      </Screen>
    );
  }

  if (status === 'success') {
    return (
      <Screen>
        <CheckCircle2 size={54} className="text-[#E85D2A]" />
        <h1 className="mt-6 text-4xl font-black uppercase text-white">Thank you.</h1>
        <p className="mt-4 max-w-md text-center leading-7 text-gray-400">
          Your feedback was sent to ALBO Fitness for review.
        </p>
      </Screen>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-12 text-white">
      <div className="mx-auto max-w-xl">
        <div className="mb-10 border-l-4 border-[#E85D2A] pl-5">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#E85D2A]">ALBO Fitness</p>
          <h1 className="mt-3 text-4xl font-black uppercase leading-none md:text-6xl">Share your<br />experience.</h1>
        </div>

        <div className="mb-6 flex items-center gap-2 text-xs text-gray-500">
          <ShieldCheck size={16} className="text-[#E85D2A]" />
          Private one-time feedback link. No admin access.
        </div>

        <form onSubmit={submit} className="border border-[#292929] bg-[#0B0B0B] p-6 md:p-8">
          <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-gray-400">Your name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            required
            className="mb-6 w-full border border-[#333] bg-[#111] p-4 text-white outline-none focus:border-[#E85D2A]"
            placeholder="Enter your name"
          />

          <label className="mb-3 block text-xs font-black uppercase tracking-[0.18em] text-gray-400">Your rating</label>
          <div className="mb-6 flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button key={value} type="button" onClick={() => setRating(value)} aria-label={`${value} stars`}>
                <Star size={30} className={value <= rating ? 'fill-[#E85D2A] text-[#E85D2A]' : 'text-[#444]'} />
              </button>
            ))}
          </div>

          <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-gray-400">Your review</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            minLength={10}
            maxLength={1000}
            required
            className="min-h-44 w-full resize-none border border-[#333] bg-[#111] p-4 text-white outline-none focus:border-[#E85D2A]"
            placeholder="Tell us about your training experience..."
          />
          <div className="mt-2 text-right text-xs text-gray-600">{message.length}/1000</div>

          {error && <p className="mt-4 border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}

          <button disabled={sending} className="mt-6 flex w-full items-center justify-center gap-2 bg-[#E85D2A] py-4 text-sm font-black uppercase tracking-[0.18em] text-white hover:bg-[#C9471B] disabled:opacity-50">
            {sending && <Loader2 size={18} className="animate-spin" />}
            {sending ? 'Sending...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </main>
  );
}

function Screen({ children }) {
  return <main className="grid min-h-screen place-items-center bg-[#050505] px-5 text-white"><div className="flex flex-col items-center">{children}</div></main>;
}
