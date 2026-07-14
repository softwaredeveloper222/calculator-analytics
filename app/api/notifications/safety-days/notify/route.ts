import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { publishSafetyDaysPage } from "@/lib/notifications";
import { sendSafetyDaysPush } from "@/lib/onesignal";

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
    });

    return NextResponse.json({
      ok: true,
      version: page.version,
      publishedAt: page.publishedAt,
      page,
      push,
      message: push.sent
        ? "Notification published and push sent to mobile apps"
        : "Notification published for the mobile app",
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
