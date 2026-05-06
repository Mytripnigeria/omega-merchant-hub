import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingCart,
  Clock,
  ChefHat,
  CheckCircle2,
  Timer,
  Utensils,
  Package,
  User,
  Search,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useStore } from "@/contexts/StoreContext";
import { useOrders, useOrderStats } from "@/hooks/api/use-orders";
import type { Order, OrderStatus } from "@/services/api/orders";

function statusBadgeVariant(status: OrderStatus): "default" | "secondary" | "outline" {
  if (status === "pending") return "default";
  if (status === "preparing") return "secondary";
  return "outline";
}

function statusBar(status: OrderStatus): string {
  switch (status) {
    case "pending":
      return "bg-blue-500";
    case "preparing":
      return "bg-yellow-500";
    case "ready":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
}

function orderType(o: Order): "delivery" | "dine-in" | "pickup" {
  if (o.isDelivery) return "delivery";
  if (o.tableNumber) return "dine-in";
  return "pickup";
}

export default function WorkstationPage() {
  const { currentStore } = useStore();
  const [search, setSearch] = useState("");

  const ordersQuery = useOrders({
    storeId: currentStore?.id,
    status: "pending,preparing,ready",
    limit: 50,
  });
  const statsQuery = useOrderStats(currentStore?.id);

  const orders = ordersQuery.data?.data ?? [];

  const filteredOrders = useMemo(() => {
    if (!search.trim()) return orders;
    const q = search.toLowerCase();
    return orders.filter((o) =>
      [
        `#${o.orderNumber}`,
        o.customerName ?? "",
        o.tableNumber ?? "",
        o.items.map((i) => i.name).join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [orders, search]);

  const kitchenItems = useMemo(() => {
    const list: Array<{
      id: string;
      orderNumber: number;
      itemName: string;
      itemId: string;
      createdAt: string;
    }> = [];
    for (const o of orders) {
      if (o.status !== "pending" && o.status !== "preparing") continue;
      for (const it of o.items) {
        if (it.prepStatus === "preparing" || it.prepStatus === "pending") {
          list.push({
            id: it.id,
            orderNumber: o.orderNumber,
            itemName: `${it.quantity}× ${it.name}`,
            itemId: it.id,
            createdAt: it.createdAt,
          });
        }
      }
    }
    return list;
  }, [orders]);

  const readyOrders = useMemo(
    () => filteredOrders.filter((o) => o.status === "ready"),
    [filteredOrders],
  );

  const stats = statsQuery.data;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Workstation</h1>
          <p className="text-muted-foreground">
            Live order management for {currentStore?.name ?? "your store"}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="default" className="gap-1">
            <ShoppingCart className="h-3 w-3" />
            {ordersQuery.isLoading ? "…" : filteredOrders.length} Active
          </Badge>
          {stats && (
            <Badge variant="secondary" className="gap-1">
              <Timer className="h-3 w-3" />
              Today: {stats.todayCount}
            </Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Order Board
          </TabsTrigger>
          <TabsTrigger value="kitchen" className="flex items-center gap-2">
            <ChefHat className="h-4 w-4" />
            Kitchen View
          </TabsTrigger>
          <TabsTrigger value="pickup" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Ready for Pickup
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {ordersQuery.isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-44 w-full" />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No active orders</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="relative overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-1 ${statusBar(order.status)}`} />
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">#{order.orderNumber}</CardTitle>
                      <Badge variant={statusBadgeVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <User className="h-3 w-3" />
                      {order.customerName ?? "Walk-in"}
                      {order.tableNumber && <span>• Table {order.tableNumber}</span>}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      {order.items.map((it) => (
                        <p key={it.id} className="text-sm">
                          {it.quantity}× {it.name}
                        </p>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                      </span>
                      <Badge variant="outline" className="text-xs">{orderType(order)}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="kitchen" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Kitchen Queue</CardTitle>
                  <CardDescription>Items waiting to be prepared</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">In progress: {kitchenItems.length}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {ordersQuery.isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : kitchenItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ChefHat className="h-10 w-10 mx-auto mb-2" />
                  <p className="text-sm">Kitchen queue is empty</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {kitchenItems.map((item) => {
                    const elapsedMin = Math.round(
                      (Date.now() - new Date(item.createdAt).getTime()) / 60000,
                    );
                    return (
                      <div
                        key={item.id}
                        className={`p-4 border rounded-lg ${
                          elapsedMin >= 10 ? "border-red-500 bg-red-50 dark:bg-red-950" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="font-bold">#{item.orderNumber}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Timer className="h-4 w-4" />
                            <span className={elapsedMin >= 10 ? "text-red-500 font-bold" : ""}>
                              {elapsedMin}m
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm flex items-center gap-2">
                            <Utensils className="h-3 w-3" />
                            {item.itemName}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pickup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Ready for Pickup
              </CardTitle>
              <CardDescription>Orders waiting to be collected</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {readyOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-6 border-2 border-green-500 rounded-lg bg-green-50 dark:bg-green-950"
                  >
                    <div className="text-center space-y-2">
                      <CheckCircle2 className="h-12 w-12 mx-auto text-green-500" />
                      <h3 className="text-2xl font-bold">#{order.orderNumber}</h3>
                      <p className="text-lg">{order.customerName ?? "Walk-in"}</p>
                      <Badge variant="outline">{orderType(order)}</Badge>
                      <div className="pt-4">
                        <Button className="w-full" disabled>
                          Awaiting collection
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {readyOrders.length === 0 && (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4" />
                    <p>No orders ready for pickup</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
