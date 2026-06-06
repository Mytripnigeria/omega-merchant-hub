import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Package,
  AlertTriangle,
  TrendingDown,
  CheckCircle,
  Search,
  Clock,
} from "lucide-react";
import { useStockReport } from "@/hooks/api/use-reports";
import { useStore } from "@/contexts/StoreContext";
import type { StockStatus } from "@/services/api/reports";

const ngn = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);

function statusBadge(status: StockStatus) {
  switch (status) {
    case "out":
      return (
        <Badge variant="destructive" className="text-xs font-normal">
          Out
        </Badge>
      );
    case "critical":
      return (
        <Badge variant="destructive" className="text-xs font-normal">
          Critical
        </Badge>
      );
    case "low":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs font-normal">
          Low
        </Badge>
      );
    default:
      return (
        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-normal">
          Good
        </Badge>
      );
  }
}

export default function StockReportPage() {
  const { currentStore } = useStore();
  const storeId = currentStore?.id;
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | StockStatus>("all");

  const { data, isLoading } = useStockReport(
    storeId ? { storeId } : undefined,
  );
  const rows = data?.rows ?? [];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      const matchSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        (r.sku ?? "").toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [rows, search, statusFilter]);

  const stats = [
    {
      label: "Total Items",
      value: String(data?.totalItems ?? 0),
      icon: Package,
    },
    {
      label: "Total Value",
      value: ngn(data?.totalValue ?? 0),
      icon: CheckCircle,
    },
    {
      label: "Low / Out of Stock",
      value: String(
        (data?.lowStockCount ?? 0) + (data?.outOfStockCount ?? 0),
      ),
      icon: AlertTriangle,
    },
    {
      label: "Expiring Soon",
      value: String(data?.expiringCount ?? 0),
      icon: Clock,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Stock Report</h1>
          <p className="text-sm text-muted-foreground">
            Current inventory levels, value, and expiring stock
          </p>
        </div>
      </div>

      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-3 w-20 mb-2" />
                  <Skeleton className="h-6 w-24" />
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
          <CardTitle className="text-sm font-medium">Inventory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search ingredients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="out">Out of stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              {rows.length === 0
                ? "No ingredients yet."
                : "No items match the current filters."}
            </p>
          ) : (
            <>
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">Item</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead className="text-right">Stock</TableHead>
                      <TableHead className="text-right">Min</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                      <TableHead>Best-before</TableHead>
                      <TableHead className="pr-6">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((row) => (
                      <TableRow key={row.ingredientId}>
                        <TableCell className="pl-6 font-medium">{row.name}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {row.sku ?? "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          {row.currentStock} {row.unit}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {row.minStock} {row.unit}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {ngn(row.value)}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {row.expiryDate ?? "—"}
                        </TableCell>
                        <TableCell className="pr-6">
                          {statusBadge(row.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="sm:hidden divide-y">
                {filtered.map((row) => (
                  <div key={row.ingredientId} className="px-3 py-3 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{row.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {row.sku ?? "—"}
                        </p>
                      </div>
                      {statusBadge(row.status)}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <p className="text-muted-foreground">
                        Stock:{" "}
                        <span className="text-foreground">
                          {row.currentStock} {row.unit}
                        </span>
                      </p>
                      <p className="text-muted-foreground">
                        Min:{" "}
                        <span className="text-foreground">
                          {row.minStock} {row.unit}
                        </span>
                      </p>
                      <p className="text-muted-foreground">
                        Value:{" "}
                        <span className="text-foreground font-medium">
                          {ngn(row.value)}
                        </span>
                      </p>
                    </div>
                    {row.expiryDate && (
                      <p className="text-xs text-muted-foreground">
                        Best-before {row.expiryDate}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {(data?.lowStockCount ?? 0) > 0 || (data?.outOfStockCount ?? 0) > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              Needs attention
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {rows
              .filter((r) => r.status !== "good")
              .slice(0, 10)
              .map((row) => (
                <div
                  key={row.ingredientId}
                  className="flex items-center justify-between gap-2 p-2 rounded-md bg-muted/40"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{row.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {row.currentStock} {row.unit} on hand · min {row.minStock}{" "}
                      {row.unit}
                    </p>
                  </div>
                  {statusBadge(row.status)}
                </div>
              ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
