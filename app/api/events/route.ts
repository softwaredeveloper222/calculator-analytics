import { NextRequest, NextResponse } from "next/server";
import { verifyIngestAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ingestPayloadSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  if (!verifyIngestAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = ingestPayloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const { events } = parsed.data;

  try {
    const result = await prisma.analyticsEvent.createMany({
      data: events.map((event) => ({
        event: event.event,
        calculatorId: event.calculatorId ?? null,
        sessionId: event.sessionId,
        deviceId: event.deviceId,
        appVersion: event.appVersion ?? null,
        platform: event.platform,
        deviceManufacturer: event.deviceManufacturer ?? null,
        deviceModel: event.deviceModel ?? null,
        deviceBrand: event.deviceBrand ?? null,
        osVersion: event.osVersion ?? null,
        durationMs: event.durationMs ?? null,
        success: event.success ?? null,
        metadata: event.metadata ? JSON.stringify(event.metadata) : null,
        createdAt: event.timestamp ? new Date(event.timestamp) : undefined,
      })),
    });

    return NextResponse.json(
      {
        accepted: result.count,
        message: "Events stored successfully",
      },
      { status: 202 },
    );
  } catch (error) {
    console.error("Failed to store analytics events:", error);
    return NextResponse.json(
      { error: "Failed to store events" },
      { status: 500 },
    );
  }
}
