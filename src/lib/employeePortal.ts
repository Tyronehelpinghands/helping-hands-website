/**
 * Medewerkersportaal — demo-data en helpers.
 *
 * TODO: Supabase Auth koppelen
 * TODO: Alleen ingelogde medewerker mag eigen data zien
 * TODO: Row Level Security per medewerker
 * TODO: Shiftbase employee ID koppelen
 * TODO: Documenten veilig opslaan
 * TODO: Audit log voor wijzigingen
 * TODO: Correctieverzoeken naar administratie sturen
 *
 * Toekomstige koppelingen:
 * - Supabase employee_profiles
 * - Supabase employee_availability
 * - Supabase employee_hours_corrections
 * - Supabase employee_documents
 * - Shiftbase planning sync
 * - Shiftbase availability sync
 * - Shiftbase urenregistratie sync
 * - WhatsApp Business notificaties
 * - Gmail notificaties
 * - Fooks/payroll status
 * - Document upload storage
 */

export type EmployeeProfile = {
  id: string;
  displayName: string;
  email: string;
  phone: string;
  city: string;
  address?: string;
  employmentType: "ZZP" | "Loondienst" | "Payroll" | "Onbekend";
  status: "Actief" | "Onboarding" | "Inactief";
  roles: string[];
  skills: string[];
  certificates: string[];
  hasDriversLicense: boolean;
  hasCar: boolean;
  ibanStatus: "Niet ingevuld" | "Ingediend" | "Goedgekeurd";
  documentStatus: "Compleet" | "Mist gegevens" | "In controle";
  planningNotes?: string;
};

export type EmployeeShift = {
  id: string;
  projectName: string;
  clientName?: string;
  date: string;
  startTime: string;
  endTime: string;
  locationName: string;
  locationAddress: string;
  role: string;
  status: "Aangevraagd" | "Bevestigd" | "In uitvoering" | "Afgerond" | "Geannuleerd";
  briefing?: string;
  clothing?: string;
  contactPerson?: string;
  meetingPoint?: string;
  travelInfo?: string;
  shiftbaseShiftId?: string;
};

export type EmployeeAvailability = {
  id: string;
  date: string;
  availability: "Beschikbaar" | "Niet beschikbaar" | "Misschien";
  startTime?: string;
  endTime?: string;
  notes?: string;
};

export type EmployeeHoursEntry = {
  id: string;
  shiftId?: string;
  projectName: string;
  date: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  workedHours: number;
  status: "Concept" | "Ingediend" | "Goedgekeurd" | "Afgekeurd" | "Gefactureerd";
  notes?: string;
};

export type EmployeeMessage = {
  id: string;
  title: string;
  body: string;
  type: "Planning" | "Briefing" | "Uren" | "Documenten" | "Algemeen";
  status: "Nieuw" | "Gelezen" | "Actie nodig";
  createdAt: string;
  relatedShiftId?: string;
};

export type EmployeeDocument = {
  id: string;
  title: string;
  type: "Contract" | "ID" | "Certificaat" | "IBAN" | "Briefing" | "Overig";
  status: "Niet ingeleverd" | "Ingeleverd" | "Goedgekeurd" | "Afgekeurd" | "Verloopt binnenkort";
  uploadedAt?: string;
  expiresAt?: string;
};

export const DEMO_EMPLOYEE_PROFILE: EmployeeProfile = {
  id: "demo-employee-001",
  displayName: "Demo Medewerker",
  email: "demo.medewerker@voorbeeld.nl",
  phone: "06-0000-0000",
  city: "Utrecht",
  address: "Voorbeeldstraat 12, Utrecht",
  employmentType: "ZZP",
  status: "Actief",
  roles: ["Hostess", "Event crew", "Horeca ondersteuning"],
  skills: ["Gastvrijheid", "Crowd control", "Bar support", "Load-out"],
  certificates: ["HACCP basis", "BHV"],
  hasDriversLicense: true,
  hasCar: true,
  ibanStatus: "Ingediend",
  documentStatus: "Mist gegevens",
  planningNotes: "Liever diensten in regio Utrecht / Amsterdam.",
};

export const DEMO_EMPLOYEE_SHIFTS: EmployeeShift[] = [
  {
    id: "shift-001",
    projectName: "RAI Amsterdam — Congres catering support",
    clientName: "RAI Amsterdam",
    date: "2026-07-18",
    startTime: "07:00",
    endTime: "15:30",
    locationName: "Amsterdam RAI",
    locationAddress: "Europaplein 24, 1078 GZ Amsterdam",
    role: "Horeca ondersteuning",
    status: "Bevestigd",
    briefing: "Meld je om 06:45 bij ingang C. Black dress code, wit overhemd. Catering team leidt briefing.",
    clothing: "All black, nette schoenen, geen opvallende sieraden",
    contactPerson: "Planning — Demo Contact",
    meetingPoint: "Ingang C, hostess balie",
    travelInfo: "Parkeren P3, OV: metro 52 RAI",
    shiftbaseShiftId: "sb-demo-1001",
  },
  {
    id: "shift-002",
    projectName: "GelreDome Arnhem — Event crew",
    clientName: "GelreDome",
    date: "2026-07-22",
    startTime: "14:00",
    endTime: "23:00",
    locationName: "GelreDome Arnhem",
    locationAddress: "Arnhemseweg 350, 6814 DP Arnhem",
    role: "Event crew",
    status: "Aangevraagd",
    briefing: "Inzet bij publieksstromen en entreecontrole. Rugzak niet toegestaan in backstage.",
    clothing: "Helping Hands polo, zwarte broek, stevige schoenen",
    contactPerson: "Site manager — Demo Contact",
    meetingPoint: "Leveranciersingang west",
    travelInfo: "OV: trein naar Arnhem + bus 26",
    shiftbaseShiftId: "sb-demo-1002",
  },
  {
    id: "shift-003",
    projectName: "Johan Cruijff ArenA — Hospitality",
    clientName: "Johan Cruijff ArenA",
    date: "2026-07-25",
    startTime: "16:30",
    endTime: "22:45",
    locationName: "Johan Cruijff ArenA",
    locationAddress: "ArenA Boulevard 1, 1101 AX Amsterdam",
    role: "Hostess",
    status: "Bevestigd",
    briefing: "VIP lounge service. Gasten begeleiden naar juiste skybox.",
    clothing: "Business casual, donkerblauw preferred",
    contactPerson: "Hospitality lead — Demo Contact",
    meetingPoint: "Medewerkersingang Zuid",
    travelInfo: "OV: metro 54 Bijlmer ArenA",
    shiftbaseShiftId: "sb-demo-1003",
  },
  {
    id: "shift-004",
    projectName: "Horeca event Scheveningen",
    clientName: "Beach Events BV",
    date: "2026-08-02",
    startTime: "11:00",
    endTime: "20:00",
    locationName: "Scheveningen Boulevard",
    locationAddress: "Strandweg 1, 2586 JK Den Haag",
    role: "Bar support",
    status: "Aangevraagd",
    briefing: "Bar team ondersteunen bij beach event. Buitenlocatie — weersbestendige kleding.",
    clothing: "Helping Hands polo, korte broek toegestaan",
    contactPerson: "Bar captain — Demo Contact",
    meetingPoint: "Bar tent 2, strandpromenade",
    travelInfo: "Tram 1 of 9 naar Kurhaus",
    shiftbaseShiftId: "sb-demo-1004",
  },
  {
    id: "shift-005",
    projectName: "Festivalterrein — Load-out productie",
    clientName: "Festival Demo BV",
    date: "2026-08-09",
    startTime: "06:00",
    endTime: "14:00",
    locationName: "Festivalterrein",
    locationAddress: "Evenemententerrein 5, 3528 BD Utrecht",
    role: "Load-out crew",
    status: "Bevestigd",
    briefing: "Afbouw podia en terrein. Werkhandschoenen verplicht.",
    clothing: "Stevige werkkleding, stevige schoenen, handschoenen",
    contactPerson: "Productie — Demo Contact",
    meetingPoint: "Logistiek gate 4",
    travelInfo: "Eigen vervoer aanbevolen",
    shiftbaseShiftId: "sb-demo-1005",
  },
  {
    id: "shift-006",
    projectName: "Restaurant ondersteuning — Utrecht",
    clientName: "Restaurant Demo",
    date: "2026-07-12",
    startTime: "17:00",
    endTime: "23:30",
    locationName: "Restaurant centrum Utrecht",
    locationAddress: "Oudegracht 100, 3511 AE Utrecht",
    role: "Horeca ondersteuning",
    status: "In uitvoering",
    briefing: "Avondshift bediening en afwas ondersteuning.",
    clothing: "Zwart shirt, zwarte broek, gesloten schoenen",
    contactPerson: "Shift lead — Demo Contact",
    meetingPoint: "Personeelsingang achterzijde",
    travelInfo: "Centrum — OV of fiets",
    shiftbaseShiftId: "sb-demo-1006",
  },
  {
    id: "shift-007",
    projectName: "RAI Amsterdam — Load-out",
    clientName: "RAI Amsterdam",
    date: "2026-06-28",
    startTime: "08:00",
    endTime: "16:00",
    locationName: "Amsterdam RAI",
    locationAddress: "Europaplein 24, 1078 GZ Amsterdam",
    role: "Load-out crew",
    status: "Afgerond",
    briefing: "Standbouw afbreken hal 10.",
    clothing: "Werkkleding",
    contactPerson: "Productie — Demo Contact",
    meetingPoint: "Hal 10 laadkade",
    shiftbaseShiftId: "sb-demo-1007",
  },
];

export const DEMO_EMPLOYEE_AVAILABILITY: EmployeeAvailability[] = [
  { id: "av-1", date: "2026-07-14", availability: "Beschikbaar", startTime: "08:00", endTime: "22:00" },
  { id: "av-2", date: "2026-07-15", availability: "Beschikbaar", startTime: "10:00", endTime: "20:00" },
  { id: "av-3", date: "2026-07-16", availability: "Misschien", notes: "Alleen avond indien nodig" },
  { id: "av-4", date: "2026-07-17", availability: "Niet beschikbaar", notes: "Privé-afspraak" },
  { id: "av-5", date: "2026-07-18", availability: "Beschikbaar", startTime: "06:00", endTime: "18:00", notes: "RAI dienst" },
  { id: "av-6", date: "2026-07-19", availability: "Beschikbaar" },
  { id: "av-7", date: "2026-07-20", availability: "Niet beschikbaar" },
];

export const DEMO_EMPLOYEE_HOURS: EmployeeHoursEntry[] = [
  {
    id: "hrs-001",
    shiftId: "shift-007",
    projectName: "RAI Amsterdam — Load-out",
    date: "2026-06-28",
    startTime: "08:00",
    endTime: "16:00",
    breakMinutes: 30,
    workedHours: 7.5,
    status: "Goedgekeurd",
  },
  {
    id: "hrs-002",
    shiftId: "shift-006",
    projectName: "Restaurant ondersteuning — Utrecht",
    date: "2026-07-12",
    startTime: "17:00",
    endTime: "23:30",
    breakMinutes: 30,
    workedHours: 6,
    status: "Ingediend",
    notes: "Extra drukte bij dessertronde",
  },
  {
    id: "hrs-003",
    projectName: "Festivalterrein — Opbouw",
    date: "2026-07-05",
    startTime: "09:00",
    endTime: "17:30",
    breakMinutes: 45,
    workedHours: 7.75,
    status: "Gefactureerd",
  },
  {
    id: "hrs-004",
    projectName: "GelreDome Arnhem — Soundcheck support",
    date: "2026-07-08",
    startTime: "13:00",
    endTime: "18:00",
    breakMinutes: 0,
    workedHours: 5,
    status: "Concept",
  },
  {
    id: "hrs-005",
    projectName: "Horeca event Scheveningen — Proefshift",
    date: "2026-06-20",
    startTime: "12:00",
    endTime: "18:00",
    breakMinutes: 30,
    workedHours: 5.5,
    status: "Afgekeurd",
    notes: "Eindtijd gecorrigeerd door planning",
  },
];

export const DEMO_EMPLOYEE_MESSAGES: EmployeeMessage[] = [
  {
    id: "msg-001",
    title: "Briefing RAI Amsterdam — 18 juli",
    body: "Je dienst op 18 juli start om 07:00. Meld je om 06:45 bij ingang C. Neem je polo en zwarte broek mee.",
    type: "Briefing",
    status: "Actie nodig",
    createdAt: "2026-07-10T09:00:00",
    relatedShiftId: "shift-001",
  },
  {
    id: "msg-002",
    title: "Uren ter controle — restaurant shift",
    body: "Je uren van 12 juli staan klaar ter controle. Check start- en eindtijd en geef akkoord of vraag een correctie aan.",
    type: "Uren",
    status: "Nieuw",
    createdAt: "2026-07-12T22:15:00",
    relatedShiftId: "shift-006",
  },
  {
    id: "msg-003",
    title: "Certificaat HACCP verloopt binnenkort",
    body: "Je HACCP certificaat verloopt op 15 augustus. Upload een vernieuwd certificaat via documenten.",
    type: "Documenten",
    status: "Actie nodig",
    createdAt: "2026-07-08T14:00:00",
  },
  {
    id: "msg-004",
    title: "Nieuwe dienst aangevraagd — GelreDome",
    body: "Er staat een nieuwe dienst klaar op 22 juli bij GelreDome Arnhem. Bevestig je beschikbaarheid.",
    type: "Planning",
    status: "Nieuw",
    createdAt: "2026-07-11T11:30:00",
    relatedShiftId: "shift-002",
  },
  {
    id: "msg-005",
    title: "Algemene update zomermaand",
    body: "Door de drukke periode vragen we je beschikbaarheid minimaal 2 weken vooruit door te geven.",
    type: "Algemeen",
    status: "Gelezen",
    createdAt: "2026-07-01T08:00:00",
  },
];

export const DEMO_EMPLOYEE_DOCUMENTS: EmployeeDocument[] = [
  {
    id: "doc-001",
    title: "ZZP overeenkomst 2026",
    type: "Contract",
    status: "Goedgekeurd",
    uploadedAt: "2026-01-15",
  },
  {
    id: "doc-002",
    title: "Identiteitsbewijs",
    type: "ID",
    status: "Ingeleverd",
    uploadedAt: "2026-01-10",
  },
  {
    id: "doc-003",
    title: "IBAN verificatie",
    type: "IBAN",
    status: "Ingeleverd",
    uploadedAt: "2026-01-12",
  },
  {
    id: "doc-004",
    title: "HACCP certificaat",
    type: "Certificaat",
    status: "Verloopt binnenkort",
    uploadedAt: "2024-08-15",
    expiresAt: "2026-08-15",
  },
  {
    id: "doc-005",
    title: "BHV certificaat",
    type: "Certificaat",
    status: "Goedgekeurd",
    uploadedAt: "2025-03-20",
    expiresAt: "2027-03-20",
  },
  {
    id: "doc-006",
    title: "RI&E briefing festival",
    type: "Briefing",
    status: "Niet ingeleverd",
  },
  {
    id: "doc-007",
    title: "Schiphol badge aanvraag",
    type: "Overig",
    status: "Afgekeurd",
    uploadedAt: "2026-05-01",
  },
];

export type EmployeePortalStats = {
  upcomingShifts: number;
  hoursThisWeek: number;
  openActions: number;
  newMessages: number;
};

function parseShiftDate(date: string): Date {
  return new Date(`${date}T12:00:00`);
}

function isUpcomingShift(shift: EmployeeShift): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const shiftDate = parseShiftDate(shift.date);
  return (
    shiftDate >= today &&
    shift.status !== "Afgerond" &&
    shift.status !== "Geannuleerd"
  );
}

export function getUpcomingShifts(shifts = DEMO_EMPLOYEE_SHIFTS): EmployeeShift[] {
  return shifts
    .filter(isUpcomingShift)
    .sort((a, b) => parseShiftDate(a.date).getTime() - parseShiftDate(b.date).getTime());
}

export function getNextShift(shifts = DEMO_EMPLOYEE_SHIFTS): EmployeeShift | null {
  return getUpcomingShifts(shifts)[0] ?? null;
}

export function getEmployeePortalStats(
  shifts = DEMO_EMPLOYEE_SHIFTS,
  hours = DEMO_EMPLOYEE_HOURS,
  messages = DEMO_EMPLOYEE_MESSAGES,
  documents = DEMO_EMPLOYEE_DOCUMENTS,
): EmployeePortalStats {
  const upcoming = getUpcomingShifts(shifts);
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay() + 1);
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  const hoursThisWeek = hours
    .filter((entry) => {
      const d = parseShiftDate(entry.date);
      return d >= weekStart && d < weekEnd;
    })
    .reduce((sum, entry) => sum + entry.workedHours, 0);

  const openActions =
    messages.filter((m) => m.status === "Actie nodig" || m.status === "Nieuw").length +
    documents.filter((d) => d.status === "Niet ingeleverd" || d.status === "Verloopt binnenkort")
      .length +
    hours.filter((h) => h.status === "Ingediend" || h.status === "Concept").length;

  return {
    upcomingShifts: upcoming.length,
    hoursThisWeek: Math.round(hoursThisWeek * 100) / 100,
    openActions,
    newMessages: messages.filter((m) => m.status === "Nieuw").length,
  };
}

export function getPendingActions(
  messages = DEMO_EMPLOYEE_MESSAGES,
  documents = DEMO_EMPLOYEE_DOCUMENTS,
  hours = DEMO_EMPLOYEE_HOURS,
): { label: string; href: string; type: string }[] {
  const actions: { label: string; href: string; type: string }[] = [];

  for (const msg of messages) {
    if (msg.status === "Actie nodig" || msg.status === "Nieuw") {
      actions.push({
        label: msg.title,
        href: "/portaal/medewerkers/berichten",
        type: msg.type,
      });
    }
  }
  for (const doc of documents) {
    if (doc.status === "Niet ingeleverd" || doc.status === "Verloopt binnenkort") {
      actions.push({
        label: `${doc.title} — ${doc.status}`,
        href: "/portaal/medewerkers/documenten",
        type: "Document",
      });
    }
  }
  for (const entry of hours) {
    if (entry.status === "Ingediend") {
      actions.push({
        label: `Uren controleren: ${entry.projectName}`,
        href: "/portaal/medewerkers/uren",
        type: "Uren",
      });
    }
  }

  return actions.slice(0, 6);
}

export function formatShiftDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString("nl-NL", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function formatShiftTimeRange(start: string, end: string): string {
  return `${start} – ${end}`;
}

export function getGoogleMapsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export type EmployeeIntegrationItem = {
  id: string;
  name: string;
  checkUrl?: string;
};

export const EMPLOYEE_INTEGRATIONS: EmployeeIntegrationItem[] = [
  { id: "shiftbase", name: "Shiftbase", checkUrl: "/api/shiftbase" },
  { id: "whatsapp", name: "WhatsApp", checkUrl: "/api/whatsapp/status" },
  { id: "gmail", name: "Gmail" },
  { id: "supabase", name: "Supabase" },
];
