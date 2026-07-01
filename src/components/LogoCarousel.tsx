import LogoImage from "@/components/LogoImage";
import { logoImagePath, logoIntro, logos } from "@/lib/logos";

export default function LogoCarousel() {
  const track = [...logos, ...logos];

  return (
    <section className="border-y border-slate-200/80 bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-bold uppercase tracking-[0.18em] text-[#F28C28]">
          Projectervaring
        </p>
        <p className="mx-auto mt-3 max-w-3xl text-center text-sm leading-7 text-[#101828]/70 sm:text-base">
          {logoIntro}
        </p>
      </div>

      <div className="relative mt-8 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-24" />
        <div className="logo-carousel-track flex w-max gap-4 px-4">
          {track.map((logo, index) => (
            <LogoImage
              key={`${logo.slug}-${index}`}
              name={logo.name}
              src={logoImagePath(logo)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
