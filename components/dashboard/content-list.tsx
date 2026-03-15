"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/format";
import type { ContentPiece } from "@/lib/data/demo-data";

const statusVariant: Record<string, "default" | "success" | "warning" | "info"> = {
  published: "success",
  draft: "warning",
  scheduled: "info",
};

export function ContentList({ content: initialContent }: { content: ContentPiece[] }) {
  const [content, setContent] = useState(initialContent);
  const [publishing, setPublishing] = useState<string | null>(null);

  async function handlePublish(id: string) {
    setPublishing(id);
    try {
      const res = await fetch("/api/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "published" }),
      });

      if (res.ok) {
        const { content: updated } = await res.json();
        setContent((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, status: updated.status ?? "published", published_at: updated.published_at ?? new Date().toISOString() }
              : item
          )
        );
      }
    } catch {
      // Silently fail — button will re-enable
    } finally {
      setPublishing(null);
    }
  }

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
              <div className="ml-3 flex shrink-0 items-center gap-2">
                {item.status === "draft" && (
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={publishing === item.id}
                    onClick={() => handlePublish(item.id)}
                  >
                    {publishing === item.id ? "Publishing..." : "Publish"}
                  </Button>
                )}
                <Badge
                  variant={statusVariant[item.status] ?? "default"}
                >
                  {item.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
