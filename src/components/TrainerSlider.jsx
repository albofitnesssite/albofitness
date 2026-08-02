import React, { useEffect, useRef, useState } from "react";
import {
  Award,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  MoveRight,
} from "lucide-react";
import { supabase } from "../services/supabase";

export default function TrainerSlider() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  const sliderRef = useRef(null);

  // ==========================================
  // FETCH TRAINERS
  // ==========================================

  useEffect(() => {
    fetchTrainers();
  }, []);

  async function fetchTrainers() {
    try {
      const { data, error } = await supabase
        .from("trainers")
        .select("*")
        .order("id");

      if (error) {
        throw error;
      }

      setTrainers(data || []);
    } catch (error) {
      console.error("Error fetching trainers:", error);
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // SELECT TRAINER
  // ==========================================

  function handleTrainerClick(trainer) {
    window.selectedTrainer = trainer;

    const contact = document.getElementById("contact");

    if (contact) {
      contact.scrollIntoView({
        behavior: "smooth",
      });
    }
  }

  // ==========================================
  // SLIDER CONTROLS
  // ==========================================

  function moveSlider(direction) {
    if (!sliderRef.current) {
      return;
    }

    const slider = sliderRef.current;

    const firstCard = slider.querySelector(
      "[data-trainer-card]"
    );

    const cardWidth =
      firstCard?.getBoundingClientRect().width || 360;

    const sliderStyles = window.getComputedStyle(slider);

    const gap =
      parseFloat(sliderStyles.columnGap) ||
      parseFloat(sliderStyles.gap) ||
      24;

    slider.scrollBy({
      left: direction * (cardWidth + gap),
      behavior: "smooth",
    });
  }

  // ==========================================
  // AUTO SLIDE — EVERY 2 SECONDS
  // ==========================================

  useEffect(() => {
    if (trainers.length <= 1) return undefined;

    const interval = window.setInterval(() => {
      const slider = sliderRef.current;
      if (!slider) return;

      const firstCard = slider.querySelector("[data-trainer-card]");
      const cardWidth = firstCard?.getBoundingClientRect().width || 360;
      const sliderStyles = window.getComputedStyle(slider);
      const gap =
        parseFloat(sliderStyles.columnGap) ||
        parseFloat(sliderStyles.gap) ||
        24;
      const atEnd =
        slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 8;

      slider.scrollTo({
        left: atEnd ? 0 : slider.scrollLeft + cardWidth + gap,
        behavior: "smooth",
      });
    }, 2000);

    return () => window.clearInterval(interval);
  }, [trainers.length]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <section className="bg-[#050505] py-24">
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E85D2A]">
            Loading coaching floor...
          </p>
        </div>
      </section>
    );
  }

  // ==========================================
  // EMPTY STATE
  // ==========================================

  if (!trainers.length) {
    return (
      <section className="bg-[#050505] py-24">
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#777]">
            No trainers available
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="trainers"
      className="trainer-section relative overflow-hidden bg-[#050505] py-20 md:py-28 lg:py-32"
    >
      {/* ==========================================
          TOP BORDER
      ========================================== */}

      <div className="absolute left-0 right-0 top-0 h-px bg-[#252525]" />

      {/* ==========================================
          BACKGROUND NUMBER
      ========================================== */}

      <div className="trainer-background-text pointer-events-none absolute -right-8 top-20 hidden select-none text-[17rem] uppercase leading-none text-white/[0.018] xl:block">
        TEAM
      </div>

      {/* ==========================================
          MAIN CONTENT
      ========================================== */}

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        {/* ==========================================
            SECTION HEADER
        ========================================== */}

        <header className="mb-12 grid gap-8 border-b border-[#252525] pb-10 lg:mb-16 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
          {/* LEFT */}

          <div>
            <p className="trainer-kicker text-[10px] font-black uppercase tracking-[0.34em] text-[#E85D2A] md:text-xs">
              THE COACHING FLOOR
            </p>

            <h2 className="trainer-heading mt-5 uppercase text-white">
              BUILT BY
              <br />

              <span className="text-[#E85D2A]">
                COACHES.
              </span>
            </h2>
          </div>

          {/* RIGHT */}

          <div className="lg:pb-2">
            <p className="max-w-md text-sm leading-7 text-[#929292] md:text-base">
              Meet the people behind the programming.
              Qualifications are shown clearly because
              coaching should earn your trust.
            </p>

            {/* DESKTOP NAVIGATION */}

            <div className="mt-7 hidden gap-2 md:flex">
              <NavButton
                label="Previous trainer"
                onClick={() => moveSlider(-1)}
              >
                <ChevronLeft size={21} />
              </NavButton>

              <NavButton
                label="Next trainer"
                onClick={() => moveSlider(1)}
              >
                <ChevronRight size={21} />
              </NavButton>
            </div>
          </div>
        </header>

        {/* ==========================================
            TRAINER SLIDER
        ========================================== */}

        <div
          ref={sliderRef}
          className="
            trainer-slider
            no-scrollbar
            flex
            snap-x
            snap-mandatory
            gap-4
            overflow-x-auto
            scroll-smooth
            pb-6
            md:gap-6
          "
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {trainers.map((trainer, index) => (
            <TrainerCard
              key={trainer.id}
              trainer={trainer}
              index={index}
              onChoose={() =>
                handleTrainerClick(trainer)
              }
            />
          ))}
        </div>

        {/* ==========================================
            MOBILE NAVIGATION
        ========================================== */}

        <div className="mt-4 flex items-center justify-between border-t border-[#252525] pt-5 md:hidden">
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#666]">
            Swipe through coaches
          </p>

          <div className="flex gap-2">
            <NavButton
              label="Previous trainer"
              onClick={() => moveSlider(-1)}
            >
              <ChevronLeft size={19} />
            </NavButton>

            <NavButton
              label="Next trainer"
              onClick={() => moveSlider(1)}
            >
              <ChevronRight size={19} />
            </NavButton>
          </div>
        </div>
      </div>

      {/* ==========================================
          COMPONENT CSS
      ========================================== */}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Barlow+Condensed:wght@600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap');

        /* ========================================
           TYPOGRAPHY
        ======================================== */

        .trainer-heading {
          font-family: 'Anton', Impact, sans-serif;

          font-size: clamp(
            4.2rem,
            9vw,
            8.8rem
          );

          font-weight: 400;

          line-height: 0.86;

          letter-spacing: 0.005em;
        }

        .trainer-name,
        .trainer-number,
        .trainer-background-text {
          font-family: 'Anton', Impact, sans-serif;
          font-weight: 400;
        }

        .trainer-kicker,
        .trainer-index,
        .trainer-card button {
          font-family:
            'Barlow Condensed',
            'Arial Narrow',
            sans-serif;
        }

        /* ========================================
           SLIDER
        ======================================== */

        .trainer-slider::-webkit-scrollbar {
          display: none;
        }

        .trainer-slider {
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-x: contain;
          scroll-padding-inline: 0;
        }

        /* ========================================
           TRAINER CARD
        ======================================== */

        .trainer-card {
          clip-path: polygon(
            0 0,
            calc(100% - 24px) 0,
            100% 24px,
            100% 100%,
            24px 100%,
            0 calc(100% - 24px)
          );

          transition:
            transform 300ms ease,
            border-color 300ms ease,
            background-color 300ms ease;
        }

        .trainer-photo::after {
          content: '';

          position: absolute;

          right: 0;
          top: 0;

          border-top: 24px solid #050505;
          border-left: 24px solid transparent;

          z-index: 20;
        }

        /* ========================================
           DESKTOP HOVER
        ======================================== */

        @media (hover: hover) and (pointer: fine) {
          .trainer-card:hover {
            transform: translateY(-7px);
            border-color: rgba(
              232,
              93,
              42,
              0.75
            );
          }
        }

        /* ========================================
           MOBILE
        ======================================== */

        @media (max-width: 640px) {
          .trainer-heading {
            font-size: clamp(
              4rem,
              19vw,
              6rem
            );
          }

          .trainer-card {
            clip-path: polygon(
              0 0,
              calc(100% - 16px) 0,
              100% 16px,
              100% 100%,
              16px 100%,
              0 calc(100% - 16px)
            );
          }

          .trainer-photo::after {
            border-top-width: 16px;
            border-left-width: 16px;
          }
        }
      `}</style>
    </section>
  );
}

// ==========================================
// TRAINER CARD
// ==========================================

function TrainerCard({
  trainer,
  index,
  onChoose,
}) {
  const certifications = String(
    trainer.certifications || ""
  )
    .split(",")
    .map((certification) =>
      certification.trim()
    )
    .filter(Boolean);

  return (
    <article
      data-trainer-card
      className="
        trainer-card
        group
        flex
        w-[84vw]
        max-w-[360px]
        flex-none
        snap-center
        flex-col
        overflow-hidden
        border
        border-[#292929]
        bg-[#0B0B0B]
        sm:w-[340px]
        md:w-[360px]
      "
    >
      {/* ==========================================
          TRAINER PHOTO
      ========================================== */}

      <button
        type="button"
        onClick={onChoose}
        className="block w-full text-left"
        aria-label={`Choose ${trainer.name}`}
      >
        <div className="trainer-photo relative aspect-[4/5] overflow-hidden bg-[#111]">
          {trainer.photo_url ? (
            <img
              src={trainer.photo_url}
              alt={trainer.name}
              className="
                h-full
                w-full
                object-cover
                grayscale-[15%]
                transition
                duration-700
                group-hover:scale-[1.04]
                group-hover:grayscale-0
              "
              loading="lazy"
            />
          ) : (
            <div className="grid h-full place-items-center bg-[#111]">
              <Award
                size={54}
                strokeWidth={1.4}
                className="text-[#444]"
              />
            </div>
          )}

          {/* IMAGE OVERLAY */}

          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-black/10 to-transparent" />

          {/* TRAINER NUMBER */}

          <span className="trainer-index absolute left-4 top-4 border border-white/20 bg-black/75 px-3 py-2 text-xs font-black text-white backdrop-blur-sm">
            {String(index + 1).padStart(
              2,
              "0"
            )}
          </span>

          {/* NAME OVER IMAGE */}

          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
            <p className="trainer-kicker text-[10px] font-black uppercase tracking-[0.24em] text-[#E85D2A]">
              {trainer.specialization ||
                "Personal Trainer"}
            </p>

            <h3 className="trainer-name mt-2 break-words text-4xl uppercase leading-[0.92] text-white md:text-5xl">
              {trainer.name}
            </h3>
          </div>
        </div>
      </button>

      {/* ==========================================
          TRAINER INFORMATION
      ========================================== */}

      <div className="flex flex-1 flex-col p-5 md:p-6">
        {/* ==========================================
            TRAINER STATS
        ========================================== */}

        <div className="mb-6 grid grid-cols-2 border-y border-[#252525] py-4">
          {/* EXPERIENCE */}

          <div className="border-r border-[#252525] pr-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#6F6F6F]">
              Experience
            </p>

            <p className="trainer-number mt-2 text-3xl leading-none text-white md:text-4xl">
              {trainer.experience_years || 0}

              <span className="ml-1 font-sans text-xs font-black text-[#E85D2A] md:text-sm">
                + YRS
              </span>
            </p>
          </div>

          {/* CLIENTS */}

          <div className="pl-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#6F6F6F]">
              Clients coached
            </p>

            <p className="trainer-number mt-2 text-3xl leading-none text-white md:text-4xl">
              {trainer.clients || 0}

              <span className="ml-1 font-sans text-sm font-black text-[#E85D2A]">
                +
              </span>
            </p>
          </div>
        </div>

        {/* ==========================================
            CERTIFICATIONS
        ========================================== */}

        <div className="min-h-[150px]">
          <div className="mb-4 flex items-center gap-2 border-b border-[#252525] pb-3">
            <BadgeCheck
              size={18}
              strokeWidth={2}
              className="shrink-0 text-[#E85D2A]"
            />

            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
              Certifications
            </p>
          </div>

          {certifications.length > 0 ? (
            <ul className="space-y-3">
              {certifications.map(
                (certification, certIndex) => (
                  <li
                    key={`${certification}-${certIndex}`}
                    className="grid grid-cols-[28px_1fr] items-start gap-2"
                  >
                    <span className="trainer-index text-[10px] font-black text-[#E85D2A]">
                      {String(
                        certIndex + 1
                      ).padStart(2, "0")}
                    </span>

                    <span className="break-words text-sm font-medium leading-5 text-[#B8B8B8]">
                      {certification}
                    </span>
                  </li>
                )
              )}
            </ul>
          ) : (
            <p className="text-sm leading-6 text-[#666]">
              Certification details coming
              soon.
            </p>
          )}
        </div>

        {/* ==========================================
            TRAINER BIO
        ========================================== */}

        {trainer.bio && (
          <div className="mt-5 border-t border-[#252525] pt-5">
            <p className="line-clamp-3 text-sm leading-6 text-[#858585]">
              {trainer.bio}
            </p>
          </div>
        )}

        {/* ==========================================
            TRAIN BUTTON
        ========================================== */}

        <button
          type="button"
          onClick={onChoose}
          className="
            group/train
            mt-7
            flex
            w-full
            items-center
            justify-between
            bg-[#E85D2A]
            px-5
            py-4
            text-left
            text-xs
            font-black
            uppercase
            tracking-[0.16em]
            text-white
            transition-colors
            duration-300
            hover:bg-[#C9471B]
          "
        >
          <span>
            Train with{" "}
            {trainer.name?.split(" ")[0] ||
              "Coach"}
          </span>

          <MoveRight
            size={19}
            className="shrink-0 transition-transform duration-300 group-hover/train:translate-x-1"
          />
        </button>
      </div>
    </article>
  );
}

// ==========================================
// NAVIGATION BUTTON
// ==========================================

function NavButton({
  onClick,
  label,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="
        grid
        h-11
        w-11
        shrink-0
        place-items-center
        border
        border-[#303030]
        bg-[#080808]
        text-white
        transition-all
        duration-300
        hover:border-[#E85D2A]
        hover:bg-[#E85D2A]
        hover:text-white
      "
    >
      {children}
    </button>
  );
}