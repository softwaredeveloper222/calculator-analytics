import {
  AdminPageShell,
  SuspendedSection,
} from "@/components/AdminPageShell";
import { SafetyDaysEditor } from "@/components/SafetyDaysEditor";
import { ensureSafetyDaysPage } from "@/lib/notifications";

export const dynamic = "force-dynamic";

export default function NotificationsPage() {
  return (
    <AdminPageShell
      current="notifications"
      eyebrow="Notification"
      title="Safety Days CMS"
      description="Edit Ammonia Safety Day content, save drafts, then notify the mobile app when ready."
      wide
    >
      <SuspendedSection fallbackLabel="Loading Safety Days CMS…">
        <NotificationsBody />
      </SuspendedSection>
    </AdminPageShell>
  );
}

async function NotificationsBody() {
  try {
    const page = await ensureSafetyDaysPage();
    return <SafetyDaysEditor initialData={page} />;
  } catch (error) {
    console.error("Failed to load notifications CMS:", error);
    return (
      <section className="rounded-2xl border border-rose-500/30 bg-slate-900 p-6 text-sm text-slate-300">
        <p className="font-medium text-rose-300">Could not load CMS</p>
        <p className="mt-2 text-slate-400">
          Check the database connection and that the NotificationPage table
          exists (`npm run db:push`). VPN can also make Supabase very slow.
        </p>
      </section>
    );
  }
}
