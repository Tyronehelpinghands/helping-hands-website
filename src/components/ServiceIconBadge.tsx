import type { ServiceIconKey } from "@/lib/service-icons";
import { serviceIconMap } from "@/lib/service-icons";

type ServiceIconProps = {
  icon: ServiceIconKey;
  className?: string;
};

export function ServiceIcon({ icon, className = "h-5 w-5" }: ServiceIconProps) {
  const Icon = serviceIconMap[icon];
  return <Icon className={className} strokeWidth={1.75} aria-hidden="true" />;
}

type ServiceIconBadgeProps = {
  icon: ServiceIconKey;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "light" | "ghost";
  interactive?: boolean;
  className?: string;
};

const sizeClasses = {
  sm: {
    box: "h-11 w-11 rounded-xl",
    icon: "h-5 w-5",
  },
  md: {
    box: "h-14 w-14 rounded-2xl",
    icon: "h-6 w-6",
  },
  lg: {
    box: "h-14 w-14 rounded-2xl sm:h-[3.25rem] sm:w-[3.25rem]",
    icon: "h-6 w-6 sm:h-7 sm:w-7",
  },
};

const variantClasses = {
  default:
    "border border-[#173A8A]/15 bg-gradient-to-br from-[#173A8A]/10 via-white to-[#F5F7FA] text-[#173A8A] shadow-sm shadow-[#173A8A]/10",
  light:
    "border border-white/20 bg-white/10 text-white shadow-sm shadow-[#0B1F4D]/20",
  ghost:
    "border border-slate-200/80 bg-[#F5F7FA] text-[#173A8A]",
};

export default function ServiceIconBadge({
  icon,
  size = "md",
  variant = "default",
  interactive = false,
  className = "",
}: ServiceIconBadgeProps) {
  const Icon = serviceIconMap[icon];
  const sizes = sizeClasses[size];

  return (
    <div
      className={`flex shrink-0 items-center justify-center ${sizes.box} ${variantClasses[variant]} ${
        interactive
          ? "transition duration-300 group-hover:scale-105 group-hover:border-[#F28C28]/40 group-hover:bg-gradient-to-br group-hover:from-[#F28C28]/15 group-hover:via-white group-hover:to-[#F28C28]/5 group-hover:text-[#F28C28] group-hover:shadow-md group-hover:shadow-[#F28C28]/15"
          : ""
      } ${className}`}
    >
      <Icon
        className={sizes.icon}
        strokeWidth={1.75}
        aria-hidden="true"
      />
    </div>
  );
}
