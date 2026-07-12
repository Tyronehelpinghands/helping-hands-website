"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  defaultMessageFilters,
  MESSAGE_AUDIENCES,
  MESSAGE_CHANNELS,
  MESSAGE_MODULES,
  MESSAGE_PRIORITIES,
  MESSAGE_STATUSES,
  type MessageFilters,
} from "@/lib/messages";

export default function MessageFiltersBar({
  filters,
  onChange,
}: {
  filters: MessageFilters;
  onChange: (f: MessageFilters) => void;
}) {
  function update(p: Partial<MessageFilters>) {
    onChange({ ...filters, ...p });
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Input
          placeholder="Zoek onderwerp, ontvanger, project…"
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
          className="border-slate-200/80 bg-[#F5F7FA]/60 sm:col-span-2"
        />
        <Select value={filters.channel} onValueChange={(v) => update({ channel: v ?? "Alle" })}>
          <SelectTrigger className="border-slate-200/80 bg-[#F5F7FA]/60"><SelectValue placeholder="Kanaal" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Alle">Alle kanalen</SelectItem>
            {MESSAGE_CHANNELS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filters.audience} onValueChange={(v) => update({ audience: v ?? "Alle" })}>
          <SelectTrigger className="border-slate-200/80 bg-[#F5F7FA]/60"><SelectValue placeholder="Doelgroep" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Alle">Alle doelgroepen</SelectItem>
            {MESSAGE_AUDIENCES.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filters.status} onValueChange={(v) => update({ status: v ?? "Alle" })}>
          <SelectTrigger className="border-slate-200/80 bg-[#F5F7FA]/60"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Alle">Alle statussen</SelectItem>
            {MESSAGE_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filters.priority} onValueChange={(v) => update({ priority: v ?? "Alle" })}>
          <SelectTrigger className="border-slate-200/80 bg-[#F5F7FA]/60"><SelectValue placeholder="Prioriteit" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Alle">Alle prioriteiten</SelectItem>
            {MESSAGE_PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filters.module} onValueChange={(v) => update({ module: v ?? "Alle" })}>
          <SelectTrigger className="border-slate-200/80 bg-[#F5F7FA]/60"><SelectValue placeholder="Module" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Alle">Alle modules</SelectItem>
            {MESSAGE_MODULES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <Button type="button" variant="ghost" size="sm" className="text-[#173A8A]" onClick={() => onChange(defaultMessageFilters)}>
        <RotateCcw className="h-3.5 w-3.5" />
        Reset filters
      </Button>
    </div>
  );
}
