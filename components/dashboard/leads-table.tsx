import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDate, formatPhone } from "@/lib/utils/format";
import type { Lead } from "@/lib/data/demo-data";

const statusVariant: Record<string, "default" | "success" | "warning" | "error" | "info"> = {
  new: "info",
  contacted: "warning",
  qualified: "default",
  converted: "success",
  lost: "error",
};

export function LeadsTable({ leads }: { leads: Lead[] }) {
  return (
    <Card id="leads">
      <CardHeader>
        <CardTitle>Recent Leads</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 pr-4">Service</th>
                <th className="pb-3 pr-4">City</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Phone</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50">
                  <td className="py-3 pr-4">
                    <div>
                      <p className="font-medium text-slate-900">{lead.name}</p>
                      <p className="text-xs text-slate-500">{lead.email}</p>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-slate-600">{lead.service_requested}</td>
                  <td className="py-3 pr-4 text-slate-600">{lead.city}</td>
                  <td className="py-3 pr-4">
                    <Badge variant={statusVariant[lead.status] ?? "default"}>
                      {lead.status}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4 text-slate-600">{formatPhone(lead.phone)}</td>
                  <td className="py-3 text-slate-500">{formatDate(lead.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
