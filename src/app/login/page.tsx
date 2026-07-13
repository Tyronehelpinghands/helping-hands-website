import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BrandLogoImage } from "@/components/BrandLogo";
import LoginSelector from "@/components/LoginSelector";
import {
  isValidRole,
  resolveLoginDestination,
  canAccessDashboardPath,
  getDashboardPathForRole,
} from "@/lib/auth";
import { getSessionProfile } from "@/lib/auth-server";
import { getPortalByType } from "@/lib/portals";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Inloggen | Helping Hands Agency",
  description:
    "Log veilig in op het intern portaal, medewerkersportaal of opdrachtgeversportaal van Helping Hands Agency.",
};

const errorMessages: Record<string, string> = {
  profile:
    "Je account is nog niet volledig ingesteld. Neem contact op met Helping Hands.",
  auth: "Authenticatie is mislukt. Probeer opnieuw in te loggen.",
};

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const initialType = getPortalByType(params.type ?? null);
  const redirectTo = params.next ?? null;
  const configError = !isSupabaseConfigured()
    ? "Supabase is nog niet geconfigureerd op deze omgeving."
    : (params.error ? errorMessages[params.error] : null);

  if (isSupabaseConfigured()) {
    try {
      const { user, profile } = await getSessionProfile();
      if (user && profile && isValidRole(profile.role)) {
        const portalType = params.type ? getPortalByType(params.type) : null;
        const destination = portalType
          ? resolveLoginDestination(profile.role, portalType, redirectTo)
          : redirectTo && canAccessDashboardPath(profile.role, redirectTo)
            ? redirectTo
            : getDashboardPathForRole(profile.role);
        redirect(destination);
      }
    } catch {
      // Supabase niet bereikbaar — toon loginpagina met foutmelding.
    }
  }

  return (
    <>
      <section className="hero-gradient relative overflow-hidden text-white">
        <div className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-[#38bdf8]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-[#F28C28]/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
            <BrandLogoImage
              variant="markWhite"
              imageClassName="h-14 w-14 shrink-0"
            />
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#7dd3fc]">
                Portalen
              </p>
              <h1 className="mt-1 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
                Inloggen bij Helping Hands Agency
              </h1>
            </div>
          </div>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85">
            Kies je portaal en log veilig in met je account.
          </p>
        </div>
      </section>

      <section className="bg-[#F5F7FA] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <LoginSelector
          key={initialType}
          initialType={initialType}
          configError={configError}
          redirectTo={redirectTo}
        />
      </section>
    </>
  );
}
