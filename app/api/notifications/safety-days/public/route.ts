import { NextRequest, NextResponse } from "next/server";
import { verifyIngestAuth } from "@/lib/auth";
import {
  getPublicNotificationPage,
  listNotificationPages,
} from "@/lib/notifications";

function toPublicPayload(page: NonNullable<
  Awaited<ReturnType<typeof getPublicNotificationPage>>
>) {
  return {
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
  };
}

export async function GET(request: NextRequest) {
  if (!verifyIngestAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get("id");
  const list = request.nextUrl.searchParams.get("list");

  try {
    if (list === "1" || list === "true") {
      const pages = await listNotificationPages();
      return NextResponse.json({
        pages: pages.map((page) => ({
          id: page.id,
          title: page.title,
          version: page.version,
          publishedAt: page.publishedAt,
          updatedAt: page.updatedAt,
        })),
      });
    }

    const page = await getPublicNotificationPage(id);
    if (!page) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(toPublicPayload(page));
  } catch (error) {
    console.error("Failed to serve public Safety Days page:", error);
    return NextResponse.json(
      { error: "Failed to load notification" },
      { status: 500 },
    );
  }
}
