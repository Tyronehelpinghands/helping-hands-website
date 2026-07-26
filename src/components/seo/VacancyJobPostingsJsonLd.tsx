import JsonLd from "@/components/seo/JsonLd";
import { jobPostingJsonLd } from "@/lib/seo";
import { vacancies } from "@/lib/vacancies";

export default function VacancyJobPostingsJsonLd() {
  const data = vacancies.map((vacancy) =>
    jobPostingJsonLd({
      title: vacancy.title,
      description: [
        vacancy.intro,
        "",
        "Taken:",
        ...vacancy.tasks.map((task) => `- ${task}`),
        "",
        "Profiel:",
        ...vacancy.profile.map((item) => `- ${item}`),
      ].join("\n"),
      location: vacancy.location,
      employmentType: "TEMPORARY",
    }),
  );

  return <JsonLd data={data} />;
}
