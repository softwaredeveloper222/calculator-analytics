export type SafetyDaysPushResult = {
  sent: boolean;
  warning?: string;
  error?: string;
  onesignalId?: string | null;
};

/**
 * Broadcast a Safety Days push to all OneSignal subscribed users.
 * Missing credentials or API failures do not throw — callers keep publish success.
 */
export async function sendSafetyDaysPush(input: {
  version: number;
  title?: string | null;
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

  try {
    const response = await fetch("https://api.onesignal.com/notifications", {
      method: "POST",
      headers: {
        Authorization: `Key ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        app_id: appId,
        included_segments: ["Subscribed Users"],
        target_channel: "push",
        headings: { en: "Safety Days update" },
        contents: {
          en: `New ${eventTitle} content is available (v${input.version}).`,
        },
        data: {
          type: "safety_days",
          version: String(input.version),
          ...(input.contentId ? { contentId: input.contentId } : {}),
        },
      }),
    });

    const body = (await response.json().catch(() => null)) as {
      id?: string;
      errors?: unknown;
    } | null;

    if (!response.ok) {
      const detail =
        typeof body?.errors === "string"
          ? body.errors
          : body?.errors
            ? JSON.stringify(body.errors)
            : `HTTP ${response.status}`;
      console.error("OneSignal push failed:", detail);
      return {
        sent: false,
        error: `OneSignal push failed: ${detail}`,
      };
    }

    return {
      sent: true,
      onesignalId: body?.id ?? null,
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
