"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LeadsTable } from "./leads-table";
import { ProspectsTable } from "./prospects-table";
import type { Lead } from "@/lib/data/demo-data";

interface DashboardClientProps {
  leads: Lead[];
  prospects: Lead[];
}

export function DashboardClient({ leads: initialLeads, prospects: initialProspects }: DashboardClientProps) {
  const router = useRouter();
  const [leads, setLeads] = useState(initialLeads);
  const [prospects, setProspects] = useState(initialProspects);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  async function handleStatusChange(id: string, newStatus: Lead["status"]) {
    // Find the item in either list
    const item = leads.find((l) => l.id === id) || prospects.find((p) => p.id === id);
    if (!item) return;

    const updated = { ...item, status: newStatus };

    // Remove from current list
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setProspects((prev) => prev.filter((p) => p.id !== id));

    // Add to correct list
    if (newStatus === "lead") {
      setLeads((prev) => [updated, ...prev]);
    } else {
      setProspects((prev) => [updated, ...prev]);
    }

    // Persist to API
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!res.ok) {
        console.error("Failed to update status:", await res.text());
        // Revert on error
        router.refresh();
      }
    } catch (err) {
      console.error("Status update error:", err);
      router.refresh();
    }
  }

  async function handleBulkGhlSync() {
    setSyncing(true);
    setSyncResult(null);

    try {
      const res = await fetch("/api/leads", { method: "PUT" });
      const data = await res.json();

      if (res.ok) {
        setSyncResult(
          data.synced > 0
            ? `Synced ${data.synced}/${data.total} leads to GHL`
            : data.message || "No leads to sync"
        );
      } else {
        setSyncResult(`Error: ${data.error}`);
      }
    } catch {
      setSyncResult("Sync failed — check GHL configuration");
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncResult(null), 5000);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Recent Leads</h2>
        <div className="flex items-center gap-3">
          {syncResult && (
            <span className="text-sm text-slate-500">{syncResult}</span>
          )}
          <button
            onClick={handleBulkGhlSync}
            disabled={syncing}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50"
          >
            {syncing ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
                Syncing...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                GHL Sync
              </>
            )}
          </button>
        </div>
      </div>

      <LeadsTable leads={leads} onStatusChange={handleStatusChange} />
      <ProspectsTable prospects={prospects} onStatusChange={handleStatusChange} />
    </div>
  );
}
