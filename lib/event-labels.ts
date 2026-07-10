const EVENT_LABELS: Record<string, string> = {
  calculator_session_end: "Closed",
  calculator_opened: "Opened",
  calculator_calculation: "Calculation",
};

export function formatEventLabel(event: string) {
  return EVENT_LABELS[event] ?? event;
}
