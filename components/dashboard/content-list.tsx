import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/format";
import type { ContentPiece } from "@/lib/data/demo-data";

const statusVariant: Record<string, "default" | "success" | "warning" | "info"> = {
  published: "success",
  draft: "warning",
  scheduled: "info",
};

export function ContentList({ content }: { content: ContentPiece[] }) {
  return (
    <Card id="content">
      <CardHeader>
        <CardTitle>Content</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {content.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-slate-100 p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-slate-900">
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {item.type} &middot;{" "}
                  {item.published_at
                    ? formatDate(item.published_at)
                    : "Not published"}
                </p>
              </div>
              <Badge
                variant={statusVariant[item.status] ?? "default"}
                className="ml-3 shrink-0"
              >
                {item.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
