import Image from "next/image";
import Link from "next/link";
import { brandAlt, brandImages } from "@/lib/brand";

type BrandLogoProps = {
  variant?: "full" | "fullWhite" | "mark" | "markWhite";
  href?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  onClick?: () => void;
};

const sources = {
  full: brandImages.logo,
  fullWhite: brandImages.logoWhite,
  mark: brandImages.mark,
  markWhite: brandImages.markWhite,
};

export function BrandLogoImage({
  variant = "full",
  priority = false,
  className = "",
  imageClassName = "",
}: Omit<BrandLogoProps, "href" | "onClick">) {
  const src = sources[variant];
  const isMark = variant === "mark" || variant === "markWhite";
  const width = isMark ? 278 : 640;
  const height = 272;

  return (
    <span className={`inline-flex shrink-0 ${className}`}>
      <Image
        src={src}
        alt={brandAlt}
        width={width}
        height={height}
        priority={priority}
        sizes={
          isMark
            ? "40px"
            : "(max-width: 639px) 150px, (max-width: 1023px) 165px, 210px"
        }
        className={`block h-auto w-auto max-w-full object-contain object-left ${imageClassName}`}
      />
    </span>
  );
}

export default function BrandLogo({
  variant = "full",
  href,
  priority = false,
  className = "",
  imageClassName = "",
  onClick,
}: BrandLogoProps) {
  const image = (
    <BrandLogoImage
      variant={variant}
      priority={priority}
      className={className}
      imageClassName={imageClassName}
    />
  );

  if (!href) {
    return image;
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className="inline-flex shrink-0 items-center rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2"
      aria-label={`${brandAlt} home`}
    >
      {image}
    </Link>
  );
}

export function HeaderBrandLogo({
  scrolled,
  onNavigate,
}: {
  scrolled: boolean;
  onNavigate?: () => void;
}) {
  const logoWidth = scrolled
    ? "w-[135px] sm:w-[145px] lg:w-[170px] max-h-[52px]"
    : "w-[150px] sm:w-[160px] lg:w-[200px] max-h-[72px]";

  return (
    <>
      <BrandLogo
        href="/"
        onClick={onNavigate}
        priority
        variant="full"
        className="hidden min-[400px]:inline-flex"
        imageClassName={logoWidth}
      />
      <Link
        href="/"
        onClick={onNavigate}
        className="inline-flex min-[400px]:hidden shrink-0 items-center gap-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2"
        aria-label={`${brandAlt} home`}
      >
        <BrandLogoImage
          variant="mark"
          priority
          imageClassName="h-10 w-10"
        />
        <span className="flex flex-col leading-tight">
          <span className="text-sm font-extrabold tracking-tight text-[#173A8A]">
            Helping Hands
          </span>
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-slate-500">
            Event staffing
          </span>
        </span>
      </Link>
    </>
  );
}
