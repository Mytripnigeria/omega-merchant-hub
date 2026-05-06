import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { TablePagination } from "@/components/ui/table-pagination";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Banknote,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Smartphone,
  User,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { useStore } from "@/contexts/StoreContext";
import { toast } from "sonner";
import {
  useCashSessions,
  useCashSessionStats,
  useReviewCashSession,
} from "@/hooks/api/use-cash-sessions";
import type {
  CashSession,
  CashSessionFilters,
  CashSessionStatus,
  ReconciliationStatus,
} from "@/types/cash-sessions";

const reconColors: Record<ReconciliationStatus, string> = {
  balanced:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  short: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  over: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

const statusColors: Record<CashSessionStatus, string> = {
  open: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  closed:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  reviewed:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

function StatsSkeleton() {
  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-3 sm:pt-6 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-7 w-24" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AccountBalancingPage() {
  const { currentStore, isAllStoresMode } = useStore();
  const [statusFilter, setStatusFilter] = useState<CashSessionStatus | "all">(
    "all",
  );
  const [reconFilter, setReconFilter] = useState<
    ReconciliationStatus | "all"
  >("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selected, setSelected] = useState<CashSession | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");

  const filters: CashSessionFilters = useMemo(
    () => ({
      storeId:
        !isAllStoresMode && currentStore ? currentStore.id : undefined,
      status: statusFilter === "all" ? undefined : statusFilter,
      reconciliationStatus: reconFilter === "all" ? undefined : reconFilter,
      page,
      limit: pageSize,
    }),
    [
      isAllStoresMode,
      currentStore,
      statusFilter,
      reconFilter,
      page,
      pageSize,
    ],
  );

  const sessionsQuery = useCashSessions(filters);
  const statsQuery = useCashSessionStats({ storeId: filters.storeId });
  const reviewMutation = useReviewCashSession();

  const sessions = sessionsQuery.data?.data ?? [];
  const total = sessionsQuery.data?.total ?? 0;
  const totalPages = sessionsQuery.data?.totalPages ?? 1;
  const startIndex = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, total);

  const handleReview = (session: CashSession) => {
    setSelected(session);
    setReviewNotes(session.reviewNotes ?? "");
    setIsSheetOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!selected) return;
    try {
      await reviewMutation.mutateAsync({
        id: selected.id,
        payload: { reviewNotes: reviewNotes || undefined },
      });
      toast.success("Session marked reviewed");
      setIsSheetOpen(false);
    } catch (e) {
      toast.error((e as Error).message ?? "Failed to review session");
    }
  };

  const stats = [
    {
      label: "Open sessions",
      value: String(statsQuery.data?.openCount ?? 0),
      icon: Clock,
      color: "text-blue-600",
    },
    {
      label: "Balanced",
      value: String(statsQuery.data?.balancedCount ?? 0),
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      label: "Short",
      value: formatPrice(statsQuery.data?.totalShortAmount ?? 0),
      icon: AlertCircle,
      color: "text-red-600",
    },
    {
      label: "Over",
      value: formatPrice(statsQuery.data?.totalOverAmount ?? 0),
      icon: DollarSign,
      color: "text-yellow-600",
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Account Balancing
          </h1>
          <p className="text-sm text-muted-foreground">
            Review staff cash drawer sessions, expected vs actual collections.
          </p>
        </div>
      </div>

      {statsQuery.isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-3 sm:pt-6 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-lg sm:text-2xl font-bold">
                      {stat.value}
                    </p>
                  </div>
                  <stat.icon
                    className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.color}`}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-base sm:text-lg">
            Cash drawer sessions
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v as typeof statusFilter);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={reconFilter}
              onValueChange={(v) => {
                setReconFilter(v as typeof reconFilter);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Reconciliation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All differences</SelectItem>
                <SelectItem value="balanced">Balanced</SelectItem>
                <SelectItem value="short">Short</SelectItem>
                <SelectItem value="over">Over</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:px-6 sm:pb-6">
          {sessionsQuery.isLoading ? (
            <TableSkeleton />
          ) : sessions.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No cash sessions match your filters.
            </div>
          ) : (
            <>
              <div className="block sm:hidden divide-y divide-border">
                {sessions.map((s) => (
                  <div
                    key={s.id}
                    className="p-4 space-y-3 cursor-pointer hover:bg-muted/50"
                    onClick={() => handleReview(s)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">
                          {s.staffName}
                        </span>
                      </div>
                      <Badge
                        className={cn("text-xs", statusColors[s.status])}
                      >
                        {s.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        Opened {new Date(s.openedAt).toLocaleString()}
                      </span>
                      {s.reconciliationStatus && (
                        <Badge
                          className={cn(
                            "text-xs",
                            reconColors[s.reconciliationStatus],
                          )}
                        >
                          {s.reconciliationStatus}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Difference</span>
                      <span
                        className={`font-bold ${
                          s.difference === 0
                            ? "text-foreground"
                            : s.difference < 0
                              ? "text-red-600"
                              : "text-yellow-600"
                        }`}
                      >
                        {s.difference === 0 ? "" : s.difference > 0 ? "+" : ""}
                        {formatPrice(s.difference)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 text-sm font-medium">
                        Staff
                      </th>
                      <th className="text-left p-4 text-sm font-medium">
                        Opened
                      </th>
                      <th className="text-left p-4 text-sm font-medium">
                        Closed
                      </th>
                      <th className="text-right p-4 text-sm font-medium">
                        Expected
                      </th>
                      <th className="text-right p-4 text-sm font-medium">
                        Actual
                      </th>
                      <th className="text-right p-4 text-sm font-medium">
                        Difference
                      </th>
                      <th className="text-left p-4 text-sm font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((s) => (
                      <tr
                        key={s.id}
                        className="border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleReview(s)}
                      >
                        <td className="p-4 text-sm font-medium">
                          {s.staffName}
                        </td>
                        <td className="p-4 text-xs text-muted-foreground">
                          {new Date(s.openedAt).toLocaleString()}
                        </td>
                        <td className="p-4 text-xs text-muted-foreground">
                          {s.closedAt
                            ? new Date(s.closedAt).toLocaleString()
                            : "—"}
                        </td>
                        <td className="p-4 text-sm text-right">
                          {formatPrice(s.expectedTotal)}
                        </td>
                        <td className="p-4 text-sm text-right">
                          {formatPrice(s.actualTotal)}
                        </td>
                        <td
                          className={`p-4 text-sm text-right font-medium ${
                            s.difference === 0
                              ? "text-foreground"
                              : s.difference < 0
                                ? "text-red-600"
                                : "text-yellow-600"
                          }`}
                        >
                          {s.difference > 0 ? "+" : ""}
                          {formatPrice(s.difference)}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1 items-start">
                            <Badge
                              className={cn(
                                "text-xs",
                                statusColors[s.status],
                              )}
                            >
                              {s.status}
                            </Badge>
                            {s.reconciliationStatus && (
                              <Badge
                                className={cn(
                                  "text-[10px]",
                                  reconColors[s.reconciliationStatus],
                                )}
                              >
                                {s.reconciliationStatus}
                              </Badge>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <TablePagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={total}
        startIndex={startIndex}
        endIndex={endIndex}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
        }}
      />

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {selected && (
            <>
              <SheetHeader className="space-y-1">
                <SheetTitle className="flex items-center gap-2">
                  <span>{selected.staffName}</span>
                  <Badge className={cn(statusColors[selected.status])}>
                    {selected.status}
                  </Badge>
                  {selected.reconciliationStatus && (
                    <Badge
                      className={cn(
                        reconColors[selected.reconciliationStatus],
                      )}
                    >
                      {selected.reconciliationStatus}
                    </Badge>
                  )}
                </SheetTitle>
                <SheetDescription>
                  Opened {new Date(selected.openedAt).toLocaleString()}
                  {selected.closedAt &&
                    ` · closed ${new Date(selected.closedAt).toLocaleString()}`}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-3 gap-3">
                  <Card>
                    <CardContent className="p-3 text-center">
                      <Banknote className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        Cash
                      </p>
                      <p className="text-sm font-semibold">
                        {formatPrice(selected.actualCash)}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        exp {formatPrice(selected.expectedCash)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3 text-center">
                      <CreditCard className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        Card
                      </p>
                      <p className="text-sm font-semibold">
                        {formatPrice(selected.actualCard)}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        exp {formatPrice(selected.expectedCard)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3 text-center">
                      <Smartphone className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        Mobile / wallet
                      </p>
                      <p className="text-sm font-semibold">
                        {formatPrice(selected.actualMobile)}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        exp {formatPrice(selected.expectedMobile)}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Opening float
                      </span>
                      <span>{formatPrice(selected.openingFloat)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Expected total
                      </span>
                      <span>{formatPrice(selected.expectedTotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Actual total
                      </span>
                      <span>{formatPrice(selected.actualTotal)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm font-medium">
                      <span>Difference</span>
                      <span
                        className={
                          selected.difference === 0
                            ? "text-foreground"
                            : selected.difference < 0
                              ? "text-red-600"
                              : "text-yellow-600"
                        }
                      >
                        {selected.difference > 0 ? "+" : ""}
                        {formatPrice(selected.difference)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {selected.notes && (
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm font-medium mb-1">Staff notes</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {selected.notes}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {selected.status === "reviewed" ? (
                  <Card>
                    <CardContent className="p-4 space-y-2">
                      <p className="text-sm font-medium">Review</p>
                      <p className="text-xs text-muted-foreground">
                        {selected.reviewedByName ?? "Admin"} on{" "}
                        {selected.reviewedAt
                          ? new Date(selected.reviewedAt).toLocaleString()
                          : "—"}
                      </p>
                      {selected.reviewNotes && (
                        <p className="text-sm whitespace-pre-wrap">
                          {selected.reviewNotes}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ) : selected.status === "closed" ? (
                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <p className="text-sm font-medium">Mark as reviewed</p>
                      <Textarea
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        placeholder="Optional review note (e.g., investigated and accepted)…"
                        rows={3}
                      />
                      <Button
                        onClick={handleSubmitReview}
                        disabled={reviewMutation.isPending}
                      >
                        {reviewMutation.isPending ? "Saving…" : "Mark reviewed"}
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">
                        Session is still open — staff must close it before it
                        can be reviewed.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
