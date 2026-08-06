"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Clock } from "lucide-react";
import { ServiceDetail } from "./services-data";

interface ServiceCardProps {
  service: ServiceDetail;
  index?: number;
}

export function ServiceCard({ service, index }: ServiceCardProps) {
  return (
    <Link
      href={`/services/${service.id}`}
      className="group flex flex-col bg-[#F1ECE1] hover:bg-white transition-colors duration-300"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={service.image}
          alt={service.name}
          className="absolute inset-0 w-full h-full object-cover object-center grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
        />
        {typeof index === "number" && (
          <span className="absolute top-5 left-5 font-display italic text-3xl text-white drop-shadow-md">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-7 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-label tracking-[0.2em] uppercase font-semibold text-[#3F4F41]">
            {service.category}
          </span>
          {"duration" in service &&
          (service as { duration?: number }).duration ? (
            <span className="text-xs font-body text-[#1C1B18]/45 flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              {(service as { duration?: number }).duration} min
            </span>
          ) : null}
        </div>

        <h3 className="font-display text-2xl text-[#1C1B18] leading-tight group-hover:text-[#A9784F] transition-colors">
          {service.name}
        </h3>

        <p className="text-sm text-[#1C1B18]/60 font-body font-light leading-relaxed flex-1 line-clamp-3">
          {service.description}
        </p>

        <div className="pt-5 border-t border-[#1C1B18]/10 flex items-center gap-1 text-[10px] font-label uppercase tracking-[0.15em] font-semibold text-[#A9784F]">
          <span>View Details</span>
          <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
