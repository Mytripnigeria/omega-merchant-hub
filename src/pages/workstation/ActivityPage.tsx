import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import {
  DatePeriodFilter,
  type DatePeriod,
} from "@/components/ui/date-period-filter";
import { TablePagination } from "@/components/ui/table-pagination";
import {
  Activity,
  Clock,
  User,
  FileText,
  Search,
  Filter,
  ShoppingCart,
  Package,
  DollarSign,
  Truck,
  Boxes,
  Settings,
  Coffee,
  type LucideIcon,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useActivityLog } from "@/hooks/api/use-activity-log";
import { useStaff } from "@/hooks/api/use-hr";
import { useStore } from "@/contexts/StoreContext";
import type { ActivityEntry } from "@/services/api/activity-log";

const ALL = "__all__";

const RESOURCE_TYPES: { value: string; label: string }[] = [
  { value: "order", label: "Orders" },
  { value: "shift", label: "Shifts" },
  { value: "delivery", label: "Deliveries" },
  { value: "expense", label: "Expenses" },
  { value: "ingredient", label: "Inventory" },
  { value: "staff", label: "Staff" },
  { value: "workstation_settings", label: "Settings" },
];

function iconForResource(resourceType: string | null): LucideIcon {
  switch (resourceType) {
    case "order":
      return ShoppingCart;
    case "delivery":
      return Truck;
    case "expense":
      return DollarSign;
    case "ingredient":
      return Boxes;
    case "shift":
      return Coffee;
    case "staff":
      return User;
    case "workstation_settings":
      return Settings;
    case "product":
      return Package;
    default:
      return Activity;
  }
}

function humanizeAction(action: string): string {
  return action.replace(/[._]/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

function dateRangeFromPeriod(
  period: DatePeriod,
  customStart?: string,
  customEnd?: string,
): { dateFrom?: string; dateTo?: string } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  switch (period) {
    case "today":
      return { dateFrom: today.toISOString().slice(0, 10), dateTo: today.toISOString().slice(0, 10) };
    case "yesterday": {
      const y = new Date(today);
      y.setDate(y.getDate() - 1);
      return { dateFrom: y.toISOString().slice(0, 10), dateTo: y.toISOString().slice(0, 10) };
    }
    case "this_week": {
      const ws = new Date(today);
      ws.setDate(ws.getDate() - ws.getDay());
      return { dateFrom: ws.toISOString().slice(0, 10), dateTo: today.toISOString().slice(0, 10) };
    }
    case "this_month": {
      const ms = new Date(now.getFullYear(), now.getMonth(), 1);
      return { dateFrom: ms.toISOString().slice(0, 10), dateTo: today.toISOString().slice(0, 10) };
    }
    case "custom":
      return { dateFrom: customStart || undefined, dateTo: customEnd || undefined };
    case "all":
    default:
      return {};
  }
}

export default function ActivityPage() {
  const { currentStore } = useStore();
  const [search, setSearch] = useState("");
  const [resourceFilter, setResourceFilter] = useState<string>(ALL);
  const [actorFilter, setActorFilter] = useState<string>(ALL);
  const [datePeriod, setDatePeriod] = useState<DatePeriod>("all");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selected, setSelected] = useState<ActivityEntry | null>(null);

  const { dateFrom, dateTo } = dateRangeFromPeriod(datePeriod, customStart, customEnd);

  const filters = useMemo(
    () => ({
      storeId: currentStore?.id,
      resourceType: resourceFilter === ALL ? undefined : resourceFilter,
      actorId: actorFilter === ALL ? undefined : actorFilter,
      action: search ? `${search}.*` : undefined,
      dateFrom,
      dateTo,
      page,
      limit: pageSize,
    }),
    [currentStore?.id, resourceFilter, actorFilter, search, dateFrom, dateTo, page],
  );

  const logQuery = useActivityLog(filters);
  const staffQuery = useStaff({ storeId: currentStore?.id, limit: 100 });

  const entries = logQuery.data?.data ?? [];
  const total = logQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);

  const stats = useMemo(() => {
    const todayKey = new Date().toISOString().slice(0, 10);
    const todayCount = entries.filter((e) => e.createdAt.startsWith(todayKey)).length;
    const uniqueActors = new Set(entries.map((e) => e.actorId).filter(Boolean)).size;
    const orders = entries.filter((e) => e.resourceType === "order").length;
    return [
      { label: "Actions Shown", value: String(total), icon: Activity },
      { label: "Active Today", value: String(todayCount), icon: User },
      { label: "Order Events", value: String(orders), icon: FileText },
    ];
  }, [entries, total]);

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Activity Log</h1>
        <p className="text-sm text-muted-foreground">Track all workstation activities</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={stat.label} className={index === 2 ? "col-span-2 md:col-span-1" : ""}>
            <CardContent className="p-3 sm:p-4 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground shrink-0" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search action prefix (e.g. order)..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
            <DatePeriodFilter
              value={datePeriod}
              onChange={(v) => { setDatePeriod(v); setPage(1); }}
              onCustomRange={(start, end) => {
                setCustomStart(start);
                setCustomEnd(end);
                setPage(1);
              }}
            />
            <Select value={resourceFilter} onValueChange={(v) => { setResourceFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All Types</SelectItem>
                {RESOURCE_TYPES.map((rt) => (
                  <SelectItem key={rt.value} value={rt.value}>{rt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={actorFilter} onValueChange={(v) => { setActorFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Actor" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All Actors</SelectItem>
                {(staffQuery.data?.data ?? []).map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.firstName} {s.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {logQuery.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Activity className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No activity matches the filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map((entry) => {
                const Icon = iconForResource(entry.resourceType);
                return (
                  <div
                    key={entry.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 border rounded-lg transition-colors hover:bg-muted/50 cursor-pointer"
                    onClick={() => setSelected(entry)}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{humanizeAction(entry.action)}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">by {entry.actorName}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pl-12 sm:pl-0">
                      <Badge variant="outline" className="text-xs">
                        {entry.resourceType ?? "system"}
                      </Badge>
                      <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 shrink-0">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {total > 0 && (
        <TablePagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={total}
          startIndex={startIndex + 1}
          endIndex={endIndex}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      )}

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center gap-3">
              {selected && (() => {
                const Icon = iconForResource(selected.resourceType);
                return (
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                );
              })()}
              <div>
                <SheetTitle>{selected ? humanizeAction(selected.action) : ""}</SheetTitle>
                <SheetDescription>
                  {selected
                    ? `by ${selected.actorName} • ${format(new Date(selected.createdAt), "PPpp")}`
                    : ""}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {selected && (
            <div className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Actor type</Label>
                  <Badge variant="outline" className="capitalize">{selected.actorType}</Badge>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Resource</Label>
                  <Badge variant="outline">{selected.resourceType ?? "—"}</Badge>
                </div>
              </div>
              {selected.resourceId && (
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Reference ID</Label>
                  <p className="text-sm font-mono break-all">{selected.resourceId}</p>
                </div>
              )}
              {selected.metadata && Object.keys(selected.metadata).length > 0 && (
                <div className="pt-4 border-t space-y-3">
                  <h4 className="font-medium text-sm">Metadata</h4>
                  <div className="space-y-2">
                    {Object.entries(selected.metadata).map(([key, value]) => (
                      <div key={key} className="flex items-start justify-between gap-3 py-2 border-b last:border-0">
                        <span className="text-sm text-muted-foreground">{key}</span>
                        <span className="text-sm font-medium text-right break-all">
                          {typeof value === "object" ? JSON.stringify(value) : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <SheetFooter className="mt-6">
            <Button variant="outline" onClick={() => setSelected(null)} className="w-full">
              Close
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
