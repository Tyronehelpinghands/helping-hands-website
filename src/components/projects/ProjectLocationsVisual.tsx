import RevealOnScroll from "@/components/RevealOnScroll";
import CoverageMap from "@/components/projects/CoverageMap";
import { siteConfig } from "@/lib/siteConfig";
import { cn } from "@/lib/utils";

const countries = [
  { id: "nl", label: "Nederland", tone: "bg-[#F28C28]/20 text-[#F28C28] ring-[#F28C28]/35" },
  { id: "be", label: "België", tone: "bg-white/10 text-white/90 ring-white/20" },
  { id: "de", label: "Duitsland", tone: "bg-white/10 text-white/90 ring-white/20" },
] as const;

export default function ProjectLocationsVisual() {
  return (
    <section className="overflow-hidden bg-[#0B1F4D] py-16 text-white sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14">
          <RevealOnScroll>
            <div className="max-w-xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F28C28]">
                Bereik
              </p>
              <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl lg:text-[2.15rem] lg:leading-tight">
                Landelijke en internationale inzet vanuit{" "}
                {siteConfig.address.city}
              </h2>
              <p className="mt-4 text-base leading-8 text-white/75">
                Helping Hands Agency is gevestigd in {siteConfig.address.city}{" "}
                en levert eventpersoneel door heel Nederland, en ook in België
                en Duitsland.
              </p>

              <ul className="mt-7 flex flex-wrap gap-2" aria-label="Werkgebieden">
                {countries.map((country) => (
                  <li
                    key={country.id}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-xs font-bold ring-1",
                      country.tone,
                    )}
                  >
                    {country.label}
                  </li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delayMs={100} variant="right">
            <CoverageMap />
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
