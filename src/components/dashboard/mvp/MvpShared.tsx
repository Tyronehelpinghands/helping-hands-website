"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function MvpEmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-[#F5F7FA]/50 px-6 py-12 text-center">
      <p className="text-base font-bold text-[#0B1F4D]">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-[#101828]/60">
        {description}
      </p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function MvpToast({ message }: { message: string | null }) {
  if (!message) return null;
  const isError = /fout|mislukt|ongeldig|controleer|verplicht|ontbreekt/i.test(
    message,
  );
  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 max-w-lg whitespace-pre-wrap rounded-xl border px-4 py-3 text-sm font-medium shadow-lg",
        isError
          ? "border-red-200 bg-red-50 text-red-900"
          : "border-slate-200 bg-white text-[#0B1F4D]",
      )}
      role="status"
    >
      {message}
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => {
    if (!toast) return;
    const long =
      toast.length > 80 ||
      /fout|mislukt|ongeldig|controleer|verplicht|ontbreekt/i.test(toast);
    const t = setTimeout(() => setToast(null), long ? 14000 : 4000);
    return () => clearTimeout(t);
  }, [toast]);
  return { toast, showToast: setToast };
}

export function MvpBadge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "ok" | "warn" | "danger" | "info";
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md px-2 py-0.5 text-xs font-semibold",
        tone === "ok" && "bg-emerald-50 text-emerald-700",
        tone === "warn" && "bg-orange-50 text-orange-700",
        tone === "danger" && "bg-red-50 text-red-700",
        tone === "info" && "bg-sky-50 text-sky-700",
        tone === "neutral" && "bg-slate-100 text-slate-700",
      )}
    >
      {children}
    </span>
  );
}

export function MvpPageHeader({
  title,
  description,
  actions,
  notice,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
  notice?: string | null;
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-[#0B1F4D]">{title}</h1>
          <p className="mt-1 text-sm text-[#101828]/60">{description}</p>
        </div>
        {actions}
      </div>
      {notice ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {notice}
        </div>
      ) : null}
    </div>
  );
}

export function Field({
  label,
  name,
  children,
  className,
}: {
  label: string;
  name?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={name} className="text-xs font-semibold text-[#0B1F4D]">
        {label}
      </Label>
      {children}
    </div>
  );
}

export function TextInput(props: React.ComponentProps<typeof Input>) {
  return (
    <Input
      {...props}
      className={cn(
        "border-slate-200 bg-white text-sm text-[#0B1F4D]",
        props.className,
      )}
    />
  );
}

export function TextSelect(
  props: React.SelectHTMLAttributes<HTMLSelectElement>,
) {
  return (
    <select
      {...props}
      className={cn(
        "flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-[#0B1F4D] outline-none focus:border-[#38bdf8]",
        props.className,
      )}
    />
  );
}

export function TextTextarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-[88px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-[#0B1F4D] outline-none focus:border-[#38bdf8]",
        props.className,
      )}
    />
  );
}

export function MvpFormDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  submitLabel = "Opslaan",
  pending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  onSubmit: (formData: FormData) => Promise<void>;
  submitLabel?: string;
  pending?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[#0B1F4D]">{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        <form
          className="space-y-3"
          action={async (fd) => {
            await onSubmit(fd);
          }}
        >
          {children}
          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuleren
            </Button>
            <Button
              type="submit"
              disabled={pending}
              className="bg-[#173A8A] text-white hover:bg-[#0B1F4D]"
            >
              {pending ? "Bezig…" : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function MvpTableShell({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full text-left text-sm">{children}</table>
    </div>
  );
}

export function sqlNotice(tablesReady: boolean, errorMessage?: string | null) {
  if (tablesReady && !errorMessage) return null;
  return (
    errorMessage ||
    "Database-tabellen nog niet aangemaakt. Voer de SQL uit docs/internal-dashboard-database.md uit in Supabase SQL Editor."
  );
}
