import Link from "next/link";
import OverOnsSplitSection from "@/components/over-ons/OverOnsSplitSection";
import { aboutForClients } from "@/lib/aboutPage";
import { aboutClientsPhoto } from "@/lib/crewPhotos";

export default function AboutForClients() {
  return (
    <div id="opdrachtgevers" className="scroll-mt-28">
      <OverOnsSplitSection
        eyebrow={aboutForClients.eyebrow}
        title={aboutForClients.title}
        paragraphs={aboutForClients.paragraphs}
        photo={aboutClientsPhoto}
        reverse
        className="bg-[#F5F7FA]"
      >
        <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
          {aboutForClients.bullets.map((item) => (
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
            href={aboutForClients.primaryCta.href}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#F28C28] px-7 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#de7c1f]"
          >
            {aboutForClients.primaryCta.label}
          </Link>
          <Link
            href={aboutForClients.secondaryCta.href}
            className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-[#173A8A] px-7 py-3 text-sm font-bold text-[#173A8A] transition hover:bg-white"
          >
            {aboutForClients.secondaryCta.label}
          </Link>
        </div>
      </OverOnsSplitSection>
    </div>
  );
}
