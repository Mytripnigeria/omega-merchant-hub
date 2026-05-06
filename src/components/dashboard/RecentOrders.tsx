import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, Clock } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { useOrders } from "@/hooks/api/use-orders";
import { useStore } from "@/contexts/StoreContext";
import type { Order, OrderStatus } from "@/services/api/orders";

const statusColors: Record<OrderStatus, string> = {
  pending:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  preparing:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  ready: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  served: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  completed:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return "Just now";
  const mins = Math.round(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

export const RecentOrders = () => {
  const navigate = useNavigate();
  const { currentStore, isAllStoresMode } = useStore();
  const { data, isLoading, error, refetch } = useOrders({
    storeId: !isAllStoresMode && currentStore ? currentStore.id : undefined,
    page: 1,
    limit: 8,
  });

  const orders: Order[] = data?.data ?? [];

  return (
    <Card>
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between border-b border-border">
        <div>
          <h3 className="text-base font-semibold">Recent orders</h3>
          <p className="text-xs text-muted-foreground">
            Latest activity across the storefront and POS.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/orders")}
          className="gap-1"
        >
          View all
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="divide-y divide-border">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4 flex items-center gap-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-10 text-center text-sm text-muted-foreground space-y-3">
            <p>Couldn't load recent orders.</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            No orders yet — they'll appear here in real time as they come in.
          </div>
        ) : (
          <>
            {/* Mobile */}
            <div className="block sm:hidden divide-y divide-border">
              {orders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => navigate(`/orders?orderId=${order.id}`)}
                  className="w-full text-left p-4 hover:bg-muted/50 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-medium">
                      #{order.orderNumber}
                    </span>
                    <Badge
                      className={cn(
                        "text-xs font-normal capitalize",
                        statusColors[order.status],
                      )}
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {order.customerName ?? "Walk-in"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.items.length} items ·{" "}
                      {order.isDelivery ? "Delivery" : "Dine-in / Pickup"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatRelative(order.createdAt)}
                    </span>
                    <span className="text-sm font-semibold">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Desktop */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-xs font-medium text-muted-foreground">
                      Order
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-muted-foreground">
                      Customer
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-muted-foreground">
                      Channel
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-right p-4 text-xs font-medium text-muted-foreground">
                      Total
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-muted-foreground">
                      When
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer"
                      onClick={() => navigate(`/orders?orderId=${order.id}`)}
                    >
                      <td className="p-4 font-mono text-sm font-medium">
                        #{order.orderNumber}
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-medium">
                          {order.customerName ?? "Walk-in"}
                        </p>
                        {order.customerPhone && (
                          <p className="text-xs text-muted-foreground">
                            {order.customerPhone}
                          </p>
                        )}
                      </td>
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className="text-xs font-normal capitalize"
                        >
                          {order.channel}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge
                          className={cn(
                            "text-xs font-normal capitalize",
                            statusColors[order.status],
                          )}
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-right text-sm font-semibold">
                        {formatPrice(order.total)}
                      </td>
                      <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                        {formatRelative(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
