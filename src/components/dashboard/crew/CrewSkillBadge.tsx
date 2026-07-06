import { cn } from "@/lib/utils";

type CrewSkillBadgeProps = {
  label: string;
  variant?: "skill" | "role" | "cert";
  className?: string;
};

const variants = {
  skill: "border-slate-200 bg-[#F5F7FA] text-[#101828]/70",
  role: "border-[#173A8A]/20 bg-[#173A8A]/10 text-[#173A8A]",
  cert: "border-[#F28C28]/20 bg-[#F28C28]/10 text-[#c96f1a]",
};

export default function CrewSkillBadge({
  label,
  variant = "skill",
  className,
}: CrewSkillBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-1.5 py-0.5 text-[10px] font-semibold",
        variants[variant],
        className,
      )}
    >
      {label}
    </span>
  );
}
