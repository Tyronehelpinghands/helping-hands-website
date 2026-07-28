"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  buildClientMailto,
  buildClientRequestPlainText,
  buildGeneralMailto,
  buildGeneralQuestionPlainText,
  buildWorkerApplicationPlainText,
  buildWorkerMailto,
  clientInzetTypes,
  type ContactAudience,
  workerInterestOptions,
} from "@/lib/contact";
import {
  applicationsEmail,
  contactEmail,
  planningEmail,
} from "@/lib/navigation";
import { cn } from "@/lib/utils";

type FieldDef = {
  label: string;
  type: string;
  name: string;
  required?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
  section?: string;
};

const clientFields: FieldDef[] = [
  {
    label: "Bedrijfsnaam",
    type: "text",
    name: "bedrijfsnaam",
    required: true,
    section: "Contact",
  },
  {
    label: "Naam contactpersoon",
    type: "text",
    name: "contactpersoon",
    required: true,
    section: "Contact",
  },
  {
    label: "E-mail",
    type: "email",
    name: "email",
    required: true,
    section: "Contact",
  },
  {
    label: "Telefoon",
    type: "tel",
    name: "telefoon",
    required: true,
    section: "Contact",
  },
  {
    label: "Datum",
    type: "date",
    name: "datum",
    required: true,
    section: "Project",
  },
  {
    label: "Locatie",
    type: "text",
    name: "locatie",
    required: true,
    section: "Project",
  },
  {
    label: "Starttijd",
    type: "time",
    name: "starttijd",
    required: true,
    section: "Project",
  },
  {
    label: "Eindtijd",
    type: "time",
    name: "eindtijd",
    required: true,
    section: "Project",
  },
  {
    label: "Functies",
    type: "text",
    name: "functies",
    required: true,
    placeholder: "Bijv. stagehands, barbacks, runners",
    section: "Inzet",
  },
  {
    label: "Aantal mensen",
    type: "number",
    name: "aantal",
    required: true,
    section: "Inzet",
  },
  {
    label: "Kleding / PBM",
    type: "text",
    name: "kleding-pbm",
    placeholder: "Zwarte kleding, veiligheidsschoenen, etc.",
    section: "Briefing",
  },
  {
    label: "Contactpersoon op locatie",
    type: "text",
    name: "contact-locatie",
    section: "Briefing",
  },
  {
    label: "Extra briefing",
    type: "textarea",
    name: "briefing",
    fullWidth: true,
    placeholder: "Taken, aankomst, zones, bijzonderheden…",
    section: "Briefing",
  },
];

const workerFields: FieldDef[] = [
  { label: "Naam", type: "text", name: "naam", required: true },
  { label: "E-mail", type: "email", name: "email", required: true },
  { label: "Telefoon", type: "tel", name: "telefoon", required: true },
  { label: "Woonplaats", type: "text", name: "woonplaats", required: true },
  { label: "Leeftijd", type: "number", name: "leeftijd" },
  {
    label: "Ervaring",
    type: "textarea",
    name: "ervaring",
    fullWidth: true,
    required: true,
  },
  { label: "Beschikbaarheid", type: "text", name: "beschikbaarheid" },
  { label: "ZZP of loondienst", type: "text", name: "contractvorm" },
  { label: "Rijbewijs", type: "text", name: "rijbewijs", placeholder: "Ja / Nee" },
  { label: "Vervoer", type: "text", name: "vervoer", placeholder: "OV / auto / anders" },
];

const generalFields: FieldDef[] = [
  { label: "Naam", type: "text", name: "naam", required: true },
  { label: "E-mail", type: "email", name: "email", required: true },
  { label: "Telefoon", type: "tel", name: "telefoon" },
  {
    label: "Onderwerp",
    type: "text",
    name: "onderwerp",
    required: true,
    placeholder: "Samenwerking, administratie, algemene vraag…",
  },
  {
    label: "Bericht",
    type: "textarea",
    name: "bericht",
    fullWidth: true,
    required: true,
  },
];

function Field({ field }: { field: FieldDef }) {
  return (
    <label
      className={
        field.fullWidth || field.type === "textarea"
          ? "block sm:col-span-2"
          : "block"
      }
    >
      <span className="text-sm font-black text-[#0B1F4D]">
        {field.label}
        {field.required ? (
          <span className="text-[#F28C28]" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </span>
      {field.type === "textarea" ? (
        <textarea
          id={field.name}
          name={field.name}
          rows={4}
          required={field.required}
          placeholder={field.placeholder}
          className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-[#F5F7FA] px-4 py-3 text-sm outline-none transition focus:border-[#F28C28] focus:ring-2 focus:ring-[#F28C28]/20"
        />
      ) : (
        <input
          id={field.name}
          name={field.name}
          type={field.type}
          required={field.required}
          placeholder={field.placeholder}
          className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-[#F5F7FA] px-4 py-3 text-sm outline-none transition focus:border-[#F28C28] focus:ring-2 focus:ring-[#F28C28]/20"
        />
      )}
    </label>
  );
}

function groupClientFields() {
  const order = ["Contact", "Project", "Inzet", "Briefing"] as const;
  return order.map((section) => ({
    section,
    fields: clientFields.filter((field) => field.section === section),
  }));
}

export default function ContactTabs() {
  const [activeTab, setActiveTab] = useState<ContactAudience>("client");
  const [submittedTab, setSubmittedTab] = useState<ContactAudience | null>(null);
  const [isUrgent, setIsUrgent] = useState(false);
  const [inzetType, setInzetType] = useState<string>(clientInzetTypes[0]);
  const [interests, setInterests] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [lastPlainText, setLastPlainText] = useState("");
  const [lastMailto, setLastMailto] = useState("");

  function switchTab(tab: ContactAudience) {
    setActiveTab(tab);
    setSubmittedTab(null);
    setCopied(false);
  }

  // Sync the active tab with the URL hash (#aanvraag / #aanmelden) so hero
  // CTAs and direct links land on the right tab, both on load and when the
  // hash changes afterwards.
  useEffect(() => {
    function applyHash(hash: string) {
      if (hash === "#aanmelden") {
        setActiveTab("worker");
        setSubmittedTab(null);
        setCopied(false);
      } else if (hash === "#aanvraag") {
        setActiveTab("client");
        setSubmittedTab(null);
        setCopied(false);
      }
    }

    applyHash(window.location.hash);

    function handleHashChange() {
      applyHash(window.location.hash);
    }

    // Next.js Link performs client-side navigation for same-page hash links,
    // which doesn't reliably fire a native "hashchange" event. Reading the
    // clicked anchor's href directly makes tab switching work regardless of
    // how the navigation is handled under the hood.
    function handleClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      const hashIndex = href.indexOf("#");
      if (hashIndex === -1) return;
      applyHash(href.slice(hashIndex));
    }

    window.addEventListener("hashchange", handleHashChange);
    document.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  function toggleInterest(option: string) {
    setInterests((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option],
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (activeTab === "client") {
      formData.set("type-inzet", inzetType);
      const plain = buildClientRequestPlainText(formData, isUrgent);
      const mailto = buildClientMailto(formData, isUrgent);
      setLastPlainText(plain);
      setLastMailto(mailto);
      window.location.href = mailto;
      setSubmittedTab("client");
      return;
    }

    if (activeTab === "worker") {
      const plain = buildWorkerApplicationPlainText(formData, interests);
      const mailto = buildWorkerMailto(formData, interests);
      setLastPlainText(plain);
      setLastMailto(mailto);
      window.location.href = mailto;
      setSubmittedTab("worker");
      return;
    }

    const plain = buildGeneralQuestionPlainText(formData);
    const mailto = buildGeneralMailto(formData);
    setLastPlainText(plain);
    setLastMailto(mailto);
    window.location.href = mailto;
    setSubmittedTab("general");
  }

  async function copyLastText() {
    if (!lastPlainText) return;
    try {
      await navigator.clipboard.writeText(lastPlainText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  const tabClass = (tab: ContactAudience) =>
    cn(
      "min-h-11 cursor-pointer rounded-xl px-4 py-3.5 text-left text-sm font-black transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28]",
      activeTab === tab
        ? "bg-[#0B1F4D] text-white shadow-lg"
        : "text-[#173A8A] hover:bg-white",
    );

  return (
    <div
      id="aanvraag"
      className="scroll-mt-28 rounded-[2rem] bg-white p-4 shadow-2xl shadow-[#0B1F4D]/10 sm:p-6"
    >
      <div
        className="grid gap-2 rounded-2xl bg-[#F5F7FA] p-2 sm:grid-cols-3"
        role="tablist"
        aria-label="Contactformulier"
      >
        <button type="button" role="tab" aria-selected={activeTab === "client"} className={tabClass("client")} onClick={() => switchTab("client")}>
          Personeel aanvragen
        </button>
        <button
          type="button"
          role="tab"
          id="aanmelden"
          aria-selected={activeTab === "worker"}
          className={cn(tabClass("worker"), "scroll-mt-28")}
          onClick={() => switchTab("worker")}
        >
          Aanmelden als medewerker
        </button>
        <button type="button" role="tab" aria-selected={activeTab === "general"} className={tabClass("general")} onClick={() => switchTab("general")}>
          Algemene vraag
        </button>
      </div>

      <div className="mt-8" aria-live="polite">
        {submittedTab ? (
          <div className="rounded-2xl bg-[#0B1F4D] p-8 text-white">
            <p className="text-2xl font-black">
              {submittedTab === "client"
                ? isUrgent
                  ? "Spoedaanvraag klaar om te mailen."
                  : "Aanvraag klaar om te mailen."
                : submittedTab === "worker"
                  ? "Aanmelding klaar om te mailen."
                  : "Vraag klaar om te mailen."}
            </p>
            <p className="mt-3 leading-7 text-white/75">
              Je e-mailprogramma opent met de gegevens. Verstuur de mail om hem
              bij ons te laten landen
              {submittedTab === "client"
                ? ` (${planningEmail})`
                : submittedTab === "worker"
                  ? ` (${applicationsEmail})`
                  : ` (${contactEmail})`}
              . Komt er niets op? Kopieer de tekst of mail handmatig.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={lastMailto || "#"}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#F28C28] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#de7c1f]"
              >
                Opnieuw openen in e-mail
              </a>
              <button
                type="button"
                onClick={copyLastText}
                className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-white/35 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                {copied ? "Gekopieerd" : "Kopieer aanvraagtekst"}
              </button>
              <button
                type="button"
                onClick={() => setSubmittedTab(null)}
                className="inline-flex min-h-11 items-center justify-center rounded-full px-6 py-3 text-sm font-bold text-white/80 underline-offset-4 hover:text-white hover:underline"
              >
                Formulier opnieuw
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {activeTab === "client" ? (
              <>
                <label className="mb-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-[#F28C28]/35 bg-[#FFF7ED] px-4 py-3">
                  <input
                    type="checkbox"
                    checked={isUrgent}
                    onChange={(event) => setIsUrgent(event.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-[#F28C28] focus:ring-[#F28C28]"
                  />
                  <span>
                    <span className="block text-sm font-black text-[#0B1F4D]">
                      Spoedaanvraag
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-[#101828]/70">
                      Vink aan bij korte doorlooptijd. We kijken wat er nog
                      haalbaar is met beschikbare crew.
                    </span>
                  </span>
                </label>

                {groupClientFields().map((group) => (
                  <div key={group.section} className="mb-8">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F28C28]">
                      {group.section}
                    </p>
                    {group.section === "Inzet" ? (
                      <label className="mt-4 block sm:col-span-2">
                        <span className="text-sm font-black text-[#0B1F4D]">
                          Type inzet
                        </span>
                        <select
                          value={inzetType}
                          onChange={(event) => setInzetType(event.target.value)}
                          className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-[#F5F7FA] px-4 py-3 text-sm outline-none transition focus:border-[#F28C28] focus:ring-2 focus:ring-[#F28C28]/20"
                        >
                          {clientInzetTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </label>
                    ) : null}
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {group.fields.map((field) => (
                        <Field key={field.name} field={field} />
                      ))}
                    </div>
                  </div>
                ))}
              </>
            ) : null}

            {activeTab === "worker" ? (
              <>
                <div className="mb-6">
                  <p className="text-sm font-black text-[#0B1F4D]">
                    Interesse (optioneel)
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {workerInterestOptions.map((option) => {
                      const active = interests.includes(option);
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => toggleInterest(option)}
                          className={cn(
                            "min-h-11 rounded-full border px-4 py-2 text-sm font-bold transition",
                            active
                              ? "border-[#F28C28] bg-[#F28C28] text-white"
                              : "border-slate-200 bg-[#F5F7FA] text-[#173A8A] hover:border-[#173A8A]/40",
                          )}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {workerFields.map((field) => (
                    <Field key={field.name} field={field} />
                  ))}
                </div>
              </>
            ) : null}

            {activeTab === "general" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {generalFields.map((field) => (
                  <Field key={field.name} field={field} />
                ))}
              </div>
            ) : null}

            <p className="mt-6 rounded-2xl bg-[#F5F7FA] p-4 text-sm leading-6 text-[#101828]/75">
              {activeTab === "client" ? (
                <>
                  “Open in e-mail” start je e-mailclient naar {planningEmail}.
                  Lukt dat niet? Gebruik “Kopieer aanvraagtekst” na het
                  voorbereiden.
                </>
              ) : activeTab === "worker" ? (
                <>
                  Je aanmelding gaat naar {applicationsEmail}. Bekijk ook de{" "}
                  <Link
                    href="/vacatures"
                    className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
                  >
                    vacatures
                  </Link>{" "}
                  of{" "}
                  <Link
                    href="/medewerkers"
                    className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
                  >
                    werken bij
                  </Link>
                  .
                </>
              ) : (
                <>Algemene vragen mailen we naar {contactEmail}.</>
              )}
            </p>

            <p className="mt-4 text-xs leading-5 text-[#101828]/55">
              Je gegevens gebruiken we alleen om je aanvraag, aanmelding of vraag
              op te volgen. We delen ze niet voor marketingdoeleinden.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                className="min-h-11 w-full cursor-pointer rounded-full bg-[#F28C28] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#F28C28]/25 transition hover:bg-[#de7c1f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2 sm:w-auto"
              >
                {activeTab === "client"
                  ? isUrgent
                    ? "Spoedaanvraag openen in e-mail"
                    : "Aanvraag openen in e-mail"
                  : activeTab === "worker"
                    ? "Aanmelding openen in e-mail"
                    : "Vraag openen in e-mail"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
