"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Field,
  MvpPageHeader,
  MvpToast,
  TextInput,
  useToast,
} from "@/components/dashboard/mvp/MvpShared";
import {
  saveCompanyInfoAction,
  saveEmailSettingsAction,
  saveRatesSettingsAction,
} from "@/lib/dashboard/mutations";
import type {
  CompanyInfoValue,
  EmailSettingsValue,
  RateSettingsValue,
} from "@/lib/dashboard/types";

export function SettingsMvpClient({
  company,
  emails,
  rates,
  tablesReady,
}: {
  company: CompanyInfoValue;
  emails: EmailSettingsValue;
  rates: RateSettingsValue;
  tablesReady: boolean;
}) {
  const router = useRouter();
  const { toast, showToast } = useToast();
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-6">
      <MvpPageHeader
        title="Instellingen"
        description="Bedrijfsgegevens, e-mails en standaardtarieven in company_settings."
        notice={
          tablesReady
            ? "Alleen owner/admin kunnen opslaan. Geen secrets in de UI."
            : "Voer docs/internal-dashboard-database.md uit in Supabase."
        }
      />

      <form
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-4"
        action={(fd) => {
          startTransition(async () => {
            const res = await saveCompanyInfoAction(fd);
            showToast(res.ok ? "Bedrijfsgegevens opgeslagen." : res.error);
            router.refresh();
          });
        }}
      >
        <h2 className="text-lg font-black text-[#0B1F4D]">Bedrijf</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Bedrijfsnaam" name="company_name">
            <TextInput
              name="company_name"
              defaultValue={company.company_name}
            />
          </Field>
          <Field label="Telefoon" name="phone">
            <TextInput name="phone" defaultValue={company.phone} />
          </Field>
          <Field label="Adres" name="address">
            <TextInput name="address" defaultValue={company.address} />
          </Field>
          <Field label="Postcode" name="postal_code">
            <TextInput name="postal_code" defaultValue={company.postal_code} />
          </Field>
          <Field label="Stad" name="city">
            <TextInput name="city" defaultValue={company.city} />
          </Field>
          <Field label="Website" name="website">
            <TextInput name="website" defaultValue={company.website} />
          </Field>
        </div>
        <Button
          type="submit"
          disabled={pending}
          className="bg-[#173A8A] text-white hover:bg-[#0B1F4D]"
        >
          Opslaan
        </Button>
      </form>

      <form
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-4"
        action={(fd) => {
          startTransition(async () => {
            const res = await saveEmailSettingsAction(fd);
            showToast(res.ok ? "E-mailadressen opgeslagen." : res.error);
            router.refresh();
          });
        }}
      >
        <h2 className="text-lg font-black text-[#0B1F4D]">E-mailadressen</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="planning@" name="planning">
            <TextInput name="planning" defaultValue={emails.planning} />
          </Field>
          <Field label="aanmeldingen@" name="aanmeldingen">
            <TextInput name="aanmeldingen" defaultValue={emails.aanmeldingen} />
          </Field>
          <Field label="info@" name="info">
            <TextInput name="info" defaultValue={emails.info} />
          </Field>
        </div>
        <Button
          type="submit"
          disabled={pending}
          className="bg-[#173A8A] text-white hover:bg-[#0B1F4D]"
        >
          Opslaan
        </Button>
      </form>

      <form
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-4"
        action={(fd) => {
          startTransition(async () => {
            const res = await saveRatesSettingsAction(fd);
            showToast(res.ok ? "Tarieven opgeslagen." : res.error);
            router.refresh();
          });
        }}
      >
        <h2 className="text-lg font-black text-[#0B1F4D]">Tarieven</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Km-vergoeding (€)" name="km_rate">
            <TextInput
              name="km_rate"
              type="number"
              step="0.01"
              defaultValue={rates.km_rate}
            />
          </Field>
          <Field label="BTW %" name="vat_percent">
            <TextInput
              name="vat_percent"
              type="number"
              step="0.1"
              defaultValue={rates.vat_percent}
            />
          </Field>
          <Field label="Site crew (€)" name="site_crew">
            <TextInput
              name="site_crew"
              type="number"
              step="0.01"
              defaultValue={rates.site_crew}
            />
          </Field>
          <Field label="Horeca allround (€)" name="horeca_allround">
            <TextInput
              name="horeca_allround"
              type="number"
              step="0.01"
              defaultValue={rates.horeca_allround}
            />
          </Field>
          <Field label="Keukenhulp (€)" name="keukenhulp">
            <TextInput
              name="keukenhulp"
              type="number"
              step="0.01"
              defaultValue={rates.keukenhulp}
            />
          </Field>
          <Field label="Zelfstandig kok (€)" name="zelfstandig_kok">
            <TextInput
              name="zelfstandig_kok"
              type="number"
              step="0.01"
              defaultValue={rates.zelfstandig_kok}
            />
          </Field>
          <Field label="Teamcaptain (€)" name="teamcaptain">
            <TextInput
              name="teamcaptain"
              type="number"
              step="0.01"
              defaultValue={rates.teamcaptain}
            />
          </Field>
        </div>
        <Button
          type="submit"
          disabled={pending}
          className="bg-[#173A8A] text-white hover:bg-[#0B1F4D]"
        >
          Opslaan
        </Button>
      </form>

      <MvpToast message={toast} />
    </div>
  );
}
