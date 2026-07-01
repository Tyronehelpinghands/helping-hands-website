"use client";

import Image from "next/image";
import { useState } from "react";

export type StockImageProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  placeholderLabel?: string;
};

export default function StockImage({
  src,
  alt,
  className = "",
  imageClassName = "object-cover",
  fill = false,
  width = 1200,
  height = 800,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  placeholderLabel,
}: StockImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`stock-image-placeholder ${className}`}
        role="img"
        aria-label={alt}
      >
        <span className="text-xs font-bold uppercase tracking-[0.15em] text-white/60">
          {placeholderLabel ?? "Foto volgt"}
        </span>
      </div>
    );
  }

  if (fill) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={imageClassName}
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        className={`h-full w-full ${imageClassName}`}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
