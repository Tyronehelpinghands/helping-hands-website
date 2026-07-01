"use client";

import { FormEvent, useState } from "react";
import { contactEmail } from "@/lib/navigation";

const clientFields = [
  { label: "Bedrijfsnaam", type: "text" },
  { label: "Naam contactpersoon", type: "text" },
  { label: "E-mail", type: "email" },
  { label: "Telefoon", type: "tel" },
  { label: "Datum", type: "date" },
  { label: "Locatie", type: "text" },
  { label: "Starttijd", type: "time" },
  { label: "Eindtijd", type: "time" },
  { label: "Functies", type: "text" },
  { label: "Aantal mensen", type: "number" },
  { label: "Kledingvoorschriften", type: "text" },
  { label: "Extra briefing", type: "textarea" },
];

const workerFields = [
  { label: "Naam", type: "text" },
  { label: "E-mail", type: "email" },
  { label: "Telefoon", type: "tel" },
  { label: "Woonplaats", type: "text" },
  { label: "Leeftijd", type: "number" },
  { label: "Ervaring", type: "textarea" },
  { label: "Beschikbaarheid", type: "text" },
  { label: "ZZP of loondienst", type: "text" },
  { label: "Rijbewijs ja/nee", type: "text" },
];

type Tab = "client" | "worker";

function Field({ field }: { field: { label: string; type: string } }) {
  const id = field.label.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <label className={field.type === "textarea" ? "block sm:col-span-2" : "block"}>
      <span className="text-sm font-black text-[#0B1F4D]">{field.label}</span>
      {field.type === "textarea" ? (
        <textarea
          id={id}
          rows={4}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-[#F5F7FA] px-4 py-3 text-sm outline-none transition focus:border-[#F28C28] focus:ring-2 focus:ring-[#F28C28]/20"
        />
      ) : (
        <input
          id={id}
          type={field.type}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-[#F5F7FA] px-4 py-3 text-sm outline-none transition focus:border-[#F28C28] focus:ring-2 focus:ring-[#F28C28]/20"
        />
      )}
    </label>
  );
}

export default function ContactTabs() {
  const [activeTab, setActiveTab] = useState<Tab>("client");
  const [submittedTab, setSubmittedTab] = useState<Tab | null>(null);
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
              {submittedTab === "client" ? "Aanvraag voorbereid." : "Aanmelding voorbereid."}
            </p>
            <p className="mt-3 leading-7 text-white/75">
              Dit formulier hoeft nu nog niet echt te verzenden. Koppel het later aan HubSpot,
              e-mail of een formulierprovider. Voor direct contact:{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="font-bold text-[#F28C28] underline-offset-4 hover:underline"
              >
                {contactEmail}
              </a>
              .
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
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map((field) => (
                <Field key={field.label} field={field} />
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-[#F5F7FA] p-4 text-sm leading-6 text-[#101828]/75">
              Formulier nog niet gekoppeld. Voor nu kun je ook direct mailen naar{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
              >
                {contactEmail}
              </a>
              .
            </div>

            <button
              type="submit"
              className="mt-6 w-full cursor-pointer rounded-full bg-[#F28C28] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#F28C28]/25 transition hover:scale-[1.01] hover:bg-[#de7c1f] focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2 sm:w-auto"
            >
              {isClient ? "Aanvraag voorbereiden" : "Aanmelding voorbereiden"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
