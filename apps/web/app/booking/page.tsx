"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Card } from "@repo/ui/card";
import {
  Sparkles,
  Calendar,
  Lock,
  Mail,
  User as UserIcon,
  CheckCircle,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
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

interface Service {
  id: string;
  name: string;
  price: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

function BookingForm({
  user,
  setUser,
  services,
  setBookingName,
  bookingName
}: {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  services: Service[];
  setBookingName: React.Dispatch<React.SetStateAction<string>>;
  bookingName: string;
}) {
  const searchParams = useSearchParams();
  const preselectedServiceId = searchParams?.get("service") || "";

  // Booking states
  const [bookingService, setBookingService] = useState("Therapeutic Massage");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  // Authentication states
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Initialize service based on query param
  useEffect(() => {
    if (preselectedServiceId) {
      const match = services.find((s) => s.id === preselectedServiceId);
      if (match) {
        setBookingService(match.id);
      } else if (preselectedServiceId === "s1" || preselectedServiceId === "Therapeutic Massage") {
        setBookingService("Therapeutic Massage");
      } else if (preselectedServiceId === "s4" || preselectedServiceId === "Rejuvenating Facial") {
        setBookingService("Rejuvenating Facial");
      } else if (preselectedServiceId === "s3" || preselectedServiceId === "Wellness Consultation") {
        setBookingService("Wellness Consultation");
      }
    }
  }, [preselectedServiceId, services]);

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
        setAuthEmail("");
        setAuthPassword("");
      } else {
        setAuthMode("login");
        setAuthPassword("");
        alert("Registration successful! Please sign in with your credentials.");
      }
    } catch (err) {
      const errorObj = err as Error;
      setAuthError(errorObj.message || "An error occurred");
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in or register to complete your booking.");
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
        setBookingDate("");
      }, 5000);
    } catch (err) {
      const errorObj = err as Error;
      alert(errorObj.message || "An error occurred while booking");
    }
  };

  return (
    <Card className="bg-brand-card-cream/60 border border-brand-border/60 p-6 sm:p-10 rounded-xl shadow-sm max-w-xl mx-auto">
      {bookingSubmitted ? (
        <div className="text-center py-10 space-y-4">
          <div className="w-16 h-14 bg-brand-sage text-brand-sage-dark rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-brand-charcoal">Ritual Scheduled Successfully!</h2>
          <p className="text-xs sm:text-sm text-brand-charcoal/70 font-sans leading-relaxed">
            Thank you, <span className="font-bold text-brand-charcoal">{bookingName}</span>. Your session has been successfully booked. Our hosts will confirm your therapist and send full ritual directions shortly.
          </p>
        </div>
      ) : user ? (
        <form onSubmit={handleBookingSubmit} className="space-y-6">
          <div className="text-center pb-2">
            <span className="text-[10px] tracking-[0.25em] text-brand-primary font-bold uppercase block mb-1">
              BESPOKE RITUAL
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-brand-charcoal tracking-wide">
              Schedule Session
            </h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="bookingName" className="text-[10px] tracking-[0.15em] uppercase font-bold text-brand-charcoal/60 font-sans block pl-1">
                Guest Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-3.5 h-4 w-4 text-brand-charcoal/40" />
                <Input
                  id="bookingName"
                  type="text"
                  required
                  value={bookingName}
                  onChange={(e) => setBookingName(e.target.value)}
                  className="bg-white border-brand-border rounded-lg pl-11 py-5 h-11 text-sm shadow-inner"
                />
              </div>
            </div>

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
                  className="flex h-11 w-full rounded-lg border border-brand-border bg-white pl-11 pr-4 py-2.5 text-xs sm:text-sm text-brand-charcoal/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-primary/50 shadow-inner appearance-none cursor-pointer font-sans"
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
                  className="bg-white border-brand-border text-brand-charcoal rounded-lg pl-11 py-5 h-11 text-sm shadow-inner"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full text-xs uppercase tracking-[0.2em] bg-brand-primary hover:bg-brand-primary-hover text-white py-5 rounded-lg mt-3 shadow-md font-semibold cursor-pointer"
          >
            Confirm Reservation
          </Button>
        </form>
      ) : (
        <form onSubmit={handleAuthSubmit} className="space-y-6">
          <div className="text-center pb-2">
            <span className="text-[10px] tracking-[0.25em] text-brand-primary font-bold uppercase block mb-1">
              GUEST ACCESS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-brand-charcoal tracking-wide">
              {authMode === "login" ? "Sign In" : "Register Guest"}
            </h2>
            <p className="text-xs text-brand-charcoal/60 font-sans mt-2">
              Please authenticate to reserve your bespoke wellness ritual.
            </p>
          </div>

          {authError && (
            <div className="text-red-600 bg-red-50 border border-red-200 text-xs sm:text-sm rounded-lg p-3 text-center font-medium animate-fade-in">
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
                    className="bg-white border-brand-border rounded-lg pl-11 py-5 h-11 text-sm shadow-inner"
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
                  className="bg-white border-brand-border rounded-lg pl-11 py-5 h-11 text-sm shadow-inner"
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
                  className="bg-white border-brand-border rounded-lg pl-11 py-5 h-11 text-sm shadow-inner"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full text-xs uppercase tracking-[0.2em] bg-brand-primary hover:bg-brand-primary-hover text-white py-5 rounded-lg mt-3 shadow-md font-semibold cursor-pointer"
          >
            {authMode === "login" ? "Sign In" : "Register & Continue"}
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
      )}
    </Card>
  );
}

export default function BookingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [bookingName, setBookingName] = useState("");
  const [services, setServices] = useState<Service[]>([]);

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

    fetch("http://localhost:3001/api/services")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch");
      })
      .then((data) => setServices(data))
      .catch((e) => console.error("Could not fetch services, using fallbacks.", e));
  }, []);

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

  return (
    <div className="relative min-h-screen bg-brand-cream text-brand-charcoal overflow-x-hidden font-sans selection:bg-brand-primary/20">

      {/* HEADER / NAVIGATION */}
      <header className="sticky top-0 z-40 bg-brand-cream/80 backdrop-blur-md border-b border-brand-border/60 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-serif text-xl sm:text-2xl tracking-[0.25em] text-brand-primary group-hover:text-brand-primary-hover transition-colors font-semibold">
              AURA WELLNESS
            </span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8 text-xs tracking-[0.2em] font-medium uppercase text-brand-charcoal/80">
            <Link href="/" className="hover:text-brand-primary transition-colors py-2 relative group">
              Home
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </Link>
            <Link href="/services" className="hover:text-brand-primary transition-colors py-2 relative group">
              Services
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </Link>
            <Link href="/booking" className="text-brand-primary transition-colors py-2 relative group">
              Book Session
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-primary scale-x-100 transition-transform origin-left duration-300"></span>
            </Link>
          </nav>

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
                onClick={() => setUser(null)}
                className="text-xs uppercase tracking-widest font-sans font-bold hover:text-brand-primary transition-colors text-brand-charcoal/85"
              >
                Sign In
              </button>
            )}

            <Button asChild variant="default" className="text-xs uppercase tracking-[0.15em] bg-brand-primary text-white border border-brand-primary px-7 py-5 hover:bg-brand-primary-hover shadow-md hover:shadow-lg transition-all duration-300 rounded-lg font-medium">
              <Link href="/booking">Book Now</Link>
            </Button>
          </div>

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
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-brand-primary transition-colors py-3 border-b border-brand-border/40 flex justify-between items-center group"
          >
            <span>Home</span>
            <ChevronRight className="h-4 w-4 text-brand-primary opacity-0 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
          </Link>
          <Link
            href="/services"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-brand-primary transition-colors py-3 border-b border-brand-border/40 flex justify-between items-center group"
          >
            <span>Services</span>
            <ChevronRight className="h-4 w-4 text-brand-primary opacity-0 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
          </Link>
          <Link
            href="/booking"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-brand-primary transition-colors py-3 border-b border-brand-border/40 flex justify-between items-center group"
          >
            <span>Book Session</span>
            <ChevronRight className="h-4 w-4 text-brand-primary opacity-0 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
          </Link>

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
            <Link
              href="/booking"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-brand-primary text-left font-serif transition-colors py-4 border-b border-brand-border/40 text-lg flex justify-between items-center"
            >
              <span>Sign In</span>
              <ChevronRight className="h-4 w-4 text-brand-primary" />
            </Link>
          )}

          <div className="pt-8">
            <Button asChild className="w-full text-xs uppercase tracking-[0.2em] bg-brand-primary text-white py-6 rounded-lg hover:bg-brand-primary-hover shadow-md">
              <Link href="/booking" onClick={() => setIsMobileMenuOpen(false)}>Book Now</Link>
            </Button>
          </div>
        </nav>
      </div>

      {/* BOOKING AREA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          {/* Left instructions / context */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-32">
            <div className="space-y-4">
              <span className="text-xs tracking-[0.25em] font-sans text-brand-primary uppercase font-bold block">
                RESERVE EXPERIENCES
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-brand-charcoal leading-tight font-light">
                Embark on Your <br />
                <span className="italic text-brand-primary font-normal">Wellness Journey</span>
              </h1>
              <div className="w-16 h-[1.5px] bg-brand-primary/40 mt-4"></div>
            </div>

            <div className="text-xs sm:text-sm text-brand-charcoal/70 font-sans font-light leading-relaxed space-y-4">
              <p>
                To provide the ultimate standard of bespoke care, each treatment session at Aura Wellness is intentionally planned around your physical state and lifestyle needs.
              </p>
              <p>
                Simply sign in or register to set up your profile, choose your desired restorative ritual, and select your preferred timing. Our hosts will confirm therapist availability and send customized instructions.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <span className="px-4 py-2 rounded-full border border-brand-border bg-white text-[10px] tracking-wider uppercase font-medium text-brand-charcoal flex items-center gap-1.5 shadow-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-brand-primary" />
                Licensed Hosts
              </span>
              <span className="px-4 py-2 rounded-full border border-brand-border bg-white text-[10px] tracking-wider uppercase font-medium text-brand-charcoal flex items-center gap-1.5 shadow-xs">
                <PhoneCall className="h-3.5 w-3.5 text-brand-primary" />
                Valet Services
              </span>
              <span className="px-4 py-2 rounded-full border border-brand-border bg-white text-[10px] tracking-wider uppercase font-medium text-brand-charcoal flex items-center gap-1.5 shadow-xs">
                <Clock className="h-3.5 w-3.5 text-brand-primary" />
                Flexible Timing
              </span>
            </div>
          </div>

          {/* Right embedded interactive form */}
          <div className="lg:col-span-7">
            <Suspense fallback={<div className="text-center py-20 text-brand-charcoal/50">Loading booking portal...</div>}>
              <BookingForm
                user={user}
                setUser={setUser}
                services={services}
                setBookingName={setBookingName}
                bookingName={bookingName}
              />
            </Suspense>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-brand-card-cream/60 border-t border-brand-border/60 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
            <div className="lg:col-span-4 space-y-6">
              <span className="font-serif text-2xl tracking-[0.2em] text-brand-primary block font-semibold">
                AURA WELLNESS
              </span>
              <p className="text-xs sm:text-sm text-brand-charcoal/70 font-sans font-light leading-relaxed max-w-sm">
                Elevating human consciousness and state of physical being through highly mindful organic therapies and quiet luxury care.
              </p>
              <div className="flex items-center gap-3">
                <a href="#" className="w-10 h-10 rounded-full border border-brand-border/80 flex items-center justify-center text-brand-charcoal/65 hover:text-brand-primary hover:border-brand-primary transition-all bg-white"><InstagramIcon /></a>
                <a href="#" className="w-10 h-10 rounded-full border border-brand-border/80 flex items-center justify-center text-brand-charcoal/65 hover:text-brand-primary hover:border-brand-primary transition-all bg-white"><FacebookIcon /></a>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-5">
              <h4 className="text-[10px] tracking-[0.25em] font-sans font-bold uppercase text-brand-charcoal/50">EXPLORE</h4>
              <ul className="space-y-3 text-xs sm:text-sm font-sans text-brand-charcoal/75">
                <li><Link href="/" className="hover:text-brand-primary transition-colors">Home Sanctuary</Link></li>
                <li><Link href="/services" className="hover:text-brand-primary transition-colors">Our Treatments</Link></li>
                <li><Link href="/booking" className="hover:text-brand-primary transition-colors">Book Experience</Link></li>
              </ul>
            </div>

            <div className="lg:col-span-4 space-y-5">
              <h4 className="text-[10px] tracking-[0.25em] font-sans font-bold uppercase text-brand-charcoal/50">SANCTUARY DETAILS</h4>
              <p className="text-xs sm:text-sm text-brand-charcoal/70 font-sans font-light leading-relaxed">
                123 Serene Lane, Wellness District, Beverly Hills, CA 90210
              </p>
              <p className="text-xs sm:text-sm text-brand-charcoal/70 font-sans font-light leading-relaxed">
                Open Daily: 9:00 AM — 9:00 PM
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-brand-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] sm:text-xs text-brand-charcoal/55 font-sans tracking-wider">
            <span>© 2024 Aura Luxury Wellness Sanctuary. All rights reserved.</span>
            <span className="italic font-serif">Designed with Intent</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
