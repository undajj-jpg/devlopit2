import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

const TIER_PRICES: Record<string, number> = {
  starter: 99,
  growth: 299,
  scale: 799,
};

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();

  const { data: adminUser } = await supabase
    .from("users")
    .select("role")
    .eq("clerk_id", userId)
    .single();

  if (!adminUser || adminUser.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: projects } = await supabase.from("projects").select("tier, status");

  const allProjects = projects ?? [];
  const activeProjects = allProjects.filter((p) => p.status === "active");
  const trialProjects = allProjects.filter((p) => p.status === "trial");

  const mrrByTier: Record<string, number> = { starter: 0, growth: 0, scale: 0 };
  for (const p of activeProjects) {
    mrrByTier[p.tier] = (mrrByTier[p.tier] ?? 0) + (TIER_PRICES[p.tier] ?? 0);
  }

  const mrr = Object.values(mrrByTier).reduce((a, b) => a + b, 0);

  const totalEverActive = allProjects.filter((p) =>
    ["active", "past_due", "paused", "archived"].includes(p.status)
  ).length;

  const trialConversion =
    totalEverActive > 0
      ? Math.round((activeProjects.length / (totalEverActive + trialProjects.length)) * 100)
      : 0;

  return NextResponse.json({
    mrr,
    mrrByTier,
    trialConversion,
    activeProjects: activeProjects.length,
    trialProjects: trialProjects.length,
    churn30d: 0,
    creditUtilization: 0,
  });
}
