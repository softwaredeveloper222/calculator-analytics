import { NextRequest, NextResponse } from "next/server";
import { safetyDaysInputSchema } from "@/lib/notification-validators";
import {
  deleteNotificationPage,
  getNotificationPage,
  updateNotificationPage,
} from "@/lib/notifications";
import { getServerSession } from "@/lib/session";
import { Prisma } from "@prisma/client";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const page = await getNotificationPage(id);
    if (!page) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(page);
  } catch (error) {
    console.error("Failed to load notification page:", error);
    return NextResponse.json(
      { error: "Failed to load notification page" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

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
    const page = await updateNotificationPage(id, data);
    return NextResponse.json(page);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("Failed to save notification page:", error);
    return NextResponse.json(
      { error: "Failed to save notification page" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    await deleteNotificationPage(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("Failed to delete notification page:", error);
    return NextResponse.json(
      { error: "Failed to delete notification page" },
      { status: 500 },
    );
  }
}
