"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import confetti from "canvas-confetti";
import { PiHeartFill } from "react-icons/pi";

/* ═══════════════════════════════════════════════════════════
   Textos que cambia el botón "No" cada vez que escapa
   ═══════════════════════════════════════════════════════════ */
const NO_TEXTS = [
  "No",
  "¿Segura?",
  "Piénsalo bien...",
  "¿De verdad?",
  "Imposible",
  "Jajaja no",
  "Nope",
  "Intenta otra vez",
  "No puedes",
  "Dale que sí",
];

const CONFETTI_COLORS = [
  "#a855f7",
  "#c084fc",
  "#e9d5ff",
  "#7c3aed",
  "#f0abfc",
  "#d946ef",
  "#ffffff",
];

/* ═══════════════════════════════════════════════════════════
   FinalQuestion – La gran pregunta con botón imposible
   ═══════════════════════════════════════════════════════════ */
export default function FinalQuestion() {
  const sectionRef = useRef<HTMLElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const yesBtnRef = useRef<HTMLButtonElement>(null);
  const noBtnRef = useRef<HTMLButtonElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  /* Refs para estado sin causar re-renders */
  const acceptedRef = useRef(false);
  const escapedRef = useRef(false);
  const attemptsRef = useRef(0);
  const scaleRef = useRef(1);

  const { contextSafe } = useGSAP(
    () => {
      /* Estado inicial del mensaje final */
      gsap.set(messageRef.current, { autoAlpha: 0, y: 40, scale: 0.9 });

      /* Pulso sutil de glow en el botón Sí */
      gsap.to(yesBtnRef.current, {
        boxShadow:
          "0 0 30px rgba(168,85,247,0.6), 0 0 80px rgba(168,85,247,0.25)",
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: sectionRef }
  );

  /* ── Botón "No" escapa ── */
  const handleNoEscape = contextSafe(() => {
    if (acceptedRef.current) return;
    const btn = noBtnRef.current;
    if (!btn) return;

    /* Haptic feedback (móvil) */
    if ("vibrate" in navigator) {
      navigator.vibrate(50);
    }

    /* Primera vez: pasar a position fixed */
    if (!escapedRef.current) {
      escapedRef.current = true;
      const rect = btn.getBoundingClientRect();
      gsap.set(btn, {
        position: "fixed",
        left: rect.left,
        top: rect.top,
        margin: 0,
        zIndex: 50,
      });
    }

    /* Actualizar texto del botón */
    attemptsRef.current++;
    const idx = Math.min(attemptsRef.current, NO_TEXTS.length - 1);
    btn.textContent = NO_TEXTS[idx];

    /* Calcular posición aleatoria dentro del viewport */
    const padding = 24;
    const btnW = btn.offsetWidth;
    const btnH = btn.offsetHeight;
    const maxX = Math.max(padding, window.innerWidth - btnW - padding);
    const maxY = Math.max(padding, window.innerHeight - btnH - padding);

    gsap.to(btn, {
      left: padding + Math.random() * (maxX - padding),
      top: padding + Math.random() * (maxY - padding),
      duration: 0.4,
      ease: "bounce.out",
    });

    /* Crecer botón "Sí" un 10% */
    scaleRef.current += 0.1;
    gsap.to(yesBtnRef.current, {
      scale: scaleRef.current,
      duration: 0.3,
      ease: "back.out(1.7)",
    });
  });

  /* ── Click en "Sí" → victoria ── */
  const handleYes = contextSafe(() => {
    if (acceptedRef.current) return;
    acceptedRef.current = true;

    /* ── Ráfagas de confeti ── */
    confetti({
      particleCount: 150,
      spread: 120,
      origin: { y: 0.6 },
      colors: CONFETTI_COLORS,
    });
    setTimeout(
      () =>
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 80,
          origin: { x: 0.15, y: 0.5 },
          colors: CONFETTI_COLORS,
        }),
      400
    );
    setTimeout(
      () =>
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 80,
          origin: { x: 0.85, y: 0.5 },
          colors: CONFETTI_COLORS,
        }),
      700
    );

    /* Confeti continuo por 3 segundos */
    const end = Date.now() + 3000;
    const interval = setInterval(() => {
      if (Date.now() > end) return clearInterval(interval);
      confetti({
        particleCount: 15,
        spread: 60,
        origin: { x: Math.random(), y: Math.random() * 0.4 },
        colors: CONFETTI_COLORS,
      });
    }, 250);

    /* Ocultar pregunta y botones */
    gsap.to(questionRef.current, {
      opacity: 0,
      scale: 0.85,
      filter: "blur(12px)",
      duration: 0.6,
      ease: "power2.in",
    });

    if (noBtnRef.current) {
      gsap.to(noBtnRef.current, {
        opacity: 0,
        scale: 0,
        duration: 0.3,
      });
    }

    /* Mostrar mensaje final */
    gsap.to(messageRef.current, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 1,
      delay: 0.7,
      ease: "back.out(1.4)",
    });
  });

  /* ═══════════════════════════════════════════
     Render
     ═══════════════════════════════════════════ */
  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden"
      style={{ background: "#050505" }}
    >
      {/* ── Degradado radial morado suave ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(139,92,246,0.12) 0%, rgba(88,28,135,0.04) 45%, transparent 70%)",
        }}
      />

      {/* ── Pregunta + botones ── */}
      <div
        ref={questionRef}
        className="relative z-10 flex flex-col items-center gap-10 px-6 text-center"
      >
        <h2
          className="max-w-2xl font-serif text-3xl font-bold leading-snug text-purple-100 sm:text-4xl md:text-5xl lg:text-6xl"
          style={{
            textShadow:
              "0 0 30px rgba(168,85,247,0.3), 0 0 60px rgba(139,92,246,0.1)",
          }}
        >
          Entonces...
          <br />
          ¿quieres ser mi San Valentín?
        </h2>

        <div className="flex items-center gap-5">
          {/* Botón SÍ – protagonista */}
          <button
            ref={yesBtnRef}
            onClick={handleYes}
            className="cursor-pointer rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 px-10 py-4 text-lg font-bold text-white transition-shadow hover:from-purple-500 hover:to-fuchsia-500 md:px-14 md:py-5 md:text-xl"
            style={{
              boxShadow:
                "0 0 20px rgba(168,85,247,0.4), 0 0 60px rgba(168,85,247,0.15)",
            }}
          >
            <span className="flex items-center gap-2">
              ¡Sí, quiero!
              <PiHeartFill className="h-5 w-5 md:h-6 md:w-6" />
            </span>
          </button>

          {/* Botón NO – imposible de presionar */}
          <button
            ref={noBtnRef}
            onTouchStart={(e) => {
              e.preventDefault();
              handleNoEscape();
            }}
            onMouseEnter={() => handleNoEscape()}
            className="cursor-pointer rounded-full border border-white/10 px-5 py-2.5 text-sm text-white/30 transition-colors select-none"
          >
            No
          </button>
        </div>
      </div>

      {/* ── Mensaje final (oculto inicialmente) ── */}
      <div
        ref={messageRef}
        className="absolute z-20 flex flex-col items-center gap-6 px-6 text-center"
        style={{ visibility: "hidden" }}
      >
        <PiHeartFill
          className="block h-24 w-24 select-none text-purple-400 md:h-32 md:w-32"
          style={{
            filter:
              "drop-shadow(0 0 20px rgba(192,132,252,0.5)) drop-shadow(0 0 50px rgba(139,92,246,0.3))",
          }}
        />
        <h2
          className="max-w-xl font-serif text-3xl font-bold text-purple-100 sm:text-4xl md:text-5xl lg:text-6xl"
          style={{
            textShadow:
              "0 0 30px rgba(168,85,247,0.4), 0 0 60px rgba(139,92,246,0.15)",
          }}
        >
          ¡Sabía que dirías que sí!
        </h2>
        <p className="text-lg font-light text-purple-300/60 md:text-xl">
          <span className="inline-flex items-center gap-2">
            Te amitoooooo muchooo mailovsita:3
            <PiHeartFill className="inline h-5 w-5 text-purple-400" />
          </span>
        </p>
      </div>
    </section>
  );
}
