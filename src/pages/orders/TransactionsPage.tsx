import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useLoading } from "@/hooks/use-loading";
import { useTableControls } from "@/hooks/use-table-controls";
import { SortableHeader } from "@/components/ui/sortable-header";
import { TablePagination } from "@/components/ui/table-pagination";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, ArrowUpRight, ArrowDownRight, Filter, Calendar, CreditCard, User, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  date: string;
  type: "credit" | "debit";
  purpose: "order" | "wallet" | "refund" | "payout";
  amount: number;
  method: "cash" | "paystack" | "flutterwave" | "bank";
  reference: string;
  status: "unpaid" | "partial" | "paid" | "refunded";
  user: { name: string; email: string; phone: string };
  details: {
    subtotal: number;
    discountTotal: number;
    taxTotal: number;
    deliveryCost: number;
    serviceCharge: number;
    paymentFee: number;
    totalAmount: number;
  };
  linkedId?: string;
}

const transactions: Transaction[] = [
  { id: "TXN-001", date: "2026-01-14 14:30", type: "credit", purpose: "order", amount: 8800, method: "paystack", reference: "OMG-2847", status: "paid", user: { name: "Adaeze Okonkwo", email: "adaeze@gmail.com", phone: "+234 801 234 5678" }, details: { subtotal: 8300, discountTotal: 0, taxTotal: 415, deliveryCost: 0, serviceCharge: 85, paymentFee: 0, totalAmount: 8800 }, linkedId: "OMG-2847" },
  { id: "TXN-002", date: "2026-01-14 14:15", type: "debit", purpose: "refund", amount: 3500, method: "cash", reference: "REF-OMG-2843", status: "refunded", user: { name: "Emmanuel Obi", email: "emmanuelobi@mail.com", phone: "+234 805 678 9012" }, details: { subtotal: 3500, discountTotal: 0, taxTotal: 0, deliveryCost: 0, serviceCharge: 0, paymentFee: 0, totalAmount: 3500 }, linkedId: "OMG-2843" },
  { id: "TXN-003", date: "2026-01-14 13:45", type: "credit", purpose: "order", amount: 15500, method: "flutterwave", reference: "OMG-2846", status: "paid", user: { name: "Chinedu Eze", email: "chinedu.eze@mail.com", phone: "+234 802 345 6789" }, details: { subtotal: 14000, discountTotal: 500, taxTotal: 700, deliveryCost: 1000, serviceCharge: 300, paymentFee: 0, totalAmount: 15500 }, linkedId: "OMG-2846" },
  { id: "TXN-004", date: "2026-01-14 12:30", type: "credit", purpose: "order", amount: 6200, method: "cash", reference: "OMG-2845", status: "paid", user: { name: "Oluwaseun Adeyemi", email: "seun.a@outlook.com", phone: "+234 803 456 7890" }, details: { subtotal: 6000, discountTotal: 0, taxTotal: 200, deliveryCost: 0, serviceCharge: 0, paymentFee: 0, totalAmount: 6200 }, linkedId: "OMG-2845" },
  { id: "TXN-005", date: "2026-01-14 11:00", type: "debit", purpose: "payout", amount: 150000, method: "bank", reference: "PAY-001", status: "paid", user: { name: "OMEGA Restaurant", email: "finance@omega.com", phone: "+234 800 000 0000" }, details: { subtotal: 150000, discountTotal: 0, taxTotal: 0, deliveryCost: 0, serviceCharge: 0, paymentFee: 2500, totalAmount: 147500 }, linkedId: "PAY-001" },
  { id: "TXN-006", date: "2026-01-14 10:30", type: "credit", purpose: "wallet", amount: 5000, method: "paystack", reference: "WAL-001", status: "paid", user: { name: "Grace Nwosu", email: "grace.n@company.com", phone: "+234 806 789 0123" }, details: { subtotal: 5000, discountTotal: 0, taxTotal: 0, deliveryCost: 0, serviceCharge: 0, paymentFee: 75, totalAmount: 5000 }, linkedId: "WAL-001" },
];

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount);
};

const statusColors: Record<string, string> = {
  unpaid: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  partial: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  refunded: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

const purposeColors: Record<string, string> = {
  order: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  wallet: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  refund: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  payout: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
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
    <Card>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("today");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isLoading = useLoading(1000);

  // Pre-filter transactions
  const preFilteredTransactions = transactions.filter(txn => 
    txn.id.toLowerCase().includes(search.toLowerCase()) ||
    txn.reference.toLowerCase().includes(search.toLowerCase()) ||
    txn.user.name.toLowerCase().includes(search.toLowerCase())
  );

  // Use table controls hook
  const {
    data: paginatedTransactions,
    currentPage,
    totalPages,
    totalItems,
    sortConfig,
    handleSort,
    goToPage,
    setPageSize,
    pageSize,
    startIndex,
    endIndex,
  } = useTableControls<Transaction>({ data: preFilteredTransactions, initialPageSize: 10 });

  const handleViewTransaction = (txn: Transaction) => {
    setSelectedTransaction(txn);
    setIsSheetOpen(true);
  };

  const totalIn = transactions.filter(t => t.type === "credit").reduce((acc, t) => acc + t.amount, 0);
  const totalOut = transactions.filter(t => t.type === "debit").reduce((acc, t) => acc + t.amount, 0);
  const pending = transactions.filter(t => t.status === "unpaid" || t.status === "partial").reduce((acc, t) => acc + t.amount, 0);

  const stats = [
    { label: "Total In", value: formatPrice(totalIn), icon: ArrowUpRight, color: "text-green-600" },
    { label: "Total Out", value: formatPrice(totalOut), icon: ArrowDownRight, color: "text-red-600" },
    { label: "Pending", value: formatPrice(pending), icon: Calendar, color: "text-yellow-600" },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Transactions</h1>
          <p className="text-sm text-muted-foreground">View all financial transactions</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[130px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 sm:pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.color}`} />
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
              <Input placeholder="Search transactions..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
                <SelectItem value="debit">Debit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:px-6 sm:pb-6">
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block sm:hidden divide-y divide-border">
                {paginatedTransactions.map((txn) => (
                  <div key={txn.id} className="p-4 space-y-3 cursor-pointer hover:bg-muted/50" onClick={() => handleViewTransaction(txn)}>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-medium">{txn.id}</span>
                      <Badge className={cn("text-xs font-normal", purposeColors[txn.purpose])}>{txn.purpose}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{txn.date}</span>
                      <span className={`text-lg font-bold ${txn.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                        {txn.type === "credit" ? "+" : "-"}{formatPrice(txn.amount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="capitalize">{txn.method}</span>
                        <span>•</span>
                        <span>{txn.reference}</span>
                      </div>
                      <Badge className={cn("text-xs", statusColors[txn.status])}>{txn.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4">
                        <SortableHeader label="ID" field="id" currentSortField={sortConfig.field as string | null} currentSortDirection={sortConfig.direction} onSort={handleSort as (field: string) => void} />
                      </th>
                      <th className="text-left p-4">
                        <SortableHeader label="Date" field="date" currentSortField={sortConfig.field as string | null} currentSortDirection={sortConfig.direction} onSort={handleSort as (field: string) => void} />
                      </th>
                      <th className="text-left p-4">
                        <SortableHeader label="Type" field="type" currentSortField={sortConfig.field as string | null} currentSortDirection={sortConfig.direction} onSort={handleSort as (field: string) => void} />
                      </th>
                      <th className="text-left p-4">
                        <SortableHeader label="Purpose" field="purpose" currentSortField={sortConfig.field as string | null} currentSortDirection={sortConfig.direction} onSort={handleSort as (field: string) => void} />
                      </th>
                      <th className="text-left p-4">
                        <SortableHeader label="Amount" field="amount" currentSortField={sortConfig.field as string | null} currentSortDirection={sortConfig.direction} onSort={handleSort as (field: string) => void} />
                      </th>
                      <th className="text-left p-4">
                        <SortableHeader label="Method" field="method" currentSortField={sortConfig.field as string | null} currentSortDirection={sortConfig.direction} onSort={handleSort as (field: string) => void} />
                      </th>
                      <th className="text-left p-4">
                        <SortableHeader label="Reference" field="reference" currentSortField={sortConfig.field as string | null} currentSortDirection={sortConfig.direction} onSort={handleSort as (field: string) => void} />
                      </th>
                      <th className="text-left p-4">
                        <SortableHeader label="Status" field="status" currentSortField={sortConfig.field as string | null} currentSortDirection={sortConfig.direction} onSort={handleSort as (field: string) => void} />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTransactions.map((txn) => (
                      <tr key={txn.id} className="border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer" onClick={() => handleViewTransaction(txn)}>
                        <td className="p-4 font-mono font-medium text-sm">{txn.id}</td>
                        <td className="p-4 text-sm text-muted-foreground">{txn.date}</td>
                        <td className="p-4">
                          <Badge variant={txn.type === "credit" ? "default" : "destructive"} className="text-xs">
                            {txn.type}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge className={cn("text-xs", purposeColors[txn.purpose])}>{txn.purpose}</Badge>
                        </td>
                        <td className={`p-4 font-medium ${txn.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                          {txn.type === "credit" ? "+" : "-"}{formatPrice(txn.amount)}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground capitalize">{txn.method}</td>
                        <td className="p-4 text-sm text-muted-foreground font-mono">{txn.reference}</td>
                        <td className="p-4">
                          <Badge className={cn("text-xs", statusColors[txn.status])}>{txn.status}</Badge>
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

      {/* Pagination */}
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        startIndex={startIndex}
        endIndex={endIndex}
        pageSize={pageSize}
        onPageChange={goToPage}
        onPageSizeChange={setPageSize}
      />

      {/* Transaction Detail Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedTransaction && (
            <>
              <SheetHeader className="space-y-1">
                <SheetTitle className="flex items-center gap-2">
                  <span>Transaction {selectedTransaction.id}</span>
                  <Badge className={cn("font-normal", statusColors[selectedTransaction.status])}>
                    {selectedTransaction.status}
                  </Badge>
                </SheetTitle>
                <SheetDescription>{selectedTransaction.date}</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Payment Details */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Payment Details
                  </h4>
                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Transaction ID</span>
                        <span className="text-sm font-mono">{selectedTransaction.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <Badge className={statusColors[selectedTransaction.status]}>{selectedTransaction.status}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Method</span>
                        <span className="text-sm capitalize">{selectedTransaction.method}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Type</span>
                        <Badge variant={selectedTransaction.type === "credit" ? "default" : "destructive"}>{selectedTransaction.type}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Reference</span>
                        <span className="text-sm font-mono">{selectedTransaction.reference}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Purpose</span>
                        <Badge className={purposeColors[selectedTransaction.purpose]}>{selectedTransaction.purpose}</Badge>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Subtotal</span>
                        <span className="text-sm">{formatPrice(selectedTransaction.details.subtotal)}</span>
                      </div>
                      {selectedTransaction.details.discountTotal > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Discount</span>
                          <span className="text-sm text-green-600">-{formatPrice(selectedTransaction.details.discountTotal)}</span>
                        </div>
                      )}
                      {selectedTransaction.details.taxTotal > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Tax</span>
                          <span className="text-sm">{formatPrice(selectedTransaction.details.taxTotal)}</span>
                        </div>
                      )}
                      {selectedTransaction.details.deliveryCost > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Delivery</span>
                          <span className="text-sm">{formatPrice(selectedTransaction.details.deliveryCost)}</span>
                        </div>
                      )}
                      {selectedTransaction.details.serviceCharge > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Service Charge</span>
                          <span className="text-sm">{formatPrice(selectedTransaction.details.serviceCharge)}</span>
                        </div>
                      )}
                      {selectedTransaction.details.paymentFee > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Payment Fee</span>
                          <span className="text-sm">{formatPrice(selectedTransaction.details.paymentFee)}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Total Amount</span>
                        <span className={`text-lg font-bold ${selectedTransaction.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                          {selectedTransaction.type === "credit" ? "+" : "-"}{formatPrice(selectedTransaction.amount)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Reference Details */}
                {selectedTransaction.linkedId && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Reference Details
                    </h4>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground capitalize">{selectedTransaction.purpose} ID</span>
                          <Button variant="link" className="text-sm font-mono p-0 h-auto">
                            {selectedTransaction.linkedId}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* User Details */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    User Details
                  </h4>
                  <Card>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Name</span>
                        <span className="text-sm font-medium">{selectedTransaction.user.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Email</span>
                        <span className="text-sm">{selectedTransaction.user.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Phone</span>
                        <span className="text-sm">{selectedTransaction.user.phone}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
