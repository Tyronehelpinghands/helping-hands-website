"use client";

import Link from "next/link";
import ServiceIconBadge from "@/components/ServiceIconBadge";
import {
  getLandingPathForService,
  type Service,
} from "@/lib/services";

type ServiceCardProps = {
  service: Service;
  onOpenDetail: (service: Service) => void;
};

export default function ServiceCard({
  service,
  onOpenDetail,
}: ServiceCardProps) {
  const landingPath = getLandingPathForService(service);

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#F28C28]/50 hover:shadow-md hover:shadow-[#0B1F4D]/6 sm:p-7">
      <ServiceIconBadge
        icon={service.icon}
        size="lg"
        interactive
        className="mb-4"
      />
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F28C28]">
        {service.category}
      </p>
      <h3 className="mt-2 text-xl font-black text-[#0B1F4D]">
        {landingPath ? (
          <Link
            href={landingPath}
            className="transition hover:text-[#173A8A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2"
          >
            {service.title}
          </Link>
        ) : (
          service.title
        )}
      </h3>
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

      <div className="mt-6 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => onOpenDetail(service)}
          className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-full bg-[#F28C28] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#de7c1f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2"
        >
          Bekijk inzet
        </button>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <Link
            href="/contact"
            className="font-semibold text-[#173A8A] underline-offset-4 transition hover:text-[#F28C28] hover:underline"
          >
            Personeel aanvragen
          </Link>
          {landingPath ? (
            <Link
              href={landingPath}
              className="font-semibold text-[#173A8A]/80 underline-offset-4 transition hover:text-[#F28C28] hover:underline"
            >
              Meer over deze dienst →
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
