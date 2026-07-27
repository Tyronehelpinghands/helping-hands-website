import Link from "next/link";
import { cn } from "@/lib/utils";

type ProjectCtaProps = {
  variant?: "mid" | "end";
};

const copy = {
  mid: {
    title: "Personeel nodig voor je volgende productie?",
    text: "Vertel ons datum, locatie, tijden, functies en aantallen. Wij denken mee in de juiste crew, briefing en planning.",
    primary: { label: "Personeel aanvragen", href: "/contact" },
    secondary: { label: "Bekijk diensten", href: "/diensten" },
  },
  end: {
    title: "Van aanvraag tot crew op locatie.",
    text: "Helping Hands helpt met praktische mensen voor events, horeca, stagebouw, productie en logistiek.",
    primary: { label: "Start aanvraag", href: "/contact" },
    secondary: { label: "Bekijk diensten", href: "/diensten" },
  },
} as const;

export default function ProjectCta({ variant = "end" }: ProjectCtaProps) {
  const content = copy[variant];

  return (
    <section
      className={cn(
        "relative overflow-hidden py-16 text-white sm:py-20",
        variant === "mid"
          ? "bg-[linear-gradient(145deg,#122a5c_0%,#0B1F4D_45%,#173A8A_100%)]"
          : "hero-gradient",
      )}
    >
      <div
        className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-[#F28C28]/15 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-black sm:text-3xl">{content.title}</h2>
        <p className="mt-4 text-base leading-8 text-white/85 sm:text-lg">
          {content.text}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={content.primary.href}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#F28C28] px-8 py-3.5 text-base font-bold text-white shadow-xl shadow-black/25 transition hover:bg-[#de7c1f] focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:w-auto"
          >
            {content.primary.label}
          </Link>
          <Link
            href={content.secondary.href}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full border-2 border-white/35 bg-white/5 px-8 py-3.5 text-base font-bold backdrop-blur-sm transition hover:bg-white hover:text-[#0B1F4D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] sm:w-auto"
          >
            {content.secondary.label}
          </Link>
        </div>
        {variant === "end" ? (
          <p className="mt-6 text-sm text-white/60">
            Ook interessant:{" "}
            <Link href="/opdrachtgevers" className="font-semibold underline-offset-4 hover:underline">
              opdrachtgevers
            </Link>{" "}
            ·{" "}
            <Link href="/over-ons" className="font-semibold underline-offset-4 hover:underline">
              over ons
            </Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}
