import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ArrowRight, Users, Trophy, Flame } from 'lucide-react';

// HERO IMAGES
import heroImg from '../assets/hero-5-lap.png';
import heroMobileImg from '../assets/hero-5-mob.png';

export default function Hero() {
  const heroRef = useRef(null);
  const badgeRef = useRef(null);
  const alboRef = useRef(null);
  const fitnessRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonsRef = useRef(null);

  // ==========================================
  // GSAP HERO ENTRANCE ANIMATION
  // ==========================================
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(
        [
          badgeRef.current,
          alboRef.current,
          fitnessRef.current,
          subtitleRef.current,
        ],
        {
          visibility: 'visible',
        }
      );

      const buttons = buttonsRef.current
        ? buttonsRef.current.children
        : [];

      const tl = gsap.timeline({
        delay: 0.25,
        defaults: {
          ease: 'power4.out',
        },
      });

      tl.fromTo(
        badgeRef.current,
        {
          y: 35,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
        }
      )

        .fromTo(
          alboRef.current,
          {
            y: 140,
            opacity: 0,
            skewY: 4,
            scale: 0.92,
          },
          {
            y: 0,
            opacity: 1,
            skewY: 0,
            scale: 1,
            duration: 1.15,
          },
          '-=0.4'
        )

        .fromTo(
          fitnessRef.current,
          {
            x: -100,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.9,
          },
          '-=0.65'
        )

        .fromTo(
          subtitleRef.current,
          {
            y: 35,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
          },
          '-=0.45'
        )

        .fromTo(
          buttons,
          {
            y: 35,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.15,
          },
          '-=0.4'
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // ==========================================
  // SMOOTH SCROLL
  // ==========================================
  const scrollToSection = (id) => {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full overflow-hidden bg-[#050505]"
    >
      <div
        id="home"
        className="relative flex min-h-screen w-full items-center"
      >
        {/* ==========================================
            DESKTOP HERO IMAGE
        ========================================== */}

        <motion.img
          src={heroImg}
          alt="ALBO Fitness Desktop Background"
          className="absolute inset-0 hidden h-full w-full object-cover md:block"
          style={{
            filter:
              'brightness(1.05) contrast(1.15) saturate(0.9)',
          }}
          initial={{
            scale: 1.15,
          }}
          animate={{
            scale: 1.05,
          }}
          transition={{
            duration: 25,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />

        {/* ==========================================
            MOBILE HERO IMAGE
        ========================================== */}

        <motion.img
          src={heroMobileImg}
          alt="ALBO Fitness Mobile Background"
          className="absolute inset-0 h-full w-full object-cover md:hidden"
          style={{
            filter:
              'brightness(1.05) contrast(1.15) saturate(0.9)',
          }}
          initial={{
            scale: 1.1,
          }}
          animate={{
            scale: 1,
          }}
          transition={{
            duration: 25,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />

        {/* ==========================================
            DARK OVERLAYS
        ========================================== */}

        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/95 via-black/70 to-black/20" />

        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-transparent to-black/95" />

        <div className="hero-vignette absolute inset-0 z-10" />

        {/* ==========================================
            MOVING ORANGE ATMOSPHERE
        ========================================== */}

        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
          <div className="hero-orange-glow glow-one" />

          <div className="hero-orange-glow glow-two" />
        </div>

        {/* ==========================================
            ANIMATED PARTICLES
        ========================================== */}

        <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
          <span className="hero-particle particle-one" />

          <span className="hero-particle particle-two" />

          <span className="hero-particle particle-three" />

          <span className="hero-particle particle-four" />

          <span className="hero-particle particle-five" />

          <span className="hero-particle particle-six" />
        </div>

        {/* ==========================================
            HERO CONTENT
        ========================================== */}

        <div className="container relative z-40 mx-auto w-full px-6 py-20">
          <div className="mx-auto max-w-4xl text-center lg:mx-0 lg:text-left">
            {/* ==========================================
                TAGLINE
            ========================================== */}

            <div
              ref={badgeRef}
              className="hero-hidden mb-7 inline-flex items-center gap-3 rounded-full border border-[#E85D2A]/40 bg-black/40 px-5 py-2"
            >
              <span className="hero-badge-dot h-1.5 w-1.5 rounded-full bg-[#E85D2A]" />

              <p className="text-[9px] font-bold uppercase tracking-[3px] text-[#F18E62] sm:text-[10px] sm:tracking-[4px]">
                STRONGER TODAY · BETTER TOMORROW
              </p>
            </div>

            {/* ==========================================
                ALBO FITNESS TITLE
            ========================================== */}

            <h1 className="albo-hero-title mb-8">
              <span
                ref={alboRef}
                className="hero-hidden albo-title-word"
              >
                ALBO
              </span>

              <span
                ref={fitnessRef}
                className="hero-hidden fitness-title-word"
              >
                FITNESS
              </span>
            </h1>

            {/* ==========================================
                SUBTITLE
            ========================================== */}

            <p
              ref={subtitleRef}
              className="hero-hidden mx-auto mb-10 max-w-2xl text-lg font-light leading-relaxed text-[#F7F7F5]/90 md:text-xl lg:mx-0"
            >
              Excellence in every rep.
              <br />

              <span className="font-semibold text-[#E85D2A]">
                Transformation
              </span>{' '}
              in every session.
            </p>

            {/* ==========================================
                CTA BUTTONS
            ========================================== */}

            <div
              ref={buttonsRef}
              className="mb-16 flex flex-col justify-center gap-5 sm:flex-row lg:justify-start"
            >
              <motion.button
                onClick={() =>
                  scrollToSection('trainers')
                }
                className="hero-btn group relative overflow-hidden rounded-sm bg-[#E85D2A] px-10 py-4 text-sm font-black uppercase tracking-widest text-white"
                whileHover={{
                  y: -4,
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                transition={{
                  duration: 0.2,
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  MEET OUR TRAINERS

                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-2"
                    strokeWidth={2.5}
                  />
                </span>

                <span className="button-sweep" />
              </motion.button>

              <motion.button
                onClick={() =>
                  scrollToSection('contact')
                }
                className="hero-btn rounded-sm border border-[#E85D2A] bg-transparent px-10 py-4 text-sm font-black uppercase tracking-widest text-white"
                whileHover={{
                  y: -4,
                  scale: 1.02,
                  backgroundColor: '#E85D2A',
                }}
                whileTap={{
                  scale: 0.97,
                }}
                transition={{
                  duration: 0.2,
                }}
              >
                START YOUR JOURNEY
              </motion.button>
            </div>

            {/* ==========================================
                STATS
            ========================================== */}

            <div className="relative z-50 mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-3 md:gap-6 lg:mx-0">
              <StatCard
                value={500}
                suffix="+"
                label="MEMBERS TRANSFORMED"
                icon={
                  <Users
                    size={24}
                    strokeWidth={2.5}
                  />
                }
                delay={1.1}
              />

              <StatCard
                value={8}
                suffix=""
                label="EXPERT TRAINERS"
                icon={
                  <Trophy
                    size={24}
                    strokeWidth={2.5}
                  />
                }
                delay={1.25}
              />

              <StatCard
                value={10}
                suffix="+"
                label="YEARS EXPERIENCE"
                icon={
                  <Flame
                    size={24}
                    strokeWidth={2.5}
                  />
                }
                delay={1.4}
              />
            </div>
          </div>
        </div>

        {/* ==========================================
            SCROLL INDICATOR
        ========================================== */}

        <motion.div
          className="absolute bottom-8 right-8 z-50 hidden flex-col items-center gap-2 text-[10px] font-bold tracking-[0.3em] text-[#E85D2A] sm:flex"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            y: [0, 8, 0],
          }}
          transition={{
            opacity: {
              duration: 1,
              delay: 1.8,
            },
            y: {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
        >
          <span>SCROLL</span>

          <span>DOWN</span>

          <motion.span
            className="mt-1 h-10 w-[1px] origin-top bg-[#E85D2A]"
            animate={{
              scaleY: [0.25, 1, 0.25],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        </motion.div>
      </div>

      {/* ==========================================
          HERO CSS
      ========================================== */}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Russo+One&display=swap');

        .hero-hidden {
          visibility: hidden;
        }

        /* ========================================
           HERO TITLE
        ======================================== */

        .albo-hero-title {
          display: flex;
          flex-direction: column;
          align-items: center;

          width: fit-content;
          max-width: 100%;

          font-family: 'Russo One', sans-serif;

          line-height: 0.75;

          text-transform: uppercase;

          filter:
            drop-shadow(
              0 20px 35px rgba(0, 0, 0, 0.75)
            );
        }

        /* ========================================
           ALBO — SOLID WHITE FIX
        ======================================== */

        .albo-title-word {
          display: inline-block;

          position: relative;

          font-family: 'Russo One', sans-serif;

          font-size: clamp(
            5rem,
            14vw,
            11rem
          );

          font-weight: 400;

          font-style: italic;

          line-height: 0.82;

          letter-spacing: -0.075em;

          color: #ffffff !important;

          background: none !important;

          background-image: none !important;

          -webkit-background-clip: initial !important;

          background-clip: initial !important;

          -webkit-text-fill-color: #ffffff !important;

          -webkit-text-stroke: 0 !important;

          transform-origin: center;

          text-shadow:
            4px 4px 0 rgba(
              232,
              93,
              42,
              0.14
            ),
            0 18px 35px rgba(
              0,
              0,
              0,
              0.8
            );
        }

        /* ========================================
           FITNESS
        ======================================== */

        .fitness-title-word {
          display: block;

          margin-top: 0.32em;

          margin-left: 1.1em;

          font-family: 'Russo One', sans-serif;

          font-size: clamp(
            2rem,
            5.8vw,
            4.8rem
          );

          font-weight: 400;

          font-style: italic;

          line-height: 1;

          letter-spacing: 0.08em;

          color: #ffffff !important;

          background: none !important;

          -webkit-text-fill-color: #ffffff !important;

          -webkit-text-stroke: 0 !important;

          transform-origin: center;

          text-shadow:
            0 5px 15px rgba(
              0,
              0,
              0,
              0.9
            );
        }

        /* ========================================
           DESKTOP TITLE
        ======================================== */

        @media (min-width: 1024px) {
          .albo-hero-title {
            align-items: flex-start;
          }

          .albo-title-word {
            transform-origin: left center;
          }

          .fitness-title-word {
            transform-origin: left center;

            margin-left: 1.35em;
          }
        }

        /* ========================================
           MOBILE TITLE
        ======================================== */

        @media (max-width: 640px) {
          .albo-hero-title {
            line-height: 0.8;

            margin-left: auto;

            margin-right: auto;
          }

          .albo-title-word {
            font-size: clamp(
              4.3rem,
              25vw,
              7rem
            );

            letter-spacing: -0.075em;
          }

          .fitness-title-word {
            font-size: clamp(
              1.7rem,
              10vw,
              3rem
            );

            margin-top: 0.4em;

            margin-left: 0.7em;

            letter-spacing: 0.06em;
          }
        }

        /* ========================================
           VIGNETTE
        ======================================== */

        .hero-vignette {
          background:
            radial-gradient(
              ellipse at center,
              transparent 0%,
              rgba(0, 0, 0, 0.1) 40%,
              rgba(0, 0, 0, 0.8) 100%
            );
        }

        /* ========================================
           ORANGE MOVING GLOWS
        ======================================== */

        .hero-orange-glow {
          position: absolute;

          border-radius: 9999px;

          pointer-events: none;
        }

        .glow-one {
          width: 800px;
          height: 800px;

          top: -30%;
          left: -20%;

          background:
            rgba(232, 93, 42, 0.1);

          filter: blur(170px);

          animation:
            glow-drift-one
            15s
            ease-in-out
            infinite;
        }

        .glow-two {
          width: 650px;
          height: 650px;

          right: -15%;
          bottom: -30%;

          background:
            rgba(232, 93, 42, 0.06);

          filter: blur(150px);

          animation:
            glow-drift-two
            18s
            ease-in-out
            infinite;
        }

        @keyframes glow-drift-one {
          0%,
          100% {
            transform:
              translate3d(0, 0, 0)
              scale(1);
          }

          50% {
            transform:
              translate3d(
                80px,
                -30px,
                0
              )
              scale(1.1);
          }
        }

        @keyframes glow-drift-two {
          0%,
          100% {
            transform:
              translate3d(0, 0, 0)
              scale(1);
          }

          50% {
            transform:
              translate3d(
                -70px,
                40px,
                0
              )
              scale(1.12);
          }
        }

        /* ========================================
           BADGE PULSE
        ======================================== */

        @keyframes badge-pulse {
          0%,
          100% {
            transform: scale(1);

            box-shadow:
              0 0 4px rgba(
                232,
                93,
                42,
                0.4
              );
          }

          50% {
            transform: scale(1.35);

            box-shadow:
              0 0 12px rgba(
                232,
                93,
                42,
                1
              );
          }
        }

        .hero-badge-dot {
          animation:
            badge-pulse
            2s
            ease-in-out
            infinite;
        }

        /* ========================================
           PARTICLES
        ======================================== */

        .hero-particle {
          position: absolute;

          width: 3px;
          height: 3px;

          border-radius: 9999px;

          background: #e85d2a;

          opacity: 0;
        }

        .particle-one {
          top: 70%;
          left: 15%;

          animation:
            particle-rise
            9s
            linear
            infinite;
        }

        .particle-two {
          top: 80%;
          left: 35%;

          animation:
            particle-rise
            12s
            linear
            2s
            infinite;
        }

        .particle-three {
          top: 65%;
          left: 60%;

          animation:
            particle-rise
            10s
            linear
            4s
            infinite;
        }

        .particle-four {
          top: 85%;
          left: 75%;

          animation:
            particle-rise
            14s
            linear
            1s
            infinite;
        }

        .particle-five {
          top: 75%;
          left: 85%;

          animation:
            particle-rise
            11s
            linear
            5s
            infinite;
        }

        .particle-six {
          top: 90%;
          left: 50%;

          animation:
            particle-rise
            13s
            linear
            3s
            infinite;
        }

        @keyframes particle-rise {
          0% {
            transform:
              translate3d(
                0,
                50px,
                0
              )
              scale(0.5);

            opacity: 0;
          }

          15% {
            opacity: 0.7;
          }

          70% {
            opacity: 0.4;
          }

          100% {
            transform:
              translate3d(
                35px,
                -350px,
                0
              )
              scale(1.4);

            opacity: 0;
          }
        }

        /* ========================================
           BUTTON SWEEP
        ======================================== */

        .button-sweep {
          position: absolute;

          inset: 0;

          transform:
            translateX(-120%)
            skewX(-20deg);

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.25),
              transparent
            );

          transition:
            transform
            0.7s
            ease;
        }

        .hero-btn:hover .button-sweep {
          transform:
            translateX(120%)
            skewX(-20deg);
        }

        /* ========================================
           REDUCED MOTION ACCESSIBILITY
        ======================================== */

        @media (
          prefers-reduced-motion: reduce
        ) {
          .hero-orange-glow,
          .hero-particle,
          .hero-badge-dot {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}

// ==========================================
// STAT CARD
// ==========================================

function StatCard({
  value,
  suffix,
  label,
  icon,
  delay,
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;

    const end = parseInt(value, 10);

    if (end === 0) {
      return undefined;
    }

    const duration = 2000;

    const incrementTime = Math.max(
      duration / end,
      15
    );

    const interval = setInterval(() => {
      start += 1;

      setCount(start);

      if (start >= end) {
        setCount(end);

        clearInterval(interval);
      }
    }, incrementTime);

    return () => {
      clearInterval(interval);
    };
  }, [value]);

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 50,
        scale: 0.95,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -8,
      }}
      className="group relative overflow-hidden rounded-sm border border-[#292929] bg-[#111111]/90 p-4 transition-colors duration-300 hover:border-[#E85D2A] md:p-6"
    >
      {/* ==========================================
          ORANGE HOVER BACKGROUND
      ========================================== */}

      <div className="absolute inset-0 bg-gradient-to-br from-[#E85D2A]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* ==========================================
          CARD CONTENT
      ========================================== */}

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          className="mb-3 inline-flex border border-[#E85D2A]/40 bg-[#E85D2A]/10 p-2 md:mb-4 md:p-3"
          whileHover={{
            rotate: 6,
            scale: 1.1,
          }}
        >
          <div className="text-[#E85D2A]">
            {icon}
          </div>
        </motion.div>

        <p className="mb-1 text-2xl font-black text-white md:mb-2 md:text-4xl lg:text-5xl">
          {count}

          <span className="text-[#E85D2A]">
            {suffix}
          </span>
        </p>

        <p className="text-[8px] font-bold uppercase leading-tight tracking-wider text-[#A3A3A3] md:text-[11px]">
          {label}
        </p>
      </div>

      {/* ==========================================
          ANIMATED BOTTOM LINE
      ========================================== */}

      <div className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-[#E85D2A] transition-transform duration-500 group-hover:scale-x-100" />
    </motion.div>
  );
}