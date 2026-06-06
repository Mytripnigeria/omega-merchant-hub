import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  TrendingDown,
  Utensils,
  PieChart,
  Search,
} from "lucide-react";
import { useFoodCostReport } from "@/hooks/api/use-reports";
import { useStore } from "@/contexts/StoreContext";

type PresetRange = "this_week" | "this_month" | "last_month" | "this_quarter";

const TARGET_PCT_FALLBACK = 30;

function rangeFor(preset: PresetRange): { dateFrom: string; dateTo: string } {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();
  const iso = (date: Date) => date.toISOString().slice(0, 10);
  if (preset === "this_week") {
    const start = new Date(y, m, d - now.getDay());
    return { dateFrom: iso(start), dateTo: iso(now) };
  }
  if (preset === "last_month") {
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 0);
    return { dateFrom: iso(start), dateTo: iso(end) };
  }
  if (preset === "this_quarter") {
    const q = Math.floor(m / 3) * 3;
    const start = new Date(y, q, 1);
    return { dateFrom: iso(start), dateTo: iso(now) };
  }
  // this_month
  const start = new Date(y, m, 1);
  return { dateFrom: iso(start), dateTo: iso(now) };
}

const ngn = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="border-border/50">
          <CardContent className="p-3 sm:p-4">
            <Skeleton className="h-3 w-24 mb-2" />
            <Skeleton className="h-7 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function pctColor(pct: number, target: number): string {
  if (pct <= target) return "text-green-600";
  if (pct <= target * 1.15) return "text-yellow-600";
  return "text-red-600";
}

export default function FoodCostPage() {
  const { currentStore } = useStore();
  const storeId = currentStore?.id;

  const [preset, setPreset] = useState<PresetRange>("this_month");
  const [itemSearch, setItemSearch] = useState("");

  const filter = useMemo(() => {
    const { dateFrom, dateTo } = rangeFor(preset);
    return { ...(storeId ? { storeId } : {}), dateFrom, dateTo };
  }, [storeId, preset]);

  const { data: report, isLoading } = useFoodCostReport(filter);

  const target = report?.targetPct ?? TARGET_PCT_FALLBACK;
  const filteredItems = useMemo(() => {
    const all = report?.byItem ?? [];
    const q = itemSearch.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        (i.categoryName ?? "").toLowerCase().includes(q),
    );
  }, [report, itemSearch]);

  const overallPct = report?.foodCostPct ?? 0;
  const overallVsTarget = overallPct - target;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Food Cost Analysis</h1>
          <p className="text-sm text-muted-foreground">
            Cost vs. selling price of sold items — by category and by item.
          </p>
        </div>
        <Select value={preset} onValueChange={(v) => setPreset(v as PresetRange)}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this_week">This Week</SelectItem>
            <SelectItem value="this_month">This Month</SelectItem>
            <SelectItem value="last_month">Last Month</SelectItem>
            <SelectItem value="this_quarter">This Quarter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Total Food Cost
                  </p>
                  <p className="text-xl sm:text-2xl font-semibold">
                    {ngn(report?.totalCost ?? 0)}
                  </p>
                </div>
                <DollarSign className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Food Cost %
                  </p>
                  <p
                    className={`text-xl sm:text-2xl font-semibold ${pctColor(overallPct, target)}`}
                  >
                    {overallPct.toFixed(1)}%
                  </p>
                </div>
                <PieChart className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    vs Target ({target}%)
                  </p>
                  <p
                    className={`text-xl sm:text-2xl font-semibold ${
                      overallVsTarget <= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {overallVsTarget > 0 ? "+" : ""}
                    {overallVsTarget.toFixed(1)}%
                  </p>
                </div>
                <TrendingDown className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Items Tracked
                  </p>
                  <p className="text-xl sm:text-2xl font-semibold">
                    {report?.itemsTracked ?? 0}
                  </p>
                </div>
                <Utensils className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Period totals</h3>
            <span className="text-xs text-muted-foreground">Target: {target}%</span>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Revenue</p>
              <p className="font-semibold">{ngn(report?.totalRevenue ?? 0)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Cost</p>
              <p className="font-semibold">{ngn(report?.totalCost ?? 0)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Margin</p>
              <p className="font-semibold text-green-600">
                {ngn(report?.margin ?? 0)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Units sold</p>
              <p className="font-semibold">{report?.unitsSold ?? 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="category" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:inline-grid">
          <TabsTrigger value="category">By Category</TabsTrigger>
          <TabsTrigger value="item">By Item</TabsTrigger>
        </TabsList>

        <TabsContent value="category" className="mt-4">
          <Card>
            <CardContent className="p-4 space-y-3">
              {isLoading ? (
                <Skeleton className="h-40 w-full" />
              ) : (report?.byCategory ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No completed-order data in this period yet.
                </p>
              ) : (
                (report?.byCategory ?? []).map((row) => (
                  <div
                    key={row.categoryId ?? "uncat"}
                    className="space-y-2 border-b last:border-0 pb-3 last:pb-0"
                  >
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <div className="min-w-0">
                        <p className="font-medium truncate">{row.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {row.unitsSold} units · {row.shareOfCost.toFixed(1)}% of
                          total cost
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold">
                          {ngn(row.totalCost)}
                        </p>
                        <p
                          className={`text-xs font-medium ${pctColor(row.foodCostPct, target)}`}
                        >
                          {row.foodCostPct.toFixed(1)}% food cost
                        </p>
                      </div>
                    </div>
                    <Progress value={Math.min(row.shareOfCost, 100)} className="h-1.5" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Revenue {ngn(row.totalRevenue)}</span>
                      <span>Margin {ngn(row.margin)}</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="item" className="mt-4 space-y-3">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items or categories..."
              className="pl-9"
              value={itemSearch}
              onChange={(e) => setItemSearch(e.target.value)}
            />
          </div>
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4 space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : filteredItems.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center p-8">
                  No items match "{itemSearch}" in this period.
                </p>
              ) : (
                <>
                  <div className="hidden sm:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="pl-6">Item</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Units</TableHead>
                          <TableHead className="text-right">Cost / Sell</TableHead>
                          <TableHead className="text-right">Cost</TableHead>
                          <TableHead className="text-right">Revenue</TableHead>
                          <TableHead className="text-right">Margin</TableHead>
                          <TableHead className="text-right pr-6">FC%</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredItems.map((row) => (
                          <TableRow key={row.productId}>
                            <TableCell className="pl-6 font-medium">
                              {row.name}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {row.categoryName ?? "—"}
                            </TableCell>
                            <TableCell className="text-right">
                              {row.unitsSold}
                            </TableCell>
                            <TableCell className="text-right text-xs text-muted-foreground">
                              {ngn(row.costPrice)} / {ngn(row.sellingPrice)}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {ngn(row.totalCost)}
                            </TableCell>
                            <TableCell className="text-right">
                              {ngn(row.totalRevenue)}
                            </TableCell>
                            <TableCell className="text-right text-green-600">
                              {ngn(row.margin)}
                            </TableCell>
                            <TableCell className="text-right pr-6">
                              <Badge
                                variant="secondary"
                                className={`font-normal ${pctColor(row.foodCostPct, target)}`}
                              >
                                {row.foodCostPct.toFixed(1)}%
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="sm:hidden divide-y">
                    {filteredItems.map((row) => (
                      <div key={row.productId} className="p-3 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-medium truncate">{row.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {row.categoryName ?? "—"} · {row.unitsSold} units
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className={`shrink-0 ${pctColor(row.foodCostPct, target)}`}
                          >
                            {row.foodCostPct.toFixed(1)}%
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <p className="text-muted-foreground">
                            Cost: <span className="text-foreground">{ngn(row.totalCost)}</span>
                          </p>
                          <p className="text-muted-foreground">
                            Revenue:{" "}
                            <span className="text-foreground">{ngn(row.totalRevenue)}</span>
                          </p>
                          <p className="text-muted-foreground">
                            Cost price: <span className="text-foreground">{ngn(row.costPrice)}</span>
                          </p>
                          <p className="text-muted-foreground">
                            Sell price:{" "}
                            <span className="text-foreground">{ngn(row.sellingPrice)}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
