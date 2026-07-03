import { BrandLogoImage } from "@/components/BrandLogo";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export default function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="hero-gradient relative overflow-hidden text-white">
      <div className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-[#F28C28]/15 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
        <div>
          {eyebrow && (
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85">
            {description}
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-8 shadow-2xl backdrop-blur-sm">
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#F28C28]/20 blur-2xl" />
          <div className="relative">
            <BrandLogoImage
              variant="markWhite"
              imageClassName="h-12 w-12"
            />
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-[#F28C28]">
              Event staffing
            </p>
            <p className="mt-3 text-2xl font-black leading-tight">
              Crew die begrijpt wat er op locatie nodig is.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {["Planning", "Briefing", "Uitvoering", "Terugkoppeling"].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-bold"
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
