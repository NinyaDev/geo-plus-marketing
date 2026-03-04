export default function Home() {
  return (
    <>
      {/* ── Navigation ── */}
      <nav className="fixed top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            GEO<span className="text-accent">Plus</span>Marketing
          </span>
          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#services" className="transition hover:text-accent">
              Services
            </a>
            <a href="#how-it-works" className="transition hover:text-accent">
              How It Works
            </a>
            <a href="#results" className="transition hover:text-accent">
              Results
            </a>
            <a
              href="#cta"
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-accent/25 transition hover:bg-accent-dark"
            >
              Get Started
            </a>
          </div>
          {/* Mobile CTA */}
          <a
            href="#cta"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white md:hidden"
          >
            Get Started
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-surface-dark pt-32 pb-24 md:pt-44 md:pb-36">
        {/* Grid accent */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        {/* Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-accent/15 blur-[120px]"
        />

        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <p className="mb-5 inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-300">
            Autonomous Marketing &amp; Sales Hub
          </p>
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Stop Losing Customers
            <br className="hidden sm:block" />{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              to Competitors Who Show&nbsp;Up&nbsp;First
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400 md:text-xl">
            GEOPlusMarketing is the all-in-one growth engine that puts your
            local service business at the top of every search, map, and feed
            &mdash;&nbsp;on autopilot.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#cta"
              className="inline-flex h-14 items-center rounded-xl bg-accent px-8 text-base font-bold text-white shadow-lg shadow-accent/30 transition hover:bg-accent-dark hover:shadow-xl hover:shadow-accent/40"
            >
              Schedule Your Free Strategy Call
            </a>
            <a
              href="#how-it-works"
              className="inline-flex h-14 items-center rounded-xl border border-slate-700 px-8 text-base font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
            >
              See How It Works
            </a>
          </div>

          {/* Social proof bar */}
          <div className="mx-auto mt-16 flex max-w-xl flex-wrap items-center justify-center gap-x-8 gap-y-4 border-t border-slate-800 pt-8">
            {[
              ["150+", "Local Businesses Served"],
              ["3.2x", "Avg. Lead Increase"],
              ["#1", "Map Pack Rankings"],
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

      {/* ── Services ── */}
      <section id="services" className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-accent">
              Core Programs
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Four Pillars of Local Market Domination
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Each program works together as a unified system &mdash; so every
              click, call, and customer is captured automatically.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1 — AI SEO */}
            <div className="group relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-accent transition group-hover:bg-accent group-hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">AI SEO</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Intelligent keyword targeting, content optimization, and
                technical SEO that continuously adapts to algorithm updates
                &mdash;&nbsp;keeping you ranked above the competition 24/7.
              </p>
            </div>

            {/* Card 2 — GBP Optimization */}
            <div className="group relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-accent transition group-hover:bg-accent group-hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                GBP Optimization
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Your Google Business Profile becomes a lead-generating machine
                with optimized categories, posts, Q&amp;A, review management,
                and geo-targeted signals that dominate the Map&nbsp;Pack.
              </p>
            </div>

            {/* Card 3 — Website / Funnel */}
            <div className="group relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-accent transition group-hover:bg-accent group-hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Website &amp; Funnel Optimization
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                High-performance landing pages and conversion funnels
                engineered to turn visitors into booked appointments &mdash;
                with speed, mobile-first design, and persuasive copy baked in.
              </p>
            </div>

            {/* Card 4 — Marketing Automation */}
            <div className="group relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-accent transition group-hover:bg-accent group-hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Marketing Automation
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Automated follow-ups, review requests, email &amp; SMS
                campaigns, and lead nurturing sequences that run in the
                background while you focus on delivering your service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="bg-surface py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-accent">
              How It Works
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Results on Autopilot &mdash; In Three&nbsp;Steps
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              We combine proprietary technology with proven marketing strategy
              to deliver measurable growth without adding to your workload.
            </p>
          </div>

          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {/* Step 1 */}
            <div className="relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <span className="absolute -top-4 left-8 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-white shadow-md shadow-accent/30">
                1
              </span>
              <h3 className="mt-2 text-lg font-bold text-slate-900">
                Deep-Dive Audit
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Our systems analyze your entire digital footprint &mdash; your
                website, search rankings, Google Business Profile, competitors,
                and local market landscape &mdash; to build a precision growth
                blueprint.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <span className="absolute -top-4 left-8 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-white shadow-md shadow-accent/30">
                2
              </span>
              <h3 className="mt-2 text-lg font-bold text-slate-900">
                Autonomous Execution
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Your campaigns, optimizations, and content are deployed and
                continuously refined by our intelligent engine. Updates happen
                around the clock &mdash; no manual work required from you.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <span className="absolute -top-4 left-8 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-white shadow-md shadow-accent/30">
                3
              </span>
              <h3 className="mt-2 text-lg font-bold text-slate-900">
                Measurable Growth
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Watch your phone ring, your calendar fill, and your revenue
                climb. You get transparent dashboards and monthly reports
                showing exactly where every lead and dollar comes from.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Results / Social Proof ── */}
      <section id="results" className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-accent">
              Proven Results
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Built for Businesses That Refuse to Be&nbsp;Invisible
            </h2>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                metric: "312%",
                description: "Average increase in organic search traffic within 90 days",
              },
              {
                metric: "5.4x",
                description:
                  "More Google Business Profile views compared to unoptimized listings",
              },
              {
                metric: "47%",
                description:
                  "Boost in booked appointments through optimized funnels and automation",
              },
            ].map(({ metric, description }) => (
              <div
                key={metric}
                className="rounded-2xl border border-slate-200 bg-surface p-8 text-center"
              >
                <p className="text-5xl font-extrabold text-accent">{metric}</p>
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
            Ready to Own Your Local&nbsp;Market?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-400">
            Book a free 30-minute strategy call. We&apos;ll audit your online
            presence, identify your biggest growth levers, and show you exactly
            how GEOPlusMarketing can fill your pipeline.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#"
              className="inline-flex h-14 items-center rounded-xl bg-accent px-10 text-base font-bold text-white shadow-lg shadow-accent/30 transition hover:bg-accent-dark hover:shadow-xl hover:shadow-accent/40"
            >
              Schedule Your Free Consultation
            </a>
          </div>
          <p className="mt-5 text-sm text-slate-500">
            No contracts. No pressure. Just a clear growth roadmap.
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <span className="text-sm font-semibold text-slate-900">
            GEO<span className="text-accent">Plus</span>Marketing
          </span>
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} GEOPlusMarketing. All rights
            reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
