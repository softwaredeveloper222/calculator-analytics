import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { publishSafetyDaysPage } from "@/lib/notifications";
import { sendSafetyDaysPush } from "@/lib/onesignal";

/** @deprecated Prefer POST /api/notifications/pages/[id]/notify */
export async function POST() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const page = await publishSafetyDaysPage();
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
    console.error("Failed to publish Safety Days page:", error);
    return NextResponse.json(
      { error: "Failed to publish notification" },
      { status: 500 },
    );
  }
}
