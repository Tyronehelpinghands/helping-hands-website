import Link from "next/link";
import StockImage from "@/components/StockImage";

type ImageCardProps = {
  image: string;
  imageAlt: string;
  eyebrow?: string;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  dark?: boolean;
};

export default function ImageCard({
  image,
  imageAlt,
  eyebrow,
  title,
  description,
  href,
  ctaLabel,
  dark = true,
}: ImageCardProps) {
  return (
    <article
      className={`overflow-hidden rounded-2xl shadow-2xl ${
        dark ? "bg-[#0B1F4D] text-white" : "border border-slate-200 bg-white text-[#101828]"
      }`}
    >
      <StockImage
        src={image}
        alt={imageAlt}
        fill
        className="relative aspect-[16/9] w-full"
        placeholderLabel={imageAlt}
      />
      <div className="p-8 lg:p-10">
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F28C28]">
            {eyebrow}
          </p>
        )}
        <h3 className={`font-black ${eyebrow ? "mt-4 text-2xl sm:text-3xl" : "text-2xl"}`}>
          {title}
        </h3>
        <p
          className={`mt-4 leading-8 ${
            dark ? "text-white/80" : "text-[#101828]/75"
          }`}
        >
          {description}
        </p>
        <Link
          href={href}
          className={`mt-8 inline-flex items-center justify-center rounded-full px-8 py-4 text-sm font-bold transition ${
            dark
              ? "bg-[#F28C28] text-white hover:bg-[#de7c1f]"
              : "border-2 border-[#173A8A] text-[#173A8A] hover:bg-[#173A8A] hover:text-white"
          }`}
        >
          {ctaLabel}
        </Link>
      </div>
    </article>
  );
}
