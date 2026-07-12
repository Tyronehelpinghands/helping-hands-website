"use client";

import { Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsSaveBar({
  visible,
  onSave,
  onCancel,
}: {
  visible: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/95 px-4 py-3 shadow-[0_-4px_20px_rgba(11,31,77,0.08)] backdrop-blur-sm sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-[#0B1F4D]">
          Je hebt niet-opgeslagen wijzigingen
        </p>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
            Annuleren
          </Button>
          <Button type="button" size="sm" onClick={onSave}>
            <Save className="h-4 w-4" />
            Opslaan
          </Button>
        </div>
      </div>
    </div>
  );
}
