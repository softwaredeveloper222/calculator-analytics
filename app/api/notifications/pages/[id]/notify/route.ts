import { NextRequest, NextResponse } from "next/server";
import { publishNotificationPage } from "@/lib/notifications";
import { sendSafetyDaysPush } from "@/lib/onesignal";
import { getServerSession } from "@/lib/session";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: NextRequest, context: RouteContext) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const page = await publishNotificationPage(id);
    if (!page) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const push = await sendSafetyDaysPush({
      version: page.version,
      title: page.title,
      dateLabel: page.dateLabel,
      contentId: page.id,
    });

    return NextResponse.json({
      ok: true,
      version: page.version,
      publishedAt: page.publishedAt,
      page,
      push,
      message: push.sent
        ? "Notification published and push sent to OneSignal"
        : "Content published, but OneSignal did not create a push message",
      warning: push.warning ?? push.error ?? undefined,
    });
  } catch (error) {
    console.error("Failed to publish notification page:", error);
    return NextResponse.json(
      { error: "Failed to publish notification" },
      { status: 500 },
    );
  }
}
