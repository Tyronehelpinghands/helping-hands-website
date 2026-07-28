import RevealOnScroll from "@/components/RevealOnScroll";
import { siteConfig } from "@/lib/siteConfig";
import { cn } from "@/lib/utils";

/**
 * Illustrative Benelux + Germany reach visual — no map library.
 * Pins are indicative of reachability, not an exhaustive claim list.
 */
type RegionPin = {
  name: string;
  x: string;
  y: string;
  home?: boolean;
  country?: "nl" | "be" | "de";
};

const regions: RegionPin[] = [
  { name: "Amsterdam", x: "34%", y: "28%", country: "nl" },
  { name: "Hilversum", x: "40%", y: "34%", home: true, country: "nl" },
  { name: "Utrecht", x: "38%", y: "40%", country: "nl" },
  { name: "Den Haag", x: "26%", y: "42%", country: "nl" },
  { name: "Rotterdam", x: "30%", y: "48%", country: "nl" },
  { name: "Eindhoven", x: "42%", y: "54%", country: "nl" },
  { name: "Antwerpen", x: "28%", y: "62%", country: "be" },
  { name: "Brussel", x: "24%", y: "72%", country: "be" },
  { name: "Keulen", x: "58%", y: "48%", country: "de" },
  { name: "Düsseldorf", x: "54%", y: "40%", country: "de" },
];

const countries = [
  { id: "nl", label: "Nederland", tone: "bg-[#F28C28]/20 text-[#F28C28] ring-[#F28C28]/35" },
  { id: "be", label: "België", tone: "bg-white/10 text-white/90 ring-white/20" },
  { id: "de", label: "Duitsland", tone: "bg-white/10 text-white/90 ring-white/20" },
] as const;

export default function ProjectLocationsVisual() {
  return (
    <section className="overflow-hidden bg-[#0B1F4D] py-16 text-white sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14">
          <RevealOnScroll>
            <div className="max-w-xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F28C28]">
                Bereik
              </p>
              <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                Landelijke en internationale inzet vanuit{" "}
                {siteConfig.address.city}
              </h2>
              <p className="mt-4 text-base leading-8 text-white/75">
                Helping Hands Agency is gevestigd in {siteConfig.address.city}{" "}
                en levert eventpersoneel door heel Nederland — van festivals en
                concerten tot beurzen en stadions. We zetten ook crew in in
                België en Duitsland. Onderstaande regio’s en landen zijn
                illustratief voor bereikbaarheid, geen exhaustieve claimlijst.
              </p>

              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Werkgebieden">
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

          <RevealOnScroll delayMs={100}>
            <div className="relative mx-auto aspect-[5/4] w-full max-w-xl overflow-hidden rounded-[1.75rem] border border-white/15 bg-[radial-gradient(ellipse_at_30%_20%,rgba(242,140,40,0.16),transparent_50%),linear-gradient(160deg,#122a5c_0%,#0B1F4D_55%,#173A8A_100%)] sm:aspect-[4/3] lg:mx-0 lg:max-w-none">
              <div
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, transparent 0)",
                  backgroundSize: "28px 28px",
                }}
                aria-hidden="true"
              />

              {/* Simplified NL / BE / DE silhouette map */}
              <svg
                viewBox="0 0 400 320"
                className="absolute inset-0 h-full w-full"
                role="img"
                aria-label="Illustratieve kaart van Nederland, België en Duitsland met Hilversum als basis"
              >
                <title>
                  Illustratieve kaart: Nederland, België en Duitsland
                </title>

                {/* Germany (east) */}
                <path
                  d="M210 40 L292 36 L330 78 L338 150 L318 220 L270 250 L248 210 L230 160 L218 110 Z"
                  fill="rgba(255,255,255,0.07)"
                  stroke="rgba(255,255,255,0.22)"
                  strokeWidth="1.5"
                />
                {/* Netherlands */}
                <path
                  d="M118 48 L168 42 L198 70 L210 118 L198 168 L168 198 L128 188 L98 150 L92 100 L108 62 Z"
                  fill="rgba(242,140,40,0.18)"
                  stroke="rgba(242,140,40,0.55)"
                  strokeWidth="1.75"
                />
                {/* Belgium */}
                <path
                  d="M98 188 L148 178 L178 198 L168 238 L118 252 L88 228 L90 200 Z"
                  fill="rgba(255,255,255,0.09)"
                  stroke="rgba(255,255,255,0.28)"
                  strokeWidth="1.5"
                />

                {/* Soft country labels on map */}
                <text
                  x="148"
                  y="118"
                  fill="rgba(255,255,255,0.45)"
                  fontSize="11"
                  fontWeight="700"
                  letterSpacing="0.08em"
                >
                  NL
                </text>
                <text
                  x="118"
                  y="220"
                  fill="rgba(255,255,255,0.4)"
                  fontSize="11"
                  fontWeight="700"
                  letterSpacing="0.08em"
                >
                  BE
                </text>
                <text
                  x="268"
                  y="130"
                  fill="rgba(255,255,255,0.4)"
                  fontSize="11"
                  fontWeight="700"
                  letterSpacing="0.08em"
                >
                  DE
                </text>

                {/* Hub lines from Hilversum */}
                <g stroke="rgba(242,140,40,0.35)" strokeWidth="1" fill="none">
                  <path d="M160 108 L120 134" />
                  <path d="M160 108 L132 154" />
                  <path d="M160 108 L170 172" />
                  <path d="M160 108 L118 198" />
                  <path d="M160 108 L108 230" />
                  <path d="M160 108 L232 128" />
                  <path d="M160 108 L248 154" />
                </g>
              </svg>

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
      </div>
    </section>
  );
}
