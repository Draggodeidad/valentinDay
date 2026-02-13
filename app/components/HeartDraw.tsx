"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════
   Heart SVG path – empieza desde la punta superior central,
   traza en sentido antihorario: lóbulo izq → base → lóbulo der
   ═══════════════════════════════════════════════════════════ */
const HEART_PATH =
  "M150 50 C150 50 130 15 90 15 C42 15 10 55 10 95 C10 168 150 262 150 262 C150 262 290 168 290 95 C290 55 258 15 210 15 C170 15 150 50 150 50 Z";

/* ═══════════════════════════════════════════════════════════
   HeartDraw – Corazón que se dibuja con scroll
   ═══════════════════════════════════════════════════════════ */
export default function HeartDraw() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const glowPathRef = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const svg = svgRef.current;
      const path = pathRef.current;
      const glowPath = glowPathRef.current;

      if (!section || !svg || !path || !glowPath) return;

      /* ── Obtener la longitud total del trazo ── */
      const totalLength = path.getTotalLength();

      /* ── Estado inicial: trazo invisible ── */
      gsap.set([path, glowPath], {
        strokeDasharray: totalLength,
        strokeDashoffset: totalLength,
      });
      gsap.set(path, { fill: "rgba(168, 85, 247, 0)" });

      /* ── Crear partículas SVG que siguen el trazo ── */
      const PARTICLE_COUNT = 20;
      const particleGroup = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
      );
      svg.appendChild(particleGroup);

      const particles: SVGCircleElement[] = [];

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const circle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        const radius = 1.2 + (i % 3) * 0.8;
        const hue = 270 + ((i * 5) % 40);
        const lightness = 60 + ((i * 3) % 25);

        circle.setAttribute("r", String(radius));
        circle.setAttribute(
          "fill",
          `hsl(${hue}, 100%, ${lightness}%)`
        );
        circle.setAttribute("opacity", "0");

        particleGroup.appendChild(circle);
        particles.push(circle);
      }

      /* ── Animación de latido (paused, se activa al completar) ── */
      const heartbeat = gsap.timeline({
        repeat: -1,
        repeatDelay: 0.5,
        paused: true,
      });

      heartbeat
        .to(svg, { scale: 1.1, duration: 0.12, ease: "power2.out" })
        .to(svg, { scale: 1, duration: 0.12, ease: "power2.in" })
        .to(svg, { scale: 1.06, duration: 0.1, ease: "power2.out" }, "+=0.06")
        .to(svg, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.4)" });

      /* ══════════════════════════════════════════════
         Main ScrollTrigger Timeline
         ══════════════════════════════════════════════ */
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
          onUpdate: (self) => {
            const p = self.progress;

            /* ── Partículas siguen la punta del trazo ── */
            particles.forEach((circle, i) => {
              const trailOffset = i * 0.008;
              const trailProgress = Math.max(0, p - trailOffset);
              const pt = path.getPointAtLength(trailProgress * totalLength);
              const spread = 4 + i * 0.7;
              const phase = i * 2.3 + p * 25;

              circle.setAttribute(
                "cx",
                String(pt.x + Math.sin(phase) * spread)
              );
              circle.setAttribute(
                "cy",
                String(pt.y + Math.cos(phase * 0.7) * spread)
              );

              if (p >= 0.99) {
                /* Partículas desaparecen al completar */
                circle.setAttribute("opacity", "0");
              } else {
                circle.setAttribute(
                  "opacity",
                  p > trailOffset + 0.01
                    ? String(Math.max(0, 0.75 - i * 0.035))
                    : "0"
                );
              }
            });

            /* ── Control del latido ── */
            if (p >= 0.99) {
              if (!heartbeat.isActive()) heartbeat.restart();
            } else if (heartbeat.isActive()) {
              heartbeat.pause();
              gsap.set(svg, { scale: 1 });
            }
          },
        },
      });

      /* ── Dibujar trazo principal + glow ── */
      tl.to(
        [path, glowPath],
        {
          strokeDashoffset: 0,
          ease: "none",
          duration: 0.9,
        },
        0
      );

      /* ── Relleno sutil al completar ── */
      tl.to(
        path,
        {
          fill: "rgba(168, 85, 247, 0.06)",
          duration: 0.1,
          ease: "power1.in",
        },
        0.9
      );

      /* ── Cleanup ── */
      return () => {
        heartbeat.kill();
        particleGroup.remove();
      };
    },
    { scope: sectionRef }
  );

  /* ═══════════════════════════════════════════
     Render
     ═══════════════════════════════════════════ */
  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden"
      style={{ background: "#050505" }}
    >
      {/* ── Glow ambiental de fondo ── */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-15"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)",
        }}
      />

      {/* ── Corazón SVG ── */}
      <svg
        ref={svgRef}
        viewBox="0 0 300 280"
        className="relative z-10 h-56 w-56 sm:h-64 sm:w-64 md:h-80 md:w-80 lg:h-96 lg:w-96"
        style={{
          filter:
            "drop-shadow(0 0 8px rgba(168,85,247,0.6)) drop-shadow(0 0 25px rgba(139,92,246,0.35)) drop-shadow(0 0 60px rgba(109,40,217,0.15))",
        }}
      >
        {/* Capa de glow (trazo grueso, semi-transparente) */}
        <path
          ref={glowPathRef}
          d={HEART_PATH}
          fill="none"
          stroke="rgba(168,85,247,0.25)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Trazo principal */}
        <path
          ref={pathRef}
          d={HEART_PATH}
          fill="none"
          stroke="#a855f7"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </section>
  );
}
