import FaqSection from "@/components/sections/FaqSection";
import { aboutFaqs } from "@/lib/aboutFaq";

export default function AboutFaq() {
  return (
    <div id="faq" className="scroll-mt-28">
      <FaqSection
        items={aboutFaqs}
        title="Veelgestelde vragen over Helping Hands"
        description="Missie, kwaliteit voor opdrachtgevers, projectervaring en hoe je start."
        className="bg-white py-16 sm:py-24"
      />
    </div>
  );
}
