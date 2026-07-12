"use client";

import { cn } from "@/lib/utils";
import {
  SETTINGS_TABS,
  type SettingsTabId,
} from "@/lib/settings";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SettingsTabs({
  activeTab,
  onChange,
}: {
  activeTab: SettingsTabId;
  onChange: (tab: SettingsTabId) => void;
}) {
  return (
    <>
      <div className="lg:hidden">
        <Select
          value={activeTab}
          onValueChange={(v) => {
            if (v) onChange(v as SettingsTabId);
          }}
        >
          <SelectTrigger className="border-slate-200/80 bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SETTINGS_TABS.map((tab) => (
              <SelectItem key={tab.id} value={tab.id}>
                {tab.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <nav className="hidden lg:block">
        <ul className="space-y-1">
          {SETTINGS_TABS.map((tab) => (
            <li key={tab.id}>
              <button
                type="button"
                onClick={() => onChange(tab.id)}
                className={cn(
                  "w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-[#173A8A]/10 text-[#173A8A]"
                    : "text-[#101828]/70 hover:bg-slate-100 hover:text-[#0B1F4D]",
                )}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
        {SETTINGS_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "shrink-0 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors",
              activeTab === tab.id
                ? "border-[#173A8A]/30 bg-[#173A8A]/10 text-[#173A8A]"
                : "border-slate-200 bg-white text-[#101828]/70",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </>
  );
}
