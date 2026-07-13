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
  updatedAt: string;
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
    updatedAt: page.updatedAt.toISOString(),
  };
}

export async function ensureSafetyDaysPage() {
  const existing = await prisma.notificationPage.findUnique({
    where: { id: SAFETY_DAYS_ID },
  });

  if (existing) {
    const images = parseImages(existing.images);
    const needsImageBackfill =
      !existing.heroImageUrl || images.length < DEFAULT_IMAGES.length;

    if (needsImageBackfill) {
      const updated = await prisma.notificationPage.update({
        where: { id: SAFETY_DAYS_ID },
        data: {
          heroImageUrl: existing.heroImageUrl || DEFAULT_CONTENT.heroImageUrl,
          images: JSON.stringify(DEFAULT_CONTENT.images),
          registerUrl:
            existing.registerUrl?.includes("formsite.com")
              ? existing.registerUrl
              : DEFAULT_CONTENT.registerUrl,
        },
      });
      return mapPage(updated);
    }

    return mapPage(existing);
  }

  const created = await prisma.notificationPage.create({
    data: {
      id: SAFETY_DAYS_ID,
      title: DEFAULT_CONTENT.title,
      subtitle: DEFAULT_CONTENT.subtitle,
      eventName: DEFAULT_CONTENT.eventName,
      dateLabel: DEFAULT_CONTENT.dateLabel,
      location: DEFAULT_CONTENT.location,
      priceAttendee: DEFAULT_CONTENT.priceAttendee,
      priceExhibitor: DEFAULT_CONTENT.priceExhibitor,
      bullets: JSON.stringify(DEFAULT_CONTENT.bullets),
      registerUrl: DEFAULT_CONTENT.registerUrl,
      hotelsUrl: DEFAULT_CONTENT.hotelsUrl,
      bodyHtml: DEFAULT_CONTENT.bodyHtml,
      heroImageUrl: DEFAULT_CONTENT.heroImageUrl,
      images: JSON.stringify(DEFAULT_CONTENT.images),
      version: 1,
      publishedAt: new Date(),
    },
  });

  return mapPage(created);
}

export async function saveSafetyDaysPage(input: SafetyDaysInput) {
  const page = await prisma.notificationPage.upsert({
    where: { id: SAFETY_DAYS_ID },
    create: {
      id: SAFETY_DAYS_ID,
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
      version: 1,
    },
    update: {
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
    },
  });

  return mapPage(page);
}

export async function publishSafetyDaysPage() {
  const existing = await ensureSafetyDaysPage();

  const page = await prisma.notificationPage.update({
    where: { id: SAFETY_DAYS_ID },
    data: {
      version: existing.version + 1,
      publishedAt: new Date(),
    },
  });

  return mapPage(page);
}
