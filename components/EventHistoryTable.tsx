import { formatEventLabel } from "@/lib/event-labels";
import { formatEventTime } from "@/lib/format-time";

export type EventRow = {
  id: string;
  event: string;
  calculatorId: string | null;
  deviceLabel: string;
  platform?: string;
  osVersion: string | null;
  success: boolean | null;
  createdAt: string;
};

type EventHistoryTableProps = {
  events: EventRow[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
};

export function EventHistoryTable({
  events,
  selectedIds,
  onToggle,
  onToggleAll,
}: EventHistoryTableProps) {
  if (events.length === 0) {
    return (
      <p className="text-sm text-(--admin-text-muted)">
        No events found for this page.
      </p>
    );
  }

  const allSelected =
    events.length > 0 && events.every((event) => selectedIds.has(event.id));
  const someSelected = events.some((event) => selectedIds.has(event.id));

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead className="text-(--admin-text-muted)">
          <tr>
            <th className="pb-2 pr-3 font-medium">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(input) => {
                  if (input) input.indeterminate = someSelected && !allSelected;
                }}
                onChange={onToggleAll}
                aria-label="Select all on this page"
                className="h-4 w-4 rounded border-(--admin-border) bg-(--admin-input-bg) accent-(--admin-accent)"
              />
            </th>
            <th className="pb-2 pr-4 font-medium">Time</th>
            <th className="pb-2 pr-4 font-medium">Event</th>
            <th className="pb-2 pr-4 font-medium">Calculator</th>
            <th className="pb-2 pr-4 font-medium">Device</th>
            <th className="pb-2 font-medium">Success</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => {
            const isSelected = selectedIds.has(event.id);

            return (
              <tr
                key={event.id}
                onClick={() => onToggle(event.id)}
                className={`cursor-pointer border-t border-(--admin-border) text-(--admin-text-secondary) transition-colors hover:bg-(--admin-btn-secondary-hover) ${
                  isSelected ? "bg-(--admin-accent-soft)" : ""
                }`}
              >
                <td className="py-2 pr-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggle(event.id)}
                    aria-label={`Select event ${event.id}`}
                    className="h-4 w-4 cursor-pointer rounded border-(--admin-border) bg-(--admin-input-bg) accent-(--admin-accent)"
                  />
                </td>
                <td className="py-2 pr-4 whitespace-nowrap">
                  {formatEventTime(event.createdAt)}
                </td>
                <td className="py-2 pr-4">{formatEventLabel(event.event)}</td>
                <td className="py-2 pr-4">{event.calculatorId ?? "—"}</td>
                <td className="py-2 pr-4">
                  <span>{event.deviceLabel}</span>
                  {event.osVersion || event.platform ? (
                    <span className="block text-xs text-(--admin-text-muted)">
                      {formatPlatformLabel(event.platform)}
                      {event.osVersion ? ` ${event.osVersion}` : ""}
                    </span>
                  ) : null}
                </td>
                <td className="py-2">
                  {event.success == null
                    ? "—"
                    : event.success
                      ? "yes"
                      : "no"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function formatPlatformLabel(platform?: string) {
  const value = (platform ?? "android").toLowerCase();
  if (value === "ios") return "iOS";
  if (value === "web") return "Web";
  return "Android";
}
