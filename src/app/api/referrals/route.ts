import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

function generateCode(): string {
  return "DVL-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();

  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single();

  if (!user) return NextResponse.json({ code: null });

  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!org) return NextResponse.json({ code: null });

  const { data: referral } = await supabase
    .from("referrals")
    .select("code")
    .eq("referrer_org_id", org.id)
    .single();

  return NextResponse.json({ code: referral?.code ?? null });
}

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();

  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!org) {
    return NextResponse.json({ error: "No org found" }, { status: 404 });
  }

  const code = generateCode();

  const { error } = await supabase.from("referrals").insert({
    referrer_org_id: org.id,
    code,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ code });
}
