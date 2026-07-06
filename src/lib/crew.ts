// TODO: later koppelen aan Supabase crew database
// TODO: Shiftbase employee sync
// TODO: Google Maps kilometerberekening
// TODO: Moneybird facturatie, Fooks/payroll, documenten en contracten

export type CrewEmploymentType = "ZZP" | "Loondienst" | "Payroll" | "Onbekend";

export type CrewStatus =
  | "Actief"
  | "Beschikbaar"
  | "Inactief"
  | "Onboarding"
  | "Geblokkeerd";

export type CrewMember = {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phone: string;
  city: string;
  address?: string;
  employmentType: CrewEmploymentType;
  status: CrewStatus;
  primaryRole: string;
  roles: string[];
  skills: string[];
  availability: string[];
  certificates: string[];
  hasDriversLicense: boolean;
  hasCar: boolean;
  hourlyRate?: number;
  travelRatePerKm: number;
  shiftbaseEmployeeId?: string;
  notes?: string;
  lastWorkedAt?: string;
  createdAt: string;
};

export type CrewFilters = {
  search: string;
  status: string;
  roleGroup: string;
  employmentType: string;
  certificate: string;
};

export const defaultCrewFilters: CrewFilters = {
  search: "",
  status: "all",
  roleGroup: "all",
  employmentType: "all",
  certificate: "all",
};

export const CREW_STATUSES: CrewStatus[] = [
  "Actief",
  "Beschikbaar",
  "Inactief",
  "Onboarding",
  "Geblokkeerd",
];

export const CREW_EMPLOYMENT_TYPES: CrewEmploymentType[] = [
  "ZZP",
  "Loondienst",
  "Payroll",
  "Onbekend",
];

export const CREW_CERTIFICATES = [
  "VCA",
  "Heftruck",
  "Hoogwerker",
  "BHV",
  "HACCP",
  "Rijbewijs B",
  "Geen certificaten",
] as const;

export const CREW_ROLE_GROUPS: Record<string, string[]> = {
  Event: [
    "Eventmedewerker",
    "Floor support",
    "Stagehand",
    "Load-in / Load-out",
    "Sitecrew",
    "Productie assistent",
    "Runner",
    "Backstage support",
    "Logistiek medewerker",
    "Teamcaptain",
  ],
  Horeca: [
    "Bedieningsmedewerker",
    "Runner bediening",
    "Barback",
    "Bartender",
    "Afwasser",
    "Host / Gastheer / Gastvrouw",
    "Shiftleader / Floor manager horeca",
  ],
  Restaurant: ["Bedieningsmedewerker", "Host / Gastheer / Gastvrouw"],
  Keuken: [
    "Keukenhulp",
    "Hulp kok",
    "Zelfstandig werkend kok",
    "Chef de partie",
    "Sous-chef",
    "Chef-kok",
  ],
  Stagebouw: ["Stagehand", "Load-in / Load-out", "Sitecrew"],
  Productie: ["Productie assistent", "Backstage support", "Runner"],
  Logistiek: ["Logistiek medewerker", "Runner"],
  Leidinggevend: ["Teamcaptain", "Shiftleader / Floor manager horeca"],
};

export const ALL_CREW_ROLES = Object.values(CREW_ROLE_GROUPS).flat();

export const demoCrewMembers: CrewMember[] = [
  {
    id: "crew-demo-001",
    firstName: "Demo",
    lastName: "Crew 1",
    displayName: "Demo Crew 1",
    email: "demo.crew1@example.helpinghands.nl",
    phone: "06-10000001",
    city: "Amsterdam",
    address: "Demo straat 1, 1011 AB Amsterdam",
    employmentType: "ZZP",
    status: "Actief",
    primaryRole: "Stagehand",
    roles: ["Stagehand", "Load-in / Load-out", "Sitecrew"],
    skills: ["Rigging", "Load-in", "Teamwork"],
    availability: ["Ma", "Wo", "Vr", "Za"],
    certificates: ["VCA", "Rijbewijs B"],
    hasDriversLicense: true,
    hasCar: true,
    hourlyRate: 22,
    travelRatePerKm: 0.25,
    shiftbaseEmployeeId: "sb-demo-001",
    lastWorkedAt: "2026-07-04",
    createdAt: "2025-03-10T08:00:00Z",
    notes: "Ervaren in festival load-in/out.",
  },
  {
    id: "crew-demo-002",
    firstName: "Demo",
    lastName: "Crew 2",
    displayName: "Demo Crew 2",
    email: "demo.crew2@example.helpinghands.nl",
    phone: "06-10000002",
    city: "Rotterdam",
    employmentType: "Loondienst",
    status: "Beschikbaar",
    primaryRole: "Runner",
    roles: ["Runner", "Backstage support"],
    skills: ["Communicatie", "Snel schakelen"],
    availability: ["Di", "Do", "Za", "Zo"],
    certificates: ["BHV"],
    hasDriversLicense: true,
    hasCar: false,
    hourlyRate: 19,
    travelRatePerKm: 0.25,
    shiftbaseEmployeeId: "sb-demo-002",
    lastWorkedAt: "2026-07-02",
    createdAt: "2025-04-15T10:00:00Z",
  },
  {
    id: "crew-demo-003",
    firstName: "Demo",
    lastName: "Crew 3",
    displayName: "Demo Crew 3",
    email: "demo.crew3@example.helpinghands.nl",
    phone: "06-10000003",
    city: "Utrecht",
    employmentType: "Payroll",
    status: "Actief",
    primaryRole: "Bedieningsmedewerker",
    roles: ["Bedieningsmedewerker", "Runner bediening"],
    skills: ["Gastvrijheid", "Grote groepen"],
    availability: ["Vr", "Za", "Zo"],
    certificates: ["HACCP", "Rijbewijs B"],
    hasDriversLicense: true,
    hasCar: true,
    hourlyRate: 20,
    travelRatePerKm: 0.25,
    lastWorkedAt: "2026-07-05",
    createdAt: "2025-05-01T09:00:00Z",
  },
  {
    id: "crew-demo-004",
    firstName: "Demo",
    lastName: "Crew 4",
    displayName: "Demo Crew 4",
    email: "demo.crew4@example.helpinghands.nl",
    phone: "06-10000004",
    city: "Den Haag",
    employmentType: "ZZP",
    status: "Beschikbaar",
    primaryRole: "Bartender",
    roles: ["Bartender", "Barback"],
    skills: ["Cocktails", "Bar setup"],
    availability: ["Do", "Vr", "Za"],
    certificates: ["Geen certificaten"],
    hasDriversLicense: false,
    hasCar: false,
    hourlyRate: 24,
    travelRatePerKm: 0.25,
    shiftbaseEmployeeId: "sb-demo-004",
    lastWorkedAt: "2026-06-28",
    createdAt: "2025-06-12T11:00:00Z",
  },
  {
    id: "crew-demo-005",
    firstName: "Demo",
    lastName: "Crew 5",
    displayName: "Demo Crew 5",
    email: "demo.crew5@example.helpinghands.nl",
    phone: "06-10000005",
    city: "Eindhoven",
    employmentType: "Loondienst",
    status: "Onboarding",
    primaryRole: "Keukenhulp",
    roles: ["Keukenhulp", "Afwasser"],
    skills: ["Hygiëne", "Keukenflow"],
    availability: ["Ma", "Di", "Wo"],
    certificates: ["HACCP"],
    hasDriversLicense: true,
    hasCar: false,
    travelRatePerKm: 0.25,
    createdAt: "2026-06-20T08:00:00Z",
    notes: "Nieuw in onboarding traject.",
  },
  {
    id: "crew-demo-006",
    firstName: "Demo",
    lastName: "Crew 6",
    displayName: "Demo Crew 6",
    email: "demo.crew6@example.helpinghands.nl",
    phone: "06-10000006",
    city: "Groningen",
    employmentType: "ZZP",
    status: "Actief",
    primaryRole: "Logistiek medewerker",
    roles: ["Logistiek medewerker", "Sitecrew"],
    skills: ["Heftruck", "Magazijn"],
    availability: ["Ma", "Di", "Wo", "Do", "Vr"],
    certificates: ["VCA", "Heftruck", "Rijbewijs B"],
    hasDriversLicense: true,
    hasCar: true,
    hourlyRate: 23,
    travelRatePerKm: 0.25,
    shiftbaseEmployeeId: "sb-demo-006",
    lastWorkedAt: "2026-07-03",
    createdAt: "2025-02-01T08:00:00Z",
  },
  {
    id: "crew-demo-007",
    firstName: "Demo",
    lastName: "Crew 7",
    displayName: "Demo Crew 7",
    email: "demo.crew7@example.helpinghands.nl",
    phone: "06-10000007",
    city: "Hilversum",
    employmentType: "Payroll",
    status: "Inactief",
    primaryRole: "Eventmedewerker",
    roles: ["Eventmedewerker", "Floor support"],
    skills: ["Crowd support", "Veiligheid"],
    availability: [],
    certificates: ["BHV"],
    hasDriversLicense: true,
    hasCar: false,
    travelRatePerKm: 0.25,
    lastWorkedAt: "2026-04-10",
    createdAt: "2024-11-05T10:00:00Z",
  },
  {
    id: "crew-demo-008",
    firstName: "Demo",
    lastName: "Crew 8",
    displayName: "Demo Crew 8",
    email: "demo.crew8@example.helpinghands.nl",
    phone: "06-10000008",
    city: "Leiden",
    employmentType: "Loondienst",
    status: "Beschikbaar",
    primaryRole: "Teamcaptain",
    roles: ["Teamcaptain", "Stagehand", "Productie assistent"],
    skills: ["Leidinggeven", "Planning", "Communicatie"],
    availability: ["Wo", "Do", "Vr", "Za", "Zo"],
    certificates: ["VCA", "BHV", "Rijbewijs B"],
    hasDriversLicense: true,
    hasCar: true,
    hourlyRate: 28,
    travelRatePerKm: 0.25,
    shiftbaseEmployeeId: "sb-demo-008",
    lastWorkedAt: "2026-07-06",
    createdAt: "2025-01-20T09:00:00Z",
  },
  {
    id: "crew-demo-009",
    firstName: "Demo",
    lastName: "Crew 9",
    displayName: "Demo Crew 9",
    email: "demo.crew9@example.helpinghands.nl",
    phone: "06-10000009",
    city: "Breda",
    employmentType: "ZZP",
    status: "Actief",
    primaryRole: "Zelfstandig werkend kok",
    roles: ["Zelfstandig werkend kok", "Hulp kok"],
    skills: ["Mise en place", "HACCP"],
    availability: ["Vr", "Za"],
    certificates: ["HACCP", "Rijbewijs B"],
    hasDriversLicense: true,
    hasCar: true,
    hourlyRate: 26,
    travelRatePerKm: 0.25,
    lastWorkedAt: "2026-06-30",
    createdAt: "2025-07-08T08:00:00Z",
  },
  {
    id: "crew-demo-010",
    firstName: "Demo",
    lastName: "Crew 10",
    displayName: "Demo Crew 10",
    email: "demo.crew10@example.helpinghands.nl",
    phone: "06-10000010",
    city: "Arnhem",
    employmentType: "Onbekend",
    status: "Geblokkeerd",
    primaryRole: "Floor support",
    roles: ["Floor support"],
    skills: [],
    availability: [],
    certificates: ["Geen certificaten"],
    hasDriversLicense: false,
    hasCar: false,
    travelRatePerKm: 0.25,
    createdAt: "2025-09-01T08:00:00Z",
    notes: "Tijdelijk geblokkeerd — administratie openstaand.",
  },
  {
    id: "crew-demo-011",
    firstName: "Demo",
    lastName: "Crew 11",
    displayName: "Demo Crew 11",
    email: "demo.crew11@example.helpinghands.nl",
    phone: "06-10000011",
    city: "Haarlem",
    employmentType: "Payroll",
    status: "Beschikbaar",
    primaryRole: "Hoogwerker operator",
    roles: ["Sitecrew", "Stagehand"],
    skills: ["Hoogwerker", "Rigging"],
    availability: ["Ma", "Di", "Do"],
    certificates: ["VCA", "Hoogwerker", "Rijbewijs B"],
    hasDriversLicense: true,
    hasCar: true,
    hourlyRate: 25,
    travelRatePerKm: 0.25,
    shiftbaseEmployeeId: "sb-demo-011",
    lastWorkedAt: "2026-07-01",
    createdAt: "2025-08-14T10:00:00Z",
  },
  {
    id: "crew-demo-012",
    firstName: "Demo",
    lastName: "Crew 12",
    displayName: "Demo Crew 12",
    email: "demo.crew12@example.helpinghands.nl",
    phone: "06-10000012",
    city: "Tilburg",
    employmentType: "ZZP",
    status: "Actief",
    primaryRole: "Shiftleader / Floor manager horeca",
    roles: ["Shiftleader / Floor manager horeca", "Host / Gastheer / Gastvrouw"],
    skills: ["Leiding", "Horeca", "Gastvrijheid"],
    availability: ["Do", "Vr", "Za", "Zo"],
    certificates: ["HACCP", "BHV"],
    hasDriversLicense: true,
    hasCar: false,
    hourlyRate: 27,
    travelRatePerKm: 0.25,
    shiftbaseEmployeeId: "sb-demo-012",
    lastWorkedAt: "2026-07-05",
    createdAt: "2025-10-01T08:00:00Z",
  },
];

function memberMatchesRoleGroup(member: CrewMember, group: string): boolean {
  if (group === "all") return true;
  const rolesInGroup = CREW_ROLE_GROUPS[group];
  if (!rolesInGroup) return true;
  return member.roles.some((r) => rolesInGroup.includes(r)) || rolesInGroup.includes(member.primaryRole);
}

export function filterCrewMembers(members: CrewMember[], filters: CrewFilters): CrewMember[] {
  const q = filters.search.trim().toLowerCase();

  return members.filter((m) => {
    if (filters.status !== "all" && m.status !== filters.status) return false;
    if (filters.employmentType !== "all" && m.employmentType !== filters.employmentType) return false;
    if (!memberMatchesRoleGroup(m, filters.roleGroup)) return false;

    if (filters.certificate !== "all") {
      if (filters.certificate === "Geen certificaten") {
        if (!m.certificates.includes("Geen certificaten") && m.certificates.length > 0) {
          const hasReal = m.certificates.some((c) => c !== "Geen certificaten");
          if (hasReal) return false;
        }
      } else if (!m.certificates.includes(filters.certificate)) {
        return false;
      }
    }

    if (!q) return true;

    return (
      m.displayName.toLowerCase().includes(q) ||
      m.primaryRole.toLowerCase().includes(q) ||
      m.city.toLowerCase().includes(q) ||
      m.roles.some((r) => r.toLowerCase().includes(q)) ||
      m.skills.some((s) => s.toLowerCase().includes(q))
    );
  });
}

export type CrewStats = {
  total: number;
  availableThisWeek: number;
  zzp: number;
  loondienst: number;
  payroll: number;
  withCertificate: number;
};

export function computeCrewStats(members: CrewMember[]): CrewStats {
  const available = members.filter(
    (m) => m.status === "Actief" || m.status === "Beschikbaar",
  );
  const withCert = members.filter(
    (m) =>
      m.certificates.length > 0 &&
      !m.certificates.every((c) => c === "Geen certificaten"),
  );

  return {
    total: members.length,
    availableThisWeek: available.length,
    zzp: members.filter((m) => m.employmentType === "ZZP").length,
    loondienst: members.filter((m) => m.employmentType === "Loondienst").length,
    payroll: members.filter((m) => m.employmentType === "Payroll").length,
    withCertificate: withCert.length,
  };
}

export type CrewFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  employmentType: CrewEmploymentType;
  status: CrewStatus;
  primaryRole: string;
  roles: string;
  skills: string;
  certificates: string;
  hasDriversLicense: boolean;
  hasCar: boolean;
  hourlyRate: string;
  travelRatePerKm: string;
  shiftbaseEmployeeId: string;
  notes: string;
};

export function createCrewFromForm(data: CrewFormData): CrewMember {
  const roles = data.roles
    .split(",")
    .map((r) => r.trim())
    .filter(Boolean);
  const skills = data.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const certificates = data.certificates
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  return {
    id: `crew-demo-${Date.now()}`,
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    displayName: `${data.firstName.trim()} ${data.lastName.trim()}`.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    city: data.city.trim(),
    address: data.address.trim() || undefined,
    employmentType: data.employmentType,
    status: data.status,
    primaryRole: data.primaryRole.trim(),
    roles: roles.length > 0 ? roles : [data.primaryRole.trim()],
    skills,
    availability: [],
    certificates: certificates.length > 0 ? certificates : ["Geen certificaten"],
    hasDriversLicense: data.hasDriversLicense,
    hasCar: data.hasCar,
    hourlyRate: data.hourlyRate.trim() ? Number(data.hourlyRate) : undefined,
    travelRatePerKm: data.travelRatePerKm.trim() ? Number(data.travelRatePerKm) : 0.25,
    shiftbaseEmployeeId: data.shiftbaseEmployeeId.trim() || undefined,
    notes: data.notes.trim() || undefined,
    createdAt: new Date().toISOString(),
  };
}

export function crewMemberToFormData(member: CrewMember): CrewFormData {
  return {
    firstName: member.firstName,
    lastName: member.lastName,
    email: member.email,
    phone: member.phone,
    city: member.city,
    address: member.address ?? "",
    employmentType: member.employmentType,
    status: member.status,
    primaryRole: member.primaryRole,
    roles: member.roles.join(", "),
    skills: member.skills.join(", "),
    certificates: member.certificates.join(", "),
    hasDriversLicense: member.hasDriversLicense,
    hasCar: member.hasCar,
    hourlyRate: member.hourlyRate != null ? String(member.hourlyRate) : "",
    travelRatePerKm: String(member.travelRatePerKm),
    shiftbaseEmployeeId: member.shiftbaseEmployeeId ?? "",
    notes: member.notes ?? "",
  };
}
