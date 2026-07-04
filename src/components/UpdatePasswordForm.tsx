"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { KeyRound, Loader2 } from "lucide-react";
import { getDashboardPathForRole, isValidRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default function UpdatePasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Gebruik minimaal 8 tekens voor je nieuwe wachtwoord.");
      return;
    }

    if (password !== confirmPassword) {
      setError("De wachtwoorden komen niet overeen.");
      return;
    }

    if (!isSupabaseConfigured()) {
      setError("Supabase is nog niet geconfigureerd op deze omgeving.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError("Het wachtwoord kon niet worden bijgewerkt. Vraag een nieuwe resetlink aan.");
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        if (profile?.role && isValidRole(profile.role)) {
          setSuccess(true);
          router.push(getDashboardPathForRole(profile.role));
          router.refresh();
          return;
        }
      }

      setSuccess(true);
      router.push("/login");
      router.refresh();
    } catch {
      setError("Er ging iets mis. Probeer het later opnieuw.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[#173A8A]/20 bg-[#0B1F4D] p-6 shadow-2xl sm:p-8">
      <div className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full bg-[#38bdf8]/10 blur-3xl" />

      <div className="relative flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#38bdf8]/25 bg-[#173A8A]/50 text-[#7dd3fc]">
          <KeyRound className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">Nieuw wachtwoord instellen</h2>
          <p className="mt-1 text-sm text-white/70">
            Kies een sterk wachtwoord voor je account.
          </p>
        </div>
      </div>

      {success ? (
        <p className="relative mt-8 text-sm text-emerald-100">
          Wachtwoord bijgewerkt. Je wordt doorgestuurd…
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="relative mt-8 space-y-5">
          {error && (
            <div
              className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100"
              role="alert"
            >
              {error}
            </div>
          )}
          <label className="block">
            <span className="text-sm font-bold text-white/90">Nieuw wachtwoord</span>
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-[#38bdf8]/50 focus:ring-2 focus:ring-[#38bdf8]/20 disabled:opacity-60"
            />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-white/90">Bevestig wachtwoord</span>
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-[#38bdf8]/50 focus:ring-2 focus:ring-[#38bdf8]/20 disabled:opacity-60"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#F28C28] px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#de7c1f] disabled:opacity-70 sm:w-auto"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {loading ? "Opslaan…" : "Wachtwoord opslaan"}
          </button>
        </form>
      )}

      <Link
        href="/login"
        className="relative mt-6 inline-flex text-sm font-semibold text-[#7dd3fc] underline-offset-4 hover:underline"
      >
        Terug naar inloggen
      </Link>
    </div>
  );
}
