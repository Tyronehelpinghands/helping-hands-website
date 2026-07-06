import type { Metadata } from "next";
import ProjectsDashboardClient from "@/components/projects/ProjectsDashboardClient";
import { getProjectsPageData } from "@/lib/projects-server";

export const metadata: Metadata = {
  title: "Projecten | Intern dashboard",
  description:
    "Beheer actieve projecten, planning, crewbezetting en projectstatus voor Helping Hands Agency.",
};

export default async function InternProjectenPage() {
  const { projects, source } = await getProjectsPageData();

  return (
    <ProjectsDashboardClient initialProjects={projects} dataSource={source} />
  );
}
