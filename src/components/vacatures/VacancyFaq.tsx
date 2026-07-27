import FaqSection from "@/components/sections/FaqSection";
import type { VacancyFaqItem } from "@/lib/vacancyFaq";

type VacancyFaqProps = {
  items: VacancyFaqItem[];
};

export default function VacancyFaq({ items }: VacancyFaqProps) {
  return (
    <FaqSection
      items={items}
      eyebrow="Veelgestelde vragen"
      title="Antwoorden over vacatures en aanmelden"
      description="Kort en duidelijk — over ervaring, planning, horeca/keuken en doorgroeien bij Helping Hands."
      className="bg-white py-16 sm:py-24"
    />
  );
}
