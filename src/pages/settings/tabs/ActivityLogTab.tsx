import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { useActivityLog } from "@/hooks/api/use-activity-log";

const ALL = "__all__";

const ACTOR_TYPES = [
  { value: ALL, label: "All actors" },
  { value: "admin", label: "Admin" },
  { value: "staff", label: "Staff" },
  { value: "system", label: "System" },
];

const RESOURCE_TYPES = [
  { value: ALL, label: "All resources" },
  { value: "shift", label: "Shift" },
  { value: "payslip", label: "Payslip" },
  { value: "staff", label: "Staff" },
  { value: "order", label: "Order" },
  { value: "ingredient", label: "Ingredient" },
  { value: "admin", label: "Admin" },
];

export function ActivityLogTab() {
  const [page, setPage] = useState(1);
  const [actorType, setActorType] = useState<string>(ALL);
  const [resourceType, setResourceType] = useState<string>(ALL);
  const [actionFilter, setActionFilter] = useState("");

  const { data, isLoading } = useActivityLog({
    page,
    limit: 25,
    actorType: actorType !== ALL ? (actorType as "admin" | "staff" | "system") : undefined,
    resourceType: resourceType !== ALL ? resourceType : undefined,
    action: actionFilter || undefined,
  });

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  const humanizeAction = (action: string) => {
    const [scope, verb] = action.split(".");
    if (!verb) return action;
    return `${scope.charAt(0).toUpperCase() + scope.slice(1)} ${verb.replace(/_/g, " ")}`;
  };

  const actorBadgeColor = (type: string) => {
    switch (type) {
      case "admin":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-300";
      case "staff":
        return "bg-green-500/10 text-green-700 dark:text-green-300";
      case "system":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const items = data?.data ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Audit Log
        </h2>
        <p className="text-sm text-muted-foreground">
          Append-only history of every recorded action across the business.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Filter className="h-4 w-4" />
              Filters
            </div>
            <Select value={actorType} onValueChange={(v) => { setActorType(v); setPage(1); }}>
              <SelectTrigger className="w-40 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACTOR_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={resourceType} onValueChange={(v) => { setResourceType(v); setPage(1); }}>
              <SelectTrigger className="w-44 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RESOURCE_TYPES.map((r) => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="action key (e.g. order.created or order.*)"
              className="w-64 h-9"
              value={actionFilter}
              onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
            />
            <div className="ml-auto text-xs text-muted-foreground">
              {total} {total === 1 ? "entry" : "entries"}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No activity entries match these filters.
            </div>
          ) : (
            <ScrollArea className="h-[60vh]">
              <div className="space-y-2 pr-3">
                {items.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/40 transition-colors"
                  >
                    <Badge className={`${actorBadgeColor(entry.actorType)} rounded text-xs uppercase font-medium`}>
                      {entry.actorType}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{entry.actorName}</span>
                        <span className="text-muted-foreground">·</span>
                        <span className="font-mono text-xs text-muted-foreground">{entry.action}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {humanizeAction(entry.action)}
                        {entry.resourceType && entry.resourceId && (
                          <span className="ml-1 text-xs font-mono">
                            on {entry.resourceType} {entry.resourceId.slice(0, 8)}
                          </span>
                        )}
                      </p>
                      {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1 font-mono break-all">
                          {Object.entries(entry.metadata)
                            .map(([k, v]) => `${k}=${String(v)}`)
                            .join(" · ")}
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatTime(entry.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <span className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
