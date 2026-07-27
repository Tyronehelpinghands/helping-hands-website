import JsonLd from "@/components/seo/JsonLd";
import { jobPostingJsonLd, mapVacancyEmploymentType } from "@/lib/seo";
import { vacancies } from "@/lib/vacancies";

export default function VacancyJobPostingsJsonLd() {
  const data = vacancies.map((vacancy) =>
    jobPostingJsonLd({
      title: vacancy.title,
      description: [
        vacancy.description,
        "",
        "Taken:",
        ...vacancy.tasks.map((task) => `- ${task}`),
        "",
        "Profiel:",
        ...vacancy.profile.map((item) => `- ${item}`),
        "",
        "Wat je krijgt:",
        ...vacancy.whatYouGet.map((item) => `- ${item}`),
      ].join("\n"),
      location: vacancy.location,
      employmentType: mapVacancyEmploymentType(vacancy.employmentType),
      url: `/vacatures#${vacancy.slug}`,
      identifier: vacancy.id,
      // baseSalary intentionally omitted — salaries are unknown / vary by assignment
    }),
  );

  return <JsonLd data={data} />;
}
