"use client";

import { FormEvent, useMemo, useState } from "react";
import type { SafetyDaysContent, SafetyDaysImage } from "@/lib/notifications";
import { SafetyDaysPreview } from "@/components/SafetyDaysPreview";

type SafetyDaysEditorProps = {
  initialData: SafetyDaysContent;
};

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
  const [images, setImages] = useState<SafetyDaysImage[]>(
    initialData.images ?? [],
  );
  const [version, setVersion] = useState(initialData.version);
  const [publishedAt, setPublishedAt] = useState(initialData.publishedAt);
  const [updatedAt, setUpdatedAt] = useState(initialData.updatedAt);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);

  const bullets = useMemo(
    () =>
      bulletsText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    [bulletsText],
  );

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
    images: images.filter((image) => image.url.trim()),
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

      setVersion(data.version);
      setPublishedAt(data.publishedAt);
      setUpdatedAt(data.updatedAt);
      setImages(data.images ?? []);
      setHeroImageUrl(data.heroImageUrl ?? "");
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

      setVersion(notified.page.version);
      setPublishedAt(notified.page.publishedAt);
      setUpdatedAt(notified.page.updatedAt);
      setImages(notified.page.images ?? []);
      setHeroImageUrl(notified.page.heroImageUrl ?? "");
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
    setImages((current) => current.filter((_, i) => i !== index));
  };

  const addImage = () => {
    setImages((current) => [...current, { url: "", alt: "" }]);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <form onSubmit={handleSave} className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isSaving || isNotifying}
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:bg-slate-900 disabled:opacity-50"
          >
            {isSaving ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={handleNotify}
            disabled={isSaving || isNotifying}
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400 disabled:opacity-50"
          >
            {isNotifying ? "Notifying…" : "Notify"}
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Version {version}
          {publishedAt
            ? ` · Published ${new Date(publishedAt).toUTCString()}`
            : " · Not published yet"}
          {updatedAt ? ` · Updated ${new Date(updatedAt).toUTCString()}` : ""}
        </p>

        {status ? <p className="text-sm text-emerald-300">{status}</p> : null}
        {error ? (
          <p className="text-sm text-rose-300" role="alert">
            {error}
          </p>
        ) : null}

        <div className="border-t border-slate-800 pt-4">
          <Field label="Title" value={title} onChange={setTitle} required />
        </div>
        <Field label="Subtitle" value={subtitle} onChange={setSubtitle} multiline />
        <Field label="Event name" value={eventName} onChange={setEventName} />
        <Field label="Date" value={dateLabel} onChange={setDateLabel} />
        <Field label="Location" value={location} onChange={setLocation} />
        <Field
          label="Attendee price"
          value={priceAttendee}
          onChange={setPriceAttendee}
          multiline
        />
        <Field
          label="Exhibitor price"
          value={priceExhibitor}
          onChange={setPriceExhibitor}
        />
        <Field
          label="Bullets (one per line)"
          value={bulletsText}
          onChange={setBulletsText}
          multiline
          rows={6}
        />
        <Field
          label="Register URL"
          value={registerUrl}
          onChange={setRegisterUrl}
        />
        <Field label="Hotels URL" value={hotelsUrl} onChange={setHotelsUrl} />
        <Field
          label="Hero image URL"
          value={heroImageUrl}
          onChange={setHeroImageUrl}
        />
        {heroImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroImageUrl}
            alt="Hero preview"
            className="max-h-40 w-full rounded-lg border border-slate-700 object-cover"
          />
        ) : null}

        <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-200">Gallery images</p>
              <p className="text-xs text-slate-500">
                Paste image URLs from gcaptraining.com or any public image host.
              </p>
            </div>
            <button
              type="button"
              onClick={addImage}
              className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-900"
            >
              Add image
            </button>
          </div>

          {images.length === 0 ? (
            <p className="text-sm text-slate-500">No gallery images yet.</p>
          ) : (
            <div className="space-y-4">
              {images.map((image, index) => (
                <div
                  key={`image-${index}`}
                  className="space-y-2 rounded-lg border border-slate-800 p-3"
                >
                  <Field
                    label={`Image ${index + 1} URL`}
                    value={image.url}
                    onChange={(value) => updateImage(index, "url", value)}
                  />
                  <Field
                    label="Alt text"
                    value={image.alt ?? ""}
                    onChange={(value) => updateImage(index, "alt", value)}
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
                    onClick={() => removeImage(index)}
                    className="text-sm text-rose-300 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </form>

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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
}) {
  const className =
    "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400";

  return (
    <label className="block space-y-2">
      <span className="text-sm text-slate-300">{label}</span>
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
