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
  { action: "Small UI change", credits: 1 },
  { action: "New page or section", credits: 2 },
  { action: "Feature addition", credits: "3-5" },
  { action: "Integration (API, payment, auth)", credits: "3-5" },
  { action: "Major feature or redesign", credits: "5-10" },
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

export default function PricingPage() {
  return (
    <div className="py-16 px-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
          Every plan includes a fully deployed application, managed hosting, and
          ongoing support. Choose the tier that fits your needs.
        </p>
      </div>

      {/* Tier Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
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
            <p className="text-sm text-foreground/60 mb-8">
              {tier.description}
            </p>
            <Link
              href="/sign-up"
              className={`text-center py-3 rounded-lg font-medium text-sm transition-colors mb-8 ${
                tier.popular
                  ? "bg-foreground text-background hover:opacity-90"
                  : "border border-foreground/20 hover:bg-foreground/5"
              }`}
            >
              Get Started
            </Link>
            <ul className="space-y-3 flex-1">
              <li className="text-sm text-foreground/80">
                <span className="text-foreground/40">--</span> {tier.credits}{" "}
                credits / month
              </li>
              <li className="text-sm text-foreground/80">
                <span className="text-foreground/40">--</span> {tier.projects}{" "}
                active project{tier.projects !== "1" ? "s" : ""}
              </li>
              <li className="text-sm text-foreground/80">
                <span className="text-foreground/40">--</span> {tier.support}{" "}
                support
              </li>
              <li className="text-sm text-foreground/80">
                <span className="text-foreground/40">--</span> {tier.analytics}{" "}
                analytics
              </li>
              {tier.customDomain && (
                <li className="text-sm text-foreground/80">
                  <span className="text-foreground/40">--</span> Custom domain
                </li>
              )}
              {tier.priorityQueue && (
                <li className="text-sm text-foreground/80">
                  <span className="text-foreground/40">--</span> Priority build
                  queue
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="max-w-4xl mx-auto mb-24">
        <h2 className="text-2xl font-bold text-center mb-8">
          Plan Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-foreground/10">
                <th className="text-left py-3 pr-4 font-medium text-foreground/60">
                  Feature
                </th>
                <th className="text-center py-3 px-4 font-medium">Starter</th>
                <th className="text-center py-3 px-4 font-medium">Growth</th>
                <th className="text-center py-3 px-4 font-medium">Scale</th>
              </tr>
            </thead>
            <tbody className="text-foreground/80">
              <tr className="border-b border-foreground/5">
                <td className="py-3 pr-4">Monthly price</td>
                <td className="text-center py-3 px-4">$99</td>
                <td className="text-center py-3 px-4">$299</td>
                <td className="text-center py-3 px-4">$799</td>
              </tr>
              <tr className="border-b border-foreground/5">
                <td className="py-3 pr-4">Credits / month</td>
                <td className="text-center py-3 px-4">5</td>
                <td className="text-center py-3 px-4">20</td>
                <td className="text-center py-3 px-4">50</td>
              </tr>
              <tr className="border-b border-foreground/5">
                <td className="py-3 pr-4">Active projects</td>
                <td className="text-center py-3 px-4">1</td>
                <td className="text-center py-3 px-4">3</td>
                <td className="text-center py-3 px-4">Unlimited</td>
              </tr>
              <tr className="border-b border-foreground/5">
                <td className="py-3 pr-4">Support</td>
                <td className="text-center py-3 px-4">Standard</td>
                <td className="text-center py-3 px-4">Priority</td>
                <td className="text-center py-3 px-4">Dedicated</td>
              </tr>
              <tr className="border-b border-foreground/5">
                <td className="py-3 pr-4">Analytics</td>
                <td className="text-center py-3 px-4">Basic</td>
                <td className="text-center py-3 px-4">Advanced</td>
                <td className="text-center py-3 px-4">Full suite</td>
              </tr>
              <tr className="border-b border-foreground/5">
                <td className="py-3 pr-4">Custom domain</td>
                <td className="text-center py-3 px-4">--</td>
                <td className="text-center py-3 px-4">Yes</td>
                <td className="text-center py-3 px-4">Yes</td>
              </tr>
              <tr className="border-b border-foreground/5">
                <td className="py-3 pr-4">Priority build queue</td>
                <td className="text-center py-3 px-4">--</td>
                <td className="text-center py-3 px-4">--</td>
                <td className="text-center py-3 px-4">Yes</td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Code buyout eligible</td>
                <td className="text-center py-3 px-4">After 12 mo</td>
                <td className="text-center py-3 px-4">After 12 mo</td>
                <td className="text-center py-3 px-4">After 12 mo</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Credit Cost Reference */}
      <div className="max-w-4xl mx-auto mb-24">
        <h2 className="text-2xl font-bold text-center mb-8">
          Credit Cost Reference
        </h2>
        <p className="text-center text-foreground/60 mb-8 text-sm">
          Credits are used for changes and updates to your application after
          initial delivery.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-foreground/10">
                <th className="text-left py-3 pr-4 font-medium text-foreground/60">
                  Action
                </th>
                <th className="text-right py-3 pl-4 font-medium text-foreground/60">
                  Credits
                </th>
              </tr>
            </thead>
            <tbody className="text-foreground/80">
              {creditCosts.map((item) => (
                <tr
                  key={item.action}
                  className="border-b border-foreground/5"
                >
                  <td className="py-3 pr-4">{item.action}</td>
                  <td className="text-right py-3 pl-4">{item.credits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="border-b border-foreground/10 pb-6"
            >
              <h3 className="font-semibold mb-2">{faq.question}</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-foreground/60 mb-8">
          Pick a plan and describe your project. We&apos;ll have it deployed in
          10 days.
        </p>
        <Link
          href="/sign-up"
          className="inline-block bg-foreground text-background px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity text-sm"
        >
          Start Your Project
        </Link>
      </div>
    </div>
  );
}
