import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortableHeaderProps {
  label: string;
  field: string;
  currentSortField: string | null;
  currentSortDirection: "asc" | "desc";
  onSort: (field: string) => void;
  className?: string;
}

export function SortableHeader({
  label,
  field,
  currentSortField,
  currentSortDirection,
  onSort,
  className,
}: SortableHeaderProps) {
  const isActive = currentSortField === field;

  return (
    <button
      onClick={() => onSort(field)}
      className={cn(
        "flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors",
        isActive && "text-foreground",
        className
      )}
    >
      {label}
      <span className="ml-1">
        {isActive ? (
          currentSortDirection === "asc" ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )
        ) : (
          <ChevronsUpDown className="h-3 w-3 opacity-50" />
        )}
      </span>
    </button>
  );
}
