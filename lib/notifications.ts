import { prisma } from "@/lib/prisma";

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

/** Seed the classic Safety Days page once if the CMS is empty. */
export async function ensureNotificationSeed() {
  const count = await prisma.notificationPage.count();
  if (count > 0) return;

  await prisma.notificationPage.create({
    data: {
      id: SAFETY_DAYS_ID,
      ...inputToData(DEFAULT_CONTENT),
      version: 1,
      publishedAt: new Date(),
    },
  });
}

export async function listNotificationPages(): Promise<NotificationListItem[]> {
  await ensureNotificationSeed();
  const pages = await prisma.notificationPage.findMany({
    orderBy: [{ updatedAt: "desc" }],
    select: {
      id: true,
      title: true,
      subtitle: true,
      eventName: true,
      dateLabel: true,
      images: true,
      version: true,
      publishedAt: true,
      updatedAt: true,
    },
  });
  return pages.map((page) =>
    mapListItem({
      ...page,
      createdAt: page.updatedAt,
    }),
  );
}

export async function getNotificationPage(id: string) {
  const page = await prisma.notificationPage.findUnique({ where: { id } });
  return page ? mapPage(page) : null;
}

export async function createNotificationPage(input?: Partial<SafetyDaysInput>) {
  await ensureNotificationSeed();
  const data = inputToData({
    title: input?.title?.trim() || "Untitled notification",
    subtitle: input?.subtitle ?? null,
    eventName: input?.eventName ?? null,
    dateLabel: input?.dateLabel ?? null,
    location: input?.location ?? null,
    priceAttendee: input?.priceAttendee ?? null,
    priceExhibitor: input?.priceExhibitor ?? null,
    bullets: input?.bullets ?? [],
    registerUrl: input?.registerUrl ?? null,
    hotelsUrl: input?.hotelsUrl ?? null,
    bodyHtml: input?.bodyHtml ?? null,
    heroImageUrl: input?.heroImageUrl ?? null,
    images: input?.images ?? [],
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
    data: inputToData(input),
  });
  return mapPage(page);
}

export async function deleteNotificationPage(id: string) {
  await prisma.notificationPage.delete({ where: { id } });
}

export async function publishNotificationPage(id: string) {
  const existing = await prisma.notificationPage.findUnique({ where: { id } });
  if (!existing) return null;

  const page = await prisma.notificationPage.update({
    where: { id },
    data: {
      version: existing.version + 1,
      publishedAt: new Date(),
    },
  });
  return mapPage(page);
}

/** Latest published page for mobile, or any page as fallback. */
export async function getPublicNotificationPage(id?: string | null) {
  await ensureNotificationSeed();

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
  await ensureNotificationSeed();
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
  await ensureNotificationSeed();
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

