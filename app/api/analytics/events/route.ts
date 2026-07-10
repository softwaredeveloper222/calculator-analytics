import { NextRequest, NextResponse } from "next/server";
import { deleteAnalyticsEvents, getEventHistory } from "@/lib/analytics-queries";
import { deleteEventsSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const page = request.nextUrl.searchParams.get("page") ?? undefined;
  const pageSize = request.nextUrl.searchParams.get("pageSize") ?? undefined;

  const history = await getEventHistory(page, pageSize);
  return NextResponse.json(history);
}

export async function DELETE(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = deleteEventsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const result = await deleteAnalyticsEvents(parsed.data.ids);
    return NextResponse.json({
      deleted: result.deleted,
      message: "Events deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete analytics events:", error);
    return NextResponse.json(
      { error: "Failed to delete events" },
      { status: 500 },
    );
  }
}
