import type { Metadata } from "next";
import { SettingsMvpClient } from "@/components/dashboard/mvp/SettingsMvpClient";
import {
  DEFAULT_RATE_SETTINGS,
  getCompanySettingMap,
  getDashboardStats,
  getRateSettings,
} from "@/lib/dashboard/queries";
import type {
  CompanyInfoValue,
  EmailSettingsValue,
} from "@/lib/dashboard/types";

export const metadata: Metadata = {
  title: "Instellingen | Intern dashboard",
  description:
    "Beheer bedrijfsgegevens, tarieven en e-mailadressen via company_settings.",
};

export default async function InternInstellingenPage() {
  const [map, rates, stats] = await Promise.all([
    getCompanySettingMap(),
    getRateSettings(),
    getDashboardStats(),
  ]);

  const companyRaw = map.company ?? {};
  const emailsRaw = map.emails ?? {};

  const company: CompanyInfoValue = {
    company_name: String(
      companyRaw.company_name ?? "Helping Hands Agency",
    ),
    address: String(companyRaw.address ?? "Wandelpad 30"),
    postal_code: String(companyRaw.postal_code ?? "1211 GN"),
    city: String(companyRaw.city ?? "Hilversum"),
    phone: String(companyRaw.phone ?? "06 5741 6338"),
    website: String(
      companyRaw.website ?? "https://helpinghandsagency.nl",
    ),
  };

  const emails: EmailSettingsValue = {
    planning: String(
      emailsRaw.planning ?? "planning@helpinghandsagency.nl",
    ),
    aanmeldingen: String(
      emailsRaw.aanmeldingen ?? "aanmeldingen@helpinghandsagency.nl",
    ),
    info: String(emailsRaw.info ?? "info@helpinghandsagency.nl"),
  };

  return (
    <SettingsMvpClient
      company={company}
      emails={emails}
      rates={rates.km_rate ? rates : DEFAULT_RATE_SETTINGS}
      tablesReady={stats.tablesReady}
    />
  );
}
