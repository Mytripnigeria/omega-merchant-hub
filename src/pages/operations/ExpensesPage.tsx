import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Receipt,
  CheckCircle,
  XCircle,
  Banknote,
} from "lucide-react";
import { TablePagination } from "@/components/ui/table-pagination";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useStore } from "@/contexts/StoreContext";
import {
  useExpensesList,
  useApproveExpense,
  useRejectExpense,
  useMarkExpensePaid,
} from "@/hooks/api/use-expenses";
import type {
  Expense,
  ExpenseCategory,
  ExpenseStatus,
} from "@/services/api/expenses";

const ALL = "__all__";

const STATUS_BADGE: Record<ExpenseStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300" },
  approved: { label: "Approved", className: "bg-blue-500/10 text-blue-700 dark:text-blue-300" },
  rejected: { label: "Rejected", className: "bg-red-500/10 text-red-700 dark:text-red-300" },
  paid: { label: "Paid", className: "bg-green-500/10 text-green-700 dark:text-green-300" },
};

const CATEGORY_OPTIONS: { value: ExpenseCategory | typeof ALL; label: string }[] = [
  { value: ALL, label: "All categories" },
  { value: "supplies", label: "Supplies" },
  { value: "utilities", label: "Utilities" },
  { value: "maintenance", label: "Maintenance" },
  { value: "transport", label: "Transport" },
  { value: "salaries", label: "Salaries" },
  { value: "other", label: "Other" },
];

export default function ExpensesPage() {
  const { currentStore } = useStore();
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<"pending" | "approved" | "paid" | "all">("pending");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ExpenseCategory | typeof ALL>(ALL);
  const [selected, setSelected] = useState<Expense | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  const statusForTab =
    tab === "pending"
      ? "pending"
      : tab === "approved"
        ? "approved,paid"
        : tab === "paid"
          ? "paid"
          : undefined;

  // Expenses belong to a store, not the whole business — without this the list
  // pooled every store's spending into one view.
  const { data, isLoading } = useExpensesList({
    page,
    limit: 20,
    storeId: currentStore?.id,
    status: statusForTab,
    category: category !== ALL ? category : undefined,
    search: search || undefined,
  });

  const approve = useApproveExpense();
  const reject = useRejectExpense();
  const markPaid = useMarkExpensePaid();

  const items: Expense[] = data?.data ?? [];

  const formatAmount = (amount: number, currency: string) =>
    `${currency === "NGN" ? "₦" : currency} ${amount.toLocaleString()}`;

  const closeSheet = () => {
    setSelected(null);
    setReviewNotes("");
  };

  const handleApprove = () => {
    if (!selected) return;
    approve.mutate(
      { id: selected.id, notes: reviewNotes.trim() || undefined },
      {
        onSuccess: () => {
          toast.success("Expense approved");
          closeSheet();
        },
        onError: (e: Error) => toast.error(e.message ?? "Failed"),
      },
    );
  };

  const handleReject = () => {
    if (!selected) return;
    if (!reviewNotes.trim()) {
      toast.error("Please provide a reason");
      return;
    }
    reject.mutate(
      { id: selected.id, notes: reviewNotes.trim() },
      {
        onSuccess: () => {
          toast.success("Expense rejected");
          closeSheet();
        },
        onError: (e: Error) => toast.error(e.message ?? "Failed"),
      },
    );
  };

  const handleMarkPaid = () => {
    if (!selected) return;
    markPaid.mutate(
      { id: selected.id },
      {
        onSuccess: () => {
          toast.success("Marked as paid");
          closeSheet();
        },
        onError: (e: Error) => toast.error(e.message ?? "Failed"),
      },
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight flex items-center gap-2">
          <Receipt className="h-5 w-5 sm:h-6 sm:w-6" />
          Expense Approvals
        </h1>
        <p className="text-sm text-muted-foreground">
          Review and approve expense requests submitted by store staff.
        </p>
      </div>

      <Tabs
        value={tab}
        onValueChange={(v) => {
          setTab(v as "pending" | "approved" | "paid" | "all");
          setPage(1);
        }}
      >
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        <TabsContent value={tab} className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[16rem]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search description or submitter..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={category}
                  onValueChange={(v) => {
                    setCategory(v as ExpenseCategory | typeof ALL);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground ml-auto">
                  {data?.total ?? 0} total
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : items.length === 0 ? (
                <p className="py-12 text-center text-sm text-muted-foreground">
                  No expense requests match.
                </p>
              ) : (
                <div className="space-y-2">
                  {items.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => {
                        setSelected(e);
                        setReviewNotes("");
                      }}
                      className="w-full text-left p-3 rounded-lg border bg-card hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold">
                              {formatAmount(e.amount, e.currency)}
                            </span>
                            <Badge className={STATUS_BADGE[e.status].className}>
                              {STATUS_BADGE[e.status].label}
                            </Badge>
                            <Badge variant="outline" className="text-xs capitalize">
                              {e.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 truncate">
                            {e.description}
                          </p>
                          {/* The itemised breakdown the workstation captured.
                              Previously only the total and description showed
                              here, so a manager could not see what was actually
                              bought without opening the record. */}
                          {e.items && e.items.length > 0 && (
                            <ul className="mt-2 space-y-0.5">
                              {e.items.map((it, i) => (
                                <li
                                  key={`${it.name}-${i}`}
                                  className="text-xs text-muted-foreground flex justify-between gap-3"
                                >
                                  <span className="truncate">
                                    {it.name}
                                    {it.quantity ? ` · ${it.quantity}` : ""}
                                    {it.unit ? ` ${it.unit}` : ""}
                                    {it.unitPrice
                                      ? ` × ${formatAmount(it.unitPrice, e.currency)}`
                                      : ""}
                                    {it.supplier ? ` · ${it.supplier}` : ""}
                                  </span>
                                  <span className="shrink-0 tabular-nums">
                                    {formatAmount(it.total, e.currency)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {e.requestedByName} ·{" "}
                            {new Date(e.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {data && data.totalPages > 1 && (
                <TablePagination
                  currentPage={page}
                  totalPages={data.totalPages}
                  onPageChange={setPage}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Sheet open={!!selected} onOpenChange={(o) => !o && closeSheet()}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Expense Request</SheetTitle>
            <SheetDescription>
              {selected ? STATUS_BADGE[selected.status].label : ""}
            </SheetDescription>
          </SheetHeader>

          {selected && (
            <div className="py-4 space-y-4">
              <Card>
                <CardContent className="p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-semibold">
                      {formatAmount(selected.amount, selected.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span className="capitalize">{selected.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Submitted by</span>
                    <span>{selected.requestedByName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Submitted</span>
                    <span>{new Date(selected.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-muted-foreground text-xs mb-1">Description</p>
                    <p>{selected.description}</p>
                  </div>
                  {selected.receiptUrl && (
                    <a
                      href={selected.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-primary text-xs underline"
                    >
                      View receipt
                    </a>
                  )}
                  {selected.reviewedAt && (
                    <div className="pt-2 border-t">
                      <p className="text-muted-foreground text-xs">
                        Reviewed by {selected.reviewedByName ?? "manager"} on{" "}
                        {new Date(selected.reviewedAt).toLocaleString()}
                      </p>
                      {selected.reviewNotes && (
                        <p className="italic text-xs mt-1">"{selected.reviewNotes}"</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {selected.status === "pending" && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Decision</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs">
                        Review notes (required for rejection)
                      </Label>
                      <Textarea
                        placeholder="Optional notes for the submitter..."
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                        onClick={handleReject}
                        disabled={reject.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={handleApprove}
                        disabled={approve.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {selected.status === "approved" && (
                <Card>
                  <CardContent className="p-4">
                    <Button
                      className="w-full"
                      onClick={handleMarkPaid}
                      disabled={markPaid.isPending}
                    >
                      <Banknote className="h-4 w-4 mr-1" />
                      Mark as paid
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <SheetFooter>
            <Button variant="outline" onClick={closeSheet}>
              Close
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
