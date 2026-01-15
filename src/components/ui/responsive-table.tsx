import * as React from "react";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
  hideOnMobile?: boolean;
}

interface ResponsiveTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string | number;
  mobileCard: (item: T) => React.ReactNode;
  className?: string;
  onRowClick?: (item: T) => void;
}

export function ResponsiveTable<T>({
  data,
  columns,
  keyExtractor,
  mobileCard,
  className,
  onRowClick,
}: ResponsiveTableProps<T>) {
  return (
    <div className={className}>
      {/* Mobile Card View */}
      <div className="block sm:hidden divide-y divide-border">
        {data.map((item) => (
          <div
            key={keyExtractor(item)}
            className={cn(
              "p-4",
              onRowClick && "cursor-pointer active:bg-muted/50"
            )}
            onClick={() => onRowClick?.(item)}
          >
            {mobileCard(item)}
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={cn(
                    "text-left text-xs font-medium text-muted-foreground p-4 first:pl-6 last:pr-6",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={keyExtractor(item)}
                className={cn(
                  "group border-b border-border last:border-0 hover:bg-muted/50",
                  onRowClick && "cursor-pointer"
                )}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={cn(
                      "p-4 first:pl-6 last:pr-6 text-sm",
                      col.className
                    )}
                  >
                    {col.render
                      ? col.render(item)
                      : String((item as Record<string, unknown>)[col.key as string] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
