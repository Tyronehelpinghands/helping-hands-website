"use client";

import { Check, Clock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import RiskCategoryBadge from "@/components/dashboard/risico-acties/RiskCategoryBadge";
import RiskPriorityBadge from "@/components/dashboard/risico-acties/RiskPriorityBadge";
import { RISK_STATUSES, type RiskAction, type RiskStatus } from "@/lib/riskActions";

export default function RiskActionBoard({
  actions,
  onStatusChange,
  onView,
}: {
  actions: RiskAction[];
  onStatusChange: (item: RiskAction, status: RiskStatus) => void;
  onView: (item: RiskAction) => void;
}) {
  return (
    <>
      <div className="space-y-4 lg:hidden">
        {RISK_STATUSES.map((status) => {
          const column = actions.filter((a) => a.status === status);
          return (
            <div key={status} className="rounded-xl border border-slate-200/80 bg-[#F5F7FA]/40 p-3">
              <h3 className="mb-3 text-sm font-bold text-[#0B1F4D]">{status} ({column.length})</h3>
              <div className="space-y-2">
                {column.map((item) => (
                  <BoardCard key={item.id} item={item} onStatusChange={onStatusChange} onView={onView} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden w-full max-w-full overflow-x-auto pb-2 lg:block">
        <div className="flex min-w-[1200px] gap-3 px-4">
          {RISK_STATUSES.map((status) => {
            const column = actions.filter((a) => a.status === status);
            return (
              <div key={status} className="min-w-[220px] flex-1 rounded-xl border border-slate-200/80 bg-[#F5F7FA]/40 p-3">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-[#101828]/55">
                  {status} ({column.length})
                </h3>
                <div className="space-y-2">
                  {column.length === 0 ? (
                    <p className="py-4 text-center text-xs text-[#101828]/45">Geen items</p>
                  ) : (
                    column.map((item) => (
                      <BoardCard key={item.id} item={item} onStatusChange={onStatusChange} onView={onView} />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function BoardCard({
  item,
  onStatusChange,
  onView,
}: {
  item: RiskAction;
  onStatusChange: (item: RiskAction, status: RiskStatus) => void;
  onView: (item: RiskAction) => void;
}) {
  return (
    <div className="rounded-lg border border-slate-200/80 bg-white p-3 shadow-sm">
      <button type="button" className="w-full text-left" onClick={() => onView(item)}>
        <p className="text-sm font-semibold text-[#0B1F4D]">{item.title}</p>
      </button>
      <div className="mt-2 flex flex-wrap gap-1">
        <RiskCategoryBadge category={item.category} />
        <RiskPriorityBadge priority={item.priority} />
      </div>
      <p className="mt-2 text-xs text-[#101828]/60">
        {item.owner} · {item.dueDate ?? "Geen deadline"}
      </p>
      {item.nextStep && (
        <p className="mt-1 text-xs text-[#101828]/55">Volgende: {item.nextStep}</p>
      )}
      <div className="mt-2 flex flex-wrap gap-1">
        {item.status !== "In behandeling" && (
          <Button type="button" size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => onStatusChange(item, "In behandeling")}>
            <Clock className="h-3 w-3" /> Behandelen
          </Button>
        )}
        {item.status !== "Wacht op reactie" && (
          <Button type="button" size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => onStatusChange(item, "Wacht op reactie")}>
            <MessageSquare className="h-3 w-3" /> Wachten
          </Button>
        )}
        {item.status !== "Afgerond" && (
          <Button type="button" size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => onStatusChange(item, "Afgerond")}>
            <Check className="h-3 w-3" /> Afronden
          </Button>
        )}
      </div>
    </div>
  );
}
