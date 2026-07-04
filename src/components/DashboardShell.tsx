import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
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
    <>
      <section className="hero-gradient text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-12 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-8 lg:py-14">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
              {description}
            </p>
            <p className="mt-3 text-sm text-white/55">
              Ingelogd als{" "}
              <span className="font-semibold text-white/80">
                {profile.full_name ?? profile.email ?? "gebruiker"}
              </span>
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:items-end">
            <LogoutButton />
            <Link
              href="/"
              className="text-sm font-semibold text-white/70 underline-offset-4 transition hover:text-white hover:underline"
            >
              Terug naar website
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {children}
      </section>
    </>
  );
}
