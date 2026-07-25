import Image from "next/image";
import type { CrewPhoto } from "@/lib/crewPhotos";

type OverOnsPhotoCollageProps = {
  photos: CrewPhoto[];
};

export default function OverOnsPhotoCollage({ photos }: OverOnsPhotoCollageProps) {
  const [a, b, c, d] = photos;

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {[a, b, c, d].filter(Boolean).map((photo, index) => (
        <div
          key={photo.src}
          className={
            index === 0
              ? "relative col-span-2 aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100 shadow-lg transition duration-300 hover:scale-[1.01]"
              : "relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100 shadow-md transition duration-300 hover:scale-[1.02]"
          }
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  );
}
