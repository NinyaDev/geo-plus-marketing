"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "./status-badge";
import { formatPhone } from "@/lib/utils/format";
import type { Lead } from "@/lib/data/demo-data";

interface ProspectsTableProps {
  prospects: Lead[];
  onStatusChange: (id: string, newStatus: Lead["status"]) => void;
  onNotesChange: (id: string, notes: string) => void;
}

export function ProspectsTable({ prospects, onStatusChange, onNotesChange }: ProspectsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);

  if (prospects.length === 0) return null;

  function toggleRow(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
    setEditingId(null);
  }

  function startEditing(prospect: Lead) {
    setEditingId(prospect.id);
    setDraft(prospect.notes || "");
  }

  async function saveNotes(id: string) {
    setSaving(true);
    onNotesChange(id, draft);
    setEditingId(null);
    setSaving(false);
  }

  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold text-slate-900">Clients to Reach Out To</h2>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  <th className="w-8 px-2 py-3" />
                  <th className="px-5 py-3">Business</th>
                  <th className="px-5 py-3">City</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Score</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {prospects.map((prospect) => {
                  const meta = prospect.metadata as Record<string, unknown> | null;
                  const website = meta?.website_url as string | undefined;

                  return (
                    <tr key={prospect.id} className="group">
                      <td
                        className="w-8 cursor-pointer px-2 py-3.5 text-center text-slate-400 transition hover:text-slate-700"
                        onClick={() => toggleRow(prospect.id)}
                      >
                        <svg
                          className={`inline-block h-4 w-4 transition-transform ${expandedId === prospect.id ? "rotate-90" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </td>
                      <td className="px-5 py-3.5">
                        <div>
                          <p className="font-medium text-slate-900">{prospect.name}</p>
                          {website && website !== "unknown" && (
                            <a
                              href={website.startsWith("http") ? website : `https://${website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-accent hover:underline"
                            >
                              {website}
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{prospect.city || "—"}</td>
                      <td className="px-5 py-3.5 text-slate-600">{formatPhone(prospect.phone)}</td>
                      <td className="px-5 py-3.5">
                        <Badge variant={prospect.quality_score && prospect.quality_score >= 7 ? "success" : "default"}>
                          {prospect.quality_score ?? "—"}/10
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge
                          id={prospect.id}
                          status={prospect.status}
                          onStatusChange={onStatusChange}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Expanded notes panels */}
            {prospects.map((prospect) => {
              if (expandedId !== prospect.id) return null;
              const meta = prospect.metadata as Record<string, unknown> | null;
              const isEditing = editingId === prospect.id;

              return (
                <div
                  key={`notes-${prospect.id}`}
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
                              onClick={() => saveNotes(prospect.id)}
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
                          onClick={() => startEditing(prospect)}
                          className="group/notes cursor-pointer"
                        >
                          {prospect.notes ? (
                            <p className="whitespace-pre-wrap text-sm text-slate-700">{prospect.notes}</p>
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
                      {meta && (
                        <div>
                          <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-slate-400">Details</p>
                          <div className="space-y-1 text-xs text-slate-500">
                            {String(meta.weaknesses || "") && (
                              <p>Weaknesses: {String(meta.weaknesses)}</p>
                            )}
                            {String(meta.recommended_approach || "") && (
                              <p>Approach: {String(meta.recommended_approach)}</p>
                            )}
                            {prospect.email && <p>Email: {prospect.email}</p>}
                            {prospect.source && <p>Source: {prospect.source}</p>}
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <a
                          href={`/leave-behind/lead-sheet/${prospect.id}`}
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
                          href={`/leave-behind/${prospect.id}`}
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
    </div>
  );
}
