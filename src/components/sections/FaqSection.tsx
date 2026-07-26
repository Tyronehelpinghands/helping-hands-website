"use client";

import { useState } from "react";
import type { FaqItem } from "@/lib/faq";

type FaqSectionProps = {
  items: FaqItem[];
  eyebrow?: string;
  title?: string;
  description?: string;
  className?: string;
};

export default function FaqSection({
  items,
  eyebrow = "Veelgestelde vragen",
  title = "Antwoorden voor opdrachtgevers en crew",
  description = "Kort en duidelijk — zo weet je snel of Helping Hands past bij jouw aanvraag of aanmelding.",
  className = "bg-[#F5F7FA] py-20 sm:py-28",
}: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className={className}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
            {eyebrow}
          </p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-[#0B1F4D] sm:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-5 text-base leading-8 text-[#101828]/70 sm:text-lg">
              {description}
            </p>
          ) : null}
        </div>

        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;

            return (
              <div
                key={item.question}
                className={`overflow-hidden rounded-2xl border transition ${
                  isOpen
                    ? "border-[#173A8A] bg-white shadow-lg shadow-[#0B1F4D]/8"
                    : "border-slate-200/80 bg-white hover:border-[#F28C28]/45"
                }`}
              >
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full cursor-pointer items-start justify-between gap-4 px-5 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-inset sm:px-6"
                >
                  <span className="text-base font-bold text-[#0B1F4D] sm:text-lg">
                    {item.question}
                  </span>
                  <span
                    className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-black transition ${
                      isOpen
                        ? "border-[#F28C28] bg-[#F28C28] text-white"
                        : "border-slate-200 text-[#173A8A]"
                    }`}
                    aria-hidden="true"
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className="px-5 pb-5 sm:px-6 sm:pb-6"
                >
                  <p className="max-w-2xl text-sm leading-7 text-[#101828]/75 sm:text-base sm:leading-8">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
