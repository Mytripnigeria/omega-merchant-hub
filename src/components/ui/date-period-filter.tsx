import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type DatePeriod = "today" | "yesterday" | "this_week" | "this_month" | "all" | "custom";

interface DatePeriodFilterProps {
  value: DatePeriod;
  onChange: (period: DatePeriod) => void;
  onCustomRange?: (start: string, end: string) => void;
  customStartDate?: string;
  customEndDate?: string;
  className?: string;
  showAllOption?: boolean;
}

export function DatePeriodFilter({
  value,
  onChange,
  onCustomRange,
  customStartDate,
  customEndDate,
  className,
  showAllOption = true,
}: DatePeriodFilterProps) {
  const [tempStartDate, setTempStartDate] = useState(customStartDate || "");
  const [tempEndDate, setTempEndDate] = useState(customEndDate || "");

  // Keep the inputs in step with the range actually in effect (e.g. when a
  // page restores a saved filter).
  useEffect(() => {
    setTempStartDate(customStartDate || "");
    setTempEndDate(customEndDate || "");
  }, [customStartDate, customEndDate]);

  const handleValueChange = (newValue: string) => {
    const period = newValue as DatePeriod;
    onChange(period);
  };

  /**
   * Applies whichever endpoints are set. One is enough — a single date means
   * that day — and `resolveDatePeriodRange` mirrors the missing side.
   */
  const apply = (start: string, end: string) => {
    setTempStartDate(start);
    setTempEndDate(end);
    if (!onCustomRange) return;
    if (!start && !end) return;
    onCustomRange(start || end, end || start);
  };

  const getDisplayLabel = () => {
    switch (value) {
      case "today": return "Today";
      case "yesterday": return "Yesterday";
      case "this_week": return "This Week";
      case "this_month": return "This Month";
      case "all": return "All Time";
      case "custom": return "Custom";
      default: return "Select Period";
    }
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full sm:w-[140px]">
          <Calendar className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Period">{getDisplayLabel()}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {showAllOption && <SelectItem value="all">All Time</SelectItem>}
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="yesterday">Yesterday</SelectItem>
          <SelectItem value="this_week">This Week</SelectItem>
          <SelectItem value="this_month">This Month</SelectItem>
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>

      {/* The two dates sit inline rather than in a popover. The popover was
          anchored to a `hidden` span — no layout box, nothing for Radix to
          position against — so picking "Custom Range" opened a panel the user
          could never see, which is why custom dates appeared broken on every
          screen that uses this control. Inline also matches the workstation's
          own filter, and needs no Apply step. */}
      {value === "custom" && (
        <div className="flex items-center gap-2">
          <Input
            type="date"
            aria-label="Start date"
            value={tempStartDate}
            max={tempEndDate || undefined}
            onChange={(e) => apply(e.target.value, tempEndDate)}
            className="h-9 w-auto"
          />
          <span className="text-muted-foreground text-sm">to</span>
          <Input
            type="date"
            aria-label="End date"
            value={tempEndDate}
            min={tempStartDate || undefined}
            onChange={(e) => apply(tempStartDate, e.target.value)}
            className="h-9 w-auto"
          />
        </div>
      )}
    </div>
  );
}

// Utility hook for date period filtering
export function useDatePeriodFilter<T extends { date?: string; createdAt?: string }>(
  data: T[],
  period: DatePeriod,
  customStartDate?: string,
  customEndDate?: string,
  dateField: keyof T = "date" as keyof T
): T[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  return data.filter((item) => {
    const dateValue = item[dateField] as string | undefined;
    if (!dateValue) return true;
    
    const itemDate = new Date(dateValue);
    const itemDateOnly = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());

    switch (period) {
      case "today":
        return itemDateOnly.getTime() === today.getTime();
      case "yesterday":
        return itemDateOnly.getTime() === yesterday.getTime();
      case "this_week":
        return itemDateOnly >= weekStart && itemDateOnly <= today;
      case "this_month":
        return itemDateOnly >= monthStart && itemDateOnly <= today;
      case "custom":
        if (customStartDate && customEndDate) {
          const start = new Date(customStartDate);
          const end = new Date(customEndDate);
          return itemDateOnly >= start && itemDateOnly <= end;
        }
        return true;
      case "all":
      default:
        return true;
    }
  });
}

// Standalone filter function for use in filter callbacks
export function filterByDatePeriod(
  dateValue: string | undefined,
  period: DatePeriod,
  customStartDate?: string,
  customEndDate?: string
): boolean {
  if (!dateValue) return true;
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const itemDate = new Date(dateValue);
  const itemDateOnly = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());

  switch (period) {
    case "today":
      return itemDateOnly.getTime() === today.getTime();
    case "yesterday":
      return itemDateOnly.getTime() === yesterday.getTime();
    case "this_week":
      return itemDateOnly >= weekStart && itemDateOnly <= today;
    case "this_month":
      return itemDateOnly >= monthStart && itemDateOnly <= today;
    case "custom":
      if (customStartDate && customEndDate) {
        const start = new Date(customStartDate);
        const end = new Date(customEndDate);
        return itemDateOnly >= start && itemDateOnly <= end;
      }
      return true;
    case "all":
    default:
      return true;
  }
}
