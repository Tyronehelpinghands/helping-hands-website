import Image from "next/image";
import { deployments } from "@/lib/content";
import { homeDeploymentPhotos } from "@/lib/crewPhotos";

export default function DeploymentCards() {
  return (
    <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {deployments.map((item) => {
        const photo = homeDeploymentPhotos[item.label];
        return (
          <article
            key={item.label}
            className="group relative min-h-[16rem] overflow-hidden rounded-2xl shadow-xl sm:min-h-[18rem]"
          >
            {photo ? (
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
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
            </div>
          </article>
        );
      })}
    </div>
  );
}
