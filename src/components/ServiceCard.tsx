import Link from "next/link";
import type { Service } from "@/lib/content";

type ServiceCardProps = {
  service: Service;
  showUsage?: boolean;
  showCta?: boolean;
};

export default function ServiceCard({
  service,
  showUsage = false,
  showCta = false,
}: ServiceCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-7 shadow-lg shadow-[#0B1F4D]/5 transition hover:-translate-y-1 hover:border-[#173A8A]/25 hover:shadow-xl">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#173A8A] to-[#0B1F4D] text-lg font-black text-white shadow-md">
        {service.initials}
      </div>
      <h3 className="text-xl font-black text-[#0B1F4D]">{service.title}</h3>
      <p className="mt-3 flex-1 leading-7 text-[#101828]/75">{service.description}</p>
      {showUsage && (
        <p className="mt-4 text-sm font-semibold text-[#173A8A]">
          <span className="text-[#F28C28]">Ingezet bij: </span>
          {service.usage}
        </p>
      )}
      <div className="mt-5 h-1 w-10 rounded-full bg-[#F28C28] transition-all group-hover:w-14" />
      {showCta && (
        <Link
          href="/contact"
          className="mt-6 inline-flex text-sm font-bold text-[#173A8A] transition hover:text-[#F28C28]"
        >
          Personeel aanvragen &rarr;
        </Link>
      )}
    </article>
  );
}
