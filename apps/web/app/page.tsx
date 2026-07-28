"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Card } from "@repo/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@repo/ui/dialog";
import {
  MapPin,
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  Sparkles,
  Compass,
  CheckCircle,
  Calendar,
  Lock,
  Mail,
  User as UserIcon,
  ShieldCheck,
  ChevronRight,
  PhoneCall,
  Clock
} from "lucide-react";

const InstagramIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

export default function Home() {
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Newsletter state
  const [email, setEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Booking modal state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingName, setBookingName] = useState("");
  const [bookingService, setBookingService] = useState("Therapeutic Massage");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  // Authentication & API Integration states
  const [user, setUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [services, setServices] = useState<any[]>([]);

  // Fetch session on load
  useEffect(() => {
    fetch("http://localhost:3001/api/auth/session", { credentials: "include" })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("No session");
      })
      .then((data) => {
        setUser(data.user);
        if (data.user) {
          setBookingName(data.user.name);
        }
      })
      .catch(() => setUser(null));

    // Fetch services
    fetch("http://localhost:3001/api/services")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch");
      })
      .then((data) => setServices(data))
      .catch((e) => console.error("Could not fetch services, using fallback.", e));
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setNewsletterSubmitted(true);
      setTimeout(() => {
        setEmail("");
      }, 3000);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const url = authMode === "login"
      ? "http://localhost:3001/api/auth/signin"
      : "http://localhost:3001/api/auth/signup";

    const payload = authMode === "login"
      ? { email: authEmail, password: authPassword }
      : { name: authName, email: authEmail, password: authPassword, role: "CLIENT" };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Authentication failed");
      }

      const data = await res.json();

      if (authMode === "login") {
        setUser(data.user);
        setBookingName(data.user.name);
        setIsAuthModalOpen(false);
        setAuthEmail("");
        setAuthPassword("");
      } else {
        setAuthMode("login");
        setAuthPassword("");
        alert("Registration successful! Please sign in with your credentials.");
      }
    } catch (err: any) {
      setAuthError(err.message || "An error occurred");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3001/api/auth/signout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error(e);
    }
    setUser(null);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setIsBookingOpen(false);
      setAuthMode("login");
      setIsAuthModalOpen(true);
      return;
    }

    let targetServiceId = bookingService;
    if (!targetServiceId.startsWith("s")) {
      if (bookingService === "Therapeutic Massage") targetServiceId = "s1";
      else if (bookingService === "Rejuvenating Facial") targetServiceId = "s4";
      else if (bookingService === "Wellness Consultation") targetServiceId = "s3";
      else targetServiceId = "s1";
    }

    try {
      const res = await fetch("http://localhost:3001/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: targetServiceId,
          staffId: "staff1", // Default Elena Rostova
          dateTime: new Date(bookingDate).toISOString(),
        }),
        credentials: "include",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to submit booking");
      }

      setBookingSubmitted(true);
      setTimeout(() => {
        setBookingSubmitted(false);
        setIsBookingOpen(false);
        setBookingDate("");
      }, 3000);
    } catch (err: any) {
      alert(err.message || "An error occurred while booking");
    }
  };

  return (
    <div className="relative min-h-screen bg-brand-cream text-brand-charcoal overflow-x-hidden font-sans selection:bg-brand-primary/20">

      {/* HEADER / NAVIGATION */}
      <header className="sticky top-0 z-40 bg-brand-cream/80 backdrop-blur-md border-b border-brand-border/60 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <span className="font-serif text-xl sm:text-2xl tracking-[0.25em] text-brand-primary group-hover:text-brand-primary-hover transition-colors font-semibold">
              AURA WELLNESS
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-xs tracking-[0.2em] font-medium uppercase text-brand-charcoal/80">
            <a href="#about" className="hover:text-brand-primary transition-colors py-2 relative group">
              About
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </a>
            <a href="#services" className="hover:text-brand-primary transition-colors py-2 relative group">
              Services
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </a>
            <a href="#philosophy" className="hover:text-brand-primary transition-colors py-2 relative group">
              Philosophy
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </a>
            <a href="#location" className="hover:text-brand-primary transition-colors py-2 relative group">
              Location
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </a>
          </nav>

          {/* Book Now CTA / Auth */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4 border-r pr-6 border-brand-border/60">
                <span className="text-[10px] uppercase tracking-widest font-sans text-brand-charcoal/70 font-semibold bg-brand-card-cream/50 px-3 py-1.5 rounded-full border border-brand-border">
                  Hello, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-[10px] uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors font-sans font-bold cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthMode("login");
                  setIsAuthModalOpen(true);
                }}
                className="text-xs uppercase tracking-widest font-sans font-bold hover:text-brand-primary transition-colors text-brand-charcoal/85 cursor-pointer"
              >
                Sign In
              </button>
            )}

            <Button
              onClick={() => setIsBookingOpen(true)}
              variant="default"
              className="text-xs uppercase tracking-[0.15em] bg-brand-primary text-white border border-brand-primary px-7 py-5 hover:bg-brand-primary-hover shadow-md hover:shadow-lg transition-all duration-300 rounded-full font-medium"
            >
              Book Now
            </Button>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-brand-charcoal hover:text-brand-primary transition-colors rounded-full hover:bg-brand-card-cream/40"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU DRAWER */}
      <div
        className={`fixed inset-0 z-30 bg-brand-cream/98 transition-all duration-500 ease-in-out transform lg:hidden ${
          isMobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
        } pt-24 px-6 sm:px-12`}
      >
        <nav className="flex flex-col space-y-5 text-lg tracking-[0.15em] font-serif text-brand-charcoal">
          <a
            href="#about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-brand-primary transition-colors py-3 border-b border-brand-border/40 flex justify-between items-center group"
          >
            <span>About</span>
            <ChevronRight className="h-4 w-4 text-brand-primary opacity-0 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
          </a>
          <a
            href="#services"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-brand-primary transition-colors py-3 border-b border-brand-border/40 flex justify-between items-center group"
          >
            <span>Services</span>
            <ChevronRight className="h-4 w-4 text-brand-primary opacity-0 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
          </a>
          <a
            href="#philosophy"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-brand-primary transition-colors py-3 border-b border-brand-border/40 flex justify-between items-center group"
          >
            <span>Philosophy</span>
            <ChevronRight className="h-4 w-4 text-brand-primary opacity-0 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
          </a>
          <a
            href="#location"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-brand-primary transition-colors py-3 border-b border-brand-border/40 flex justify-between items-center group"
          >
            <span>Location</span>
            <ChevronRight className="h-4 w-4 text-brand-primary opacity-0 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
          </a>

          {user ? (
            <div className="py-4 border-b border-brand-border/40 flex items-center justify-between font-sans">
              <span className="text-sm font-medium text-brand-charcoal/80 bg-brand-card-cream/50 px-3 py-1 rounded-full border border-brand-border">
                Hello, {user.name}
              </span>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="text-xs uppercase tracking-widest text-red-500 font-bold"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setAuthMode("login");
                setIsAuthModalOpen(true);
              }}
              className="hover:text-brand-primary text-left font-serif transition-colors py-4 border-b border-brand-border/40 text-lg flex justify-between items-center"
            >
              <span>Sign In</span>
              <ChevronRight className="h-4 w-4 text-brand-primary" />
            </button>
          )}

          <div className="pt-8">
            <Button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsBookingOpen(true);
              }}
              className="w-full text-xs uppercase tracking-[0.2em] bg-brand-primary text-white py-6 rounded-full hover:bg-brand-primary-hover shadow-md"
            >
              Book Now
            </Button>
          </div>
        </nav>
      </div>

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] md:min-h-[85vh] lg:min-h-screen flex items-center justify-center pt-24 pb-28 md:py-0 px-4 sm:px-6 lg:px-8 overflow-hidden">

        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=2070"
            alt="Luxury Spa thermal pool background"
            className="w-full h-full object-cover object-center brightness-50 scale-105 animate-subtle-zoom"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px]"></div>
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-brand-cream via-brand-cream/80 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center text-white px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md mb-6 sm:mb-8 animate-fade-in shadow-inner">
            <Sparkles className="h-3.5 w-3.5 text-brand-sage animate-pulse" />
            <span className="text-[10px] sm:text-xs tracking-[0.3em] font-sans text-brand-cream/90 uppercase font-semibold">
              BESPOKE RITUALS & SERENITY
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-none font-serif tracking-normal mb-8 max-w-4xl mx-auto font-extralight text-brand-cream drop-shadow-sm animate-fade-in-up">
            Sanctuary of <br/>
            <span className="font-serif italic font-normal text-brand-sage">Quiet Luxury</span>
          </h1>

          <div className="flex flex-wrap justify-center gap-3 mb-10 max-w-xl mx-auto">
            <span className="px-4 py-2 rounded-full border border-white/15 bg-black/20 backdrop-blur-md text-[10px] tracking-[0.15em] uppercase font-medium text-brand-cream flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="h-3 w-3 text-brand-sage" />
              Easy Now
            </span>
            <span className="px-4 py-2 rounded-full border border-white/15 bg-black/20 backdrop-blur-md text-[10px] tracking-[0.15em] uppercase font-medium text-brand-cream flex items-center gap-1.5 shadow-sm">
              <PhoneCall className="h-3 w-3 text-brand-sage" />
              Call via web
            </span>
            <span className="px-4 py-2 rounded-full border border-white/15 bg-black/20 backdrop-blur-md text-[10px] tracking-[0.15em] uppercase font-medium text-brand-cream flex items-center gap-1.5 shadow-sm">
              <Clock className="h-3 w-3 text-brand-sage" />
              Instant Booking
            </span>
          </div>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-brand-cream/90 max-w-2xl mx-auto font-sans font-light leading-relaxed mb-12 tracking-wide">
            Escape the noise. Immerse yourself in a beautifully crafted wellness experience tailored intentionally to harmonize your body, mind, and spirit.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto sm:max-w-none">
            <Button
              onClick={() => setIsBookingOpen(true)}
              className="w-full sm:w-auto text-xs uppercase tracking-[0.2em] px-10 py-6 bg-brand-primary hover:bg-brand-primary-hover border border-brand-primary text-white shadow-lg transition-transform hover:scale-[1.03] duration-300 rounded-full font-medium"
            >
              Book a Session
            </Button>
            <a
              href="#services"
              className="w-full sm:w-auto text-xs uppercase tracking-[0.2em] px-10 py-3.5 border border-white/35 bg-white/5 hover:bg-white/10 text-white transition-all rounded-full font-medium inline-flex items-center justify-center gap-2 hover:border-white/60"
            >
              <span>Explore Treatments</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* CURATED TREATMENTS SECTION */}
      <section id="services" className="py-20 sm:py-28 md:py-36 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <span className="text-xs tracking-[0.25em] font-sans text-brand-primary uppercase block mb-4 font-bold">
            SERVICES & EXPERIENCES
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-brand-charcoal mb-6 font-normal tracking-wide">
            Curated Treatments
          </h2>
          <div className="w-16 h-[1.5px] bg-brand-primary/40 mx-auto mb-6"></div>
          <p className="text-sm sm:text-base text-brand-charcoal/70 leading-relaxed font-sans font-light max-w-xl mx-auto">
            Discover our meticulously prepared range of holistic therapies, each crafted by our master practitioners to elevate your wellness journey.
          </p>
        </div>

        {/* Dynamic Card Grid - Fully Responsive & Premium Visuals */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-stretch">

          {/* Card 1: Massage image (Top-Left) */}
          <div className="lg:col-span-7 group relative rounded-[2rem] overflow-hidden min-h-[380px] md:min-h-[460px] shadow-md flex flex-col justify-end p-8 sm:p-10 transition-all duration-500 hover:shadow-xl hover:scale-[1.01]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=1000"
              alt="Therapeutic Massage"
              className="absolute inset-0 w-full h-full object-cover brightness-60 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>

            <div className="relative z-10 text-white max-w-lg">
              <span className="inline-block px-4 py-1.5 bg-brand-primary/80 border border-brand-primary/20 rounded-full text-[10px] tracking-[0.2em] uppercase font-bold mb-4 shadow-sm">
                Signature Treatment
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif mb-3 text-white leading-tight">
                Therapeutic Massage
              </h3>
              <p className="text-xs sm:text-sm text-brand-cream/80 font-sans font-light leading-relaxed mb-6">
                Release deep muscular tension, soothe stress, and restore physical equilibrium with custom blended essential oils and signature deep tissue or Swedish techniques.
              </p>
              <div className="flex items-center gap-4 text-xs font-medium tracking-widest uppercase text-brand-sage">
                <span>60/90 Mins</span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-sage/50"></span>
                <span>From $120</span>
              </div>
            </div>

            <button
              onClick={() => {
                setBookingService("Therapeutic Massage");
                setIsBookingOpen(true);
              }}
              className="absolute bottom-8 right-8 w-14 h-14 rounded-full bg-white text-brand-charcoal flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all duration-300 shadow-lg group-hover:translate-x-1 cursor-pointer"
              aria-label="Book Therapeutic Massage"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          {/* Card 2: Rejuvenating Facial Cream Card (Top-Right) */}
          <Card className="lg:col-span-5 bg-brand-card-cream border border-brand-border/60 p-8 sm:p-10 flex flex-col justify-between rounded-[2rem] shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.01]">
            <div className="flex flex-col gap-8">
              <div className="w-14 h-14 rounded-full bg-white border border-brand-border/80 flex items-center justify-center text-brand-primary shadow-sm shrink-0">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="space-y-4">
                <span className="text-[10px] tracking-[0.25em] font-sans text-brand-primary uppercase font-bold">
                  SKIN THERAPY
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-brand-charcoal tracking-wide leading-tight">
                  Rejuvenating Facial
                </h3>
                <p className="text-xs sm:text-sm text-brand-charcoal/70 leading-relaxed font-sans font-light max-w-sm">
                  Organic, cold-pressed nutrient-rich botanicals applied with expert facial massage flow to lift, clarify, and unveil your inner natural radiance.
                </p>
              </div>
            </div>

            <div className="pt-10 flex items-center justify-between border-t border-brand-border/50 mt-8">
              <div className="text-xs text-brand-charcoal/60 font-medium tracking-wider uppercase">
                60 Mins · $145
              </div>
              <button
                onClick={() => {
                  setBookingService("Rejuvenating Facial");
                  setIsBookingOpen(true);
                }}
                className="flex items-center gap-2 text-xs tracking-widest uppercase font-bold text-brand-primary hover:text-brand-primary-hover group cursor-pointer"
              >
                <span>Book Now</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </Card>

          {/* Card 3: Wellness Consultation Sage Green Card (Bottom-Left) */}
          <Card className="lg:col-span-5 bg-brand-sage border-transparent p-8 sm:p-10 flex flex-col justify-between text-brand-sage-dark rounded-[2rem] shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.01]">
            <div className="space-y-8">
              <div className="w-14 h-14 rounded-full bg-[#e8ecd9] flex items-center justify-center text-brand-sage-dark shadow-xs shrink-0">
                <Compass className="h-6 w-6" />
              </div>
              <div className="space-y-4">
                <span className="text-[10px] tracking-[0.25em] uppercase font-bold opacity-80">
                  HOLISTIC LIVING
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-brand-sage-dark tracking-wide leading-tight">
                  Wellness Consultation
                </h3>
                <p className="text-xs sm:text-sm text-brand-sage-dark/85 leading-relaxed font-sans font-light max-w-sm">
                  Receive an exhaustive, individual holistic assessment with nutrition and mindfulness planning designed to bring harmony into your fast-paced daily schedule.
                </p>
              </div>
            </div>

            <div className="pt-10 flex items-center justify-between border-t border-[#cad2af]/60 mt-8">
              <div className="text-xs text-brand-sage-dark/80 font-medium tracking-wider uppercase">
                45 Mins · $95
              </div>
              <button
                onClick={() => {
                  setBookingService("Wellness Consultation");
                  setIsBookingOpen(true);
                }}
                className="flex items-center gap-2 text-xs tracking-widest uppercase font-bold text-brand-sage-dark hover:opacity-80 group cursor-pointer"
              >
                <span>Learn Details</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </Card>

          {/* Card 4: Image of Bath Products/Bottles (Bottom-Right) */}
          <div className="lg:col-span-7 group relative rounded-[2rem] overflow-hidden min-h-[300px] md:min-h-[460px] shadow-md flex flex-col justify-end p-8 transition-all duration-500 hover:shadow-xl hover:scale-[1.01]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=1000"
              alt="Aura Luxury Skin Care Products"
              className="absolute inset-0 w-full h-full object-cover brightness-95 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/15 group-hover:bg-black/10 transition-colors"></div>

            {/* Subtle glassmorphism label */}
            <div className="absolute top-6 right-6 px-5 py-2.5 bg-white/80 backdrop-blur-md border border-white/20 rounded-full text-[10px] tracking-[0.2em] text-brand-charcoal uppercase font-bold shadow-sm">
              Aura Skin Range
            </div>
          </div>

        </div>
      </section>

      {/* OUR PHILOSOPHY SECTION */}
      <section id="philosophy" className="py-20 sm:py-28 md:py-36 bg-brand-card-cream/50 border-y border-brand-border/60 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

          {/* Left Column: Elegant Vertical Image */}
          <div className="lg:col-span-5 relative aspect-3/4 rounded-[2rem] overflow-hidden shadow-md h-[450px] sm:h-[550px] lg:h-[650px] w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000"
              alt="Luxury Spa reception"
              className="absolute inset-0 w-full h-full object-cover object-center scale-102 hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-brand-charcoal/5"></div>
          </div>

          {/* Right Column: Text & Stats */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8 lg:pr-6">
            <div className="space-y-4">
              <span className="text-xs tracking-[0.25em] font-sans text-brand-primary uppercase font-bold block">
                OUR PHILOSOPHY
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-brand-charcoal leading-tight font-normal tracking-wide">
                Art of Healing
              </h2>
              <div className="w-16 h-[1.5px] bg-brand-primary/40 mt-4"></div>
            </div>

            <div className="space-y-6 text-sm sm:text-base text-brand-charcoal/70 font-sans font-light leading-relaxed max-w-2xl">
              <p>
                At Aura Wellness, we hold that true health stems from profound, uncompromised inner peace. Our sanctuaries are meticulously sculpted to filter out the noise of modern life, offering an atmosphere where silence is celebrated and rejuvenation is treated as an art.
              </p>
              <p className="italic font-serif text-brand-primary text-base sm:text-lg pl-4 border-l-2 border-brand-primary/40 my-6">
                "Our touch is intentional. Our therapies are grounded in time-honored rituals. Every second at Aura is curated with you at the center."
              </p>
              <p>
                We source only the finest globally certified organic ingredients and partner exclusively with licensed practitioners who are absolute masters of their crafts, ensuring that every touch is intentional and every ritual is deeply transformative.
              </p>
            </div>

            {/* Statistics */}
            <div className="pt-8 border-t border-brand-border/60 flex flex-wrap items-center gap-10 sm:gap-16">
              <div>
                <span className="block text-4xl sm:text-5xl font-serif text-brand-primary mb-1 font-semibold">
                  15<span className="text-2xl sm:text-3xl font-light text-brand-primary/75">+</span>
                </span>
                <span className="block text-[10px] sm:text-xs tracking-[0.15em] text-brand-charcoal/60 font-bold uppercase">
                  Years of Sanctuary
                </span>
              </div>
              <div>
                <span className="block text-4xl sm:text-5xl font-serif text-brand-primary mb-1 font-semibold">
                  100%
                </span>
                <span className="block text-[10px] sm:text-xs tracking-[0.15em] text-brand-charcoal/60 font-bold uppercase">
                  Organic & Botanical
                </span>
              </div>
              <div>
                <span className="block text-4xl sm:text-5xl font-serif text-brand-primary mb-1 font-semibold">
                  25k<span className="text-2xl sm:text-3xl font-light text-brand-primary/75">+</span>
                </span>
                <span className="block text-[10px] sm:text-xs tracking-[0.15em] text-brand-charcoal/60 font-bold uppercase">
                  Restored Spirits
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* LOCATION & SANCTUARY SECTION */}
      <section id="location" className="py-20 sm:py-28 md:py-36 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

          {/* Left Column: Location Details */}
          <div className="lg:col-span-5 space-y-8 order-2 lg:order-1">
            <div className="space-y-4">
              <span className="text-xs tracking-[0.25em] font-sans text-brand-primary uppercase font-bold block">
                LOCATION
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-brand-charcoal leading-tight font-normal tracking-wide">
                Visit Our Sanctuary
              </h2>
              <div className="w-16 h-[1.5px] bg-brand-primary/40 mt-4"></div>
              <p className="text-sm sm:text-base text-brand-charcoal/70 font-sans font-light leading-relaxed pt-2">
                Situated inside the quiet corridors of the Wellness District, our sanctuary acts as an escape from the metropolis. Begin your retreat with us.
              </p>
            </div>

            {/* Address box */}
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-brand-card-cream/50 border border-brand-border/60 max-w-md shadow-xs">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-brand-primary shrink-0 shadow-sm">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-lg text-brand-charcoal font-medium">Aura Wellness Sanctuary</h4>
                <p className="text-xs sm:text-sm text-brand-charcoal/70 font-sans font-light">
                  123 Serene Lane, Wellness District, Beverly Hills, CA 90210
                </p>
                <span className="inline-block text-[10px] text-brand-primary uppercase font-bold tracking-wider pt-1">
                  Complimentary valet parking included
                </span>
              </div>
            </div>

            {/* Directions Button */}
            <div>
              <Button
                onClick={() => window.open("https://maps.google.com", "_blank")}
                className="flex items-center gap-2.5 text-xs uppercase tracking-[0.2em] bg-brand-primary text-white border border-brand-primary hover:bg-brand-primary-hover px-8 py-5 rounded-full transition-transform hover:scale-[1.02] shadow-md"
              >
                <span>Get Directions</span>
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right Column: Monochrome/Muted Spa Setup Image */}
          <div className="lg:col-span-7 relative aspect-4/3 rounded-[2rem] overflow-hidden shadow-md h-[300px] sm:h-[450px] w-full order-1 lg:order-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=1000"
              alt="Grayscale aesthetic spa product setup"
              className="absolute inset-0 w-full h-full object-cover object-center grayscale contrast-105 scale-102 hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-brand-card-cream/60 border-t border-brand-border/60 pt-20 sm:pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">

            {/* Brand column */}
            <div className="lg:col-span-4 space-y-6">
              <span className="font-serif text-2xl tracking-[0.2em] text-brand-primary block font-semibold">
                AURA WELLNESS
              </span>
              <p className="text-xs sm:text-sm text-brand-charcoal/70 font-sans font-light leading-relaxed max-w-sm">
                Elevating human consciousness and state of physical being through highly mindful organic therapies and quiet luxury care.
              </p>
              {/* Social icons */}
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full border border-brand-border/80 flex items-center justify-center text-brand-charcoal/65 hover:text-brand-primary hover:border-brand-primary transition-all shadow-xs bg-white"
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full border border-brand-border/80 flex items-center justify-center text-brand-charcoal/65 hover:text-brand-primary hover:border-brand-primary transition-all shadow-xs bg-white"
                  aria-label="Facebook"
                >
                  <FacebookIcon />
                </a>
              </div>
            </div>

            {/* Explore column */}
            <div className="lg:col-span-2 space-y-5">
              <h4 className="text-[10px] tracking-[0.25em] font-sans font-bold uppercase text-brand-charcoal/50">
                EXPLORE
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm font-sans text-brand-charcoal/75">
                <li>
                  <a href="#about" className="hover:text-brand-primary transition-colors">About Us</a>
                </li>
                <li>
                  <a href="#services" className="hover:text-brand-primary transition-colors">Treatments</a>
                </li>
                <li>
                  <a href="#philosophy" className="hover:text-brand-primary transition-colors">Philosophy</a>
                </li>
                <li>
                  <a href="#location" className="hover:text-brand-primary transition-colors">Directions</a>
                </li>
              </ul>
            </div>

            {/* Legal column */}
            <div className="lg:col-span-2 space-y-5">
              <h4 className="text-[10px] tracking-[0.25em] font-sans font-bold uppercase text-brand-charcoal/50">
                LEGAL
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm font-sans text-brand-charcoal/75">
                <li>
                  <a href="#" className="hover:text-brand-primary transition-colors">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="hover:text-brand-primary transition-colors">Terms of Service</a>
                </li>
                <li>
                  <a href="#" className="hover:text-brand-primary transition-colors">Spa Etiquette</a>
                </li>
              </ul>
            </div>

            {/* Newsletter column */}
            <div className="lg:col-span-4 space-y-5">
              <h4 className="text-[10px] tracking-[0.25em] font-sans font-bold uppercase text-brand-charcoal/50">
                NEWSLETTER
              </h4>
              <p className="text-xs sm:text-sm text-brand-charcoal/70 font-sans font-light leading-relaxed mb-4">
                Subscribe to receive seasonal wellness insights, ritual announcements, and priority sanctuary bookings.
              </p>

              {newsletterSubmitted ? (
                <div className="flex items-center gap-3 p-4 bg-brand-sage/40 rounded-2xl border border-brand-sage/60 text-brand-sage-dark text-xs sm:text-sm animate-fade-in shadow-xs">
                  <CheckCircle className="h-5 w-5 text-brand-sage-dark shrink-0" />
                  <span>Thank you. Your email was successfully registered.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2.5">
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 h-4 w-4 text-brand-charcoal/40" />
                    <Input
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-white border-brand-border text-brand-charcoal rounded-full pl-11 py-5 h-11 focus-visible:ring-brand-primary/50 text-xs sm:text-sm shadow-inner"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full text-[10px] sm:text-xs uppercase tracking-[0.2em] bg-brand-primary hover:bg-brand-primary-hover text-white border border-brand-primary py-5 rounded-full shadow-md font-semibold cursor-pointer"
                  >
                    SUBSCRIBE
                  </Button>
                </form>
              )}
            </div>

          </div>

          {/* Bottom metadata */}
          <div className="pt-8 border-t border-brand-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] sm:text-xs text-brand-charcoal/55 font-sans tracking-wider">
            <span>© 2024 Aura Luxury Wellness Sanctuary. All rights reserved.</span>
            <span className="italic font-serif">Designed with Intent</span>
          </div>

        </div>
      </footer>

      {/* BOOKING MODAL WITH SHADCN DIALOG */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="bg-brand-cream border border-brand-border/60 rounded-[2rem] p-6 sm:p-8 max-w-md w-full text-brand-charcoal animate-scale-in">
          <DialogHeader className="text-center pb-2">
            <span className="text-[10px] tracking-[0.25em] text-brand-primary font-bold uppercase block mb-1">
              BESPOKE EXPERIENCES
            </span>
            <DialogTitle className="font-serif text-2xl sm:text-3xl text-brand-charcoal font-normal tracking-wide">
              Book a Ritual
            </DialogTitle>
          </DialogHeader>

          {bookingSubmitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-14 bg-brand-sage text-brand-sage-dark rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-brand-charcoal">Booking Request Received!</h3>
              <p className="text-xs sm:text-sm text-brand-charcoal/70 font-sans leading-relaxed">
                Thank you, <span className="font-bold text-brand-charcoal">{bookingName}</span>. We have successfully scheduled your <span className="font-bold text-brand-charcoal">{bookingService}</span> session for <span className="font-bold text-brand-charcoal">{bookingDate}</span>. Our sanctuary hosts will contact you shortly to confirm your therapist.
              </p>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-5 mt-2">
              <div className="space-y-4">
                {/* Name field */}
                <div className="space-y-2">
                  <label htmlFor="bookingName" className="text-[10px] tracking-[0.15em] uppercase font-bold text-brand-charcoal/60 font-sans block pl-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-3.5 h-4 w-4 text-brand-charcoal/40" />
                    <Input
                      id="bookingName"
                      type="text"
                      placeholder="e.g. Eleanor Vance"
                      required
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      className="bg-white border-brand-border rounded-full pl-11 py-5 h-11 text-sm shadow-inner"
                    />
                  </div>
                </div>

                {/* Treatment Select */}
                <div className="space-y-2">
                  <label htmlFor="bookingService" className="text-[10px] tracking-[0.15em] uppercase font-bold text-brand-charcoal/60 font-sans block pl-1">
                    Select Treatment
                  </label>
                  <div className="relative">
                    <Sparkles className="absolute left-4 top-3.5 h-4 w-4 text-brand-charcoal/40 pointer-events-none" />
                    <select
                      id="bookingService"
                      value={bookingService}
                      onChange={(e) => setBookingService(e.target.value)}
                      className="flex h-11 w-full rounded-full border border-brand-border bg-white pl-11 pr-4 py-2.5 text-xs sm:text-sm text-brand-charcoal/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-primary/50 shadow-inner appearance-none cursor-pointer"
                    >
                      {services.length > 0 ? (
                        services.map((svc) => (
                          <option key={svc.id} value={svc.id}>
                            {svc.name} (${svc.price})
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="Therapeutic Massage">Therapeutic Massage ($120)</option>
                          <option value="Rejuvenating Facial">Rejuvenating Facial ($145)</option>
                          <option value="Wellness Consultation">Wellness Consultation ($95)</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                {/* Date selection */}
                <div className="space-y-2">
                  <label htmlFor="bookingDate" className="text-[10px] tracking-[0.15em] uppercase font-bold text-brand-charcoal/60 font-sans block pl-1">
                    Preferred Date & Time
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-3.5 h-4 w-4 text-brand-charcoal/40" />
                    <Input
                      id="bookingDate"
                      type="datetime-local"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="bg-white border-brand-border text-brand-charcoal rounded-full pl-11 py-5 h-11 text-sm shadow-inner"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full text-xs uppercase tracking-[0.2em] bg-brand-primary hover:bg-brand-primary-hover text-white py-5 rounded-full mt-3 shadow-md font-semibold cursor-pointer"
              >
                Send Booking Request
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* AUTH MODAL WITH SHADCN DIALOG */}
      <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
        <DialogContent className="bg-brand-cream border border-brand-border/60 rounded-[2rem] p-6 sm:p-8 max-w-md w-full text-brand-charcoal animate-scale-in">
          <DialogHeader className="text-center pb-2">
            <span className="text-[10px] tracking-[0.25em] text-brand-primary font-bold uppercase block mb-1">
              {authMode === "login" ? "WELCOME BACK" : "JOIN THE CLUB"}
            </span>
            <DialogTitle className="font-serif text-2xl sm:text-3xl text-brand-charcoal font-normal tracking-wide">
              {authMode === "login" ? "Sign In" : "Create Account"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAuthSubmit} className="space-y-5 mt-2">
            {authError && (
              <div className="text-red-600 bg-red-50 border border-red-200 text-xs sm:text-sm rounded-xl p-3 text-center font-medium animate-fade-in">
                {authError}
              </div>
            )}

            <div className="space-y-4">
              {authMode === "register" && (
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.15em] uppercase font-bold text-brand-charcoal/60 font-sans block pl-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-3.5 h-4 w-4 text-brand-charcoal/40" />
                    <Input
                      type="text"
                      placeholder="e.g. Eleanor Vance"
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      className="bg-white border-brand-border rounded-full pl-11 py-5 h-11 text-sm shadow-inner"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] tracking-[0.15em] uppercase font-bold text-brand-charcoal/60 font-sans block pl-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 h-4 w-4 text-brand-charcoal/40" />
                  <Input
                    type="email"
                    placeholder="e.g. eleanor@aura.com"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="bg-white border-brand-border rounded-full pl-11 py-5 h-11 text-sm shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] tracking-[0.15em] uppercase font-bold text-brand-charcoal/60 font-sans block pl-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-4 w-4 text-brand-charcoal/40" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="bg-white border-brand-border rounded-full pl-11 py-5 h-11 text-sm shadow-inner"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full text-xs uppercase tracking-[0.2em] bg-brand-primary hover:bg-brand-primary-hover text-white py-5 rounded-full mt-3 shadow-md font-semibold cursor-pointer"
            >
              {authMode === "login" ? "Sign In" : "Sign Up"}
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setAuthMode(authMode === "login" ? "register" : "login");
                  setAuthError("");
                }}
                className="text-xs text-brand-primary hover:underline font-sans font-bold cursor-pointer"
              >
                {authMode === "login"
                  ? "Don't have an account? Sign Up"
                  : "Already have an account? Sign In"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
