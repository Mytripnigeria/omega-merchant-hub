import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DatePeriodFilter,
  type DatePeriod,
} from "@/components/ui/date-period-filter";
import { resolveDatePeriodRange } from "@/lib/date-range";
import {
  DollarSign,
  ShoppingCart,
  Clock,
} from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useSalesReport } from "@/hooks/api/use-reports";
import { useStore } from "@/contexts/StoreContext";

const ngn = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);

/**
 * Label a sales bucket.
 *
 * Buckets are local wall-clock labels from the backend: `YYYY-MM-DDTHH:mm:ss`
 * for hourly granularity and a bare `YYYY-MM-DD` for daily. They must be read
 * as strings — parsing a bare date through `new Date()` treats it as UTC
 * midnight, which in Lagos is 01:00, and that is why every bucket on this page
 * used to render as "1 AM".
 */
function formatBucket(bucket: string): string {
  const [date, time] = bucket.split("T");
  if (!time) {
    const [, month, day] = date.split("-");
    return `${day}/${month}`;
  }
  const h = Number(time.slice(0, 2));
  const suffix = h >= 12 ? "PM" : "AM";
  const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${display} ${suffix}`;
}

export default function DailySalesPage() {
  const { currentStore } = useStore();
  const storeId = currentStore?.id;
  const [preset, setPreset] = useState<DatePeriod>("today");
  const [customStart, setCustomStart] = useState<string>();
  const [customEnd, setCustomEnd] = useState<string>();

  // A single day breaks down by hour; a multi-day range by day, otherwise the
  // hours of different days would be interleaved under the same labels.
  const groupBy = preset === "today" || preset === "yesterday" ? "hour" : "day";

  const filter = useMemo(() => {
    const range = resolveDatePeriodRange(preset, customStart, customEnd);
    return {
      ...(storeId ? { storeId } : {}),
      ...(range ?? {}),
      groupBy: groupBy as "hour" | "day",
    };
  }, [storeId, preset, customStart, customEnd, groupBy]);

  const { data, isLoading } = useSalesReport(filter);
  const buckets = data?.buckets ?? [];

  const chartData = useMemo(
    () =>
      buckets.map((b) => ({
        time: formatBucket(b.bucket),
        sales: b.revenue,
      })),
    [buckets],
  );

  const peakHourBucket = useMemo(() => {
    if (buckets.length === 0) return null;
    return buckets.reduce((peak, b) =>
      b.revenue > peak.revenue ? b : peak,
    );
  }, [buckets]);

  const totalRevenue = data?.totalRevenue ?? 0;
  const totalOrders = data?.totalOrders ?? 0;
  const avgOrder = data?.averageOrderValue ?? 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Daily Sales</h1>
          <p className="text-sm text-muted-foreground">
            {groupBy === "hour"
              ? "Hourly sales performance from completed orders"
              : "Daily sales performance from completed orders"}
          </p>
        </div>
        <DatePeriodFilter
          value={preset}
          onChange={setPreset}
          showAllOption={false}
          customStartDate={customStart}
          customEndDate={customEnd}
          onCustomRange={(start, end) => {
            setCustomStart(start);
            setCustomEnd(end);
          }}
        />
      </div>

      <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-3 w-20 mb-2" />
                  <Skeleton className="h-6 w-24" />
                </CardContent>
              </Card>
            ))
          : [
              {
                label: "Total Sales",
                value: ngn(totalRevenue),
                icon: DollarSign,
              },
              {
                label: "Orders",
                value: totalOrders.toLocaleString(),
                icon: ShoppingCart,
              },
              {
                label: "Avg Order",
                value: ngn(Math.round(avgOrder)),
                icon: Clock,
              },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="text-lg font-semibold truncate">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            {groupBy === "hour" ? "Sales by hour" : "Sales by day"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : chartData.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No sales recorded for this period yet.
            </p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
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
                    tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`}
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
                    dataKey="sales"
                    stroke="hsl(var(--primary))"
                    fill="url(#salesGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            {groupBy === "hour" ? "Hourly breakdown" : "Daily breakdown"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : buckets.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No data
            </p>
          ) : (
            <div className="divide-y">
              {buckets.map((b) => {
                const isPeak = peakHourBucket?.bucket === b.bucket;
                return (
                  <div
                    key={b.bucket}
                    className="flex items-center justify-between gap-2 py-2 text-sm"
                  >
                    <div>
                      <p
                        className={`font-medium ${isPeak ? "text-primary" : ""}`}
                      >
                        {formatBucket(b.bucket)}
                        {isPeak && (
                          <span className="ml-2 text-xs text-primary">peak</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {b.orders} orders · {b.items} items
                      </p>
                    </div>
                    <p className="font-semibold">{ngn(b.revenue)}</p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
