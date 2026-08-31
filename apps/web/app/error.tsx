"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected application errors to monitoring service
    console.error("Application runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F1ECE1] text-[#1C1B18] flex items-center justify-center p-6 font-sans">
      <div className="max-w-lg w-full bg-white border border-[#1C1B18]/15 p-8 sm:p-12 text-center shadow-xl space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#A9784F]/15 flex items-center justify-center mx-auto text-[#A9784F]">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-label tracking-[0.25em] text-[#A9784F] uppercase font-semibold block">
            System Notice
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-[#1C1B18]">
            Momentary Disruption
          </h1>
        </div>

        <p className="text-sm text-[#1C1B18]/65 font-body font-light leading-relaxed">
          We encountered an unexpected issue while preparing your sanctuary experience.
          Our team has been notified.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto text-xs font-label uppercase tracking-widest bg-[#1C1B18] text-[#F1ECE1] hover:bg-[#1C1B18]/85 px-8 py-5 rounded-none font-semibold flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto text-xs font-label uppercase tracking-widest border-[#1C1B18]/20 hover:bg-[#1C1B18] hover:text-[#F1ECE1] px-8 py-5 rounded-none font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Link href="/">
              <Home className="h-3.5 w-3.5" />
              <span>Return Home</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
