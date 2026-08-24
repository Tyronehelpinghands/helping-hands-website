import type { Metadata } from "next";
import OpenClawAssistantClient from "@/components/dashboard/openclaw/OpenClawAssistantClient";

export const metadata: Metadata = {
  title: "OpenClaw | Intern dashboard",
  description:
    "Stuur opdrachten naar de Helping Hands OpenClaw-agent vanaf het interne dashboard.",
};

export default function InternOpenClawPage() {
  return <OpenClawAssistantClient />;
}
