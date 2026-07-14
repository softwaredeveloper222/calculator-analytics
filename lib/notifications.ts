import { prisma } from "@/lib/prisma";
import {
  MAX_PAGE_SIZE,
  buildPaginationMeta,
  normalizePagination,
} from "@/lib/pagination";

export const SAFETY_DAYS_ID = "safety-days";

export type SafetyDaysImage = {
  url: string;
  alt?: string;
};

export type SafetyDaysContent = {
  id: string;
  title: string;
  subtitle: string | null;
  eventName: string | null;
  dateLabel: string | null;
  location: string | null;
  priceAttendee: string | null;
  priceExhibitor: string | null;
  bullets: string[];
  registerUrl: string | null;
  hotelsUrl: string | null;
  bodyHtml: string | null;
  heroImageUrl: string | null;
  images: SafetyDaysImage[];
  version: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NotificationListItem = {
  id: string;
  title: string;
  subtitle: string | null;
  eventName: string | null;
  dateLabel: string | null;
  version: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  imageCount: number;
};

export type SafetyDaysInput = {
  title: string;
  subtitle?: string | null;
  eventName?: string | null;
  dateLabel?: string | null;
  location?: string | null;
  priceAttendee?: string | null;
  priceExhibitor?: string | null;
  bullets: string[];
  registerUrl?: string | null;
  hotelsUrl?: string | null;
  bodyHtml?: string | null;
  heroImageUrl?: string | null;
  images?: SafetyDaysImage[];
};

const DEFAULT_IMAGES: SafetyDaysImage[] = [
  {
    url: "https://gcaptraining.com/wp-content/uploads/2026/06/14th-Annual-GCAP-Safety-Day-in-St.-Joseph-MO-6.9.26.jpg",
    alt: "14th Annual GCAP Safety Day in St. Joseph, MO",
  },
  {
    url: "https://gcaptraining.com/wp-content/uploads/2025/06/Snapchat-833748486-1.jpg",
    alt: "Safety Day photo",
  },
  {
    url: "https://gcaptraining.com/wp-content/uploads/2025/06/St-Joseph-MO-1.jpg",
    alt: "St. Joseph, MO Safety Day",
  },
  {
    url: "https://gcaptraining.com/wp-content/uploads/2025/08/tshirt-front-e1756154518275.jpg",
    alt: "Safety Day t-shirt",
  },
  {
    url: "https://gcaptraining.com/wp-content/uploads/2026/04/Snapchat-2111435351.jpg",
    alt: "Safety Day gallery photo",
  },
  {
    url: "https://gcaptraining.com/wp-content/uploads/2026/04/Snapchat-2056565722.jpg",
    alt: "Safety Day gallery photo",
  },
  {
    url: "https://gcaptraining.com/wp-content/uploads/2026/04/Snapchat-1961713283.jpg",
    alt: "Safety Day gallery photo",
  },
  {
    url: "https://gcaptraining.com/wp-content/uploads/2026/04/Snapchat-1870654454.jpg",
    alt: "Safety Day gallery photo",
  },
  {
    url: "https://gcaptraining.com/wp-content/uploads/2026/04/Snapchat-465483248.jpg",
    alt: "Safety Day gallery photo",
  },
  {
    url: "https://gcaptraining.com/wp-content/uploads/2026/04/Snapchat-755834634.jpg",
    alt: "Safety Day gallery photo",
  },
  {
    url: "https://gcaptraining.com/wp-content/uploads/2026/04/Snapchat-233803630.jpg",
    alt: "Safety Day gallery photo",
  },
  {
    url: "https://gcaptraining.com/wp-content/uploads/2026/04/Snapchat-101738183.jpg",
    alt: "Safety Day gallery photo",
  },
  {
    url: "https://gcaptraining.com/wp-content/uploads/2026/04/Snapchat-485458706.jpg",
    alt: "Safety Day gallery photo",
  },
  {
    url: "https://gcaptraining.com/wp-content/uploads/2026/04/Snapchat-1157852668.jpg",
    alt: "Safety Day gallery photo",
  },
  {
    url: "https://gcaptraining.com/wp-content/uploads/2026/04/Snapchat-1565263054.jpg",
    alt: "Safety Day gallery photo",
  },
  {
    url: "https://gcaptraining.com/wp-content/uploads/2026/04/Snapchat-1483500235.jpg",
    alt: "Safety Day gallery photo",
  },
  {
    url: "https://gcaptraining.com/wp-content/uploads/2026/04/Snapchat-1904000601.jpg",
    alt: "Safety Day gallery photo",
  },
  {
    url: "https://gcaptraining.com/wp-content/uploads/2026/04/Snapchat-995854344-rotated.jpg",
    alt: "Safety Day gallery photo",
  },
  {
    url: "https://gcaptraining.com/wp-content/uploads/2026/04/Snapchat-199912420-rotated.jpg",
    alt: "Safety Day gallery photo",
  },
  {
    url: "https://gcaptraining.com/wp-content/uploads/2026/04/Snapchat-200209200-rotated.jpg",
    alt: "Safety Day gallery photo",
  },
  {
    url: "https://gcaptraining.com/wp-content/uploads/2026/04/Snapchat-226922315-rotated.jpg",
    alt: "Safety Day gallery photo",
  },
  {
    url: "https://gcaptraining.com/wp-content/uploads/2026/04/Snapchat-458700810.jpg",
    alt: "Safety Day gallery photo",
  },
  {
    url: "https://gcaptraining.com/wp-content/uploads/2026/04/20250610_190830-scaled.jpg",
    alt: "Safety Day gallery photo",
  },
  {
    url: "https://gcaptraining.com/wp-content/uploads/2026/04/Snapchat-588946845.jpg",
    alt: "Safety Day gallery photo",
  },
  {
    url: "https://gcaptraining.com/wp-content/uploads/2026/04/Anthony-Sullivan-2.jpg",
    alt: "Anthony Sullivan",
  },
  {
    url: "https://gcaptraining.com/wp-content/uploads/2026/04/20250611_081725-scaled.jpg",
    alt: "Safety Day gallery photo",
  },
  {
    url: "https://gcaptraining.com/wp-content/uploads/2026/04/20250610_190846-scaled.jpg",
    alt: "Safety Day gallery photo",
  },
  {
    url: "https://gcaptraining.com/wp-content/uploads/2026/04/Snapchat-1672393435.jpg",
    alt: "Safety Day gallery photo",
  },
  {
    url: "https://gcaptraining.com/wp-content/uploads/2026/04/Snapchat-1389044462-rotated.jpg",
    alt: "Safety Day gallery photo",
  },
  {
    url: "https://gcaptraining.com/wp-content/uploads/2026/04/Snapchat-1258905889.jpg",
    alt: "Safety Day gallery photo",
  },
  {
    url: "https://gcaptraining.com/wp-content/uploads/2026/04/Snapchat-1130587544-rotated.jpg",
    alt: "Safety Day gallery photo",
  },
  {
    url: "https://gcaptraining.com/wp-content/uploads/2026/06/Thank-you-to-our-core-sponsors6.2.26.jpg",
    alt: "Thank you to our core sponsors",
  },
];

/** Template copied from https://gcaptraining.com/safety-days/ */
const DEFAULT_CONTENT: SafetyDaysInput = {
  title: "Ammonia Safety Days",
  subtitle:
    "Come join us for a day filled with training opportunities, free merch, meet with local vendors, and enter to win numerous prizes!",
  eventName: "Ammonia Safety Day @ St. Joseph, MO",
  dateLabel: "June 10, 2026",
  location: "St. Joseph, Missouri Civic Center",
  priceAttendee:
    "$35.00 per attendee (2 paid attendees gets 1 additional seat in for free, but must be pre-registered)",
  priceExhibitor: "$500.00 per exhibitor",
  bullets: [
    "Earn 8 hours of Professional Development Hours (PDHs)",
    "Network with industry leaders",
    "Raffle prizes given out throughout the day",
    "Call us for sponsorship opportunities are still available as well.",
  ],
  registerUrl: "https://fs4.formsite.com/gcapammoniatrainingcom/form4/index",
  hotelsUrl:
    "https://gcaptraining.com/wp-content/uploads/2025/04/Recommended-Hotels-near-Civic-Center.pdf",
  bodyHtml: "",
  heroImageUrl:
    "https://gcaptraining.com/wp-content/uploads/2025/08/Safety-Day-2026-wbst.jpg",
  images: DEFAULT_IMAGES,
};

export function getSafetyDaysTemplate(): SafetyDaysInput {
  return {
    ...DEFAULT_CONTENT,
    bullets: [...DEFAULT_CONTENT.bullets],
    images: DEFAULT_CONTENT.images.map((image) => ({ ...image })),
  };
}

function parseBullets(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

function parseImages(raw: string | null | undefined): SafetyDaysImage[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => {
        if (typeof item === "string" && item.trim()) {
          return { url: item.trim() };
        }
        if (
          item &&
          typeof item === "object" &&
          "url" in item &&
          typeof (item as { url: unknown }).url === "string"
        ) {
          const url = (item as { url: string }).url.trim();
          if (!url) return null;
          const alt =
            "alt" in item && typeof (item as { alt: unknown }).alt === "string"
              ? (item as { alt: string }).alt.trim()
              : undefined;
          return { url, alt: alt || undefined };
        }
        return null;
      })
      .filter((item): item is SafetyDaysImage => item !== null);
  } catch {
    return [];
  }
}

function mapPage(page: {
  id: string;
  title: string;
  subtitle: string | null;
  eventName: string | null;
  dateLabel: string | null;
  location: string | null;
  priceAttendee: string | null;
  priceExhibitor: string | null;
  bullets: string;
  registerUrl: string | null;
  hotelsUrl: string | null;
  bodyHtml: string | null;
  heroImageUrl: string | null;
  images: string;
  version: number;
  publishedAt: Date | null;
  createdAt?: Date | null;
  updatedAt: Date;
}): SafetyDaysContent {
  return {
    id: page.id,
    title: page.title,
    subtitle: page.subtitle,
    eventName: page.eventName,
    dateLabel: page.dateLabel,
    location: page.location,
    priceAttendee: page.priceAttendee,
    priceExhibitor: page.priceExhibitor,
    bullets: parseBullets(page.bullets),
    registerUrl: page.registerUrl,
    hotelsUrl: page.hotelsUrl,
    bodyHtml: page.bodyHtml,
    heroImageUrl: page.heroImageUrl,
    images: parseImages(page.images),
    version: page.version,
    publishedAt: page.publishedAt?.toISOString() ?? null,
    createdAt: (page.createdAt ?? page.updatedAt).toISOString(),
    updatedAt: page.updatedAt.toISOString(),
  };
}

function mapListItem(page: {
  id: string;
  title: string;
  subtitle: string | null;
  eventName: string | null;
  dateLabel: string | null;
  images: string;
  version: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): NotificationListItem {
  return {
    id: page.id,
    title: page.title,
    subtitle: page.subtitle,
    eventName: page.eventName,
    dateLabel: page.dateLabel,
    version: page.version,
    publishedAt: page.publishedAt?.toISOString() ?? null,
    createdAt: page.createdAt.toISOString(),
    updatedAt: page.updatedAt.toISOString(),
    imageCount: parseImages(page.images).length,
  };
}

function inputToData(input: SafetyDaysInput) {
  return {
    title: input.title,
    subtitle: input.subtitle ?? null,
    eventName: input.eventName ?? null,
    dateLabel: input.dateLabel ?? null,
    location: input.location ?? null,
    priceAttendee: input.priceAttendee ?? null,
    priceExhibitor: input.priceExhibitor ?? null,
    bullets: JSON.stringify(input.bullets),
    registerUrl: input.registerUrl ?? null,
    hotelsUrl: input.hotelsUrl ?? null,
    bodyHtml: input.bodyHtml ?? null,
    heroImageUrl: input.heroImageUrl ?? null,
    images: JSON.stringify(input.images ?? []),
  };
}

const listSelect = {
  id: true,
  title: true,
  subtitle: true,
  eventName: true,
  dateLabel: true,
  images: true,
  version: true,
  publishedAt: true,
  updatedAt: true,
} as const;

export async function listNotificationPagesPaginated(
  pageInput?: string | number,
  pageSizeInput?: string | number,
) {
  const { page, pageSize } = normalizePagination(pageInput, pageSizeInput);

  const [total, rows] = await Promise.all([
    prisma.notificationPage.count(),
    prisma.notificationPage.findMany({
      orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: listSelect,
    }),
  ]);

  if (total === 0) {
    return {
      pages: [],
      pagination: buildPaginationMeta(0, { page: 1, pageSize }),
    };
  }

  const pagination = buildPaginationMeta(total, { page, pageSize });
  let pageRows = rows;
  if (pagination.page !== page) {
    pageRows = await prisma.notificationPage.findMany({
      orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
      skip: (pagination.page - 1) * pageSize,
      take: pageSize,
      select: listSelect,
    });
  }

  return {
    pages: pageRows.map((item) =>
      mapListItem({
        ...item,
        createdAt: item.updatedAt,
      }),
    ),
    pagination,
  };
}

export async function listNotificationPages(): Promise<NotificationListItem[]> {
  const result = await listNotificationPagesPaginated(1, MAX_PAGE_SIZE);
  return result.pages;
}

export async function getNotificationPage(id: string) {
  const page = await prisma.notificationPage.findUnique({ where: { id } });
  return page ? mapPage(page) : null;
}

export async function createNotificationPage(input?: Partial<SafetyDaysInput>) {
  const template = getSafetyDaysTemplate();

  // New pages start from the public Safety Days template unless fields are provided.
  const data = inputToData({
    title: input?.title?.trim() || template.title,
    subtitle: input?.subtitle ?? template.subtitle,
    eventName: input?.eventName ?? template.eventName,
    dateLabel: input?.dateLabel ?? template.dateLabel,
    location: input?.location ?? template.location,
    priceAttendee: input?.priceAttendee ?? template.priceAttendee,
    priceExhibitor: input?.priceExhibitor ?? template.priceExhibitor,
    bullets:
      input?.bullets && input.bullets.length > 0
        ? input.bullets
        : template.bullets,
    registerUrl: input?.registerUrl ?? template.registerUrl,
    hotelsUrl: input?.hotelsUrl ?? template.hotelsUrl,
    bodyHtml: input?.bodyHtml ?? template.bodyHtml,
    heroImageUrl: input?.heroImageUrl ?? template.heroImageUrl,
    images:
      input?.images && input.images.length > 0
        ? input.images
        : template.images,
  });

  const page = await prisma.notificationPage.create({
    data: {
      ...data,
      version: 1,
      publishedAt: null,
    },
  });
  return mapPage(page);
}

export async function updateNotificationPage(
  id: string,
  input: SafetyDaysInput,
) {
  const page = await prisma.notificationPage.update({
    where: { id },
    data: {
      ...inputToData(input),
      updatedAt: new Date(),
    },
  });
  return mapPage(page);
}

export async function deleteNotificationPage(id: string) {
  await prisma.notificationPage.delete({ where: { id } });
}

export async function publishNotificationPage(id: string) {
  const existing = await prisma.notificationPage.findUnique({ where: { id } });
  if (!existing) return null;

  // Mobile app treats version as a single global counter (seen_version).
  // Always bump above every page's max so Notify on any content is fresher.
  const aggregate = await prisma.notificationPage.aggregate({
    _max: { version: true },
  });
  const nextVersion = Math.max(existing.version, aggregate._max.version ?? 0) + 1;

  const page = await prisma.notificationPage.update({
    where: { id },
    data: {
      version: nextVersion,
      publishedAt: new Date(),
      updatedAt: new Date(),
    },
  });
  return mapPage(page);
}

/** Latest published page for mobile, or any page as fallback. */
export async function getPublicNotificationPage(id?: string | null) {
  if (id) {
    const page = await prisma.notificationPage.findUnique({ where: { id } });
    return page ? mapPage(page) : null;
  }

  const latestPublished = await prisma.notificationPage.findFirst({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
  });
  if (latestPublished) return mapPage(latestPublished);

  const latest = await prisma.notificationPage.findFirst({
    orderBy: { updatedAt: "desc" },
  });
  return latest ? mapPage(latest) : null;
}

/** @deprecated Prefer getNotificationPage / listNotificationPages */
export async function ensureSafetyDaysPage() {
  const legacy = await getNotificationPage(SAFETY_DAYS_ID);
  if (legacy) return legacy;
  const pages = await listNotificationPages();
  const first = pages[0];
  if (!first) {
    return createNotificationPage(DEFAULT_CONTENT);
  }
  return (await getNotificationPage(first.id))!;
}

/** @deprecated Prefer updateNotificationPage */
export async function saveSafetyDaysPage(input: SafetyDaysInput) {
  const existing = await prisma.notificationPage.findUnique({
    where: { id: SAFETY_DAYS_ID },
  });
  if (existing) {
    return updateNotificationPage(SAFETY_DAYS_ID, input);
  }
  const pages = await listNotificationPages();
  if (pages[0]) {
    return updateNotificationPage(pages[0].id, input);
  }
  return createNotificationPage(input);
}

/** @deprecated Prefer publishNotificationPage */
export async function publishSafetyDaysPage() {
  const page = await ensureSafetyDaysPage();
  return (await publishNotificationPage(page.id))!;
}

