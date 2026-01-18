import { useState } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRangeInput } from "@/components/ui/date-time-input";
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
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(customStartDate || "");
  const [tempEndDate, setTempEndDate] = useState(customEndDate || "");

  const handleValueChange = (newValue: string) => {
    const period = newValue as DatePeriod;
    if (period === "custom") {
      setIsCustomOpen(true);
    } else {
      onChange(period);
    }
  };

  const handleApplyCustom = () => {
    if (tempStartDate && tempEndDate && onCustomRange) {
      onCustomRange(tempStartDate, tempEndDate);
      onChange("custom");
    }
    setIsCustomOpen(false);
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
    <div className={cn("flex items-center gap-2", className)}>
      <Popover open={isCustomOpen} onOpenChange={setIsCustomOpen}>
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
        
        <PopoverTrigger asChild>
          <span className="hidden" />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Select Date Range</h4>
              <DateRangeInput
                startValue={tempStartDate}
                endValue={tempEndDate}
                onStartChange={setTempStartDate}
                onEndChange={setTempEndDate}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsCustomOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleApplyCustom}>
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
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
