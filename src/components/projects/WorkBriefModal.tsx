"use client";

import { useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Project } from "@/data/projectsMockData";
import { generateWorkBrief } from "@/lib/projects-utils";

type WorkBriefModalProps = {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function WorkBriefModal({
  project,
  open,
  onOpenChange,
}: WorkBriefModalProps) {
  const [copied, setCopied] = useState(false);

  if (!project) return null;

  const content = generateWorkBrief(project);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function handleDownload() {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `werkbrief-${project!.naam.replace(/\s+/g, "-").toLowerCase()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[#0B1F4D]">Werkbrief — {project.naam}</DialogTitle>
          <DialogDescription>
            Gegenereerde werkbrief op basis van projectgegevens
          </DialogDescription>
        </DialogHeader>

        <pre className="max-h-[50vh] overflow-y-auto rounded-lg border border-slate-200 bg-[#F5F7FA]/60 p-4 text-xs leading-relaxed whitespace-pre-wrap text-[#101828]/80">
          {content}
        </pre>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button type="button" variant="outline" onClick={handleCopy}>
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? "Gekopieerd" : "Kopiëren"}
          </Button>
          <Button
            type="button"
            onClick={handleDownload}
            className="bg-[#173A8A] text-white hover:bg-[#0B1F4D]"
          >
            <Download className="h-4 w-4" />
            Downloaden als tekst
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
