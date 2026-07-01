import Link from "next/link";
import LogoImage from "@/components/LogoImage";
import {
  logoImagePath,
  logoSectionIntroShort,
  logoSectionTitle,
  logos,
} from "@/lib/logos";

type LogoCarouselProps = {
  showCta?: boolean;
};

export default function LogoCarousel({ showCta = true }: LogoCarouselProps) {
  const track = [...logos, ...logos];

  return (
    <section className="overflow-hidden border-y border-slate-200/80 bg-[#F5F7FA] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F28C28]">
            Projectervaring
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0B1F4D] sm:text-4xl">
            {logoSectionTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-[#101828]/75">
            {logoSectionIntroShort}
          </p>
          {showCta && (
            <Link
              href="/projecten"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-[#173A8A] px-7 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#0B1F4D] focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2"
            >
              Bekijk projectervaring
            </Link>
          )}
        </div>
      </div>

      <div className="relative mt-10 w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#F5F7FA] to-transparent sm:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#F5F7FA] to-transparent sm:w-20" />
        <div className="logo-carousel-track flex w-max gap-4 px-4 sm:gap-5">
          {track.map((logo, index) => (
            <div key={`${logo.slug}-${index}`} className="group">
              <LogoImage
                name={logo.name}
                src={logoImagePath(logo)}
                interactive
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
