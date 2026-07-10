import { NextRequest, NextResponse } from "next/server";
import { verifyIngestAuth } from "@/lib/auth";
import { getAnalyticsOverview } from "@/lib/analytics-queries";

export async function GET(request: NextRequest) {
  if (!verifyIngestAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const fromParam = request.nextUrl.searchParams.get("from");
  const toParam = request.nextUrl.searchParams.get("to");

  const from = fromParam ? new Date(fromParam) : undefined;
  const to = toParam ? new Date(toParam) : undefined;

  if (
    (from && Number.isNaN(from.getTime())) ||
    (to && Number.isNaN(to.getTime()))
  ) {
    return NextResponse.json({ error: "Invalid date range" }, { status: 400 });
  }

  const overview = await getAnalyticsOverview(from, to);
  return NextResponse.json(overview);
}
