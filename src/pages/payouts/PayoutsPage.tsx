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
import { Search, DollarSign, Clock, CheckCircle2, Download, Filter, Wallet, Calendar } from "lucide-react";

interface PayoutOrder {
  orderId: string;
  date: string;
  totalAmount: number;
  fees: number;
  commission: number;
  tax: number;
  settledAmount: number;
}

interface Payout {
  id: string;
  date: string;
  amount: number;
  fees: number;
  commission: number;
  tax: number;
  settledAmount: number;
  method: string;
  account: string;
  bankDetails: string;
  status: "success" | "pending" | "failed";
  orders: PayoutOrder[];
}

const payoutsData: Payout[] = [
  { 
    id: "PAY-001", 
    date: "2026-01-10", 
    amount: 285000, 
    fees: 5700, 
    commission: 8550, 
    tax: 4275, 
    settledAmount: 266475, 
    method: "Bank Transfer", 
    account: "****4521", 
    bankDetails: "GTBank - 0123456789",
    status: "success",
    orders: [
      { orderId: "ORD-101", date: "2026-01-09", totalAmount: 95000, fees: 1900, commission: 2850, tax: 1425, settledAmount: 88825 },
      { orderId: "ORD-102", date: "2026-01-09", totalAmount: 120000, fees: 2400, commission: 3600, tax: 1800, settledAmount: 112200 },
      { orderId: "ORD-103", date: "2026-01-08", totalAmount: 70000, fees: 1400, commission: 2100, tax: 1050, settledAmount: 65450 },
    ]
  },
  { 
    id: "PAY-002", 
    date: "2026-01-05", 
    amount: 185000, 
    fees: 3700, 
    commission: 5550, 
    tax: 2775, 
    settledAmount: 172975, 
    method: "Bank Transfer", 
    account: "****4521",
    bankDetails: "GTBank - 0123456789", 
    status: "success",
    orders: [
      { orderId: "ORD-098", date: "2026-01-04", totalAmount: 85000, fees: 1700, commission: 2550, tax: 1275, settledAmount: 79475 },
      { orderId: "ORD-099", date: "2026-01-04", totalAmount: 100000, fees: 2000, commission: 3000, tax: 1500, settledAmount: 93500 },
    ]
  },
  { 
    id: "PAY-003", 
    date: "2026-01-14", 
    amount: 320000, 
    fees: 6400, 
    commission: 9600, 
    tax: 4800, 
    settledAmount: 299200, 
    method: "Bank Transfer", 
    account: "****4521",
    bankDetails: "GTBank - 0123456789", 
    status: "pending",
    orders: [
      { orderId: "ORD-110", date: "2026-01-13", totalAmount: 150000, fees: 3000, commission: 4500, tax: 2250, settledAmount: 140250 },
      { orderId: "ORD-111", date: "2026-01-13", totalAmount: 170000, fees: 3400, commission: 5100, tax: 2550, settledAmount: 158950 },
    ]
  },
  { 
    id: "PAY-004", 
    date: "2025-12-28", 
    amount: 210000, 
    fees: 4200, 
    commission: 6300, 
    tax: 3150, 
    settledAmount: 196350, 
    method: "Bank Transfer", 
    account: "****4521",
    bankDetails: "GTBank - 0123456789", 
    status: "success",
    orders: [
      { orderId: "ORD-095", date: "2025-12-27", totalAmount: 110000, fees: 2200, commission: 3300, tax: 1650, settledAmount: 102850 },
      { orderId: "ORD-096", date: "2025-12-27", totalAmount: 100000, fees: 2000, commission: 3000, tax: 1500, settledAmount: 93500 },
    ]
  },
];

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
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isLoading = useLoading(1000);

  const stats = [
    { label: "Available Balance", value: "₦425,000", icon: Wallet },
    { label: "Pending Payout", value: "₦299,200", icon: Clock },
    { label: "Total Paid Out", value: "₦4,560,000", icon: CheckCircle2 },
  ];

  const filteredPayouts = payoutsData.filter(p => {
    const matchesSearch = p.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "pending": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "failed": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default: return "";
    }
  };

  const openSheet = (payout: Payout) => {
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
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-[130px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
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
                {filteredPayouts.map((payout) => (
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
                    {filteredPayouts.map((payout) => (
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">Showing 1-4 of 24 payouts</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled className="h-8">Previous</Button>
          <Button variant="outline" size="sm" className="h-8">Next</Button>
        </div>
      </div>

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
                      <span className="text-sm text-muted-foreground">Date</span>
                      <span className="text-sm font-medium">{selectedPayout.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Amount</span>
                      <span className="text-sm font-medium">₦{selectedPayout.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Fees</span>
                      <span className="text-sm font-medium text-red-600">-₦{selectedPayout.fees.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Commission</span>
                      <span className="text-sm font-medium text-red-600">-₦{selectedPayout.commission.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Tax</span>
                      <span className="text-sm font-medium text-red-600">-₦{selectedPayout.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t">
                      <span className="text-sm font-medium">Settled Amount</span>
                      <span className="text-sm font-bold text-green-600">₦{selectedPayout.settledAmount.toLocaleString()}</span>
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
