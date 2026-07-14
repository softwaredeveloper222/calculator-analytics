import Link from "next/link";
import { notFound } from "next/navigation";
import { SafetyDaysEditor } from "@/components/SafetyDaysEditor";
import { SuspendedSection } from "@/components/SuspendedSection";
import { getNotificationPage } from "@/lib/notifications";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function NotificationEditPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div>
      <SuspendedSection fallbackLabel="Loading editor…">
        <NotificationEditorBody id={id} />
      </SuspendedSection>
    </div>
  );
}

async function NotificationEditorBody({ id }: { id: string }) {
  try {
    const page = await getNotificationPage(id);
    if (!page) notFound();
    return <SafetyDaysEditor initialData={page} />;
  } catch (error) {
    console.error("Failed to load notification editor:", error);
    return (
      <section className="rounded-xl border border-rose-500/30 bg-(--admin-panel) p-5 text-sm text-(--admin-text-secondary)">
        <p className="font-medium text-rose-600">Could not load content</p>
        <p className="mt-2 text-(--admin-text-muted)">
          Check the database connection and try again.
        </p>
        <Link
          href="/notifications"
          className="mt-4 inline-block text-sm text-(--admin-accent-text) underline"
        >
          Back to content list
        </Link>
      </section>
    );
  }
}
