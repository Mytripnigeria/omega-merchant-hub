import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { TablePagination } from "@/components/ui/table-pagination";
import {
  DatePeriodFilter,
  type DatePeriod,
} from "@/components/ui/date-period-filter";
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
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  CreditCard,
  ExternalLink,
  FileText,
  Filter,
  Search,
  User,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { useStore } from "@/contexts/StoreContext";
import {
  useTransactions,
  useTransactionStats,
} from "@/hooks/api/use-transactions";
import type {
  FinancialTransaction,
  TransactionFilters,
  TransactionMethod,
  TransactionPurpose,
  TransactionType,
} from "@/types/transactions";

const purposeColors: Record<TransactionPurpose, string> = {
  order_payment:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  order_refund:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  wallet_credit:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  wallet_debit:
    "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  expense_payment:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  payout:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  manual_adjustment:
    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

const purposeLabel: Record<TransactionPurpose, string> = {
  order_payment: "Order payment",
  order_refund: "Order refund",
  wallet_credit: "Wallet credit",
  wallet_debit: "Wallet debit",
  expense_payment: "Expense paid",
  payout: "Payout",
  manual_adjustment: "Adjustment",
};

const methodLabel: Record<TransactionMethod, string> = {
  cash: "Cash",
  card: "Card",
  wallet: "Wallet",
  points: "Points",
  paystack: "Paystack",
  transfer: "Bank transfer",
  other: "Other",
};

const PERIOD_RANGE = (
  period: DatePeriod,
  start: string,
  end: string,
): { dateFrom?: string; dateTo?: string } => {
  if (period === "all") return {};
  if (period === "custom") return { dateFrom: start, dateTo: end };
  const today = new Date();
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  if (period === "today") return { dateFrom: fmt(today), dateTo: fmt(today) };
  if (period === "yesterday") {
    const y = new Date(today);
    y.setDate(y.getDate() - 1);
    return { dateFrom: fmt(y), dateTo: fmt(y) };
  }
  if (period === "this_week") {
    const w = new Date(today);
    w.setDate(today.getDate() - today.getDay());
    return { dateFrom: fmt(w), dateTo: fmt(today) };
  }
  if (period === "this_month") {
    const m = new Date(today.getFullYear(), today.getMonth(), 1);
    return { dateFrom: fmt(m), dateTo: fmt(today) };
  }
  return {};
};

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-24" />
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
    <div className="divide-y divide-border">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="p-4 flex items-center gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export default function TransactionsPage() {
  const { currentStore, isAllStoresMode } = useStore();

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [typeFilter, setTypeFilter] = useState<TransactionType | "all">("all");
  const [purposeFilter, setPurposeFilter] = useState<
    TransactionPurpose | "all"
  >("all");
  const [methodFilter, setMethodFilter] = useState<TransactionMethod | "all">(
    "all",
  );
  const [datePeriod, setDatePeriod] = useState<DatePeriod>("today");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selected, setSelected] = useState<FinancialTransaction | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const dateRange = useMemo(
    () => PERIOD_RANGE(datePeriod, customStartDate, customEndDate),
    [datePeriod, customStartDate, customEndDate],
  );

  const filters: TransactionFilters = useMemo(
    () => ({
      storeId:
        !isAllStoresMode && currentStore ? currentStore.id : undefined,
      type: typeFilter === "all" ? undefined : typeFilter,
      purpose: purposeFilter === "all" ? undefined : purposeFilter,
      method: methodFilter === "all" ? undefined : methodFilter,
      search: search || undefined,
      ...dateRange,
      page,
      limit: pageSize,
    }),
    [
      isAllStoresMode,
      currentStore,
      typeFilter,
      purposeFilter,
      methodFilter,
      search,
      dateRange,
      page,
      pageSize,
    ],
  );

  const txnsQuery = useTransactions(filters);
  const statsQuery = useTransactionStats({
    storeId: filters.storeId,
    ...dateRange,
  });

  const transactions = txnsQuery.data?.data ?? [];
  const total = txnsQuery.data?.total ?? 0;
  const totalPages = txnsQuery.data?.totalPages ?? 1;
  const startIndex = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, total);

  const handleViewTransaction = (txn: FinancialTransaction) => {
    setSelected(txn);
    setIsSheetOpen(true);
  };

  const handleSearchSubmit = () => {
    setSearch(searchInput.trim());
    setPage(1);
  };

  const stats = [
    {
      label: "Total In",
      value: formatPrice(statsQuery.data?.totalIn ?? 0),
      icon: ArrowUpRight,
      color: "text-green-600",
    },
    {
      label: "Total Out",
      value: formatPrice(statsQuery.data?.totalOut ?? 0),
      icon: ArrowDownRight,
      color: "text-red-600",
    },
    {
      label: "Outstanding",
      value: formatPrice(statsQuery.data?.pending ?? 0),
      icon: Calendar,
      color: "text-yellow-600",
    },
  ];

  const isLoading = txnsQuery.isLoading || statsQuery.isLoading;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Transactions
          </h1>
          <p className="text-sm text-muted-foreground">
            Every money movement across the business — payments, refunds,
            wallet activity, payouts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DatePeriodFilter
            value={datePeriod}
            onChange={(v) => {
              setDatePeriod(v);
              setPage(1);
            }}
            customStartDate={customStartDate}
            customEndDate={customEndDate}
            onCustomRange={(start, end) => {
              setCustomStartDate(start);
              setCustomEndDate(end);
              setPage(1);
            }}
          />
        </div>
      </div>

      {statsQuery.isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 sm:pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold">
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
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search description, reference, customer or staff…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearchSubmit();
                }}
                onBlur={handleSearchSubmit}
                className="pl-10"
              />
            </div>
            <Select
              value={typeFilter}
              onValueChange={(v) => {
                setTypeFilter(v as typeof typeFilter);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="credit">Money in</SelectItem>
                <SelectItem value="debit">Money out</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={purposeFilter}
              onValueChange={(v) => {
                setPurposeFilter(v as typeof purposeFilter);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All purposes</SelectItem>
                {(
                  [
                    "order_payment",
                    "order_refund",
                    "wallet_credit",
                    "wallet_debit",
                    "expense_payment",
                    "payout",
                    "manual_adjustment",
                  ] as TransactionPurpose[]
                ).map((p) => (
                  <SelectItem key={p} value={p}>
                    {purposeLabel[p]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={methodFilter}
              onValueChange={(v) => {
                setMethodFilter(v as typeof methodFilter);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All methods</SelectItem>
                {(
                  [
                    "cash",
                    "card",
                    "wallet",
                    "points",
                    "paystack",
                    "transfer",
                    "other",
                  ] as TransactionMethod[]
                ).map((m) => (
                  <SelectItem key={m} value={m}>
                    {methodLabel[m]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:px-6 sm:pb-6">
          {isLoading ? (
            <TableSkeleton />
          ) : transactions.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No transactions match your filters yet.
            </div>
          ) : (
            <>
              {/* Mobile */}
              <div className="block sm:hidden divide-y divide-border">
                {transactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="p-4 space-y-3 cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewTransaction(txn)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium line-clamp-1">
                        {txn.description}
                      </span>
                      <Badge
                        className={cn(
                          "text-xs font-normal",
                          purposeColors[txn.purpose],
                        )}
                      >
                        {purposeLabel[txn.purpose]}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {new Date(txn.createdAt).toLocaleString()}
                      </span>
                      <span
                        className={`text-lg font-bold ${
                          txn.type === "credit"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {txn.type === "credit" ? "+" : "-"}
                        {formatPrice(txn.amount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="capitalize">
                          {txn.method ? methodLabel[txn.method] : "—"}
                        </span>
                        {txn.reference && (
                          <>
                            <span>•</span>
                            <span className="font-mono">
                              {txn.reference.slice(0, 16)}
                            </span>
                          </>
                        )}
                      </div>
                      {txn.customerName && (
                        <span className="line-clamp-1">{txn.customerName}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 text-sm font-medium">
                        Date
                      </th>
                      <th className="text-left p-4 text-sm font-medium">
                        Description
                      </th>
                      <th className="text-left p-4 text-sm font-medium">
                        Purpose
                      </th>
                      <th className="text-left p-4 text-sm font-medium">
                        Method
                      </th>
                      <th className="text-left p-4 text-sm font-medium">
                        Reference
                      </th>
                      <th className="text-right p-4 text-sm font-medium">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((txn) => (
                      <tr
                        key={txn.id}
                        className="border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleViewTransaction(txn)}
                      >
                        <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">
                          {new Date(txn.createdAt).toLocaleString()}
                        </td>
                        <td className="p-4 text-sm max-w-xs">
                          <div className="line-clamp-1">{txn.description}</div>
                          {txn.customerName && (
                            <div className="text-xs text-muted-foreground">
                              {txn.customerName}
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <Badge
                            className={cn(
                              "text-xs font-normal",
                              purposeColors[txn.purpose],
                            )}
                          >
                            {purposeLabel[txn.purpose]}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm capitalize text-muted-foreground">
                          {txn.method ? methodLabel[txn.method] : "—"}
                        </td>
                        <td className="p-4 text-xs font-mono text-muted-foreground">
                          {txn.reference ? txn.reference.slice(0, 18) : "—"}
                        </td>
                        <td
                          className={`p-4 font-medium text-right whitespace-nowrap ${
                            txn.type === "credit"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {txn.type === "credit" ? "+" : "-"}
                          {formatPrice(txn.amount)}
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

      {/* Detail Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader className="space-y-1">
                <SheetTitle className="flex items-center gap-2">
                  <span className="line-clamp-1">{selected.description}</span>
                </SheetTitle>
                <SheetDescription>
                  {new Date(selected.createdAt).toLocaleString()}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Payment Details
                  </h4>
                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Type
                        </span>
                        <Badge
                          variant={
                            selected.type === "credit"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {selected.type === "credit"
                            ? "Money in"
                            : "Money out"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Purpose
                        </span>
                        <Badge className={purposeColors[selected.purpose]}>
                          {purposeLabel[selected.purpose]}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Method
                        </span>
                        <span className="text-sm capitalize">
                          {selected.method ? methodLabel[selected.method] : "—"}
                        </span>
                      </div>
                      {selected.reference && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Reference
                          </span>
                          <span className="text-xs font-mono">
                            {selected.reference}
                          </span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Amount</span>
                        <span
                          className={`text-lg font-bold ${
                            selected.type === "credit"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {selected.type === "credit" ? "+" : "-"}
                          {formatPrice(selected.amount)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {selected.linkedType === "order" && selected.linkedId && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Linked Order
                    </h4>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Order ID
                          </span>
                          <Link
                            to={`/orders?orderId=${selected.linkedId}`}
                            className="text-sm font-mono inline-flex items-center gap-1 text-primary hover:underline"
                          >
                            {selected.linkedId.slice(0, 8)}…
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {(selected.customerName || selected.staffName) && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Parties
                    </h4>
                    <Card>
                      <CardContent className="p-4 space-y-2">
                        {selected.customerName && (
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Customer
                            </span>
                            <span className="text-sm font-medium">
                              {selected.customerName}
                            </span>
                          </div>
                        )}
                        {selected.staffName && (
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Staff / actor
                            </span>
                            <span className="text-sm">
                              {selected.staffName}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
