"use client";

import { FormEvent, useState } from "react";
import { applicationsEmail, planningEmail } from "@/lib/navigation";

type FieldDef = {
  label: string;
  type: string;
  name: string;
  required?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
};

const clientFields: FieldDef[] = [
  { label: "Bedrijfsnaam", type: "text", name: "bedrijfsnaam", required: true },
  {
    label: "Naam contactpersoon",
    type: "text",
    name: "contactpersoon",
    required: true,
  },
  { label: "E-mail", type: "email", name: "email", required: true },
  { label: "Telefoon", type: "tel", name: "telefoon", required: true },
  { label: "Datum", type: "date", name: "datum", required: true },
  { label: "Locatie", type: "text", name: "locatie", required: true },
  { label: "Starttijd", type: "time", name: "starttijd", required: true },
  { label: "Eindtijd", type: "time", name: "eindtijd", required: true },
  {
    label: "Functies",
    type: "text",
    name: "functies",
    required: true,
    placeholder: "Bijv. stagehands, barbacks, runners",
  },
  {
    label: "Aantal mensen",
    type: "number",
    name: "aantal",
    required: true,
  },
  {
    label: "Kleding / PBM",
    type: "text",
    name: "kleding-pbm",
    placeholder: "Zwarte kleding, veiligheidsschoenen, etc.",
  },
  {
    label: "Contactpersoon op locatie",
    type: "text",
    name: "contact-locatie",
  },
  {
    label: "Extra briefing",
    type: "textarea",
    name: "briefing",
    fullWidth: true,
    placeholder: "Taken, aankomst, zones, bijzonderheden…",
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
  { label: "Rijbewijs ja/nee", type: "text", name: "rijbewijs" },
];

type Tab = "client" | "worker";

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
          className="mt-2 w-full rounded-xl border border-slate-200 bg-[#F5F7FA] px-4 py-3 text-sm outline-none transition focus:border-[#F28C28] focus:ring-2 focus:ring-[#F28C28]/20"
        />
      ) : (
        <input
          id={field.name}
          name={field.name}
          type={field.type}
          required={field.required}
          placeholder={field.placeholder}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-[#F5F7FA] px-4 py-3 text-sm outline-none transition focus:border-[#F28C28] focus:ring-2 focus:ring-[#F28C28]/20"
        />
      )}
    </label>
  );
}

export default function ContactTabs() {
  const [activeTab, setActiveTab] = useState<Tab>("client");
  const [submittedTab, setSubmittedTab] = useState<Tab | null>(null);
  const [isUrgent, setIsUrgent] = useState(false);
  const isClient = activeTab === "client";
  const fields = isClient ? clientFields : workerFields;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedTab(activeTab);
  }

  return (
    <div className="rounded-[2rem] bg-white p-4 shadow-2xl shadow-[#0B1F4D]/10 sm:p-6">
      <div className="grid gap-2 rounded-2xl bg-[#F5F7FA] p-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => {
            setActiveTab("client");
            setSubmittedTab(null);
          }}
          className={`cursor-pointer rounded-xl px-5 py-4 text-left text-sm font-black transition focus:outline-none focus:ring-2 focus:ring-[#F28C28] ${
            activeTab === "client"
              ? "bg-[#0B1F4D] text-white shadow-lg"
              : "text-[#173A8A] hover:bg-white"
          }`}
        >
          Personeel aanvragen
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("worker");
            setSubmittedTab(null);
          }}
          className={`cursor-pointer rounded-xl px-5 py-4 text-left text-sm font-black transition focus:outline-none focus:ring-2 focus:ring-[#F28C28] ${
            activeTab === "worker"
              ? "bg-[#0B1F4D] text-white shadow-lg"
              : "text-[#173A8A] hover:bg-white"
          }`}
        >
          Aanmelden als medewerker
        </button>
      </div>

      <div className="mt-8">
        {submittedTab ? (
          <div className="rounded-2xl bg-[#0B1F4D] p-8 text-white">
            <p className="text-2xl font-black">
              {submittedTab === "client"
                ? isUrgent
                  ? "Spoedaanvraag voorbereid."
                  : "Aanvraag voorbereid."
                : "Aanmelding voorbereid."}
            </p>
            <p className="mt-3 leading-7 text-white/75">
              {submittedTab === "client" ? (
                <>
                  Stuur deze gegevens naar{" "}
                  <a
                    href={`mailto:${planningEmail}`}
                    className="font-bold text-[#F28C28] underline-offset-4 hover:underline"
                  >
                    {planningEmail}
                  </a>
                  {isUrgent
                    ? " en vermeld spoed in het onderwerp — dan schakelen we meteen."
                    : " — dan pakt planning je aanvraag op."}
                </>
              ) : (
                <>
                  Stuur je gegevens naar{" "}
                  <a
                    href={`mailto:${applicationsEmail}`}
                    className="font-bold text-[#F28C28] underline-offset-4 hover:underline"
                  >
                    {applicationsEmail}
                  </a>
                  .
                </>
              )}
            </p>
            <button
              type="button"
              onClick={() => setSubmittedTab(null)}
              className="mt-6 rounded-full bg-[#F28C28] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#de7c1f] focus:outline-none focus:ring-2 focus:ring-white"
            >
              Nog een formulier invullen
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {isClient ? (
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
                    Vink aan bij korte doorlooptijd. We kijken wat er nog haalbaar
                    is met beschikbare crew.
                  </span>
                </span>
              </label>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map((field) => (
                <Field key={field.name} field={field} />
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-[#F5F7FA] p-4 text-sm leading-6 text-[#101828]/75">
              {isClient ? (
                <>
                  Vul het formulier in om je aanvraag scherp te krijgen. Mail
                  daarna naar{" "}
                  <a
                    href={`mailto:${planningEmail}`}
                    className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
                  >
                    {planningEmail}
                  </a>{" "}
                  — zo pakken we je vraag meteen op.
                </>
              ) : (
                <>
                  Klaar om te starten? Mail je gegevens naar{" "}
                  <a
                    href={`mailto:${applicationsEmail}`}
                    className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
                  >
                    {applicationsEmail}
                  </a>
                  . Of bekijk eerst de{" "}
                  <a
                    href="/vacatures"
                    className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
                  >
                    openstaande vacatures
                  </a>
                  .
                </>
              )}
            </div>

            <button
              type="submit"
              className="mt-6 w-full cursor-pointer rounded-full bg-[#F28C28] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#F28C28]/25 transition hover:scale-[1.01] hover:bg-[#de7c1f] focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2 sm:w-auto"
            >
              {isClient
                ? isUrgent
                  ? "Spoedaanvraag voorbereiden"
                  : "Aanvraag voorbereiden"
                : "Aanmelding voorbereiden"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
