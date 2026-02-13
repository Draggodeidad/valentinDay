"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { PiHeartFill } from "react-icons/pi";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════
   Photos data — reemplaza `src` con tus propias imágenes.
   Coloca las fotos en /public/photos/ y actualiza las rutas.
   ═══════════════════════════════════════════════════════════ */
const PHOTOS: {
  id: number;
  src?: string;
  caption: string;
  gradient: string;
}[] = [
  {
    id: 1,
    src: "/IMG_7711.jpg",
    caption: "",
    gradient: "linear-gradient(135deg, #581c87 0%, #be185d 100%)",
  },
  {
    id: 2,
    src: "/IMG_7979.jpg",
    caption: "",
    gradient: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)",
  },
  {
    id: 3,
    src: "/IMG_8294.jpg",
    caption: "",
    gradient: "linear-gradient(135deg, #701a75 0%, #a855f7 100%)",
  },
  {
    id: 4,
    src: "/IMG_8530.jpg",
    caption: "",
    gradient: "linear-gradient(135deg, #3b0764 0%, #c026d3 100%)",
  },
  {
    id: 5,
    src: "/IMG_8564.jpg",
    caption: "",
    gradient: "linear-gradient(135deg, #4c1d95 0%, #9333ea 100%)",
  },
  {
    id: 6,
    src: "/85AB0C4E-3325-463C-94E7-3B96950B6EF1.jpg",
    caption: "",
    gradient: "linear-gradient(135deg, #581c87 0%, #d946ef 100%)",
  },
];

/* ═══════════════════════════════════════════════════════════
   Photo Gallery – Scroll Horizontal con GSAP ScrollTrigger
   ═══════════════════════════════════════════════════════════ */
export default function PhotoGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const cards = gsap.utils.toArray<HTMLElement>(".photo-card", track);
      const orbs = gsap.utils.toArray<HTMLElement>(".deco-orb", section);

      const getScrollAmount = () =>
        Math.max(0, track.scrollWidth - window.innerWidth);

      /* ══════════════════════════════════════════════
         Main pinned timeline (drives horizontal scroll)
         ══════════════════════════════════════════════ */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          end: () => `+=${getScrollAmount()}`,
          invalidateOnRefresh: true,
        },
      });

      /* ── Track moves left (horizontal scroll) ── */
      tl.to(
        track,
        {
          x: () => -getScrollAmount(),
          ease: "none",
          duration: 1,
        },
        0
      );

      /* ── Parallax decorative orbs (move slower → parallax) ── */
      orbs.forEach((orb, i) => {
        tl.to(
          orb,
          {
            x: () => -getScrollAmount() * (0.15 + i * 0.08),
            ease: "none",
            duration: 1,
          },
          0
        );
      });

      /* ══════════════════════════════════════════════
         Per-card animations (containerAnimation)
         ══════════════════════════════════════════════ */
      cards.forEach((card) => {
        const frame = card.querySelector<HTMLElement>(".photo-frame");
        const caption = card.querySelector<HTMLElement>(".photo-caption");

        /* ── Entry: fade-in + scale-up + slide ── */
        gsap.from(card, {
          opacity: 0,
          scale: 0.82,
          y: 50,
          scrollTrigger: {
            trigger: card,
            containerAnimation: tl,
            start: "left 95%",
            end: "left 60%",
            scrub: true,
          },
        });

        /* ── Border glow intensifies on entry ── */
        if (frame) {
          gsap.fromTo(
            frame,
            {
              borderColor: "rgba(255,255,255,0.05)",
              boxShadow:
                "0 0 0px transparent, 0 4px 20px rgba(0,0,0,0.3)",
            },
            {
              borderColor: "rgba(192,132,252,0.5)",
              boxShadow:
                "0 0 30px rgba(139,92,246,0.2), 0 0 60px rgba(139,92,246,0.08), 0 4px 30px rgba(0,0,0,0.4)",
              scrollTrigger: {
                trigger: card,
                containerAnimation: tl,
                start: "left 85%",
                end: "left 35%",
                scrub: true,
              },
            }
          );
        }

        /* ── Caption fades in after photo ── */
        if (caption) {
          gsap.from(caption, {
            opacity: 0,
            y: 15,
            scrollTrigger: {
              trigger: card,
              containerAnimation: tl,
              start: "left 75%",
              end: "left 50%",
              scrub: true,
            },
          });
        }
      });
    },
    { scope: sectionRef }
  );

  /* ═══════════════════════════════════════════
     Render
     ═══════════════════════════════════════════ */
  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ backgroundColor: "#050505" }}
    >
      {/* ── Decorative parallax orbs ── */}
      <div
        className="deco-orb pointer-events-none absolute -left-20 top-[15%] h-72 w-72 rounded-full opacity-20 blur-3xl"
        style={{
          background: "radial-gradient(circle, #7c3aed, transparent)",
        }}
      />
      <div
        className="deco-orb pointer-events-none absolute left-[30%] top-[70%] h-56 w-56 rounded-full opacity-15 blur-3xl"
        style={{
          background: "radial-gradient(circle, #a855f7, transparent)",
        }}
      />
      <div
        className="deco-orb pointer-events-none absolute left-[55%] top-[10%] h-64 w-64 rounded-full opacity-10 blur-3xl"
        style={{
          background: "radial-gradient(circle, #6d28d9, transparent)",
        }}
      />
      <div
        className="deco-orb pointer-events-none absolute left-[80%] top-[60%] h-80 w-80 rounded-full opacity-20 blur-3xl"
        style={{
          background: "radial-gradient(circle, #8b5cf6, transparent)",
        }}
      />

      {/* ── Horizontal scroll track ── */}
      <div className="flex h-screen items-center">
        <div
          ref={trackRef}
          className="flex items-center gap-8 pl-[10vw] pr-[50vw] md:gap-14"
        >
          {/* ── Title card ── */}
          <div className="flex h-[70vh] w-[85vw] flex-shrink-0 flex-col items-center justify-center md:w-[40vw]">
            <p
              className="mb-3 text-xs font-light uppercase tracking-[0.4em] text-purple-400/40"
            >
              Galería
            </p>
            <h2
              className="font-serif text-4xl font-bold tracking-wide text-purple-100/90 sm:text-5xl md:text-6xl"
              style={{
                textShadow:
                  "0 0 40px rgba(168,85,247,0.3), 0 0 80px rgba(139,92,246,0.1)",
              }}
            >
              Nuestros Momentos
            </h2>
            <div className="mt-6 flex items-center gap-3 text-purple-300/40">
              <div className="h-px w-12 bg-purple-400/30" />
              <span className="text-sm tracking-widest">●</span>
              <div className="h-px w-12 bg-purple-400/30" />
            </div>
            <p className="mt-4 text-sm font-light text-purple-300/40">
              Sigue bajando para recordar
            </p>
          </div>

          {/* ── Photo cards ── */}
          {PHOTOS.map((photo) => (
            <div
              key={photo.id}
              className="photo-card flex flex-shrink-0 flex-col items-center gap-5"
            >
              {/* Photo frame */}
              <div
                className="photo-frame relative h-[50vh] w-[72vw] overflow-hidden rounded-2xl border-2 border-white/5 sm:w-[50vw] md:h-[58vh] md:w-[30vw] lg:w-[24vw]"
              >
                {photo.src ? (
                  <Image
                    src={photo.src}
                    alt={photo.caption || `Foto ${photo.id}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 72vw, 24vw"
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center"
                    style={{ background: photo.gradient }}
                  >
                    <PiHeartFill className="h-14 w-14 select-none text-purple-300/20" />
                  </div>
                )}
              </div>

              {/* Caption */}
              <p className="photo-caption max-w-[260px] text-center text-sm font-light leading-relaxed text-purple-200/60">
                {photo.caption}
              </p>
            </div>
          ))}

          {/* ── End card ── */}
          <div className="photo-card flex h-[60vh] w-[60vw] flex-shrink-0 flex-col items-center justify-center md:w-[30vw]">
            <PiHeartFill
              className="mb-4 h-20 w-20 select-none text-purple-400/40 md:h-24 md:w-24"
              style={{
                filter: "drop-shadow(0 0 15px rgba(168,85,247,0.3))",
              }}
            />
            <p
              className="font-serif text-lg italic text-purple-300/50 md:text-xl"
            >
              ...y muchos más por venir
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
