// TODO: Instellingen opslaan in Supabase
// TODO: Auth/rollen toevoegen
// TODO: Alleen admin mag instellingen aanpassen
// TODO: Audit log voor wijzigingen
// TODO: Secrets alleen beheren via Vercel/env, nooit via UI
// TODO: Supabase settings table
// TODO: Supabase user roles
// TODO: Moneybird settings sync
// TODO: Shiftbase sync settings
// TODO: Google Maps reiskosten instellingen
// TODO: HubSpot API settings
// TODO: Gmail/Google Workspace API
// TODO: WhatsApp Business API
// TODO: Mailchimp settings
// TODO: Webhook instellingen
// TODO: Audit logs

import { demoMessageTemplates, type MessageTemplate } from "@/lib/messages";

export type CompanySettings = {
  companyName: string;
  tradeName: string;
  kvkNumber: string;
  vatNumber: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  website: string;
  phone: string;
  defaultEmail: string;
};

export type EmailSettings = {
  generalEmail: string;
  crewApplicationsEmail: string;
  planningEmail: string;
  financeEmail: string;
  salesEmail: string;
};

export type RoleRate = {
  role: string;
  clientRate: number;
  crewRate?: number;
  active: boolean;
};

export type RateSettings = {
  defaultClientHourlyRate: number;
  defaultCrewHourlyRate: number;
  vatRate: number;
  roles: RoleRate[];
};

export type TravelSettings = {
  defaultTravelRatePerKm: number;
  calculateReturnTripByDefault: boolean;
  googleMapsEnabled: boolean;
  defaultOriginAddress: string;
  maxKmWithoutApproval: number;
  publicTransportOnDeclaration: boolean;
};

export type InvoiceSettings = {
  paymentTermDays: number;
  defaultVatRate: number;
  defaultCurrency: "EUR";
  invoicePrefix: string;
  moneybirdEnabled: boolean;
  defaultLedgerAccountId?: string;
  defaultTaxRateId?: string;
};

export type IntegrationStatusType =
  | "Niet gekoppeld"
  | "Voorbereid"
  | "Actief"
  | "Fout"
  | "Binnenkort";

export type IntegrationStatus = {
  name: string;
  status: IntegrationStatusType;
  description: string;
};

export type NotificationSettings = {
  emailNotifications: boolean;
  crewReminders: boolean;
  planningAlerts: boolean;
  invoiceAlerts: boolean;
  riskAlerts: boolean;
  applicationAlerts: boolean;
  hoursCheckAlerts: boolean;
  openInvoiceAlerts: boolean;
};

export type UserRole = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
};

export type SettingsTemplate = {
  id: string;
  title: string;
  audience: string;
  subject: string;
  body: string;
  variables: string[];
};

export type AppSettings = {
  company: CompanySettings;
  email: EmailSettings;
  rates: RateSettings;
  travel: TravelSettings;
  invoice: InvoiceSettings;
  notifications: NotificationSettings;
  roles: UserRole[];
  templates: SettingsTemplate[];
};

export type SettingsTabId =
  | "company"
  | "email"
  | "rates"
  | "travel"
  | "invoice"
  | "integrations"
  | "notifications"
  | "roles"
  | "templates"
  | "security";

export const SETTINGS_TABS: { id: SettingsTabId; label: string }[] = [
  { id: "company", label: "Bedrijf" },
  { id: "email", label: "E-mail" },
  { id: "rates", label: "Tarieven" },
  { id: "travel", label: "Reiskosten" },
  { id: "invoice", label: "Facturatie" },
  { id: "integrations", label: "Koppelingen" },
  { id: "notifications", label: "Meldingen" },
  { id: "roles", label: "Rollen & rechten" },
  { id: "templates", label: "Templates" },
  { id: "security", label: "Security" },
];

const defaultRoleRates: RoleRate[] = [
  { role: "Eventmedewerker", clientRate: 31.5, active: true },
  { role: "Horeca support", clientRate: 31.5, active: true },
  { role: "Stagehand", clientRate: 35.0, active: true },
  { role: "Productie assistent", clientRate: 34.5, active: true },
  { role: "Logistiek medewerker", clientRate: 35.0, active: true },
  { role: "Teamcaptain", clientRate: 42.5, active: true },
  { role: "Zelfstandig werkend kok", clientRate: 40.0, active: true },
  { role: "Hulp kok / keukenhulp", clientRate: 32.5, active: true },
  { role: "Bartender", clientRate: 34.5, active: true },
  { role: "Barback", clientRate: 30.5, active: true },
  { role: "Runner / bediening support", clientRate: 29.5, active: true },
];

const defaultUserRoles: UserRole[] = [
  {
    id: "role-admin",
    name: "Eigenaar / Admin",
    description: "Volledige toegang tot alle modules en instellingen.",
    permissions: [
      "Alles beheren",
      "Financiën bekijken",
      "Facturatie beheren",
      "Instellingen aanpassen",
    ],
  },
  {
    id: "role-planner",
    name: "Planner",
    description: "Planning, crew en communicatie beheren.",
    permissions: [
      "Planning beheren",
      "Crew beheren",
      "Berichten sturen",
      "Uren controleren",
    ],
  },
  {
    id: "role-administration",
    name: "Administratie",
    description: "Uren, facturatie en financiën.",
    permissions: [
      "Uren bekijken",
      "Facturatie beheren",
      "Financiën bekijken",
      "Moneybird koppeling gebruiken",
    ],
  },
  {
    id: "role-sales",
    name: "Sales",
    description: "Leads, opdrachtgevers en projectaanvragen.",
    permissions: [
      "Leads beheren",
      "Opdrachtgevers bekijken",
      "Berichten sturen",
      "Projectaanvragen bekijken",
    ],
  },
  {
    id: "role-crew",
    name: "Crew",
    description: "Eigen shifts, beschikbaarheid en uren.",
    permissions: [
      "Eigen shifts bekijken",
      "Beschikbaarheid doorgeven",
      "Eigen uren bekijken",
    ],
  },
  {
    id: "role-client",
    name: "Opdrachtgever",
    description: "Eigen aanvragen en planningstatus.",
    permissions: [
      "Eigen aanvragen bekijken",
      "Briefing delen",
      "Planningstatus bekijken",
    ],
  },
];

function templateFromMessage(t: MessageTemplate): SettingsTemplate {
  return {
    id: t.id,
    title: t.title,
    audience: t.audience,
    subject: t.subject,
    body: t.body,
    variables: t.variables,
  };
}

export const defaultSettings: AppSettings = {
  company: {
    companyName: "Helping Hands Agency",
    tradeName: "Helping Hands Agency",
    kvkNumber: "",
    vatNumber: "",
    address: "",
    postalCode: "",
    city: "",
    country: "Nederland",
    website: "https://helpinghandsagency.nl",
    phone: "",
    defaultEmail: "info@helpinghandsagency.nl",
  },
  email: {
    generalEmail: "info@helpinghandsagency.nl",
    crewApplicationsEmail: "aanmeldingen@helpinghandsagency.nl",
    planningEmail: "planning@helpinghandsagency.nl",
    financeEmail: "administratie@helpinghandsagency.nl",
    salesEmail: "sales@helpinghandsagency.nl",
  },
  rates: {
    defaultClientHourlyRate: 35.0,
    defaultCrewHourlyRate: 25.0,
    vatRate: 21,
    roles: defaultRoleRates.map((r) => ({ ...r })),
  },
  travel: {
    defaultTravelRatePerKm: 0.25,
    calculateReturnTripByDefault: true,
    googleMapsEnabled: true,
    defaultOriginAddress: "Arnhem, Nederland",
    maxKmWithoutApproval: 150,
    publicTransportOnDeclaration: true,
  },
  invoice: {
    paymentTermDays: 14,
    defaultVatRate: 21,
    defaultCurrency: "EUR",
    invoicePrefix: "HH",
    moneybirdEnabled: false,
    defaultLedgerAccountId: "",
    defaultTaxRateId: "",
  },
  notifications: {
    emailNotifications: true,
    crewReminders: true,
    planningAlerts: true,
    invoiceAlerts: true,
    riskAlerts: true,
    applicationAlerts: true,
    hoursCheckAlerts: true,
    openInvoiceAlerts: true,
  },
  roles: defaultUserRoles.map((r) => ({
    ...r,
    permissions: [...r.permissions],
  })),
  templates: demoMessageTemplates.map(templateFromMessage),
};

export function cloneSettings(settings: AppSettings): AppSettings {
  return JSON.parse(JSON.stringify(settings)) as AppSettings;
}

export function settingsAreEqual(a: AppSettings, b: AppSettings): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function calculateRateMargin(
  clientRate: number,
  crewRate?: number,
): { margin: number; marginPercent: number } | null {
  if (crewRate === undefined || crewRate <= 0 || clientRate <= 0) return null;
  const margin = clientRate - crewRate;
  const marginPercent = (margin / clientRate) * 100;
  return { margin, marginPercent };
}

export function formatEuro(value: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export const INTEGRATION_DEFINITIONS = [
  {
    id: "shiftbase",
    name: "Shiftbase",
    description: "Planning, beschikbaarheid, urenregistratie en medewerkers.",
    checkUrl: "/api/shiftbase",
    checkable: true,
  },
  {
    id: "moneybird",
    name: "Moneybird",
    description: "Facturatie, contacten, betaalstatussen en boekhouding.",
    checkUrl: "/api/moneybird/status",
    checkable: true,
  },
  {
    id: "google-maps",
    name: "Google Maps",
    description: "Kilometerberekening en reiskosten.",
    checkUrl: "/api/kilometers/status",
    checkable: true,
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Leads, sales en klantopvolging.",
    checkUrl: "/api/hubspot/test",
    checkable: true,
  },
  {
    id: "gmail",
    name: "Gmail / Google Workspace",
    description: "E-mail, aanmeldingen en communicatie.",
    checkable: false,
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    description: "Crewberichten, oproepen en briefings.",
    checkable: false,
  },
  {
    id: "fooks",
    name: "Fooks / Payroll",
    description: "Payrollstatus, loonkosten en contractvormen.",
    checkable: false,
  },
] as const;

export const SECURITY_CHECKLIST = [
  "API-tokens staan alleen in Vercel Environment Variables",
  "Geen NEXT_PUBLIC secrets gebruiken",
  "Moneybird token server-side",
  "Shiftbase token server-side",
  "Google Maps key server-side",
  "Echte login/auth nog niet actief",
  "Dashboard routes moeten later beveiligd worden",
  "Rollen moeten later worden afgedwongen",
  "Audit logs later toevoegen",
];

export const SECURITY_STATUS_CARDS = [
  { id: "auth", label: "Auth", status: "Nog niet actief" as const },
  { id: "roles", label: "Rollen", status: "Voorbereid" as const },
  { id: "secrets", label: "API secrets", status: "Server-side voorbereid" as const },
  { id: "protection", label: "Dashboard protection", status: "Nog bouwen" as const },
  { id: "audit", label: "Audit logs", status: "Binnenkort" as const },
];
