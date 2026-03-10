import Link from "next/link";

interface LandingTemplateProps {
  city: string;
  service: string;
  displayCity: string;
  displayService: string;
}

const faqs = [
  {
    q: "What is AI Search Visibility?",
    a: "AI Search Visibility is how well your brand appears when people ask AI engines like ChatGPT, Perplexity, Google Gemini, and Grok about your type of service. If AI can't find you, you're losing customers to competitors who are visible.",
  },
  {
    q: "How is this different from SEO?",
    a: "SEO gets you ranked on Google Search results. GEO (Generative Engine Optimization) gets you cited and recommended by AI engines. Both matter — but more and more customers are using AI instead of traditional search. We add the GEO layer to your existing marketing.",
  },
  {
    q: "How long until I see results?",
    a: "Many clients see measurable improvements in AI visibility within 2-4 weeks after implementing structured data and citation fixes. Full optimization with content and authority building typically shows strong results within 60-90 days.",
  },
  {
    q: "Do I need to stop doing SEO?",
    a: "Absolutely not. GEO works alongside your existing SEO strategy. Think of it as an additional layer of visibility — we make sure you're found by both traditional search AND AI engines.",
  },
];

export function LandingTemplate({
  city,
  service,
  displayCity,
  displayService,
}: LandingTemplateProps) {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-surface-dark pt-32 pb-20 md:pt-44 md:pb-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-accent/15 blur-[120px]"
        />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <p className="mb-4 inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-300">
            {displayCity} &middot; AI Search Visibility
          </p>
          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl">
            Is Your{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              {displayService}
            </span>{" "}
            Business Visible to AI in {displayCity}?
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
            When someone asks ChatGPT or Perplexity &ldquo;best {displayService.toLowerCase()} in {displayCity}&rdquo;,
            does your business come up? If not, your competitors are getting
            those customers instead.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="inline-flex h-14 items-center rounded-xl bg-accent px-8 text-base font-bold text-white shadow-lg shadow-accent/30 transition hover:bg-accent-dark"
            >
              Get Your Free AI Visibility Scan
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex h-14 items-center rounded-xl border border-slate-700 px-8 text-base font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            The AI Search Problem for {displayService} in {displayCity}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-muted">
            80% of searchers now use AI-generated summaries. If your {displayService.toLowerCase()} business
            isn&apos;t optimized for AI engines, you&apos;re invisible to a growing
            majority of potential customers.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "AI Visibility Scan & Scoring",
              "Schema & Structured Data Setup",
              "Content Optimized for AI Citation",
              "Citation Consistency Audit",
              "Ongoing AI Monitoring",
              "Competitor AI Visibility Tracking",
            ].map((s) => (
              <div
                key={s}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-accent">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900">{s}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-surface py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            How We Make {displayCity} Businesses AI-Visible
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { stat: "5+", label: "AI Engines Scanned" },
              { stat: "24hr", label: "Scan Turnaround" },
              { stat: "80%", label: "Clients See Results in 60 Days" },
              { stat: "3x", label: "Avg. AI Mention Increase" },
            ].map(({ stat, label }) => (
              <div key={label} className="text-center">
                <p className="text-4xl font-extrabold text-accent">{stat}</p>
                <p className="mt-1 text-sm text-muted">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-10 space-y-4">
            {faqs.map(({ q, a }) => (
              <details
                key={q}
                className="group rounded-2xl border border-slate-200 bg-white"
              >
                <summary className="flex cursor-pointer items-center justify-between p-5 font-medium text-slate-900">
                  {q}
                  <span className="ml-2 text-slate-400 transition group-open:rotate-180">
                    ▾
                  </span>
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-muted">
                  {a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-surface-dark py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Find Out If AI Can Find Your {displayService} Business in {displayCity}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
            Get a free AI visibility scan. No obligation, no pressure &mdash; just a
            clear picture of how ChatGPT, Perplexity, and Google AI see your brand.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex h-14 items-center rounded-xl bg-accent px-10 text-base font-bold text-white shadow-lg shadow-accent/30 transition hover:bg-accent-dark"
          >
            Get Your Free Scan
          </Link>
        </div>
      </section>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: `GEOPlusMarketing — AI Search Visibility for ${displayService} in ${displayCity}`,
            description: `AI Search Visibility and Generative Engine Optimization for ${displayService.toLowerCase()} businesses in ${displayCity}. Get found by ChatGPT, Perplexity, Google AI, and more.`,
            areaServed: {
              "@type": "City",
              name: displayCity,
            },
            serviceType: "Generative Engine Optimization",
            telephone: "+1-305-555-1234",
            url: `https://geoplusmarketing.com/landing/${city}/${service}`,
          }),
        }}
      />
    </>
  );
}
