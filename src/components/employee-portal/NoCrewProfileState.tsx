import { UserX } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type NoCrewProfileStateProps = {
  displayName?: string;
  className?: string;
};

export default function NoCrewProfileState({
  displayName,
  className,
}: NoCrewProfileStateProps) {
  return (
    <Card className={cn("border-slate-200/80 bg-white shadow-sm", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-black text-[#0B1F4D]">
          <UserX className="h-5 w-5 text-[#F28C28]" />
          Geen medewerkerprofiel gekoppeld
        </CardTitle>
        <CardDescription>
          {displayName
            ? `${displayName}, je account is ingelogd, maar er is geen crewlid in het systeem aan jouw profiel of e-mailadres gekoppeld.`
            : "Je account is ingelogd, maar er is geen crewlid in het systeem aan jouw profiel of e-mailadres gekoppeld."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-slate-600">
        <p>
          Planning koppelt accounts via{" "}
          <code className="text-xs">crew_members.profile_id</code> of hetzelfde
          e-mailadres als in je login. Zonder die koppeling tonen we geen demogegevens —
          alleen deze lege status.
        </p>
        <p>
          Ben je intern (owner/admin/planner)? Gebruik het interne dashboard voor crew en
          planning. Wil je het medewerkersportaal testen, koppel dan een{" "}
          <code className="text-xs">crew_members</code>-rij aan dit account.
        </p>
        <p className="text-slate-500">
          Vraag planning of een beheerder om jouw login te koppelen aan een crewlid (zie{" "}
          <span className="font-medium">docs/employee-portal-supabase.md</span>).
        </p>
      </CardContent>
    </Card>
  );
}
