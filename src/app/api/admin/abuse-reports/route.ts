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
    .from("abuse_reports")
    .select("*")
    .order("created_at", { ascending: false });

  return NextResponse.json({ reports: data ?? [] });
}
