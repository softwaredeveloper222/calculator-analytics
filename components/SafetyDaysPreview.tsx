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
    <section className="overflow-hidden rounded-2xl border border-slate-700 bg-white shadow-xl">
      <div className="border-b border-slate-200 bg-[#f4f6f8] px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#00387d]">
          Preview · gcaptraining.com/safety-days
        </p>
      </div>

      <article
        className={`${roboto.className} bg-white`}
        style={{ color: styles.body }}
      >
        <div
          className="space-y-4 px-6 py-8 sm:px-10"
          style={{ background: styles.pageBg }}
        >
          {/* entry-title: 28px / 600 / #00387d */}
          <h1
            className="text-center text-[28px] font-bold leading-[1.5]"
            style={{ color: styles.heading }}
          >
            {title || "Ammonia Safety Days"}
          </h1>

          {heroImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroImageUrl}
              alt={title || "Ammonia Safety Days"}
              className="mx-auto w-full max-w-3xl object-contain"
            />
          ) : null}

          {/* h3 centered subtitle: 22px / 500 */}
          {subtitle ? (
            <h3
              className="text-center text-[22px] font-medium leading-[1.5]"
              style={{ color: styles.heading }}
            >
              {subtitle}
            </h3>
          ) : null}

          {eventName ? (
            <section className="space-y-2">
              <h3
                className="text-[22px] font-medium leading-[1.5]"
                style={{ color: styles.heading }}
              >
                {eventName}
              </h3>
              {benefitBullets.length > 0 ? (
                <div className="space-y-2 text-base leading-[1.7]">
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
                className="text-[22px] font-medium leading-[1.5]"
                style={{ color: styles.heading }}
              >
                Date: {dateLabel}
              </h3>
              {detailItems.length > 0 ? (
                <ul className="list-disc space-y-1 pl-5 text-base leading-[1.7]">
                  {detailItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ) : null}

          {/* CTAs are centered h1 links on the live site */}
          <section className="space-y-5 pt-2 text-center">
            {registerUrl ? (
              <h1 className="text-[28px] font-bold leading-[1.5] sm:text-[32px]">
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
              <h1
                className="text-[28px] font-bold leading-[1.5] text-slate-400 sm:text-[32px]"
              >
                Click Here to Register
              </h1>
            )}

            {hotelsUrl ? (
              <h1 className="text-[28px] font-bold leading-[1.5] sm:text-[32px]">
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
            <p className="whitespace-pre-wrap text-base leading-[1.7]">
              {bodyHtml}
            </p>
          ) : null}

          {gallery.length > 0 ? (
            <section className="space-y-4 pt-2">
              {gallery.map((image, index) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`${image.url}-${index}`}
                  src={image.url}
                  alt={image.alt || `Safety Days photo ${index + 1}`}
                  className="mx-auto w-full max-w-3xl object-contain"
                />
              ))}
            </section>
          ) : null}
        </div>
      </article>
    </section>
  );
}
