import Image from "next/image";
import type { ReactNode } from "react";
import type { CrewPhoto } from "@/lib/crewPhotos";
import { cn } from "@/lib/utils";

type PhotoBackgroundCardProps = {
  photo: CrewPhoto;
  children: ReactNode;
  className?: string;
  overlayClassName?: string;
};

export default function PhotoBackgroundCard({
  photo,
  children,
  className,
  overlayClassName = "bg-[#0B1F4D]/75",
}: PhotoBackgroundCardProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl shadow-xl", className)}>
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
      />
      <div className={cn("absolute inset-0", overlayClassName)} />
      <div className="relative">{children}</div>
    </div>
  );
}
