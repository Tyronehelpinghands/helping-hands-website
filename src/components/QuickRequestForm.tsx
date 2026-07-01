"use client";

import { FormEvent, useState } from "react";
import { contactEmail } from "@/lib/navigation";

const deploymentTypes = [
  "Event crew",
  "Horeca support",
  "Stagehands",
  "Productie assistentie",
  "Logistiek",
  "Teamcaptain",
];

const crewSizes = ["1-3", "4-8", "9-15", "15+"];

export default function QuickRequestForm() {
  const [type, setType] = useState(deploymentTypes[0]);
  const [crewSize, setCrewSize] = useState(crewSizes[1]);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
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
            Kies het type inzet, aantal mensen en deel de eerste details. Dit formulier is klaar om
            later te koppelen aan HubSpot of e-mail.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-white p-5 text-[#101828] shadow-2xl sm:p-6"
        >
          {submitted ? (
            <div className="rounded-2xl bg-[#F5F7FA] p-6">
              <p className="text-2xl font-black text-[#0B1F4D]">Aanvraag voorbereid.</p>
              <p className="mt-3 leading-7 text-[#101828]/75">
                Koppel dit formulier later aan HubSpot of e-mail. Voor spoedaanvragen kun je ook
                direct contact opnemen via{" "}
                <a
                  href={`mailto:${contactEmail}`}
                  className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
                >
                  {contactEmail}
                </a>
                .
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-6 rounded-full bg-[#173A8A] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0B1F4D] focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2"
              >
                Nieuwe aanvraag
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-black text-[#0B1F4D]">Type inzet</label>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {deploymentTypes.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setType(item)}
                      className={`cursor-pointer rounded-xl border px-4 py-3 text-left text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2 ${
                        type === item
                          ? "border-[#F28C28] bg-[#F28C28] text-white"
                          : "border-slate-200 bg-[#F5F7FA] text-[#173A8A] hover:border-[#173A8A]/40"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-black text-[#0B1F4D]">Aantal mensen</label>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {crewSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setCrewSize(size)}
                      className={`cursor-pointer rounded-xl border px-4 py-3 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2 ${
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
                  <span className="text-sm font-black text-[#0B1F4D]">Wanneer</span>
                  <input
                    type="date"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-[#F5F7FA] px-4 py-3 text-sm outline-none transition focus:border-[#F28C28] focus:ring-2 focus:ring-[#F28C28]/20"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-black text-[#0B1F4D]">Locatie</span>
                  <input
                    type="text"
                    placeholder="Bijv. Amsterdam"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-[#F5F7FA] px-4 py-3 text-sm outline-none transition focus:border-[#F28C28] focus:ring-2 focus:ring-[#F28C28]/20"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-black text-[#0B1F4D]">Contact</span>
                <input
                  type="text"
                  placeholder="E-mail of telefoon"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-[#F5F7FA] px-4 py-3 text-sm outline-none transition focus:border-[#F28C28] focus:ring-2 focus:ring-[#F28C28]/20"
                />
              </label>

              <p className="rounded-xl bg-[#F5F7FA] p-4 text-sm leading-6 text-[#101828]/70">
                Voor spoedaanvragen kun je ook direct contact opnemen via{" "}
                <a
                  href={`mailto:${contactEmail}`}
                  className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
                >
                  {contactEmail}
                </a>
                .
              </p>

              <button
                type="submit"
                className="w-full cursor-pointer rounded-full bg-[#F28C28] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#F28C28]/25 transition hover:scale-[1.01] hover:bg-[#de7c1f] focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2"
              >
                Aanvraag voorbereiden
              </button>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
