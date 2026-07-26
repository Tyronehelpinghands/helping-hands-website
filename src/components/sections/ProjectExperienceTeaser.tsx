import Link from "next/link";
import ProjectLogoCard from "@/components/projects/ProjectLogoCard";
import { getHomepageFeaturedLogos, projectExperienceDisclaimer } from "@/lib/projectLogos";

export default function ProjectExperienceTeaser() {
  const logos = getHomepageFeaturedLogos().slice(0, 6);

  return (
    <section className="bg-[#F5F7FA] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              Projectervaring
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-[#0B1F4D] sm:text-4xl">
              Crewervaring op festivals, stadions en producties
            </h2>
            <p className="mt-5 text-base leading-8 text-[#101828]/75 sm:text-lg">
              Onze crew is via jobs, partners en producties ingezet op uiteenlopende
              evenementen en locaties. Geen partnership-claims — wel concrete
              projectervaring.
            </p>
          </div>
          <Link
            href="/projecten"
            className="inline-flex items-center justify-center rounded-full bg-[#173A8A] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#0B1F4D]"
          >
            Alle projectervaring
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {logos.map((logo) => (
            <ProjectLogoCard key={logo.id} logo={logo} />
          ))}
        </div>

        <p className="mt-6 max-w-3xl text-xs leading-6 text-[#101828]/55">
          {projectExperienceDisclaimer}
        </p>
      </div>
    </section>
  );
}
