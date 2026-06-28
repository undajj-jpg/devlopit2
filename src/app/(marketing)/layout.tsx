import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-lg sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-extrabold tracking-tight">
            <span className="gradient-text">Devlop</span>
          </Link>
          <div className="flex items-center gap-8">
            <Link
              href="/how-it-works"
              className="text-sm text-slate-500 hover:text-slate-900 transition-colors duration-200"
            >
              How It Works
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-slate-500 hover:text-slate-900 transition-colors duration-200"
            >
              Pricing
            </Link>
            <Link
              href="/sign-in"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="text-sm font-semibold gradient-primary text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <p className="text-xl font-extrabold mb-3">
                <span className="gradient-text">Devlop</span>
              </p>
              <p className="text-sm text-slate-400 leading-relaxed">
                Describe it. We build it. You run it.
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-900 mb-4 text-sm">Product</p>
              <ul className="space-y-3 text-sm">
                <li><Link href="/how-it-works" className="text-slate-400 hover:text-indigo-600 transition-colors duration-200">How It Works</Link></li>
                <li><Link href="/pricing" className="text-slate-400 hover:text-indigo-600 transition-colors duration-200">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-slate-900 mb-4 text-sm">Legal</p>
              <ul className="space-y-3 text-sm">
                <li><Link href="/terms" className="text-slate-400 hover:text-indigo-600 transition-colors duration-200">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-slate-400 hover:text-indigo-600 transition-colors duration-200">Privacy Policy</Link></li>
                <li><Link href="/msa" className="text-slate-400 hover:text-indigo-600 transition-colors duration-200">Master Service Agreement</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-slate-900 mb-4 text-sm">Support</p>
              <ul className="space-y-3 text-sm">
                <li><a href="mailto:abuse@devlop.it" className="text-slate-400 hover:text-indigo-600 transition-colors duration-200">Report Abuse</a></li>
                <li><a href="mailto:support@devlop.it" className="text-slate-400 hover:text-indigo-600 transition-colors duration-200">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-200 text-center text-sm text-slate-400">
            &copy; {new Date().getFullYear()} Devlop. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
