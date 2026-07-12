"use client";

import Link from "next/link";
import { Check, Clock, ExternalLink, MessageSquare, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import RiskCategoryBadge from "@/components/dashboard/risico-acties/RiskCategoryBadge";
import RiskPriorityBadge from "@/components/dashboard/risico-acties/RiskPriorityBadge";
import RiskStatusBadge from "@/components/dashboard/risico-acties/RiskStatusBadge";
import { getModuleLink, type RiskAction } from "@/lib/riskActions";

export default function RiskActionDrawer({
  action,
  open,
  onOpenChange,
  onEdit,
  onStatusChange,
}: {
  action: RiskAction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (action: RiskAction) => void;
  onStatusChange: (action: RiskAction, status: RiskAction["status"]) => void;
}) {
  if (!action) return null;

  const moduleLink = getModuleLink(action.relatedModule);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-[#0B1F4D]">{action.title}</SheetTitle>
          <SheetDescription>{action.owner} · {action.category}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-5 px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            <RiskCategoryBadge category={action.category} />
            <RiskPriorityBadge priority={action.priority} />
            <RiskStatusBadge status={action.status} />
          </div>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">Beschrijving</h3>
            <p className="text-sm text-[#101828]/80">{action.description}</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">Details</h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-[#101828]/55">Risiconiveau</dt>
              <dd className="font-medium">{action.riskLevel}</dd>
              <dt className="text-[#101828]/55">Eigenaar</dt>
              <dd>{action.owner}</dd>
              <dt className="text-[#101828]/55">Deadline</dt>
              <dd>{action.dueDate ?? "—"}</dd>
              <dt className="text-[#101828]/55">Gemaakt op</dt>
              <dd>{new Date(action.createdAt).toLocaleDateString("nl-NL")}</dd>
              <dt className="text-[#101828]/55">Laatst bijgewerkt</dt>
              <dd>{action.updatedAt ? new Date(action.updatedAt).toLocaleString("nl-NL") : "—"}</dd>
              <dt className="text-[#101828]/55">Module</dt>
              <dd>{action.relatedModule ?? "—"}</dd>
              <dt className="text-[#101828]/55">Project</dt>
              <dd>{action.relatedProject ?? "—"}</dd>
              <dt className="text-[#101828]/55">Klant</dt>
              <dd>{action.relatedClient ?? "—"}</dd>
            </dl>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">Actie & impact</h3>
            <dl className="space-y-2 text-sm">
              {action.impact && (
                <div>
                  <dt className="text-[#101828]/55">Impact</dt>
                  <dd>{action.impact}</dd>
                </div>
              )}
              <div>
                <dt className="text-[#101828]/55">Actie vereist</dt>
                <dd className="font-medium">{action.actionRequired}</dd>
              </div>
              {action.nextStep && (
                <div>
                  <dt className="text-[#101828]/55">Volgende stap</dt>
                  <dd>{action.nextStep}</dd>
                </div>
              )}
            </dl>
          </section>

          {action.notes && (
            <section className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">Notities</h3>
              <p className="rounded-lg bg-[#F5F7FA]/80 px-3 py-2 text-sm">{action.notes}</p>
            </section>
          )}
        </div>

        <SheetFooter className="flex-col gap-2 border-t px-4 py-4 sm:flex-col">
          <div className="flex w-full flex-wrap gap-2">
            <Button type="button" size="sm" onClick={() => onEdit(action)}>
              <Pencil className="h-4 w-4" /> Bewerken
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => onStatusChange(action, "In behandeling")}>
              <Clock className="h-4 w-4" /> In behandeling
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => onStatusChange(action, "Wacht op reactie")}>
              <MessageSquare className="h-4 w-4" /> Wacht op reactie
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => onStatusChange(action, "Afgerond")}>
              <Check className="h-4 w-4" /> Afgerond
            </Button>
          </div>
          {moduleLink && (
            <Button type="button" size="sm" variant="outline" render={<Link href={moduleLink} />}>
              <ExternalLink className="h-4 w-4" /> Naar {action.relatedModule}
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
