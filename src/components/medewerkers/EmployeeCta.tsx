import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";
import { employeeApplyMailto } from "@/lib/employeePage";
import { applicationsEmail } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type EmployeeCtaProps = {
  variant?: "mid" | "end";
};

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
    "inline-flex min-h-11 items-center justify-center rounded-full px-8 py-3.5 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2",
    variant === "primary"
      ? "bg-[#F28C28] text-white shadow-xl hover:bg-[#de7c1f] focus-visible:ring-offset-[#0B1F4D]"
      : "border-2 border-white/35 bg-white/5 text-white hover:bg-white hover:text-[#0B1F4D] focus-visible:ring-offset-[#0B1F4D]",
  );

  if (href.startsWith("mailto:")) {
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

export default function EmployeeCta({ variant = "end" }: EmployeeCtaProps) {
  const isMid = variant === "mid";

  return (
    <section className={isMid ? "bg-white py-12 sm:py-16" : "bg-[#F5F7FA] py-16 sm:py-24"}>
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
                {isMid ? "Past dit bij jou?" : "Aanmelden"}
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                {isMid
                  ? "Wil je weten welke klus bij jou past?"
                  : "Klaar om mee te draaien?"}
              </h2>
              <p className="mt-4 text-base leading-8 text-white/75 sm:text-lg">
                {isMid
                  ? "Meld je aan en vertel kort wat je zoekt — events, horeca, stagebouw of productie."
                  : "Laat je gegevens achter en vertel kort wie je bent, wat je ervaring is en wanneer je beschikbaar bent."}
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <CtaLink
                  href={employeeApplyMailto}
                  label={isMid ? "Meld je aan" : "Aanmelden als medewerker"}
                  variant="primary"
                />
                <CtaLink
                  href="/vacatures"
                  label="Bekijk vacatures"
                  variant="secondary"
                />
              </div>
              {!isMid ? (
                <p className="mt-6 text-sm text-white/60">
                  Of mail direct naar{" "}
                  <a
                    href={employeeApplyMailto}
                    className="font-bold text-[#F28C28] underline-offset-4 hover:underline"
                  >
                    {applicationsEmail}
                  </a>
                  . Al crew?{" "}
                  <Link
                    href="/portaal/medewerkers"
                    className="font-bold text-white underline-offset-4 hover:underline"
                  >
                    Medewerkersportaal
                  </Link>
                </p>
              ) : null}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
