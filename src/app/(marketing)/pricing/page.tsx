import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing — Devlop",
  description: "Simple, transparent pricing for every stage of your business.",
};

const tiers = [
  {
    name: "Starter",
    price: "$99",
    credits: 5,
    projects: "1",
    support: "Standard",
    analytics: "Basic",
    customDomain: false,
    priorityQueue: false,
    description: "Perfect for small projects and MVPs.",
  },
  {
    name: "Growth",
    price: "$299",
    credits: 20,
    projects: "3",
    support: "Priority",
    analytics: "Advanced",
    customDomain: true,
    priorityQueue: false,
    popular: true,
    description: "For growing businesses that need more iterations.",
  },
  {
    name: "Scale",
    price: "$799",
    credits: 50,
    projects: "Unlimited",
    support: "Dedicated",
    analytics: "Full suite",
    customDomain: true,
    priorityQueue: true,
    description: "For teams running multiple products at scale.",
  },
];

const creditCosts = [
  { action: "Small UI change", credits: "1", icon: "🎨" },
  { action: "New page or section", credits: "2", icon: "📄" },
  { action: "Feature addition", credits: "3-5", icon: "⚡" },
  { action: "Integration (API, payment, auth)", credits: "3-5", icon: "🔗" },
  { action: "Major feature or redesign", credits: "5-10", icon: "🏗️" },
];

const faqs = [
  {
    question: "Is there a free trial?",
    answer:
      "We offer a 14-day money-back guarantee on all plans. If you're not satisfied with the initial build, we'll refund your first month.",
  },
  {
    question: "What happens to unused credits?",
    answer:
      "Credits expire at the end of each billing cycle and do not roll over. Choose a plan that matches your expected change volume.",
  },
  {
    question: "Can I buy additional credits?",
    answer:
      "Yes. Additional credits can be purchased at any time at the rate for your current tier. Contact support for bulk pricing.",
  },
  {
    question: "What is the code buyout?",
    answer:
      "After 12 consecutive months of active subscription, you can purchase full ownership of your application's custom code. Buyout pricing is based on project complexity and is negotiated individually.",
  },
  {
    question: "Do I own my content and data?",
    answer:
      "Absolutely. You always own your content, branding, and end-user data regardless of subscription status. See our MSA for full details.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. You can cancel your subscription with 30 days' notice. After cancellation, you can export your content and user data within 30 days.",
  },
];

const Check = () => (
  <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
);

const Dash = () => (
  <span className="text-slate-300">—</span>
);

export default function PricingPage() {
  return (
    <div>
      {/* Header */}
      <section className="py-20 px-6 gradient-hero">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-3">Pricing</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Every plan includes a fully deployed application, managed hosting, and
            ongoing support. Choose the tier that fits your needs.
          </p>
        </div>
      </section>

      {/* Tier Cards */}
      <section className="px-6 -mt-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                tier.popular
                  ? "bg-white shadow-2xl shadow-indigo-500/10 ring-2 ring-indigo-500"
                  : "bg-white border border-slate-200 hover:shadow-xl"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="gradient-primary text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <h3 className="text-xl font-bold">{tier.name}</h3>
              <div className="mt-4 mb-2">
                <span className="text-5xl font-extrabold">{tier.price}</span>
                <span className="text-slate-400 font-medium">/mo</span>
              </div>
              <p className="text-sm text-slate-500 mb-8">{tier.description}</p>
              <Link
                href="/sign-up"
                className={`text-center py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 mb-8 cursor-pointer ${
                  tier.popular
                    ? "gradient-primary text-white hover:shadow-lg hover:shadow-indigo-500/25"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                Get Started
              </Link>
              <ul className="space-y-3 flex-1">
                {[
                  `${tier.credits} credits / month`,
                  `${tier.projects} active project${tier.projects !== "1" ? "s" : ""}`,
                  `${tier.support} support`,
                  `${tier.analytics} analytics`,
                  ...(tier.customDomain ? ["Custom domain"] : []),
                  ...(tier.priorityQueue ? ["Priority build queue"] : []),
                ].map((feature) => (
                  <li key={feature} className="text-sm text-slate-600 flex items-center gap-3">
                    <Check />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-extrabold text-center mb-10">Plan Comparison</h2>
          <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-4 px-6 font-medium text-slate-400">Feature</th>
                  <th className="text-center py-4 px-6 font-bold text-slate-900">Starter</th>
                  <th className="text-center py-4 px-6 font-bold text-indigo-600">Growth</th>
                  <th className="text-center py-4 px-6 font-bold text-slate-900">Scale</th>
                </tr>
              </thead>
              <tbody className="text-slate-600">
                {[
                  ["Monthly price", "$99", "$299", "$799"],
                  ["Credits / month", "5", "20", "50"],
                  ["Active projects", "1", "3", "Unlimited"],
                  ["Support", "Standard", "Priority", "Dedicated"],
                  ["Analytics", "Basic", "Advanced", "Full suite"],
                ].map(([feature, ...values]) => (
                  <tr key={feature} className="border-b border-slate-50">
                    <td className="py-3.5 px-6 font-medium text-slate-500">{feature}</td>
                    {values.map((v, i) => (
                      <td key={i} className="text-center py-3.5 px-6">{v}</td>
                    ))}
                  </tr>
                ))}
                {[
                  ["Custom domain", false, true, true],
                  ["Priority build queue", false, false, true],
                ].map(([feature, ...values]) => (
                  <tr key={feature as string} className="border-b border-slate-50">
                    <td className="py-3.5 px-6 font-medium text-slate-500">{feature as string}</td>
                    {(values as boolean[]).map((v, i) => (
                      <td key={i} className="text-center py-3.5 px-6">{v ? <Check /> : <Dash />}</td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="py-3.5 px-6 font-medium text-slate-500">Code buyout eligible</td>
                  <td className="text-center py-3.5 px-6">After 12 mo</td>
                  <td className="text-center py-3.5 px-6">After 12 mo</td>
                  <td className="text-center py-3.5 px-6">After 12 mo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Credit Cost Reference */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-3">Credits</p>
            <h2 className="text-2xl font-extrabold">Credit Cost Reference</h2>
            <p className="text-slate-500 mt-2 text-sm">
              Credits are used for changes and updates to your application after initial delivery.
            </p>
          </div>
          <div className="grid gap-3">
            {creditCosts.map((item) => (
              <div key={item.action} className="flex items-center justify-between bg-slate-50 rounded-xl px-6 py-4 border border-slate-100">
                <span className="text-sm font-medium text-slate-700">{item.action}</span>
                <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">{item.credits} credits</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-3">FAQ</p>
            <h2 className="text-2xl font-extrabold">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-bold text-slate-900 mb-2">{faq.question}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="gradient-primary rounded-3xl px-8 py-16 md:px-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/5 rounded-full blur-2xl" />
            </div>
            <div className="relative">
              <h2 className="text-3xl font-extrabold text-white mb-4">Ready to get started?</h2>
              <p className="text-indigo-100 mb-8 max-w-lg mx-auto">
                Pick a plan and describe your project. We&apos;ll have it deployed in 10 days.
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
    </div>
  );
}
