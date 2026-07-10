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

  const totalEvents = await prisma.analyticsEvent.count({ where });
  const pagination = buildPaginationMeta(totalEvents, { page, pageSize });
  const skip = (pagination.page - 1) * pagination.pageSize;

  const events = await prisma.analyticsEvent.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip,
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

  const [
    totalEvents,
    uniqueDevices,
    opensByCalculator,
    eventsByType,
    devicesRaw,
  ] = await Promise.all([
    prisma.analyticsEvent.count({ where }),
    prisma.analyticsEvent.groupBy({
      by: ["deviceId"],
      where,
    }),
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
      by: ["deviceId"],
      where,
      _count: { _all: true },
      orderBy: { _count: { deviceId: "desc" } },
    }),
  ]);

  const deviceIds = devicesRaw.map((row) => row.deviceId);
  const latestDeviceEvents =
    deviceIds.length > 0
      ? await prisma.analyticsEvent.findMany({
          where: { deviceId: { in: deviceIds } },
          distinct: ["deviceId"],
          orderBy: { createdAt: "desc" },
          select: {
            deviceId: true,
            deviceManufacturer: true,
            deviceModel: true,
            deviceBrand: true,
            osVersion: true,
          },
        })
      : [];
  const latestByDeviceId = new Map(
    latestDeviceEvents.map((event) => [event.deviceId, event]),
  );

  return {
    range: { from: rangeFrom.toISOString(), to: rangeTo.toISOString() },
    totalEvents,
    uniqueDevices: uniqueDevices.length,
    opensByCalculator: opensByCalculator.map((row) => ({
      calculatorId: row.calculatorId,
      count: row._count._all,
    })),
    eventsByType: eventsByType.map((row) => ({
      event: row.event,
      count: row._count._all,
    })),
    devices: devicesRaw.map((row) => {
      const latest = latestByDeviceId.get(row.deviceId);
      return {
        deviceId: row.deviceId,
        label: deviceLabel(
          latest?.deviceManufacturer ?? null,
          latest?.deviceModel ?? null,
          latest?.deviceBrand ?? null,
        ),
        manufacturer: latest?.deviceManufacturer ?? null,
        model: latest?.deviceModel ?? null,
        brand: latest?.deviceBrand ?? null,
        osVersion: latest?.osVersion ?? null,
        eventCount: row._count._all,
      };
    }),
  };
}

export type { PaginationMeta };
