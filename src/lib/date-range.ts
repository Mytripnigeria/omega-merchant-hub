import type { DatePeriod } from "@/components/ui/date-period-filter";

/**
 * Local-calendar date helpers for the server-driven stats / report filters.
 *
 * `new Date().toISOString().slice(0, 10)` is the wrong way to name "today":
 * it renders the UTC calendar date, and Nigeria is UTC+1. Between 00:00 and
 * 00:59 Lagos time it therefore returns *yesterday*, which is why the platform
 * behaved as though a new day only began at 1am. Everything here works off the
 * browser's local calendar instead.
 *
 * The presets mirror `DatePeriodFilter` so the same control can drive both
 * client-side list filtering and `dateFrom`/`dateTo` query params.
 */

/** `YYYY-MM-DD` for the local calendar day of `d` (defaults to now). */
export function toLocalISODate(d: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export interface DateRange {
  dateFrom: string;
  dateTo: string;
}

/** Local midnight today. */
function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Resolve a `DatePeriod` to an inclusive local-calendar `dateFrom`/`dateTo`.
 *
 * Returns `undefined` for "all", meaning "send no date filter at all" — callers
 * spread the result into their query params, so an unbounded period simply
 * contributes nothing.
 *
 * Week/month are calendar-anchored (week starts Sunday, matching
 * `filterByDatePeriod`), not rolling windows — that is what a merchant means by
 * "this week's sales".
 */
export function resolveDatePeriodRange(
  period: DatePeriod,
  customStartDate?: string,
  customEndDate?: string,
): DateRange | undefined {
  const today = toLocalISODate();

  switch (period) {
    case "today":
      return { dateFrom: today, dateTo: today };
    case "yesterday": {
      const d = startOfToday();
      d.setDate(d.getDate() - 1);
      const y = toLocalISODate(d);
      return { dateFrom: y, dateTo: y };
    }
    case "this_week": {
      const d = startOfToday();
      d.setDate(d.getDate() - d.getDay());
      return { dateFrom: toLocalISODate(d), dateTo: today };
    }
    case "this_month": {
      const d = startOfToday();
      d.setDate(1);
      return { dateFrom: toLocalISODate(d), dateTo: today };
    }
    case "custom":
      // While the user is mid-pick one endpoint can be missing; fall back to
      // the other so the query stays valid rather than silently unbounded.
      if (!customStartDate && !customEndDate) return undefined;
      return {
        dateFrom: customStartDate || customEndDate!,
        dateTo: customEndDate || customStartDate!,
      };
    case "all":
    default:
      return undefined;
  }
}

/** Human label for the active period, for chart subtitles and empty states. */
export function describeDatePeriod(
  period: DatePeriod,
  customStartDate?: string,
  customEndDate?: string,
): string {
  switch (period) {
    case "today":
      return "Today";
    case "yesterday":
      return "Yesterday";
    case "this_week":
      return "This week";
    case "this_month":
      return "This month";
    case "all":
      return "All time";
    case "custom":
      if (customStartDate && customEndDate && customStartDate !== customEndDate)
        return `${customStartDate} → ${customEndDate}`;
      return customStartDate || customEndDate || "Custom range";
    default:
      return "Today";
  }
}
