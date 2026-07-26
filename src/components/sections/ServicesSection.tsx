"use client";

import { useMemo, useState } from "react";
import ServiceCard from "@/components/sections/ServiceCard";
import ServiceDetailDrawer from "@/components/sections/ServiceDetailDrawer";
import ServiceTabs from "@/components/sections/ServiceTabs";
import {
  getServicesByFilter,
  type Service,
  type ServiceFilter,
} from "@/lib/services";

type ServicesSectionProps = {
  /** Op /diensten: bij Alle alle cards tonen i.p.v. alleen featured. */
  showAllWhenAlle?: boolean;
};

export default function ServicesSection({
  showAllWhenAlle = false,
}: ServicesSectionProps) {
  const [activeFilter, setActiveFilter] = useState<ServiceFilter>("Alle");
  const [selected, setSelected] = useState<Service | null>(null);

  const visibleServices = useMemo(
    () => getServicesByFilter(activeFilter, { showAllWhenAlle }),
    [activeFilter, showAllWhenAlle],
  );

  return (
    <div>
      <ServiceTabs activeFilter={activeFilter} onChange={setActiveFilter} />

      <p className="mt-5 text-sm font-semibold text-[#173A8A]">
        {activeFilter === "Alle"
          ? `${visibleServices.length} uitgelichte diensten`
          : `${visibleServices.length} diensten in ${activeFilter}`}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visibleServices.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onOpenDetail={setSelected}
          />
        ))}
      </div>

      <ServiceDetailDrawer
        service={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
