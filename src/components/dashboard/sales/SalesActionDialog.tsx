"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type SalesActionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
};

export default function SalesActionDialog({
  open,
  onOpenChange,
  title,
  description,
}: SalesActionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#0B1F4D]">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="rounded-xl border border-dashed border-slate-200 bg-[#F5F7FA] px-4 py-6 text-center text-sm text-[#101828]/65">
          Deze actie wordt binnenkort gekoppeld aan CRM-functionaliteit.
          Mock data blijft beschikbaar voor demo en testing.
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Sluiten
          </Button>
          <Button
            type="button"
            className="bg-[#173A8A] text-white hover:bg-[#0B1F4D]"
            onClick={() => onOpenChange(false)}
          >
            Begrepen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
