import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Master Service Agreement — Devlop",
  description: "Devlop Master Service Agreement",
};

export default function MSAPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-8 rounded-md border border-yellow-500/50 bg-yellow-500/10 px-4 py-3 text-sm font-semibold text-yellow-600 dark:text-yellow-400">
        REVIEW BY COUNSEL BEFORE LAUNCH
      </div>

      <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">
        Master Service Agreement
      </h1>
      <p className="text-sm text-foreground/60 mb-12">
        Version 1.0 — Last Updated: 2026-06-28
      </p>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-foreground/80">
        <p>
          This Master Service Agreement (&quot;Agreement&quot;) is entered into between Devlop
          (&quot;Provider,&quot; &quot;we,&quot; &quot;us&quot;) and the entity or individual
          subscribing to the Service (&quot;Client,&quot; &quot;you&quot;).
        </p>

        {/* 1. Service Model */}
        <section>
          <h2 className="text-xl font-semibold text-foreground">1. Service Model</h2>
          <h3 className="text-lg font-medium text-foreground mt-4">1.1 Rental Model</h3>
          <p>
            Applications developed by Devlop are provided under a{" "}
            <strong>rental model</strong>. Client does not own the underlying source code,
            frameworks, templates, or proprietary tooling used to build the application. Client
            receives a non-exclusive, non-transferable license to use the application for the
            duration of the subscription.
          </p>
          <h3 className="text-lg font-medium text-foreground mt-4">
            1.2 Hosting and Maintenance
          </h3>
          <p>
            Devlop hosts and maintains all applications on its infrastructure. Client may not
            self-host, redistribute, or sublicense the application code without completing a
            buyout.
          </p>
        </section>

        {/* 2. Intellectual Property */}
        <section>
          <h2 className="text-xl font-semibold text-foreground">2. Intellectual Property</h2>
          <h3 className="text-lg font-medium text-foreground mt-4">2.1 Devlop IP</h3>
          <p>
            All source code, templates, frameworks, AI models, tooling, and infrastructure
            developed or used by Devlop remain the exclusive intellectual property of Devlop.
          </p>

          <h3 className="text-lg font-medium text-foreground mt-4">
            2.2 Client Content Ownership
          </h3>
          <p>Client retains full ownership of:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              All content provided by Client for use in the application (text, images, branding,
              media).
            </li>
            <li>All end-user data collected through the application.</li>
            <li>
              All business data and analytics derived from Client&apos;s use of the application.
            </li>
          </ul>
          <p>
            Client&apos;s ownership of content and end-user data is absolute and is not affected
            by subscription status or termination.
          </p>

          <h3 className="text-lg font-medium text-foreground mt-4">
            2.3 Buyout and IP Assignment
          </h3>
          <p>
            After a minimum of <strong>twelve (12) consecutive months</strong> of active
            subscription, Client may request a code buyout. Upon completion of the buyout process
            and payment of the buyout fee:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Devlop will assign all intellectual property rights in the custom application code
              to Client.
            </li>
            <li>
              Devlop retains rights to its proprietary frameworks, templates, and tooling (which
              will be removed or replaced during the buyout process).
            </li>
            <li>
              Client receives a complete, documented codebase suitable for independent operation.
            </li>
          </ul>
          <p>
            Buyout terms, including pricing, will be negotiated in good faith and documented in a
            separate Buyout Agreement.
          </p>
        </section>

        {/* 3. Acceptable Use */}
        <section>
          <h2 className="text-xl font-semibold text-foreground">3. Acceptable Use</h2>
          <h3 className="text-lg font-medium text-foreground mt-4">3.1 Prohibited Uses</h3>
          <p>Client shall not use the Service to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Build or host applications that facilitate illegal activity, fraud, or money
              laundering.
            </li>
            <li>
              Distribute child sexual abuse material (CSAM) or any content exploiting minors.
            </li>
            <li>Conduct phishing, spamming, or social-engineering attacks.</li>
            <li>Host malware, ransomware, or other malicious software.</li>
            <li>Infringe on third-party intellectual property rights.</li>
            <li>Engage in harassment, hate speech, or incitement of violence.</li>
            <li>Operate applications that violate export control or sanctions laws.</li>
            <li>Resell or redistribute Devlop&apos;s services without authorization.</li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mt-4">3.2 Resource Abuse</h3>
          <p>
            Client shall not intentionally overload, disrupt, or abuse platform resources beyond
            reasonable use for their subscription tier.
          </p>
        </section>

        {/* 4. Takedown Rights */}
        <section>
          <h2 className="text-xl font-semibold text-foreground">4. Takedown Rights</h2>
          <h3 className="text-lg font-medium text-foreground mt-4">4.1 Provider Takedown</h3>
          <p>
            Devlop reserves the right to suspend or take down any application immediately and
            without prior notice if:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The application violates the Acceptable Use provisions of this Agreement.</li>
            <li>
              Devlop receives a valid legal complaint, DMCA notice, or law-enforcement request.
            </li>
            <li>
              The application poses a security threat to the platform or other clients.
            </li>
            <li>Client is in material breach of this Agreement.</li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mt-4">4.2 Notice and Cure</h3>
          <p>
            For non-emergency violations, Devlop will provide written notice and a reasonable
            cure period (not less than 5 business days) before taking action. Emergency takedowns
            (security threats, illegal content) may occur without prior notice.
          </p>

          <h3 className="text-lg font-medium text-foreground mt-4">4.3 Data Preservation</h3>
          <p>
            Upon takedown, Devlop will preserve Client&apos;s content and end-user data for a
            minimum of 30 days and make it available for export upon request.
          </p>
        </section>

        {/* 5. Data Processing Terms */}
        <section>
          <h2 className="text-xl font-semibold text-foreground">5. Data Processing Terms</h2>
          <h3 className="text-lg font-medium text-foreground mt-4">5.1 Roles</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Client is the Data Controller.</strong> Client determines the purposes and
              means of processing end-user personal data collected through the application.
            </li>
            <li>
              <strong>Devlop is the Data Processor.</strong> Devlop processes personal data
              solely on behalf of and under the instructions of Client.
            </li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mt-4">
            5.2 Processing Obligations
          </h3>
          <p>As Data Processor, Devlop shall:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Process personal data only on documented instructions from Client.</li>
            <li>
              Ensure that persons authorized to process personal data are bound by
              confidentiality obligations.
            </li>
            <li>
              Implement appropriate technical and organizational security measures.
            </li>
            <li>
              Not engage sub-processors without Client&apos;s prior written consent.
            </li>
            <li>Assist Client in responding to data subject requests.</li>
            <li>
              Delete or return all personal data upon termination of the Agreement, at
              Client&apos;s choice.
            </li>
            <li>
              Make available to Client all information necessary to demonstrate compliance with
              data-processing obligations.
            </li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mt-4">
            5.3 Data Breach Notification
          </h3>
          <p>
            Devlop will notify Client without undue delay (and in no event later than 72 hours)
            upon becoming aware of a personal data breach affecting Client&apos;s data.
          </p>

          <h3 className="text-lg font-medium text-foreground mt-4">
            5.4 International Transfers
          </h3>
          <p>
            Devlop will not transfer personal data to a jurisdiction outside the Client&apos;s
            jurisdiction without appropriate safeguards (e.g., Standard Contractual Clauses,
            adequacy decisions).
          </p>
        </section>

        {/* 6-12 remaining sections */}
        <section>
          <h2 className="text-xl font-semibold text-foreground">6. Subscription and Credits</h2>
          <p>
            All subscriptions are billed monthly in advance. Credits are included per
            subscription tier and expire at the end of each billing cycle unless otherwise
            agreed. Additional credits may be purchased at the applicable rate.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            7. Warranties and Disclaimers
          </h2>
          <p>
            Devlop warrants that the Service will be performed in a professional and workmanlike
            manner consistent with industry standards.
          </p>
          <p className="uppercase text-xs tracking-wide mt-2">
            Except as expressly set forth in this Agreement, the Service is provided &quot;as
            is&quot; without warranties of any kind, express or implied.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">8. Limitation of Liability</h2>
          <p className="uppercase text-xs tracking-wide">
            To the maximum extent permitted by law, Devlop&apos;s aggregate liability under this
            Agreement shall not exceed the total fees paid by Client in the twelve (12) months
            preceding the event giving rise to liability.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">9. Term and Termination</h2>
          <p>
            Either party may terminate this Agreement with 30 days&apos; written notice. Upon
            termination, Client&apos;s access to the application ceases. Client may export
            content and end-user data within 30 days. Devlop retains all IP in the application
            code unless a buyout was completed.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            10. Governing Law and Disputes
          </h2>
          <p>
            This Agreement shall be governed by the laws of the State of Delaware, United States.
            Disputes shall be resolved through binding arbitration administered by JAMS under its
            Comprehensive Arbitration Rules.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">11. General Provisions</h2>
          <p>
            This Agreement, together with the Terms of Service and Privacy Policy, constitutes
            the entire agreement between the parties. If any provision is found unenforceable,
            the remaining provisions continue in effect. Client may not assign this Agreement
            without Devlop&apos;s prior written consent.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">12. Contact</h2>
          <p>
            For questions about this Agreement, contact us at{" "}
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
