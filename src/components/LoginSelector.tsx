"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  Building2,
  Loader2,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  isValidRole,
  PROFILE_INCOMPLETE_MESSAGE,
  resolveLoginDestination,
} from "@/lib/auth";
import {
  getRedirectForRole,
  LOGIN_PORTAL_CARDS,
  persistDemoRole,
  type DemoUserRole,
} from "@/lib/authRedirects";
import { contactEmail } from "@/lib/navigation";
import type { PortalType } from "@/lib/portals";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const portalIcons: Record<PortalType, LucideIcon> = {
  intern: ShieldCheck,
  medewerker: Users,
  opdrachtgever: Building2,
};

type LoginSelectorProps = {
  initialType: PortalType;
  configError?: string | null;
  redirectTo?: string | null;
};

export default function LoginSelector({
  initialType,
  configError = null,
  redirectTo = null,
}: LoginSelectorProps) {
  const router = useRouter();
  const supabaseEnabled = isSupabaseConfigured();
  const [activePortal, setActivePortal] = useState<PortalType>(initialType);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(configError);

  const activeCard =
    LOGIN_PORTAL_CARDS.find((card) => card.portalType === activePortal) ??
    LOGIN_PORTAL_CARDS[0];

  function handleDemoLogin(demoRole: DemoUserRole) {
    void (async () => {
      if (supabaseEnabled) {
        try {
          const supabase = createClient();
          await supabase.auth.signOut();
        } catch {
          // Demo-login mag doorgaan zonder Supabase-sessie.
        }
      }
      persistDemoRole(demoRole);
      window.location.assign(getRedirectForRole(demoRole));
    })();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!supabaseEnabled) {
      setError("Gebruik de demo-knoppen om in te loggen. Echte auth volgt later.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError("Onjuist e-mailadres of wachtwoord. Probeer het opnieuw.");
        return;
      }

      if (!data.user) {
        setError("Inloggen is mislukt. Probeer het opnieuw.");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profileError || !profile?.role || !isValidRole(profile.role)) {
        await supabase.auth.signOut();
        setError(PROFILE_INCOMPLETE_MESSAGE);
        return;
      }

      const destination = resolveLoginDestination(
        profile.role,
        activePortal,
        redirectTo,
      );

      router.push(destination);
      router.refresh();
    } catch {
      setError("Er ging iets mis bij het inloggen. Probeer het later opnieuw.");
    } finally {
      setLoading(false);
    }
  }

  const PortalIcon = portalIcons[activePortal];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 rounded-xl border border-[#38bdf8]/20 bg-[#38bdf8]/5 px-4 py-3 text-sm text-[#0284c7]">
        Demo-login. Echte toegang wordt later gekoppeld aan veilige auth.
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {LOGIN_PORTAL_CARDS.map((card) => {
          const isActive = activePortal === card.portalType;
          const Icon = portalIcons[card.portalType];

          return (
            <article
              key={card.portalType}
              className={`flex flex-col rounded-2xl border p-6 shadow-lg transition ${
                isActive
                  ? "border-[#38bdf8]/60 bg-[#0B1F4D] text-white ring-1 ring-[#38bdf8]/30"
                  : "border-slate-200/80 bg-white hover:border-[#173A8A]/30 hover:shadow-xl"
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setActivePortal(card.portalType);
                  setError(null);
                }}
                className="text-left focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:ring-offset-2 focus:ring-offset-[#F5F7FA] rounded-lg"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border ${
                    isActive
                      ? "border-[#38bdf8]/30 bg-[#173A8A]/60 text-[#7dd3fc]"
                      : "border-[#173A8A]/15 bg-[#F5F7FA] text-[#173A8A]"
                  }`}
                >
                  <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <h2
                  className={`mt-4 text-xl font-black ${
                    isActive ? "text-white" : "text-[#0B1F4D]"
                  }`}
                >
                  {card.title}
                </h2>
                <p
                  className={`mt-2 text-sm leading-6 ${
                    isActive ? "text-white/75" : "text-[#101828]/75"
                  }`}
                >
                  {card.description}
                </p>
                <p
                  className={`mt-3 text-xs ${
                    isActive ? "text-white/55" : "text-slate-500"
                  }`}
                >
                  Voor: {card.audience}
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin(card.demoRole)}
                className={`mt-6 inline-flex w-full cursor-pointer items-center justify-center rounded-full px-6 py-3 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isActive
                    ? "bg-[#F28C28] text-white shadow-lg shadow-[#F28C28]/25 hover:bg-[#de7c1f] focus:ring-[#F28C28] focus:ring-offset-[#0B1F4D]"
                    : "bg-[#173A8A] text-white hover:bg-[#0B1F4D] focus:ring-[#173A8A]"
                }`}
              >
                {card.buttonLabel}
              </button>
            </article>
          );
        })}
      </div>

      {supabaseEnabled ? (
        <div className="relative mt-10 overflow-hidden rounded-[2rem] border border-[#173A8A]/20 bg-[#0B1F4D] p-6 shadow-2xl shadow-[#0B1F4D]/30 sm:p-8">
          <div className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full bg-[#38bdf8]/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-[#F28C28]/10 blur-3xl" />

          <div className="relative flex flex-wrap items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#38bdf8]/25 bg-[#173A8A]/50 text-[#7dd3fc]">
              <PortalIcon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7dd3fc]">
                Supabase login
              </p>
              <h2 className="mt-1 text-2xl font-black text-white sm:text-3xl">
                {activeCard.title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
                Log in met je account. Je wordt doorgestuurd naar het portaal dat je hierboven
                hebt gekozen.
              </p>
            </div>
          </div>

          {error ? (
            <div
              className="relative mt-6 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-100"
              role="alert"
            >
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="relative mt-8 space-y-5">
            <label className="block">
              <span className="text-sm font-bold text-white/90">E-mailadres</span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="naam@voorbeeld.nl"
                disabled={loading}
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#38bdf8]/50 focus:ring-2 focus:ring-[#38bdf8]/20 disabled:opacity-60"
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-white/90">Wachtwoord</span>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#38bdf8]/50 focus:ring-2 focus:ring-[#38bdf8]/20 disabled:opacity-60"
              />
            </label>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:ring-offset-2 focus:ring-offset-[#0B1F4D] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : null}
                {loading ? "Bezig met inloggen…" : "Inloggen met account"}
              </button>
              <Link
                href="/forgot-password"
                className="text-sm font-semibold text-[#7dd3fc] underline-offset-4 transition hover:text-white hover:underline"
              >
                Wachtwoord vergeten
              </Link>
            </div>
          </form>

          <p className="relative mt-4 text-xs leading-5 text-white/45">
            Nog geen account? Neem contact op via{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="font-semibold text-[#7dd3fc] underline-offset-4 hover:underline"
            >
              {contactEmail}
            </a>
            .
          </p>
        </div>
      ) : (
        error && (
          <div
            className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </div>
        )
      )}
    </div>
  );
}
