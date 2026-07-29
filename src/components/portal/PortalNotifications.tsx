"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AppNotification } from "@/lib/app-notifications";
import { markNotificationReadAction } from "@/lib/employee-portal/mutations";
import { cn } from "@/lib/utils";

export default function PortalNotifications({
  items,
  unreadCount,
  className,
}: {
  items: AppNotification[];
  unreadCount: number;
  className?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (items.length === 0) {
    return (
      <div
        className={cn(
          "rounded-xl border border-slate-200/80 bg-white p-4 text-sm text-slate-500",
          className,
        )}
      >
        <div className="mb-1 flex items-center gap-2 font-semibold text-[#0B1F4D]">
          <Bell className="h-4 w-4 text-[#F28C28]" />
          Meldingen
        </div>
        Geen meldingen.
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm",
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-semibold text-[#0B1F4D]">
          <Bell className="h-4 w-4 text-[#F28C28]" />
          Meldingen
        </div>
        {unreadCount > 0 ? (
          <span className="rounded-md bg-[#F28C28]/15 px-2 py-0.5 text-xs font-bold text-[#F28C28]">
            {unreadCount} nieuw
          </span>
        ) : null}
      </div>
      <ul className="space-y-2">
        {items.slice(0, 5).map((n) => (
          <li
            key={n.id}
            className={cn(
              "rounded-lg border px-3 py-2 text-sm",
              n.read_at
                ? "border-slate-100 bg-slate-50 text-slate-600"
                : "border-[#173A8A]/15 bg-[#173A8A]/5 text-[#0B1F4D]",
            )}
          >
            <p className="font-semibold">{n.title}</p>
            {n.body ? <p className="mt-0.5 text-xs opacity-80">{n.body}</p> : null}
            {!n.read_at ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="mt-1 h-7 px-2 text-xs"
                disabled={pending}
                onClick={() => {
                  startTransition(async () => {
                    await markNotificationReadAction(n.id);
                    router.refresh();
                  });
                }}
              >
                Gelezen
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
