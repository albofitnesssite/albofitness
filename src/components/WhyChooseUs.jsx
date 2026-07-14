import React, { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Dumbbell,
  Gauge,
  Salad,
  StretchHorizontal,
  UsersRound,
  X,
} from 'lucide-react';

const features = [
  {
    number: '01',
    icon: Dumbbell,
    title: 'Strength',
    description: 'Progressive programming built around clean reps, load and measurable progression.',
    details: 'Train for usable strength and muscle with coaching that prioritises technique, progression and consistency.',
    perks: ['Progressive overload', 'Free-weight training', 'Form correction', 'Progress tracking'],
  },
  {
    number: '02',
    icon: Gauge,
    title: 'Cardio / HIIT',
    description: 'Hard intervals and conditioning blocks designed to improve work capacity.',
    details: 'Structured conditioning sessions combine intervals, machines and athletic circuits without random workouts.',
    perks: ['Interval sessions', 'Conditioning circuits', 'Cardio equipment', 'Scalable intensity'],
  },
  {
    number: '03',
    icon: StretchHorizontal,
    title: 'Mobility',
    description: 'Move better. Recover properly. Build the range your training actually needs.',
    details: 'Mobility work is used to support lifting quality, recovery and better movement rather than as an afterthought.',
    perks: ['Movement prep', 'Mobility drills', 'Recovery work', 'Range assessment'],
  },
  {
    number: '04',
    icon: BarChart3,
    title: 'Personal Coaching',
    description: 'One coach. One plan. A clear training direction built around your goal.',
    details: 'Personal coaching connects assessment, programming and progression with direct trainer accountability.',
    perks: ['Goal assessment', 'Personal plan', 'Coach feedback', 'Progress reviews'],
  },
  {
    number: '05',
    icon: UsersRound,
    title: 'Group Training',
    description: 'A stronger training floor built on pace, coaching and shared accountability.',
    details: 'Coach-led group sessions keep the energy high while preserving clear exercise standards and progression.',
    perks: ['Coach-led floor', 'Team energy', 'Scalable sessions', 'Shared accountability'],
  },
  {
    number: '06',
    icon: Salad,
    title: 'Nutrition',
    description: 'Practical food guidance that supports training without turning life into a spreadsheet.',
    details: 'Nutrition guidance focuses on sustainable calories, protein, food quality and habits that fit the client.',
    perks: ['Calorie guidance', 'Protein targets', 'Food structure', 'Habit support'],
  },
];

export default function WhyChooseUs() {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const start = () => {
    setSelectedFeature(null);
    setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 150);
  };

  return (
    <section id="why-us" className="relative overflow-hidden bg-[#050505] py-24 md:py-32">
      <div className="absolute inset-x-0 top-0 h-px bg-[#292929]" />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <header className="mb-14 grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
          <div>
            <p className="section-kicker">WHY ALBO / 06 STANDARDS</p>
            <h2 className="section-display mt-5">
              NO GIMMICKS.<br />
              <span className="text-[#E85D2A]">JUST THE WORK.</span>
            </h2>
          </div>
          <p className="max-w-md border-l border-[#E85D2A] pl-5 text-sm leading-7 text-[#929292] md:text-base">
            Six parts of the ALBO training floor. Clear coaching, hard sessions and a system clients can understand.
          </p>
        </header>

        <div className="grid border-l border-t border-[#292929] md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.number} feature={feature} onClick={() => setSelectedFeature(feature)} />
          ))}
        </div>
      </div>

      {selectedFeature && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-4" onClick={() => setSelectedFeature(null)}>
          <article className="relative w-full max-w-2xl border border-[#3A3A3A] bg-[#0B0B0B] p-6 md:p-10" onClick={(event) => event.stopPropagation()}>
            <button onClick={() => setSelectedFeature(null)} aria-label="Close details" className="absolute right-5 top-5 grid h-11 w-11 place-items-center border border-[#333] text-white hover:border-[#E85D2A] hover:text-[#E85D2A]">
              <X size={20} />
            </button>

            <p className="section-kicker">{selectedFeature.number} / 06</p>
            <h3 className="section-display mt-5 pr-14 text-5xl md:text-7xl">{selectedFeature.title}</h3>
            <p className="mt-7 max-w-xl text-base leading-7 text-[#A3A3A3]">{selectedFeature.details}</p>

            <div className="mt-8 grid border-l border-t border-[#292929] sm:grid-cols-2">
              {selectedFeature.perks.map((perk, index) => (
                <div key={perk} className="flex items-center gap-3 border-b border-r border-[#292929] p-4">
                  <span className="font-display text-sm text-[#E85D2A]">{String(index + 1).padStart(2, '0')}</span>
                  <span className="text-sm font-bold uppercase tracking-[0.04em] text-[#D8D8D8]">{perk}</span>
                </div>
              ))}
            </div>

            <button onClick={start} className="group mt-8 flex w-full items-center justify-between bg-[#E85D2A] px-6 py-5 text-xs font-black uppercase tracking-[0.18em] text-white sm:w-auto sm:min-w-[280px]">
              Start your transformation
              <ArrowRight size={19} className="transition-transform group-hover:translate-x-1" />
            </button>
          </article>
        </div>
      )}
    </section>
  );
}

function FeatureCard({ feature, onClick }) {
  const Icon = feature.icon;

  return (
    <button onClick={onClick} className="why-card group relative min-h-[330px] border-b border-r border-[#292929] bg-[#080808] p-6 text-left md:min-h-[390px] md:p-8">
      <div className="flex items-start justify-between">
        <span className="font-display text-5xl leading-none text-[#282828] transition-colors group-hover:text-[#E85D2A] md:text-6xl">
          {feature.number}
        </span>
        <div className="grid h-12 w-12 place-items-center border border-[#343434] text-[#E85D2A] transition-all group-hover:border-[#E85D2A] group-hover:bg-[#E85D2A] group-hover:text-white">
          <Icon size={22} strokeWidth={1.8} />
        </div>
      </div>

      <div className="absolute bottom-7 left-6 right-6 md:bottom-8 md:left-8 md:right-8">
        <h3 className="font-display text-3xl uppercase leading-none text-white md:text-4xl">{feature.title}</h3>
        <p className="mt-5 text-sm leading-6 text-[#8E8E8E] transition-colors group-hover:text-[#B8B8B8]">{feature.description}</p>
        <div className="mt-6 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#E85D2A]">
          View standard <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </button>
  );
}
