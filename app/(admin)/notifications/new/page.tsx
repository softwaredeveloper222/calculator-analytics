import { SafetyDaysEditor } from "@/components/SafetyDaysEditor";
import { getSafetyDaysTemplateContent } from "@/lib/notifications";

export default function NotificationCreatePage() {
  return (
    <div>
      <SafetyDaysEditor initialData={getSafetyDaysTemplateContent()} isNew />
    </div>
  );
}
