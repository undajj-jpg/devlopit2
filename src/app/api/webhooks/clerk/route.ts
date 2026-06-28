import { headers } from "next/headers";
import { Webhook } from "svix";
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses?: Array<{ email_address: string }>;
    first_name?: string | null;
    last_name?: string | null;
    unsafe_metadata?: { timezone?: string };
  };
}

export async function POST(req: Request) {
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  let evt: ClerkWebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServiceClient();

  if (evt.type === "user.created" || evt.type === "user.updated") {
    const { id, email_addresses, first_name, last_name, unsafe_metadata } = evt.data;
    const email = email_addresses?.[0]?.email_address ?? "";
    const name = [first_name, last_name].filter(Boolean).join(" ") || null;
    const timezone = unsafe_metadata?.timezone ?? "UTC";

    await supabase.from("users").upsert(
      {
        clerk_id: id,
        email,
        name,
        timezone,
        role: "client",
      },
      { onConflict: "clerk_id" }
    );
  }

  if (evt.type === "user.deleted") {
    await supabase.from("users").delete().eq("clerk_id", evt.data.id);
  }

  return NextResponse.json({ received: true });
}
