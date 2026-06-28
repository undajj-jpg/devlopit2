import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { reportedUrl, reporterEmail, reason } = await req.json();

  if (!reason) {
    return NextResponse.json({ error: "Reason required" }, { status: 400 });
  }

  const supabase = createServiceClient();

  await supabase.from("abuse_reports").insert({
    reported_url: reportedUrl ?? null,
    reporter_email: reporterEmail ?? null,
    reason,
  });

  return NextResponse.json({ received: true });
}
