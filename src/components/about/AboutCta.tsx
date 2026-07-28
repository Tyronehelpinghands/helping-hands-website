import CTASection from "@/components/CTASection";
import { aboutCta } from "@/lib/aboutPage";
import { aboutCtaPhoto } from "@/lib/crewPhotos";

export default function AboutCta() {
  return (
    <CTASection
      eyebrow={aboutCta.eyebrow}
      title={aboutCta.title}
      description={aboutCta.description}
      buttonLabel={aboutCta.primaryCta.label}
      buttonHref={aboutCta.primaryCta.href}
      secondaryLabel={aboutCta.secondaryCta.label}
      secondaryHref={aboutCta.secondaryCta.href}
      backgroundImage={aboutCtaPhoto.src}
      backgroundAlt={aboutCtaPhoto.alt}
    />
  );
}
