"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!isSupabaseConfigured()) {
      setError("Supabase is nog niet geconfigureerd op deze omgeving.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=/update-password`;

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo },
      );

      if (resetError) {
        setError("Er ging iets mis. Probeer het later opnieuw.");
        return;
      }

      setSubmitted(true);
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
          <Mail className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">Wachtwoord vergeten</h2>
          <p className="mt-1 text-sm text-white/70">
            Vul je e-mailadres in om een resetlink te ontvangen.
          </p>
        </div>
      </div>

      {submitted ? (
        <div className="relative mt-8 rounded-xl border border-emerald-400/25 bg-emerald-500/10 p-5 text-sm leading-7 text-emerald-100">
          Als dit e-mailadres bekend is, ontvang je een resetlink.
        </div>
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
            <span className="text-sm font-bold text-white/90">E-mailadres</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="naam@voorbeeld.nl"
              disabled={loading}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#38bdf8]/50 focus:ring-2 focus:ring-[#38bdf8]/20 disabled:opacity-60"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#F28C28] px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#de7c1f] disabled:opacity-70 sm:w-auto"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {loading ? "Versturen…" : "Resetlink versturen"}
          </button>
        </form>
      )}

      <Link
        href="/login"
        className="relative mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#7dd3fc] underline-offset-4 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Terug naar inloggen
      </Link>
    </div>
  );
}
