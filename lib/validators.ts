import { z } from "zod";

export const CALCULATOR_IDS = [
  "psig",
  "psia",
  "fahrenheit",
  "pressure_enthalpy",
  "release",
  "superheat_subcooling",
] as const;

export const EVENT_TYPES = [
  "calculator_opened",
  "calculator_calculation",
  "calculator_session_end",
  "calculator_error",
] as const;

export type CalculatorId = (typeof CALCULATOR_IDS)[number];
export type EventType = (typeof EVENT_TYPES)[number];

const analyticsEventSchema = z.object({
  event: z.enum(EVENT_TYPES),
  calculatorId: z.enum(CALCULATOR_IDS).optional(),
  timestamp: z.string().datetime().optional(),
  sessionId: z.string().min(1).max(128),
  deviceId: z.string().min(1).max(128),
  appVersion: z.string().max(32).optional(),
  platform: z.enum(["android", "ios", "web"]).default("android"),
  deviceManufacturer: z.string().max(64).optional(),
  deviceModel: z.string().max(64).optional(),
  deviceBrand: z.string().max(64).optional(),
  osVersion: z.string().max(16).optional(),
  durationMs: z.number().int().min(0).max(86_400_000).optional(),
  success: z.boolean().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const ingestPayloadSchema = z.object({
  events: z.array(analyticsEventSchema).min(1).max(100),
});

export const deleteEventsSchema = z.object({
  ids: z.array(z.string().min(1)).min(1).max(100),
});

export type AnalyticsEventInput = z.infer<typeof analyticsEventSchema>;
export type IngestPayload = z.infer<typeof ingestPayloadSchema>;
export type DeleteEventsPayload = z.infer<typeof deleteEventsSchema>;
