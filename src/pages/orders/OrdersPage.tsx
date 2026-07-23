import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { TablePagination } from "@/components/ui/table-pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DatePeriodFilter,
  type DatePeriod,
} from "@/components/ui/date-period-filter";
import { ErrorState } from "@/components/ui/data-states";
import { cn, formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { useStore } from "@/contexts/StoreContext";
import {
  useOrder,
  useOrderEvents,
  useOrders,
  useOrderStats,
  useRefundOrder,
} from "@/hooks/api/use-orders";
import type { Order, OrderStatus } from "@/services/api/orders";
import {
  CalendarClock,
  Clock,
  CreditCard,
  FileText,
  MapPin,
  Package,
  Receipt,
  RefreshCw,
  Search,
  Truck,
  User,
} from "lucide-react";

const statusColors: Record<OrderStatus, string> = {
  pending:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  preparing:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  ready:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  served: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  completed:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  cancelled:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const paymentStatusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-700",
};

const PERIOD_RANGE = (
  period: DatePeriod,
  start: string,
  end: string,
): { dateFrom?: string; dateTo?: string } => {
  if (period === "all") return {};
  if (period === "custom") return { dateFrom: start, dateTo: end };
  const today = new Date();
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  if (period === "today") return { dateFrom: fmt(today), dateTo: fmt(today) };
  if (period === "yesterday") {
    const y = new Date(today);
    y.setDate(y.getDate() - 1);
    return { dateFrom: fmt(y), dateTo: fmt(y) };
  }
  if (period === "this_week") {
    const w = new Date(today);
    w.setDate(today.getDate() - today.getDay());
    return { dateFrom: fmt(w), dateTo: fmt(today) };
  }
  if (period === "this_month") {
    const m = new Date(today.getFullYear(), today.getMonth(), 1);
    return { dateFrom: fmt(m), dateTo: fmt(today) };
  }
  return {};
};

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-3 sm:p-4">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-7 w-12" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <Skeleton className="h-4 w-20" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function OrderTimeline({ orderId }: { orderId: string }) {
  const eventsQuery = useOrderEvents(orderId);
  const events = eventsQuery.data ?? [];
  if (eventsQuery.isLoading) {
    return (
      <div className="space-y-2 mt-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }
  if (events.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-6 text-center">
        No status events yet.
      </p>
    );
  }
  return (
    <div className="space-y-3 mt-4">
      {events.map((e) => (
        <div key={e.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <div className="w-px flex-1 bg-border" />
          </div>
          <div className="flex-1 pb-3">
            <div className="flex items-center gap-2 flex-wrap">
              {e.fromStatus && (
                <Badge variant="outline" className="text-xs">
                  {e.fromStatus}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">→</span>
              <Badge className={cn("text-xs", statusColors[e.toStatus])}>
                {e.toStatus}
              </Badge>
              <span className="text-xs text-muted-foreground ml-auto">
                {new Date(e.createdAt).toLocaleString()}
              </span>
            </div>
            {e.reason && (
              <p className="text-xs text-muted-foreground mt-1">
                {e.reason}
              </p>
            )}
            {e.actorType && (
              <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">
                by {e.actorType}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function RefundDialog({
  order,
  open,
  onOpenChange,
}: {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const refundable = Math.max(
    0,
    Number(order.paidAmount) - Number(order.refundedAmount ?? 0),
  );
  const [amount, setAmount] = useState<string>(String(refundable));
  const [reason, setReason] = useState<string>("");
  const refundMutation = useRefundOrder();

  const submit = async () => {
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) {
      toast.error("Enter a valid refund amount");
      return;
    }
    if (n > refundable) {
      toast.error(`Maximum refundable: ${formatPrice(refundable)}`);
      return;
    }
    try {
      await refundMutation.mutateAsync({
        id: order.id,
        amount: n,
        reason: reason || undefined,
      });
      toast.success(`Refunded ${formatPrice(n)}`);
      onOpenChange(false);
    } catch (e) {
      toast.error((e as Error).message ?? "Refund failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Refund order #{order.orderNumber}</DialogTitle>
          <DialogDescription>
            Refundable balance: {formatPrice(refundable)}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="refund-amount">Amount</Label>
            <Input
              id="refund-amount"
              type="number"
              min={0}
              max={refundable}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="refund-reason">Reason (optional)</Label>
            <Textarea
              id="refund-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="e.g. Customer received wrong item"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={refundMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={submit}
            disabled={refundMutation.isPending || refundable <= 0}
          >
            {refundMutation.isPending
              ? "Processing…"
              : `Refund ${formatPrice(Number(amount) || 0)}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function OrdersPage() {
  const { currentStore, isAllStoresMode } = useStore();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [channelFilter, setChannelFilter] = useState<
    "all" | "pos" | "website" | "phone"
  >("all");
  const [datePeriod, setDatePeriod] = useState<DatePeriod>("today");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isRefundOpen, setIsRefundOpen] = useState(false);

  const dateRange = useMemo(
    () => PERIOD_RANGE(datePeriod, customStartDate, customEndDate),
    [datePeriod, customStartDate, customEndDate],
  );

  const filters = useMemo(
    () => ({
      storeId:
        !isAllStoresMode && currentStore ? currentStore.id : undefined,
      status: statusFilter === "all" ? undefined : statusFilter,
      channel: channelFilter === "all" ? undefined : channelFilter,
      search: search || undefined,
      ...dateRange,
      page,
      limit: pageSize,
    }),
    [
      isAllStoresMode,
      currentStore,
      statusFilter,
      channelFilter,
      search,
      dateRange,
      page,
      pageSize,
    ],
  );

  const ordersQuery = useOrders(filters);
  const statsQuery = useOrderStats(
    !isAllStoresMode && currentStore ? currentStore.id : undefined,
  );
  const selectedOrderQuery = useOrder(selectedId ?? "");
  const selectedOrder = (selectedOrderQuery.data ?? null) as Order | null;

  const orders: Order[] = ordersQuery.data?.data ?? [];
  const total = ordersQuery.data?.total ?? 0;
  const totalPages = ordersQuery.data?.totalPages ?? 1;
  const startIndex = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, total);

  const handleViewOrder = (order: Order) => {
    setSelectedId(order.id);
    setIsSheetOpen(true);
  };

  const handleSearchSubmit = () => {
    setSearch(searchInput.trim());
    setPage(1);
  };

  if (ordersQuery.isError) {
    return (
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Orders
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage and track all customer orders
          </p>
        </div>
        <ErrorState
          onRetry={() => ordersQuery.refetch()}
          description={(ordersQuery.error as Error)?.message}
        />
      </div>
    );
  }

  const stats = statsQuery.data;
  const displayStats = [
    { label: "Today's orders", value: stats?.todayCount ?? 0 },
    { label: "Today's revenue", value: formatPrice(stats?.todayRevenue ?? 0) },
    { label: "Pending", value: stats?.pendingCount ?? 0 },
    {
      label: "Active queue",
      value: (stats?.preparingCount ?? 0) + (stats?.readyCount ?? 0),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Orders
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage and track all customer orders
          </p>
        </div>
      </div>

      {/* Stats */}
      {statsQuery.isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {displayStats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-xl sm:text-2xl font-semibold">
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by order number, customer name or phone…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearchSubmit();
            }}
            onBlur={handleSearchSubmit}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <DatePeriodFilter
            value={datePeriod}
            onChange={(v) => {
              setDatePeriod(v);
              setPage(1);
            }}
            customStartDate={customStartDate}
            customEndDate={customEndDate}
            onCustomRange={(s, e) => {
              setCustomStartDate(s);
              setCustomEndDate(e);
              setPage(1);
            }}
          />
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v as typeof statusFilter);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="served">Served</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={channelFilter}
            onValueChange={(v) => {
              setChannelFilter(v as typeof channelFilter);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All channels</SelectItem>
              <SelectItem value="pos">POS</SelectItem>
              <SelectItem value="website">Storefront</SelectItem>
              <SelectItem value="phone">Phone</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders list */}
      {ordersQuery.isLoading ? (
        <TableSkeleton />
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No orders match your filters.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            {/* Mobile */}
            <div className="block sm:hidden divide-y divide-border">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 space-y-2 cursor-pointer hover:bg-muted/50"
                  onClick={() => handleViewOrder(order)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-medium">
                      #{order.orderNumber}
                    </span>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs font-normal",
                        statusColors[order.status],
                      )}
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {order.customerName ?? "Walk-in customer"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.items.length} items ·{" "}
                      {order.isDelivery ? "Delivery" : "Dine-in / Takeaway"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                    <span className="font-semibold">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
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
                    <th className="text-left p-4 text-xs font-medium text-muted-foreground">
                      Payment
                    </th>
                    <th className="text-right p-4 text-xs font-medium text-muted-foreground">
                      Total
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-muted-foreground">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="cursor-pointer hover:bg-muted/50 border-b border-border last:border-0"
                      onClick={() => handleViewOrder(order)}
                    >
                      <td className="p-4 font-mono text-sm font-medium">
                        #{order.orderNumber}
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-sm">
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
                          className="text-xs font-normal"
                        >
                          {order.channel}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge
                          className={cn(
                            "text-xs font-normal",
                            statusColors[order.status],
                          )}
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        {order.paymentStatus && (
                          <Badge
                            className={cn(
                              "text-xs font-normal",
                              paymentStatusColors[order.paymentStatus],
                            )}
                          >
                            {order.paymentStatus}
                          </Badge>
                        )}
                      </td>
                      <td className="p-4 font-medium text-right whitespace-nowrap">
                        {formatPrice(order.total)}
                      </td>
                      <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <TablePagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={total}
        startIndex={startIndex}
        endIndex={endIndex}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
        }}
      />

      {/* Detail sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {selectedOrder && (
            <>
              <SheetHeader className="space-y-1">
                <SheetTitle className="flex items-center gap-2">
                  <span>Order #{selectedOrder.orderNumber}</span>
                  <Badge
                    className={cn(
                      "font-normal",
                      statusColors[selectedOrder.status],
                    )}
                  >
                    {selectedOrder.status}
                  </Badge>
                  {selectedOrder.paymentStatus && (
                    <Badge
                      className={cn(
                        "font-normal",
                        paymentStatusColors[selectedOrder.paymentStatus],
                      )}
                    >
                      {selectedOrder.paymentStatus}
                    </Badge>
                  )}
                </SheetTitle>
                <SheetDescription>
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </SheetDescription>
              </SheetHeader>

              <Tabs defaultValue="details" className="mt-6">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="items">Items</TabsTrigger>
                  <TabsTrigger value="payment">Payment</TabsTrigger>
                  <TabsTrigger value="delivery">Delivery</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Customer
                    </h4>
                    <Card>
                      <CardContent className="p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Name
                          </span>
                          <span className="text-sm font-medium">
                            {selectedOrder.customerName ?? "Walk-in"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Phone
                          </span>
                          <span className="text-sm">
                            {selectedOrder.customerPhone ?? "—"}
                          </span>
                        </div>
                        {selectedOrder.tableNumber && (
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Table
                            </span>
                            <span className="text-sm font-medium">
                              {selectedOrder.tableNumber}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Order Info
                    </h4>
                    <Card>
                      <CardContent className="p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Channel
                          </span>
                          <Badge variant="outline">
                            {selectedOrder.channel}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Type
                          </span>
                          <Badge variant="outline">
                            {selectedOrder.isDelivery
                              ? "Delivery"
                              : "Dine-in / Pickup"}
                          </Badge>
                        </div>
                        {selectedOrder.staffName && (
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Cashier
                            </span>
                            <span className="text-sm">
                              {selectedOrder.staffName}
                            </span>
                          </div>
                        )}
                        {selectedOrder.scheduledFor && (
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Scheduled
                            </span>
                            <span className="text-sm inline-flex items-center gap-1">
                              <CalendarClock className="h-3 w-3" />
                              {new Date(
                                selectedOrder.scheduledFor,
                              ).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {selectedOrder.notes && (
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm font-medium mb-1">Notes</p>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {selectedOrder.notes}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="items" className="space-y-3 mt-4">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Line items ({selectedOrder.items.length})
                  </h4>
                  <Card>
                    <CardContent className="p-0">
                      <div className="divide-y divide-border">
                        {selectedOrder.items.map((item) => {
                          const variationName =
                            item.variation && typeof item.variation === "object"
                              ? (item.variation as { name?: unknown }).name
                              : null;
                          const addonNames = (item.addons ?? [])
                            .map((a) =>
                              a && typeof a === "object"
                                ? (a as { name?: unknown }).name
                                : null,
                            )
                            .filter(
                              (n): n is string =>
                                typeof n === "string" && n.length > 0,
                            );
                          return (
                            <div key={item.id} className="p-3 space-y-1">
                              <div className="flex justify-between gap-2">
                                <span className="text-sm font-medium">
                                  {item.quantity}× {item.name}
                                </span>
                                <span className="text-sm font-semibold whitespace-nowrap">
                                  {formatPrice(item.subtotal)}
                                </span>
                              </div>
                              {typeof variationName === "string" && variationName.length > 0 && (
                                <p className="text-xs text-muted-foreground">
                                  Variation: <span className="text-foreground">{variationName}</span>
                                </p>
                              )}
                              {addonNames.length > 0 && (
                                <p className="text-xs text-muted-foreground">
                                  Add-ons:{" "}
                                  <span className="text-foreground">
                                    {addonNames.join(", ")}
                                  </span>
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground">
                                @ {formatPrice(item.unitPrice)}
                                {" · prep: "}
                                <span className="capitalize">
                                  {item.prepStatus}
                                </span>
                              </p>
                              {item.notes && (
                                <p className="text-xs italic text-muted-foreground">
                                  "{item.notes}"
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="payment" className="space-y-3 mt-4">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Payment
                  </h4>
                  <Card>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Subtotal
                        </span>
                        <span className="text-sm">
                          {formatPrice(selectedOrder.subtotal)}
                        </span>
                      </div>
                      {selectedOrder.taxAmount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Tax
                          </span>
                          <span className="text-sm">
                            {formatPrice(selectedOrder.taxAmount)}
                          </span>
                        </div>
                      )}
                      {selectedOrder.deliveryFee > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Delivery fee
                          </span>
                          <span className="text-sm">
                            {formatPrice(selectedOrder.deliveryFee)}
                          </span>
                        </div>
                      )}
                      {selectedOrder.tipAmount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Tip
                          </span>
                          <span className="text-sm">
                            {formatPrice(selectedOrder.tipAmount)}
                          </span>
                        </div>
                      )}
                      {selectedOrder.discountAmount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Discount
                          </span>
                          <span className="text-sm text-green-600">
                            -{formatPrice(selectedOrder.discountAmount)}
                          </span>
                        </div>
                      )}
                      {selectedOrder.pointsRedeemed > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Points redeemed ({selectedOrder.pointsRedeemed} pts)
                          </span>
                          <span className="text-sm text-green-600">
                            -{formatPrice(selectedOrder.pointsValue)}
                          </span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between text-base font-semibold">
                        <span>Total</span>
                        <span>{formatPrice(selectedOrder.total)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Paid
                        </span>
                        <span className="text-sm">
                          {formatPrice(selectedOrder.paidAmount)}
                        </span>
                      </div>
                      {selectedOrder.refundedAmount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Refunded
                          </span>
                          <span className="text-sm text-orange-600">
                            -{formatPrice(selectedOrder.refundedAmount)}
                          </span>
                        </div>
                      )}
                      {selectedOrder.paymentChannel && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Method
                          </span>
                          <span className="text-sm capitalize">
                            {selectedOrder.paymentChannel}
                          </span>
                        </div>
                      )}
                      {selectedOrder.paymentReference && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Reference
                          </span>
                          <span className="text-xs font-mono">
                            {selectedOrder.paymentReference}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {Number(selectedOrder.paidAmount) -
                    Number(selectedOrder.refundedAmount ?? 0) >
                    0 && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsRefundOpen(true)}
                    >
                      <Receipt className="h-4 w-4 mr-2" />
                      Issue refund
                    </Button>
                  )}
                </TabsContent>

                <TabsContent value="delivery" className="space-y-3 mt-4">
                  {selectedOrder.isDelivery &&
                  selectedOrder.deliveryAddress ? (
                    <>
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Address
                      </h4>
                      <Card>
                        <CardContent className="p-4 space-y-1 text-sm">
                          {Object.entries(selectedOrder.deliveryAddress).map(
                            ([k, v]) => (
                              <div key={k} className="flex justify-between">
                                <span className="text-muted-foreground capitalize">
                                  {k.replace(/([A-Z])/g, " $1")}
                                </span>
                                <span className="text-right">
                                  {String(v ?? "—")}
                                </span>
                              </div>
                            ),
                          )}
                        </CardContent>
                      </Card>
                      <h4 className="text-sm font-medium flex items-center gap-2 pt-2">
                        <Truck className="h-4 w-4" />
                        Rider
                      </h4>
                      <Card>
                        <CardContent className="p-4 text-sm text-muted-foreground">
                          Rider info is managed in the Deliveries module —
                          assign a rider there to surface their status here.
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground py-6 text-center">
                      Not a delivery order.
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="timeline" className="mt-4">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Status timeline
                  </h4>
                  <OrderTimeline orderId={selectedOrder.id} />
                </TabsContent>
              </Tabs>

              {selectedOrder && (
                <RefundDialog
                  order={selectedOrder}
                  open={isRefundOpen}
                  onOpenChange={setIsRefundOpen}
                />
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
