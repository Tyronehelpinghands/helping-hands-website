import Link from "next/link";
import {
  contactPhoneDisplay,
  contactPhoneTel,
  contactWhatsappUrl,
} from "@/lib/navigation";

type RegionalCTAProps = {
  city: string;
  /** e.g. "event crew", "stagehands" — used in the default title/text. */
  serviceLabel?: string;
  title?: string;
  description?: string;
  className?: string;
};

/**
 * Reusable regional CTA for location and project-case pages:
 * "Crew nodig in {city}?" with request / call / WhatsApp actions.
 */
export default function RegionalCTA({
  city,
  serviceLabel = "crew",
  title,
  description,
  className,
}: RegionalCTAProps) {
  const heading = title ?? `${serviceLabel[0].toUpperCase()}${serviceLabel.slice(1)} nodig in ${city}?`;
  const body =
    description ??
    `Deel datum, locatie, tijden, functies en aantal mensen. Wij denken mee over bezetting en briefing voor jouw productie in ${city}.`;

  return (
    <section
      className={
        className ??
        "hero-gradient relative overflow-hidden py-16 text-white sm:py-20"
      }
    >
      <div
        className="pointer-events-none absolute -left-16 top-0 h-56 w-56 rounded-full bg-[#F28C28]/20 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-black sm:text-3xl">{heading}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/85 sm:text-lg">
          {body}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/contact"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#F28C28] px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-black/25 transition hover:bg-[#de7c1f] focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:w-auto"
          >
            Vraag personeel aan
          </Link>
          <a
            href={`tel:${contactPhoneTel}`}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full border-2 border-white/35 bg-white/5 px-7 py-3.5 text-sm font-bold backdrop-blur-sm transition hover:bg-white hover:text-[#0B1F4D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] sm:w-auto"
          >
            Bel planning {contactPhoneDisplay}
          </a>
          <a
            href={contactWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full border-2 border-white/35 bg-white/5 px-7 py-3.5 text-sm font-bold backdrop-blur-sm transition hover:bg-white hover:text-[#0B1F4D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] sm:w-auto"
          >
            WhatsApp planning
          </a>
        </div>
      </div>
    </section>
  );
}
