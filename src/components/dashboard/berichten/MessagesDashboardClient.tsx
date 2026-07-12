"use client";

import { useCallback, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CommunicationActionList from "@/components/dashboard/berichten/CommunicationActionList";
import MessageComposer from "@/components/dashboard/berichten/MessageComposer";
import MessageDetailDrawer from "@/components/dashboard/berichten/MessageDetailDrawer";
import MessageExportPanel from "@/components/dashboard/berichten/MessageExportPanel";
import MessageFiltersBar from "@/components/dashboard/berichten/MessageFilters";
import MessageInboxTable, {
  type MessageTableAction,
} from "@/components/dashboard/berichten/MessageInboxTable";
import MessageStatsCards from "@/components/dashboard/berichten/MessageStats";
import MessageTemplatePanel from "@/components/dashboard/berichten/MessageTemplatePanel";
import {
  buildCommunicationActions,
  computeMessageStats,
  defaultMessageFilters,
  demoMessageTemplates,
  demoMessages,
  downloadMessagesCsv,
  duplicateMessage,
  exportMessagesCsv,
  filterByTab,
  filterMessages,
  messageToFormData,
  type MessageFilters,
  type MessageItem,
  type MessageStatus,
  type MessageTemplate,
} from "@/lib/messages";

type TabId = "inbox" | "concepts" | "templates" | "followup";

const TABS: { id: TabId; label: string }[] = [
  { id: "inbox", label: "Inbox / overzicht" },
  { id: "concepts", label: "Concepten" },
  { id: "templates", label: "Templates" },
  { id: "followup", label: "Opvolging" },
];

export default function MessagesDashboardClient() {
  const [messages, setMessages] = useState<MessageItem[]>(demoMessages);
  const [filters, setFilters] = useState<MessageFilters>(defaultMessageFilters);
  const [activeTab, setActiveTab] = useState<TabId>("inbox");
  const [detailMessage, setDetailMessage] = useState<MessageItem | null>(null);
  const [editMessage, setEditMessage] = useState<MessageItem | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<MessageTemplate | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const byTab = filterByTab(messages, activeTab);
    return filterMessages(byTab, filters);
  }, [messages, filters, activeTab]);

  const stats = useMemo(() => computeMessageStats(messages), [messages]);
  const actions = useMemo(() => buildCommunicationActions(messages), [messages]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4500);
  }, []);

  const updateStatus = useCallback(
    (item: MessageItem, status: MessageStatus) => {
      const now = new Date().toISOString();
      setMessages((prev) =>
        prev.map((m) =>
          m.id === item.id
            ? {
                ...m,
                status,
                sentAt: status === "Verzonden" ? now : m.sentAt,
                lastReplyAt: status === "Beantwoord" ? now : m.lastReplyAt,
              }
            : m,
        ),
      );
      setDetailMessage((prev) =>
        prev?.id === item.id
          ? {
              ...prev,
              status,
              sentAt: status === "Verzonden" ? now : prev.sentAt,
              lastReplyAt: status === "Beantwoord" ? now : prev.lastReplyAt,
            }
          : prev,
      );
      showToast(`Status gewijzigd naar "${status}" (demo).`);
    },
    [showToast],
  );

  const handleSave = useCallback(
    (message: MessageItem) => {
      if (editMessage) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === editMessage.id
              ? { ...message, id: editMessage.id, createdAt: editMessage.createdAt }
              : m,
          ),
        );
        setEditMessage(null);
        showToast("Bericht bijgewerkt (demo).");
      } else {
        setMessages((prev) => [message, ...prev]);
        showToast("Bericht opgeslagen als concept (demo).");
      }
    },
    [editMessage, showToast],
  );

  const handleTableAction = useCallback(
    (type: MessageTableAction, item: MessageItem) => {
      switch (type) {
        case "view":
          setDetailMessage(item);
          break;
        case "edit":
          setEditMessage(item);
          setComposerOpen(true);
          break;
        case "duplicate": {
          const copy = duplicateMessage(item);
          setMessages((prev) => [copy, ...prev]);
          showToast("Bericht gedupliceerd (demo).");
          break;
        }
        case "answered":
          updateStatus(item, "Beantwoord");
          break;
        case "waiting":
          updateStatus(item, "Wacht op reactie");
          break;
        case "delete":
          setMessages((prev) => prev.filter((m) => m.id !== item.id));
          if (detailMessage?.id === item.id) setDetailMessage(null);
          showToast("Bericht verwijderd (demo).");
          break;
      }
    },
    [detailMessage?.id, showToast, updateStatus],
  );

  const [templateForComposer, setTemplateForComposer] = useState<MessageTemplate | null>(null);

  const composerInitialData = useMemo(() => {
    if (editMessage) return messageToFormData(editMessage);
    if (templateForComposer) {
      return {
        channel: templateForComposer.channel,
        audience: templateForComposer.audience,
        subject: templateForComposer.subject,
        body: templateForComposer.body,
      };
    }
    return undefined;
  }, [editMessage, templateForComposer]);

  const handleWeekOverview = useCallback(() => {
    const weekMessages = messages.filter(
      (m) => m.sentAt || m.scheduledAt || m.status === "Klaar om te versturen",
    );
    const csv = exportMessagesCsv(weekMessages);
    downloadMessagesCsv(csv, "berichten-weekoverzicht.csv");
    showToast("Weekoverzicht geëxporteerd (demo CSV).");
  }, [messages, showToast]);

  return (
    <div className="space-y-6">
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
          {filtered.length} van {messages.length} berichten
        </p>
        <Button
          type="button"
          size="sm"
          onClick={() => {
            setEditMessage(null);
            setTemplateForComposer(null);
            setComposerOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Nieuw bericht
        </Button>
      </div>

      <MessageStatsCards stats={stats} />

      <MessageFiltersBar filters={filters} onChange={setFilters} />

      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <Button
            key={tab.id}
            type="button"
            size="sm"
            variant={activeTab === tab.id ? "default" : "outline"}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {activeTab === "templates" ? (
        <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
          <CardHeader>
            <CardTitle className="text-lg font-black text-[#0B1F4D]">
              Berichttemplates
            </CardTitle>
            <CardDescription>
              Standaard templates voor crew oproepen, briefings, opdrachtgevers en opvolging.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MessageTemplatePanel
              templates={demoMessageTemplates}
              onUse={(tpl) => {
                setEditMessage(null);
                setTemplateForComposer(tpl);
                setComposerOpen(true);
              }}
              onPreview={setPreviewTemplate}
            />
          </CardContent>
        </Card>
      ) : activeTab === "followup" ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <CommunicationActionList actions={actions} />
          <MessageExportPanel
            messages={messages}
            onWeekOverview={handleWeekOverview}
            onExport={() => showToast("CSV geëxporteerd (demo).")}
          />
        </div>
      ) : (
        <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-black text-[#0B1F4D]">
              {activeTab === "concepts" ? "Concepten" : "Berichten inbox"}
            </CardTitle>
            <CardDescription>
              Overzicht van communicatie met crew, opdrachtgevers en interne planning.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MessageInboxTable messages={filtered} onAction={handleTableAction} />
          </CardContent>
        </Card>
      )}

      {activeTab !== "followup" && (
        <MessageExportPanel
          messages={filtered}
          onWeekOverview={handleWeekOverview}
          onExport={() => showToast("CSV geëxporteerd (demo).")}
        />
      )}

      <MessageDetailDrawer
        message={detailMessage}
        open={detailMessage !== null}
        onOpenChange={(open) => {
          if (!open) setDetailMessage(null);
        }}
        onEdit={(msg) => {
          setDetailMessage(null);
          setEditMessage(msg);
          setTemplateForComposer(null);
          setComposerOpen(true);
        }}
        onDuplicate={(msg) => {
          const copy = duplicateMessage(msg);
          setMessages((prev) => [copy, ...prev]);
          showToast("Bericht gedupliceerd (demo).");
        }}
        onStatusChange={updateStatus}
      />

      <MessageComposer
        open={composerOpen}
        onOpenChange={(open) => {
          setComposerOpen(open);
          if (!open) {
            setEditMessage(null);
            setTemplateForComposer(null);
          }
        }}
        onSave={handleSave}
        onSendAttempt={() =>
          showToast(
            "Echt verzenden wordt later gekoppeld aan Gmail, WhatsApp Business of HubSpot.",
          )
        }
        initialData={composerInitialData}
        existingId={editMessage?.id}
        existingCreatedAt={editMessage?.createdAt}
        mode={editMessage ? "edit" : "create"}
      />

      {previewTemplate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setPreviewTemplate(null)}
          role="presentation"
        >
          <div
            className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <h3 className="text-lg font-bold text-[#0B1F4D]">{previewTemplate.title}</h3>
            <p className="mt-1 text-sm text-[#101828]/60">{previewTemplate.category}</p>
            <p className="mt-4 font-medium text-[#0B1F4D]">{previewTemplate.subject}</p>
            <pre className="mt-3 whitespace-pre-wrap rounded-xl border border-slate-200/80 bg-[#F5F7FA]/60 p-4 text-sm">
              {previewTemplate.body}
            </pre>
            <Button
              type="button"
              className="mt-4"
              variant="outline"
              onClick={() => setPreviewTemplate(null)}
            >
              Sluiten
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
