import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Package, Search, ShoppingCart, DollarSign } from "lucide-react";
import {
  DatePeriodFilter,
  type DatePeriod,
} from "@/components/ui/date-period-filter";
import { resolveDatePeriodRange, describeDatePeriod } from "@/lib/date-range";
import { useProductPerformance } from "@/hooks/api/use-reports";
import { useStore } from "@/contexts/StoreContext";
import type { ProductPerformanceRow } from "@/services/api/reports";

const ngn = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);

interface RowsTableProps {
  rows: ProductPerformanceRow[];
  /** Variation rows get an extra column naming the variant. */
  showVariation?: boolean;
  emptyLabel: string;
  isLoading: boolean;
}

function RowsTable({ rows, showVariation, emptyLabel, isLoading }: RowsTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }
  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        {emptyLabel}
      </p>
    );
  }
  // Share-of-revenue bar is relative to the best performer, so the ranking is
  // readable at a glance rather than needing the numbers compared by eye.
  const top = Math.max(...rows.map((r) => r.revenue), 1);
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            {showVariation && <TableHead>Variation</TableHead>}
            <TableHead className="text-right">Units sold</TableHead>
            <TableHead className="text-right">Orders</TableHead>
            <TableHead className="text-right">Revenue</TableHead>
            <TableHead className="w-32">Share</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={`${r.productId ?? r.name}-${r.variationName ?? ""}`}>
              <TableCell className="font-medium">{r.name}</TableCell>
              {showVariation && <TableCell>{r.variationName ?? "—"}</TableCell>}
              <TableCell className="text-right">
                {r.unitsSold.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                {r.ordersCount.toLocaleString()}
              </TableCell>
              <TableCell className="text-right font-semibold">
                {ngn(r.revenue)}
              </TableCell>
              <TableCell>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${Math.max((r.revenue / top) * 100, 2)}%` }}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/**
 * In-depth "how is every item performing" report: each product, each variation
 * of a product, and each add-on, over the selected period.
 */
export default function ProductPerformancePage() {
  const { currentStore, isAllStoresMode } = useStore();
  const storeId = isAllStoresMode ? undefined : currentStore?.id;

  const [period, setPeriod] = useState<DatePeriod>("today");
  const [customStart, setCustomStart] = useState<string>();
  const [customEnd, setCustomEnd] = useState<string>();
  const [search, setSearch] = useState("");

  const filter = useMemo(() => {
    const range = resolveDatePeriodRange(period, customStart, customEnd);
    return {
      ...(storeId ? { storeId } : {}),
      ...(range ?? {}),
    };
  }, [storeId, period, customStart, customEnd]);

  const { data, isLoading } = useProductPerformance(filter);

  const match = (r: ProductPerformanceRow) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      (r.variationName ?? "").toLowerCase().includes(q)
    );
  };

  const products = (data?.products ?? []).filter(match);
  const variations = (data?.variations ?? []).filter(match);
  const addons = (data?.addons ?? []).filter(match);

  const stats = [
    {
      label: "Items sold",
      value: (data?.totalUnits ?? 0).toLocaleString(),
      icon: Package,
    },
    {
      label: "Revenue",
      value: ngn(data?.totalRevenue ?? 0),
      icon: DollarSign,
    },
    {
      label: "Products sold",
      value: (data?.products.length ?? 0).toLocaleString(),
      icon: ShoppingCart,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Product Performance
          </h1>
          <p className="text-sm text-muted-foreground">
            Sales of every item — including variations and add-ons ·{" "}
            {describeDatePeriod(period, customStart, customEnd)}
          </p>
        </div>
        <DatePeriodFilter
          value={period}
          onChange={setPeriod}
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
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                  <s.icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              {isLoading ? (
                <Skeleton className="h-6 w-24" />
              ) : (
                <p className="text-lg font-semibold truncate">{s.value}</p>
              )}
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-sm font-medium">Breakdown</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items…"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="products">
            <TabsList>
              <TabsTrigger value="products">
                Products ({products.length})
              </TabsTrigger>
              <TabsTrigger value="variations">
                Variations ({variations.length})
              </TabsTrigger>
              <TabsTrigger value="addons">
                Add-ons ({addons.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="mt-4">
              <RowsTable
                rows={products}
                isLoading={isLoading}
                emptyLabel="No products sold in this period."
              />
            </TabsContent>
            <TabsContent value="variations" className="mt-4">
              <RowsTable
                rows={variations}
                showVariation
                isLoading={isLoading}
                emptyLabel="No variations sold in this period."
              />
            </TabsContent>
            <TabsContent value="addons" className="mt-4">
              <RowsTable
                rows={addons}
                isLoading={isLoading}
                emptyLabel="No add-ons sold in this period."
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
