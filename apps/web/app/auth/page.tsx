"use client";

import React, { useState, Suspense } from "react";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Card } from "@repo/ui/card";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Mail,
  User as UserIcon,
  ShieldCheck,
  PhoneCall,
  Clock,
} from "lucide-react";
import { scrymeClient } from "../../lib/scryme";

const authNavLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Book Session", href: "/booking" },
];

function AuthForm() {
  // Authentication states
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError("");
    setIsLoading(true);

    try {
      const response = await scrymeClient.auth.signUp({
        name: authName,
        email: authEmail,
        password: authPassword,
      });
      console.log(response);
    } catch (err) {
      const errorObj = err as Error;
      setAuthError(errorObj.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-brand-card-cream/60 border border-brand-border/60 p-6 sm:p-10 rounded-xl shadow-lg max-w-md mx-auto overflow-hidden">
      <div className="text-center pb-6">
        <span className="text-[10px] tracking-[0.25em] text-brand-primary font-bold uppercase block mb-1">
          GUEST ACCESS
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl text-brand-charcoal tracking-wide">
          {authMode === "login" ? "Sign In" : "Register Guest"}
        </h2>
        <p className="text-xs text-brand-charcoal/60 font-sans mt-2">
          Authenticate to reserve treatments and manage orders.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {authError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-red-600 bg-red-50 border border-red-200 text-xs sm:text-sm rounded-lg p-3 text-center font-medium mb-4"
          >
            {authError}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleAuthSubmit} className="space-y-4">
        <AnimatePresence mode="wait">
          {authMode === "register" && (
            <motion.div
              key="register-fields"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="space-y-2"
            >
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setAuthName(e.target.value)
                  }
                  className="bg-white border-brand-border rounded-lg pl-11 py-5 h-11 text-sm shadow-inner"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAuthEmail(e.target.value)
              }
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAuthPassword(e.target.value)
              }
              className="bg-white border-brand-border rounded-lg pl-11 py-5 h-11 text-sm shadow-inner"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full text-xs uppercase tracking-[0.2em] bg-brand-primary hover:bg-brand-primary-hover text-white py-5 rounded-lg mt-4 shadow-md font-semibold cursor-pointer transition-colors duration-200"
        >
          {isLoading
            ? "Processing..."
            : authMode === "login"
              ? "Sign In"
              : "Register & Continue"}
        </Button>
      </form>

      <div className="text-center pt-6 border-t border-brand-border/40 mt-6">
        <button
          type="button"
          onClick={() => {
            setAuthMode(authMode === "login" ? "register" : "login");
            setAuthError("");
          }}
          className="text-xs text-brand-primary hover:underline font-sans font-bold cursor-pointer bg-transparent border-0"
        >
          {authMode === "login"
            ? "Don't have an account? Sign Up"
            : "Already have an account? Sign In"}
        </button>
      </div>
    </Card>
  );
}

export default function AuthPage() {
  return (
    <div className="relative min-h-screen bg-brand-cream text-brand-charcoal overflow-x-hidden font-sans selection:bg-brand-primary/20">
      <Navbar navLinks={authNavLinks} />

      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left panel */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <span className="text-xs tracking-[0.25em] font-sans text-brand-primary uppercase font-bold block">
                AURA SANCTUARY
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-brand-charcoal leading-tight font-light">
                Welcome to <br />
                <span className="italic text-brand-primary font-normal">
                  Our Community
                </span>
              </h1>
              <div className="w-16 h-[1.5px] bg-brand-primary/40 mt-4"></div>
            </div>

            <div className="text-xs sm:text-sm text-brand-charcoal/70 font-sans font-light leading-relaxed space-y-4 max-w-md">
              <p>
                As an Aura guest, creating an account unlocks access to online
                reservation management, personalized treatment recommendations,
                and priority access to limited wellness products.
              </p>
              <p>
                Your privacy and security are highly valued. All guest profiles
                are securely held and used strictly to coordinate bespoke
                wellness rituals.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <span className="px-4 py-2 rounded-full border border-brand-border bg-white text-[10px] tracking-wider uppercase font-medium text-brand-charcoal flex items-center gap-1.5 shadow-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-brand-primary" />
                Secure Sessions
              </span>
              <span className="px-4 py-2 rounded-full border border-brand-border bg-white text-[10px] tracking-wider uppercase font-medium text-brand-charcoal flex items-center gap-1.5 shadow-xs">
                <PhoneCall className="h-3.5 w-3.5 text-brand-primary" />
                Guest Support
              </span>
              <span className="px-4 py-2 rounded-full border border-brand-border bg-white text-[10px] tracking-wider uppercase font-medium text-brand-charcoal flex items-center gap-1.5 shadow-xs">
                <Clock className="h-3.5 w-3.5 text-brand-primary" />
                24/7 Portal
              </span>
            </div>
          </div>

          {/* Right panel with animated card */}
          <div className="lg:col-span-6">
            <Suspense
              fallback={
                <div className="text-center py-20 text-brand-charcoal/50">
                  Loading auth portal...
                </div>
              }
            >
              <AuthForm />
            </Suspense>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
