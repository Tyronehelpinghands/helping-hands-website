"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ConvertToDealModal from "@/components/leads/ConvertToDealModal";
import FollowUpsList from "@/components/leads/FollowUpsList";
import HubSpotLeadsSyncCard from "@/components/leads/HubSpotLeadsSyncCard";
import LeadDetailDrawer from "@/components/leads/LeadDetailDrawer";
import LeadStatusOverview from "@/components/leads/LeadStatusOverview";
import LeadsFilters from "@/components/leads/LeadsFilters";
import LeadsKpiCards from "@/components/leads/LeadsKpiCards";
import LeadsPageToolbar from "@/components/leads/LeadsPageToolbar";
import LeadsTable, { type LeadTableAction } from "@/components/leads/LeadsTable";
import NewLeadModal from "@/components/leads/NewLeadModal";
import type { Lead, LeadFollowUp } from "@/data/leadsMockData";
import type { LeadsDataSource } from "@/lib/leads-utils";
import {
  computeLeadKpis,
  computeStatusOverview,
  defaultLeadsFilters,
  downloadCsv,
  filterLeads,
  leadToSupabaseInsert,
  leadsToCsv,
  sanitizeHubSpotUiMessage,
  type LeadsFilterState,
  type NewLeadFormData,
} from "@/lib/leads-utils";
import { createClient } from "@/lib/supabase/client";

type LeadsDashboardClientProps = {
  initialLeads: Lead[];
  initialFollowUps: LeadFollowUp[];
  dataSource: LeadsDataSource;
  hubspotConfigured: boolean;
};

function leadToFormData(lead: Lead): NewLeadFormData {
  return {
    bedrijf: lead.bedrijf,
    contact: lead.contact,
    email: lead.email,
    telefoon: lead.telefoon,
    website: lead.website ?? "",
    bron: lead.bron,
    status: lead.status,
    prioriteit: lead.prioriteit,
    waarde: lead.waarde ? String(lead.waarde) : "",
    eigenaar: lead.eigenaar,
    volgendeActie: lead.volgendeActie,
    volgendeActieDatum: lead.volgendeActieDatum ?? "",
    notities: lead.notities ?? "",
  };
}

export default function LeadsDashboardClient({
  initialLeads,
  initialFollowUps,
  dataSource,
  hubspotConfigured,
}: LeadsDashboardClientProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [followUps] = useState<LeadFollowUp[]>(initialFollowUps);
  const [filters, setFilters] = useState<LeadsFilterState>(defaultLeadsFilters);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [syncing, setSyncing] = useState(false);

  const [newLeadOpen, setNewLeadOpen] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [detailLead, setDetailLead] = useState<Lead | null>(null);
  const [convertLead, setConvertLead] = useState<Lead | null>(null);
  const [deleteLead, setDeleteLead] = useState<Lead | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const filteredLeads = useMemo(
    () => filterLeads(leads, filters),
    [leads, filters],
  );

  const kpiCards = useMemo(
    () => computeLeadKpis(leads, followUps),
    [leads, followUps],
  );

  const statusOverview = useMemo(() => computeStatusOverview(leads), [leads]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  }, []);

  const persistLead = useCallback(
    async (lead: Lead, mode: "create" | "update") => {
      if (dataSource !== "supabase") {
        return;
      }

      try {
        const supabase = createClient();
        const payload = leadToSupabaseInsert(lead);

        if (mode === "create") {
          const { data, error } = await supabase
            .from("sales_leads")
            .insert(payload)
            .select("id")
            .single();
          if (error) throw error;
          if (data?.id) lead.id = data.id;
        } else {
          const { error } = await supabase
            .from("sales_leads")
            .update(payload)
            .eq("id", lead.id);
          if (error) throw error;
        }
      } catch (error) {
        console.error("[Leads] Supabase opslag mislukt:", error);
        showToast("Opslaan in Supabase mislukt — lokaal opgeslagen.");
      }
    },
    [dataSource, showToast],
  );

  const handleSaveLead = useCallback(
    async (lead: Lead) => {
      if (editLead) {
        const updated: Lead = {
          ...editLead,
          bedrijf: lead.bedrijf,
          contact: lead.contact,
          email: lead.email,
          telefoon: lead.telefoon,
          website: lead.website,
          bron: lead.bron,
          status: lead.status,
          prioriteit: lead.prioriteit,
          waarde: lead.waarde,
          eigenaar: lead.eigenaar,
          volgendeActie: lead.volgendeActie,
          volgendeActieDatum: lead.volgendeActieDatum,
          notities: lead.notities,
          laatsteContact: "Zojuist bijgewerkt",
        };
        setLeads((prev) => prev.map((l) => (l.id === editLead.id ? updated : l)));
        await persistLead(updated, "update");
        setEditLead(null);
        showToast("Lead bijgewerkt.");
      } else {
        setLeads((prev) => [lead, ...prev]);
        await persistLead(lead, "create");
        showToast("Lead toegevoegd.");
      }
    },
    [editLead, persistLead, showToast],
  );

  const handleDelete = useCallback(async () => {
    if (!deleteLead) return;

    if (dataSource === "supabase") {
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from("sales_leads")
          .delete()
          .eq("id", deleteLead.id);
        if (error) throw error;
      } catch (error) {
        console.error("[Leads] Supabase delete mislukt:", error);
        showToast("Verwijderen in Supabase mislukt.");
        setDeleteLead(null);
        return;
      }
    }

    setLeads((prev) => prev.filter((l) => l.id !== deleteLead.id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(deleteLead.id);
      return next;
    });
    setDeleteLead(null);
    showToast("Lead verwijderd.");
  }, [deleteLead, dataSource, showToast]);

  const syncLeadToHubSpot = useCallback(
    async (lead: Lead) => {
      try {
        const response = await fetch("/api/hubspot/sync-lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: lead.id,
            email: lead.email,
            contact: lead.contact,
            bedrijf: lead.bedrijf,
            waarde: lead.waarde,
            status: lead.status,
          }),
        });
        const data = await response.json();

        if (!response.ok || !data.ok) {
          showToast(sanitizeHubSpotUiMessage(data.error));
          return false;
        }

        setLeads((prev) =>
          prev.map((l) =>
            l.id === lead.id
              ? { ...l, hubspotSyncStatus: "gesynchroniseerd" as const }
              : l,
          ),
        );
        showToast("Lead gesynchroniseerd met HubSpot.");
        return true;
      } catch {
        showToast("HubSpot koppeling mislukt. Controleer token of scopes.");
        return false;
      }
    },
    [showToast],
  );

  const runBulkSync = useCallback(
    async (targetLeads: Lead[]) => {
      setSyncing(true);
      let synced = 0;
      let failed = 0;

      for (const lead of targetLeads) {
        const ok = await syncLeadToHubSpot(lead);
        if (ok) synced++;
        else failed++;
      }

      window.dispatchEvent(
        new CustomEvent("hubspot-leads-sync", {
          detail: {
            ok: failed === 0,
            synced,
            message:
              failed > 0
                ? `${synced} gesynchroniseerd, ${failed} mislukt.`
                : `${synced} leads gesynchroniseerd.`,
          },
        }),
      );

      setSyncing(false);
    },
    [syncLeadToHubSpot],
  );

  const handleSyncAll = useCallback(async () => {
    setSyncing(true);
    try {
      const response = await fetch("/api/hubspot/sync-all-leads", {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        window.dispatchEvent(
          new CustomEvent("hubspot-leads-sync", {
            detail: {
              ok: false,
              message: sanitizeHubSpotUiMessage(data.error),
            },
          }),
        );
        return;
      }

      window.dispatchEvent(
        new CustomEvent("hubspot-leads-sync", {
          detail: {
            ok: true,
            synced: data.synced ?? 0,
            message: `${data.synced ?? 0} leads gesynchroniseerd.`,
          },
        }),
      );
    } catch {
      window.dispatchEvent(
        new CustomEvent("hubspot-leads-sync", {
          detail: {
            ok: false,
            message: "HubSpot koppeling mislukt. Controleer token of scopes.",
          },
        }),
      );
    } finally {
      setSyncing(false);
    }
  }, []);

  const handleTableAction = useCallback(
    (action: LeadTableAction, lead: Lead) => {
      switch (action) {
        case "view":
          setDetailLead(lead);
          break;
        case "edit":
          setEditLead(lead);
          break;
        case "followup":
          showToast(`Follow-up gepland voor ${lead.bedrijf}.`);
          break;
        case "sync":
          void syncLeadToHubSpot(lead);
          break;
        case "deal":
          setConvertLead(lead);
          break;
        case "lost":
          setLeads((prev) =>
            prev.map((l) =>
              l.id === lead.id ? { ...l, status: "verloren" as const } : l,
            ),
          );
          showToast(`${lead.bedrijf} gemarkeerd als verloren.`);
          break;
        case "delete":
          setDeleteLead(lead);
          break;
      }
    },
    [showToast, syncLeadToHubSpot],
  );

  const handleConvertDeal = useCallback(
    async (deal: {
      dealName: string;
      bedrijf: string;
      contact: string;
      waarde: number;
      sluitdatum: string;
      fase: string;
      eigenaar: string;
    }) => {
      if (!convertLead) return;

      if (dataSource === "supabase") {
        try {
          const supabase = createClient();
          await supabase.from("sales_deals").insert({
            lead_id: convertLead.id,
            deal_name: deal.dealName,
            company_name: deal.bedrijf,
            contact_name: deal.contact,
            amount: deal.waarde,
            expected_close_date: deal.sluitdatum || null,
            pipeline_stage: deal.fase,
          });
          await supabase
            .from("sales_leads")
            .update({ status: "omgezet_naar_deal" })
            .eq("id", convertLead.id);
        } catch (error) {
          console.error("[Leads] Deal aanmaken mislukt:", error);
        }
      }

      setLeads((prev) =>
        prev.map((l) =>
          l.id === convertLead.id
            ? { ...l, status: "omgezet_naar_deal" as const, waarde: deal.waarde }
            : l,
        ),
      );
      setConvertLead(null);
      showToast(`Deal "${deal.dealName}" aangemaakt.`);
    },
    [convertLead, dataSource, showToast],
  );

  const handleExport = useCallback(() => {
    const csv = leadsToCsv(filteredLeads);
    downloadCsv(csv, `helping-hands-leads-${new Date().toISOString().slice(0, 10)}.csv`);
    showToast(`${filteredLeads.length} leads geëxporteerd.`);
  }, [filteredLeads, showToast]);

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 rounded-xl border border-[#173A8A]/20 bg-[#0B1F4D] px-4 py-3 text-sm font-medium text-white shadow-lg"
          role="status"
        >
          {toast}
        </div>
      )}

      {dataSource === "mock" && process.env.NODE_ENV === "development" && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800">
          Mock data actief — voer <code className="font-mono">supabase/sales-leads.sql</code> uit
          voor live data.
        </div>
      )}

      <LeadsPageToolbar
        onNewLead={() => setNewLeadOpen(true)}
        onImport={() => setImportOpen(true)}
        onSyncHubSpot={handleSyncAll}
        onExport={handleExport}
        syncing={syncing}
      />

      <LeadsKpiCards cards={kpiCards} />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <LeadStatusOverview summary={statusOverview} />
        </div>
        <HubSpotLeadsSyncCard
          initialConfigured={hubspotConfigured}
          selectedCount={selectedIds.size}
          onSyncSelected={() => {
            const selected = leads.filter((l) => selectedIds.has(l.id));
            void runBulkSync(selected);
          }}
          onSyncNew={() => {
            const newLeads = leads.filter(
              (l) =>
                l.status === "nieuw" &&
                l.hubspotSyncStatus !== "gesynchroniseerd",
            );
            void runBulkSync(newLeads);
          }}
          syncing={syncing}
        />
      </div>

      <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
        <CardHeader>
          <CardTitle className="text-lg font-black text-[#0B1F4D]">
            Alle leads
          </CardTitle>
          <CardDescription>
            {filteredLeads.length} van {leads.length} leads
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-4 pb-4 sm:px-6">
          <LeadsFilters leads={leads} filters={filters} onChange={setFilters} />
          <LeadsTable
            leads={filteredLeads}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onAction={handleTableAction}
          />
        </CardContent>
      </Card>

      <FollowUpsList tasks={followUps} />

      <NewLeadModal
        open={newLeadOpen}
        onOpenChange={setNewLeadOpen}
        onSave={handleSaveLead}
      />

      <NewLeadModal
        open={editLead !== null}
        onOpenChange={(open) => {
          if (!open) setEditLead(null);
        }}
        onSave={handleSaveLead}
        initialData={editLead ? leadToFormData(editLead) : undefined}
        mode="edit"
        title="Lead bewerken"
      />

      <LeadDetailDrawer
        lead={detailLead}
        open={detailLead !== null}
        onOpenChange={(open) => {
          if (!open) setDetailLead(null);
        }}
        onEdit={(lead) => {
          setDetailLead(null);
          setEditLead(lead);
        }}
        onFollowUp={(lead) => showToast(`Follow-up voor ${lead.bedrijf} gepland.`)}
        onSync={(lead) => void syncLeadToHubSpot(lead)}
        onConvertDeal={(lead) => {
          setDetailLead(null);
          setConvertLead(lead);
        }}
      />

      <ConvertToDealModal
        open={convertLead !== null}
        onOpenChange={(open) => {
          if (!open) setConvertLead(null);
        }}
        lead={convertLead}
        onConvert={handleConvertDeal}
      />

      <Dialog open={deleteLead !== null} onOpenChange={() => setDeleteLead(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-[#0B1F4D]">Lead verwijderen</DialogTitle>
            <DialogDescription>
              Weet je zeker dat je {deleteLead?.bedrijf} wilt verwijderen? Dit kan
              niet ongedaan worden gemaakt.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteLead(null)}>
              Annuleren
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => void handleDelete()}
            >
              Verwijderen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#0B1F4D]">Leads importeren</DialogTitle>
            <DialogDescription>
              CSV-import wordt binnenkort beschikbaar.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl border border-dashed border-slate-200 bg-[#F5F7FA] px-4 py-8 text-center text-sm text-[#101828]/65">
            Upload een CSV-bestand met kolommen: bedrijf, contact, e-mail, telefoon,
            bron, status, waarde.
          </div>
          <DialogFooter>
            <Button onClick={() => setImportOpen(false)}>Sluiten</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
