"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatPhone } from "@/lib/utils/format";
import type { Lead } from "@/lib/data/demo-data";

export function ProspectsTable({ prospects: initialProspects }: { prospects: Lead[] }) {
  const [prospects, setProspects] = useState(initialProspects);
  const [converting, setConverting] = useState<string | null>(null);

  async function handleConvert(id: string) {
    setConverting(id);
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "convert" }),
      });

      if (res.ok) {
        setProspects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
      // Silently fail — button re-enables
    } finally {
      setConverting(null);
    }
  }

  if (prospects.length === 0) return null;

  return (
    <Card id="prospects">
      <CardHeader>
        <CardTitle>Clients to Reach Out To</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                <th className="pb-3 pr-4">Business</th>
                <th className="pb-3 pr-4">City</th>
                <th className="pb-3 pr-4">Phone</th>
                <th className="pb-3 pr-4">Score</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {prospects.map((prospect) => {
                const meta = prospect.metadata as Record<string, unknown> | null;
                const website = meta?.website_url as string | undefined;

                return (
                  <tr key={prospect.id} className="hover:bg-slate-50">
                    <td className="py-3 pr-4">
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
                    <td className="py-3 pr-4 text-slate-600">{prospect.city}</td>
                    <td className="py-3 pr-4 text-slate-600">{formatPhone(prospect.phone)}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={prospect.quality_score && prospect.quality_score >= 7 ? "success" : "default"}>
                        {prospect.quality_score ?? "—"}/10
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={converting === prospect.id}
                        onClick={() => handleConvert(prospect.id)}
                      >
                        {converting === prospect.id ? "Converting..." : "Convert to Lead"}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
