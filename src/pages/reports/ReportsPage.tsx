import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useStore } from "@/contexts/StoreContext";
import {
  useDashboardSummary,
  useSalesReport,
  useTopProducts,
} from "@/hooks/api/use-reports";

type Period = "week" | "month" | "quarter" | "year";

function rangeFor(period: Period): {
  dateFrom: string;
  dateTo: string;
  prevFrom: string;
  prevTo: string;
} {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();
  const iso = (date: Date) => date.toISOString().slice(0, 10);

  let start: Date;
  let end: Date;
  if (period === "week") {
    start = new Date(y, m, d - now.getDay());
    end = now;
  } else if (period === "quarter") {
    const q = Math.floor(m / 3) * 3;
    start = new Date(y, q, 1);
    end = now;
  } else if (period === "year") {
    start = new Date(y, 0, 1);
    end = now;
  } else {
    start = new Date(y, m, 1);
    end = now;
  }

  const windowMs = end.getTime() - start.getTime();
  const prevEnd = new Date(start.getTime() - 1);
  const prevStart = new Date(prevEnd.getTime() - windowMs);

  return {
    dateFrom: iso(start),
    dateTo: iso(end),
    prevFrom: iso(prevStart),
    prevTo: iso(prevEnd),
  };
}

const ngn = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);

function pctChange(current: number, previous: number): number {
  if (previous <= 0) return 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

export default function ReportsPage() {
  const { currentStore } = useStore();
  const storeId = currentStore?.id;
  const [period, setPeriod] = useState<Period>("month");

  const ranges = useMemo(() => rangeFor(period), [period]);

  const currentFilter = useMemo(
    () => ({
      ...(storeId ? { storeId } : {}),
      dateFrom: ranges.dateFrom,
      dateTo: ranges.dateTo,
      groupBy: "day" as const,
    }),
    [storeId, ranges.dateFrom, ranges.dateTo],
  );
  const prevFilter = useMemo(
    () => ({
      ...(storeId ? { storeId } : {}),
      dateFrom: ranges.prevFrom,
      dateTo: ranges.prevTo,
      groupBy: "day" as const,
    }),
    [storeId, ranges.prevFrom, ranges.prevTo],
  );

  const { data: sales, isLoading: salesLoading } = useSalesReport(currentFilter);
  const { data: prevSales } = useSalesReport(prevFilter);
  const { data: topProducts, isLoading: topLoading } = useTopProducts({
    ...(storeId ? { storeId } : {}),
    dateFrom: ranges.dateFrom,
    dateTo: ranges.dateTo,
    limit: 5,
  });
  const { data: dashboard } = useDashboardSummary(storeId);

  const totalRevenue = sales?.totalRevenue ?? 0;
  const totalOrders = sales?.totalOrders ?? 0;
  const totalItems = sales?.totalItems ?? 0;
  const revenueChange = pctChange(totalRevenue, prevSales?.totalRevenue ?? 0);
  const ordersChange = pctChange(totalOrders, prevSales?.totalOrders ?? 0);
  const itemsChange = pctChange(totalItems, prevSales?.totalItems ?? 0);
  const customersChange = 0; // backend doesn't expose new-customer history per range yet

  const summaryStats = [
    {
      title: "Total Revenue",
      value: ngn(totalRevenue),
      change: revenueChange,
      icon: DollarSign,
    },
    {
      title: "Orders",
      value: totalOrders.toLocaleString(),
      change: ordersChange,
      icon: ShoppingCart,
    },
    {
      title: "Items Sold",
      value: totalItems.toLocaleString(),
      change: itemsChange,
      icon: Package,
    },
    {
      title: "New Customers",
      value: String(dashboard?.newCustomersToday ?? 0),
      change: customersChange,
      icon: Users,
      hideChange: true,
    },
  ];

  // Revenue trend chart data.
  const chartData = useMemo(
    () =>
      (sales?.buckets ?? []).map((b) => ({
        time: new Date(b.bucket).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
        revenue: b.revenue,
      })),
    [sales],
  );

  // Sales by channel.
  const channelEntries = useMemo(() => {
    const total = Object.values(sales?.byChannel ?? {}).reduce(
      (s, v) => s + v,
      0,
    );
    return Object.entries(sales?.byChannel ?? {})
      .map(([channel, revenue]) => ({
        channel,
        revenue,
        share: total > 0 ? (revenue / total) * 100 : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [sales]);

  // Peak-hour: derive from the busiest bucket already in sales report.
  const peakBucket = useMemo(() => {
    const buckets = sales?.buckets ?? [];
    if (buckets.length === 0) return null;
    return buckets.reduce((a, b) => (a.revenue >= b.revenue ? a : b));
  }, [sales]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Insights and performance data for {currentStore?.name ?? "your store"}
          </p>
        </div>
        <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
          <SelectTrigger className="w-[140px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {salesLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-3" />
                  <Skeleton className="h-7 w-32 mb-2" />
                  <Skeleton className="h-3 w-20" />
                </CardContent>
              </Card>
            ))
          : summaryStats.map((stat) => {
              const positive = stat.change >= 0;
              return (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    {!stat.hideChange && (
                      <div
                        className={`flex items-center text-sm ${
                          positive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {positive ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                        {stat.change.toFixed(1)}% vs previous {period}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>
                  Daily revenue across the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                {salesLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : chartData.length === 0 ? (
                  <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
                    No sales recorded in this period.
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop
                              offset="5%"
                              stopColor="hsl(var(--primary))"
                              stopOpacity={0.4}
                            />
                            <stop
                              offset="95%"
                              stopColor="hsl(var(--primary))"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="time"
                          fontSize={12}
                          stroke="hsl(var(--muted-foreground))"
                        />
                        <YAxis
                          fontSize={12}
                          stroke="hsl(var(--muted-foreground))"
                          tickFormatter={(v) =>
                            `${Math.round(Number(v) / 1000)}k`
                          }
                        />
                        <Tooltip
                          formatter={(value: number) => ngn(value)}
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: 8,
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="hsl(var(--primary))"
                          fill="url(#revGrad)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>Best performing items this period</CardDescription>
              </CardHeader>
              <CardContent>
                {topLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (topProducts?.rows ?? []).length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6 text-center">
                    No product sales yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {(topProducts?.rows ?? []).map((product, i) => (
                      <div
                        key={product.productId}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-sm font-medium text-muted-foreground w-6 shrink-0">
                            #{i + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {product.unitsSold} sold · {product.ordersCount} orders
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-medium">{ngn(product.revenue)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Channel</CardTitle>
                <CardDescription>
                  Revenue split across order channels
                </CardDescription>
              </CardHeader>
              <CardContent>
                {salesLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full" />
                    ))}
                  </div>
                ) : channelEntries.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6 text-center">
                    No channel data yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {channelEntries.map((item) => (
                      <div key={item.channel} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{item.channel}</span>
                          <span className="font-medium">{ngn(item.revenue)}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${Math.min(item.share, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Peak Day</CardTitle>
                <CardDescription>
                  Highest-revenue bucket in this period
                </CardDescription>
              </CardHeader>
              <CardContent>
                {salesLoading ? (
                  <Skeleton className="h-20 w-full" />
                ) : !peakBucket ? (
                  <p className="text-sm text-muted-foreground py-6 text-center">
                    No data
                  </p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-2xl font-semibold">
                      {ngn(peakBucket.revenue)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(peakBucket.bucket).toLocaleDateString(undefined, {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {peakBucket.orders} orders · {peakBucket.items} items
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Period totals</CardTitle>
                <CardDescription>vs previous {period}</CardDescription>
              </CardHeader>
              <CardContent>
                {salesLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Revenue</span>
                      <span className="flex items-center gap-1 font-medium">
                        {ngn(totalRevenue)}
                        <Badge
                          variant="secondary"
                          className={
                            revenueChange >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {revenueChange >= 0 ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          {revenueChange.toFixed(1)}%
                        </Badge>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Orders</span>
                      <span className="font-medium">{totalOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Items sold</span>
                      <span className="font-medium">{totalItems}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg order</span>
                      <span className="font-medium">
                        {ngn(Math.round(sales?.averageOrderValue ?? 0))}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
              <CardDescription>
                Top 5 products in this period — see Best Sellers for the full list
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : (topProducts?.rows ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  No product sales yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {(topProducts?.rows ?? []).map((row, i) => (
                    <div
                      key={row.productId}
                      className="flex items-center justify-between gap-2 p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Badge
                          variant={i < 3 ? "default" : "secondary"}
                          className="w-7 h-7 rounded-full flex items-center justify-center p-0 text-xs shrink-0"
                        >
                          {i + 1}
                        </Badge>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{row.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {row.unitsSold} units · {row.ordersCount} orders
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold shrink-0">{ngn(row.revenue)}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
