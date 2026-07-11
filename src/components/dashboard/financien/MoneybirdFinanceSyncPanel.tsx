"use client";

import { useEffect, useState } from "react";
import { ExternalLink, FileText, Loader2, RefreshCw, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SyncState = "unknown" | "not_configured" | "ready" | "error";

export default function MoneybirdFinanceSyncPanel() {
  const [state, setState] = useState<SyncState>("unknown");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [invoiceCount, setInvoiceCount] = useState<number | null>(null);

  useEffect(() => {
    void checkStatus();
  }, []);

  async function checkStatus() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/moneybird/status");
      const data = await res.json();
      if (data.configured) {
        setState("ready");
        setMessage(data.message ?? "Moneybird koppeling voorbereid.");
      } else {
        setState("not_configured");
        setMessage(data.message ?? "Moneybird niet geconfigureerd.");
      }
    } catch {
      setState("error");
      setMessage("Status controleren mislukt.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchInvoices() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/moneybird/sales-invoices");
      const data = await res.json();
      if (res.ok && data.ok) {
        setInvoiceCount(data.invoices?.length ?? 0);
        setMessage(`${data.invoices?.length ?? 0} facturen opgehaald.`);
        setState("ready");
      } else {
        setState("error");
        setMessage(data.error ?? "Facturen ophalen mislukt.");
      }
    } catch {
      setState("error");
      setMessage("Facturen ophalen mislukt.");
    } finally {
      setLoading(false);
    }
  }

  const badge = (() => {
    switch (state) {
      case "ready":
        return (
          <Badge className="border-green-200 bg-green-50 text-green-700 hover:bg-green-50">
            Koppeling voorbereid
          </Badge>
        );
      case "error":
        return (
          <Badge className="border-red-200 bg-red-50 text-red-700 hover:bg-red-50">
            Fout bij ophalen
          </Badge>
        );
      default:
        return (
          <Badge className="border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-100">
            Niet geconfigureerd
          </Badge>
        );
    }
  })();

  return (
    <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-lg font-black text-[#0B1F4D]">
              Moneybird koppeling
            </CardTitle>
            <CardDescription>
              Facturen, contacten en betaalstatussen kunnen via Moneybird worden
              gesynchroniseerd.
            </CardDescription>
          </div>
          {badge}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {message && (
          <p className="rounded-lg bg-[#F5F7FA]/80 px-3 py-2 text-xs text-[#101828]/70">
            {message}
          </p>
        )}
        {invoiceCount !== null && (
          <p className="text-xs text-[#101828]/65">
            Laatst opgehaald: {invoiceCount} facturen
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => void checkStatus()}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wifi className="h-4 w-4" />
            )}
            Koppeling controleren
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => void fetchInvoices()}
            disabled={loading}
          >
            <FileText className="h-4 w-4" />
            Facturen ophalen
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            render={
              <a
                href="https://moneybird.com"
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            <ExternalLink className="h-4 w-4" />
            Open Moneybird
          </Button>
          <Button type="button" size="sm" disabled className="opacity-60">
            <RefreshCw className="h-4 w-4" />
            Synchroniseren — Binnenkort
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
