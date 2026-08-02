import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";
import { openApplyMailto } from "@/lib/vacancies";
import { applicationsEmail } from "@/lib/navigation";
import { cn } from "@/lib/utils";

function CtaLink({
  href,
  label,
  variant,
}: {
  href: string;
  label: string;
  variant: "primary" | "secondary";
}) {
  const className = cn(
    "inline-flex min-h-11 items-center justify-center rounded-full px-8 py-3.5 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1F4D]",
    variant === "primary"
      ? "bg-[#F28C28] text-white shadow-xl hover:bg-[#de7c1f]"
      : "border-2 border-white/35 bg-white/5 text-white hover:bg-white hover:text-[#0B1F4D]",
  );

  if (href.startsWith("mailto:") || href.startsWith("#")) {
    return (
      <a href={href} className={className}>
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

export default function VacancyCta() {
  return (
    <section className="bg-[#F5F7FA] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="relative overflow-hidden rounded-[2rem] bg-[#0B1F4D] px-6 py-12 text-white shadow-2xl shadow-[#0B1F4D]/25 sm:px-12 sm:py-16">
            <div
              className="pointer-events-none absolute -left-16 top-0 h-48 w-48 rounded-full bg-[#F28C28]/25 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-white/10 blur-2xl"
              aria-hidden="true"
            />
            <div className="relative mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
                Crew aanmelden
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Klaar om te werken bij Helping Hands?
              </h2>
              <p className="mt-4 text-base leading-8 text-white/75 sm:text-lg">
                Meld je aan voor flexibele klussen in events, horeca, stagebouw,
                productie of keuken. Helping Hands combineert professionele
                uitvoering met een eerlijke kans om ervaring en structuur op te
                bouwen.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <CtaLink
                  href={openApplyMailto}
                  label="Aanmelden als crewlid"
                  variant="primary"
                />
                <CtaLink
                  href="#vacatures"
                  label="Bekijk functies"
                  variant="secondary"
                />
              </div>
              <p className="mt-6 text-sm text-white/60">
                Mail naar{" "}
                <a
                  href={openApplyMailto}
                  className="font-bold text-[#F28C28] underline-offset-4 hover:underline"
                >
                  {applicationsEmail}
                </a>
                . Meer context?{" "}
                <Link
                  href="/werken-bij"
                  className="font-bold text-white underline-offset-4 hover:underline"
                >
                  Medewerkers
                </Link>
                ,{" "}
                <Link
                  href="/diensten"
                  className="font-bold text-white underline-offset-4 hover:underline"
                >
                  diensten
                </Link>
                ,{" "}
                <Link
                  href="/over-ons"
                  className="font-bold text-white underline-offset-4 hover:underline"
                >
                  over ons
                </Link>
                ,{" "}
                <Link
                  href="/contact"
                  className="font-bold text-white underline-offset-4 hover:underline"
                >
                  contact
                </Link>{" "}
                of het{" "}
                <Link
                  href="/portaal/medewerkers"
                  className="font-bold text-white underline-offset-4 hover:underline"
                >
                  medewerkersportaal
                </Link>
                .
              </p>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
