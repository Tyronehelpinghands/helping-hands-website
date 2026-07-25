import Image from "next/image";
import type { ReactNode } from "react";
import Reveal from "@/components/over-ons/Reveal";
import type { CrewPhoto } from "@/lib/crewPhotos";
import { cn } from "@/lib/utils";

type OverOnsSplitSectionProps = {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  photo: CrewPhoto;
  reverse?: boolean;
  children?: ReactNode;
  className?: string;
};

export default function OverOnsSplitSection({
  eyebrow,
  title,
  paragraphs,
  photo,
  reverse = false,
  children,
  className,
}: OverOnsSplitSectionProps) {
  return (
    <section className={cn("py-12 sm:py-16 lg:py-20", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "grid items-center gap-8 lg:grid-cols-2 lg:gap-12",
            reverse && "lg:[&>*:first-child]:order-2",
          )}
        >
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              {eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0B1F4D] sm:text-4xl">
              {title}
            </h2>
            <div className="mt-5 space-y-4 text-base leading-8 text-[#101828]/80 sm:text-lg">
              {paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>
            {children}
          </Reveal>

          <Reveal delayMs={80}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100 shadow-xl sm:aspect-[5/4] lg:aspect-[4/5] lg:min-h-[28rem]">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition duration-500 hover:scale-105"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
