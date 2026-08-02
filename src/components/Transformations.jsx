import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../services/supabase';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Transformations() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('transformations')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setItems(data || []);
      } catch (error) {
        console.error('Transformations table is not ready:', error.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const move = (direction) => {
    sliderRef.current?.scrollBy({ left: direction * 760, behavior: 'smooth' });
  };

  useEffect(() => {
    if (items.length <= 1) return undefined;

    const interval = window.setInterval(() => {
      const slider = sliderRef.current;
      if (!slider) return;

      const firstCard = slider.querySelector('article');
      const cardWidth = firstCard?.getBoundingClientRect().width || 760;
      const styles = window.getComputedStyle(slider);
      const gap = parseFloat(styles.columnGap) || parseFloat(styles.gap) || 20;
      const atEnd = slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 8;

      slider.scrollTo({
        left: atEnd ? 0 : slider.scrollLeft + cardWidth + gap,
        behavior: 'smooth',
      });
    }, 2000);

    return () => window.clearInterval(interval);
  }, [items.length]);

  if (loading) return null;
  if (!items.length) return null;

  return (
    <section id="transformations" className="bg-[#050505] py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-14">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.35em] text-[#E85D2A]">
            Proof of the process
          </p>
          <h2 className="text-5xl font-black uppercase leading-[0.88] text-white md:text-7xl">
            Client<br />Transformations
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#A3A3A3]">
            Real ALBO clients. Real starting points. Real progress built through training, nutrition and consistency.
          </p>
        </div>

        <div
          ref={sliderRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-5"
          style={{ scrollbarWidth: 'none' }}
        >
          {items.map((item) => (
            <article
              key={item.id}
              className="w-[92vw] max-w-[760px] flex-none snap-center border border-[#292929] bg-[#0B0B0B]"
            >
              <div className="grid grid-cols-2">
                <Figure image={item.before_image_url} label="Before" name={item.client_name} />
                <Figure image={item.after_image_url} label="After" name={item.client_name} />
              </div>
              <div className="flex items-end justify-between gap-5 border-t border-[#292929] px-5 py-5 md:px-7">
                <div>
                  <p className="text-lg font-black uppercase text-white">
                    {item.client_name || 'ALBO Client'}
                  </p>
                  {item.result_text && (
                    <p className="mt-1 text-sm text-[#A3A3A3]">{item.result_text}</p>
                  )}
                </div>
                {item.duration && (
                  <span className="shrink-0 border border-[#E85D2A]/50 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#E85D2A]">
                    {item.duration}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-7 flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#666]">
            ← Swipe to see more →
          </p>
          <div className="flex gap-2">
            <button onClick={() => move(-1)} aria-label="Previous transformation" className="grid h-12 w-12 place-items-center border border-[#292929] text-white hover:border-[#E85D2A] hover:text-[#E85D2A]">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => move(1)} aria-label="Next transformation" className="grid h-12 w-12 place-items-center border border-[#292929] text-white hover:border-[#E85D2A] hover:text-[#E85D2A]">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Figure({ image, label, name }) {
  return (
    <figure className="relative aspect-[3/4] overflow-hidden bg-[#111]">
      <img
        src={image}
        alt={`${name || 'ALBO client'} ${label.toLowerCase()} transformation`}
        className="h-full w-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4 pt-16">
        <span className={`inline-block px-3 py-2 text-[10px] font-black uppercase tracking-[0.22em] ${label === 'After' ? 'bg-[#E85D2A] text-white' : 'bg-black/80 text-white'}`}>
          {label}
        </span>
      </div>
    </figure>
  );
}
