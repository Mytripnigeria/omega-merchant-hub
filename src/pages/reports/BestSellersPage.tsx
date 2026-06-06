import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Award, ShoppingBag, Calendar } from "lucide-react";
import { useTopProducts } from "@/hooks/api/use-reports";
import { useCategories } from "@/hooks/api/use-stock";
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

export default function BestSellersPage() {
  const { currentStore } = useStore();
  const storeId = currentStore?.id;
  const [period, setPeriod] = useState<Period>("month");

  const filter = useMemo(() => {
    const { dateFrom, dateTo } = rangeFor(period);
    return { ...(storeId ? { storeId } : {}), dateFrom, dateTo, limit: 20 };
  }, [storeId, period]);

  const { data, isLoading } = useTopProducts(filter);
  const rows = data?.rows ?? [];

  const { data: categoriesData } = useCategories({ limit: 200 });
  const categoryNameById = useMemo(() => {
    const list = (categoriesData?.data ?? []) as Array<{ id: string; name: string }>;
    const map = new Map<string, string>();
    for (const c of list) map.set(c.id, c.name);
    return map;
  }, [categoriesData]);

  const topRow = rows[0];
  const totalUnits = rows.reduce((s, r) => s + r.unitsSold, 0);
  const totalRevenue = rows.reduce((s, r) => s + r.revenue, 0);

  // Roll up category leaders client-side.
  const categoryLeader = useMemo(() => {
    const byCat = new Map<string, { name: string; revenue: number; product: string }>();
    for (const r of rows) {
      const key = r.categoryId ?? "uncat";
      const catName = r.categoryId
        ? categoryNameById.get(r.categoryId) ?? "Uncategorized"
        : "Uncategorized";
      const existing = byCat.get(key);
      if (!existing || r.revenue > existing.revenue) {
        byCat.set(key, { name: catName, revenue: r.revenue, product: r.name });
      }
    }
    return Array.from(byCat.values()).sort((a, b) => b.revenue - a.revenue);
  }, [rows, categoryNameById]);

  const stats = [
    { label: "Top Product", value: topRow?.name ?? "—", icon: Award },
    {
      label: "Total Units",
      value: totalUnits.toLocaleString(),
      icon: ShoppingBag,
    },
    { label: "Revenue", value: ngn(totalRevenue), icon: TrendingUp },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Best Sellers</h1>
          <p className="text-sm text-muted-foreground">
            Top performing products by revenue
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

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
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
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Top Products</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))
              ) : rows.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No sales in this period.
                </p>
              ) : (
                rows.map((row, idx) => (
                  <div
                    key={row.productId}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Badge
                        variant={idx < 3 ? "default" : "secondary"}
                        className="w-7 h-7 rounded-full flex items-center justify-center p-0 text-xs shrink-0"
                      >
                        {idx + 1}
                      </Badge>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{row.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {row.categoryId
                            ? categoryNameById.get(row.categoryId) ?? "Uncategorized"
                            : "Uncategorized"}
                          {" · "}
                          {row.ordersCount} orders
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-sm">
                        {row.unitsSold.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {ngn(row.revenue)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Category Leaders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))
              ) : categoryLeader.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No data
                </p>
              ) : (
                categoryLeader.slice(0, 6).map((c) => (
                  <div
                    key={c.name + c.product}
                    className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-muted/50"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{c.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {c.product}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {ngn(c.revenue)}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
