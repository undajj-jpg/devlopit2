import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How It Works — Devlop",
  description:
    "Describe your idea, we build it, you manage it. Learn how Devlop works.",
};

const steps = [
  {
    number: "01",
    title: "Describe",
    subtitle: "Tell us what you need",
    details: [
      "Write a plain-language brief describing your project.",
      "Upload sketches, wireframes, or reference sites if you have them.",
      "No technical knowledge required -- just explain the problem you're solving.",
      "Our team reviews your brief and confirms scope within 24 hours.",
    ],
  },
  {
    number: "02",
    title: "We Build",
    subtitle: "AI-powered development, human quality",
    details: [
      "Our AI-assisted development pipeline builds your application.",
      "You receive a deployed, working application within 10 business days.",
      "Includes responsive design, basic SEO, and production hosting.",
      "We handle infrastructure, security, and deployment -- you review and approve.",
    ],
  },
  {
    number: "03",
    title: "You Manage",
    subtitle: "Your app, your business",
    details: [
      "Access your dashboard to manage content and view analytics.",
      "Request changes and new features using credits from your plan.",
      "You own all your content and end-user data at all times.",
      "After 12 months, you can buy out the code and run it independently.",
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <div className="py-16 px-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-24">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          How It Works
        </h1>
        <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
          From idea to deployed application in three simple steps. No developers
          needed, no technical skills required.
        </p>
      </div>

      {/* Steps */}
      <div className="max-w-4xl mx-auto space-y-24 mb-24">
        {steps.map((step, index) => (
          <div key={step.number} className="relative">
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute left-8 top-24 bottom-0 w-px bg-foreground/10 -mb-24" />
            )}
            <div className="flex flex-col md:flex-row gap-8 md:gap-16">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-foreground/5 border border-foreground/10 flex items-center justify-center text-2xl font-bold text-foreground/30">
                  {step.number}
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2">{step.title}</h2>
                <p className="text-lg text-foreground/60 mb-6">
                  {step.subtitle}
                </p>
                <ul className="space-y-3">
                  {step.details.map((detail) => (
                    <li
                      key={detail}
                      className="text-foreground/70 flex items-start gap-3"
                    >
                      <span className="text-foreground/30 mt-1.5 flex-shrink-0">
                        --
                      </span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* What You Get */}
      <div className="max-w-4xl mx-auto mb-24">
        <h2 className="text-2xl font-bold text-center mb-12">
          What&apos;s Included
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "Production Hosting",
              desc: "Your app runs on managed infrastructure with SSL, CDN, and automatic scaling.",
            },
            {
              title: "Responsive Design",
              desc: "Every application works across desktop, tablet, and mobile devices.",
            },
            {
              title: "Analytics Dashboard",
              desc: "Track visitors, engagement, and key metrics from your management portal.",
            },
            {
              title: "Content Management",
              desc: "Update text, images, and content without using credits or writing code.",
            },
            {
              title: "Security & Updates",
              desc: "We handle security patches, framework updates, and infrastructure maintenance.",
            },
            {
              title: "Data Ownership",
              desc: "You always own your content and end-user data. Export anytime.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="border border-foreground/10 rounded-xl p-6"
            >
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">
          Ready to describe your project?
        </h2>
        <p className="text-foreground/60 mb-8">
          Sign up, tell us what you need, and we&apos;ll have it live in 10
          days.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/sign-up"
            className="bg-foreground text-background px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity text-sm"
          >
            Get Started
          </Link>
          <Link
            href="/pricing"
            className="border border-foreground/20 px-8 py-3 rounded-lg font-medium hover:bg-foreground/5 transition-colors text-sm"
          >
            View Pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
