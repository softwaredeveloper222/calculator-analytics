import { NextRequest, NextResponse } from "next/server";
import { safetyDaysInputSchema } from "@/lib/notification-validators";
import {
  ensureSafetyDaysPage,
  saveSafetyDaysPage,
} from "@/lib/notifications";
import { getServerSession } from "@/lib/session";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const page = await ensureSafetyDaysPage();
    return NextResponse.json(page);
  } catch (error) {
    console.error("Failed to load Safety Days page:", error);
    return NextResponse.json(
      { error: "Failed to load notification page" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = safetyDaysInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = {
    ...parsed.data,
    registerUrl: parsed.data.registerUrl || null,
    hotelsUrl: parsed.data.hotelsUrl || null,
    heroImageUrl: parsed.data.heroImageUrl || null,
    images: parsed.data.images ?? [],
  };

  try {
    const page = await saveSafetyDaysPage(data);
    return NextResponse.json(page);
  } catch (error) {
    console.error("Failed to save Safety Days page:", error);
    return NextResponse.json(
      { error: "Failed to save notification page" },
      { status: 500 },
    );
  }
}
