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
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "We Build",
    description:
      "Our AI-powered team delivers a deployed, working application within 10 business days.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "You Run It",
    description:
      "Manage your app through your dashboard. Request changes with credits. Your content, your users, your business.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
      </svg>
    ),
  },
];

const logos = [
  "Next.js", "Tailwind", "Supabase", "Vercel", "Stripe",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-[family-name:var(--font-geist-sans)]">
      {/* Header */}
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

      {/* Hero */}
      <section className="relative py-24 md:py-36 px-6 overflow-hidden gradient-hero">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-float [animation-delay:3s]" />
        </div>
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            AI-Powered Development
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Describe it.
            <br />
            We build it.
            <br />
            <span className="gradient-text">You run it.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            Get a deployed, production-ready web application in 10 days. No
            developers needed. Manage changes with simple credits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="gradient-primary text-white px-8 py-4 rounded-2xl font-semibold text-base hover:shadow-xl hover:shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5"
            >
              Start Your Project
            </Link>
            <Link
              href="/how-it-works"
              className="bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-semibold text-base hover:border-slate-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Tech Logos */}
      <section className="py-12 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-xs font-medium text-slate-400 uppercase tracking-widest mb-6">Built with industry-leading technology</p>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {logos.map((logo) => (
              <span key={logo} className="text-sm font-semibold text-slate-300 tracking-wide">{logo}</span>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-3">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Three steps to your app</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.number} className="relative group">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-indigo-200 to-transparent" />
                )}
                <div className="bg-white border border-slate-100 rounded-2xl p-8 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl gradient-primary text-white flex items-center justify-center mb-6">
                    {step.icon}
                  </div>
                  <div className="text-xs font-bold text-indigo-500 mb-2">STEP {step.number}</div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-24 md:py-32 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-3">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Choose a plan that fits your needs. All plans include a fully
              deployed application and managed hosting.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                  tier.popular
                    ? "bg-white shadow-2xl shadow-indigo-500/10 ring-2 ring-indigo-500 hover:shadow-indigo-500/20"
                    : "bg-white border border-slate-200 hover:shadow-xl hover:shadow-slate-200/50"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="gradient-primary text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                <div className="mt-4 mb-2">
                  <span className="text-5xl font-extrabold text-slate-900">{tier.price}</span>
                  <span className="text-slate-400 font-medium">/mo</span>
                </div>
                <p className="text-sm text-slate-500 mb-2">
                  {tier.credits} credits included
                </p>
                <p className="text-sm text-slate-400 mb-8">
                  {tier.description}
                </p>
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="text-sm text-slate-600 flex items-center gap-3"
                    >
                      <svg className="w-5 h-5 text-indigo-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sign-up"
                  className={`text-center py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                    tier.popular
                      ? "gradient-primary text-white hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
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
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative gradient-primary rounded-3xl px-8 py-16 md:px-16 md:py-20 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/5 rounded-full blur-2xl" />
            </div>
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Ready to build?</h2>
              <p className="text-indigo-100 mb-8 max-w-lg mx-auto">
                Describe your project and get a deployed application in 10 days. No
                technical skills required.
              </p>
              <Link
                href="/sign-up"
                className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                Start Your Project
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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
                <li>
                  <Link href="/how-it-works" className="text-slate-400 hover:text-indigo-600 transition-colors duration-200">How It Works</Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-slate-400 hover:text-indigo-600 transition-colors duration-200">Pricing</Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-slate-900 mb-4 text-sm">Legal</p>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/terms" className="text-slate-400 hover:text-indigo-600 transition-colors duration-200">Terms of Service</Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-slate-400 hover:text-indigo-600 transition-colors duration-200">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/msa" className="text-slate-400 hover:text-indigo-600 transition-colors duration-200">Master Service Agreement</Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-slate-900 mb-4 text-sm">Support</p>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="mailto:abuse@devlop.it" className="text-slate-400 hover:text-indigo-600 transition-colors duration-200">Report Abuse</a>
                </li>
                <li>
                  <a href="mailto:support@devlop.it" className="text-slate-400 hover:text-indigo-600 transition-colors duration-200">Contact Us</a>
                </li>
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
