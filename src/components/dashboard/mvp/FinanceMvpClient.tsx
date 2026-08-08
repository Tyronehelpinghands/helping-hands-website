"use client";

import { useRouter } from "next/navigation";
import {
  MvpEmptyState,
  MvpPageHeader,
  MvpTableShell,
  TextInput,
  TextSelect,
} from "@/components/dashboard/mvp/MvpShared";
import {
  formatCurrency,
  formatHours,
  formatNumber,
} from "@/lib/dashboard/formatters";
import type {
  FinanceBreakdownRow,
  FinanceOverview,
  FinancePeriodKey,
} from "@/lib/dashboard/financeOverview";

const PERIOD_OPTIONS: { value: FinancePeriodKey; label: string }[] = [
  { value: "this_month", label: "Deze maand" },
  { value: "last_month", label: "Vorige maand" },
  { value: "this_quarter", label: "Dit kwartaal" },
  { value: "this_year", label: "Dit jaar" },
  { value: "custom", label: "Datumbereik" },
  { value: "all", label: "Alles" },
];

function KpiCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: "navy" | "orange" | "muted";
}) {
  const valueClass =
    accent === "orange"
      ? "text-[#E87722]"
      : accent === "muted"
        ? "text-[#101828]/70"
        : "text-[#0B1F4D]";
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className={`mt-2 text-xl font-black ${valueClass}`}>{value}</p>
      {hint ? (
        <p className="mt-1 text-xs text-[#101828]/50">{hint}</p>
      ) : null}
    </div>
  );
}

function BreakdownTable({
  title,
  rows,
  showOmzet,
  emptyLabel,
}: {
  title: string;
  rows: FinanceBreakdownRow[];
  showOmzet: boolean;
  emptyLabel: string;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-bold uppercase tracking-wide text-[#0B1F4D]">
        {title}
      </h2>
      {rows.length === 0 ? (
        <p className="text-sm text-[#101828]/50">{emptyLabel}</p>
      ) : (
        <MvpTableShell>
          <thead className="border-b border-slate-100 bg-[#F5F7FA] text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Naam</th>
              <th className="px-4 py-3 font-semibold">Uren</th>
              <th className="px-4 py-3 font-semibold">Personeelskosten</th>
              {showOmzet ? (
                <>
                  <th className="px-4 py-3 font-semibold">Omzet</th>
                  <th className="px-4 py-3 font-semibold">Marge</th>
                </>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-slate-50 last:border-0">
                <td className="px-4 py-3 font-medium text-[#0B1F4D]">
                  {row.name}
                </td>
                <td className="px-4 py-3 text-[#101828]/75">
                  {formatHours(row.hours)}
                </td>
                <td className="px-4 py-3 text-[#101828]/75">
                  {formatCurrency(row.personeelskosten)}
                </td>
                {showOmzet ? (
                  <>
                    <td className="px-4 py-3 text-[#101828]/75">
                      {formatCurrency(row.omzet)}
                    </td>
                    <td className="px-4 py-3 text-[#101828]/75">
                      {formatCurrency(row.marge)}
                      {row.margePercent !== null
                        ? ` (${formatNumber(row.margePercent, 1)}%)`
                        : ""}
                    </td>
                  </>
                ) : null}
              </tr>
            ))}
          </tbody>
        </MvpTableShell>
      )}
    </section>
  );
}

export function FinanceMvpClient({
  overview,
  tablesReady,
  moneybirdConfigured = false,
  canView,
}: {
  overview: FinanceOverview;
  tablesReady: boolean;
  moneybirdConfigured?: boolean;
  canView: boolean;
}) {
  const router = useRouter();
  const { period } = overview;

  const hasData =
    overview.omzet > 0 ||
    overview.personeelskosten > 0 ||
    overview.openstaand > 0 ||
    overview.conceptOmzet > 0 ||
    overview.totalHours > 0;

  function pushParams(next: Record<string, string | null>) {
    const params = new URLSearchParams();
    const periodKey = next.period ?? period.key;
    params.set("period", periodKey);
    if (periodKey === "custom") {
      const from = next.from ?? period.from;
      const to = next.to ?? period.to;
      if (from) params.set("from", from);
      if (to) params.set("to", to);
    }
    router.push(`/dashboard/intern/financien?${params.toString()}`);
  }

  if (!canView) {
    return (
      <div className="space-y-6">
        <MvpPageHeader
          title="Financiën"
          description="Inzicht in omzet, personeelskosten en marge."
        />
        <MvpEmptyState
          title="Geen toegang"
          description="Alleen owner, admin, finance of planner kan dit overzicht bekijken."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MvpPageHeader
        title="Financiën"
        description="Omzet uit facturen (excl. BTW), personeelskosten uit goedgekeurde/gefactureerde uren × uurkost, marge = omzet − personeelskosten."
        notice={
          !tablesReady
            ? "Voer docs/internal-dashboard-database.md uit in Supabase."
            : moneybirdConfigured
              ? "Cijfers uit Supabase; Moneybird-status via Facturatie. Geen demodata."
              : "Moneybird nog niet gekoppeld — cijfers komen uit Supabase-factuurconcepten en uren."
        }
      />

      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <div className="min-w-[160px] space-y-1.5">
          <label className="text-xs font-semibold text-[#0B1F4D]">Periode</label>
          <TextSelect
            value={period.key}
            onChange={(e) =>
              pushParams({ period: e.target.value as FinancePeriodKey })
            }
          >
            {PERIOD_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </TextSelect>
        </div>
        {period.key === "custom" ? (
          <>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#0B1F4D]">Van</label>
              <TextInput
                type="date"
                value={period.from ?? ""}
                onChange={(e) =>
                  pushParams({
                    period: "custom",
                    from: e.target.value || null,
                    to: period.to,
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#0B1F4D]">Tot</label>
              <TextInput
                type="date"
                value={period.to ?? ""}
                onChange={(e) =>
                  pushParams({
                    period: "custom",
                    from: period.from,
                    to: e.target.value || null,
                  })
                }
              />
            </div>
          </>
        ) : null}
        <p className="pb-2 text-sm text-[#101828]/55">{period.label}</p>
      </div>

      {!hasData ? (
        <MvpEmptyState
          title="Nog geen financiële data in deze periode"
          description="Maak of verstuur factuurconcepten, of keur uren goed met een uurkost op de crew."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              label="Omzet"
              value={formatCurrency(overview.omzet)}
              hint="Verstuurd + betaald, excl. BTW"
              accent="navy"
            />
            <KpiCard
              label="Personeelskosten"
              value={formatCurrency(overview.personeelskosten)}
              hint="Uren × uurkost (Fooks/crew)"
              accent="orange"
            />
            <KpiCard
              label="Marge"
              value={`${formatCurrency(overview.marge)}${
                overview.margePercent !== null
                  ? ` (${formatNumber(overview.margePercent, 1)}%)`
                  : ""
              }`}
              hint={
                overview.costsIncomplete
                  ? "Onbetrouwbaar: omzet zonder personeelskosten"
                  : "Omzet − personeelskosten"
              }
              accent={overview.costsIncomplete ? "orange" : undefined}
            />
            <KpiCard
              label="Openstaand"
              value={formatCurrency(overview.openstaand)}
              hint="Verstuurd, nog niet betaald"
              accent="muted"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              label="Waarvan betaald"
              value={formatCurrency(overview.betaaldeOmzet)}
              hint="Status betaald (gerealiseerde omzet)"
            />
            <KpiCard
              label="Concept / klaar"
              value={formatCurrency(overview.conceptOmzet)}
              hint="Nog niet verstuurd — geen omzet"
            />
            <KpiCard
              label="Uren (approved/invoiced)"
              value={formatHours(overview.totalHours)}
              hint="Basis voor personeelskosten"
            />
            <KpiCard
              label="Reiskosten in facturen"
              value={formatCurrency(overview.gefactureerdeReiskosten)}
              hint="Km gefactureerd aan klant (omzet, geen kost)"
            />
          </div>

          {overview.costsIncomplete ? (
            <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              Omzet zonder personeelskosten — marge van{" "}
              {overview.margePercent !== null
                ? `${formatNumber(overview.margePercent, 1)}%`
                : "100%"}{" "}
              is niet betrouwbaar. Controleer of uren op hetzelfde project
              goedgekeurd/gefactureerd zijn en of crew bruto/uurkost heeft.
            </div>
          ) : null}

          {overview.derivedFooksHours > 0 ? (
            <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-950">
              {formatHours(overview.derivedFooksHours)} uren: uurkost afgeleid
              uit bruto × Fooks (opgeslagen uurkost ontbrak of ≤ 0).
            </div>
          ) : null}

          {overview.missingHourlyCostHours > 0 ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {formatHours(overview.missingHourlyCostHours)} uren zonder
              uurkost/bruto — vul bruto bij crew in (vast/payroll × 1,580).
            </div>
          ) : null}

          <p className="text-xs text-[#101828]/45">
            Omzet = verstuurde/betaalde facturen in de periode (`subtotal` excl.
            BTW). Personeelskosten = goedgekeurde uren in de periode, plus
            gefactureerde uren op hetzelfde project als die factuur ×
            crew-uurkost (of bruto × Fooks als uurkost ontbreekt/≤ 0). Na uren
            goedkeuren en factuur versturen werken omzet én kosten bij.
          </p>

          <BreakdownTable
            title="Per project"
            rows={overview.byProject}
            showOmzet
            emptyLabel="Geen projectdata in deze periode."
          />
          <BreakdownTable
            title="Per crew (loonkosten)"
            rows={overview.byCrew}
            showOmzet={false}
            emptyLabel="Geen goedgekeurde/gefactureerde uren in deze periode."
          />
        </>
      )}
    </div>
  );
}
