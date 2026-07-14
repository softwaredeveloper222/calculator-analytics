import { AdminPageHeader } from "@/components/AdminPageHeader";
import { SuspendedSection } from "@/components/SuspendedSection";
import { SafetyDaysEditor } from "@/components/SafetyDaysEditor";
import { BellIcon } from "@/components/icons";
import { ensureSafetyDaysPage } from "@/lib/notifications";

export const dynamic = "force-dynamic";

export default function NotificationsPage() {
  return (
    <div>
      <AdminPageHeader
        title="Notification"
        description="Edit content, save drafts, then notify the mobile app when ready."
        icon={BellIcon}
      />
      <SuspendedSection fallbackLabel="Loading notification…">
        <NotificationsBody />
      </SuspendedSection>
    </div>
  );
}

async function NotificationsBody() {
  try {
    const page = await ensureSafetyDaysPage();
    return <SafetyDaysEditor initialData={page} />;
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
