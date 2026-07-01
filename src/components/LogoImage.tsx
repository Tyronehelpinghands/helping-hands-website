"use client";

import Image from "next/image";
import { useState } from "react";

type LogoImageProps = {
  name: string;
  src: string;
  className?: string;
  interactive?: boolean;
  size?: "carousel" | "grid";
};

export default function LogoImage({
  name,
  src,
  className = "",
  interactive = false,
  size = "carousel",
}: LogoImageProps) {
  const [failed, setFailed] = useState(false);
  const heightClass = size === "grid" ? "h-24" : "h-20";
  const minWidthClass = size === "grid" ? "min-w-0 w-full" : "min-w-[10rem] shrink-0";

  if (failed) {
    return (
      <div
        className={`flex ${heightClass} ${minWidthClass} items-center justify-center rounded-2xl border border-slate-200/80 bg-gradient-to-br from-[#F5F7FA] via-white to-[#173A8A]/5 px-4 shadow-sm ${className}`}
        role="img"
        aria-label={name}
      >
        <span className="text-center text-xs font-bold leading-snug text-[#173A8A]">
          {name}
        </span>
      </div>
    );
  }

  const imageClass = interactive
    ? "max-h-12 w-auto object-contain grayscale transition duration-300 group-hover:grayscale-0 group-hover:scale-105"
    : "max-h-12 w-auto object-contain";

  return (
    <div
      className={`relative flex ${heightClass} ${minWidthClass} items-center justify-center rounded-2xl border border-slate-200/80 bg-white px-5 shadow-sm transition duration-300 ${
        interactive
          ? "group-hover:-translate-y-0.5 group-hover:border-[#F28C28]/50 group-hover:shadow-lg group-hover:shadow-[#F28C28]/10"
          : ""
      } ${className}`}
    >
      <Image
        src={src}
        alt={name}
        width={160}
        height={64}
        className={imageClass}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
