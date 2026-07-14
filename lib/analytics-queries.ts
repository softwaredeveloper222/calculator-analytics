import { prisma } from "@/lib/prisma";
import {
  buildPaginationMeta,
  normalizePagination,
  type PaginationMeta,
} from "@/lib/pagination";

const eventSelect = {
  id: true,
  event: true,
  calculatorId: true,
  deviceId: true,
  platform: true,
  deviceManufacturer: true,
  deviceModel: true,
  deviceBrand: true,
  osVersion: true,
  sessionId: true,
  durationMs: true,
  success: true,
  createdAt: true,
} as const;

function deviceLabel(
  manufacturer: string | null,
  model: string | null,
  brand: string | null,
) {
  const name = [manufacturer, model].filter(Boolean).join(" ").trim();
  if (name) return name;
  return brand ?? "Unknown device";
}

function mapEvent(event: {
  id: string;
  event: string;
  calculatorId: string | null;
  deviceId: string;
  platform: string;
  deviceManufacturer: string | null;
  deviceModel: string | null;
  deviceBrand: string | null;
  osVersion: string | null;
  sessionId: string;
  durationMs: number | null;
  success: boolean | null;
  createdAt: Date;
}) {
  return {
    ...event,
    deviceLabel: deviceLabel(
      event.deviceManufacturer,
      event.deviceModel,
      event.deviceBrand,
    ),
    createdAt: event.createdAt.toISOString(),
  };
}

export type HistoryFilters = {
  from?: Date;
  to?: Date;
  calculatorId?: string;
  event?: string;
};

export async function getEventHistory(
  pageInput?: string | number,
  pageSizeInput?: string | number,
  filters: HistoryFilters = {},
) {
  const { page, pageSize } = normalizePagination(pageInput, pageSizeInput);
  const rangeFrom = filters.from ?? new Date(Date.now() - 30 * 86_400_000);
  const rangeTo = filters.to ?? new Date();

  const where = {
    createdAt: {
      gte: rangeFrom,
      lte: rangeTo,
    },
    ...(filters.calculatorId
      ? { calculatorId: filters.calculatorId }
      : {}),
    ...(filters.event ? { event: filters.event } : {}),
  };

  // Count and page fetch in parallel; resolve page clamp after count returns.
  const [totalEvents, roughEvents] = await Promise.all([
    prisma.analyticsEvent.count({ where }),
    prisma.analyticsEvent.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: eventSelect,
    }),
  ]);

  const pagination = buildPaginationMeta(totalEvents, { page, pageSize });
  const safeSkip = (pagination.page - 1) * pagination.pageSize;
  const requestedSkip = (page - 1) * pageSize;

  const events =
    safeSkip === requestedSkip
      ? roughEvents
      : await prisma.analyticsEvent.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: safeSkip,
          take: pagination.pageSize,
          select: eventSelect,
        });

  return {
    range: { from: rangeFrom.toISOString(), to: rangeTo.toISOString() },
    events: events.map(mapEvent),
    pagination,
  };
}

export async function deleteAnalyticsEvents(ids: string[]) {
  const result = await prisma.analyticsEvent.deleteMany({
    where: { id: { in: ids } },
  });
  return { deleted: result.count };
}

export async function getAnalyticsOverview(from?: Date, to?: Date) {
  const rangeFrom = from ?? new Date(Date.now() - 30 * 86_400_000);
  const rangeTo = to ?? new Date();

  const where = {
    createdAt: {
      gte: rangeFrom,
      lte: rangeTo,
    },
  };

  const [totalEvents, opensByCalculator, eventsByType, platformRows, uniqueRows] =
    await Promise.all([
      prisma.analyticsEvent.count({ where }),
      prisma.analyticsEvent.groupBy({
        by: ["calculatorId"],
        where: {
          ...where,
          event: "calculator_opened",
          calculatorId: { not: null },
        },
        _count: { _all: true },
        orderBy: { _count: { calculatorId: "desc" } },
      }),
      prisma.analyticsEvent.groupBy({
        by: ["event"],
        where,
        _count: { _all: true },
        orderBy: { _count: { event: "desc" } },
      }),
      prisma.analyticsEvent.groupBy({
        by: ["platform"],
        where,
        _count: { _all: true },
        orderBy: { _count: { platform: "desc" } },
      }),
      prisma.$queryRaw<
        Array<{ platform: string; unique_devices: bigint }>
      >`
        SELECT
          COALESCE(LOWER("platform"), 'android') AS platform,
          COUNT(DISTINCT "deviceId")::bigint AS unique_devices
        FROM "AnalyticsEvent"
        WHERE "createdAt" >= ${rangeFrom}
          AND "createdAt" <= ${rangeTo}
        GROUP BY COALESCE(LOWER("platform"), 'android')
      `,
    ]);

  const eventCountByPlatform = new Map(
    platformRows.map((row) => [
      row.platform.toLowerCase(),
      row._count._all,
    ]),
  );
  const uniqueByPlatform = new Map(
    uniqueRows.map((row) => [
      row.platform.toLowerCase(),
      Number(row.unique_devices),
    ]),
  );

  const platforms = (
    [
      { id: "android", label: "Android" },
      { id: "ios", label: "iOS" },
    ] as const
  ).map((platform) => ({
    platform: platform.id,
    label: platform.label,
    eventCount: eventCountByPlatform.get(platform.id) ?? 0,
    uniqueDevices: uniqueByPlatform.get(platform.id) ?? 0,
  }));

  const uniqueDevices = platforms.reduce(
    (sum, platform) => sum + platform.uniqueDevices,
    0,
  );

  return {
    range: { from: rangeFrom.toISOString(), to: rangeTo.toISOString() },
    totalEvents,
    uniqueDevices,
    opensByCalculator: opensByCalculator.map((row) => ({
      calculatorId: row.calculatorId,
      count: row._count._all,
    })),
    eventsByType: eventsByType.map((row) => ({
      event: row.event,
      count: row._count._all,
    })),
    platforms,
  };
}

export type { PaginationMeta };
