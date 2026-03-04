import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/format";
import type { Campaign } from "@/lib/data/demo-data";

const statusVariant: Record<string, "default" | "success" | "warning" | "error" | "info"> = {
  active: "success",
  paused: "warning",
  completed: "default",
  draft: "info",
};

export function CampaignStatus({ campaigns }: { campaigns: Campaign[] }) {
  return (
    <Card id="campaigns">
      <CardHeader>
        <CardTitle>Campaigns</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {campaigns.map((campaign) => {
            const progress =
              campaign.budget > 0
                ? Math.round((campaign.spent / campaign.budget) * 100)
                : 0;
            return (
              <div
                key={campaign.id}
                className="rounded-xl border border-slate-100 p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{campaign.name}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {campaign.type.toUpperCase()} &middot;{" "}
                      {formatCurrency(campaign.spent)} / {formatCurrency(campaign.budget)}
                    </p>
                  </div>
                  <Badge variant={statusVariant[campaign.status] ?? "default"}>
                    {campaign.status}
                  </Badge>
                </div>
                {/* Budget progress bar */}
                <div className="mt-3">
                  <div className="h-2 w-full rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-accent transition-all"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="mt-2 flex gap-4 text-xs text-slate-500">
                  <span>{campaign.leads_generated} leads</span>
                  <span>{campaign.impressions.toLocaleString()} impressions</span>
                  <span>{campaign.clicks.toLocaleString()} clicks</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
