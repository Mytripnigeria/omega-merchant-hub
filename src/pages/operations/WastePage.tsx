import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  Search,
  Trash2,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Calendar,
  User,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api-client";
import { useStore } from "@/contexts/StoreContext";

type PresetRange = "this_week" | "this_month" | "last_month" | "this_quarter";

interface WasteReasonRow {
  reason: string;
  entries: number;
  totalQuantity: number;
  estimatedValue: number;
  share: number;
}

interface WasteIngredientRow {
  ingredientId: string;
  name: string;
  unit: string;
  entries: number;
  totalQuantity: number;
  estimatedValue: number;
}

interface WasteLogRow {
  id: string;
  ingredientId: string;
  ingredientName: string;
  unit: string;
  quantity: number;
  estimatedValue: number;
  reason: string | null;
  staffId: string | null;
  staffName: string | null;
  createdAt: string;
}

interface WasteReport {
  entries: number;
  totalValue: number;
  totalQuantity: number;
  wastePct: number;
  vsPreviousPct: number;
  byReason: WasteReasonRow[];
  byIngredient: WasteIngredientRow[];
  recent: WasteLogRow[];
}

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
  const start = new Date(y, m, 1);
  return { dateFrom: iso(start), dateTo: iso(now) };
}

const ngn = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);

function buildQs(params: Record<string, unknown>): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  }
  const s = qs.toString();
  return s ? `?${s}` : "";
}

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

const reasonBadgeVariant = (
  reason: string,
): "default" | "secondary" | "destructive" | "outline" => {
  const r = reason.toLowerCase();
  if (r.includes("expir") || r.includes("spoil")) return "destructive";
  if (r.includes("overproduction") || r.includes("waste")) return "secondary";
  return "outline";
};

export default function WastePage() {
  const { currentStore } = useStore();
  const storeId = currentStore?.id;

  const [preset, setPreset] = useState<PresetRange>("this_month");
  const [search, setSearch] = useState("");
  const [reasonFilter, setReasonFilter] = useState<string>("all");

  const filter = useMemo(() => {
    const { dateFrom, dateTo } = rangeFor(preset);
    return { ...(storeId ? { storeId } : {}), dateFrom, dateTo };
  }, [storeId, preset]);

  const { data: report, isLoading } = useQuery<WasteReport>({
    queryKey: ["reports", "waste", filter],
    queryFn: () =>
      apiRequest<WasteReport>(`/reports/waste${buildQs(filter)}`),
    staleTime: 60 * 1000,
  });

  const reasons = useMemo(() => {
    const set = new Set<string>();
    for (const r of report?.byReason ?? []) set.add(r.reason);
    return Array.from(set).sort();
  }, [report]);

  const filteredLogs = useMemo(() => {
    const all = report?.recent ?? [];
    const q = search.trim().toLowerCase();
    return all.filter((l) => {
      const matchSearch =
        !q ||
        l.ingredientName.toLowerCase().includes(q) ||
        (l.reason ?? "").toLowerCase().includes(q) ||
        (l.staffName ?? "").toLowerCase().includes(q);
      const matchReason =
        reasonFilter === "all" || (l.reason ?? "Unspecified") === reasonFilter;
      return matchSearch && matchReason;
    });
  }, [report, search, reasonFilter]);

  const vsPrev = report?.vsPreviousPct ?? 0;
  const vsPrevPositive = vsPrev <= 0;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Waste Management</h1>
          <p className="text-sm text-muted-foreground">
            Waste entries logged from the workstation Outstore.
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
                    Total Waste
                  </p>
                  <p className="text-xl sm:text-2xl font-semibold">
                    {ngn(report?.totalValue ?? 0)}
                  </p>
                </div>
                <Trash2 className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Waste %
                  </p>
                  <p className="text-xl sm:text-2xl font-semibold">
                    {(report?.wastePct ?? 0).toFixed(1)}%
                  </p>
                </div>
                <AlertTriangle className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                vs current stock value
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    vs Previous Period
                  </p>
                  <p
                    className={`text-xl sm:text-2xl font-semibold ${
                      vsPrevPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {vsPrev > 0 ? "+" : ""}
                    {vsPrev.toFixed(1)}%
                  </p>
                </div>
                {vsPrevPositive ? (
                  <TrendingDown className="h-5 w-5 text-green-600" />
                ) : (
                  <TrendingUp className="h-5 w-5 text-red-600" />
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Entries Logged
                  </p>
                  <p className="text-xl sm:text-2xl font-semibold">
                    {report?.entries ?? 0}
                  </p>
                </div>
                <Trash2 className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="reason" className="w-full">
        <TabsList className="grid w-full grid-cols-3 sm:w-auto sm:inline-grid">
          <TabsTrigger value="reason">By Reason</TabsTrigger>
          <TabsTrigger value="ingredient">By Ingredient</TabsTrigger>
          <TabsTrigger value="log">Log</TabsTrigger>
        </TabsList>

        <TabsContent value="reason" className="mt-4">
          <Card>
            <CardContent className="p-4 space-y-3">
              {isLoading ? (
                <Skeleton className="h-32 w-full" />
              ) : (report?.byReason ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No waste entries in this period.
                </p>
              ) : (
                (report?.byReason ?? []).map((row) => (
                  <div
                    key={row.reason}
                    className="space-y-2 border-b last:border-0 pb-3 last:pb-0"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <Badge
                        variant={reasonBadgeVariant(row.reason)}
                        className="font-normal"
                      >
                        {row.reason}
                      </Badge>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold">
                          {ngn(row.estimatedValue)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {row.entries} entries · {row.share.toFixed(1)}% share
                        </p>
                      </div>
                    </div>
                    <Progress
                      value={Math.min(row.share, 100)}
                      className="h-1.5"
                    />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ingredient" className="mt-4">
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4 space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : (report?.byIngredient ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground text-center p-8">
                  No waste entries in this period.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">Ingredient</TableHead>
                      <TableHead className="text-right">Entries</TableHead>
                      <TableHead className="text-right">Qty wasted</TableHead>
                      <TableHead className="text-right pr-6">Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(report?.byIngredient ?? []).map((row) => (
                      <TableRow key={row.ingredientId}>
                        <TableCell className="pl-6 font-medium">
                          {row.name}
                        </TableCell>
                        <TableCell className="text-right">
                          {row.entries}
                        </TableCell>
                        <TableCell className="text-right">
                          {row.totalQuantity} {row.unit}
                        </TableCell>
                        <TableCell className="text-right pr-6 text-red-500 font-medium">
                          {ngn(row.estimatedValue)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="log" className="mt-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search ingredient / reason / staff..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={reasonFilter} onValueChange={setReasonFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="All Reasons" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reasons</SelectItem>
                {reasons.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4 space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : filteredLogs.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center p-8">
                  No waste entries match the current filters.
                </p>
              ) : (
                <>
                  <div className="hidden sm:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="pl-6">Ingredient</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead>Logged by</TableHead>
                          <TableHead>When</TableHead>
                          <TableHead className="text-right pr-6">Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLogs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell className="pl-6 font-medium">
                              {log.ingredientName}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {log.quantity} {log.unit}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={reasonBadgeVariant(log.reason ?? "")}
                                className="font-normal"
                              >
                                {log.reason ?? "Unspecified"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {log.staffName ?? "—"}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {new Date(log.createdAt).toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right pr-6 text-red-500 font-medium">
                              {ngn(log.estimatedValue)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="sm:hidden divide-y">
                    {filteredLogs.map((log) => (
                      <div key={log.id} className="px-3 py-4 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">
                              {log.ingredientName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {log.quantity} {log.unit}
                            </p>
                          </div>
                          <Badge
                            variant={reasonBadgeVariant(log.reason ?? "")}
                            className="font-normal shrink-0"
                          >
                            {log.reason ?? "Unspecified"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {log.staffName ?? "—"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(log.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <span className="text-red-500 font-medium">
                            {ngn(log.estimatedValue)}
                          </span>
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
