"use client";

import React from "react";
import { Button } from "@repo/ui/button";
import { PackageOpen, LucideIcon } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title = "No Items Found",
  description = "There are currently no items available to display.",
  icon: Icon = PackageOpen,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white/50 border border-[#1C1B18]/10 max-w-xl mx-auto rounded-none ${className}`}
    >
      <div className="w-14 h-14 bg-[#A9784F]/10 text-[#A9784F] rounded-full flex items-center justify-center mb-5 shrink-0">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="font-display text-2xl text-[#1C1B18] mb-2 font-medium">
        {title}
      </h3>
      <p className="text-sm text-[#1C1B18]/65 font-body font-light leading-relaxed max-w-md mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="text-xs font-label uppercase tracking-widest bg-[#1C1B18] text-[#F1ECE1] px-8 py-4 rounded-none hover:bg-[#1C1B18]/85 font-semibold transition-colors cursor-pointer"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
