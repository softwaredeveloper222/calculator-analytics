import { NotificationContentList } from "@/components/NotificationContentList";
import { SuspendedSection } from "@/components/SuspendedSection";
import { listNotificationPagesPaginated } from "@/lib/notifications";

export const dynamic = "force-dynamic";

export default function NotificationsPage() {
  return (
    <SuspendedSection fallbackLabel="Loading content list…">
      <NotificationsListBody />
    </SuspendedSection>
  );
}

async function NotificationsListBody() {
  try {
    const initialData = await listNotificationPagesPaginated(1, 10);
    return <NotificationContentList initialData={initialData} />;
  } catch (error) {
    console.error("Failed to load notifications CMS:", error);
    return (
      <section className="rounded-xl border border-rose-500/30 bg-(--admin-panel) p-5 text-sm text-(--admin-text-secondary)">
        <p className="font-medium text-rose-600">Could not load CMS</p>
        <p className="mt-2 text-(--admin-text-muted)">
          Check the database connection and that the NotificationPage table
          exists (`npm run db:push`). VPN can also make Supabase very slow.
        </p>
      </section>
    );
  }
}
