import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-foreground/10 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-foreground"
          >
            Devlop
          </Link>
          <div className="flex items-center gap-8">
            <Link
              href="/how-it-works"
              className="text-sm text-foreground/70 hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-foreground/70 hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/sign-in"
              className="text-sm font-medium text-foreground bg-foreground/5 hover:bg-foreground/10 px-4 py-2 rounded-lg transition-colors"
            >
              Sign In
            </Link>
          </div>
        </nav>
      </header>

      {/* Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-foreground/10 bg-background">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="font-semibold text-foreground mb-3">Devlop</p>
              <p className="text-sm text-foreground/60">
                Describe it. We build it. You run it.
              </p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-3">Legal</p>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/terms"
                    className="text-foreground/60 hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-foreground/60 hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/msa"
                    className="text-foreground/60 hover:text-foreground transition-colors"
                  >
                    Master Service Agreement
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-3">Support</p>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="mailto:abuse@devlop.it"
                    className="text-foreground/60 hover:text-foreground transition-colors"
                  >
                    Report Abuse
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:support@devlop.it"
                    className="text-foreground/60 hover:text-foreground transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-foreground/10 text-center text-sm text-foreground/40">
            &copy; {new Date().getFullYear()} Devlop. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
