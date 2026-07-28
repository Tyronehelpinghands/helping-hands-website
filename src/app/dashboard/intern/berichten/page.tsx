import type { Metadata } from "next";
import { MessagesMvpClient } from "@/components/dashboard/mvp/MessagesMvpClient";
import {
  getDashboardStats,
  getInternalMessages,
} from "@/lib/dashboard/queries";

export const metadata: Metadata = {
  title: "Berichten | Intern dashboard",
  description:
    "Berichtconcepten met mailto/WhatsApp-fallbacks. Automatisch verzenden later.",
};

export default async function InternBerichtenPage() {
  const [messages, stats] = await Promise.all([
    getInternalMessages(),
    getDashboardStats(),
  ]);

  return (
    <MessagesMvpClient messages={messages} tablesReady={stats.tablesReady} />
  );
}
