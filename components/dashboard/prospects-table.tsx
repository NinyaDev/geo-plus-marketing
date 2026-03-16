"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "./status-badge";
import { formatPhone } from "@/lib/utils/format";
import type { Lead } from "@/lib/data/demo-data";

interface ProspectsTableProps {
  prospects: Lead[];
  onStatusChange: (id: string, newStatus: Lead["status"]) => void;
}

export function ProspectsTable({ prospects, onStatusChange }: ProspectsTableProps) {
  if (prospects.length === 0) return null;

  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold text-slate-900">Clients to Reach Out To</h2>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
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
                    <tr key={prospect.id} className="transition hover:bg-slate-50/50">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
