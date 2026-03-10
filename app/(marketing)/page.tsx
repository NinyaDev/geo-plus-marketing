import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-surface-dark pt-32 pb-24 md:pt-44 md:pb-36">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-accent/15 blur-[120px]"
        />

        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <p className="mb-5 inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-300">
            AI Search Visibility Partner
          </p>
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            How Ready Is Your Brand for{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              AI&nbsp;Search?
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400 md:text-xl">
            80% of searchers now rely on AI-generated answers. If ChatGPT,
            Perplexity, and Google AI can&apos;t find your business, your
            competitors are stealing your customers&nbsp;&mdash;&nbsp;right now.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex h-14 items-center rounded-xl bg-accent px-8 text-base font-bold text-white shadow-lg shadow-accent/30 transition hover:bg-accent-dark hover:shadow-xl hover:shadow-accent/40"
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

          {/* Social proof bar */}
          <div className="mx-auto mt-16 flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-4 border-t border-slate-800 pt-8">
            {[
              ["61%", "Drop in Organic CTR with AI Overviews"],
              ["80%", "Of Searchers Use AI Summaries"],
              ["$750B", "US Revenue at Risk by 2028"],
            ].map(([stat, label]) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-extrabold text-white">{stat}</p>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Problem ── */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-accent">
              The Shift Is Happening Now
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Traditional SEO Alone Won&apos;t Save You
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              AI engines like ChatGPT, Google Gemini, Perplexity, and Grok are
              changing how people discover businesses. 58.5% of Google searches
              are now zero-click. Your customers are getting answers without ever
              visiting your website.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-red-100 bg-red-50/50 p-8 text-center">
              <p className="text-4xl font-extrabold text-red-600">58.5%</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                of Google searches now end without a click. Users get AI-generated
                answers directly.
              </p>
              <p className="mt-3 text-xs text-muted">Source: SparkToro / Datos</p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-8 text-center">
              <p className="text-4xl font-extrabold text-amber-600">61%</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                drop in organic click-through rates on queries with AI Overviews
                enabled.
              </p>
              <p className="mt-3 text-xs text-muted">Source: Seer Interactive</p>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-8 text-center">
              <p className="text-4xl font-extrabold text-accent">$750B</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                in US revenue at risk from AI-driven search disruption by 2028.
                Your market share is on the line.
              </p>
              <p className="mt-3 text-xs text-muted">Source: McKinsey</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="bg-surface py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-accent">
              What We Do
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Make Your Brand Visible to Every AI Engine
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              We optimize your digital presence so AI systems find you,
              understand you, and recommend you&nbsp;&mdash;&nbsp;automatically.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* AI Visibility Scans */}
            <div className="group relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-accent transition group-hover:bg-accent group-hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">AI Visibility Scans</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                See exactly how ChatGPT, Google AI, Perplexity, and Grok
                perceive your brand. Get a real score&nbsp;&mdash;&nbsp;not a
                guess&nbsp;&mdash;&nbsp;across every major AI engine.
              </p>
            </div>

            {/* Schema & Structured Data */}
            <div className="group relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-accent transition group-hover:bg-accent group-hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Schema &amp; Structured Data</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                JSON-LD markup, llms.txt, agent.json, and Data Islands
                that help AI models understand your business, services,
                and authority&nbsp;&mdash;&nbsp;so they cite you by name.
              </p>
            </div>

            {/* Content Optimization */}
            <div className="group relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-accent transition group-hover:bg-accent group-hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Content Optimization</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                AI-generated blog posts, social content, and landing pages
                built to signal authority and relevance to both search
                engines and generative AI models.
              </p>
            </div>

            {/* Ongoing Monitoring */}
            <div className="group relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-accent transition group-hover:bg-accent group-hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Ongoing Monitoring</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Weekly visibility scans, daily pulse checks, competitor
                tracking, and citation monitoring. Know the moment your AI
                visibility changes&nbsp;&mdash;&nbsp;and why.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-accent">
              How It Works
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Three Steps to AI Visibility
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              We plug into your existing marketing. No rip-and-replace.
              Just a new layer of visibility that grows your reach into
              every AI platform.
            </p>
          </div>

          <div className="mt-16 grid gap-10 md:grid-cols-3">
            <div className="relative rounded-2xl border border-slate-200 bg-surface p-8 shadow-sm">
              <span className="absolute -top-4 left-8 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-white shadow-md shadow-accent/30">
                1
              </span>
              <h3 className="mt-2 text-lg font-bold text-slate-900">Get Your Score</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                We scan your brand across ChatGPT, Google AI, Perplexity, Gemini,
                and Grok. You get a real visibility score&nbsp;&mdash;&nbsp;not
                a guess&nbsp;&mdash;&nbsp;showing exactly how AI engines see you today.
              </p>
            </div>

            <div className="relative rounded-2xl border border-slate-200 bg-surface p-8 shadow-sm">
              <span className="absolute -top-4 left-8 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-white shadow-md shadow-accent/30">
                2
              </span>
              <h3 className="mt-2 text-lg font-bold text-slate-900">See the Gaps</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Our analysis shows what signals are strong, what&apos;s weak,
                and what&apos;s missing entirely. We prioritize the fixes that
                will move the needle fastest for your specific industry and market.
              </p>
            </div>

            <div className="relative rounded-2xl border border-slate-200 bg-surface p-8 shadow-sm">
              <span className="absolute -top-4 left-8 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-white shadow-md shadow-accent/30">
                3
              </span>
              <h3 className="mt-2 text-lg font-bold text-slate-900">Fix What Matters</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                We implement structured data, optimize content, build authority
                signals, and deploy monitoring&nbsp;&mdash;&nbsp;so AI engines
                start citing and recommending your brand automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Who It's For ── */}
      <section className="bg-surface py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-accent">
              Who This Is For
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Businesses That Refuse to Be&nbsp;Invisible
            </h2>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Local Service Businesses",
                description:
                  "Plumbers, HVAC, electricians, roofers — when someone asks AI 'who's the best near me?', you need to be the answer.",
              },
              {
                title: "Professional Services",
                description:
                  "Law firms, accountants, consultants — AI is the new referral network. If it doesn't know you, you're losing high-value clients.",
              },
              {
                title: "Multi-Location Brands",
                description:
                  "Restaurants, clinics, franchises — each location needs AI visibility. We scale your presence across every market you serve.",
              },
            ].map(({ title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        id="cta"
        className="relative overflow-hidden bg-surface-dark py-24 md:py-32"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 right-0 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[100px]"
        />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
            Find Out If AI Can Find&nbsp;You
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-400">
            Get a free AI visibility scan. We&apos;ll show you exactly how
            ChatGPT, Perplexity, Google AI, and Grok see your
            brand&nbsp;&mdash;&nbsp;and what to fix first.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex h-14 items-center rounded-xl bg-accent px-10 text-base font-bold text-white shadow-lg shadow-accent/30 transition hover:bg-accent-dark hover:shadow-xl hover:shadow-accent/40"
            >
              Get Your Free Scan
            </Link>
          </div>
          <p className="mt-5 text-sm text-slate-500">
            No contracts. No pressure. Just a clear picture of your AI visibility.
          </p>
        </div>
      </section>
    </>
  );
}
