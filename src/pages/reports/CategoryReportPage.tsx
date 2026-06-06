import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Tag, Award, Calendar } from "lucide-react";
import { useFoodCostReport } from "@/hooks/api/use-reports";
import { useStore } from "@/contexts/StoreContext";

type Period = "week" | "month" | "quarter";

function rangeFor(period: Period): { dateFrom: string; dateTo: string } {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();
  const iso = (date: Date) => date.toISOString().slice(0, 10);
  if (period === "week") {
    const start = new Date(y, m, d - now.getDay());
    return { dateFrom: iso(start), dateTo: iso(now) };
  }
  if (period === "quarter") {
    const q = Math.floor(m / 3) * 3;
    return { dateFrom: iso(new Date(y, q, 1)), dateTo: iso(now) };
  }
  return { dateFrom: iso(new Date(y, m, 1)), dateTo: iso(now) };
}

const ngn = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);

export default function CategoryReportPage() {
  const { currentStore } = useStore();
  const storeId = currentStore?.id;
  const [period, setPeriod] = useState<Period>("month");

  const filter = useMemo(() => {
    const { dateFrom, dateTo } = rangeFor(period);
    return { ...(storeId ? { storeId } : {}), dateFrom, dateTo };
  }, [storeId, period]);

  const { data, isLoading } = useFoodCostReport(filter);
  const categories = data?.byCategory ?? [];
  const totalRevenue = data?.totalRevenue ?? 0;

  // Sort by revenue (backend returns sorted by cost; flip for the "best
  // sellers" framing on this page).
  const sortedByRevenue = useMemo(
    () => [...categories].sort((a, b) => b.totalRevenue - a.totalRevenue),
    [categories],
  );

  const topCategory = sortedByRevenue[0];

  const stats = [
    { label: "Top Category", value: topCategory?.name ?? "—", icon: Award },
    { label: "Categories", value: String(categories.length), icon: Tag },
    { label: "Total Revenue", value: ngn(totalRevenue), icon: TrendingUp },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Category Report</h1>
          <p className="text-sm text-muted-foreground">
            Revenue, units, and cost by product category
          </p>
        </div>
        <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
          <SelectTrigger className="w-[130px] h-9 bg-muted/50 border-0">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3 grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-8 w-8 rounded-lg mb-2" />
                  <Skeleton className="h-5 w-24 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </CardContent>
              </Card>
            ))
          : stats.map((stat) => (
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
          <CardTitle className="text-sm font-medium">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))
          ) : sortedByRevenue.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No completed orders in this period yet.
            </p>
          ) : (
            sortedByRevenue.map((cat) => {
              const sharePct =
                totalRevenue > 0 ? (cat.totalRevenue / totalRevenue) * 100 : 0;
              return (
                <div
                  key={cat.categoryId ?? "uncat"}
                  className="space-y-2 border-b last:border-0 pb-3 last:pb-0"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{cat.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {cat.unitsSold} units · {cat.foodCostPct.toFixed(1)}% food
                        cost
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold">{ngn(cat.totalRevenue)}</p>
                      <p className="text-xs text-muted-foreground">
                        Margin {ngn(cat.margin)}
                      </p>
                    </div>
                  </div>
                  <Progress value={Math.min(sharePct, 100)} className="h-1.5" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{sharePct.toFixed(1)}% of revenue</span>
                    <Badge variant="secondary" className="text-[10px]">
                      Cost {ngn(cat.totalCost)}
                    </Badge>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
