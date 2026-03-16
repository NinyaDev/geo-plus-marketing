"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StatCard } from "@/components/ui/stat-card";
import { LeadsTable } from "./leads-table";
import { ProspectsTable } from "./prospects-table";
import type { Lead } from "@/lib/data/demo-data";
import type { DashboardStats } from "@/lib/data/demo-data";

function LeadsIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function ProspectsIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function ContentIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
  );
}

interface DashboardClientProps {
  leads: Lead[];
  prospects: Lead[];
  stats: DashboardStats;
}

export function DashboardClient({ leads: initialLeads, prospects: initialProspects, stats }: DashboardClientProps) {
  const router = useRouter();
  const [leads, setLeads] = useState(initialLeads);
  const [prospects, setProspects] = useState(initialProspects);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  // Derive live counts from state
  const leadCount = leads.length;
  const prospectCount = prospects.length;

  async function handleStatusChange(id: string, newStatus: Lead["status"]) {
    const item = leads.find((l) => l.id === id) || prospects.find((p) => p.id === id);
    if (!item) return;

    const updated = { ...item, status: newStatus };

    setLeads((prev) => prev.filter((l) => l.id !== id));
    setProspects((prev) => prev.filter((p) => p.id !== id));

    if (newStatus === "lead") {
      setLeads((prev) => [updated, ...prev]);
    } else {
      setProspects((prev) => [updated, ...prev]);
    }

    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!res.ok) {
        console.error("Failed to update status:", await res.text());
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
        if (data.synced > 0) {
          setSyncResult(`Synced ${data.synced}/${data.total} to GHL`);
        } else if (data.errors?.length) {
          setSyncResult(`Sync failed: ${data.errors[0]}`);
        } else {
          setSyncResult(data.message || "No records to sync");
        }
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
    <div className="space-y-8">
      {/* Live stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Leads"
          value={leadCount}
          accentColor="green"
          icon={<LeadsIcon />}
        />
        <StatCard
          label="Prospects"
          value={prospectCount}
          accentColor="blue"
          icon={<ProspectsIcon />}
        />
        <StatCard
          label="Published Content"
          value={`${stats.published_content}/${stats.total_content}`}
          accentColor="purple"
          icon={<ContentIcon />}
        />
      </div>

      {/* Leads */}
      <div>
        <div className="mb-3 flex items-center justify-between">
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
      </div>

      {/* Prospects */}
      <ProspectsTable prospects={prospects} onStatusChange={handleStatusChange} />
    </div>
  );
}
