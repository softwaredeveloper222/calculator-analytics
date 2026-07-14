export type SafetyDaysPushResult = {
  sent: boolean;
  warning?: string;
  error?: string;
  onesignalId?: string | null;
};

function formatOneSignalErrors(errors: unknown): string {
  if (typeof errors === "string") return errors;
  if (Array.isArray(errors)) return errors.map(String).join("; ");
  if (errors && typeof errors === "object") return JSON.stringify(errors);
  return "Unknown OneSignal error";
}

/**
 * Broadcast a Safety Days push to subscribed Android users.
 * Missing credentials or API failures do not throw — callers keep publish success.
 *
 * OneSignal may return HTTP 200 with an empty `id` when the target audience
 * has no valid push subscriptions for this app_id / channel.
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
    // Prefer Android push players. Avoid target_channel — it can yield
    // "All included players are not subscribed" even when Audience lists users.
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
        isAndroid: true,
        headings: { en: "Safety Days update" },
        contents: {
          en: `New ${eventTitle} content is available (v${input.version}).`,
        },
        data: {
          type: "safety_days",
          version: String(input.version),
          ...(input.contentId
            ? { contentId: input.contentId, id: input.contentId }
            : {}),
        },
      }),
    });

    const body = (await response.json().catch(() => null)) as {
      id?: string;
      errors?: unknown;
      recipients?: number;
    } | null;

    const notificationId = body?.id?.trim() || "";

    if (!response.ok) {
      const detail = body?.errors
        ? formatOneSignalErrors(body.errors)
        : `HTTP ${response.status}`;
      console.error("OneSignal push failed:", detail, { appId });
      return {
        sent: false,
        error: `OneSignal push failed: ${detail}`,
      };
    }

    if (!notificationId) {
      const detail = body?.errors
        ? formatOneSignalErrors(body.errors)
        : "No subscribed Android push devices matched";
      console.error("OneSignal created no message:", detail, { appId });
      return {
        sent: false,
        error: [
          `OneSignal did not create a message: ${detail}.`,
          `CMS is pushing to app_id=${appId}.`,
          "In that same OneSignal app, open Audience → Subscriptions and filter:",
          "Channel=Push, Platform=Android, Status=Subscribed.",
          "Users listed without those filters (or in a different app) will not receive this push.",
        ].join(" "),
      };
    }

    return {
      sent: true,
      onesignalId: notificationId,
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
