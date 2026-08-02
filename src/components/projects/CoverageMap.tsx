"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type CountryId = "nl" | "be" | "de";

type Country = {
  id: CountryId;
  label: string;
  short: string;
  path: string;
  labelX: number;
  labelY: number;
  /** Stronger default emphasis for NL */
  emphasis: "strong" | "soft";
};

/**
 * Simplified GeoJSON-derived outlines (equirectangular), framed on NL with BE/DE.
 * Paths are illustrative silhouettes — not cadastral borders.
 */
const COUNTRIES: Country[] = [
  {
    id: "nl",
    label: "Nederland",
    short: "NL",
    emphasis: "strong",
    labelX: 173,
    labelY: 152,
    path: "M106.4,236.0L89.7,230.5L75.5,224.0L60.6,216.5L53.2,202.4L54.4,187.2L64.9,173.2L81.6,159.1L95.9,144.0L106.4,126.6L116.3,111.5L126.8,94.2L131.1,75.8L137.3,54.1L151.5,35.7L170.1,21.6L188.7,14.1L210.3,10.8L232.0,14.1L250.5,18.4L269.1,29.2L281.4,40.0L285.8,59.5L283.3,83.3L277.1,108.2L270.9,129.9L269.1,151.5L275.3,169.9L279.6,187.2L262.9,191.6L244.3,187.2L228.9,180.8L213.4,191.6L205.4,213.2L199.2,230.5L184.3,245.7L167.0,254.4L148.5,252.2L129.9,245.7L117.5,238.1Z",
  },
  {
    id: "be",
    label: "België",
    short: "BE",
    emphasis: "soft",
    labelX: 114,
    labelY: 325,
    path: "M3.1,267.3L21.6,256.5L43.3,248.9L64.9,243.5L89.7,237.0L114.4,232.7L139.2,232.7L160.8,238.1L179.4,245.7L197.9,259.8L213.4,278.2L225.8,299.8L235.1,324.7L238.1,346.4L233.8,368.0L222.7,389.6L210.3,416.7L197.9,432.9L179.4,438.4L157.7,436.2L129.9,429.7L105.2,416.7L80.4,400.5L55.7,378.8L34.0,360.4L15.5,338.8L3.1,313.9L-1.2,292.2Z",
  },
  {
    id: "de",
    label: "Duitsland",
    short: "DE",
    emphasis: "soft",
    labelX: 439,
    labelY: 233,
    path: "M281.4,37.9L309.3,21.6L340.2,10.8L371.1,5.4L402.1,3.2L433.0,5.4L463.9,7.6L494.8,10.8L525.8,16.2L556.7,21.6L587.6,32.5L596.9,59.5L593.8,97.4L587.6,135.3L593.8,167.8L600.0,205.6L596.9,243.5L587.6,276.0L575.3,308.5L556.7,335.5L535.1,357.2L513.4,373.4L488.7,389.6L463.9,400.5L436.1,405.9L408.2,400.5L383.5,384.2L364.9,362.6L355.7,335.5L349.5,308.5L334.0,286.8L312.4,270.6L290.7,254.4L272.2,232.7L256.7,211.1L247.4,189.4L250.5,162.4L262.9,135.3L272.2,108.2L278.4,75.8Z",
  },
];

const HILVERSUM = { x: 165.5, y: 143 };

export default function CoverageMap() {
  const [active, setActive] = useState<CountryId | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 40);
    return () => window.clearTimeout(id);
  }, []);

  const activeCountry = COUNTRIES.find((c) => c.id === active) ?? null;

  return (
    <div
      className={cn(
        "hh-coverage-map relative mx-auto aspect-[5/4] w-full max-w-xl overflow-hidden rounded-[1.75rem] border border-white/15 bg-[radial-gradient(ellipse_at_28%_18%,rgba(242,140,40,0.14),transparent_48%),linear-gradient(165deg,#122a5c_0%,#0B1F4D_52%,#173A8A_100%)] sm:aspect-[4/3] lg:mx-0 lg:max-w-none",
        ready && "hh-coverage-map--ready",
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.28) 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
        aria-hidden="true"
      />

      <svg
        viewBox="-20 -15 640 475"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="Kaart van Nederland, België en Duitsland met Hilversum als vestiging"
      >
        <title>Werkgebied: Nederland, België en Duitsland</title>
        <defs>
          <filter
            id="hh-country-glow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter
            id="hh-marker-glow"
            x="-80%"
            y="-80%"
            width="260%"
            height="260%"
          >
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className="hh-coverage-map__countries">
          {COUNTRIES.map((country, index) => {
            const isActive = active === country.id;
            const isStrong = country.emphasis === "strong";
            const fill = isActive
              ? "rgba(242,140,40,0.42)"
              : isStrong
                ? "rgba(242,140,40,0.22)"
                : "rgba(255,255,255,0.08)";
            const stroke = isActive
              ? "rgba(242,140,40,0.95)"
              : isStrong
                ? "rgba(242,140,40,0.62)"
                : "rgba(255,255,255,0.28)";

            return (
              <g
                key={country.id}
                className="hh-coverage-map__country"
                style={{ animationDelay: `${120 + index * 90}ms` }}
              >
                <path
                  d={country.path}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={isActive ? 2.4 : isStrong ? 2 : 1.5}
                  filter={isActive || isStrong ? "url(#hh-country-glow)" : undefined}
                  className="cursor-pointer transition-[fill,stroke,stroke-width] duration-300 ease-out outline-none"
                  tabIndex={0}
                  role="button"
                  aria-label={country.label}
                  aria-pressed={isActive}
                  onMouseEnter={() => setActive(country.id)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(country.id)}
                  onBlur={() => setActive(null)}
                />
                <text
                  x={country.labelX}
                  y={country.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="pointer-events-none select-none"
                  fill={
                    isActive
                      ? "rgba(255,255,255,0.95)"
                      : isStrong
                        ? "rgba(255,255,255,0.72)"
                        : "rgba(255,255,255,0.45)"
                  }
                  fontSize={isStrong ? 15 : 13}
                  fontWeight={700}
                  letterSpacing="0.14em"
                >
                  {country.short}
                </text>
              </g>
            );
          })}
        </g>

        <g
          className="hh-coverage-map__marker"
          transform={`translate(${HILVERSUM.x} ${HILVERSUM.y})`}
          filter="url(#hh-marker-glow)"
        >
          <circle
            r="14"
            fill="rgba(242,140,40,0.22)"
            className="hh-coverage-map__pulse"
          />
          <circle
            r="22"
            fill="none"
            stroke="rgba(242,140,40,0.35)"
            strokeWidth="1.5"
            className="hh-coverage-map__pulse hh-coverage-map__pulse--late"
          />
          <circle r="5.5" fill="#F28C28" stroke="rgba(255,255,255,0.85)" strokeWidth="1.75" />
          <text
            x="0"
            y="-18"
            textAnchor="middle"
            className="pointer-events-none select-none"
            fill="#FFFFFF"
            fontSize="11"
            fontWeight={700}
          >
            Hilversum
          </text>
        </g>
      </svg>

      <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3 sm:bottom-4 sm:left-4 sm:right-4">
        <div
          className={cn(
            "rounded-xl border border-white/15 bg-[#0B1F4D]/75 px-3 py-2 text-xs font-semibold text-white/90 backdrop-blur-sm transition duration-300",
            activeCountry ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1",
          )}
          aria-live="polite"
        >
          {activeCountry
            ? activeCountry.id === "nl"
              ? "Nederland — primaire inzet"
              : `${activeCountry.label} — grensoverschrijdende inzet`
            : null}
        </div>
        <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/80 backdrop-blur-sm">
          HQ Hilversum
        </div>
      </div>
    </div>
  );
}
