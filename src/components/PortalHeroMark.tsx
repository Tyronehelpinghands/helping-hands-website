import type { ReactNode } from "react";
import { BrandLogoImage } from "@/components/BrandLogo";

type PortalHeroMarkProps = {
  label: string;
  title: string;
  description: string;
  action?: ReactNode;
};

export default function PortalHeroMark({
  label,
  title,
  description,
  action,
}: PortalHeroMarkProps) {
  return (
    <section className="hero-gradient text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-14 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-8 lg:py-16">
        <div>
          <div className="flex items-center gap-3">
            <BrandLogoImage
              variant="markWhite"
              imageClassName="h-10 w-10 opacity-90"
            />
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              {label}
            </p>
          </div>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-white/80">
            {description}
          </p>
        </div>
        {action}
      </div>
    </section>
  );
}
