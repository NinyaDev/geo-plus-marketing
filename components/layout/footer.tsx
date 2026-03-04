import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <Link href="/" className="text-sm font-semibold text-slate-900">
            GEO<span className="text-accent">Plus</span>Marketing
          </Link>
          <div className="flex items-center gap-6 text-sm text-muted">
            <Link href="/blog" className="transition hover:text-slate-900">
              Blog
            </Link>
            <Link href="/contact" className="transition hover:text-slate-900">
              Contact
            </Link>
            <Link href="/dashboard" className="transition hover:text-slate-900">
              Dashboard
            </Link>
          </div>
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} GEOPlusMarketing. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
