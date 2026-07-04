"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function InternDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Card className="border-red-200 bg-white shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <CardTitle className="text-lg font-black text-[#0B1F4D]">
              Dashboard kon niet laden
            </CardTitle>
            <CardDescription>
              Er is een fout opgetreden bij het ophalen van de gegevens.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-[#101828]/70">
          {error.message || "Probeer de pagina opnieuw te laden."}
        </p>
        <Button
          onClick={reset}
          className="bg-[#173A8A] text-white hover:bg-[#0B1F4D]"
        >
          Opnieuw proberen
        </Button>
      </CardContent>
    </Card>
  );
}
