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
      {/* Urgency Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-center text-sm font-semibold text-white">
        {displayService} businesses in {displayCity} are already optimizing for AI search — don&apos;t get left behind
      </div>

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

          {/* Competitive urgency callout */}
          <div className="mx-auto mt-8 max-w-xl rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-3">
            <p className="text-sm font-medium text-amber-300">
              Other {displayService.toLowerCase()} businesses in {displayCity} are already being recommended by AI.
              Every day you wait, they build a stronger lead.
            </p>
          </div>

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

      {/* The Problem — with competitive framing */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Your {displayCity} Competitors Are Already Winning in AI Search
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-muted">
            80% of searchers now use AI-generated summaries. The {displayService.toLowerCase()} businesses
            that optimize first will lock in their advantage — once AI learns to recommend a competitor,
            displacing them gets harder every month.
          </p>

          {/* Competitive stats bar */}
          <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-center">
              <p className="text-2xl font-extrabold text-red-600">61%</p>
              <p className="mt-1 text-xs text-red-700/70">CTR drop when AI Overviews appear</p>
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-center">
              <p className="text-2xl font-extrabold text-amber-600">80%</p>
              <p className="mt-1 text-xs text-amber-700/70">of searchers use AI summaries</p>
            </div>
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-center">
              <p className="text-2xl font-extrabold text-blue-600">$750B</p>
              <p className="mt-1 text-xs text-blue-700/70">US revenue at risk from AI disruption</p>
            </div>
          </div>

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

      {/* Why GEO Now */}
      <section className="bg-surface-dark py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Why {displayService} Businesses Are Moving to GEO Now
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-slate-400">
            The shift is already happening in {displayCity}. Here&apos;s why the smartest businesses
            aren&apos;t waiting.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
              <h3 className="text-base font-bold text-white">First-Mover Advantage</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                AI engines build trust over time. The first {displayService.toLowerCase()} businesses in {displayCity} to
                optimize will be the ones AI recommends — and once established, they&apos;re
                extremely hard to displace.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
              <h3 className="text-base font-bold text-white">Organic Traffic Is Dying</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                58.5% of Google searches now end without a click. Your customers are getting
                answers from AI summaries. If you&apos;re not in those summaries, you might
                as well not exist.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
              <h3 className="text-base font-bold text-white">Your Competitors Are Moving</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Smart {displayService.toLowerCase()} businesses are already investing in GEO. Every week you wait,
                they build a stronger position in the AI engines your customers use daily.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
              <h3 className="text-base font-bold text-white">Higher Quality, Free Leads</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                AI-referred visitors have stronger intent and cost you nothing — no ad spend,
                no pay-per-click. Just compounding authority that delivers leads automatically.
              </p>
            </div>
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

      {/* CTA — with competitive urgency */}
      <section className="bg-surface-dark py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Your Competitors in {displayCity} Aren&apos;t Waiting
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
            AI search is a first-mover market. The {displayService.toLowerCase()} businesses that optimize
            now will be the ones AI recommends for years to come. Find out where you stand — free.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex h-14 items-center rounded-xl bg-accent px-10 text-base font-bold text-white shadow-lg shadow-accent/30 transition hover:bg-accent-dark"
          >
            Get Your Free Scan Before They Do
          </Link>
          <p className="mt-3 text-sm text-slate-500">
            Free scan &middot; No obligation &middot; Results in 24 hours
          </p>
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
