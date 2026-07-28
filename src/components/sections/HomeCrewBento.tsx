import Image from "next/image";
import type { CrewBentoItem } from "@/lib/crewPhotos";
import { cn } from "@/lib/utils";

type HomeCrewBentoProps = {
  photos: CrewBentoItem[];
};

type TileShape =
  | "hero"
  | "organic"
  | "asymmetric"
  | "soft"
  | "portrait"
  | "wide";

const TILE_SHAPES: TileShape[] = [
  "hero",
  "organic",
  "asymmetric",
  "soft",
  "portrait",
  "wide",
];

/** Soft mixed radii — graphic without clip-paths that crop faces. */
const SHAPE_CLASS: Record<TileShape, string> = {
  hero: "rounded-[1.75rem_0.9rem_2.25rem_1.15rem] sm:rounded-[2.75rem_1.35rem_2.5rem_1.75rem]",
  organic:
    "rounded-[1.5rem_2.5rem_1.25rem_2.75rem] sm:rounded-[1.75rem_3rem_1.5rem_3.25rem]",
  asymmetric:
    "rounded-[2.25rem_0.75rem_2rem_1.5rem] sm:rounded-[2.75rem_1rem_2.25rem_1.75rem]",
  soft: "rounded-2xl sm:rounded-[1.5rem_1.75rem_1.35rem_1.75rem]",
  portrait: "rounded-[1.25rem_1.75rem_2rem_0.9rem] sm:rounded-[1.5rem_2rem_2.25rem_1.15rem]",
  wide: "rounded-[1.15rem_1.15rem_2.25rem_0.85rem] sm:rounded-[1.5rem_1.5rem_2.75rem_1rem]",
};

const FRAME_CLASS: Record<TileShape, string> = {
  hero: "ring-2 ring-[#173A8A]/40 ring-offset-[3px] ring-offset-white",
  organic: "ring-2 ring-[#F28C28]/45 ring-offset-2 ring-offset-white",
  asymmetric: "ring-1 ring-[#173A8A]/30",
  soft: "ring-1 ring-[#F28C28]/25",
  portrait: "ring-1 ring-[#173A8A]/25",
  wide: "ring-2 ring-[#173A8A]/25 ring-offset-2 ring-offset-white",
};

/** 1 large hero + varied accent spans; fixed aspects avoid CLS. */
const LAYOUT_CLASS = [
  "col-span-2 aspect-[16/11] sm:col-span-7 sm:row-span-2 sm:aspect-auto sm:min-h-[22rem] lg:min-h-[26rem] sm:z-[1]",
  "aspect-[3/4] sm:col-span-5 sm:aspect-[5/4] sm:translate-x-1 sm:z-[2]",
  "aspect-[3/4] sm:col-span-5 sm:aspect-[5/4] sm:-translate-y-1 sm:z-[2]",
  "aspect-[4/3] sm:col-span-3 sm:aspect-[4/5] sm:min-h-[11rem] sm:-translate-y-2 sm:z-[3]",
  "aspect-[4/3] sm:col-span-3 sm:aspect-[4/5] sm:min-h-[11rem] sm:translate-y-1 sm:z-[2]",
  "col-span-2 aspect-[16/9] sm:col-span-6 sm:aspect-[16/10] sm:min-h-[11rem] sm:-translate-x-1 sm:z-[1]",
] as const;

function CrewBentoTile({
  photo,
  shape,
  layoutClass,
}: {
  photo: CrewBentoItem;
  shape: TileShape;
  layoutClass: string;
}) {
  return (
    <figure
      className={cn(
        "group relative overflow-hidden bg-slate-100 shadow-md shadow-[#0B1F4D]/10",
        "transition duration-500 ease-out hover:z-[4] hover:shadow-xl hover:shadow-[#0B1F4D]/18",
        "motion-reduce:transition-none motion-reduce:hover:shadow-md",
        SHAPE_CLASS[shape],
        FRAME_CLASS[shape],
        layoutClass,
      )}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={photo.sizes}
        loading="lazy"
        className="object-cover transition duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        style={{ objectPosition: photo.objectPosition ?? "50% 20%" }}
      />
      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B1F4D]/85 via-[#0B1F4D]/35 to-transparent px-3 pb-3 pt-12 sm:px-4 sm:pb-4 sm:pt-16">
        <span className="inline-block max-w-[calc(100%-0.25rem)] truncate rounded-md bg-white/15 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white backdrop-blur-[2px] sm:text-xs">
          {photo.caption}
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * Graphic crew photo collage for the homepage — asymmetric shapes,
 * hierarchy, and brand accents (local photos only, faces preserved).
 */
export default function HomeCrewBento({ photos }: HomeCrewBentoProps) {
  const tiles = photos.slice(0, 6);

  return (
    <div className="relative overflow-x-clip">
      <div
        className="pointer-events-none absolute -left-4 top-12 hidden h-28 w-28 rounded-[2rem] bg-[#173A8A]/10 sm:block lg:-left-8 lg:h-40 lg:w-40"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-3 bottom-20 hidden h-24 w-24 rounded-full bg-[#F28C28]/15 sm:block lg:-right-6 lg:h-32 lg:w-32"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-[30%] top-1 hidden h-2.5 w-14 -rotate-6 rounded-full bg-[#F28C28]/55 sm:block"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-8 left-[42%] hidden h-2 w-10 rotate-12 rounded-full bg-[#173A8A]/35 lg:block"
        aria-hidden="true"
      />

      <div className="relative grid grid-cols-2 gap-2.5 sm:grid-cols-12 sm:gap-4 lg:gap-5">
        {tiles.map((photo, index) => (
          <CrewBentoTile
            key={`${photo.src}-${index}`}
            photo={photo}
            shape={TILE_SHAPES[index] ?? "asymmetric"}
            layoutClass={LAYOUT_CLASS[index] ?? "aspect-[4/3] sm:col-span-3"}
          />
        ))}
      </div>
    </div>
  );
}
