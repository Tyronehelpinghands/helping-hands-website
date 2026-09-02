import Image from "next/image";
import Link from "next/link";
import { brandAlt, brandImages } from "@/lib/brand";
import { cn } from "@/lib/utils";

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
    <span className={cn("inline-flex shrink-0", className)}>
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
        className={cn(
          "block h-auto w-auto max-w-full object-contain object-left",
          imageClassName,
        )}
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
      className={href ? "" : className}
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
      className={cn(
        "inline-flex min-w-0 items-center rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2",
        className,
      )}
      aria-label={`${brandAlt} home`}
    >
      {image}
    </Link>
  );
}

/**
 * One brand treatment only: compact mark + short wordmark below `lg`
 * so CTA + hamburger stay visible; full lockup from `lg` upward.
 */
export function HeaderBrandLogo({
  scrolled,
  inverted = false,
  onNavigate,
}: {
  scrolled: boolean;
  inverted?: boolean;
  onNavigate?: () => void;
}) {
  const logoWidth = scrolled
    ? "w-[135px] xl:w-[155px] max-h-[44px]"
    : "w-[160px] xl:w-[195px] max-h-[52px]";

  return (
    <div className="flex shrink-0 items-center">
      <BrandLogo
        href="/"
        onClick={onNavigate}
        priority
        variant={inverted ? "fullWhite" : "full"}
        className="hidden shrink-0 lg:inline-flex"
        imageClassName={`${logoWidth} transition-[width,max-height] duration-300`}
      />
      <Link
        href="/"
        onClick={onNavigate}
        className="inline-flex min-w-0 max-w-full shrink-0 items-center gap-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2 lg:hidden"
        aria-label={`${brandAlt} home`}
      >
        <BrandLogoImage
          variant={inverted ? "markWhite" : "mark"}
          priority
          imageClassName="h-9 w-9 shrink-0"
        />
        <span className="min-w-0 truncate leading-tight">
          <span
            className={`block truncate text-sm font-extrabold tracking-tight ${
              inverted ? "text-white" : "text-[#173A8A]"
            }`}
          >
            Helping Hands
          </span>
          <span
            className={`block truncate text-[0.6rem] font-semibold uppercase tracking-[0.1em] ${
              inverted ? "text-white/70" : "text-slate-500"
            }`}
          >
            Event staffing
          </span>
        </span>
      </Link>
    </div>
  );
}
