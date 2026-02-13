"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════
   Starfield – deterministic positions for SSR compat
   ═══════════════════════════════════════════════════ */
const STAR_COUNT = 100;
const STARS = Array.from({ length: STAR_COUNT }, (_, i) => ({
  id: i,
  x: (i * 73 + 17) % 100,
  y: (i * 41 + 29) % 100,
  size: 1 + (i % 3),
  delay: +((i * 0.7) % 5).toFixed(1),
  duration: +(2 + (i % 3)).toFixed(1),
}));

/* ═══════════════════════════════════════════════════
   Valentine Scene
   ═══════════════════════════════════════════════════ */
export default function ValentineScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLHeadingElement>(null);
  const text2WrapperRef = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLHeadingElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const t1 = text1Ref.current;
      const t2Wrapper = text2WrapperRef.current;
      const t2 = text2Ref.current;
      const glow = glowRef.current;
      const flash = flashRef.current;
      const pContainer = particlesRef.current;
      const scrollInd = scrollIndicatorRef.current;

      if (!section || !t1 || !t2Wrapper || !t2 || !glow || !flash || !pContainer)
        return;

      /* ── Split text into words → chars ── */
      const split = new SplitType(t2, { types: "words,chars" });
      const chars = split.chars ?? [];

      /* Set initial state for each character */
      gsap.set(chars, {
        opacity: 0,
        y: 60,
        rotateX: -90,
        scale: 0.3,
        transformPerspective: 500,
      });

      /* ── Create particles dynamically ── */
      const PARTICLE_COUNT = 60;
      const particles: HTMLDivElement[] = [];

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const el = document.createElement("div");
        const size = 2 + (i % 6);
        const hue = 260 + ((i * 7) % 50);
        const light = 50 + ((i * 3) % 30);

        Object.assign(el.style, {
          position: "absolute",
          borderRadius: "50%",
          width: `${size}px`,
          height: `${size}px`,
          background: `hsl(${hue}, 100%, ${light}%)`,
          boxShadow: `0 0 ${size * 3}px hsl(${hue}, 100%, ${light}%)`,
          left: `${20 + ((i * 13) % 60)}%`,
          top: `${35 + ((i * 7) % 30)}%`,
          opacity: "0",
          pointerEvents: "none",
        });

        pContainer.appendChild(el);
        particles.push(el);
      }

      /* ═══════════════════════════════════════════
         Main ScrollTrigger Timeline
         ═══════════════════════════════════════════ */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=150%",
          scrub: 1.5,
          pin: true,
          snap: {
            snapTo: [0, 1],
            duration: { min: 0.3, max: 0.8 },
            ease: "power2.inOut",
          },
        },
      });

      /* ── 0.0 → 0.3  Scroll indicator fades ── */
      if (scrollInd) {
        tl.to(scrollInd, { autoAlpha: 0, y: 20, duration: 0.3 }, 0);
      }

      /* ── 0.0 → 2.0  Background glow intensifies ── */
      tl.fromTo(
        glow,
        { opacity: 0.15, scale: 0.8 },
        { opacity: 0.8, scale: 1.4, duration: 2, ease: "power1.inOut" },
        0
      );

      /* ── 0.0 → 1.0  Text 1 blurs out with gaussian blur ── */
      tl.to(
        t1,
        {
          filter: "blur(30px)",
          opacity: 0,
          scale: 0.6,
          duration: 1,
          ease: "power2.in",
        },
        0
      );

      /* ── 0.8 → 1.1  Flash / destello appears ── */
      tl.fromTo(
        flash,
        { autoAlpha: 0, scale: 0.2 },
        { autoAlpha: 0.9, scale: 1, duration: 0.3, ease: "power4.out" },
        0.8
      );

      /* ── 1.1 → 1.5  Flash expands and fades ── */
      tl.to(
        flash,
        { autoAlpha: 0, scale: 2.5, duration: 0.4, ease: "power2.out" },
        1.1
      );

      /* ── 1.0  Text 2 wrapper becomes visible ── */
      tl.set(t2Wrapper, { visibility: "visible" }, 1.0);

      /* ── 1.0 → 2.5  Characters animate in with stagger ── */
      if (chars.length > 0) {
        tl.to(
          chars,
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            stagger: 0.04,
            duration: 1.5,
            ease: "back.out(1.7)",
          },
          1.0
        );
      }

      /* ── 1.3 → 2.3  Particles burst outward ── */
      tl.to(
        particles,
        {
          opacity: () => gsap.utils.random(0.5, 1),
          x: () => gsap.utils.random(-250, 250),
          y: () => gsap.utils.random(-180, 180),
          scale: () => gsap.utils.random(1, 3),
          stagger: { each: 0.015, from: "center" },
          duration: 1,
          ease: "power2.out",
        },
        1.3
      );

      /* ── 2.5 → 2.9  Particles fade out ── */
      tl.to(
        particles,
        {
          opacity: 0,
          scale: 0,
          duration: 0.4,
          stagger: 0.008,
        },
        2.5
      );

      /* ── 2.5 → 3.0  Glow settles to final state ── */
      tl.to(
        glow,
        {
          opacity: 0.35,
          scale: 1,
          duration: 0.5,
          ease: "power1.inOut",
        },
        2.5
      );

      /* ── Cleanup ── */
      return () => {
        split.revert();
        particles.forEach((p) => p.remove());
      };
    },
    { scope: containerRef }
  );

  /* ═══════════════════════════════════════════
     Render
     ═══════════════════════════════════════════ */
  return (
    <div ref={containerRef}>
      <section
        ref={sectionRef}
        className="relative h-screen w-full overflow-hidden"
        style={{ background: "#050505" }}
      >
        {/* ── Starfield ── */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          {STARS.map((s) => (
            <div
              key={s.id}
              className="star-twinkle absolute rounded-full bg-white"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.size,
                height: s.size,
                animationDelay: `${s.delay}s`,
                animationDuration: `${s.duration}s`,
              }}
            />
          ))}
        </div>

        {/* ── Background radial glow ── */}
        <div
          ref={glowRef}
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: 0.15,
            background:
              "radial-gradient(ellipse at center, rgba(139,92,246,0.5) 0%, rgba(88,28,135,0.2) 40%, transparent 70%)",
          }}
        />

        {/* ── Flash / destello element ── */}
        <div
          ref={flashRef}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full md:h-[700px] md:w-[700px]"
          style={{
            visibility: "hidden",
            background:
              "radial-gradient(circle, rgba(196,181,253,0.7) 0%, rgba(139,92,246,0.3) 30%, transparent 60%)",
          }}
        />

        {/* ── Particles container ── */}
        <div
          ref={particlesRef}
          className="pointer-events-none absolute inset-0 z-10"
          aria-hidden="true"
        />

        {/* ── Text 1: ¿Mimi? ── */}
        <h1
          ref={text1Ref}
          className="absolute inset-0 z-20 flex select-none items-center justify-center font-serif text-7xl font-black tracking-wide sm:text-8xl md:text-9xl"
          style={{
            color: "#c084fc",
            textShadow:
              "0 0 20px rgba(192,132,252,0.6), 0 0 60px rgba(168,85,247,0.35), 0 0 120px rgba(139,92,246,0.15)",
          }}
        >
          ¿Mimi?
        </h1>

        {/* ── Text 2: ¿Quieres ser mi San Valentín? ── */}
        <div
          ref={text2WrapperRef}
          className="absolute inset-0 z-20 flex items-center justify-center px-6 md:px-12"
          style={{ visibility: "hidden" }}
        >
          <h1
            ref={text2Ref}
            className="select-none text-center font-serif text-3xl font-black leading-snug tracking-wide sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
            style={{
              color: "#c084fc",
              textShadow:
                "0 0 20px rgba(192,132,252,0.6), 0 0 60px rgba(168,85,247,0.35), 0 0 120px rgba(139,92,246,0.15)",
            }}
          >
            ¿Quieres ser mi San Valentín?
          </h1>
        </div>

        {/* ── Scroll indicator ── */}
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2"
        >
          <span className="text-[10px] font-light uppercase tracking-[0.3em] text-purple-400/50">
            Scroll
          </span>
          <div className="relative h-10 w-px overflow-hidden bg-gradient-to-b from-purple-500/40 to-transparent">
            <div className="scroll-line absolute inset-x-0 h-3 rounded-full bg-purple-400/80" />
          </div>
        </div>
      </section>
    </div>
  );
}
