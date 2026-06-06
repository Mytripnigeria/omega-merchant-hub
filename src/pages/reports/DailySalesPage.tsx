import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
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

type DayPreset = "today" | "yesterday";

function rangeFor(preset: DayPreset): { dateFrom: string; dateTo: string } {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();
  const iso = (date: Date) => date.toISOString().slice(0, 10);
  if (preset === "yesterday") {
    const start = new Date(y, m, d - 1);
    return { dateFrom: iso(start), dateTo: iso(start) };
  }
  return { dateFrom: iso(now), dateTo: iso(now) };
}

const ngn = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);

function formatHour(iso: string): string {
  const d = new Date(iso);
  const h = d.getHours();
  const suffix = h >= 12 ? "PM" : "AM";
  const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${display} ${suffix}`;
}

export default function DailySalesPage() {
  const { currentStore } = useStore();
  const storeId = currentStore?.id;
  const [preset, setPreset] = useState<DayPreset>("today");

  const filter = useMemo(() => {
    const { dateFrom, dateTo } = rangeFor(preset);
    return {
      ...(storeId ? { storeId } : {}),
      dateFrom,
      dateTo,
      groupBy: "hour" as const,
    };
  }, [storeId, preset]);

  const { data, isLoading } = useSalesReport(filter);
  const buckets = data?.buckets ?? [];

  const chartData = useMemo(
    () =>
      buckets.map((b) => ({
        time: formatHour(b.bucket),
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
            Hourly sales performance from completed orders
          </p>
        </div>
        <Select value={preset} onValueChange={(v) => setPreset(v as DayPreset)}>
          <SelectTrigger className="w-[140px] h-9 bg-muted/50 border-0">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
          </SelectContent>
        </Select>
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
          <CardTitle className="text-sm font-medium">Sales by hour</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : chartData.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No sales recorded for this day yet.
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
          <CardTitle className="text-sm font-medium">Hourly breakdown</CardTitle>
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
                        {formatHour(b.bucket)}
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
