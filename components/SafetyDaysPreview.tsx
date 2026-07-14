import { Roboto } from "next/font/google";
import type { SafetyDaysImage } from "@/lib/notifications";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

type SafetyDaysPreviewProps = {
  title: string;
  subtitle: string;
  eventName: string;
  dateLabel: string;
  location: string;
  priceAttendee: string;
  priceExhibitor: string;
  bullets: string[];
  registerUrl: string;
  hotelsUrl: string;
  bodyHtml: string;
  heroImageUrl: string;
  images: SafetyDaysImage[];
};

/** Typography matched to gcaptraining.com/safety-days (Education Soul theme). */
const styles = {
  heading: "#00387d",
  body: "#727272",
  link: "#007acc",
  linkHover: "#179bd7",
  pageBg: "#fbfbfb",
} as const;

export function SafetyDaysPreview({
  title,
  subtitle,
  eventName,
  dateLabel,
  location,
  priceAttendee,
  priceExhibitor,
  bullets,
  registerUrl,
  hotelsUrl,
  bodyHtml,
  heroImageUrl,
  images,
}: SafetyDaysPreviewProps) {
  const gallery = images.filter((image) => image.url.trim());
  const detailItems = [
    location ? `@  ${location}` : "",
    priceAttendee,
    priceExhibitor,
    ...bullets.filter((bullet) =>
      bullet.toLowerCase().includes("sponsorship"),
    ),
  ].filter(Boolean);

  const benefitBullets = bullets.filter(
    (bullet) => !bullet.toLowerCase().includes("sponsorship"),
  );

  return (
    <aside className="mx-auto w-full max-w-[390px]">
      <p className="mb-3 text-center text-xs font-semibold tracking-[0.18em] text-(--admin-text-muted) uppercase">
        Mobile preview
      </p>

      <div
        className="relative mx-auto flex h-[calc(100vh-8.5rem)] h-[calc(100dvh-8.5rem)] max-h-[calc(100vh-8.5rem)] max-h-[calc(100dvh-8.5rem)] flex-col rounded-[2.25rem] border border-slate-800 bg-slate-900 p-3 shadow-[0_24px_60px_rgba(15,23,42,0.35)]"
      >
        {/* Side buttons */}
        <div
          aria-hidden
          className="absolute top-28 -left-[3px] h-8 w-[3px] rounded-l-sm bg-slate-700"
        />
        <div
          aria-hidden
          className="absolute top-40 -left-[3px] h-12 w-[3px] rounded-l-sm bg-slate-700"
        />
        <div
          aria-hidden
          className="absolute top-36 -right-[3px] h-16 w-[3px] rounded-r-sm bg-slate-700"
        />

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.75rem] bg-black ring-1 ring-white/10">
          {/* Status bar */}
          <div className="relative z-10 flex shrink-0 items-center justify-between bg-[#f4f6f8] px-5 pt-3 pb-1 text-[10px] font-semibold text-slate-800">
            <span>9:41</span>
            <div
              aria-hidden
              className="absolute top-1.5 left-1/2 h-5 w-[5.5rem] -translate-x-1/2 rounded-full bg-slate-900"
            />
            <span className="tabular-nums">100%</span>
          </div>

          <div className="shrink-0 border-b border-slate-200 bg-[#f4f6f8] px-4 py-2">
            <p className="truncate text-center text-[10px] font-semibold tracking-[0.14em] text-[#00387d] uppercase">
              gcaptraining.com/safety-days
            </p>
          </div>

          <article
            className={`${roboto.className} min-h-0 flex-1 overflow-y-auto overscroll-contain bg-white`}
            style={{ color: styles.body }}
          >
            <div
              className="min-h-full space-y-3 px-4 py-5"
              style={{ background: styles.pageBg }}
            >
              <h1
                className="text-left text-[22px] font-bold leading-[1.35]"
                style={{ color: styles.heading }}
              >
                {title || "Ammonia Safety Days"}
              </h1>

              {heroImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={heroImageUrl}
                  alt={title || "Ammonia Safety Days"}
                  className="mx-auto w-full object-contain"
                />
              ) : null}

              {subtitle ? (
                <h3
                  className="text-center text-[17px] font-medium leading-[1.4]"
                  style={{ color: styles.heading }}
                >
                  {subtitle}
                </h3>
              ) : null}

              {eventName ? (
                <section className="space-y-2">
                  <h3
                    className="text-[17px] font-medium leading-[1.4]"
                    style={{ color: styles.heading }}
                  >
                    {eventName}
                  </h3>
                  {benefitBullets.length > 0 ? (
                    <div className="space-y-1.5 text-[14px] leading-[1.6]">
                      {benefitBullets.map((bullet) => (
                        <p key={bullet}>{bullet}</p>
                      ))}
                    </div>
                  ) : null}
                </section>
              ) : null}

              {dateLabel ? (
                <section className="space-y-2">
                  <h3
                    className="text-[17px] font-medium leading-[1.4]"
                    style={{ color: styles.heading }}
                  >
                    Date: {dateLabel}
                  </h3>
                  {detailItems.length > 0 ? (
                    <ul className="list-disc space-y-1 pl-4 text-[14px] leading-[1.6]">
                      {detailItems.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ) : null}

              <section className="space-y-4 pt-1 text-center">
                {registerUrl ? (
                  <h1 className="text-[20px] font-bold leading-[1.35]">
                    <a
                      href={registerUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="no-underline transition-colors"
                      style={{ color: styles.heading }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = styles.linkHover;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = styles.heading;
                      }}
                    >
                      Click Here to Register
                    </a>
                  </h1>
                ) : (
                  <h1 className="text-[20px] font-bold leading-[1.35] text-slate-400">
                    Click Here to Register
                  </h1>
                )}

                {hotelsUrl ? (
                  <h1 className="text-[20px] font-bold leading-[1.35]">
                    <a
                      href={hotelsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="no-underline transition-colors"
                      style={{ color: styles.heading }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = styles.linkHover;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = styles.heading;
                      }}
                    >
                      Link to Recommended Hotels
                    </a>
                  </h1>
                ) : null}
              </section>

              {bodyHtml ? (
                <p className="whitespace-pre-wrap text-[14px] leading-[1.6]">
                  {bodyHtml}
                </p>
              ) : null}

              {gallery.length > 0 ? (
                <section className="space-y-3 pt-1">
                  {gallery.map((image, index) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={`${image.url}-${index}`}
                      src={image.url}
                      alt={image.alt || `Safety Days photo ${index + 1}`}
                      className="mx-auto w-full object-contain"
                    />
                  ))}
                </section>
              ) : null}
            </div>
          </article>

          {/* Home indicator */}
          <div className="flex shrink-0 justify-center bg-white py-2">
            <div
              aria-hidden
              className="h-1 w-28 rounded-full bg-slate-300"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
