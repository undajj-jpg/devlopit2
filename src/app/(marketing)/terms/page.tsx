import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Devlop",
  description: "Devlop Terms of Service",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-8 rounded-md border border-yellow-500/50 bg-yellow-500/10 px-4 py-3 text-sm font-semibold text-yellow-600 dark:text-yellow-400">
        REVIEW BY COUNSEL BEFORE LAUNCH
      </div>

      <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">
        Terms of Service
      </h1>
      <p className="text-sm text-foreground/60 mb-12">
        Version 1.0 — Last Updated: 2026-06-28
      </p>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-foreground/80">
        <section>
          <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Devlop platform (&quot;Service&quot;), you agree to be bound
            by these Terms of Service (&quot;Terms&quot;). If you do not agree, do not use the
            Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">2. Description of Service</h2>
          <p>
            Devlop provides an AI-assisted web application development platform operating on a
            subscription and credit-based model. Devlop builds and hosts web applications on
            behalf of clients.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">3. Accounts</h2>
          <p>
            You must provide accurate and complete registration information. You are responsible
            for maintaining the confidentiality of your account credentials and for all activities
            that occur under your account.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">4. Subscription and Payment</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>All subscriptions are billed monthly in advance.</li>
            <li>
              Credits included in your plan expire at the end of each billing cycle and do not
              roll over unless otherwise stated.
            </li>
            <li>Prices are subject to change with 30 days&apos; notice.</li>
            <li>All fees are non-refundable except as required by applicable law.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">5. Acceptable Use</h2>
          <p>You agree not to use the Service to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Violate any applicable law or regulation.</li>
            <li>Infringe on the intellectual property rights of others.</li>
            <li>Distribute malware, spam, or other harmful content.</li>
            <li>
              Build applications that facilitate illegal activity, harassment, or exploitation.
            </li>
            <li>Attempt to reverse-engineer, decompile, or disassemble the Service.</li>
            <li>Resell or redistribute the Service without prior written consent.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">6. Intellectual Property</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Applications built by Devlop are licensed to you under a rental model. You do not
              own the underlying code unless a buyout is completed.
            </li>
            <li>
              You retain ownership of all content and end-user data you provide or collect
              through the application.
            </li>
            <li>See the Master Service Agreement for detailed IP terms.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">7. Termination</h2>
          <p>
            We may suspend or terminate your access to the Service at any time for violation of
            these Terms. Upon termination, your right to use the Service ceases immediately. We
            will provide reasonable notice when possible.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">8. Disclaimers</h2>
          <p className="uppercase text-xs tracking-wide">
            The Service is provided &quot;as is&quot; and &quot;as available&quot; without
            warranties of any kind, express or implied. Devlop does not warrant that the Service
            will be uninterrupted, error-free, or secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">9. Limitation of Liability</h2>
          <p className="uppercase text-xs tracking-wide">
            To the maximum extent permitted by law, Devlop&apos;s total liability shall not
            exceed the amounts paid by you in the twelve (12) months preceding the claim.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">10. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the
            State of Delaware, United States, without regard to conflict-of-law principles.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">11. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will notify you of
            material changes via email or through the Service. Continued use after changes
            constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">12. Contact</h2>
          <p>
            For questions about these Terms, contact us at{" "}
            <a href="mailto:legal@devlop.it" className="underline">
              legal@devlop.it
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
