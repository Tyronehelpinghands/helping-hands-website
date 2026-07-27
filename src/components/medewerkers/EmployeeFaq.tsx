import FaqSection from "@/components/sections/FaqSection";
import type { EmployeeFaq } from "@/lib/employeePage";

type EmployeeFaqProps = {
  items: EmployeeFaq[];
};

export default function EmployeeFaq({ items }: EmployeeFaqProps) {
  return (
    <FaqSection
      items={items}
      eyebrow="Veelgestelde vragen"
      title="Antwoorden over werken bij Helping Hands"
      description="Kort en duidelijk — zo weet je snel of crew aanmelden bij Helping Hands bij je past."
      className="bg-white py-16 sm:py-24"
    />
  );
}
