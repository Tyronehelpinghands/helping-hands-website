import Link from "next/link";
import OverOnsSplitSection from "@/components/over-ons/OverOnsSplitSection";
import { aboutForEmployees } from "@/lib/aboutPage";
import { aboutEmployeesPhoto } from "@/lib/crewPhotos";

export default function AboutForEmployees() {
  return (
    <div id="medewerkers" className="scroll-mt-28">
      <OverOnsSplitSection
        eyebrow={aboutForEmployees.eyebrow}
        title={aboutForEmployees.title}
        paragraphs={aboutForEmployees.paragraphs}
        photo={aboutEmployeesPhoto}
        className="bg-white"
      >
        <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
          {aboutForEmployees.bullets.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 text-sm font-semibold leading-6 text-[#101828]/85"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F28C28]" />
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href={aboutForEmployees.primaryCta.href}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#173A8A] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#0B1F4D]"
          >
            {aboutForEmployees.primaryCta.label}
          </Link>
          <Link
            href={aboutForEmployees.secondaryCta.href}
            className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-[#173A8A] px-7 py-3 text-sm font-bold text-[#173A8A] transition hover:bg-[#F5F7FA]"
          >
            {aboutForEmployees.secondaryCta.label}
          </Link>
        </div>
      </OverOnsSplitSection>
    </div>
  );
}
