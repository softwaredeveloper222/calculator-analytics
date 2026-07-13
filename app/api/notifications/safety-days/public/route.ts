import { NextRequest, NextResponse } from "next/server";
import { verifyIngestAuth } from "@/lib/auth";
import { ensureSafetyDaysPage } from "@/lib/notifications";

export async function GET(request: NextRequest) {
  if (!verifyIngestAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const page = await ensureSafetyDaysPage();
    return NextResponse.json({
      id: page.id,
      version: page.version,
      publishedAt: page.publishedAt,
      updatedAt: page.updatedAt,
      content: {
        title: page.title,
        subtitle: page.subtitle,
        eventName: page.eventName,
        dateLabel: page.dateLabel,
        location: page.location,
        priceAttendee: page.priceAttendee,
        priceExhibitor: page.priceExhibitor,
        bullets: page.bullets,
        registerUrl: page.registerUrl,
        hotelsUrl: page.hotelsUrl,
        bodyHtml: page.bodyHtml,
        heroImageUrl: page.heroImageUrl,
        images: page.images,
      },
    });
  } catch (error) {
    console.error("Failed to serve public Safety Days page:", error);
    return NextResponse.json(
      { error: "Failed to load notification" },
      { status: 500 },
    );
  }
}
