import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "hello@devlop.app",
    to,
    subject,
    html,
  });
}

function wrap(content: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #e5e7eb; background-color: #0a0a0a;">
      <div style="margin-bottom: 32px;">
        <strong style="font-size: 20px; color: #fff;">Devlop</strong>
      </div>
      ${content}
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #1f2937; font-size: 12px; color: #6b7280;">
        <p>Devlop — Your agency, powered by AI</p>
      </div>
    </div>
  `;
}

export const emailTemplates = {
  buildStarted: (projectName: string) => ({
    subject: `Build started: ${projectName}`,
    html: wrap(`
      <h2 style="color: #fff;">Your build has started!</h2>
      <p>We're now building <strong>${projectName}</strong>. You'll receive an email when your project is live.</p>
      <p>This typically takes up to 10 days.</p>
    `),
  }),

  buildFailed: (projectName: string) => ({
    subject: `Build update: ${projectName}`,
    html: wrap(`
      <h2 style="color: #fff;">We hit a snag</h2>
      <p>We encountered an issue building <strong>${projectName}</strong>. Our team is already on it.</p>
      <p>We'll notify you as soon as it's resolved. No action is needed from you.</p>
    `),
  }),

  projectDeployed: (projectName: string, url: string) => ({
    subject: `${projectName} is live! Your trial starts now`,
    html: wrap(`
      <h2 style="color: #fff;">Your project is live!</h2>
      <p><strong>${projectName}</strong> has been deployed and your 10-day free trial has started.</p>
      <p><a href="${url}" style="color: #3b82f6;">View your project →</a></p>
      <p>Log in to your portal to manage your project and request changes.</p>
    `),
  }),

  trialDay8: (projectName: string) => ({
    subject: `2 days left on your ${projectName} trial`,
    html: wrap(`
      <h2 style="color: #fff;">2 days remaining</h2>
      <p>Your free trial for <strong>${projectName}</strong> ends in 2 days.</p>
      <p>Subscribe now to keep your project running and continue making changes.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/portal/billing" style="color: #3b82f6;">Subscribe →</a></p>
    `),
  }),

  trialDay10: (projectName: string) => ({
    subject: `Your ${projectName} trial ends today`,
    html: wrap(`
      <h2 style="color: #fff;">Trial ends today</h2>
      <p>Your free trial for <strong>${projectName}</strong> ends today.</p>
      <p>Subscribe to keep your project live. Without a subscription, your site will show a maintenance page.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/portal/billing" style="color: #3b82f6;">Subscribe now →</a></p>
    `),
  }),

  subscriptionConfirmed: (projectName: string, tier: string) => ({
    subject: `Subscription confirmed: ${projectName}`,
    html: wrap(`
      <h2 style="color: #fff;">You're subscribed!</h2>
      <p>Your <strong>${tier}</strong> subscription for <strong>${projectName}</strong> is active. Credits have been added to your account.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/portal/dashboard" style="color: #3b82f6;">Go to dashboard →</a></p>
    `),
  }),

  paymentFailed: (projectName: string) => ({
    subject: `Action needed: Payment failed for ${projectName}`,
    html: wrap(`
      <h2 style="color: #fff;">Payment failed</h2>
      <p>We couldn't process payment for <strong>${projectName}</strong>. Please update your billing information to avoid your site entering maintenance mode.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/portal/billing" style="color: #3b82f6;">Update billing →</a></p>
    `),
  }),

  enteredMaintenance: (projectName: string) => ({
    subject: `${projectName} is paused`,
    html: wrap(`
      <h2 style="color: #fff;">Your site is paused</h2>
      <p><strong>${projectName}</strong> is now showing a maintenance page to visitors.</p>
      <p>To reactivate, clear your outstanding invoice.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/portal/billing" style="color: #3b82f6;">Reactivate →</a></p>
    `),
  }),

  creditsLow: (projectName: string, remaining: number) => ({
    subject: `Running low on credits: ${projectName}`,
    html: wrap(`
      <h2 style="color: #fff;">Credits running low</h2>
      <p>You have <strong>${remaining} credits</strong> remaining for <strong>${projectName}</strong> this month.</p>
      <p>Top up credits or wait for your next billing cycle reset.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/portal/billing" style="color: #3b82f6;">Top up credits →</a></p>
    `),
  }),

  changeApproved: (title: string) => ({
    subject: `Change in progress: ${title}`,
    html: wrap(`
      <h2 style="color: #fff;">Your change is in progress</h2>
      <p>The change request "<strong>${title}</strong>" has been approved and a developer is working on it.</p>
    `),
  }),

  changeReadyForReview: (title: string, stagingUrl: string) => ({
    subject: `Review your change: ${title}`,
    html: wrap(`
      <h2 style="color: #fff;">Ready for review</h2>
      <p>"<strong>${title}</strong>" is ready for your review on staging.</p>
      <p><a href="${stagingUrl}" style="color: #3b82f6;">Review on staging →</a></p>
    `),
  }),

  changeDone: (title: string) => ({
    subject: `Change live: ${title}`,
    html: wrap(`
      <h2 style="color: #fff;">Your change is live!</h2>
      <p>"<strong>${title}</strong>" has been deployed to production.</p>
    `),
  }),

  disputeResolved: (title: string, newCredits: number) => ({
    subject: `Estimate updated: ${title}`,
    html: wrap(`
      <h2 style="color: #fff;">Estimate updated</h2>
      <p>The estimate for "<strong>${title}</strong>" has been reviewed. The updated cost is <strong>${newCredits} credits</strong>.</p>
      <p>Please approve the request in your portal to proceed.</p>
    `),
  }),

  buyoutEligible: (projectName: string) => ({
    subject: `You can now own ${projectName}`,
    html: wrap(`
      <h2 style="color: #fff;">Buyout available!</h2>
      <p>You've completed 12 months of payments for <strong>${projectName}</strong>. You can now request full ownership of your software.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/portal/billing" style="color: #3b82f6;">Request buyout →</a></p>
    `),
  }),

  referralReward: (credits: number) => ({
    subject: "You earned referral credits!",
    html: wrap(`
      <h2 style="color: #fff;">Referral reward!</h2>
      <p>A referral you made just subscribed. You've earned <strong>${credits} bonus credits</strong>!</p>
    `),
  }),
};
