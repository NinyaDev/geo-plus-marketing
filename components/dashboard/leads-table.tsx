"use client";

import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "./status-badge";
import { formatDate, formatPhone } from "@/lib/utils/format";
import type { Lead } from "@/lib/data/demo-data";

interface LeadsTableProps {
  leads: Lead[];
  onStatusChange: (id: string, newStatus: Lead["status"]) => void;
}

export function LeadsTable({ leads, onStatusChange }: LeadsTableProps) {
  if (leads.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-sm text-slate-400">No leads yet. Leads from the contact form and bot will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Service</th>
                <th className="px-5 py-3">City</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead) => (
                <tr key={lead.id} className="transition hover:bg-slate-50/50">
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
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
