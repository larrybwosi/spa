"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { motion, useInView } from "framer-motion";
import {
  MapPin,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  Clock,
  Star,
} from "lucide-react";
import { FALLBACK_SERVICES } from "./services/services-data";
import { FALLBACK_PRODUCTS } from "./products/product-data";

const homeNavLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Philosophy", href: "#philosophy" },
  { label: "Location", href: "#location" },
];

/* ---------------------------------------------------------
   Reveal — scroll-triggered fade/lift wrapper using Framer Motion.
   Replaces the previous hand-rolled intersection observer.
--------------------------------------------------------- */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: React.ElementType;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        delay: delay / 1000,
      }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------------------------------------------------
   CountUp — animates a numeric value in once visible using Framer Motion.
--------------------------------------------------------- */
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [display, setDisplay] = useState(() =>
    value.replace(/[0-9.]/g, (c) => (c ? "0" : c)),
  );
  const match = value.match(/^([\d.]+)(.*)$/);
  const target = match && match[1] ? parseFloat(match[1]) : 0;
  const suffix = match && match[2] ? match[2] : "";
  const decimals =
    match && match[1] && match[1].includes(".")
      ? match[1].split(".")[1]?.length || 0
      : 0;

  useEffect(() => {
    if (!isInView) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      setDisplay(value);
      return;
    }

    const duration = 1400;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      setDisplay(
        `${decimals ? current.toFixed(decimals) : Math.round(current)}${suffix}`,
      );
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, target, suffix, decimals, value]);

  return <span ref={ref}>{display}</span>;
}

/* ---------------------------------------------------------
   MagneticButton — CTA subtly tracks the cursor within
   its bounds using smooth motion transitions.
--------------------------------------------------------- */
function MagneticButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setOffset({ x: x * 0.18, y: y * 0.35 });
  };

  const reset = () => setOffset({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", damping: 15, stiffness: 150, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#F1ECE1] text-[#1C1B18] overflow-x-hidden font-sans selection:bg-[#A9784F]/25">
      {/* Fonts + signature animations */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@500;600&display=swap");

        .font-display {
          font-family: "Fraunces", serif;
          font-optical-sizing: auto;
        }
        .font-body {
          font-family: "Inter", sans-serif;
        }
        .font-label {
          font-family: "Space Grotesk", sans-serif;
        }

        @keyframes breathe {
          0%,
          100% {
            transform: scale(0.94);
            opacity: 0.55;
          }
          50% {
            transform: scale(1.08);
            opacity: 0.9;
          }
        }
        .breathing-glow {
          animation: breathe 5.2s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }
        @keyframes pulse-dot {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.6);
            opacity: 0.4;
          }
        }
        .pulse-dot {
          animation: pulse-dot 2.6s ease-in-out infinite;
        }

        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .marquee-track {
          animation: marquee 32s linear infinite;
        }

        .ken-burns {
          transition:
            transform 1.8s cubic-bezier(0.25, 0.1, 0.25, 1),
            filter 1.8s ease;
        }
        .group:hover .ken-burns {
          transform: scale(1.12) translate(-1%, -1%);
        }

        @media (prefers-reduced-motion: reduce) {
          .breathing-glow,
          .pulse-dot,
          .marquee-track,
          .ken-burns {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <Navbar navLinks={homeNavLinks} />

      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#1C1B18]">
        {/* Breathing glow — signature element */}
        <div
          aria-hidden
          className="breathing-glow absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(169,120,79,0.35) 0%, rgba(63,79,65,0.18) 45%, transparent 72%)",
          }}
        />

        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://cdn.sanity.io/images/ce88cj7n/production/bb6ab9270d7c090fced607191007b12fd711e96d-1456x816.png?f=webpq=80"
            alt="Still thermal pool at dusk"
            className="w-full h-full object-cover object-center opacity-[0.38] mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1C1B18]/40 via-[#1C1B18]/55 to-[#1C1B18]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="flex items-center justify-center gap-2.5 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#A9784F] pulse-dot" />
            <span className="text-[11px] font-label tracking-[0.35em] text-[#DCD3C2]/80 uppercase">
              Est. 2026 &mdash; Beverly Hills
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
            className="font-display text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-tight text-[#F1ECE1] mb-8"
          >
            Sit still.
            <br />
            <span className="italic font-normal text-[#A9784F]">
              Let the hour work.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            className="font-body text-base sm:text-lg text-[#DCD3C2]/75 max-w-xl mx-auto leading-relaxed mb-12 font-light font-body"
          >
            Aura is a sanctuary built around one idea: that rest, done properly,
            is a craft. Every ritual is timed, sourced, and held by hand.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.85 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <MagneticButton>
              <Button
                asChild
                className="w-full sm:w-auto text-xs font-label uppercase tracking-[0.2em] px-10 py-6 bg-[#A9784F] hover:bg-[#93673F] border-none text-[#1C1B18] font-semibold rounded-none transition-colors duration-300"
              >
                <Link href="/booking">Reserve a Ritual</Link>
              </Button>
            </MagneticButton>
            <Link
              href="/services"
              className="w-full sm:w-auto text-xs font-label uppercase tracking-[0.2em] px-10 py-4 border border-[#DCD3C2]/30 text-[#F1ECE1] hover:border-[#DCD3C2]/70 hover:bg-[#F1ECE1]/5 transition-all duration-300 rounded-none inline-flex items-center justify-center gap-2 font-body"
            >
              <span>View Treatments</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <span className="text-[10px] font-label tracking-[0.3em] text-[#DCD3C2]/50 uppercase">
            Scroll
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-[#DCD3C2]/60 to-transparent" />
        </div>
      </section>

      {/* TRUST STRIP — quiet authority signal between hero and menu */}
      <section className="bg-[#1C1B18] border-t border-[#DCD3C2]/10 py-6 overflow-hidden">
        <div className="relative flex whitespace-nowrap">
          <div className="marquee-track flex items-center gap-16 pr-16">
            {[...Array(2)].map((_, dup) => (
              <React.Fragment key={dup}>
                {[
                  "Condé Nast Traveler",
                  "Robb Report",
                  "Los Angeles Times",
                  "Departures",
                  "Well+Good",
                  "Architectural Digest",
                ].map((name) => (
                  <span
                    key={`${dup}-${name}`}
                    className="text-[13px] font-display italic text-[#DCD3C2]/40 tracking-wide"
                  >
                    {name}
                  </span>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED SERVICES */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#F1ECE1]">
        <div className="max-w-7xl mx-auto">
          <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16 max-w-5xl">
            <div>
              <span className="text-[11px] font-label tracking-[0.3em] text-[#A9784F] uppercase font-semibold block mb-4">
                The Menu
              </span>
              <h2 className="font-display text-4xl sm:text-5xl text-[#1C1B18] leading-tight">
                Three rituals,
                <br />
                <span className="italic text-[#3F4F41]">chosen for you</span>
              </h2>
            </div>
            <p className="text-sm text-[#1C1B18]/60 font-body font-light leading-relaxed max-w-sm font-body">
              A short list, deliberately. Everything on our menu is something
              we'd recommend to a friend without hesitation.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1C1B18]/10">
            {FALLBACK_SERVICES.slice(0, 3).map((service, idx) => (
              <Reveal key={service.id} delay={idx * 120}>
                <Link
                  href={`/services/${service.id}`}
                  className="group flex flex-col bg-[#F1ECE1] hover:bg-white transition-colors duration-300 h-full"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={service.image}
                      alt={service.name}
                      className="ken-burns absolute inset-0 w-full h-full object-cover object-center grayscale-[0.3] group-hover:grayscale-0"
                    />
                    <span className="absolute top-5 left-5 font-display italic text-3xl text-white drop-shadow-md">
                      0{idx + 1}
                    </span>
                  </div>

                  <div className="flex flex-col flex-1 p-7 space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-label tracking-[0.2em] uppercase font-semibold text-[#3F4F41]">
                        {service.category}
                      </span>
                      <span className="text-xs font-body text-[#1C1B18]/45 flex items-center gap-1.5 font-body">
                        <Clock className="h-3 w-3" />
                        {service.duration} min
                      </span>
                    </div>

                    <h3 className="font-display text-2xl text-[#1C1B18] leading-tight">
                      {service.name}
                    </h3>

                    <p className="text-sm text-[#1C1B18]/60 font-body font-light leading-relaxed flex-1 line-clamp-2 font-body">
                      {service.description}
                    </p>

                    <div className="pt-5 border-t border-[#1C1B18]/10 flex items-center justify-between">
                      <span className="font-display text-lg text-[#1C1B18]">
                        Ksh {service.price}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] font-label uppercase tracking-[0.15em] font-semibold text-[#A9784F]">
                        <span>Details</span>
                        <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200} className="text-center mt-16">
            <Button
              asChild
              variant="outline"
              className="rounded-none h-12 px-10 uppercase tracking-[0.2em] font-label font-semibold text-xs border-[#1C1B18]/20 hover:bg-[#1C1B18] hover:text-[#F1ECE1] transition-all duration-300 animate-none"
            >
              <Link href="/services">View Full Menu</Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section
        id="philosophy"
        className="py-24 sm:py-32 bg-[#1C1B18] px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <Reveal className="lg:col-span-5 relative aspect-[3/4] overflow-hidden h-[480px] sm:h-[600px] w-full order-2 lg:order-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000"
              alt="Sanctuary reception, warm low light"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 border border-[#DCD3C2]/10" />
          </Reveal>

          <div className="lg:col-span-7 flex flex-col justify-center space-y-10 order-1 lg:order-2">
            <Reveal className="space-y-5">
              <span className="text-[11px] font-label tracking-[0.3em] text-[#A9784F] uppercase font-semibold block">
                Our Philosophy
              </span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#F1ECE1] leading-[1.05]">
                The art of doing
                <br />
                <span className="italic text-[#DCD3C2]/80">almost nothing</span>
              </h2>
            </Reveal>

            <Reveal
              delay={120}
              className="space-y-6 text-base text-[#DCD3C2]/65 font-body font-light leading-relaxed max-w-xl font-body"
            >
              <p>
                We believe true health begins with uncompromised stillness. Our
                sanctuary is built to filter out the noise of modern life
                &mdash; where silence is treated as a material, and rest as a
                craft.
              </p>
              <p className="italic font-display text-[#A9784F] text-xl leading-snug border-l border-[#A9784F]/40 pl-6 my-8 not-italic">
                &ldquo;Our therapies are grounded in time-honored rituals. Every
                second at Aura is held with you at the center.&rdquo;
              </p>
              <p>
                Every ingredient is globally certified organic. Every therapist
                is a licensed master of their craft. Nothing here is incidental.
              </p>
            </Reveal>

            <Reveal
              delay={240}
              className="pt-8 border-t border-[#DCD3C2]/15 flex flex-wrap items-center gap-12 sm:gap-16"
            >
              {[
                { value: "15+", label: "Years of Practice" },
                { value: "100%", label: "Organic & Botanical" },
                { value: "25k+", label: "Guests Restored" },
              ].map((stat) => (
                <div key={stat.label}>
                  <span className="block font-display text-4xl sm:text-5xl text-[#A9784F] mb-1.5">
                    <CountUp value={stat.value} />
                  </span>
                  <span className="block text-[10px] font-label tracking-[0.15em] text-[#DCD3C2]/50 font-semibold uppercase">
                    {stat.label}
                  </span>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#F1ECE1]">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-label tracking-[0.3em] text-[#A9784F] uppercase font-semibold block mb-4">
              The Apothecary
            </span>
            <h2 className="font-display text-4xl sm:text-5xl text-[#1C1B18] leading-tight mb-5">
              Bring the sanctuary home
            </h2>
            <p className="text-sm text-[#1C1B18]/60 font-body font-light leading-relaxed font-body">
              Formulations we use in treatment rooms, bottled for daily ritual.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {FALLBACK_PRODUCTS.slice(3, 6).map((product, idx) => (
              <Reveal
                key={product.id}
                delay={idx * 120}
                className="group flex flex-col bg-white border border-[#1C1B18]/10 overflow-hidden hover:border-[#A9784F]/40 hover:shadow-[0_20px_40px_-20px_rgba(28,27,24,0.15)] transition-all duration-500 h-full"
              >
                <Link
                  href={`/products/${product.slug}`}
                  className="relative aspect-square w-full bg-[#DCD3C2]/20 overflow-hidden block"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="ken-burns h-full w-full object-cover object-center"
                  />
                  <div className="absolute top-4 left-4 bg-[#1C1B18]/90 backdrop-blur-xs px-3 py-1.5 text-[9px] font-label font-semibold uppercase tracking-widest text-[#F1ECE1]">
                    {product.category}
                  </div>
                </Link>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex items-center text-[#A9784F]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(product.rating)
                              ? "fill-[#A9784F]"
                              : "text-[#1C1B18]/15"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-body text-[#1C1B18]/45 font-medium font-body">
                      ({product.reviewsCount})
                    </span>
                  </div>

                  <Link
                    href={`/products/${product.slug}`}
                    className="block flex-1"
                  >
                    <h3 className="font-display text-xl text-[#1C1B18] line-clamp-1 mb-2 group-hover:text-[#A9784F] transition-colors duration-300">
                      {product.name}
                    </h3>
                    <p className="text-sm text-[#1C1B18]/55 font-body font-light line-clamp-2 leading-relaxed mb-5 font-body">
                      {product.description}
                    </p>
                  </Link>

                  <div className="pt-5 border-t border-[#1C1B18]/10 flex items-center justify-between mt-auto">
                    <span className="font-display text-lg text-[#1C1B18]">
                      Ksh {product.price.toFixed(2)}
                    </span>
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-[10px] font-label uppercase tracking-widest text-[#A9784F] font-semibold hover:text-[#93673F] flex items-center gap-1 group/btn"
                    >
                      <span>Details</span>
                      <ChevronRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200} className="text-center mt-16">
            <Button
              asChild
              variant="outline"
              className="rounded-none h-12 px-10 uppercase tracking-[0.2em] font-label font-semibold text-xs border-[#1C1B18]/20 hover:bg-[#1C1B18] hover:text-[#F1ECE1] transition-all duration-300 animate-none"
            >
              <Link href="/products">Explore the Collection</Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#3F4F41]">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-label tracking-[0.3em] text-[#DCD3C2] uppercase font-semibold block mb-4">
              Reflections
            </span>
            <h2 className="font-display text-4xl sm:text-5xl text-[#F1ECE1] leading-tight">
              What guests carry with them
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#F1ECE1]/10">
            {[
              {
                quote:
                  "Aura is an absolute sanctuary. The Signature Swedish treatment completely melted away months of tension. Every detail is crafted with intention.",
                name: "Alex Mercer",
                initials: "AM",
              },
              {
                quote:
                  "Their custom Bloom Rose Oil is a small miracle. It hydrates deeply and restored my skin without ever feeling heavy. Pure, organic, considered.",
                name: "Sophia Laurent",
                initials: "SL",
              },
              {
                quote:
                  "The therapists are remarkable, and the location filters out the city entirely. The post-ritual herbal infusions are the quiet final touch.",
                name: "Julian Drake",
                initials: "JD",
              },
            ].map((t, idx) => (
              <Reveal
                key={t.name}
                delay={idx * 120}
                className="bg-[#3F4F41] p-9 flex flex-col justify-between h-full transition-colors duration-300 hover:bg-[#465A48]"
              >
                <div>
                  <div className="flex items-center text-[#A9784F] mb-5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-[#A9784F]" />
                    ))}
                  </div>
                  <p className="text-sm text-[#DCD3C2]/85 font-body font-light leading-relaxed italic mb-8 font-body">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="border-t border-[#DCD3C2]/15 pt-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#A9784F]/20 flex items-center justify-center font-display text-[#A9784F] font-semibold">
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="font-display text-sm text-[#F1ECE1]">
                      {t.name}
                    </h4>
                    <span className="text-[10px] font-label tracking-wider uppercase text-[#DCD3C2]/50 font-semibold">
                      Verified Guest
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section
        id="location"
        className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[#F1ECE1]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-5 space-y-8 order-2 lg:order-1">
            <Reveal className="space-y-4">
              <span className="text-[11px] font-label tracking-[0.3em] text-[#A9784F] uppercase font-semibold block">
                Find Us
              </span>
              <h2 className="font-display text-4xl sm:text-5xl text-[#1C1B18] leading-tight">
                Visit the Sanctuary
              </h2>
              <p className="text-sm sm:text-base text-[#1C1B18]/60 font-body font-light leading-relaxed pt-2 max-w-md font-body">
                Set inside the quiet corridors of the Wellness District, away
                from the pace of the city. Begin your retreat with us.
              </p>
            </Reveal>

            <Reveal
              delay={120}
              className="flex items-start gap-4 p-6 bg-white border border-[#1C1B18]/10 max-w-md"
            >
              <div className="w-11 h-11 rounded-full bg-[#3F4F41]/10 flex items-center justify-center text-[#3F4F41] shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display text-lg text-[#1C1B18]">
                  Aura Wellness Sanctuary
                </h4>
                <p className="text-xs sm:text-sm text-[#1C1B18]/60 font-body font-light font-body">
                  123 Serene Lane, Wellness District, Beverly Hills, CA 90210
                </p>
                <span className="inline-block text-[10px] text-[#A9784F] uppercase font-label font-semibold tracking-wider pt-1">
                  Complimentary valet parking
                </span>
              </div>
            </Reveal>

            <Reveal delay={220}>
              <Button
                onClick={() => window.open("https://maps.google.com", "_blank")}
                className="flex items-center gap-2.5 text-xs font-label uppercase tracking-[0.2em] bg-[#1C1B18] text-[#F1ECE1] hover:bg-[#1C1B18]/85 px-8 py-5 rounded-none transition-colors cursor-pointer animate-none"
              >
                <span>Get Directions</span>
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Reveal>
          </div>

          <Reveal
            delay={100}
            className="lg:col-span-7 relative aspect-[4/3] overflow-hidden h-[320px] sm:h-[480px] w-full order-1 lg:order-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=1000"
              alt="Sanctuary treatment room detail"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
