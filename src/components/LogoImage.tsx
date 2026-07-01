"use client";

import Image from "next/image";
import { useState } from "react";

type LogoImageProps = {
  name: string;
  src: string;
  className?: string;
};

export default function LogoImage({ name, src, className = "" }: LogoImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex h-20 min-w-[9rem] items-center justify-center rounded-xl border border-slate-200/80 bg-gradient-to-br from-[#F5F7FA] via-white to-[#F5F7FA] px-4 shadow-sm ${className}`}
        role="img"
        aria-label={name}
      >
        <span className="text-center text-xs font-bold leading-snug text-[#173A8A]">
          {name}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative flex h-20 min-w-[9rem] items-center justify-center rounded-xl border border-slate-200/80 bg-white px-4 shadow-sm ${className}`}
    >
      <Image
        src={src}
        alt={name}
        width={140}
        height={56}
        className="max-h-12 w-auto object-contain"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
