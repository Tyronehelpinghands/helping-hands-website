import {
  Building2,
  CalendarDays,
  ClipboardList,
  Clock,
  Contact,
  FileText,
  FolderKanban,
  LayoutDashboard,
  MessageSquare,
  Receipt,
  User,
} from "lucide-react";

export type ClientPortalNavItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  description?: string;
};

export const CLIENT_PORTAL_BASE = "/portaal/opdrachtgevers";

export const clientPortalNavItems: ClientPortalNavItem[] = [
  { label: "Overzicht", href: CLIENT_PORTAL_BASE, icon: LayoutDashboard },
  { label: "Aanvragen", href: `${CLIENT_PORTAL_BASE}/aanvragen`, icon: ClipboardList },
  { label: "Projecten", href: `${CLIENT_PORTAL_BASE}/projecten`, icon: FolderKanban },
  { label: "Planning", href: `${CLIENT_PORTAL_BASE}/planning`, icon: CalendarDays },
  { label: "Briefings", href: `${CLIENT_PORTAL_BASE}/briefings`, icon: MessageSquare },
  { label: "Urenstatus", href: `${CLIENT_PORTAL_BASE}/uren`, icon: Clock },
  { label: "Facturen", href: `${CLIENT_PORTAL_BASE}/facturen`, icon: Receipt },
  { label: "Documenten", href: `${CLIENT_PORTAL_BASE}/documenten`, icon: FileText },
  { label: "Contact", href: `${CLIENT_PORTAL_BASE}/contact`, icon: Contact },
  { label: "Bedrijfsprofiel", href: `${CLIENT_PORTAL_BASE}/profiel`, icon: User },
];

export function isClientPortalNavActive(pathname: string, href: string): boolean {
  if (href === CLIENT_PORTAL_BASE) return pathname === CLIENT_PORTAL_BASE;
  return pathname.startsWith(href);
}

export type ClientPortalPageMeta = { title: string; subtitle?: string };

export const clientPortalPageMeta: Record<string, ClientPortalPageMeta> = {
  [CLIENT_PORTAL_BASE]: {
    title: "Welkom, Demo Opdrachtgever BV",
    subtitle: "Bekijk je aanvragen, projecten, planning, briefings en facturen.",
  },
  [`${CLIENT_PORTAL_BASE}/aanvragen`]: {
    title: "Aanvragen",
    subtitle: "Dien nieuwe personeelsaanvragen in en volg de status.",
  },
  [`${CLIENT_PORTAL_BASE}/projecten`]: {
    title: "Projecten",
    subtitle: "Overzicht van je lopende en afgeronde projecten.",
  },
  [`${CLIENT_PORTAL_BASE}/planning`]: {
    title: "Planning",
    subtitle: "Bekijk geplande inzet per project en functie.",
  },
  [`${CLIENT_PORTAL_BASE}/briefings`]: {
    title: "Briefings",
    subtitle: "Lever en beheer projectbriefings aan.",
  },
  [`${CLIENT_PORTAL_BASE}/uren`]: {
    title: "Urenstatus",
    subtitle: "Samenvatting van gewerkte uren per project.",
  },
  [`${CLIENT_PORTAL_BASE}/facturen`]: {
    title: "Facturen",
    subtitle: "Overzicht van facturen en betaalstatus.",
  },
  [`${CLIENT_PORTAL_BASE}/documenten`]: {
    title: "Documenten",
    subtitle: "Offertes, bevestigingen en overige documenten.",
  },
  [`${CLIENT_PORTAL_BASE}/contact`]: {
    title: "Contact",
    subtitle: "Neem contact op met planning, administratie of sales.",
  },
  [`${CLIENT_PORTAL_BASE}/profiel`]: {
    title: "Bedrijfsprofiel",
    subtitle: "Bedrijfs- en contactgegevens beheren.",
  },
};

export function getClientPortalPageMeta(pathname: string): ClientPortalPageMeta {
  if (clientPortalPageMeta[pathname]) return clientPortalPageMeta[pathname];
  for (const [path, meta] of Object.entries(clientPortalPageMeta)) {
    if (pathname.startsWith(path) && path !== CLIENT_PORTAL_BASE) return meta;
  }
  return { title: "Opdrachtgeversportaal", subtitle: "Helping Hands Agency klantportaal" };
}
