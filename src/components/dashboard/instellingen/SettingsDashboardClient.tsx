"use client";

import { useCallback, useMemo, useState } from "react";
import { RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import CompanySettingsPanel from "@/components/dashboard/instellingen/CompanySettings";
import EmailSettingsPanel from "@/components/dashboard/instellingen/EmailSettings";
import IntegrationSettingsPanel from "@/components/dashboard/instellingen/IntegrationSettings";
import InvoiceSettingsPanel from "@/components/dashboard/instellingen/InvoiceSettings";
import NotificationSettingsPanel from "@/components/dashboard/instellingen/NotificationSettings";
import RateSettingsPanel from "@/components/dashboard/instellingen/RateSettings";
import SecuritySettingsPanel from "@/components/dashboard/instellingen/SecuritySettings";
import SettingsSaveBar from "@/components/dashboard/instellingen/SettingsSaveBar";
import SettingsTabs from "@/components/dashboard/instellingen/SettingsTabs";
import TemplateSettingsPanel from "@/components/dashboard/instellingen/TemplateSettings";
import TravelSettingsPanel from "@/components/dashboard/instellingen/TravelSettings";
import UserRoleSettingsPanel from "@/components/dashboard/instellingen/UserRoleSettings";
import {
  cloneSettings,
  defaultSettings,
  settingsAreEqual,
  type AppSettings,
  type SettingsTabId,
} from "@/lib/settings";

export default function SettingsDashboardClient() {
  const [savedSettings, setSavedSettings] = useState<AppSettings>(() =>
    cloneSettings(defaultSettings),
  );
  const [draftSettings, setDraftSettings] = useState<AppSettings>(() =>
    cloneSettings(defaultSettings),
  );
  const [activeTab, setActiveTab] = useState<SettingsTabId>("company");
  const [toast, setToast] = useState<string | null>(null);

  const isDirty = useMemo(
    () => !settingsAreEqual(savedSettings, draftSettings),
    [savedSettings, draftSettings],
  );

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4500);
  }, []);

  const handleSave = useCallback(() => {
    setSavedSettings(cloneSettings(draftSettings));
    showToast(
      "Instellingen lokaal opgeslagen. Koppel dit later aan Supabase.",
    );
  }, [draftSettings, showToast]);

  const handleCancel = useCallback(() => {
    setDraftSettings(cloneSettings(savedSettings));
  }, [savedSettings]);

  const handleReset = useCallback(() => {
    const reset = cloneSettings(defaultSettings);
    setDraftSettings(reset);
    setSavedSettings(reset);
    showToast("Demo-instellingen gereset.");
  }, [showToast]);

  function updateDraft(patch: Partial<AppSettings>) {
    setDraftSettings((prev) => ({ ...prev, ...patch }));
  }

  function renderTabContent() {
    switch (activeTab) {
      case "company":
        return (
          <CompanySettingsPanel
            settings={draftSettings.company}
            onChange={(company) => updateDraft({ company })}
          />
        );
      case "email":
        return (
          <EmailSettingsPanel
            settings={draftSettings.email}
            onChange={(email) => updateDraft({ email })}
          />
        );
      case "rates":
        return (
          <RateSettingsPanel
            settings={draftSettings.rates}
            onChange={(rates) => updateDraft({ rates })}
            onSave={handleSave}
          />
        );
      case "travel":
        return (
          <TravelSettingsPanel
            settings={draftSettings.travel}
            onChange={(travel) => updateDraft({ travel })}
          />
        );
      case "invoice":
        return (
          <InvoiceSettingsPanel
            settings={draftSettings.invoice}
            onChange={(invoice) => updateDraft({ invoice })}
          />
        );
      case "integrations":
        return <IntegrationSettingsPanel />;
      case "notifications":
        return (
          <NotificationSettingsPanel
            settings={draftSettings.notifications}
            onChange={(notifications) => updateDraft({ notifications })}
          />
        );
      case "roles":
        return (
          <UserRoleSettingsPanel
            roles={draftSettings.roles}
            onChange={(roles) => updateDraft({ roles })}
          />
        );
      case "templates":
        return (
          <TemplateSettingsPanel
            templates={draftSettings.templates}
            onChange={(templates) => updateDraft({ templates })}
          />
        );
      case "security":
        return <SecuritySettingsPanel />;
      default:
        return null;
    }
  }

  return (
    <div className={`space-y-6 ${isDirty ? "pb-24" : ""}`}>
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 max-w-sm rounded-xl border border-[#173A8A]/20 bg-[#0B1F4D] px-4 py-3 text-sm font-medium text-white shadow-lg"
          role="status"
        >
          {toast}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#101828]/60">
          Beheer instellingen voor Helping Hands Agency (demo state).
        </p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
            Reset demo instellingen
          </Button>
          <Button type="button" size="sm" onClick={handleSave} disabled={!isDirty}>
            <Save className="h-4 w-4" />
            Wijzigingen opslaan
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-3">
          <SettingsTabs activeTab={activeTab} onChange={setActiveTab} />
        </aside>
        <main>{renderTabContent()}</main>
      </div>

      <SettingsSaveBar
        visible={isDirty}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}
