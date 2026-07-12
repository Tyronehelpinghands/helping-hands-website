// TODO: Gmail API om e-mails te verzenden
// TODO: Gmail API om inbox te lezen
// TODO: WhatsApp Business API voor crewberichten
// TODO: HubSpot koppeling voor leads/opdrachtgevers
// TODO: Mailchimp voor nieuwsbrieven
// TODO: Supabase message database
// TODO: Auth/rollen zodat alleen interne users berichten kunnen zien
// TODO: Audit log van verzonden berichten
// TODO: Projectbriefings automatisch genereren vanuit planning
// TODO: Crewoproepen automatisch genereren vanuit open diensten
// TODO: Factuurherinneringen via Moneybird status
// TODO: later koppelen aan echte auth/rollen zodat alleen interne admins/planners communicatie kunnen beheren

import { MODULE_LINKS as DASHBOARD_MODULE_LINKS } from "@/lib/dashboardNavigation";

export type MessageChannel =
  | "E-mail"
  | "WhatsApp"
  | "SMS"
  | "Intern"
  | "HubSpot"
  | "Mailchimp";

export type MessageAudience =
  | "Crew"
  | "Opdrachtgever"
  | "Intern"
  | "Sollicitant"
  | "Lead"
  | "Projectgroep";

export type MessageStatus =
  | "Concept"
  | "Klaar om te versturen"
  | "Verzonden"
  | "Wacht op reactie"
  | "Beantwoord"
  | "Mislukt"
  | "Gepland";

export type MessagePriority = "Laag" | "Normaal" | "Hoog" | "Spoed";

export type MessageRelatedModule =
  | "Planning"
  | "Crew"
  | "Projecten"
  | "Sales"
  | "Leads"
  | "Urenregistratie"
  | "Facturatie";

export type MessageItem = {
  id: string;
  subject: string;
  preview: string;
  body: string;
  channel: MessageChannel;
  audience: MessageAudience;
  status: MessageStatus;
  priority: MessagePriority;
  recipientName: string;
  recipientEmail?: string;
  recipientPhone?: string;
  relatedProject?: string;
  relatedClient?: string;
  relatedModule?: MessageRelatedModule;
  createdAt: string;
  scheduledAt?: string;
  sentAt?: string;
  lastReplyAt?: string;
  owner: string;
  tags: string[];
  notes?: string;
};

export type MessageTemplateCategory =
  | "Crew oproep"
  | "Projectbriefing"
  | "Opdrachtgever"
  | "Sollicitatie"
  | "Planning"
  | "Facturatie"
  | "Reminder"
  | "Algemeen";

export type MessageTemplate = {
  id: string;
  title: string;
  category: MessageTemplateCategory;
  audience: MessageAudience;
  channel: MessageChannel;
  subject: string;
  body: string;
  variables: string[];
};

export type MessageFilters = {
  search: string;
  channel: string;
  audience: string;
  status: string;
  priority: string;
  module: string;
};

export const defaultMessageFilters: MessageFilters = {
  search: "",
  channel: "Alle",
  audience: "Alle",
  status: "Alle",
  priority: "Alle",
  module: "Alle",
};

export const MESSAGE_CHANNELS: MessageChannel[] = [
  "E-mail",
  "WhatsApp",
  "SMS",
  "Intern",
  "HubSpot",
  "Mailchimp",
];

export const MESSAGE_AUDIENCES: MessageAudience[] = [
  "Crew",
  "Opdrachtgever",
  "Intern",
  "Sollicitant",
  "Lead",
  "Projectgroep",
];

export const MESSAGE_STATUSES: MessageStatus[] = [
  "Concept",
  "Klaar om te versturen",
  "Verzonden",
  "Wacht op reactie",
  "Beantwoord",
  "Mislukt",
  "Gepland",
];

export const MESSAGE_PRIORITIES: MessagePriority[] = [
  "Laag",
  "Normaal",
  "Hoog",
  "Spoed",
];

export const MESSAGE_MODULES: MessageRelatedModule[] = [
  "Planning",
  "Crew",
  "Projecten",
  "Sales",
  "Leads",
  "Urenregistratie",
  "Facturatie",
];

export const MODULE_LINKS: Record<MessageRelatedModule, string> = {
  Planning: DASHBOARD_MODULE_LINKS.Planning,
  Crew: DASHBOARD_MODULE_LINKS.Crew,
  Projecten: DASHBOARD_MODULE_LINKS.Projecten,
  Sales: DASHBOARD_MODULE_LINKS.Sales,
  Leads: DASHBOARD_MODULE_LINKS.Leads,
  Urenregistratie: DASHBOARD_MODULE_LINKS.Urenregistratie,
  Facturatie: DASHBOARD_MODULE_LINKS.Facturatie,
};

export type MessageStats = {
  concepts: number;
  readyToSend: number;
  waitingForReply: number;
  sentThisWeek: number;
  urgent: number;
  openFollowUp: number;
};

export type CommunicationAction = {
  id: string;
  title: string;
  priority: MessagePriority;
  deadline?: string;
  relatedModule?: MessageRelatedModule;
  href: string;
};

export type MessageFormData = {
  channel: MessageChannel;
  audience: MessageAudience;
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  subject: string;
  body: string;
  relatedProject: string;
  relatedClient: string;
  relatedModule: string;
  priority: MessagePriority;
  tags: string;
  scheduledAt: string;
  notes: string;
  status: MessageStatus;
};

function msg(
  id: string,
  subject: string,
  body: string,
  channel: MessageChannel,
  audience: MessageAudience,
  status: MessageStatus,
  priority: MessagePriority,
  recipientName: string,
  owner: string,
  createdAt: string,
  extras?: Partial<MessageItem>,
): MessageItem {
  const preview = body.slice(0, 120).replace(/\n/g, " ");
  return {
    id,
    subject,
    preview,
    body,
    channel,
    audience,
    status,
    priority,
    recipientName,
    owner,
    createdAt,
    tags: extras?.tags ?? [],
    ...extras,
  };
}

export const demoMessageTemplates: MessageTemplate[] = [
  {
    id: "tpl-001",
    title: "Crew oproep - algemene inzet",
    category: "Crew oproep",
    audience: "Crew",
    channel: "WhatsApp",
    subject: "Nieuwe klus beschikbaar: {{projectNaam}}",
    body: `Hi {{naam}},

Er is een nieuwe klus beschikbaar.

Project: {{projectNaam}}
Datum: {{datum}}
Tijd: {{starttijd}} - {{eindtijd}}
Locatie: {{locatie}}
Functie: {{functie}}

Laat even weten of je beschikbaar bent.

Groet,
Helping Hands Agency`,
    variables: [
      "naam",
      "projectNaam",
      "datum",
      "starttijd",
      "eindtijd",
      "locatie",
      "functie",
    ],
  },
  {
    id: "tpl-002",
    title: "Projectbriefing crew",
    category: "Projectbriefing",
    audience: "Crew",
    channel: "E-mail",
    subject: "Briefing voor {{projectNaam}} - {{datum}}",
    body: `Hi {{naam}},

Hierbij de briefing voor je inzet.

Project: {{projectNaam}}
Datum: {{datum}}
Meldtijd: {{meldtijd}}
Locatie: {{locatie}}
Contactpersoon: {{contactpersoon}}
Kleding: {{kleding}}
Functie: {{functie}}

Zorg dat je op tijd aanwezig bent en bereikbaar blijft.

Groet,
Helping Hands Agency`,
    variables: [
      "naam",
      "projectNaam",
      "datum",
      "meldtijd",
      "locatie",
      "contactpersoon",
      "kleding",
      "functie",
    ],
  },
  {
    id: "tpl-003",
    title: "Bevestiging personeelsaanvraag",
    category: "Opdrachtgever",
    audience: "Opdrachtgever",
    channel: "E-mail",
    subject: "Bevestiging aanvraag personeel - {{projectNaam}}",
    body: `Goedemiddag {{contactpersoon}},

Bedankt voor de aanvraag.

Wij hebben de volgende gegevens ontvangen:

Project: {{projectNaam}}
Datum: {{datum}}
Locatie: {{locatie}}
Tijden: {{starttijd}} - {{eindtijd}}
Aantal personen: {{aantal}}
Functie(s): {{functies}}

Wij gaan de aanvraag verwerken en komen bij je terug met de planning.

Met vriendelijke groet,
Helping Hands Agency`,
    variables: [
      "contactpersoon",
      "projectNaam",
      "datum",
      "locatie",
      "starttijd",
      "eindtijd",
      "aantal",
      "functies",
    ],
  },
  {
    id: "tpl-004",
    title: "Reactie op aanmelding crew",
    category: "Sollicitatie",
    audience: "Sollicitant",
    channel: "E-mail",
    subject: "Je aanmelding bij Helping Hands Agency",
    body: `Hi {{naam}},

Bedankt voor je aanmelding bij Helping Hands Agency.

We nemen je gegevens door en komen bij je terug met de vervolgstappen.

Stuur alvast door als dat nog niet is gedaan:
- woonplaats
- ervaring
- beschikbaarheid
- telefoonnummer
- of je ZZP, payroll of loondienst zoekt

Groet,
Helping Hands Agency`,
    variables: ["naam"],
  },
  {
    id: "tpl-005",
    title: "Uren controleren",
    category: "Reminder",
    audience: "Crew",
    channel: "E-mail",
    subject: "Controleer je uren - {{week}}",
    body: `Hi {{naam}},

Wil je je uren voor {{week}} controleren?

Project: {{projectNaam}}
Datum: {{datum}}
Tijden: {{starttijd}} - {{eindtijd}}

Laat ons weten als iets niet klopt.

Groet,
Helping Hands Agency`,
    variables: [
      "naam",
      "week",
      "projectNaam",
      "datum",
      "starttijd",
      "eindtijd",
    ],
  },
  {
    id: "tpl-006",
    title: "Factuur opvolging",
    category: "Facturatie",
    audience: "Opdrachtgever",
    channel: "E-mail",
    subject: "Openstaande factuur - Helping Hands Agency",
    body: `Goedemiddag {{contactpersoon}},

Volgens onze administratie staat er nog een factuur open.

Factuur: {{factuurnummer}}
Bedrag: {{bedrag}}
Vervaldatum: {{vervaldatum}}

Kun je aangeven wanneer wij de betaling mogen verwachten?

Met vriendelijke groet,
Helping Hands Agency`,
    variables: ["contactpersoon", "factuurnummer", "bedrag", "vervaldatum"],
  },
];

export const demoMessages: MessageItem[] = [
  msg(
    "msg-001",
    "Nieuwe klus beschikbaar: GelreDome Arnhem",
    demoMessageTemplates[0].body,
    "WhatsApp",
    "Crew",
    "Klaar om te versturen",
    "Hoog",
    "Demo Crew 1",
    "Demo Planner",
    "2026-07-11T08:00:00",
    {
      recipientPhone: "+31 6 0000 0001",
      relatedProject: "GelreDome Arnhem",
      relatedModule: "Planning",
      tags: ["crew-oproep", "weekend"],
    },
  ),
  msg(
    "msg-002",
    "Briefing voor Amsterdam RAI - 2026-07-12",
    demoMessageTemplates[1].body,
    "E-mail",
    "Crew",
    "Verzonden",
    "Normaal",
    "Demo Crew 2",
    "Demo Planner",
    "2026-07-10T14:00:00",
    {
      recipientEmail: "demo-crew-2@example.nl",
      relatedProject: "Amsterdam RAI",
      relatedModule: "Planning",
      sentAt: "2026-07-10T15:30:00",
      tags: ["briefing"],
    },
  ),
  msg(
    "msg-003",
    "Bevestiging aanvraag personeel - Johan Cruijff ArenA",
    demoMessageTemplates[2].body,
    "E-mail",
    "Opdrachtgever",
    "Wacht op reactie",
    "Normaal",
    "Demo Klant 1",
    "Demo Sales",
    "2026-07-09T10:00:00",
    {
      recipientEmail: "demo-klant-1@example.nl",
      relatedProject: "Johan Cruijff ArenA",
      relatedClient: "Demo Klant 1",
      relatedModule: "Sales",
      sentAt: "2026-07-09T11:00:00",
      tags: ["opdrachtgever"],
    },
  ),
  msg(
    "msg-004",
    "Je aanmelding bij Helping Hands Agency",
    demoMessageTemplates[3].body,
    "E-mail",
    "Sollicitant",
    "Concept",
    "Laag",
    "Demo Sollicitant 1",
    "Demo Planner",
    "2026-07-11T09:30:00",
    {
      recipientEmail: "demo-sollicitant-1@example.nl",
      relatedModule: "Crew",
      tags: ["sollicitatie"],
    },
  ),
  msg(
    "msg-005",
    "Controleer je uren - Week 27",
    demoMessageTemplates[4].body,
    "E-mail",
    "Crew",
    "Gepland",
    "Normaal",
    "Demo Crew 1",
    "Demo Planner",
    "2026-07-10T16:00:00",
    {
      recipientEmail: "demo-crew-1@example.nl",
      relatedProject: "GelreDome Arnhem",
      relatedModule: "Urenregistratie",
      scheduledAt: "2026-07-12T08:00:00",
      tags: ["uren", "reminder"],
    },
  ),
  msg(
    "msg-006",
    "Openstaande factuur - Helping Hands Agency",
    demoMessageTemplates[5].body,
    "E-mail",
    "Opdrachtgever",
    "Klaar om te versturen",
    "Hoog",
    "Demo Klant 2",
    "Demo Finance",
    "2026-07-11T07:00:00",
    {
      recipientEmail: "demo-klant-2@example.nl",
      relatedClient: "Demo Klant 2",
      relatedModule: "Facturatie",
      tags: ["factuur", "opvolging"],
      notes: "Eerst intern controleren voor verzending.",
    },
  ),
  msg(
    "msg-007",
    "Weekplanning crew - intern overleg",
    "Team, graag even afstemmen over de bezetting voor komende week.\n\nProjecten: GelreDome, Festivalterrein, Restaurant ondersteuning.",
    "Intern",
    "Intern",
    "Verzonden",
    "Normaal",
    "Demo Planner",
    "Demo Planner",
    "2026-07-08T09:00:00",
    {
      relatedModule: "Planning",
      sentAt: "2026-07-08T09:15:00",
      tags: ["intern", "planning"],
    },
  ),
  msg(
    "msg-008",
    "Lead opvolging - Demo Horeca Klant",
    "Bedankt voor je interesse. Wanneer kunnen we een korte kennismaking plannen?",
    "HubSpot",
    "Lead",
    "Beantwoord",
    "Normaal",
    "Demo Klant 2",
    "Demo Sales",
    "2026-07-07T11:00:00",
    {
      relatedClient: "Demo Horeca Klant",
      relatedModule: "Leads",
      sentAt: "2026-07-07T11:30:00",
      lastReplyAt: "2026-07-08T14:00:00",
      tags: ["lead", "hubspot"],
    },
  ),
  msg(
    "msg-009",
    "Crewoproep Horeca event Scheveningen",
    "Hi Demo Crew 3, ben je beschikbaar voor zaterdag in Scheveningen? Bartender gezocht.",
    "WhatsApp",
    "Crew",
    "Wacht op reactie",
    "Spoed",
    "Demo Crew 3",
    "Demo Planner",
    "2026-07-11T10:00:00",
    {
      recipientPhone: "+31 6 0000 0003",
      relatedProject: "Horeca event Scheveningen",
      relatedModule: "Planning",
      sentAt: "2026-07-11T10:05:00",
      tags: ["spoed", "horeca"],
    },
  ),
  msg(
    "msg-010",
    "Nieuwsbrief zomer events",
    "Bekijk onze nieuwe crewmogelijkheden voor de zomerperiode.",
    "Mailchimp",
    "Projectgroep",
    "Gepland",
    "Laag",
    "Projectgroep zomer",
    "Demo Sales",
    "2026-07-06T12:00:00",
    {
      scheduledAt: "2026-07-15T09:00:00",
      tags: ["nieuwsbrief", "marketing"],
    },
  ),
  msg(
    "msg-011",
    "SMS herinnering meldtijd",
    "Reminder: morgen 07:30 melden bij Amsterdam RAI, ingang C.",
    "SMS",
    "Crew",
    "Verzonden",
    "Hoog",
    "Demo Crew 2",
    "Demo Planner",
    "2026-07-11T06:00:00",
    {
      recipientPhone: "+31 6 0000 0002",
      relatedProject: "Amsterdam RAI",
      sentAt: "2026-07-11T06:01:00",
      tags: ["sms", "reminder"],
    },
  ),
  msg(
    "msg-012",
    "Briefing Festivalterrein - concept",
    demoMessageTemplates[1].body,
    "E-mail",
    "Crew",
    "Concept",
    "Normaal",
    "Demo Crew 4",
    "Demo Planner",
    "2026-07-11T11:00:00",
    {
      relatedProject: "Festivalterrein",
      relatedModule: "Planning",
      tags: ["briefing", "concept"],
    },
  ),
  msg(
    "msg-013",
    "Load-out productie - bevestiging opdrachtgever",
    "Goedemorgen, wij bevestigen de inzet van 6 crewleden voor load-out.",
    "E-mail",
    "Opdrachtgever",
    "Verzonden",
    "Normaal",
    "Demo Productie Klant",
    "Demo Sales",
    "2026-07-05T13:00:00",
    {
      recipientEmail: "demo-productie@example.nl",
      relatedProject: "Load-out productie",
      relatedClient: "Demo Productie Klant",
      relatedModule: "Projecten",
      sentAt: "2026-07-05T13:30:00",
      tags: ["bevestiging"],
    },
  ),
  msg(
    "msg-014",
    "Restaurant ondersteuning - crew update",
    "Update: extra keukenhulp ingepland voor vrijdag.",
    "Intern",
    "Intern",
    "Concept",
    "Laag",
    "Demo Operations",
    "Demo Planner",
    "2026-07-11T12:00:00",
    {
      relatedProject: "Restaurant ondersteuning",
      relatedModule: "Crew",
      tags: ["update"],
    },
  ),
  msg(
    "msg-015",
    "HubSpot deal follow-up",
    "Volgende stap: offerte versturen voor stadionproductie.",
    "HubSpot",
    "Lead",
    "Klaar om te versturen",
    "Hoog",
    "Demo Klant 1",
    "Demo Sales",
    "2026-07-10T17:00:00",
    {
      relatedProject: "Stadionproductie",
      relatedModule: "Sales",
      tags: ["deal", "hubspot"],
    },
  ),
  msg(
    "msg-016",
    "WhatsApp groepsbericht weekendploeg",
    "Weekendploeg: check je briefing en bevestig aanwezigheid voor zaterdag.",
    "WhatsApp",
    "Projectgroep",
    "Verzonden",
    "Normaal",
    "Weekendploeg",
    "Demo Planner",
    "2026-07-09T18:00:00",
    {
      relatedProject: "GelreDome Arnhem",
      sentAt: "2026-07-09T18:10:00",
      tags: ["groep", "weekend"],
    },
  ),
  msg(
    "msg-017",
    "Factuurherinnering mislukt",
    "Automatische herinnering kon niet worden verzonden — handmatig opvolgen.",
    "E-mail",
    "Opdrachtgever",
    "Mislukt",
    "Hoog",
    "Demo Klant 2",
    "Demo Finance",
    "2026-07-08T08:00:00",
    {
      recipientEmail: "demo-klant-2@example.nl",
      relatedModule: "Facturatie",
      tags: ["factuur", "fout"],
      notes: "SMTP nog niet gekoppeld — demo status.",
    },
  ),
  msg(
    "msg-018",
    "Sollicitant vervolgstap",
    "Bedankt voor je reactie. We plannen een korte intake call volgende week.",
    "E-mail",
    "Sollicitant",
    "Beantwoord",
    "Normaal",
    "Demo Sollicitant 1",
    "Demo Planner",
    "2026-07-04T10:00:00",
    {
      recipientEmail: "demo-sollicitant-1@example.nl",
      sentAt: "2026-07-04T10:30:00",
      lastReplyAt: "2026-07-06T09:00:00",
      tags: ["sollicitatie"],
    },
  ),
];

function isThisWeek(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return d >= start && d <= end;
}

export function filterMessages(
  messages: MessageItem[],
  filters: MessageFilters,
): MessageItem[] {
  const search = filters.search.trim().toLowerCase();
  return messages.filter((m) => {
    if (search) {
      const hay = [
        m.subject,
        m.preview,
        m.body,
        m.recipientName,
        m.relatedProject ?? "",
        m.relatedClient ?? "",
        m.tags.join(" "),
        m.owner,
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(search)) return false;
    }
    if (filters.channel !== "Alle" && m.channel !== filters.channel) return false;
    if (filters.audience !== "Alle" && m.audience !== filters.audience) return false;
    if (filters.status !== "Alle" && m.status !== filters.status) return false;
    if (filters.priority !== "Alle" && m.priority !== filters.priority) return false;
    if (filters.module !== "Alle" && m.relatedModule !== filters.module) {
      return false;
    }
    return true;
  });
}

export function filterByTab(
  messages: MessageItem[],
  tab: "inbox" | "concepts" | "templates" | "followup",
): MessageItem[] {
  switch (tab) {
    case "concepts":
      return messages.filter((m) => m.status === "Concept");
    case "followup":
      return messages.filter((m) =>
        ["Wacht op reactie", "Klaar om te versturen", "Mislukt"].includes(m.status),
      );
    default:
      return messages;
  }
}

export function computeMessageStats(messages: MessageItem[]): MessageStats {
  return messages.reduce<MessageStats>(
    (acc, m) => {
      if (m.status === "Concept") acc.concepts += 1;
      if (m.status === "Klaar om te versturen") acc.readyToSend += 1;
      if (m.status === "Wacht op reactie") acc.waitingForReply += 1;
      if (m.sentAt && isThisWeek(m.sentAt)) acc.sentThisWeek += 1;
      if (m.priority === "Spoed" && m.status !== "Beantwoord") acc.urgent += 1;
      if (
        ["Wacht op reactie", "Klaar om te versturen", "Mislukt"].includes(m.status)
      ) {
        acc.openFollowUp += 1;
      }
      return acc;
    },
    {
      concepts: 0,
      readyToSend: 0,
      waitingForReply: 0,
      sentThisWeek: 0,
      urgent: 0,
      openFollowUp: 0,
    },
  );
}

export function buildCommunicationActions(
  messages: MessageItem[],
): CommunicationAction[] {
  const actions: CommunicationAction[] = [];

  const briefingMissing = messages.find(
    (m) =>
      m.tags.includes("briefing") &&
      m.status === "Concept" &&
      m.relatedProject === "Festivalterrein",
  );
  if (briefingMissing) {
    actions.push({
      id: "comm-1",
      title: "Briefing ontbreekt voor Festivalterrein",
      priority: "Hoog",
      deadline: "2026-07-13",
      relatedModule: "Planning",
      href: "/dashboard/intern/planning",
    });
  }

  const crewCallConcept = messages.find(
    (m) => m.tags.includes("crew-oproep") && m.status === "Klaar om te versturen",
  );
  if (crewCallConcept) {
    actions.push({
      id: "comm-2",
      title: "Crewoproep staat klaar om te versturen",
      priority: "Hoog",
      relatedModule: "Planning",
      href: "/dashboard/intern/berichten",
    });
  }

  const clientWaiting = messages.find(
    (m) => m.audience === "Opdrachtgever" && m.status === "Wacht op reactie",
  );
  if (clientWaiting) {
    actions.push({
      id: "comm-3",
      title: "Opdrachtgever wacht op bevestiging",
      priority: "Normaal",
      relatedModule: "Sales",
      href: "/dashboard/intern/sales",
    });
  }

  const sollicitant = messages.find(
    (m) => m.audience === "Sollicitant" && m.status === "Concept",
  );
  if (sollicitant) {
    actions.push({
      id: "comm-4",
      title: "Sollicitant moet reactie krijgen",
      priority: "Normaal",
      relatedModule: "Crew",
      href: "/dashboard/intern/crew",
    });
  }

  const hoursReminder = messages.find(
    (m) => m.tags.includes("uren") && m.status === "Gepland",
  );
  if (hoursReminder) {
    actions.push({
      id: "comm-5",
      title: "Urencontrole reminder nog niet verstuurd",
      priority: "Normaal",
      deadline: hoursReminder.scheduledAt,
      relatedModule: "Urenregistratie",
      href: "/dashboard/intern/urenregistratie",
    });
  }

  const invoiceFollow = messages.find(
    (m) => m.tags.includes("factuur") && ["Mislukt", "Klaar om te versturen"].includes(m.status),
  );
  if (invoiceFollow) {
    actions.push({
      id: "comm-6",
      title: "Factuur opvolging nodig",
      priority: "Hoog",
      relatedModule: "Facturatie",
      href: "/dashboard/intern/facturatie",
    });
  }

  return actions;
}

export function exportMessagesCsv(messages: MessageItem[]): string {
  const headers = [
    "Onderwerp",
    "Ontvanger",
    "Kanaal",
    "Doelgroep",
    "Status",
    "Prioriteit",
    "Project",
    "Klant",
    "Eigenaar",
    "Aangemaakt",
    "Gepland",
    "Verzonden",
  ];
  const rows = messages.map((m) => [
    m.subject,
    m.recipientName,
    m.channel,
    m.audience,
    m.status,
    m.priority,
    m.relatedProject ?? "",
    m.relatedClient ?? "",
    m.owner,
    m.createdAt,
    m.scheduledAt ?? "",
    m.sentAt ?? "",
  ]);
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  return [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n");
}

export function downloadMessagesCsv(content: string, filename?: string): void {
  const blob = new Blob(["\uFEFF" + content], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename ?? "berichten-helping-hands.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export function messageToFormData(m: MessageItem): MessageFormData {
  return {
    channel: m.channel,
    audience: m.audience,
    recipientName: m.recipientName,
    recipientEmail: m.recipientEmail ?? "",
    recipientPhone: m.recipientPhone ?? "",
    subject: m.subject,
    body: m.body,
    relatedProject: m.relatedProject ?? "",
    relatedClient: m.relatedClient ?? "",
    relatedModule: m.relatedModule ?? "",
    priority: m.priority,
    tags: m.tags.join(", "),
    scheduledAt: m.scheduledAt ?? "",
    notes: m.notes ?? "",
    status: m.status,
  };
}

export function createMessageFromForm(
  form: MessageFormData,
  existingId?: string,
  existingCreatedAt?: string,
): MessageItem {
  const now = new Date().toISOString();
  const tags = form.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  return msg(
    existingId ?? `msg-${Date.now()}`,
    form.subject.trim(),
    form.body.trim(),
    form.channel,
    form.audience,
    form.status,
    form.priority,
    form.recipientName.trim(),
    "Demo Planner",
    existingCreatedAt ?? now,
    {
      recipientEmail: form.recipientEmail.trim() || undefined,
      recipientPhone: form.recipientPhone.trim() || undefined,
      relatedProject: form.relatedProject.trim() || undefined,
      relatedClient: form.relatedClient.trim() || undefined,
      relatedModule: (form.relatedModule || undefined) as MessageRelatedModule | undefined,
      scheduledAt: form.scheduledAt || undefined,
      tags,
      notes: form.notes.trim() || undefined,
    },
  );
}

export function duplicateMessage(m: MessageItem): MessageItem {
  return {
    ...m,
    id: `msg-${Date.now()}`,
    subject: `${m.subject} (kopie)`,
    status: "Concept",
    sentAt: undefined,
    lastReplyAt: undefined,
    scheduledAt: undefined,
    createdAt: new Date().toISOString(),
  };
}

export function getModuleLink(module?: MessageRelatedModule): string | null {
  if (!module) return null;
  return MODULE_LINKS[module] ?? null;
}
