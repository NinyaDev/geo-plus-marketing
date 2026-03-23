"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "./status-badge";
import { formatDate, formatPhone } from "@/lib/utils/format";
import type { Lead } from "@/lib/data/demo-data";

interface LeadsTableProps {
  leads: Lead[];
  onStatusChange: (id: string, newStatus: Lead["status"]) => void;
  onNotesChange: (id: string, notes: string) => void;
}

export function LeadsTable({ leads, onStatusChange, onNotesChange }: LeadsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);

  if (leads.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-sm text-slate-400">No leads yet. Leads from the contact form and bot will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  function toggleRow(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
    setEditingId(null);
  }

  function startEditing(lead: Lead) {
    setEditingId(lead.id);
    setDraft(lead.notes || "");
  }

  async function saveNotes(id: string) {
    setSaving(true);
    onNotesChange(id, draft);
    setEditingId(null);
    setSaving(false);
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                <th className="w-8 px-2 py-3" />
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Service</th>
                <th className="px-5 py-3">City</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead) => {
                const isExpanded = expandedId === lead.id;
                const isEditing = editingId === lead.id;

                return (
                  <tr key={lead.id} className="group">
                    {/* Main row cells wrapped in a sub-table-like structure isn't great,
                        so we use two <tr> elements sharing the same key prefix */}
                    <td
                      className="w-8 cursor-pointer px-2 py-3.5 text-center text-slate-400 transition hover:text-slate-700"
                      onClick={() => toggleRow(lead.id)}
                    >
                      <svg
                        className={`inline-block h-4 w-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </td>
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="font-medium text-slate-900">{lead.name}</p>
                        {lead.email && (
                          <p className="text-xs text-slate-400">{lead.email}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{lead.service_requested || "—"}</td>
                    <td className="px-5 py-3.5 text-slate-600">{lead.city || "—"}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge
                        id={lead.id}
                        status={lead.status}
                        onStatusChange={onStatusChange}
                      />
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{formatPhone(lead.phone)}</td>
                    <td className="px-5 py-3.5 text-slate-400">{formatDate(lead.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Expanded notes panel — rendered outside table for cleaner layout */}
          {leads.map((lead) => {
            const isExpanded = expandedId === lead.id;
            const isEditing = editingId === lead.id;
            if (!isExpanded) return null;

            return (
              <div
                key={`notes-${lead.id}`}
                className="border-t border-slate-100 bg-slate-50/50 px-6 py-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-slate-400">Notes</p>
                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          rows={3}
                          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                          placeholder="Add gatekeeper details, call notes, follow-up reminders..."
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveNotes(lead.id)}
                            disabled={saving}
                            className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white transition hover:bg-accent-dark disabled:opacity-50"
                          >
                            {saving ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => startEditing(lead)}
                        className="group/notes cursor-pointer"
                      >
                        {lead.notes ? (
                          <p className="whitespace-pre-wrap text-sm text-slate-700">{lead.notes}</p>
                        ) : (
                          <p className="text-sm italic text-slate-400">No notes yet — click to add</p>
                        )}
                        <p className="mt-1 text-xs text-slate-400 opacity-0 transition group-hover/notes:opacity-100">
                          Click to edit
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-3">
                    {lead.metadata && Object.keys(lead.metadata).length > 0 && (
                      <div>
                        <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-slate-400">Details</p>
                        <div className="space-y-1 text-xs text-slate-500">
                          {String((lead.metadata as Record<string, unknown>).business_name || "") && (
                            <p>Business: {String((lead.metadata as Record<string, unknown>).business_name)}</p>
                          )}
                          {lead.source && <p>Source: {lead.source}</p>}
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <a
                        href={`/leave-behind/lead-sheet/${lead.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Lead Sheet
                      </a>
                      <a
                        href={`/leave-behind/${lead.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white transition hover:bg-accent-dark"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Leave Behind
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
