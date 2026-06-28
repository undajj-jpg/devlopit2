import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" as any });

const TIER_CREDITS: Record<string, number> = {
  starter: 5,
  growth: 20,
  scale: 50,
};

const GRACE_PERIOD_DAYS = 5;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServiceClient();

  switch (event.type) {
    case "invoice.payment_succeeded": {
      const invoice = event.data.object as any;
      const subId = invoice.subscription as string;

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("project_id, tier")
        .eq("stripe_subscription_id", subId)
        .single();

      if (sub) {
        const credits = TIER_CREDITS[sub.tier] ?? 0;

        await supabase.from("credit_ledger").insert({
          project_id: sub.project_id,
          type: "monthly_grant",
          amount: credits,
          description: `Monthly credit grant (${sub.tier})`,
        });

        await supabase
          .from("projects")
          .update({
            status: "active",
            months_paid: (await supabase.from("projects").select("months_paid").eq("id", sub.project_id).single()).data?.months_paid! + 1,
          })
          .eq("id", sub.project_id);
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as any;
      const subId = invoice.subscription as string;

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("project_id")
        .eq("stripe_subscription_id", subId)
        .single();

      if (sub) {
        await supabase
          .from("projects")
          .update({ status: "past_due" })
          .eq("id", sub.project_id);

        // Schedule grace period check via audit log (Trigger.dev job picks this up)
        await supabase.from("audit_log").insert({
          project_id: sub.project_id,
          action: "payment_failed_grace_start",
          payload: {
            grace_ends_at: new Date(
              Date.now() + GRACE_PERIOD_DAYS * 86400000
            ).toISOString(),
          },
        });
      }
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as any;
      await supabase
        .from("subscriptions")
        .update({
          status: sub.status,
          current_period_start: new Date(
            sub.current_period_start * 1000
          ).toISOString(),
          current_period_end: new Date(
            sub.current_period_end * 1000
          ).toISOString(),
          cancel_at_period_end: sub.cancel_at_period_end,
        })
        .eq("stripe_subscription_id", sub.id);
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as any;

      const { data: dbSub } = await supabase
        .from("subscriptions")
        .select("project_id")
        .eq("stripe_subscription_id", sub.id)
        .single();

      await supabase
        .from("subscriptions")
        .update({ status: "canceled" })
        .eq("stripe_subscription_id", sub.id);

      if (dbSub) {
        await supabase
          .from("projects")
          .update({ status: "paused" })
          .eq("id", dbSub.project_id);
      }
      break;
    }

    case "charge.dispute.created": {
      const dispute = event.data.object as any;
      const chargeId =
        typeof dispute.charge === "string"
          ? dispute.charge
          : dispute.charge?.id;

      // Find project by customer
      const customerId =
        typeof dispute.customer === "string"
          ? dispute.customer
          : (dispute.customer as any)?.id;

      if (customerId) {
        const { data: org } = await supabase
          .from("organizations")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (org) {
          const { data: projects } = await supabase
            .from("projects")
            .select("id")
            .eq("org_id", org.id);

          for (const p of projects ?? []) {
            await supabase
              .from("projects")
              .update({ status: "paused" })
              .eq("id", p.id);

            await supabase.from("audit_log").insert({
              project_id: p.id,
              action: "chargeback_received",
              payload: { charge_id: chargeId, dispute_id: dispute.id },
            });
          }
        }
      }
      break;
    }

    case "charge.refunded": {
      const charge = event.data.object as any;
      const customerId =
        typeof charge.customer === "string"
          ? charge.customer
          : (charge.customer as any)?.id;

      if (customerId) {
        const { data: org } = await supabase
          .from("organizations")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (org) {
          const { data: projects } = await supabase
            .from("projects")
            .select("id")
            .eq("org_id", org.id)
            .limit(1);

          if (projects?.[0]) {
            await supabase.from("credit_ledger").insert({
              project_id: projects[0].id,
              type: "refund",
              amount: 0,
              description: `Refund processed for charge ${charge.id}`,
            });
          }
        }
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
