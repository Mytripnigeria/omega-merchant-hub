import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface DateTimeInputProps {
  label?: string;
  type?: "date" | "time" | "datetime-local";
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  defaultValue?: string;
}

export function DateTimeInput({
  label,
  type = "date",
  value,
  onChange,
  placeholder,
  disabled,
  className,
  id,
  defaultValue,
}: DateTimeInputProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input
        id={id}
        type={type}
        value={value}
        defaultValue={defaultValue}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "w-full",
          // Fix for mobile date/time inputs - ensure proper sizing and prevent overlap
          "[&::-webkit-calendar-picker-indicator]:opacity-100",
          "[&::-webkit-calendar-picker-indicator]:cursor-pointer",
          "[&::-webkit-calendar-picker-indicator]:p-0",
          "[&::-webkit-calendar-picker-indicator]:mr-0",
          "min-h-[40px]",
          // Mobile-specific fixes
          "text-sm",
          "appearance-none"
        )}
      />
    </div>
  );
}

interface DateRangeInputProps {
  startLabel?: string;
  endLabel?: string;
  startValue?: string;
  endValue?: string;
  onStartChange?: (value: string) => void;
  onEndChange?: (value: string) => void;
  type?: "date" | "time" | "datetime-local";
  disabled?: boolean;
  className?: string;
  startDefaultValue?: string;
  endDefaultValue?: string;
}

export function DateRangeInput({
  startLabel = "Start Date",
  endLabel = "End Date",
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  type = "date",
  disabled,
  className,
  startDefaultValue,
  endDefaultValue,
}: DateRangeInputProps) {
  return (
    <div className={cn("grid gap-4", className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DateTimeInput
          label={startLabel}
          type={type}
          value={startValue}
          defaultValue={startDefaultValue}
          onChange={onStartChange}
          disabled={disabled}
          id="start-date"
        />
        <DateTimeInput
          label={endLabel}
          type={type}
          value={endValue}
          defaultValue={endDefaultValue}
          onChange={onEndChange}
          disabled={disabled}
          id="end-date"
        />
      </div>
    </div>
  );
}
