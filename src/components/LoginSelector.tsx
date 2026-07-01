"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  applicationsEmail,
  contactEmail,
} from "@/lib/navigation";
import { portals, type PortalType } from "@/lib/portals";

type LoginSelectorProps = {
  initialType: PortalType;
};

export default function LoginSelector({ initialType }: LoginSelectorProps) {
  const [activePortal, setActivePortal] = useState<PortalType>(initialType);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-4 lg:grid-cols-3">
        {portals.map((portal) => {
          const isActive = activePortal === portal.id;
          return (
            <button
              key={portal.id}
              type="button"
              onClick={() => {
                setActivePortal(portal.id);
                setSubmitted(false);
              }}
              className={`cursor-pointer rounded-2xl border p-6 text-left shadow-lg transition focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2 ${
                isActive
                  ? "border-[#F28C28] bg-white shadow-[#F28C28]/15 ring-2 ring-[#F28C28]/20"
                  : "border-slate-200/80 bg-white hover:-translate-y-0.5 hover:border-[#173A8A]/30 hover:shadow-xl"
              }`}
            >
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                  isActive
                    ? "bg-[#F28C28] text-white"
                    : "bg-[#F5F7FA] text-[#173A8A]"
                }`}
              >
                {portal.title}
              </span>
              <h2 className="mt-4 text-xl font-black text-[#0B1F4D]">
                {portal.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#101828]/75">
                {portal.description}
              </p>
              <ul className="mt-4 space-y-2">
                {portal.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex gap-2 text-sm text-[#101828]/80"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F28C28]" />
                    {feature}
                  </li>
                ))}
              </ul>
              <span
                className={`mt-6 inline-flex rounded-full px-5 py-2.5 text-sm font-bold transition ${
                  isActive
                    ? "bg-[#173A8A] text-white"
                    : "bg-[#F5F7FA] text-[#173A8A]"
                }`}
              >
                {portal.buttonLabel}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-10 rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-2xl shadow-[#0B1F4D]/10 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#F28C28]">
              Login
            </p>
            <h2 className="mt-1 text-2xl font-black text-[#0B1F4D]">
              {portals.find((p) => p.id === activePortal)?.title}
            </h2>
          </div>
          <span className="rounded-full bg-[#F28C28]/15 px-3 py-1 text-xs font-bold text-[#F28C28]">
            Portaal in ontwikkeling
          </span>
        </div>

        {submitted ? (
          <div className="mt-8 rounded-2xl bg-[#0B1F4D] p-8 text-white">
            <p className="text-2xl font-black">Portaaltoegang is nog niet actief.</p>
            <p className="mt-4 leading-7 text-white/75">
              Deze login wordt later gekoppeld aan veilige authenticatie. Gebruik
              voorlopig{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="font-bold text-[#F28C28] underline-offset-4 hover:underline"
              >
                {contactEmail}
              </a>{" "}
              voor personeelsaanvragen en{" "}
              <a
                href={`mailto:${applicationsEmail}`}
                className="font-bold text-[#F28C28] underline-offset-4 hover:underline"
              >
                {applicationsEmail}
              </a>{" "}
              voor crew-aanmeldingen.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href={
                  portals.find((p) => p.id === activePortal)?.dashboardHref ??
                  "/portaal"
                }
                className="inline-flex items-center justify-center rounded-full border-2 border-white/30 px-6 py-3 text-sm font-bold transition hover:bg-white/10"
              >
                Bekijk portaal-demo
              </Link>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="inline-flex items-center justify-center rounded-full bg-[#F28C28] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#de7c1f]"
              >
                Terug naar login
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block">
              <span className="text-sm font-black text-[#0B1F4D]">
                E-mailadres
              </span>
              <input
                type="email"
                autoComplete="email"
                placeholder="naam@voorbeeld.nl"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-[#F5F7FA] px-4 py-3 text-sm outline-none transition focus:border-[#F28C28] focus:ring-2 focus:ring-[#F28C28]/20"
              />
            </label>
            <label className="block">
              <span className="text-sm font-black text-[#0B1F4D]">
                Wachtwoord
              </span>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-[#F5F7FA] px-4 py-3 text-sm outline-none transition focus:border-[#F28C28] focus:ring-2 focus:ring-[#F28C28]/20"
              />
            </label>

            <p className="rounded-xl bg-[#F5F7FA] p-4 text-sm leading-6 text-[#101828]/75">
              De portalen zijn nog in ontwikkeling. Gebruik voorlopig{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
              >
                {contactEmail}
              </a>{" "}
              voor personeelsaanvragen en{" "}
              <a
                href={`mailto:${applicationsEmail}`}
                className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
              >
                {applicationsEmail}
              </a>{" "}
              voor crew-aanmeldingen.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="submit"
                className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[#F28C28] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#F28C28]/25 transition hover:scale-[1.02] hover:bg-[#de7c1f] focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2"
              >
                Inloggen
              </button>
              <button
                type="button"
                className="text-sm font-semibold text-[#173A8A] underline-offset-4 hover:underline"
              >
                Wachtwoord vergeten — volgt zodra het portaal live gaat
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
