import { z } from "zod";

const imageSchema = z.object({
  url: z.string().trim().url().max(2000),
  alt: z.string().trim().max(300).optional(),
});

export const safetyDaysInputSchema = z.object({
  title: z.string().trim().min(1).max(200),
  subtitle: z.string().trim().max(1000).nullable().optional(),
  eventName: z.string().trim().max(200).nullable().optional(),
  dateLabel: z.string().trim().max(100).nullable().optional(),
  location: z.string().trim().max(300).nullable().optional(),
  priceAttendee: z.string().trim().max(500).nullable().optional(),
  priceExhibitor: z.string().trim().max(500).nullable().optional(),
  bullets: z.array(z.string().trim().min(1).max(500)).max(50),
  registerUrl: z
    .union([z.string().trim().url(), z.literal(""), z.null()])
    .optional(),
  hotelsUrl: z
    .union([z.string().trim().url(), z.literal(""), z.null()])
    .optional(),
  bodyHtml: z.string().max(20_000).nullable().optional(),
  heroImageUrl: z
    .union([z.string().trim().url(), z.literal(""), z.null()])
    .optional(),
  images: z.array(imageSchema).max(60).optional(),
});
