import { NextRequest, NextResponse } from "next/server";
import { safetyDaysInputSchema } from "@/lib/notification-validators";
import {
  createNotificationPage,
  listNotificationPagesPaginated,
} from "@/lib/notifications";
import { getServerSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = request.nextUrl;
    const result = await listNotificationPagesPaginated(
      searchParams.get("page") ?? undefined,
      searchParams.get("pageSize") ?? undefined,
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to list notification pages:", error);
    return NextResponse.json(
      { error: "Failed to list notification pages" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown = {};
  try {
    const text = await request.text();
    if (text.trim()) body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = safetyDaysInputSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const page = await createNotificationPage(parsed.data);
    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error("Failed to create notification page:", error);
    return NextResponse.json(
      { error: "Failed to create notification page" },
      { status: 500 },
    );
  }
}
