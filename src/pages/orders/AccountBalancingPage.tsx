import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLoading } from "@/hooks/use-loading";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, DollarSign, CheckCircle2, AlertCircle, User, Clock, CreditCard, Banknote, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface StaffBalance {
  id: string;
  staff: { name: string; email: string; phone: string; position: string };
  shift: string;
  shiftDate: string;
  expected: { cash: number; card: number; mobile: number; total: number };
  actual: { cash: number; card: number; mobile: number; total: number };
  difference: number;
  status: "balanced" | "short" | "over";
  transactions: { id: string; type: string; amount: number; method: string; time: string }[];
  notes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

const staffBalances: StaffBalance[] = [
  { 
    id: "BAL-001",
    staff: { name: "John Doe", email: "john@omega.com", phone: "+234 801 111 2222", position: "Cashier" }, 
    shift: "Morning", 
    shiftDate: "2026-01-14",
    expected: { cash: 250000, card: 150000, mobile: 50000, total: 450000 },
    actual: { cash: 250000, card: 150000, mobile: 50000, total: 450000 },
    difference: 0, 
    status: "balanced",
    transactions: [
      { id: "TXN-001", type: "order", amount: 8800, method: "cash", time: "09:15" },
      { id: "TXN-002", type: "order", amount: 15500, method: "card", time: "10:30" },
      { id: "TXN-003", type: "order", amount: 6200, method: "mobile", time: "11:45" },
    ],
    reviewedBy: "Manager Mike",
    reviewedAt: "2026-01-14 18:00"
  },
  { 
    id: "BAL-002",
    staff: { name: "Jane Smith", email: "jane@omega.com", phone: "+234 802 222 3333", position: "Cashier" }, 
    shift: "Morning", 
    shiftDate: "2026-01-14",
    expected: { cash: 200000, card: 130000, mobile: 50000, total: 380000 },
    actual: { cash: 195500, card: 130000, mobile: 50000, total: 375500 },
    difference: -4500, 
    status: "short",
    transactions: [
      { id: "TXN-004", type: "order", amount: 12300, method: "cash", time: "08:30" },
      { id: "TXN-005", type: "refund", amount: -3500, method: "cash", time: "09:45" },
    ],
    notes: "Cash shortage noted - investigating"
  },
  { 
    id: "BAL-003",
    staff: { name: "Mike Johnson", email: "mike.j@omega.com", phone: "+234 803 333 4444", position: "Senior Cashier" }, 
    shift: "Afternoon", 
    shiftDate: "2026-01-14",
    expected: { cash: 300000, card: 170000, mobile: 50000, total: 520000 },
    actual: { cash: 305000, card: 170000, mobile: 50000, total: 525000 },
    difference: 5000, 
    status: "over",
    transactions: [
      { id: "TXN-006", type: "order", amount: 22400, method: "cash", time: "13:00" },
      { id: "TXN-007", type: "order", amount: 18500, method: "card", time: "14:15" },
    ],
    notes: "Customer may have overpaid - checking"
  },
  { 
    id: "BAL-004",
    staff: { name: "Sarah Williams", email: "sarah.w@omega.com", phone: "+234 804 444 5555", position: "Cashier" }, 
    shift: "Evening", 
    shiftDate: "2026-01-14",
    expected: { cash: 350000, card: 200000, mobile: 60000, total: 610000 },
    actual: { cash: 350000, card: 200000, mobile: 60000, total: 610000 },
    difference: 0, 
    status: "balanced",
    transactions: [
      { id: "TXN-008", type: "order", amount: 45000, method: "card", time: "18:30" },
      { id: "TXN-009", type: "order", amount: 32000, method: "cash", time: "19:45" },
    ],
    reviewedBy: "Manager Mike",
    reviewedAt: "2026-01-14 23:00"
  },
];

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount);
};

const statusColors: Record<string, string> = {
  balanced: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  short: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  over: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
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
  const [shiftFilter, setShiftFilter] = useState("today");
  const [selectedBalance, setSelectedBalance] = useState<StaffBalance | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isLoading = useLoading(1000);

  const handleReview = (balance: StaffBalance) => {
    setSelectedBalance(balance);
    setIsSheetOpen(true);
  };

  const totalExpected = staffBalances.reduce((acc, b) => acc + b.expected.total, 0);
  const totalActual = staffBalances.reduce((acc, b) => acc + b.actual.total, 0);
  const balancedCount = staffBalances.filter(b => b.status === "balanced").length;
  const discrepancyCount = staffBalances.filter(b => b.status !== "balanced").length;

  const stats = [
    { label: "Total Expected", value: formatPrice(totalExpected), icon: DollarSign },
    { label: "Total Actual", value: formatPrice(totalActual), icon: DollarSign },
    { label: "Balanced", value: `${balancedCount} staff`, icon: CheckCircle2 },
    { label: "Discrepancies", value: `${discrepancyCount} staff`, icon: AlertCircle },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Account Balancing</h1>
          <p className="text-sm text-muted-foreground">Reconcile staff cash and sales</p>
        </div>
        <Select value={shiftFilter} onValueChange={setShiftFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-3 sm:pt-6 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-lg sm:text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">Staff Balances</CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:px-6 sm:pb-6">
            {/* Mobile Card View */}
            <div className="block sm:hidden divide-y divide-border">
              {staffBalances.map((balance) => (
                <div key={balance.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <User className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="font-medium truncate">{balance.staff.name}</span>
                    </div>
                    <Badge className={cn("shrink-0", statusColors[balance.status])}>
                      {balance.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{balance.shift} Shift</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Expected</p>
                      <p className="font-medium">{formatPrice(balance.expected.total)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Actual</p>
                      <p className="font-medium">{formatPrice(balance.actual.total)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Difference</p>
                      <p className={cn("font-medium", balance.difference === 0 ? "" : balance.difference > 0 ? "text-green-600" : "text-red-600")}>
                        {balance.difference >= 0 ? "+" : ""}{formatPrice(balance.difference)}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleReview(balance)}>Review</Button>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">Staff</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">Shift</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">Expected</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">Actual</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">Difference</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staffBalances.map((balance) => (
                    <tr key={balance.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="p-4 font-medium">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {balance.staff.name}
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{balance.shift}</td>
                      <td className="p-4">{formatPrice(balance.expected.total)}</td>
                      <td className="p-4">{formatPrice(balance.actual.total)}</td>
                      <td className={cn("p-4", balance.difference === 0 ? "" : balance.difference > 0 ? "text-green-600" : "text-red-600")}>
                        {balance.difference >= 0 ? "+" : ""}{formatPrice(balance.difference)}
                      </td>
                      <td className="p-4">
                        <Badge className={statusColors[balance.status]}>
                          {balance.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Button variant="ghost" size="sm" onClick={() => handleReview(balance)}>Review</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {selectedBalance && (
            <>
              <SheetHeader className="space-y-1">
                <SheetTitle className="flex items-center gap-2">
                  <span>Balance Review - {selectedBalance.staff.name}</span>
                  <Badge className={statusColors[selectedBalance.status]}>
                    {selectedBalance.status}
                  </Badge>
                </SheetTitle>
                <SheetDescription>
                  {selectedBalance.shift} Shift • {selectedBalance.shiftDate}
                </SheetDescription>
              </SheetHeader>

              <Tabs defaultValue="summary" className="mt-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="space-y-6 mt-4">
                  {/* Staff Details */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Staff Details
                    </h4>
                    <Card>
                      <CardContent className="p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Name</span>
                          <span className="text-sm font-medium">{selectedBalance.staff.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Position</span>
                          <span className="text-sm">{selectedBalance.staff.position}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Email</span>
                          <span className="text-sm">{selectedBalance.staff.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Phone</span>
                          <span className="text-sm">{selectedBalance.staff.phone}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Balance Summary */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Balance Summary
                    </h4>
                    <Card>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Expected Total</span>
                          <span className="text-sm font-medium">{formatPrice(selectedBalance.expected.total)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Actual Total</span>
                          <span className="text-sm font-medium">{formatPrice(selectedBalance.actual.total)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Difference</span>
                          <span className={cn("text-lg font-bold", selectedBalance.difference === 0 ? "" : selectedBalance.difference > 0 ? "text-green-600" : "text-red-600")}>
                            {selectedBalance.difference >= 0 ? "+" : ""}{formatPrice(selectedBalance.difference)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Notes */}
                  {selectedBalance.notes && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Notes</h4>
                      <Card>
                        <CardContent className="p-4">
                          <p className="text-sm text-muted-foreground">{selectedBalance.notes}</p>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Review Info */}
                  {selectedBalance.reviewedBy && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Review Info</h4>
                      <Card>
                        <CardContent className="p-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Reviewed By</span>
                            <span className="text-sm">{selectedBalance.reviewedBy}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Reviewed At</span>
                            <span className="text-sm">{selectedBalance.reviewedAt}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="breakdown" className="space-y-4 mt-4">
                  <h4 className="text-sm font-medium">Payment Method Breakdown</h4>
                  <div className="space-y-3">
                    {/* Cash */}
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <Banknote className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Cash</p>
                            <p className="text-xs text-muted-foreground">Physical currency</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">Expected</p>
                            <p className="font-medium">{formatPrice(selectedBalance.expected.cash)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Actual</p>
                            <p className="font-medium">{formatPrice(selectedBalance.actual.cash)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Difference</p>
                            <p className={cn("font-medium", selectedBalance.actual.cash - selectedBalance.expected.cash === 0 ? "" : selectedBalance.actual.cash - selectedBalance.expected.cash > 0 ? "text-green-600" : "text-red-600")}>
                              {selectedBalance.actual.cash - selectedBalance.expected.cash >= 0 ? "+" : ""}{formatPrice(selectedBalance.actual.cash - selectedBalance.expected.cash)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Card */}
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">Card</p>
                            <p className="text-xs text-muted-foreground">Debit/Credit cards</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">Expected</p>
                            <p className="font-medium">{formatPrice(selectedBalance.expected.card)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Actual</p>
                            <p className="font-medium">{formatPrice(selectedBalance.actual.card)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Difference</p>
                            <p className={cn("font-medium", selectedBalance.actual.card - selectedBalance.expected.card === 0 ? "" : selectedBalance.actual.card - selectedBalance.expected.card > 0 ? "text-green-600" : "text-red-600")}>
                              {selectedBalance.actual.card - selectedBalance.expected.card >= 0 ? "+" : ""}{formatPrice(selectedBalance.actual.card - selectedBalance.expected.card)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Mobile */}
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <Smartphone className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium">Mobile</p>
                            <p className="text-xs text-muted-foreground">Transfer/Mobile money</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">Expected</p>
                            <p className="font-medium">{formatPrice(selectedBalance.expected.mobile)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Actual</p>
                            <p className="font-medium">{formatPrice(selectedBalance.actual.mobile)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Difference</p>
                            <p className={cn("font-medium", selectedBalance.actual.mobile - selectedBalance.expected.mobile === 0 ? "" : selectedBalance.actual.mobile - selectedBalance.expected.mobile > 0 ? "text-green-600" : "text-red-600")}>
                              {selectedBalance.actual.mobile - selectedBalance.expected.mobile >= 0 ? "+" : ""}{formatPrice(selectedBalance.actual.mobile - selectedBalance.expected.mobile)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="transactions" className="space-y-4 mt-4">
                  <h4 className="text-sm font-medium">Shift Transactions ({selectedBalance.transactions.length})</h4>
                  <div className="space-y-2">
                    {selectedBalance.transactions.map((txn) => (
                      <Card key={txn.id}>
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <p className="font-mono text-sm">{txn.id}</p>
                            <p className="text-xs text-muted-foreground capitalize">{txn.type} • {txn.method} • {txn.time}</p>
                          </div>
                          <span className={cn("font-medium", txn.amount >= 0 ? "text-green-600" : "text-red-600")}>
                            {txn.amount >= 0 ? "+" : ""}{formatPrice(txn.amount)}
                          </span>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 space-y-3">
                <div className="flex gap-3">
                  <Select defaultValue={selectedBalance.status}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Change Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="short">Short</SelectItem>
                      <SelectItem value="over">Over</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>Update Status</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
