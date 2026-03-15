import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/format";
import type { ContentPiece } from "@/lib/data/demo-data";

export function ContentCard({ content }: { content: ContentPiece }) {
  return (
    <Link
      href={`/blog/${content.slug}`}
      className="group block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5"
    >
      <div className="mb-3 flex items-center gap-2">
        <Badge variant="info">{content.type}</Badge>
        {(content.tags ?? []).slice(0, 2).map((tag) => (
          <Badge key={tag} variant="default">
            {tag}
          </Badge>
        ))}
      </div>
      <h3 className="text-lg font-bold text-slate-900 transition group-hover:text-accent">
        {content.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
        {content.excerpt || content.body?.slice(0, 160) || ""}
      </p>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>{content.author || "GEOPlusMarketing"}</span>
        {content.published_at && <span>{formatDate(content.published_at)}</span>}
      </div>
    </Link>
  );
}
