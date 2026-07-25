import Image from "next/image";
import type { CrewPhoto } from "@/lib/crewPhotos";
import { cn } from "@/lib/utils";

type CrewPhotoGridProps = {
  photos: CrewPhoto[];
  columns?: 2 | 3 | 4;
  className?: string;
  aspectClassName?: string;
};

export default function CrewPhotoGrid({
  photos,
  columns = 3,
  className,
  aspectClassName = "aspect-[4/5]",
}: CrewPhotoGridProps) {
  const colClass =
    columns === 2
      ? "grid-cols-2"
      : columns === 4
        ? "grid-cols-2 sm:grid-cols-4"
        : "grid-cols-2 sm:grid-cols-3";

  return (
    <div className={cn("grid gap-3", colClass, className)}>
      {photos.map((photo) => (
        <div
          key={photo.src}
          className={cn("relative overflow-hidden rounded-2xl bg-slate-100", aspectClassName)}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
