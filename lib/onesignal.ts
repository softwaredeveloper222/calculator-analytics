export type SafetyDaysPushResult = {
  sent: boolean;
  warning?: string;
  error?: string;
  onesignalId?: string | null;
};

type NotifyBody = {
  id?: string;
  errors?: unknown;
  recipients?: number;
};

function formatOneSignalErrors(errors: unknown): string {
  if (typeof errors === "string") return errors;
  if (Array.isArray(errors)) return errors.map(String).join("; ");
  if (errors && typeof errors === "object") return JSON.stringify(errors);
  return "Unknown OneSignal error";
}

function authHeaders(apiKey: string): HeadersInit {
  return {
    Authorization: `Key ${apiKey}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

async function describeAudience(
  appId: string,
  apiKey: string,
): Promise<{ summary: string; name?: string; messageable?: number }> {
  try {
    const response = await fetch(`https://api.onesignal.com/apps/${appId}`, {
      headers: authHeaders(apiKey),
      cache: "no-store",
    });
    if (!response.ok) {
      return {
        summary: `Could not read app audience (HTTP ${response.status}). Confirm ONESIGNAL_REST_API_KEY is the App REST API Key for this app.`,
      };
    }
    const app = (await response.json()) as {
      name?: string;
      players?: number;
      messageable_players?: number;
    };
    const appleHint =
      /apple/i.test(app.name ?? "")
        ? ` OneSignal app is named "${app.name}" — confirm Settings → Platforms includes Google Android (FCM) for the Android package com.gcap, not only Apple.`
        : "";
    return {
      name: app.name,
      messageable: app.messageable_players,
      summary: [
        `App "${app.name ?? appId}" reports players=${app.players ?? "?"}`,
        `messageable_players=${app.messageable_players ?? "?"}.${appleHint}`,
      ].join(" "),
    };
  } catch {
    return { summary: "Could not read OneSignal app audience." };
  }
}

async function createNotification(
  apiKey: string,
  payload: Record<string, unknown>,
): Promise<{ ok: boolean; status: number; body: NotifyBody | null }> {
  const response = await fetch("https://api.onesignal.com/notifications", {
    method: "POST",
    headers: authHeaders(apiKey),
    body: JSON.stringify(payload),
  });
  const body = (await response.json().catch(() => null)) as NotifyBody | null;
  return { ok: response.ok, status: response.status, body };
}

/** Legacy view-players: ids with a push token that are still subscribed. */
async function listMessageablePlayerIds(
  appId: string,
  apiKey: string,
): Promise<string[]> {
  const response = await fetch(
    `https://api.onesignal.com/players?app_id=${encodeURIComponent(appId)}&limit=200&offset=0`,
    {
      headers: authHeaders(apiKey),
      cache: "no-store",
    },
  );
  if (!response.ok) {
    console.error("OneSignal players list failed:", response.status);
    return [];
  }
  const data = (await response.json()) as {
    players?: Array<{
      id?: string;
      invalid_identifier?: boolean;
      notification_types?: number | null;
    }>;
  };
  return (data.players ?? [])
    .filter(
      (p) =>
        Boolean(p.id) &&
        p.invalid_identifier !== true &&
        // notification_types > 0 means subscribed; null/undefined keep as candidate
        (p.notification_types == null || p.notification_types > 0),
    )
    .map((p) => p.id as string);
}

function basePayload(input: {
  version: number;
  title: string;
  dateLabel?: string | null;
  contentId?: string | null;
}): Record<string, unknown> {
  const date = input.dateLabel?.trim() || "";
  return {
    // Mobile notification banner: Title as heading, Date as body
    headings: { en: input.title },
    contents: {
      en: date ? `Date: ${date}` : "Safety Days content has been updated.",
    },
    data: {
      type: "safety_days",
      version: String(input.version),
      title: input.title,
      ...(date ? { dateLabel: date } : {}),
      ...(input.contentId
        ? { contentId: input.contentId, id: input.contentId }
        : {}),
    },
  };
}

/**
 * Broadcast a Safety Days push.
 * Tries default segments, then falls back to explicit player IDs when the
 * segment name doesn't match messageable devices (common with renamed apps /
 * default segments).
 */
export async function sendSafetyDaysPush(input: {
  version: number;
  title?: string | null;
  dateLabel?: string | null;
  contentId?: string | null;
}): Promise<SafetyDaysPushResult> {
  const appId = process.env.ONESIGNAL_APP_ID?.trim();
  const apiKey = process.env.ONESIGNAL_REST_API_KEY?.trim();

  if (!appId || !apiKey) {
    return {
      sent: false,
      warning:
        "OneSignal is not configured (ONESIGNAL_APP_ID / ONESIGNAL_REST_API_KEY). Content was published without a push.",
    };
  }

  const eventTitle = input.title?.trim() || "Ammonia Safety Days";
  const shared = basePayload({
    version: input.version,
    title: eventTitle,
    dateLabel: input.dateLabel,
    contentId: input.contentId,
  });

  // "Subscribed Users" is often empty or renamed even when messageable_players > 0.
  const segmentCandidates = [
    "Subscribed Users",
    "Total Subscriptions",
    "Active Subscriptions",
    "All",
  ];

  try {
    const attempts: string[] = [];

    for (const segment of segmentCandidates) {
      const { ok, status, body } = await createNotification(apiKey, {
        app_id: appId,
        included_segments: [segment],
        ...shared,
      });
      const notificationId = body?.id?.trim() || "";
      if (!ok) {
        attempts.push(`${segment}: HTTP ${status}`);
        continue;
      }
      if (notificationId) {
        return { sent: true, onesignalId: notificationId };
      }
      attempts.push(
        `${segment}: ${body?.errors ? formatOneSignalErrors(body.errors) : "empty id"}`,
      );
    }

    const playerIds = await listMessageablePlayerIds(appId, apiKey);
    if (playerIds.length > 0) {
      const { ok, status, body } = await createNotification(apiKey, {
        app_id: appId,
        include_player_ids: playerIds,
        ...shared,
      });
      const notificationId = body?.id?.trim() || "";
      if (ok && notificationId) {
        return { sent: true, onesignalId: notificationId };
      }
      attempts.push(
        `player_ids(${playerIds.length}): ${
          body?.errors
            ? formatOneSignalErrors(body.errors)
            : `HTTP ${status} / empty id`
        }`,
      );
    } else {
      attempts.push("player_ids: none returned by /players");
    }

    const audience = await describeAudience(appId, apiKey);
    console.error("OneSignal created no message:", { appId, attempts, audience });
    return {
      sent: false,
      error: [
        "OneSignal did not create a message.",
        `CMS app_id=${appId}.`,
        audience.summary,
        `Attempts: ${attempts.join(" | ")}`,
      ].join(" "),
    };
  } catch (error) {
    console.error("OneSignal push request error:", error);
    return {
      sent: false,
      error:
        error instanceof Error
          ? error.message
          : "OneSignal push request failed",
    };
  }
}
