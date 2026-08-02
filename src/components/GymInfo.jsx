import React, { useEffect, useState } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  ArrowRight,
  ExternalLink,
  Navigation,
} from 'lucide-react';
import { supabase } from '../services/supabase';

export default function GymInfo() {
  const [gymInfo, setGymInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGymInfo();
  }, []);

  const fetchGymInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('gym_info')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setGymInfo(data || {});
    } catch (error) {
      console.error('Error fetching gym info:', error);
    } finally {
      setLoading(false);
    }
  };

  const openInMaps = (location) => {
    const url =
      location.maps_link ||
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        location.address || location.name || 'ALBO Fitness'
      )}`;

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');

    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return (
      <section className="bg-[#050505] py-24">
        <div className="text-center">
          <span className="text-sm font-bold uppercase tracking-[0.25em] text-[#E85D2A]">
            Loading locations...
          </span>
        </div>
      </section>
    );
  }

  const locations = gymInfo?.locations || [];

  // ==========================================
  // MAIN HQ + LOCATION ORDER
  // ==========================================

  const mainHQ =
    locations.find((location) => location.is_main) ||
    locations[0] ||
    null;

  const otherLocations = locations.filter(
    (location) => location.id !== mainHQ?.id
  );

  const orderedLocations = [];

  if (mainHQ) {
    const middleIndex = Math.floor(
      otherLocations.length / 2
    );

    orderedLocations.push(
      ...otherLocations.slice(0, middleIndex)
    );

    orderedLocations.push(mainHQ);

    orderedLocations.push(
      ...otherLocations.slice(middleIndex)
    );
  }

  return (
    <section
      id="locations"
      className="relative overflow-hidden bg-[#050505] py-20 md:py-28"
    >
      {/* ==========================================
          BACKGROUND
      ========================================== */}

      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.16]"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/xxa8wqzk/image/upload/f_auto,q_auto/vecteezy_ai-generated-exercise-machines-in-a-gym_37229509_tap6j1')",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-black/90 to-[#050505]" />

      {/* ORANGE ATMOSPHERE */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-[#E85D2A]/5 blur-[160px]" />

        <div className="absolute -right-40 bottom-20 h-[500px] w-[500px] rounded-full bg-[#E85D2A]/5 blur-[160px]" />
      </div>

      {/* ==========================================
          MAIN CONTENT
      ========================================== */}

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        {/* ==========================================
            SECTION HEADER
        ========================================== */}

        <div className="mb-12 md:mb-16">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-[2px] w-10 bg-[#E85D2A]" />

            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#E85D2A] md:text-xs">
              Find Your ALBO
            </p>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="text-5xl font-black uppercase leading-[0.88] tracking-[-0.04em] text-white sm:text-6xl md:text-7xl lg:text-8xl">
              OUR
              <br />

              <span className="text-[#E85D2A]">
                {locations.length > 1
                  ? 'LOCATIONS'
                  : 'LOCATION'}
              </span>
            </h2>

            <p className="max-w-md text-sm leading-7 text-[#9A9A9A] md:text-base">
              Pick your nearest ALBO Fitness floor.
              Open the route and come experience the
              training environment in person.
            </p>
          </div>
        </div>

        {/* ==========================================
            LOCATION GRID
        ========================================== */}

        {orderedLocations.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {orderedLocations.map(
              (location, index) => (
                <LocationCard
                  key={location.id || index}
                  location={location}
                  index={index}
                  onOpenMaps={() =>
                    openInMaps(location)
                  }
                />
              )
            )}
          </div>
        ) : (
          <div className="border border-[#252525] bg-[#0B0B0B] px-6 py-16 text-center">
            <MapPin
              size={34}
              className="mx-auto mb-4 text-[#E85D2A]"
            />

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#777]">
              Gym location information is not
              available
            </p>
          </div>
        )}

        {/* ==========================================
            BOTTOM CTA
        ========================================== */}

        <div className="mt-14 border-t border-[#252525] pt-10 md:mt-20 md:pt-12">
          <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E85D2A]">
                Ready to begin?
              </p>

              <h3 className="mt-3 text-3xl font-black uppercase leading-none text-white md:text-5xl">
                TRAIN WITH ALBO.
              </h3>
            </div>

            <button
              type="button"
              onClick={scrollToContact}
              className="group flex w-full items-center justify-between bg-[#E85D2A] px-6 py-5 text-left text-sm font-black uppercase tracking-[0.15em] text-white transition-colors duration-300 hover:bg-[#F06A37] md:w-auto md:min-w-[310px]"
            >
              <span>Start Your Transformation</span>

              <ArrowRight
                size={20}
                className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// LOCATION CARD
// ==========================================

function LocationCard({
  location,
  index,
  onOpenMaps,
}) {
  const handlePhoneClick = (event) => {
    event.stopPropagation();
  };

  const handleRouteClick = (event) => {
    event.stopPropagation();
    onOpenMaps();
  };

  return (
    <article
      className={`
        location-card
        group
        relative
        flex
        min-h-[470px]
        flex-col
        overflow-hidden
        border
        bg-[#0B0B0B]
        transition-all
        duration-300

        ${
          location.is_main
            ? 'border-[#E85D2A]'
            : 'border-[#292929] hover:border-[#E85D2A]/70'
        }
      `}
    >
      {/* ==========================================
          TOP ORANGE LINE
      ========================================== */}

      <div
        className={`
          absolute
          left-0
          top-0
          h-[3px]
          bg-[#E85D2A]
          transition-all
          duration-500

          ${
            location.is_main
              ? 'w-full'
              : 'w-14 group-hover:w-full'
          }
        `}
      />

      {/* ==========================================
          CARD MAIN CONTENT
      ========================================== */}

      <div className="flex flex-1 flex-col p-6 sm:p-7 md:p-8">
        {/* NUMBER + ICON */}

        <div className="mb-12 flex items-start justify-between">
          <span className="text-5xl font-black leading-none text-[#242424] transition-colors duration-300 group-hover:text-[#E85D2A]/20 md:text-6xl">
            {String(index + 1).padStart(2, '0')}
          </span>

          <button
            type="button"
            onClick={handleRouteClick}
            aria-label={`Open ${location.name} in Google Maps`}
            className="grid h-12 w-12 shrink-0 place-items-center border border-[#333] text-white transition-all duration-300 hover:border-[#E85D2A] hover:bg-[#E85D2A] md:h-14 md:w-14"
          >
            <ExternalLink size={21} />
          </button>
        </div>

        {/* ==========================================
            MAIN HQ BADGE
        ========================================== */}

        {location.is_main && (
          <div className="mb-5">
            <span className="inline-block bg-[#E85D2A] px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-white">
              Main HQ
            </span>
          </div>
        )}

        {/* ==========================================
            LOCATION NAME
        ========================================== */}

        <h3 className="mb-8 break-words text-4xl font-black uppercase leading-[0.9] tracking-[-0.03em] text-white md:text-5xl">
          {location.name}
        </h3>

        {/* ==========================================
            LOCATION DETAILS

            IMPORTANT:
            No absolute positioning.
            Phone and route cannot overlap.
        ========================================== */}

        <div className="mt-auto space-y-0">
          {location.address && (
            <div className="flex min-w-0 items-start gap-4 border-b border-[#242424] py-4 first:pt-0">
              <MapPin
                size={20}
                className="mt-[2px] shrink-0 text-[#E85D2A]"
              />

              <span className="min-w-0 break-words text-sm font-medium leading-6 text-[#C4C4C4] md:text-base">
                {location.address}
              </span>
            </div>
          )}

          {location.hours && (
            <div className="flex min-w-0 items-start gap-4 border-b border-[#242424] py-4">
              <Clock
                size={20}
                className="mt-[2px] shrink-0 text-[#E85D2A]"
              />

              <span className="min-w-0 break-words text-sm font-medium leading-6 text-[#C4C4C4] md:text-base">
                {location.hours}
              </span>
            </div>
          )}

          {location.phone && (
            <a
              href={`tel:${location.phone}`}
              onClick={handlePhoneClick}
              className="flex min-w-0 items-start gap-4 py-4 text-[#C4C4C4] transition-colors duration-300 hover:text-white"
            >
              <Phone
                size={20}
                className="mt-[2px] shrink-0 text-[#E85D2A]"
              />

              <span className="min-w-0 break-all text-sm font-medium leading-6 md:text-base">
                {location.phone}
              </span>
            </a>
          )}
        </div>
      </div>

      {/* ==========================================
          OPEN ROUTE

          Separate normal-flow footer.
          It will always appear BELOW phone number.
      ========================================== */}

      <button
        type="button"
        onClick={handleRouteClick}
        className="group/route flex min-h-[72px] w-full shrink-0 items-center justify-between border-t border-[#292929] bg-[#080808] px-6 py-5 text-left transition-colors duration-300 hover:bg-[#E85D2A] sm:px-7 md:px-8"
      >
        <span className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-white">
          <Navigation
            size={18}
            className="shrink-0 text-[#E85D2A] transition-colors duration-300 group-hover/route:text-white"
          />

          Open Route
        </span>

        <ArrowRight
          size={20}
          className="shrink-0 text-[#E85D2A] transition-all duration-300 group-hover/route:translate-x-1 group-hover/route:text-white"
        />
      </button>

      {/* ==========================================
          MOBILE / DESKTOP CSS
      ========================================== */}

      <style>{`
        .location-card {
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.28);
        }

        @media (hover: hover) and (pointer: fine) {
          .location-card:hover {
            transform: translateY(-6px);
            box-shadow:
              0 25px 70px rgba(0, 0, 0, 0.5),
              0 0 0 1px rgba(232, 93, 42, 0.05);
          }
        }

        @media (max-width: 640px) {
          .location-card {
            min-height: 0;
          }
        }
      `}</style>
    </article>
  );
}