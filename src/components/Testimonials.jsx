import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../services/supabase';
import { ArrowRight, ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('id', { ascending: false });
        if (error) throw error;
        setTestimonials(data || []);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const move = (direction) => {
    sliderRef.current?.scrollBy({
      left: direction * 430,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    if (testimonials.length <= 1) return undefined;

    const interval = window.setInterval(() => {
      const slider = sliderRef.current;
      if (!slider) return;

      const firstCard = slider.querySelector('article');
      const cardWidth = firstCard?.getBoundingClientRect().width || 430;
      const styles = window.getComputedStyle(slider);
      const gap = parseFloat(styles.columnGap) || parseFloat(styles.gap) || 16;
      const atEnd = slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 8;

      slider.scrollTo({
        left: atEnd ? 0 : slider.scrollLeft + cardWidth + gap,
        behavior: 'smooth',
      });
    }, 2000);

    return () => window.clearInterval(interval);
  }, [testimonials.length]);

  const startTransformation = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return <div className="bg-black py-20 text-center text-gray-500">Loading reviews...</div>;
  }

  return (
    <section id="reviews" className="relative overflow-hidden bg-[#050505] py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-14 md:flex md:items-end md:justify-between">
          <div>
            <p className="mb-4 text-xs font-black uppercase tracking-[0.35em] text-[#E85D2A]">
              Member Reviews
            </p>
            <h2 className="max-w-3xl text-5xl font-black uppercase leading-[0.9] text-white md:text-7xl">
              Built on work.<br />Backed by people.
            </h2>
          </div>
          <p className="mt-6 max-w-md text-base leading-7 text-[#A3A3A3] md:mt-0">
            Straight from ALBO members. No transformation photos in reviews — just their experience, in their own words.
          </p>
        </div>

        {testimonials.length === 0 ? (
          <div className="border border-[#292929] bg-[#0B0B0B] px-6 py-16 text-center text-gray-500">
            Member reviews will appear here.
          </div>
        ) : (
          <div className="relative">
            <div
              ref={sliderRef}
              className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4"
              style={{ scrollbarWidth: 'none' }}
            >
              {testimonials.map((testimonial, index) => (
                <article
                  key={testimonial.id}
                  className="group relative min-h-[330px] w-[88vw] max-w-[430px] flex-none snap-center border border-[#292929] bg-[#0B0B0B] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#E85D2A] md:p-9"
                >
                  <div className="mb-12 flex items-start justify-between">
                    <Quote size={34} className="text-[#E85D2A]" strokeWidth={1.6} />
                    <span className="font-mono text-xs text-[#5E5E5E]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <p className="mb-10 text-lg font-semibold leading-8 text-[#F7F7F5]">
                    “{testimonial.message}”
                  </p>

                  <div className="absolute bottom-7 left-7 right-7 border-t border-[#292929] pt-5 md:bottom-9 md:left-9 md:right-9">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-lg font-black uppercase text-white">
                          {testimonial.client_name}
                        </p>
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#E85D2A]">
                          ALBO Fitness Member
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(testimonial.rating || 5)].map((_, i) => (
                          <Star key={i} size={13} className="fill-[#E85D2A] text-[#E85D2A]" />
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-7 flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#666]">
                Swipe to read more
              </p>
              <div className="flex gap-2">
                <button onClick={() => move(-1)} aria-label="Previous review" className="grid h-12 w-12 place-items-center border border-[#292929] text-white hover:border-[#E85D2A] hover:text-[#E85D2A]">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={() => move(1)} aria-label="Next review" className="grid h-12 w-12 place-items-center border border-[#292929] text-white hover:border-[#E85D2A] hover:text-[#E85D2A]">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-16 border-t border-[#292929] pt-10 text-center">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-[#A3A3A3]">
            Your result can be the next chapter.
          </p>
          <button
            onClick={startTransformation}
            className="group inline-flex items-center gap-3 bg-[#E85D2A] px-8 py-4 text-sm font-black uppercase tracking-[0.16em] text-white hover:bg-[#C9471B]"
          >
            Start Your Transformation
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
