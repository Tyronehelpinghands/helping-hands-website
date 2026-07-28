import Image from "next/image";
import Link from "next/link";
import StaggerReveal from "@/components/StaggerReveal";
import { deployments } from "@/lib/content";
import { homeDeploymentPhotos } from "@/lib/crewPhotos";

export default function DeploymentCards() {
  return (
    <StaggerReveal className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stepMs={80}>
      {deployments.map((item) => {
        const photo = homeDeploymentPhotos[item.label];
        return (
          <Link
            key={item.label}
            href="/projecten"
            className="group relative min-h-[16rem] overflow-hidden rounded-2xl shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1F4D] sm:min-h-[18rem]"
            aria-label={`${item.label} — bekijk projectervaring`}
          >
            <article className="relative h-full min-h-[16rem] sm:min-h-[18rem]">
              {photo ? (
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading="lazy"
                  className="object-cover transition duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              ) : (
                <div className="absolute inset-0 bg-[#0B1F4D]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F4D]/95 via-[#0B1F4D]/45 to-transparent" />
              <div className="relative flex h-full min-h-[16rem] flex-col justify-end p-6 sm:min-h-[18rem]">
                <span className="inline-flex w-fit rounded-full bg-[#F28C28] px-3 py-1 text-xs font-bold text-white">
                  Crew
                </span>
                <h3 className="mt-3 text-2xl font-black text-white">{item.label}</h3>
                <p className="mt-2 text-sm leading-6 text-white/80">{item.detail}</p>
                <span className="mt-3 text-xs font-bold text-white/70 underline-offset-4 transition group-hover:text-white group-hover:underline">
                  Bekijk projectervaring
                </span>
              </div>
            </article>
          </Link>
        );
      })}
    </StaggerReveal>
  );
}
