import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoading } from "@/hooks/use-loading";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, ArrowRight, Truck, Clock, CheckCircle2, MoreHorizontal } from "lucide-react";

interface Transfer {
  id: string;
  from: string;
  to: string;
  items: number;
  date: string;
  status: "completed" | "in-transit" | "pending";
}

const transfers: Transfer[] = [
  { id: "TRF-001", from: "Main Kitchen", to: "Cold Storage", items: 5, date: "2026-01-14", status: "completed" },
  { id: "TRF-002", from: "Warehouse", to: "Main Kitchen", items: 12, date: "2026-01-14", status: "in-transit" },
  { id: "TRF-003", from: "Cold Storage", to: "VI Branch", items: 8, date: "2026-01-13", status: "pending" },
  { id: "TRF-004", from: "Warehouse", to: "Lekki Store", items: 15, date: "2026-01-12", status: "completed" },
];

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="border-border/50">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2">
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-7 w-10 mb-1" />
            <Skeleton className="h-3 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TransfersSkeleton() {
  return (
    <>
      {/* Mobile skeleton */}
      <div className="block sm:hidden space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop skeleton */}
      <Card className="border-border/50 hidden sm:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <th key={i} className="p-4"><Skeleton className="h-3 w-16" /></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-8" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="p-4"><Skeleton className="h-5 w-16 rounded-full" /></td>
                    <td className="p-4"><Skeleton className="h-8 w-8" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default function StockTransferPage() {
  const [search, setSearch] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const isLoading = useLoading(1000);

  const stats = [
    { label: "Pending", value: "3", icon: Clock },
    { label: "In Transit", value: "2", icon: Truck },
    { label: "Completed", value: "45", icon: CheckCircle2 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs">Completed</Badge>;
      case "in-transit":
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs">In Transit</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-xs">Pending</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">{status}</Badge>;
    }
  };

  const filteredTransfers = transfers.filter(t => 
    t.id.toLowerCase().includes(search.toLowerCase()) ||
    t.from.toLowerCase().includes(search.toLowerCase()) ||
    t.to.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Stock Transfers</h1>
          <p className="text-sm text-muted-foreground">Move inventory between locations</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              New Transfer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Stock Transfer</DialogTitle>
              <DialogDescription>Move inventory between locations</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>From Location</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main Kitchen</SelectItem>
                    <SelectItem value="cold">Cold Storage</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>To Location</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select destination" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main Kitchen</SelectItem>
                    <SelectItem value="cold">Cold Storage</SelectItem>
                    <SelectItem value="vi">VI Branch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Items to Transfer</Label>
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Items
                </Button>
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="w-full sm:w-auto">Cancel</Button>
              <Button className="w-full sm:w-auto">Create Transfer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Two-column layout for desktop */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Stats */}
          {isLoading ? (
            <StatsSkeleton />
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {stats.map((stat) => (
                <Card key={stat.label} className="border-border/50">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <p className="text-xl sm:text-2xl font-semibold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Search */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search transfers..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="pl-9" 
            />
          </div>

          {/* Transfers List */}
          {isLoading ? (
            <TransfersSkeleton />
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block sm:hidden space-y-3">
                {filteredTransfers.map((transfer) => (
                  <Card key={transfer.id} className="border-border/50">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-medium">{transfer.id}</span>
                        {getStatusBadge(transfer.status)}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="truncate">{transfer.from}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="truncate">{transfer.to}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{transfer.items} items</span>
                        <span>{transfer.date}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Desktop Table View */}
              <Card className="border-border/50 hidden sm:block">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/50">
                          <th className="text-left text-xs font-medium text-muted-foreground p-4 pl-6">ID</th>
                          <th className="text-left text-xs font-medium text-muted-foreground p-4">Route</th>
                          <th className="text-left text-xs font-medium text-muted-foreground p-4">Items</th>
                          <th className="text-left text-xs font-medium text-muted-foreground p-4">Date</th>
                          <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
                          <th className="text-left text-xs font-medium text-muted-foreground p-4 pr-6 w-12"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTransfers.map((transfer) => (
                          <tr key={transfer.id} className="border-b border-border/50 last:border-0 group cursor-pointer hover:bg-muted/50">
                            <td className="p-4 pl-6 font-medium text-sm font-mono">{transfer.id}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2 text-sm">
                                <span className="truncate max-w-[100px]">{transfer.from}</span>
                                <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                <span className="truncate max-w-[100px]">{transfer.to}</span>
                              </div>
                            </td>
                            <td className="p-4 text-sm">{transfer.items}</td>
                            <td className="p-4 text-sm text-muted-foreground">{transfer.date}</td>
                            <td className="p-4">{getStatusBadge(transfer.status)}</td>
                            <td className="p-4 pr-6">
                              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Recent Transfers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {transfers.slice(0, 3).map((transfer) => (
                <div key={transfer.id} className="p-3 border border-border/50 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-muted-foreground">{transfer.id}</span>
                    {getStatusBadge(transfer.status)}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="truncate">{transfer.from}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                    <span className="truncate">{transfer.to}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{transfer.items} items • {transfer.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                New Transfer
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Truck className="mr-2 h-4 w-4" />
                Track Shipments
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                View History
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-muted/30">
            <CardContent className="p-4">
              <h4 className="font-medium text-sm mb-2">Tip</h4>
              <p className="text-xs text-muted-foreground">
                Create stock transfers to move inventory between locations and maintain optimal stock levels.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
