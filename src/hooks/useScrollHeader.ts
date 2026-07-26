"use client";

import { useEffect, useState } from "react";

const SCROLL_THRESHOLD = 24;

export type ScrollHeaderState = {
  scrolled: boolean;
  progress: number;
};

/**
 * Sticky/fixed header scroll state + optional page scroll progress (0–1).
 */
export function useScrollHeader(threshold = SCROLL_THRESHOLD): ScrollHeaderState {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > threshold);

      const doc = document.documentElement;
      const max = Math.max(doc.scrollHeight - window.innerHeight, 1);
      setProgress(Math.min(Math.max(y / max, 0), 1));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return { scrolled, progress };
}

/** Routes where the first viewport is a dark hero — header can sit transparent on top. */
export function pathHasDarkHero(pathname: string | null): boolean {
  if (!pathname) return false;

  const darkExact = new Set([
    "/",
    "/diensten",
    "/opdrachtgevers",
    "/medewerkers",
    "/vacatures",
    "/projecten",
    "/over-ons",
    "/contact",
    "/login",
    "/portaal",
    "/portaal/intern",
    "/forgot-password",
    "/update-password",
  ]);

  if (darkExact.has(pathname)) return true;
  if (pathname.startsWith("/diensten/")) return true;
  return false;
}
