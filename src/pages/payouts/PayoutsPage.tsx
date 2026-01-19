import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoading } from "@/hooks/use-loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePeriodFilter, useDatePeriodFilter, type DatePeriod } from "@/components/ui/date-period-filter";
import { TablePagination } from "@/components/ui/table-pagination";
import { Search, DollarSign, Clock, CheckCircle2, Download, Filter, Wallet } from "lucide-react";
import type { Payout } from "@/types/payouts";

// Extended Payout type for UI with computed fields and orders
interface PayoutWithOrders extends Payout {
  // Computed fields for display
  settledAmount: number;
  method: string;
  account: string;
  bankDetails: string;
  date: string;
  orders: PayoutOrder[];
}

interface PayoutOrder {
  orderId: string;
  date: string;
  totalAmount: number;
  fees: number;
  commission: number;
  tax: number;
  settledAmount: number;
}

// Transform API Payout to UI format
const transformPayout = (payout: Payout): PayoutWithOrders => ({
  ...payout,
  settledAmount: payout.netAmount,
  method: payout.paymentMethod === "bank-transfer" ? "Bank Transfer" : payout.paymentMethod || "Bank Transfer",
  account: payout.bankAccount ? `****${payout.bankAccount.slice(-4)}` : "****0000",
  bankDetails: `${payout.bankName || "Bank"} - ${payout.bankAccount || "N/A"}`,
  date: payout.periodEnd,
  orders: [], // Will be populated from linked transactions
});

const mockPayouts: Payout[] = [
  { 
    id: "PAY-001", 
    storeId: "store-1",
    period: "Week 2, Jan 2026",
    periodStart: "2026-01-06",
    periodEnd: "2026-01-10", 
    grossAmount: 285000, 
    fees: [{ id: "f1", name: "Platform Fee", type: "platform", amount: 5700, percentage: 2 }],
    totalFees: 5700,
    commissions: [{ id: "c1", name: "Sales Commission", type: "sales", amount: 8550, percentage: 3 }],
    totalCommissions: 8550,
    taxes: [{ id: "t1", name: "WHT", type: "withholding", amount: 4275, rate: 1.5 }],
    totalTaxes: 4275,
    netAmount: 266475, 
    status: "completed",
    paymentMethod: "bank-transfer",
    bankName: "GTBank",
    bankAccount: "0123456789",
    paidDate: "2026-01-10",
    createdAt: "2026-01-10",
    updatedAt: "2026-01-10",
  },
  { 
    id: "PAY-002", 
    storeId: "store-1",
    period: "Week 1, Jan 2026",
    periodStart: "2026-01-01",
    periodEnd: "2026-01-05", 
    grossAmount: 185000, 
    fees: [{ id: "f2", name: "Platform Fee", type: "platform", amount: 3700, percentage: 2 }],
    totalFees: 3700,
    commissions: [{ id: "c2", name: "Sales Commission", type: "sales", amount: 5550, percentage: 3 }],
    totalCommissions: 5550,
    taxes: [{ id: "t2", name: "WHT", type: "withholding", amount: 2775, rate: 1.5 }],
    totalTaxes: 2775,
    netAmount: 172975, 
    status: "completed",
    paymentMethod: "bank-transfer",
    bankName: "GTBank",
    bankAccount: "0123456789",
    paidDate: "2026-01-05",
    createdAt: "2026-01-05",
    updatedAt: "2026-01-05",
  },
  { 
    id: "PAY-003", 
    storeId: "store-1",
    period: "Week 3, Jan 2026",
    periodStart: "2026-01-13",
    periodEnd: "2026-01-14", 
    grossAmount: 320000, 
    fees: [{ id: "f3", name: "Platform Fee", type: "platform", amount: 6400, percentage: 2 }],
    totalFees: 6400,
    commissions: [{ id: "c3", name: "Sales Commission", type: "sales", amount: 9600, percentage: 3 }],
    totalCommissions: 9600,
    taxes: [{ id: "t3", name: "WHT", type: "withholding", amount: 4800, rate: 1.5 }],
    totalTaxes: 4800,
    netAmount: 299200, 
    status: "pending",
    paymentMethod: "bank-transfer",
    bankName: "GTBank",
    bankAccount: "0123456789",
    scheduledDate: "2026-01-17",
    createdAt: "2026-01-14",
    updatedAt: "2026-01-14",
  },
  { 
    id: "PAY-004", 
    storeId: "store-1",
    period: "Week 4, Dec 2025",
    periodStart: "2025-12-23",
    periodEnd: "2025-12-28", 
    grossAmount: 210000, 
    fees: [{ id: "f4", name: "Platform Fee", type: "platform", amount: 4200, percentage: 2 }],
    totalFees: 4200,
    commissions: [{ id: "c4", name: "Sales Commission", type: "sales", amount: 6300, percentage: 3 }],
    totalCommissions: 6300,
    taxes: [{ id: "t4", name: "WHT", type: "withholding", amount: 3150, rate: 1.5 }],
    totalTaxes: 3150,
    netAmount: 196350, 
    status: "completed",
    paymentMethod: "bank-transfer",
    bankName: "GTBank",
    bankAccount: "0123456789",
    paidDate: "2025-12-28",
    createdAt: "2025-12-28",
    updatedAt: "2025-12-28",
  },
];

// Transform to UI format
const payoutsData: PayoutWithOrders[] = mockPayouts.map(transformPayout);

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className={i === 2 ? "col-span-2 sm:col-span-1" : ""}>
          <CardContent className="p-3 sm:p-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-7 w-28" />
              </div>
              <Skeleton className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PayoutsSkeleton() {
  return (
    <>
      <div className="block sm:hidden divide-y divide-border">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-6 w-28" />
            </div>
          </div>
        ))}
      </div>
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              {Array.from({ length: 7 }).map((_, i) => (
                <th key={i} className="p-4"><Skeleton className="h-3 w-16" /></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                <td className="p-4"><Skeleton className="h-4 w-28" /></td>
                <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                <td className="p-4"><Skeleton className="h-5 w-16 rounded-full" /></td>
                <td className="p-4"><Skeleton className="h-8 w-16" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function PayoutsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [datePeriod, setDatePeriod] = useState<DatePeriod>("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [selectedPayout, setSelectedPayout] = useState<PayoutWithOrders | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const isLoading = useLoading(1000);

  const stats = [
    { label: "Available Balance", value: "₦425,000", icon: Wallet },
    { label: "Pending Payout", value: "₦299,200", icon: Clock },
    { label: "Total Paid Out", value: "₦4,560,000", icon: CheckCircle2 },
  ];

  // Apply date filter
  const dateFilteredPayouts = useDatePeriodFilter(
    payoutsData,
    datePeriod,
    customStartDate,
    customEndDate,
    "date" as keyof PayoutWithOrders
  );

  const filteredPayouts = dateFilteredPayouts.filter(p => {
    const matchesSearch = p.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalItems = filteredPayouts.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedPayouts = filteredPayouts.slice(startIndex, endIndex);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "success": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
      case "processing": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "failed":
      case "on-hold": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default: return "";
    }
  };

  const openSheet = (payout: PayoutWithOrders) => {
    setSelectedPayout(payout);
    setIsSheetOpen(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Payouts</h1>
          <p className="text-sm text-muted-foreground">Track your earnings and settlements</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Download className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button size="sm" className="flex-1 sm:flex-none">
            <DollarSign className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Request Payout</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <Card key={stat.label} className={index === 2 ? "col-span-2 sm:col-span-1" : ""}>
              <CardContent className="p-3 sm:p-4 sm:pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-lg sm:text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className="h-5 w-5 sm:h-8 sm:w-8 text-muted-foreground shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Payouts List */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search payouts..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <DatePeriodFilter
              value={datePeriod}
              onChange={setDatePeriod}
              onCustomRange={(start, end) => {
                setCustomStartDate(start);
                setCustomEndDate(end);
              }}
              customStartDate={customStartDate}
              customEndDate={customEndDate}
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[130px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:px-6 sm:pb-6">
          {isLoading ? (
            <PayoutsSkeleton />
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block sm:hidden divide-y divide-border">
                {paginatedPayouts.map((payout) => (
                  <div 
                    key={payout.id} 
                    className="p-4 space-y-3 cursor-pointer hover:bg-muted/50"
                    onClick={() => openSheet(payout)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-medium">{payout.id}</span>
                      <Badge className={getStatusColor(payout.status)}>
                        {payout.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{payout.date}</span>
                      <span className="text-lg font-bold">₦{payout.settledAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{payout.method}</span>
                      <span>{payout.account}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-medium text-muted-foreground p-4 pl-6">ID</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Date</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Amount</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Method</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Account</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4 pr-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPayouts.map((payout) => (
                      <tr 
                        key={payout.id} 
                        className="border-b border-border last:border-0 hover:bg-muted/50 group cursor-pointer"
                        onClick={() => openSheet(payout)}
                      >
                        <td className="p-4 pl-6 font-medium font-mono">{payout.id}</td>
                        <td className="p-4 text-muted-foreground">{payout.date}</td>
                        <td className="p-4 font-bold">₦{payout.settledAmount.toLocaleString()}</td>
                        <td className="p-4 text-muted-foreground">{payout.method}</td>
                        <td className="p-4 text-muted-foreground">{payout.account}</td>
                        <td className="p-4">
                          <Badge className={getStatusColor(payout.status)}>
                            {payout.status}
                          </Badge>
                        </td>
                        <td className="p-4 pr-6">
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">View</Button>
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
        startIndex={startIndex + 1}
        endIndex={endIndex}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      {/* Action Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="space-y-1 pb-4 border-b">
            <SheetTitle>Payout {selectedPayout?.id}</SheetTitle>
            <SheetDescription>{selectedPayout?.date}</SheetDescription>
          </SheetHeader>

          {selectedPayout && (
            <Tabs defaultValue="details" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Payout Details</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6 mt-4">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground">Payout Summary</h4>
                  <div className="grid gap-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Period</span>
                      <span className="text-sm font-medium">{selectedPayout.period}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Date</span>
                      <span className="text-sm font-medium">{selectedPayout.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Gross Amount</span>
                      <span className="text-sm font-medium">₦{selectedPayout.grossAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Fees</span>
                      <span className="text-sm font-medium text-red-600">-₦{selectedPayout.totalFees.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Commission</span>
                      <span className="text-sm font-medium text-red-600">-₦{selectedPayout.totalCommissions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Tax</span>
                      <span className="text-sm font-medium text-red-600">-₦{selectedPayout.totalTaxes.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t">
                      <span className="text-sm font-medium">Settled Amount</span>
                      <span className="text-sm font-bold text-green-600">₦{selectedPayout.netAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <h4 className="text-sm font-medium text-muted-foreground">Bank Details</h4>
                  <div className="grid gap-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Bank</span>
                      <span className="text-sm font-medium">{selectedPayout.bankDetails}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Method</span>
                      <span className="text-sm font-medium">{selectedPayout.method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge className={getStatusColor(selectedPayout.status)}>
                        {selectedPayout.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="orders" className="mt-4">
                <div className="space-y-3">
                  {selectedPayout.orders.map((order) => (
                    <div key={order.orderId} className="p-3 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-medium">{order.orderId}</span>
                        <span className="text-xs text-muted-foreground">{order.date}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total</span>
                          <span>₦{order.totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Fees</span>
                          <span className="text-red-600">-₦{order.fees.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Commission</span>
                          <span className="text-red-600">-₦{order.commission.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tax</span>
                          <span className="text-red-600">-₦{order.tax.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="text-sm text-muted-foreground">Settled</span>
                        <span className="text-sm font-bold text-green-600">₦{order.settledAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
