import type { Metadata } from "next";
import { MessagesMvpClient } from "@/components/dashboard/mvp/MessagesMvpClient";
import {
  getDashboardStats,
  getInternalMessages,
  getProjects,
} from "@/lib/dashboard/queries";

export const metadata: Metadata = {
  title: "Berichten | Intern dashboard",
  description:
    "Berichten en accreditatielijsten opslaan of direct per e-mail versturen via Resend.",
};

export default async function InternBerichtenPage({
  searchParams,
}: {
  searchParams: Promise<{ projectId?: string }>;
}) {
  const params = await searchParams;
  const [messages, projects, stats] = await Promise.all([
    getInternalMessages(),
    getProjects(),
    getDashboardStats(),
  ]);

  return (
    <MessagesMvpClient
      messages={messages}
      projects={projects}
      tablesReady={stats.tablesReady}
      initialProjectId={params.projectId ?? null}
    />
  );
}
