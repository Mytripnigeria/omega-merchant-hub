import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useTopProducts } from "@/hooks/api/use-reports";
import { useStore } from "@/contexts/StoreContext";

interface TopProductsProps {
  dateFrom: string;
  dateTo: string;
}

export const TopProducts = ({ dateFrom, dateTo }: TopProductsProps) => {
  const { currentStore, isAllStoresMode } = useStore();
  const { data, isLoading, error } = useTopProducts({
    storeId: !isAllStoresMode && currentStore ? currentStore.id : undefined,
    dateFrom,
    dateTo,
    limit: 5,
  });

  const rows = data?.rows ?? [];
  const maxRevenue = rows.reduce(
    (m, r) => (r.revenue > m ? r.revenue : m),
    0,
  );

  return (
    <Card>
      <div className="px-4 sm:px-6 py-4 border-b border-border">
        <h3 className="text-base font-semibold">Top products</h3>
        <p className="text-xs text-muted-foreground">
          Best sellers by revenue in the selected period.
        </p>
      </div>
      <CardContent className="p-4 sm:p-6 space-y-3">
        {isLoading ? (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-1.5 w-full" />
              </div>
            ))}
          </>
        ) : error ? (
          <div className="text-sm text-muted-foreground text-center py-6">
            Couldn't load top products.
          </div>
        ) : rows.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-6 flex flex-col items-center gap-2">
            <Package className="h-6 w-6 opacity-50" />
            No product sales in this period yet.
          </div>
        ) : (
          rows.map((row, idx) => (
            <div key={row.productId} className="space-y-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <div className="min-w-0 flex items-baseline gap-2">
                  <span className="text-xs font-mono text-muted-foreground w-4 flex-shrink-0">
                    {idx + 1}.
                  </span>
                  <span className="text-sm font-medium truncate">
                    {row.name}
                  </span>
                </div>
                <span className="text-sm font-semibold whitespace-nowrap">
                  {formatPrice(row.revenue)}
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{
                    width: `${
                      maxRevenue > 0 ? (row.revenue / maxRevenue) * 100 : 0
                    }%`,
                  }}
                />
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{row.unitsSold} units</span>
                <span>·</span>
                <span>{row.ordersCount} orders</span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
