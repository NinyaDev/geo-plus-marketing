import Link from "next/link";

export function PublicNav() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-slate-900">
          GEO<span className="text-accent">Plus</span>Marketing
        </Link>
        <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <Link href="/#services" className="transition hover:text-accent">
            Services
          </Link>
          <Link href="/blog" className="transition hover:text-accent">
            Blog
          </Link>
          <Link href="/contact" className="transition hover:text-accent">
            Contact
          </Link>
          <Link href="/dashboard" className="transition hover:text-accent">
            Dashboard
          </Link>
          <Link
            href="/contact"
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-accent/25 transition hover:bg-accent-dark"
          >
            Get Started
          </Link>
        </div>
        {/* Mobile CTA */}
        <Link
          href="/contact"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white md:hidden"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}
