import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

const TIER_CREDITS: Record<string, number> = {
  starter: 5,
  growth: 20,
  scale: 50,
};

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

  if (!user) {
    return NextResponse.json({ balance: 0, total: 0 });
  }

  const { data: orgs } = await supabase
    .from("organizations")
    .select("id")
    .eq("owner_id", user.id);

  const orgIds = orgs?.map((o) => o.id) ?? [];
  if (orgIds.length === 0) {
    return NextResponse.json({ balance: 0, total: 0 });
  }

  const { data: projects } = await supabase
    .from("projects")
    .select("id, tier")
    .in("org_id", orgIds)
    .limit(1);

  const project = projects?.[0];
  if (!project) {
    return NextResponse.json({ balance: 0, total: 0 });
  }

  const { data: ledger } = await supabase
    .from("credit_ledger")
    .select("amount")
    .eq("project_id", project.id);

  const balance = ledger?.reduce((sum, row) => sum + Number(row.amount), 0) ?? 0;
  const total = TIER_CREDITS[project.tier] ?? 0;

  return NextResponse.json({ balance, total });
}
