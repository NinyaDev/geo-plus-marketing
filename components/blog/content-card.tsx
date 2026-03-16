import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/format";
import type { ContentPiece } from "@/lib/data/demo-data";

/** Strip markdown syntax for plain-text preview */
function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, "")       // headers
    .replace(/\*\*([^*]+)\*\*/g, "$1")  // bold
    .replace(/\*([^*]+)\*/g, "$1")      // italic
    .replace(/__([^_]+)__/g, "$1")      // bold alt
    .replace(/_([^_]+)_/g, "$1")        // italic alt
    .replace(/`([^`]+)`/g, "$1")        // inline code
    .replace(/!\[.*?\]\(.*?\)/g, "")    // images
    .replace(/\[([^\]]+)\]\(.*?\)/g, "$1") // links
    .replace(/^[-*+]\s+/gm, "")        // list items
    .replace(/^\d+\.\s+/gm, "")        // numbered lists
    .replace(/^>\s+/gm, "")            // blockquotes
    .replace(/---+/g, "")              // hr
    .replace(/\n{2,}/g, " ")           // collapse newlines
    .trim();
}

export function ContentCard({ content }: { content: ContentPiece }) {
  const preview = stripMarkdown(
    content.excerpt || content.body?.slice(0, 300) || ""
  ).slice(0, 160);

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
        {preview}
      </p>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>{content.author || "GEOPlusMarketing"}</span>
        {content.published_at && <span>{formatDate(content.published_at)}</span>}
      </div>
    </Link>
  );
}
