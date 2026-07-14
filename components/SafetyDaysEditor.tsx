"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { SafetyDaysContent, SafetyDaysImage } from "@/lib/notifications";
import { SafetyDaysPreview } from "@/components/SafetyDaysPreview";
import { PlusIcon, SaveIcon, SendIcon, TrashIcon } from "@/components/icons";
import { FixedPreviewAnchor } from "@/components/FixedPreviewAnchor";
import {
  btnDangerBlock,
  btnDangerSm,
  btnPrimary,
  btnPrimaryBlock,
  btnPrimarySm,
  btnSecondaryBlock,
} from "@/lib/button-styles";

type SafetyDaysEditorProps = {
  initialData: SafetyDaysContent;
};

type LocalImage = SafetyDaysImage & { clientId: string };

type EditorBaseline = {
  title: string;
  subtitle: string;
  eventName: string;
  dateLabel: string;
  location: string;
  priceAttendee: string;
  priceExhibitor: string;
  bulletsText: string;
  registerUrl: string;
  hotelsUrl: string;
  heroImageUrl: string;
  images: Array<{ clientId: string; url: string; alt: string }>;
};

const DIRTY_BORDER =
  "border-(--admin-accent) ring-1 ring-(--admin-accent)/25";
const NORMAL_CARD_BORDER = "border-(--admin-border)";

function createClientId() {
  return crypto.randomUUID();
}

function toLocalImages(images: SafetyDaysImage[]): LocalImage[] {
  return images.map((image) => ({
    ...image,
    alt: image.alt ?? "",
    clientId: createClientId(),
  }));
}

function snapshotImages(images: LocalImage[]) {
  return images.map((image) => ({
    clientId: image.clientId,
    url: image.url,
    alt: image.alt ?? "",
  }));
}

function buildBaseline(fields: Omit<EditorBaseline, "images">, images: LocalImage[]): EditorBaseline {
  return {
    ...fields,
    images: snapshotImages(images),
  };
}

export function SafetyDaysEditor({ initialData }: SafetyDaysEditorProps) {
  const [title, setTitle] = useState(initialData.title);
  const [subtitle, setSubtitle] = useState(initialData.subtitle ?? "");
  const [eventName, setEventName] = useState(initialData.eventName ?? "");
  const [dateLabel, setDateLabel] = useState(initialData.dateLabel ?? "");
  const [location, setLocation] = useState(initialData.location ?? "");
  const [priceAttendee, setPriceAttendee] = useState(
    initialData.priceAttendee ?? "",
  );
  const [priceExhibitor, setPriceExhibitor] = useState(
    initialData.priceExhibitor ?? "",
  );
  const [bulletsText, setBulletsText] = useState(
    initialData.bullets.join("\n"),
  );
  const [registerUrl, setRegisterUrl] = useState(initialData.registerUrl ?? "");
  const [hotelsUrl, setHotelsUrl] = useState(initialData.hotelsUrl ?? "");
  const [heroImageUrl, setHeroImageUrl] = useState(
    initialData.heroImageUrl ?? "",
  );
  const [editorState] = useState(() => {
    const initialImages = toLocalImages(initialData.images ?? []);
    return {
      images: initialImages,
      baseline: buildBaseline(
        {
          title: initialData.title,
          subtitle: initialData.subtitle ?? "",
          eventName: initialData.eventName ?? "",
          dateLabel: initialData.dateLabel ?? "",
          location: initialData.location ?? "",
          priceAttendee: initialData.priceAttendee ?? "",
          priceExhibitor: initialData.priceExhibitor ?? "",
          bulletsText: initialData.bullets.join("\n"),
          registerUrl: initialData.registerUrl ?? "",
          hotelsUrl: initialData.hotelsUrl ?? "",
          heroImageUrl: initialData.heroImageUrl ?? "",
        },
        initialImages,
      ),
    };
  });
  const [images, setImages] = useState<LocalImage[]>(editorState.images);
  const [version, setVersion] = useState(initialData.version);
  const [publishedAt, setPublishedAt] = useState(initialData.publishedAt);
  const [updatedAt, setUpdatedAt] = useState(initialData.updatedAt);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);
  const [baseline, setBaseline] = useState<EditorBaseline>(editorState.baseline);
  const [pendingRemoveIndex, setPendingRemoveIndex] = useState<number | null>(
    null,
  );
  const [removingClientId, setRemovingClientId] = useState<string | null>(null);
  const lastImageRef = useRef<HTMLDivElement | null>(null);
  const shouldScrollToLastImage = useRef(false);
  const removeTimeoutRef = useRef<number | null>(null);

  const bullets = useMemo(
    () =>
      bulletsText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    [bulletsText],
  );

  const baselineImagesById = useMemo(() => {
    const map = new Map<string, { url: string; alt: string }>();
    for (const image of baseline.images) {
      map.set(image.clientId, { url: image.url, alt: image.alt });
    }
    return map;
  }, [baseline.images]);

  const isDirty = (key: keyof Omit<EditorBaseline, "images">, value: string) =>
    value !== baseline[key];

  const isImageDirty = (image: LocalImage) => {
    const saved = baselineImagesById.get(image.clientId);
    if (!saved) return true;
    return saved.url !== image.url || saved.alt !== (image.alt ?? "");
  };

  const rememberBaseline = (nextImages: LocalImage[], nextHeroImageUrl: string) => {
    setBaseline(
      buildBaseline(
        {
          title,
          subtitle,
          eventName,
          dateLabel,
          location,
          priceAttendee,
          priceExhibitor,
          bulletsText,
          registerUrl,
          hotelsUrl,
          heroImageUrl: nextHeroImageUrl,
        },
        nextImages,
      ),
    );
  };

  const payload = {
    title,
    subtitle: subtitle || null,
    eventName: eventName || null,
    dateLabel: dateLabel || null,
    location: location || null,
    priceAttendee: priceAttendee || null,
    priceExhibitor: priceExhibitor || null,
    bullets,
    registerUrl: registerUrl || null,
    hotelsUrl: hotelsUrl || null,
    bodyHtml: null,
    heroImageUrl: heroImageUrl || null,
    images: images
      .filter((image) => image.url.trim())
      .map(({ url, alt }) => ({ url, alt: alt || undefined })),
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setStatus(null);
    setIsSaving(true);

    try {
      const response = await fetch("/api/notifications/safety-days", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setError(data?.error ?? "Failed to save");
        return;
      }

      const nextImages = toLocalImages(data.images ?? []);
      const nextHeroImageUrl = data.heroImageUrl ?? "";
      setVersion(data.version);
      setPublishedAt(data.publishedAt);
      setUpdatedAt(data.updatedAt);
      setImages(nextImages);
      setHeroImageUrl(nextHeroImageUrl);
      rememberBaseline(nextImages, nextHeroImageUrl);
      setStatus("Draft saved. Click Notify to push this version to the app.");
    } catch {
      setError("Unable to reach the server");
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotify = async () => {
    setError(null);
    setStatus(null);
    setIsNotifying(true);

    try {
      const saveResponse = await fetch("/api/notifications/safety-days", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const saved = await saveResponse.json().catch(() => null);
      if (!saveResponse.ok) {
        setError(saved?.error ?? "Failed to save before notify");
        return;
      }

      const notifyResponse = await fetch(
        "/api/notifications/safety-days/notify",
        { method: "POST" },
      );
      const notified = await notifyResponse.json().catch(() => null);
      if (!notifyResponse.ok) {
        setError(notified?.error ?? "Failed to notify");
        return;
      }

      const nextImages = toLocalImages(notified.page.images ?? []);
      const nextHeroImageUrl = notified.page.heroImageUrl ?? "";
      setVersion(notified.page.version);
      setPublishedAt(notified.page.publishedAt);
      setUpdatedAt(notified.page.updatedAt);
      setImages(nextImages);
      setHeroImageUrl(nextHeroImageUrl);
      rememberBaseline(nextImages, nextHeroImageUrl);
      setStatus(
        `Published version ${notified.page.version}. The mobile app can now fetch the update.`,
      );
    } catch {
      setError("Unable to reach the server");
    } finally {
      setIsNotifying(false);
    }
  };

  const updateImage = (
    index: number,
    field: keyof SafetyDaysImage,
    value: string,
  ) => {
    setImages((current) =>
      current.map((image, i) =>
        i === index ? { ...image, [field]: value } : image,
      ),
    );
  };

  const removeImage = (index: number) => {
    const image = images[index];
    if (!image || removingClientId) return;

    setPendingRemoveIndex(null);
    setRemovingClientId(image.clientId);

    if (removeTimeoutRef.current !== null) {
      window.clearTimeout(removeTimeoutRef.current);
    }

    removeTimeoutRef.current = window.setTimeout(() => {
      setImages((current) =>
        current.filter((item) => item.clientId !== image.clientId),
      );
      setRemovingClientId((current) =>
        current === image.clientId ? null : current,
      );
      removeTimeoutRef.current = null;
    }, 300);
  };

  const requestRemoveImage = (index: number) => {
    if (removingClientId) return;
    setPendingRemoveIndex(index);
  };

  useEffect(() => {
    return () => {
      if (removeTimeoutRef.current !== null) {
        window.clearTimeout(removeTimeoutRef.current);
      }
    };
  }, []);

  const addImage = () => {
    shouldScrollToLastImage.current = true;
    setImages((current) => [
      ...current,
      { clientId: createClientId(), url: "", alt: "" },
    ]);
  };

  useEffect(() => {
    if (!shouldScrollToLastImage.current) return;
    shouldScrollToLastImage.current = false;
    const section = lastImageRef.current;
    if (!section) return;
    section.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    const input = section.querySelector("input");
    input?.focus({ preventScroll: true });
  }, [images.length]);

  return (
    <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
      <form onSubmit={handleSave} className="order-2 space-y-4 lg:order-1">
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isSaving || isNotifying}
            className={btnPrimary}
          >
            <SaveIcon className="h-4 w-4 shrink-0" />
            {isSaving ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={handleNotify}
            disabled={isSaving || isNotifying}
            className={btnPrimary}
          >
            <SendIcon className="h-4 w-4 shrink-0" />
            {isNotifying ? "Push Notification…" : "Push Notification"}
          </button>
        </div>

        <p className="text-xs text-(--admin-text-muted)">
          Version {version}
          {publishedAt
            ? ` · Published ${new Date(publishedAt).toUTCString()}`
            : " · Not published yet"}
          {updatedAt ? ` · Updated ${new Date(updatedAt).toUTCString()}` : ""}
        </p>

        {status ? <p className="text-sm text-emerald-600">{status}</p> : null}
        {error ? (
          <p className="text-sm text-rose-600" role="alert">
            {error}
          </p>
        ) : null}

        <div className="border-t border-(--admin-border) pt-4">
          <Field
            label="Title"
            value={title}
            onChange={setTitle}
            required
            dirty={isDirty("title", title)}
          />
        </div>
        <Field
          label="Subtitle"
          value={subtitle}
          onChange={setSubtitle}
          multiline
          dirty={isDirty("subtitle", subtitle)}
        />
        <Field
          label="Event name"
          value={eventName}
          onChange={setEventName}
          dirty={isDirty("eventName", eventName)}
        />
        <Field
          label="Date"
          value={dateLabel}
          onChange={setDateLabel}
          dirty={isDirty("dateLabel", dateLabel)}
        />
        <Field
          label="Location"
          value={location}
          onChange={setLocation}
          dirty={isDirty("location", location)}
        />
        <Field
          label="Attendee price"
          value={priceAttendee}
          onChange={setPriceAttendee}
          multiline
          dirty={isDirty("priceAttendee", priceAttendee)}
        />
        <Field
          label="Exhibitor price"
          value={priceExhibitor}
          onChange={setPriceExhibitor}
          dirty={isDirty("priceExhibitor", priceExhibitor)}
        />
        <Field
          label="Bullets (one per line)"
          value={bulletsText}
          onChange={setBulletsText}
          multiline
          rows={6}
          dirty={isDirty("bulletsText", bulletsText)}
        />
        <Field
          label="Register URL"
          value={registerUrl}
          onChange={setRegisterUrl}
          dirty={isDirty("registerUrl", registerUrl)}
        />
        <Field
          label="Hotels URL"
          value={hotelsUrl}
          onChange={setHotelsUrl}
          dirty={isDirty("hotelsUrl", hotelsUrl)}
        />
        <Field
          label="Hero image URL"
          value={heroImageUrl}
          onChange={setHeroImageUrl}
          dirty={isDirty("heroImageUrl", heroImageUrl)}
        />
        {heroImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroImageUrl}
            alt="Hero preview"
            className="max-h-40 w-full rounded-lg border border-(--admin-border) object-cover"
          />
        ) : null}

        <div className="space-y-3 rounded-xl border border-(--admin-border) bg-(--admin-inset) p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-(--admin-text)">Gallery images</p>
              <p className="text-xs text-(--admin-text-muted)">
                Paste image URLs from gcaptraining.com or any public image host.
              </p>
            </div>
            <button
              type="button"
              onClick={addImage}
              className={btnPrimarySm}
            >
              <PlusIcon className="h-4 w-4 shrink-0" />
              Add image
            </button>
          </div>

          {images.length === 0 ? (
            <p className="text-sm text-(--admin-text-muted)">No gallery images yet.</p>
          ) : (
            <div>
              {images.map((image, index) => {
                const dirty = isImageDirty(image);
                const isRemoving = removingClientId === image.clientId;
                return (
                  <div
                    key={image.clientId}
                    className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out ${
                      isRemoving
                        ? "mb-0 grid-rows-[0fr] opacity-0"
                        : "mb-4 grid-rows-[1fr] opacity-100 last:mb-0"
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div
                        ref={
                          index === images.length - 1 ? lastImageRef : undefined
                        }
                        className={`space-y-2 rounded-lg border p-3 transition-[box-shadow,border-color,transform] duration-300 ${
                          dirty ? DIRTY_BORDER : NORMAL_CARD_BORDER
                        } ${isRemoving ? "pointer-events-none -translate-y-1 scale-[0.98]" : ""}`}
                      >
                        <Field
                          label={`Image ${index + 1} URL`}
                          value={image.url}
                          onChange={(value) => updateImage(index, "url", value)}
                          dirty={dirty}
                        />
                        <Field
                          label="Alt text"
                          value={image.alt ?? ""}
                          onChange={(value) => updateImage(index, "alt", value)}
                          dirty={dirty}
                        />
                        {image.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={image.url}
                            alt={image.alt || `Gallery ${index + 1}`}
                            className="max-h-28 w-full rounded-md object-cover"
                          />
                        ) : null}
                        <button
                          type="button"
                          onClick={() => requestRemoveImage(index)}
                          disabled={Boolean(removingClientId)}
                          className={btnDangerSm}
                        >
                          <TrashIcon className="h-3.5 w-3.5 shrink-0" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <button
            type="button"
            onClick={addImage}
            className={btnPrimaryBlock}
          >
            <PlusIcon className="h-4 w-4 shrink-0" />
            Add image
          </button>
        </div>
      </form>

      {pendingRemoveIndex !== null ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="presentation"
          onClick={() => setPendingRemoveIndex(null)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="remove-image-title"
            aria-describedby="remove-image-desc"
            className="w-full max-w-sm rounded-xl border border-(--admin-border) bg-(--admin-panel) p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <p
              id="remove-image-title"
              className="text-base font-medium text-(--admin-text)"
            >
              Remove this image?
            </p>
            <p
              id="remove-image-desc"
              className="mt-2 text-sm text-(--admin-text-muted)"
            >
              Image {(pendingRemoveIndex ?? 0) + 1} will be removed from the
              gallery. This stays unsaved until you click Save.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPendingRemoveIndex(null)}
                className={btnSecondaryBlock}
              >
                No
              </button>
              <button
                type="button"
                onClick={() => removeImage(pendingRemoveIndex)}
                className={btnDangerBlock}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <FixedPreviewAnchor>
        <SafetyDaysPreview
          title={title}
          subtitle={subtitle}
          eventName={eventName}
          dateLabel={dateLabel}
          location={location}
          priceAttendee={priceAttendee}
          priceExhibitor={priceExhibitor}
          bullets={bullets}
          registerUrl={registerUrl}
          hotelsUrl={hotelsUrl}
          bodyHtml=""
          heroImageUrl={heroImageUrl}
          images={images}
        />
      </FixedPreviewAnchor>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  rows = 3,
  required = false,
  dirty = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  dirty?: boolean;
}) {
  const className = `w-full rounded-lg border bg-(--admin-input-bg) px-3 py-2 text-sm text-(--admin-text) outline-none focus:border-(--admin-accent) focus:ring-2 focus:ring-(--admin-accent)/15 ${
    dirty ? DIRTY_BORDER : "border-(--admin-border)"
  }`;

  return (
    <label className="block space-y-2">
      <span className="text-sm text-(--admin-text-secondary)">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={rows}
          required={required}
          className={className}
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          className={className}
        />
      )}
    </label>
  );
}
