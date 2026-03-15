import { Suspense } from "react";
import { getContent } from "@/lib/data";
import { ContentCard } from "@/components/blog/content-card";
import { ContentFilter } from "@/components/blog/content-filter";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog | GEOPlusMarketing",
  description:
    "Expert tips and insights on local SEO, marketing automation, and growing your service business.",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const type = params.type;
  const content = await getContent({
    type: type || undefined,
    status: "published",
  });

  return (
    <section className="bg-surface pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-accent">
            Blog &amp; Resources
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Marketing Insights for Local Businesses
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Actionable tips, guides, and strategies to help your business grow
            online.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <Suspense>
            <ContentFilter />
          </Suspense>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.map((item) => (
            <ContentCard key={item.id} content={item} />
          ))}
          {content.length === 0 && (
            <p className="col-span-full text-center text-muted">
              No content found for this filter.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
