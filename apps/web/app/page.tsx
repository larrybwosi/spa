"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Card } from "@repo/ui/card";
import {
  MapPin,
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  Sparkles,
  Compass,
  CheckCircle
} from "lucide-react";

// Standard Inline SVG Social Icons for maximum reliability
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
      <header className="sticky top-0 z-40 bg-brand-cream/80 backdrop-blur-md border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <span className="font-serif text-xl md:text-2xl tracking-widest text-brand-primary group-hover:opacity-80 transition-opacity">
              AURA WELLNESS
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-10 text-sm tracking-widest font-medium uppercase text-brand-charcoal/80">
            <a href="#about" className="hover:text-brand-primary transition-colors py-2 relative group">
              About
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-brand-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </a>
            <a href="#services" className="hover:text-brand-primary transition-colors py-2 relative group">
              Services
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-brand-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </a>
            <a href="#packages" className="hover:text-brand-primary transition-colors py-2 relative group">
              Packages
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-brand-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </a>
            <a href="#news" className="hover:text-brand-primary transition-colors py-2 relative group">
              News
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-brand-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </a>
            <a href="#contact" className="hover:text-brand-primary transition-colors py-2 relative group">
              Contact
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-brand-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </a>
          </nav>

          {/* Book Now CTA / Auth */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-3 border-r pr-6 border-brand-border">
                <span className="text-xs uppercase tracking-widest font-serif text-brand-charcoal font-medium">
                  Hello, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-[10px] uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors font-sans font-semibold cursor-pointer"
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
                className="text-xs uppercase tracking-widest font-sans font-semibold hover:text-brand-primary transition-colors text-brand-charcoal/80 cursor-pointer"
              >
                Sign In
              </button>
            )}

            <Button
              onClick={() => setIsBookingOpen(true)}
              variant="default"
              className="text-xs uppercase tracking-widest bg-brand-primary text-white border border-brand-primary px-8 hover:bg-brand-primary-hover shadow-sm transition-all duration-300 transform hover:scale-[1.02]"
            >
              Book Now
            </Button>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-brand-charcoal hover:text-brand-primary transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU DRAWER */}
      <div
        className={`fixed inset-0 z-30 bg-brand-cream/98 transition-transform duration-500 ease-in-out transform md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } pt-24 px-8`}
      >
        <nav className="flex flex-col space-y-6 text-xl tracking-widest font-serif text-brand-charcoal">
          <a
            href="#about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-brand-primary transition-colors py-2 border-b border-brand-border"
          >
            About
          </a>
          <a
            href="#services"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-brand-primary transition-colors py-2 border-b border-brand-border"
          >
            Services
          </a>
          <a
            href="#packages"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-brand-primary transition-colors py-2 border-b border-brand-border"
          >
            Packages
          </a>
          <a
            href="#news"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-brand-primary transition-colors py-2 border-b border-brand-border"
          >
            News
          </a>
          <a
            href="#contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-brand-primary transition-colors py-2 border-b border-brand-border"
          >
            Contact
          </a>

          {user ? (
            <div className="py-4 border-b border-brand-border flex items-center justify-between">
              <span className="text-sm font-sans font-medium text-brand-charcoal">
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
              className="hover:text-brand-primary text-left font-serif transition-colors py-4 border-b border-brand-border text-xl"
            >
              Sign In
            </button>
          )}

          <div className="pt-8">
            <Button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsBookingOpen(true);
              }}
              className="w-full text-xs uppercase tracking-widest bg-brand-primary text-white py-4"
            >
              Book Now
            </Button>
          </div>
        </nav>
      </div>

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center pt-20 pb-24 md:py-0 px-6 overflow-hidden">

        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=2070"
            alt="Luxury Spa thermal pool background"
            className="w-full h-full object-cover object-center brightness-60 scale-105 animate-subtle-zoom"
          />
          <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px]"></div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-cream to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center text-white px-4">
          <span className="text-xs md:text-sm tracking-[0.3em] font-sans text-brand-cream/90 uppercase block mb-6 animate-fade-in">
            REJUVENATION
          </span>

          <h1 className="text-5xl md:text-8xl leading-tight font-serif tracking-normal mb-8 max-w-3xl mx-auto font-light animate-fade-in-up">
            Experience Serenity
          </h1>

          <div className="flex justify-center gap-3 mb-8">
            <span className="px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-xs tracking-widest uppercase">
              Easy Now
            </span>
            <span className="px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-xs tracking-widest uppercase">
              Call via web
            </span>
          </div>

          <p className="text-sm md:text-lg text-brand-cream/90 max-w-xl mx-auto font-sans font-light leading-relaxed mb-10 tracking-wide">
            Step into a sanctuary of peace. Our bespoke wellness rituals are designed to harmonize your body, mind, and spirit in an atmosphere of quiet luxury.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button
              onClick={() => setIsBookingOpen(true)}
              className="w-full sm:w-auto text-xs uppercase tracking-widest px-10 py-4 bg-brand-primary hover:bg-brand-primary-hover border border-brand-primary text-white"
            >
              Book a Session
            </Button>
          </div>
        </div>
      </section>

      {/* CURATED TREATMENTS SECTION */}
      <section id="services" className="py-24 md:py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16 md:mb-20">
          <span className="text-xs tracking-[0.2em] font-sans text-brand-primary uppercase block mb-3 font-medium">
            SERVICES & EXPERIENCES
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-brand-charcoal mb-4">
            Curated Treatments
          </h2>
          <p className="text-sm md:text-base text-brand-charcoal/70 leading-relaxed font-sans font-light">
            Discover our range of holistic therapies, each tailored to elevate your well-being.
          </p>
        </div>

        {/* Dynamic Card Grid matching the screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">

          {/* Card 1: Massage image (Top-Left) */}
          <div className="group relative rounded-3xl overflow-hidden min-h-[350px] md:min-h-[420px] shadow-sm flex flex-col justify-end p-8 transition-transform duration-500 hover:scale-[1.01]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=1000"
              alt="Therapeutic Massage"
              className="absolute inset-0 w-full h-full object-cover brightness-70 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            <div className="relative z-10 text-white max-w-md">
              <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] tracking-widest uppercase mb-4">
                Signature
              </span>
              <h3 className="text-2xl md:text-3xl font-serif mb-2 text-white">
                Therapeutic Massage
              </h3>
              <p className="text-xs md:text-sm text-brand-cream/80 font-sans font-light leading-relaxed mb-4">
                Release tension and restore balance with our customized deep tissue and Swedish techniques.
              </p>
            </div>

            <button
              onClick={() => {
                setBookingService("Therapeutic Massage");
                setIsBookingOpen(true);
              }}
              className="absolute bottom-8 right-8 w-12 h-12 rounded-full bg-white text-brand-charcoal flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all duration-300 shadow-md group-hover:translate-x-1"
              aria-label="Book Therapeutic Massage"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          {/* Card 2: Rejuvenating Facial Cream Card (Top-Right) */}
          <Card className="bg-brand-card-cream border-brand-border p-8 md:p-10 flex flex-col justify-between transition-transform duration-500 hover:scale-[1.01]">
            <div className="flex flex-col gap-6">
              <div className="w-12 h-12 rounded-full bg-[#fbfaf8] border border-brand-border flex items-center justify-center text-brand-primary shadow-xs">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-serif text-brand-charcoal">
                  Rejuvenating Facial
                </h3>
                <p className="text-xs md:text-sm text-brand-charcoal/70 leading-relaxed font-sans font-light max-w-sm">
                  Organic, nutrient-rich botanicals applied with expert precision to unveil your natural radiance.
                </p>
              </div>
            </div>

            <div className="pt-10 flex items-center">
              <button
                onClick={() => {
                  setBookingService("Rejuvenating Facial");
                  setIsBookingOpen(true);
                }}
                className="flex items-center gap-2 text-xs tracking-widest uppercase font-medium text-brand-primary hover:text-brand-primary-hover group"
              >
                <span>Explore</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </Card>

          {/* Card 3: Wellness Consultation Sage Green Card (Bottom-Left) */}
          <Card className="bg-brand-sage border-transparent p-8 md:p-10 flex flex-col justify-between text-brand-sage-dark transition-transform duration-500 hover:scale-[1.01]">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-full bg-[#e8ecd9] flex items-center justify-center text-brand-sage-dark shadow-xs">
                <Compass className="h-5 w-5" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-serif text-brand-sage-dark">
                  Wellness Consultation
                </h3>
                <p className="text-xs md:text-sm text-brand-sage-dark/80 leading-relaxed font-sans font-light max-w-sm">
                  A holistic assessment guiding you towards optimal lifestyle harmony.
                </p>
              </div>
            </div>

            <div className="pt-10 flex items-center">
              <button
                onClick={() => {
                  setBookingService("Wellness Consultation");
                  setIsBookingOpen(true);
                }}
                className="flex items-center gap-2 text-xs tracking-widest uppercase font-medium text-brand-sage-dark hover:opacity-80 group"
              >
                <span>Learn Details</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </Card>

          {/* Card 4: Image of Bath Products/Bottles (Bottom-Right) */}
          <div className="group relative rounded-3xl overflow-hidden min-h-[300px] md:min-h-[420px] shadow-sm flex flex-col justify-end p-8 transition-transform duration-500 hover:scale-[1.01]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=1000"
              alt="Aura Luxury Skin Care Products"
              className="absolute inset-0 w-full h-full object-cover brightness-95 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/10"></div>

            {/* Subtle glassmorphism label */}
            <div className="absolute top-6 right-6 px-4 py-2 bg-white/70 backdrop-blur-md rounded-full text-[10px] tracking-widest text-brand-charcoal uppercase font-medium">
              Aura Skin
            </div>
          </div>

        </div>
      </section>

      {/* OUR PHILOSOPHY SECTION */}
      <section id="about" className="py-24 md:py-32 bg-brand-card-cream/50 border-y border-brand-border px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

          {/* Left Column: Elegant Vertical Image */}
          <div className="lg:col-span-5 relative aspect-3/4 rounded-3xl overflow-hidden shadow-sm h-[500px] lg:h-[600px] w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000"
              alt="Luxury Spa reception"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-brand-charcoal/5"></div>
          </div>

          {/* Right Column: Text & Stats */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8 lg:pr-6">
            <div className="space-y-4">
              <span className="text-xs tracking-[0.22em] font-sans text-brand-primary uppercase font-semibold block">
                OUR PHILOSOPHY
              </span>
              <h2 className="text-3xl md:text-5xl font-serif text-brand-charcoal leading-tight">
                Art of Healing
              </h2>
            </div>

            <div className="space-y-6 text-sm md:text-base text-brand-charcoal/70 font-sans font-light leading-relaxed max-w-xl">
              <p>
                At Aura Wellness, we believe that true beauty stems from profound inner peace. Our spaces are meticulously crafted to filter out the noise of the modern world, providing a sanctuary where silence is celebrated and rejuvenation is an art form.
              </p>
              <p>
                We source only the finest organic ingredients and employ practitioners who are masters of their craft, ensuring every touch is intentional and every moment is transformative.
              </p>
            </div>

            {/* Statistics */}
            <div className="pt-8 border-t border-brand-border flex items-center gap-12 md:gap-16">
              <div>
                <span className="block text-4xl md:text-5xl font-serif text-brand-primary mb-1">
                  15<span className="text-3xl">+</span>
                </span>
                <span className="block text-[10px] md:text-xs tracking-widest text-brand-charcoal/60 font-semibold uppercase">
                  Years Experience
                </span>
              </div>
              <div>
                <span className="block text-4xl md:text-5xl font-serif text-brand-primary mb-1">
                  100%
                </span>
                <span className="block text-[10px] md:text-xs tracking-widest text-brand-charcoal/60 font-semibold uppercase">
                  Organic Products
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* LOCATION & SANCTUARY SECTION */}
      <section id="contact" className="py-24 md:py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

          {/* Left Column: Location Details */}
          <div className="lg:col-span-5 space-y-8 order-2 lg:order-1">
            <div className="space-y-4">
              <span className="text-xs tracking-[0.22em] font-sans text-brand-primary uppercase font-semibold block">
                LOCATION
              </span>
              <h2 className="text-3xl md:text-5xl font-serif text-brand-charcoal leading-tight">
                Visit Our Sanctuary
              </h2>
              <p className="text-sm md:text-base text-brand-charcoal/70 font-sans font-light leading-relaxed">
                Find us in the heart of the Wellness District, where your journey to tranquility begins.
              </p>
            </div>

            {/* Address box */}
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-brand-card-cream/40 border border-brand-border max-w-md">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-primary shrink-0 shadow-xs">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-base text-brand-charcoal font-medium">Aura Wellness Center</h4>
                <p className="text-xs md:text-sm text-brand-charcoal/70 font-sans font-light">
                  123 Serene Lane, Wellness District, 90210
                </p>
              </div>
            </div>

            {/* Directions Button */}
            <div>
              <Button
                onClick={() => window.open("https://maps.google.com", "_blank")}
                className="flex items-center gap-2 text-xs uppercase tracking-widest bg-brand-primary text-white border border-brand-primary hover:bg-brand-primary-hover px-8 py-3.5"
              >
                <span>Get Directions</span>
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right Column: Monochrome/Muted Spa Setup Image */}
          <div className="lg:col-span-7 relative aspect-4/3 rounded-3xl overflow-hidden shadow-sm h-[320px] md:h-[450px] w-full order-1 lg:order-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=1000"
              alt="Grayscale aesthetic spa product setup"
              className="absolute inset-0 w-full h-full object-cover object-center grayscale contrast-105"
            />
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-brand-card-cream/60 border-t border-brand-border pt-16 md:pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-16 md:mb-20">

            {/* Brand column */}
            <div className="lg:col-span-4 space-y-6">
              <span className="font-serif text-xl tracking-widest text-brand-primary block">
                AURA WELLNESS
              </span>
              <p className="text-xs md:text-sm text-brand-charcoal/70 font-sans font-light leading-relaxed max-w-xs">
                Elevating your state of being through mindful practices and luxurious care.
              </p>
              {/* Social icons */}
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="w-9 h-9 rounded-full border border-brand-border flex items-center justify-center text-brand-charcoal/60 hover:text-brand-primary hover:border-brand-primary transition-all shadow-2xs bg-white"
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-full border border-brand-border flex items-center justify-center text-brand-charcoal/60 hover:text-brand-primary hover:border-brand-primary transition-all shadow-2xs bg-white"
                  aria-label="Facebook"
                >
                  <FacebookIcon />
                </a>
              </div>
            </div>

            {/* Explore column */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-[10px] tracking-[0.2em] font-sans font-bold uppercase text-brand-charcoal/40">
                EXPLORE
              </h4>
              <ul className="space-y-2.5 text-xs md:text-sm font-sans text-brand-charcoal/70">
                <li>
                  <a href="#about" className="hover:text-brand-primary transition-colors">About Us</a>
                </li>
                <li>
                  <a href="#services" className="hover:text-brand-primary transition-colors">Treatments</a>
                </li>
                <li>
                  <a href="#packages" className="hover:text-brand-primary transition-colors">Gift Cards</a>
                </li>
                <li>
                  <a href="#news" className="hover:text-brand-primary transition-colors">Careers</a>
                </li>
              </ul>
            </div>

            {/* Legal column */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-[10px] tracking-[0.2em] font-sans font-bold uppercase text-brand-charcoal/40">
                LEGAL
              </h4>
              <ul className="space-y-2.5 text-xs md:text-sm font-sans text-brand-charcoal/70">
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
            <div className="lg:col-span-4 space-y-4">
              <h4 className="text-[10px] tracking-[0.2em] font-sans font-bold uppercase text-brand-charcoal/40">
                NEWSLETTER
              </h4>
              <p className="text-xs md:text-sm text-brand-charcoal/70 font-sans font-light leading-relaxed mb-4">
                Subscribe for exclusive wellness tips and offers.
              </p>

              {newsletterSubmitted ? (
                <div className="flex items-center gap-2 p-3 bg-brand-sage/40 rounded-2xl border border-brand-sage text-brand-sage-dark text-xs animate-fade-in">
                  <CheckCircle className="h-4 w-4 text-brand-sage-dark shrink-0" />
                  <span>Thank you for subscribing to Aura Wellness!</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
                  <Input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white border-brand-border text-brand-charcoal rounded-full"
                  />
                  <Button
                    type="submit"
                    className="w-full text-[10px] uppercase tracking-[0.2em] bg-brand-primary text-white border border-brand-primary hover:bg-brand-primary-hover shadow-xs mt-1"
                  >
                    SUBSCRIBE
                  </Button>
                </form>
              )}
            </div>

          </div>

          {/* Bottom metadata */}
          <div className="pt-8 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] md:text-xs text-brand-charcoal/40 font-sans tracking-wider">
            <span>© 2024 Aura Luxury Wellness. All rights reserved.</span>
            <span>Designed with Intent</span>
          </div>

        </div>
      </footer>

      {/* BOOKING MODAL */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-brand-cream border border-brand-border w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl relative animate-scale-in">

            <button
              onClick={() => setIsBookingOpen(false)}
              className="absolute top-4 right-4 p-2 text-brand-charcoal/60 hover:text-brand-charcoal hover:bg-brand-card-cream/40 rounded-full transition-all"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {bookingSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 bg-brand-sage text-brand-sage-dark rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="font-serif text-2xl text-brand-charcoal">Booking Request Received!</h3>
                <p className="text-xs md:text-sm text-brand-charcoal/70 font-sans leading-relaxed">
                  Thank you, <span className="font-semibold">{bookingName}</span>. We have scheduled your <span className="font-semibold">{bookingService}</span> session for <span className="font-semibold">{bookingDate}</span>. Our sanctuary hosts will contact you shortly to confirm.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-5">
                <div className="text-center pb-2">
                  <span className="text-[10px] tracking-widest text-brand-primary font-bold uppercase block mb-1">
                    DESPOKE EXPERIENCES
                  </span>
                  <h3 className="font-serif text-2xl text-brand-charcoal">Book a Ritual</h3>
                </div>

                <div className="space-y-4">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label htmlFor="bookingName" className="text-[10px] tracking-wider uppercase font-semibold text-brand-charcoal/60 font-sans">
                      Your Name
                    </label>
                    <Input
                      id="bookingName"
                      type="text"
                      placeholder="e.g. Eleanor Vance"
                      required
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      className="bg-white border-brand-border"
                    />
                  </div>

                  {/* Treatment Select */}
                  <div className="space-y-1.5">
                    <label htmlFor="bookingService" className="text-[10px] tracking-wider uppercase font-semibold text-brand-charcoal/60 font-sans">
                      Select Treatment
                    </label>
                    <select
                      id="bookingService"
                      value={bookingService}
                      onChange={(e) => setBookingService(e.target.value)}
                      className="flex h-11 w-full rounded-full border border-brand-border bg-white px-4 py-2 text-sm text-brand-charcoal focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-primary"
                    >
                      {services.length > 0 ? (
                        services.map((svc) => (
                          <option key={svc.id} value={svc.id}>
                            {svc.name} (${svc.price})
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="Therapeutic Massage">Therapeutic Massage</option>
                          <option value="Rejuvenating Facial">Rejuvenating Facial</option>
                          <option value="Wellness Consultation">Wellness Consultation</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* Date selection */}
                  <div className="space-y-1.5">
                    <label htmlFor="bookingDate" className="text-[10px] tracking-wider uppercase font-semibold text-brand-charcoal/60 font-sans">
                      Preferred Date & Time
                    </label>
                    <Input
                      id="bookingDate"
                      type="datetime-local"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="bg-white border-brand-border text-brand-charcoal"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full text-xs uppercase tracking-widest bg-brand-primary text-white py-4 mt-2"
                >
                  Send Booking Request
                </Button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* AUTH MODAL (LOGIN/REGISTER) */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-brand-cream border border-brand-border w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl relative animate-scale-in animate-duration-300">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-brand-charcoal/60 hover:text-brand-charcoal hover:bg-brand-card-cream/40 rounded-full transition-all cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <form onSubmit={handleAuthSubmit} className="space-y-5">
              <div className="text-center pb-2">
                <span className="text-[10px] tracking-widest text-brand-primary font-bold uppercase block mb-1">
                  {authMode === "login" ? "WELCOME BACK" : "JOIN THE CLUB"}
                </span>
                <h3 className="font-serif text-2xl text-brand-charcoal">
                  {authMode === "login" ? "Sign In" : "Create Account"}
                </h3>
              </div>

              {authError && (
                <div className="text-red-600 bg-red-50 border border-red-200 text-xs rounded-xl p-3 text-center">
                  {authError}
                </div>
              )}

              <div className="space-y-4">
                {authMode === "register" && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] tracking-wider uppercase font-semibold text-brand-charcoal/60 font-sans">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. Eleanor Vance"
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      className="bg-white border-brand-border"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] tracking-wider uppercase font-semibold text-brand-charcoal/60 font-sans">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="e.g. eleanor@aura.com"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="bg-white border-brand-border"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] tracking-wider uppercase font-semibold text-brand-charcoal/60 font-sans">
                    Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="bg-white border-brand-border"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full text-xs uppercase tracking-widest bg-brand-primary text-white py-4 mt-2"
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
                  className="text-xs text-brand-primary hover:underline font-sans font-medium cursor-pointer"
                >
                  {authMode === "login"
                    ? "Don't have an account? Sign Up"
                    : "Already have an account? Sign In"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
