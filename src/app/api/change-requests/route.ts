import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId");
  if (!projectId) {
    return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data } = await supabase
    .from("change_requests")
    .select("*")
    .eq("project_id", projectId)
    .order("kanban_order", { ascending: true });

  return NextResponse.json({ changeRequests: data ?? [] });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId, title, description, aiAnalysis, creditCost } =
    await req.json();

  if (!projectId || !title || !description) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
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

  const { data, error } = await supabase
    .from("change_requests")
    .insert({
      project_id: projectId,
      title,
      description,
      ai_analysis: aiAnalysis ?? null,
      credit_cost: creditCost ?? null,
      status: aiAnalysis ? "pending_approval" : "pending_estimate",
      kanban_column: "backlog",
      submitted_by: user.id,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, status, kanbanColumn, kanbanOrder } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const updates: Record<string, unknown> = {};
  if (status) updates.status = status;
  if (kanbanColumn) updates.kanban_column = kanbanColumn;
  if (kanbanOrder !== undefined) updates.kanban_order = kanbanOrder;

  if (status === "approved") {
    updates.approved_at = new Date().toISOString();

    const { data: cr } = await supabase
      .from("change_requests")
      .select("project_id, credit_cost")
      .eq("id", id)
      .single();

    if (cr?.credit_cost) {
      const { data: user } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", userId)
        .single();

      const { error: spendError } = await supabase.rpc("spend_credits", {
        p_project_id: cr.project_id,
        p_amount: cr.credit_cost,
        p_change_request_id: id,
        p_created_by: user?.id,
      });

      if (spendError) {
        return NextResponse.json(
          { error: spendError.message },
          { status: 400 }
        );
      }
    }
  }

  if (status === "done") {
    updates.completed_at = new Date().toISOString();
    updates.kanban_column = "done";
  }

  const { error } = await supabase
    .from("change_requests")
    .update(updates)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
