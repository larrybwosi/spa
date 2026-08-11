"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Card } from "@repo/ui/card";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import useSWR from "swr";
import { fetcherWithCredentials, defaultFetcher } from "../swr-fetcher";
import { motion, AnimatePresence } from "framer-motion";
import { API_ENDPOINTS } from "../../lib/api";
import {
  Sparkles,
  Calendar,
  User as UserIcon,
  CheckCircle,
  ShieldCheck,
  PhoneCall,
  Clock,
  Lock
} from "lucide-react";

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

const bookingNavLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Book Session", href: "/booking" },
];

function BookingForm({
  user,
  services,
  setBookingName,
  bookingName
}: {
  user: User | null;
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

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      const res = await fetch(API_ENDPOINTS.bookings(), {
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
    <Card className="bg-brand-card-cream/60 border border-brand-border/60 p-6 sm:p-10 rounded-xl shadow-lg max-w-xl mx-auto overflow-hidden">
      <AnimatePresence mode="wait">
        {bookingSubmitted ? (
          <motion.div
            key="success-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-10 space-y-4"
          >
            <div className="w-16 h-14 bg-brand-sage text-brand-sage-dark rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-brand-charcoal">Ritual Scheduled Successfully!</h2>
            <p className="text-xs sm:text-sm text-brand-charcoal/70 font-sans leading-relaxed">
              Thank you, <span className="font-bold text-brand-charcoal">{bookingName}</span>. Your session has been successfully booked. Our hosts will confirm your therapist and send full ritual directions shortly.
            </p>
          </motion.div>
        ) : user ? (
          <motion.form
            key="booking-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            onSubmit={handleBookingSubmit}
            className="space-y-6"
          >
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBookingName(e.target.value)}
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
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBookingService(e.target.value)}
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBookingDate(e.target.value)}
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
          </motion.form>
        ) : (
          <motion.div
            key="unauthenticated-prompt"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="text-center py-10 space-y-6"
          >
            <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Lock className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] tracking-[0.25em] text-brand-primary font-bold uppercase block">
                AUTHENTICATION REQUIRED
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-brand-charcoal tracking-wide">
                Identify Yourself
              </h2>
              <p className="text-xs sm:text-sm text-brand-charcoal/60 font-sans max-w-sm mx-auto leading-relaxed">
                To customize your bespoke wellness ritual, please register as a guest or sign in to your Aura profile.
              </p>
            </div>
            <div className="pt-4">
              <Button
                asChild
                className="w-full text-xs uppercase tracking-[0.2em] bg-brand-primary hover:bg-brand-primary-hover text-white py-5 rounded-lg shadow-md font-semibold cursor-pointer"
              >
                <Link href="/auth?redirect=/booking">
                  Go to Sign In / Sign Up
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export default function BookingPage() {
  const [bookingName, setBookingName] = useState("");

  // User session with SWR
  const { data: sessionData } = useSWR(
    API_ENDPOINTS.authSession(),
    fetcherWithCredentials,
    { shouldRetryOnError: false }
  );
  const user = sessionData?.user || null;

  // Services with SWR
  const { data: apiServices } = useSWR(
    API_ENDPOINTS.services(),
    defaultFetcher
  );
  const services = apiServices || [];

  useEffect(() => {
    if (user) {
      setBookingName(user.name);
    }
  }, [user]);

  return (
    <div className="relative min-h-screen bg-brand-cream text-brand-charcoal overflow-x-hidden font-sans selection:bg-brand-primary/20">

      {/* HEADER / NAVIGATION */}
      <Navbar navLinks={bookingNavLinks} activeHref="/booking" />

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

            <div className="text-xs sm:text-sm text-brand-charcoal/70 font-sans font-light leading-relaxed space-y-4 font-body">
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
                services={services}
                setBookingName={setBookingName}
                bookingName={bookingName}
              />
            </Suspense>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}
