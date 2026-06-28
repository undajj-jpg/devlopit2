import Link from "next/link";

const tiers = [
  {
    name: "Starter",
    price: "$99",
    credits: 5,
    description: "Perfect for small projects and MVPs.",
    features: [
      "5 credits / month",
      "1 active project",
      "Standard support",
      "Basic analytics",
    ],
  },
  {
    name: "Growth",
    price: "$299",
    credits: 20,
    popular: true,
    description: "For growing businesses that need more iterations.",
    features: [
      "20 credits / month",
      "3 active projects",
      "Priority support",
      "Advanced analytics",
      "Custom domain",
    ],
  },
  {
    name: "Scale",
    price: "$799",
    credits: 50,
    description: "For teams running multiple products at scale.",
    features: [
      "50 credits / month",
      "Unlimited projects",
      "Dedicated support",
      "Full analytics suite",
      "Custom domain",
      "Priority build queue",
    ],
  },
];

const steps = [
  {
    number: "01",
    title: "Describe",
    description:
      "Tell us what you need. Write a brief, upload a sketch, or just describe your idea in plain language.",
  },
  {
    number: "02",
    title: "We Build",
    description:
      "Our AI-powered team delivers a deployed, working application within 10 business days.",
  },
  {
    number: "03",
    title: "You Run It",
    description:
      "Manage your app through your dashboard. Request changes with credits. Your content, your users, your business.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-[family-name:var(--font-geist-sans)]">
      {/* Header */}
      <header className="border-b border-foreground/10 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
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
              className="text-sm font-medium bg-foreground/5 hover:bg-foreground/10 px-4 py-2 rounded-lg transition-colors"
            >
              Sign In
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6">
            Describe it.
            <br />
            We build it.
            <br />
            <span className="text-foreground/60">You run it.</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto mb-10">
            Get a deployed, production-ready web application in 10 days. No
            developers needed. Manage changes with simple credits.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/sign-up"
              className="bg-foreground text-background px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity text-sm"
            >
              Get Started
            </Link>
            <Link
              href="/how-it-works"
              className="border border-foreground/20 px-8 py-3 rounded-lg font-medium hover:bg-foreground/5 transition-colors text-sm"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 border-t border-foreground/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="text-4xl font-bold text-foreground/20 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-foreground/60 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-24 px-6 border-t border-foreground/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-center text-foreground/60 mb-16 max-w-xl mx-auto">
            Choose a plan that fits your needs. All plans include a fully
            deployed application and managed hosting.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl border p-8 flex flex-col ${
                  tier.popular
                    ? "border-foreground/30 bg-foreground/[0.03] ring-1 ring-foreground/10"
                    : "border-foreground/10"
                }`}
              >
                {tier.popular && (
                  <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-4">
                    Most Popular
                  </span>
                )}
                <h3 className="text-2xl font-bold">{tier.name}</h3>
                <div className="mt-4 mb-2">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-foreground/60">/mo</span>
                </div>
                <p className="text-sm text-foreground/60 mb-6">
                  {tier.credits} credits included
                </p>
                <p className="text-sm text-foreground/60 mb-8">
                  {tier.description}
                </p>
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="text-sm text-foreground/80 flex items-start gap-2"
                    >
                      <span className="text-foreground/40 mt-0.5">--</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sign-up"
                  className={`text-center py-3 rounded-lg font-medium text-sm transition-colors ${
                    tier.popular
                      ? "bg-foreground text-background hover:opacity-90"
                      : "border border-foreground/20 hover:bg-foreground/5"
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-foreground/10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to build?</h2>
          <p className="text-foreground/60 mb-8">
            Describe your project and get a deployed application in 10 days. No
            technical skills required.
          </p>
          <Link
            href="/sign-up"
            className="inline-block bg-foreground text-background px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity text-sm"
          >
            Start Your Project
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-foreground/10">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="font-semibold mb-3">Devlop</p>
              <p className="text-sm text-foreground/60">
                Describe it. We build it. You run it.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-3">Legal</p>
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
              <p className="font-semibold mb-3">Support</p>
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
