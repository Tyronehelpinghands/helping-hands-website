"use client";

import { FormEvent, useState } from "react";
import { ServiceIcon } from "@/components/ServiceIconBadge";
import {
  contactPhoneDisplay,
  contactPhoneLandlineDisplay,
  contactPhoneLandlineTel,
  contactPhoneTel,
  contactWhatsappUrl,
  planningEmail,
} from "@/lib/navigation";
import { getServiceIconKey } from "@/lib/service-icons";

const deploymentTypes = [
  "Event crew",
  "Horeca support",
  "Stagehands",
  "Productie assistentie",
  "Logistiek",
  "Teamcaptain",
];

const crewSizes = ["1-3", "4-8", "9-15", "15+"];

function buildRequestPlainText(input: {
  type: string;
  crewSize: string;
  when: string;
  location: string;
  contact: string;
}) {
  return [
    "Hallo Helping Hands,",
    "",
    "Ik wil graag crew aanvragen:",
    "",
    `Type inzet: ${input.type}`,
    `Aantal mensen: ${input.crewSize}`,
    `Wanneer: ${input.when || "n.n.b."}`,
    `Locatie: ${input.location || "n.n.b."}`,
    `Contact: ${input.contact || "n.n.b."}`,
    "",
    "Graag hoor ik wat er mogelijk is.",
  ].join("\n");
}

export default function QuickRequestForm() {
  const [type, setType] = useState(deploymentTypes[0]);
  const [crewSize, setCrewSize] = useState(crewSizes[1]);
  const [when, setWhen] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const plain = buildRequestPlainText({ type, crewSize, when, location, contact });
    const subject = encodeURIComponent(
      `Crewaanvraag: ${type} (${crewSize} personen)`,
    );
    const body = encodeURIComponent(plain);

    window.location.href = `mailto:${planningEmail}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  async function copyRequest() {
    const plain = buildRequestPlainText({ type, crewSize, when, location, contact });
    try {
      await navigator.clipboard.writeText(plain);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  function resetForm() {
    setSubmitted(false);
    setCopied(false);
    setWhen("");
    setLocation("");
    setContact("");
  }

  return (
    <section className="bg-[#0B1F4D] px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
            Snelle aanvraag
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            Vraag snel crew aan
          </h2>
          <p className="mt-5 text-lg leading-8 text-white/75">
            Vul de eerste details in. Daarna opent je e-mailprogramma met een
            kant-en-klare aanvraag naar {planningEmail}. Werkt dat niet? Kopieer
            de tekst en mail of app ons.
          </p>
          <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-5">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#F28C28]">
              Spoed?
            </p>
            <p className="mt-2 text-sm leading-7 text-white/80">
              Bel of app direct — we denken mee over wat nog haalbaar is.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <a
                href={`tel:${contactPhoneTel}`}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#F28C28] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#de7c1f]"
              >
                Bel {contactPhoneDisplay}
              </a>
              <a
                href={`tel:${contactPhoneLandlineTel}`}
                className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-white/35 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Vast {contactPhoneLandlineDisplay}
              </a>
              <a
                href={contactWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-white/35 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                WhatsApp
              </a>
              <a
                href={`mailto:${planningEmail}`}
                className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-white/35 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Mail
              </a>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-white p-5 text-[#101828] shadow-2xl sm:p-6"
        >
          {submitted ? (
            <div className="rounded-2xl bg-[#F5F7FA] p-6">
              <p className="text-2xl font-black text-[#0B1F4D]">
                Je e-mailprogramma opent.
              </p>
              <p className="mt-3 leading-7 text-[#101828]/75">
                Controleer de aanvraag en verstuur hem. Komt er niets op? Kopieer
                de tekst hieronder, of mail naar{" "}
                <a
                  href={`mailto:${planningEmail}`}
                  className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
                >
                  {planningEmail}
                </a>
                , bel{" "}
                <a
                  href={`tel:${contactPhoneTel}`}
                  className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
                >
                  {contactPhoneDisplay}
                </a>{" "}
                of{" "}
                <a
                  href={contactWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
                >
                  stuur een WhatsApp
                </a>
                .
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={copyRequest}
                  className="min-h-11 rounded-full border-2 border-[#173A8A] px-6 py-3 text-sm font-bold text-[#173A8A] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2"
                >
                  {copied ? "Gekopieerd" : "Kopieer aanvraagtekst"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="min-h-11 rounded-full bg-[#173A8A] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0B1F4D] focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2"
                >
                  Nieuwe aanvraag
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-black text-[#0B1F4D]">
                  Type inzet
                </label>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {deploymentTypes.map((item) => {
                    const iconKey = getServiceIconKey(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setType(item)}
                        className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2 ${
                          type === item
                            ? "border-[#F28C28] bg-[#F28C28] text-white"
                            : "border-slate-200 bg-[#F5F7FA] text-[#173A8A] hover:border-[#173A8A]/40"
                        }`}
                      >
                        {iconKey && (
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-current/15 bg-white/10">
                            <ServiceIcon icon={iconKey} className="h-4 w-4" />
                          </span>
                        )}
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-sm font-black text-[#0B1F4D]">
                  Aantal mensen
                </label>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {crewSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setCrewSize(size)}
                      className={`min-h-11 cursor-pointer rounded-xl border px-4 py-3 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2 ${
                        crewSize === size
                          ? "border-[#173A8A] bg-[#173A8A] text-white"
                          : "border-slate-200 bg-[#F5F7FA] text-[#173A8A] hover:border-[#173A8A]/40"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-black text-[#0B1F4D]">
                    Wanneer
                  </span>
                  <input
                    type="date"
                    value={when}
                    onChange={(e) => setWhen(e.target.value)}
                    className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-[#F5F7FA] px-4 py-3 text-sm outline-none transition focus:border-[#F28C28] focus:ring-2 focus:ring-[#F28C28]/20"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-black text-[#0B1F4D]">
                    Locatie
                  </span>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Bijv. Amsterdam"
                    className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-[#F5F7FA] px-4 py-3 text-sm outline-none transition focus:border-[#F28C28] focus:ring-2 focus:ring-[#F28C28]/20"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-black text-[#0B1F4D]">Contact</span>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="E-mail of telefoon"
                  required
                  className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-[#F5F7FA] px-4 py-3 text-sm outline-none transition focus:border-[#F28C28] focus:ring-2 focus:ring-[#F28C28]/20"
                />
              </label>

              <p className="rounded-xl bg-[#F5F7FA] p-4 text-sm leading-6 text-[#101828]/70">
                “Aanvraag openen” start je e-mailclient. Lukt dat niet? Gebruik
                “Kopieer aanvraagtekst”, bel{" "}
                <a
                  href={`tel:${contactPhoneTel}`}
                  className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
                >
                  {contactPhoneDisplay}
                </a>{" "}
                of{" "}
                <a
                  href={contactWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
                >
                  WhatsApp
                </a>
                .
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  className="min-h-11 w-full cursor-pointer rounded-full bg-[#F28C28] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#F28C28]/25 transition hover:scale-[1.01] hover:bg-[#de7c1f] focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2 sm:flex-1"
                >
                  Aanvraag openen in e-mail
                </button>
                <button
                  type="button"
                  onClick={copyRequest}
                  className="min-h-11 w-full cursor-pointer rounded-full border-2 border-[#173A8A] px-8 py-4 text-sm font-bold text-[#173A8A] transition hover:bg-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2 sm:w-auto sm:shrink-0"
                >
                  {copied ? "Gekopieerd" : "Kopieer aanvraagtekst"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
