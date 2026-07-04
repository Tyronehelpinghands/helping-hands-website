import DashboardHeader from "@/components/dashboard/DashboardHeader";
import InternDashboardSidebar from "@/components/dashboard/InternDashboardSidebar";
import type { Profile } from "@/lib/auth";

type InternDashboardShellProps = {
  profile: Profile;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
};

export default function InternDashboardShell({
  profile,
  children,
  title,
  subtitle,
}: InternDashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <InternDashboardSidebar profile={profile} />
      <div className="flex min-w-0 flex-1 flex-col bg-[#F5F7FA]">
        <DashboardHeader profile={profile} title={title} subtitle={subtitle} />
        <div className="flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
