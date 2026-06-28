import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Devlop",
  description: "Devlop Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-8 rounded-md border border-yellow-500/50 bg-yellow-500/10 px-4 py-3 text-sm font-semibold text-yellow-600 dark:text-yellow-400">
        REVIEW BY COUNSEL BEFORE LAUNCH
      </div>

      <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">Privacy Policy</h1>
      <p className="text-sm text-foreground/60 mb-12">
        Version 1.0 — Last Updated: 2026-06-28
      </p>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-foreground/80">
        <section>
          <h2 className="text-xl font-semibold text-foreground">1. Introduction</h2>
          <p>
            Devlop (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your
            information when you use our platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">2. Information We Collect</h2>
          <h3 className="text-lg font-medium text-foreground mt-4">Information You Provide</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Account registration data (name, email, company name).</li>
            <li>Payment information (processed by our third-party payment processor).</li>
            <li>Project descriptions, requirements, and content you upload.</li>
            <li>Communications with our team.</li>
          </ul>
          <h3 className="text-lg font-medium text-foreground mt-4">
            Information Collected Automatically
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Usage data (pages visited, features used, session duration).</li>
            <li>Device and browser information.</li>
            <li>IP address and approximate location.</li>
            <li>Cookies and similar tracking technologies.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            3. How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide and maintain the Service.</li>
            <li>To process payments and manage subscriptions.</li>
            <li>To communicate with you about your account and projects.</li>
            <li>To improve the Service and develop new features.</li>
            <li>To comply with legal obligations.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">4. Data Sharing</h2>
          <p>We do not sell your personal information. We may share data with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Service providers</strong> who assist in operating the platform (hosting,
              payment processing, analytics).
            </li>
            <li>
              <strong>Legal authorities</strong> when required by law or to protect our rights.
            </li>
            <li>
              <strong>Business transfers</strong> in connection with a merger, acquisition, or
              sale of assets.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">5. Data Retention</h2>
          <p>
            We retain your personal information for as long as your account is active or as
            needed to provide the Service. After account termination, we retain data for a
            reasonable period to comply with legal obligations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">6. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your information,
            including encryption in transit and at rest, access controls, and regular security
            assessments.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">7. Your Rights</h2>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access, correct, or delete your personal information.</li>
            <li>Object to or restrict processing.</li>
            <li>Data portability.</li>
            <li>Withdraw consent.</li>
          </ul>
          <p>
            To exercise these rights, contact us at{" "}
            <a href="mailto:privacy@devlop.it" className="underline">
              privacy@devlop.it
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">8. International Transfers</h2>
          <p>
            Your data may be transferred to and processed in countries other than your own. We
            ensure appropriate safeguards are in place for such transfers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            9. Children&apos;s Privacy
          </h2>
          <p>
            The Service is not directed to individuals under the age of 18. We do not knowingly
            collect personal information from children.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of material
            changes via email or through the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">11. Contact</h2>
          <p>
            For questions about this Privacy Policy, contact us at{" "}
            <a href="mailto:privacy@devlop.it" className="underline">
              privacy@devlop.it
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
