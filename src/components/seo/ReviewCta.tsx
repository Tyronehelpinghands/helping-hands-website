import GoogleBusinessCta from "@/components/seo/GoogleBusinessCta";

type ReviewCtaProps = {
  className?: string;
};

/** @deprecated Prefer GoogleBusinessCta — kept as alias for existing imports. */
export default function ReviewCta({ className = "" }: ReviewCtaProps) {
  return <GoogleBusinessCta className={className} />;
}
