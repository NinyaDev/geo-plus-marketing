import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import { getContentBySlug, getContent } from "@/lib/data";
import { formatDate } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = await getContentBySlug(slug);
  if (!content) return { title: "Not Found" };
  return {
    title: `${content.title} | GEOPlusMarketing`,
    description: content.excerpt,
  };
}

export async function generateStaticParams() {
  const content = await getContent({ status: "published" });
  return content.map((c) => ({ slug: c.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = await getContentBySlug(slug);

  if (!content) notFound();

  return (
    <section className="bg-white pt-32 pb-24 md:pt-40 md:pb-32">
      <article className="mx-auto max-w-3xl px-6">
        <Link
          href="/blog"
          className="mb-6 inline-flex items-center text-sm text-muted transition hover:text-accent"
        >
          &larr; Back to Blog
        </Link>

        <div className="mb-4 flex items-center gap-2">
          <Badge variant="info">{content.type}</Badge>
          {content.tags.map((tag) => (
            <Badge key={tag} variant="default">
              {tag}
            </Badge>
          ))}
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {content.title}
        </h1>

        <div className="mt-3 flex items-center gap-4 text-sm text-muted">
          <span>{content.author}</span>
          {content.published_at && (
            <>
              <span>&middot;</span>
              <span>{formatDate(content.published_at)}</span>
            </>
          )}
        </div>

        <div className="prose prose-slate mt-10 max-w-none prose-headings:font-extrabold prose-headings:tracking-tight prose-a:text-accent prose-a:no-underline hover:prose-a:underline">
          <Markdown>{content.body}</Markdown>
        </div>
      </article>
    </section>
  );
}
