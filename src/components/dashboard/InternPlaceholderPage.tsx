import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type InternPlaceholderPageProps = {
  title: string;
  description: string;
};

/** Fallback empty module shell — not used by live intern routes. */
export default function InternPlaceholderPage({
  title,
  description,
}: InternPlaceholderPageProps) {
  return (
    <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
      <CardHeader>
        <CardTitle className="text-2xl font-black text-[#0B1F4D]">{title}</CardTitle>
        <CardDescription className="max-w-2xl text-base leading-7">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border border-dashed border-slate-200 bg-[#F5F7FA] px-6 py-10 text-center">
          <p className="text-sm font-semibold text-[#0B1F4D]">
            Deze module is nog niet gekoppeld
          </p>
          <p className="mt-2 text-sm text-[#101828]/60">
            Navigatie en layout staan klaar. Functionaliteit volgt wanneer de
            module is aangesloten op Supabase.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
