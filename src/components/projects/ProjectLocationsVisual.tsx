import RevealOnScroll from "@/components/RevealOnScroll";
import { siteConfig } from "@/lib/siteConfig";
import { cn } from "@/lib/utils";

/**
 * Abstract NL locations visual — no map library.
 * Soft regional markers; no hard claims that every city is a confirmed work site.
 */
type RegionPin = {
  name: string;
  x: string;
  y: string;
  home?: boolean;
};

const regions: RegionPin[] = [
  { name: "Amsterdam", x: "32%", y: "28%" },
  { name: "Hilversum", x: "42%", y: "38%", home: true },
  { name: "Utrecht", x: "40%", y: "48%" },
  { name: "Den Haag", x: "22%", y: "52%" },
  { name: "Rotterdam", x: "28%", y: "62%" },
  { name: "Arnhem", x: "58%", y: "48%" },
  { name: "Eindhoven", x: "52%", y: "72%" },
];

export default function ProjectLocationsVisual() {
  return (
    <section className="overflow-hidden bg-[#0B1F4D] py-16 text-white sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F28C28]">
              Bereik
            </p>
            <h2 className="mt-3 text-2xl font-black sm:text-3xl">
              Landelijke inzet vanuit {siteConfig.address.city}
            </h2>
            <p className="mt-4 text-base leading-8 text-white/75">
              Helping Hands Agency is gevestigd in {siteConfig.address.city} en
              levert event personeel Nederland-breed — van festivals en
              concerten tot beurzen en stadions. Onderstaande regio’s zijn
              illustratief voor landelijke bereikbaarheid, geen exhaustieve
              claimlijst.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delayMs={100}>
          <div className="relative mt-10 aspect-[16/11] w-full max-w-3xl overflow-hidden rounded-[1.75rem] border border-white/15 bg-[radial-gradient(ellipse_at_30%_20%,rgba(242,140,40,0.18),transparent_50%),linear-gradient(160deg,#122a5c_0%,#0B1F4D_55%,#173A8A_100%)] sm:aspect-[2/1]">
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, transparent 0)",
                backgroundSize: "28px 28px",
              }}
              aria-hidden="true"
            />

            {regions.map((region) => (
              <div
                key={region.name}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: region.x, top: region.y }}
              >
                <div className="flex flex-col items-center gap-1.5">
                  <span
                    className={cn(
                      "relative flex h-3.5 w-3.5 items-center justify-center",
                      region.home && "h-4 w-4",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute inset-0 animate-ping rounded-full opacity-40",
                        region.home ? "bg-[#F28C28]" : "bg-white",
                      )}
                      style={{ animationDuration: "2.4s" }}
                    />
                    <span
                      className={cn(
                        "relative rounded-full",
                        region.home
                          ? "h-3.5 w-3.5 bg-[#F28C28] ring-2 ring-white/40"
                          : "h-2.5 w-2.5 bg-white/90",
                      )}
                    />
                  </span>
                  <span
                    className={cn(
                      "whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-bold sm:text-xs",
                      region.home
                        ? "bg-[#F28C28] text-white"
                        : "bg-white/10 text-white/90 backdrop-blur-sm",
                    )}
                  >
                    {region.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
