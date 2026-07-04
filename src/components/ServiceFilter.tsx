"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ServiceIconBadge from "@/components/ServiceIconBadge";
import type { Service } from "@/lib/content";

type Filter = "Alle" | "Event" | "Horeca" | "Stagebouw" | "Productie" | "Logistiek";

type FilterableService = Service & {
  category: Exclude<Filter, "Alle">;
};

const filters: Filter[] = ["Alle", "Event", "Horeca", "Stagebouw", "Productie", "Logistiek"];

const categoryByTitle: Record<string, FilterableService["category"]> = {
  "Event crew": "Event",
  "Horeca support": "Horeca",
  Stagehands: "Stagebouw",
  "Productie assistentie": "Productie",
  "Logistieke ondersteuning": "Logistiek",
  Teamcaptains: "Productie",
};

export default function ServiceFilter({ services }: { services: Service[] }) {
  const [activeFilter, setActiveFilter] = useState<Filter>("Alle");

  const filterableServices = useMemo(
    () =>
      services.map((service) => ({
        ...service,
        category: categoryByTitle[service.title] ?? "Event",
      })),
    [services],
  );

  const visibleServices =
    activeFilter === "Alle"
      ? filterableServices
      : filterableServices.filter((service) => service.category === activeFilter);

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`shrink-0 cursor-pointer rounded-full border px-5 py-2.5 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2 ${
              activeFilter === filter
                ? "border-[#F28C28] bg-[#F28C28] text-white shadow-lg shadow-[#F28C28]/25"
                : "border-slate-200 bg-white text-[#173A8A] hover:border-[#173A8A]/30 hover:bg-[#F5F7FA]"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visibleServices.map((service) => (
          <article
            key={service.title}
            className="group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-7 shadow-lg shadow-[#0B1F4D]/5 transition hover:-translate-y-1 hover:border-[#F28C28]/60 hover:shadow-2xl"
          >
            <ServiceIconBadge
              icon={service.icon}
              size="lg"
              interactive
              className="mb-5"
            />
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F28C28]">
              {service.category}
            </p>
            <h3 className="mt-2 text-xl font-black text-[#0B1F4D]">{service.title}</h3>
            <p className="mt-3 flex-1 leading-7 text-[#101828]/75">{service.description}</p>
            <Link
              href="/diensten"
              className="mt-6 inline-flex w-fit rounded-full bg-[#F5F7FA] px-4 py-2 text-sm font-bold text-[#173A8A] transition group-hover:bg-[#F28C28] group-hover:text-white focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2"
            >
              Bekijk inzet
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
