import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { publishSafetyDaysPage } from "@/lib/notifications";

export async function POST() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const page = await publishSafetyDaysPage();
    return NextResponse.json({
      ok: true,
      version: page.version,
      publishedAt: page.publishedAt,
      page,
      message: "Notification published for the mobile app",
    });
  } catch (error) {
    console.error("Failed to publish Safety Days page:", error);
    return NextResponse.json(
      { error: "Failed to publish notification" },
      { status: 500 },
    );
  }
}
