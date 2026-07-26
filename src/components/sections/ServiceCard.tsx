"use client";

import Link from "next/link";
import ServiceIconBadge from "@/components/ServiceIconBadge";
import type { Service } from "@/lib/services";

type ServiceCardProps = {
  service: Service;
  onOpenDetail: (service: Service) => void;
};

export default function ServiceCard({
  service,
  onOpenDetail,
}: ServiceCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-[#0B1F4D]/5 transition hover:-translate-y-1 hover:border-[#F28C28]/60 hover:shadow-2xl sm:p-7">
      <ServiceIconBadge
        icon={service.icon}
        size="lg"
        interactive
        className="mb-4"
      />
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F28C28]">
        {service.category}
      </p>
      <h3 className="mt-2 text-xl font-black text-[#0B1F4D]">{service.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-7 text-[#101828]/75 sm:text-base">
        {service.shortDescription}
      </p>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {service.tasks.slice(0, 4).map((task) => (
          <li
            key={task}
            className="rounded-md bg-[#F5F7FA] px-2 py-1 text-[0.7rem] font-medium text-slate-600"
          >
            {task}
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs leading-5 text-[#101828]/55">
        <span className="font-semibold text-[#173A8A]">Ideaal voor: </span>
        {service.idealFor.slice(0, 3).join(" · ")}
      </p>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => onOpenDetail(service)}
          className="inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-[#F5F7FA] px-4 py-2.5 text-sm font-bold text-[#173A8A] transition hover:bg-[#173A8A] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2 sm:w-auto"
        >
          Bekijk inzet
        </button>
        <Link
          href="/contact"
          className="inline-flex w-full items-center justify-center rounded-full bg-[#F28C28] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#de7c1f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2 sm:w-auto"
        >
          Personeel aanvragen
        </Link>
      </div>
    </article>
  );
}
