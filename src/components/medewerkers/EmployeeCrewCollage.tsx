import Image from "next/image";
import RevealOnScroll from "@/components/RevealOnScroll";
import { employeeCollagePhotos } from "@/lib/employeePage";
import { cn } from "@/lib/utils";

const layouts = [
  "col-span-2 aspect-[16/11] sm:col-span-7 sm:row-span-2 sm:aspect-auto sm:min-h-[22rem]",
  "aspect-[3/4] sm:col-span-5 sm:aspect-[5/4]",
  "aspect-[3/4] sm:col-span-5 sm:aspect-[5/4]",
  "aspect-[4/3] sm:col-span-4 sm:aspect-[4/5]",
  "aspect-[4/3] sm:col-span-4 sm:aspect-[4/5]",
  "aspect-[16/10] sm:col-span-4 sm:aspect-[4/5]",
] as const;

export default function EmployeeCrewCollage() {
  return (
    <section className="bg-[#F5F7FA] py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              Crew op locatie
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0B1F4D] sm:text-4xl">
              Werken in de evenementen, horeca en productie
            </h2>
            <p className="mt-4 text-base leading-8 text-[#101828]/70 sm:text-lg">
              Van festivalterrein tot restaurantvloer: Helping Hands crew draait
              mee op echte producties — met branding, tempo en verantwoordelijkheid.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delayMs={80}>
          <div className="relative mt-10 overflow-x-clip">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-12 sm:gap-4">
              {employeeCollagePhotos.map((photo, index) => (
                <figure
                  key={photo.src}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl bg-slate-100 shadow-md shadow-[#0B1F4D]/10",
                    layouts[index] ?? "aspect-[4/3] sm:col-span-4",
                  )}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B1F4D]/85 to-transparent px-3 pb-3 pt-10">
                    <span className="text-xs font-semibold tracking-wide text-white sm:text-sm">
                      {photo.caption}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
