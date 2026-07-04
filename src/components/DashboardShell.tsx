import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import type { Profile } from "@/lib/auth";

type DashboardShellProps = {
  profile: Profile;
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function DashboardShell({
  profile,
  title,
  description,
  children,
}: DashboardShellProps) {
  return (
    <div className="-mx-4 flex min-h-[calc(100vh-4rem)] flex-col lg:-mx-8 lg:min-h-[calc(100vh-5rem)] lg:flex-row">
      <DashboardSidebar profile={profile} />
      <div className="flex min-w-0 flex-1 flex-col bg-[#F5F7FA]">
        <header className="border-b border-slate-200/80 bg-white px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#38bdf8]">
            Dashboard
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-[#0B1F4D] sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#101828]/70 sm:text-base">
            {description}
          </p>
        </header>
        <div className="flex-1 space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
