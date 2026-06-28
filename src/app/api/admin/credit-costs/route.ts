import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();

  const { data } = await supabase
    .from("credit_cost_types")
    .select("*")
    .order("credits", { ascending: true });

  return NextResponse.json({ costTypes: data ?? [] });
}

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, credits } = await req.json();
  if (!id || credits == null) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supabase = createServiceClient();

  await supabase
    .from("credit_cost_types")
    .update({ credits, updated_at: new Date().toISOString() })
    .eq("id", id);

  await supabase.from("audit_log").insert({
    actor_id: userId,
    action: "credit_cost_updated",
    payload: { credit_cost_type_id: id, new_credits: credits },
  });

  return NextResponse.json({ success: true });
}
