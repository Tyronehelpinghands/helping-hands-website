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

export function isHubSpotConfigured(): boolean {
  return Boolean(process.env.HUBSPOT_ACCESS_TOKEN?.trim());
}

export function getHubSpotClient(): Client {
  const token = process.env.HUBSPOT_ACCESS_TOKEN?.trim();
  if (!token) {
    throw new Error("HUBSPOT_ACCESS_TOKEN is niet geconfigureerd");
  }
  return new Client({ accessToken: token });
}

export async function testHubSpotConnection() {
  const client = getHubSpotClient();
  const response = await client.crm.contacts.basicApi.getPage(1);

  return {
    ok: true as const,
    message: "HubSpot connectie succesvol",
    sampleContacts: response.results.length,
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
        message:
          error instanceof Error ? error.message : "Onbekende synchronisatiefout",
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
