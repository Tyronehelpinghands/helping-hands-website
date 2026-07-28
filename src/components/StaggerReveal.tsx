"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type StaggerRevealProps = {
  children: ReactNode;
  className?: string;
  /** Base delay between children (ms). */
  stepMs?: number;
};

/**
 * One IntersectionObserver; children stagger via CSS `--stagger-index`.
 * No animation libraries.
 */
export default function StaggerReveal({
  children,
  className,
  stepMs = 70,
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-inview={inView ? "true" : "false"}
      className={cn("stagger-reveal", className)}
      style={{ ["--stagger-step" as string]: `${stepMs}ms` }}
    >
      {children}
    </div>
  );
}
