import { Client } from "@hubspot/api-client";

export type HubSpotLeadInput = {
  id: string;
  email: string;
  contact: string;
  bedrijf: string;
  waarde?: number;
  status?: string;
};

export type HubSpotDealInput = {
  id: string;
  title: string;
  amount: number;
  stage?: string;
  bedrijf?: string;
};

export type HubSpotSyncResult = {
  id: string;
  hubspotId: string;
  action: "created" | "updated" | "skipped";
};

const DEFAULT_BASE_PATH = "https://api.hubapi.com";
const EU_BASE_PATH = "https://api-eu1.hubapi.com";

export function getHubSpotAccessToken(): string | undefined {
  const raw = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!raw) {
    return undefined;
  }

  const token = raw.trim().replace(/^['"]|['"]$/g, "");
  return token || undefined;
}

export function isHubSpotConfigured(): boolean {
  return Boolean(getHubSpotAccessToken());
}

export function getHubSpotBasePath(token: string): string {
  const override = process.env.HUBSPOT_API_BASE_PATH?.trim();
  if (override) {
    return override.replace(/\/$/, "");
  }

  if (token.startsWith("pat-eu1-")) {
    return EU_BASE_PATH;
  }

  return DEFAULT_BASE_PATH;
}

export function getHubSpotClient(): Client {
  const token = getHubSpotAccessToken();
  if (!token) {
    throw new Error("HUBSPOT_ACCESS_TOKEN is niet geconfigureerd");
  }

  if (!token.startsWith("pat-")) {
    throw new Error(
      "HUBSPOT_ACCESS_TOKEN heeft een ongeldig formaat. Gebruik een Private App token (pat-...).",
    );
  }

  return new Client({
    accessToken: token,
    basePath: getHubSpotBasePath(token),
  });
}

export function formatHubSpotError(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message;

    if (message.includes("401") || message.includes("INVALID_AUTHENTICATION")) {
      return (
        "HubSpot authenticatie mislukt (401). Controleer of HUBSPOT_ACCESS_TOKEN geldig is, " +
        "niet verlopen/geroteerd, en dat je Private App minimaal de scope " +
        "crm.objects.contacts.read heeft. EU-tokens (pat-eu1-) worden automatisch naar api-eu1.hubapi.com gerouteerd."
      );
    }

    if (message.includes("403") || message.includes("MISSING_SCOPES")) {
      return (
        "HubSpot weigert toegang (403). Voeg de benodigde CRM-scopes toe aan je Private App " +
        "(crm.objects.contacts.read/write, crm.objects.deals.read/write)."
      );
    }

    return message;
  }

  return "Onbekende HubSpot-fout";
}

export async function testHubSpotConnection() {
  const token = getHubSpotAccessToken();
  if (!token) {
    throw new Error("HUBSPOT_ACCESS_TOKEN is niet geconfigureerd");
  }

  const basePath = getHubSpotBasePath(token);
  const response = await fetch(`${basePath}/crm/v3/objects/contacts?limit=1`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(
        "HubSpot authenticatie mislukt (401). Controleer of HUBSPOT_ACCESS_TOKEN geldig is, " +
          "niet verlopen/geroteerd, en dat je Private App minimaal de scope " +
          "crm.objects.contacts.read heeft.",
      );
    }

    if (response.status === 403) {
      throw new Error(
        "HubSpot weigert toegang (403). Voeg crm.objects.contacts.read toe aan je Private App scopes.",
      );
    }

    throw new Error(`HubSpot test mislukt (HTTP ${response.status})`);
  }

  const data = (await response.json()) as { results?: unknown[] };

  return {
    ok: true as const,
    message: "HubSpot connectie succesvol",
    region: basePath.includes("eu1") ? "EU" : "NA",
    sampleContacts: data.results?.length ?? 0,
  };
}

function splitContactName(contact: string): {
  firstname: string;
  lastname: string;
} {
  const parts = contact.trim().split(/\s+/);
  if (parts.length === 1) {
    return { firstname: parts[0], lastname: "" };
  }
  return {
    firstname: parts[0],
    lastname: parts.slice(1).join(" "),
  };
}

export async function syncLeadToHubSpot(
  lead: HubSpotLeadInput,
): Promise<HubSpotSyncResult> {
  const client = getHubSpotClient();
  const { firstname, lastname } = splitContactName(lead.contact);

  const properties: Record<string, string> = {
    email: lead.email,
    firstname,
    lastname,
    company: lead.bedrijf,
  };

  if (lead.status) {
    properties.hs_lead_status = lead.status;
  }

  const response = await client.crm.contacts.basicApi.create({
    properties,
    associations: [],
  });

  return {
    id: lead.id,
    hubspotId: response.id,
    action: "created",
  };
}

export async function syncDealToHubSpot(
  deal: HubSpotDealInput,
): Promise<HubSpotSyncResult> {
  const client = getHubSpotClient();

  const response = await client.crm.deals.basicApi.create({
    properties: {
      dealname: deal.title,
      amount: String(deal.amount),
      dealstage: deal.stage ?? "appointmentscheduled",
      description: deal.bedrijf ?? "",
    },
    associations: [],
  });

  return {
    id: deal.id,
    hubspotId: response.id,
    action: "created",
  };
}

export async function syncAllToHubSpot(leads: HubSpotLeadInput[]) {
  const results: HubSpotSyncResult[] = [];
  const errors: { id: string; message: string }[] = [];

  for (const lead of leads) {
    try {
      const result = await syncLeadToHubSpot(lead);
      results.push(result);
    } catch (error) {
      errors.push({
        id: lead.id,
        message: formatHubSpotError(error),
      });
    }
  }

  return {
    synced: results.length,
    failed: errors.length,
    results,
    errors,
  };
}
