import type { LucideIcon } from "lucide-react";
import {
  ChefHat,
  ClipboardList,
  ConciergeBell,
  PackageOpen,
  ShieldCheck,
  Truck,
  Users,
  UtensilsCrossed,
  Wine,
} from "lucide-react";

export type ServiceIconKey =
  | "event-crew"
  | "horeca-support"
  | "stagehands"
  | "productie-assistentie"
  | "logistiek"
  | "teamcaptains"
  | "restaurant"
  | "keuken"
  | "bar"
  | "hospitality";

export const serviceIconMap: Record<ServiceIconKey, LucideIcon> = {
  "event-crew": Users,
  "horeca-support": UtensilsCrossed,
  stagehands: PackageOpen,
  "productie-assistentie": ClipboardList,
  logistiek: Truck,
  teamcaptains: ShieldCheck,
  restaurant: UtensilsCrossed,
  keuken: ChefHat,
  bar: Wine,
  hospitality: ConciergeBell,
};

const titleToIconKey: Record<string, ServiceIconKey> = {
  "Event crew": "event-crew",
  "Horeca support": "horeca-support",
  Stagehands: "stagehands",
  "Productie assistentie": "productie-assistentie",
  "Logistieke ondersteuning": "logistiek",
  Teamcaptains: "teamcaptains",
  Logistiek: "logistiek",
  Teamcaptain: "teamcaptains",
};

export function getServiceIconKey(title: string): ServiceIconKey | null {
  return titleToIconKey[title] ?? null;
}

export function getServiceIcon(title: string): LucideIcon | null {
  const key = getServiceIconKey(title);
  return key ? serviceIconMap[key] : null;
}
