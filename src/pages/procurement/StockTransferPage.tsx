import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoading } from "@/hooks/use-loading";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, ArrowRight, Truck, Clock, CheckCircle2, MoreHorizontal, Package, MapPin, FileText, Calendar } from "lucide-react";
import { DatePeriodFilter, DatePeriod, useDatePeriodFilter } from "@/components/ui/date-period-filter";
import { TablePagination } from "@/components/ui/table-pagination";

interface TransferItem {
  name: string;
  sku: string;
  quantity: number;
  unit: string;
}

interface Transfer {
  id: string;
  from: string;
  to: string;
  items: number;
  date: string;
  status: "completed" | "in-transit" | "pending";
  itemsList?: TransferItem[];
  notes?: string;
  createdBy?: string;
  timeline?: { time: string; event: string; user?: string }[];
}

const transfers: Transfer[] = [
  { 
    id: "TRF-001", from: "Main Kitchen", to: "Cold Storage", items: 5, date: "2026-01-14", status: "completed",
    itemsList: [
      { name: "Chicken Breast", sku: "CHK-001", quantity: 20, unit: "kg" },
      { name: "Beef Steak", sku: "BEF-002", quantity: 15, unit: "kg" },
      { name: "Salmon Fillet", sku: "SAL-003", quantity: 10, unit: "kg" },
      { name: "Shrimp", sku: "SHR-004", quantity: 8, unit: "kg" },
      { name: "Lamb Chops", sku: "LAM-005", quantity: 12, unit: "kg" }
    ],
    notes: "Regular weekly transfer to cold storage",
    createdBy: "John Doe",
    timeline: [
      { time: "9:00 AM", event: "Transfer created", user: "John Doe" },
      { time: "9:30 AM", event: "Items packed", user: "Sarah Smith" },
      { time: "10:00 AM", event: "In transit" },
      { time: "10:15 AM", event: "Received at Cold Storage", user: "Mike Johnson" }
    ]
  },
  { 
    id: "TRF-002", from: "Warehouse", to: "Main Kitchen", items: 12, date: "2026-01-14", status: "in-transit",
    itemsList: [
      { name: "Rice", sku: "RIC-001", quantity: 50, unit: "kg" },
      { name: "Cooking Oil", sku: "OIL-002", quantity: 20, unit: "liters" },
      { name: "Tomato Paste", sku: "TOM-003", quantity: 30, unit: "cans" }
    ],
    notes: "Restock order for main kitchen",
    createdBy: "Sarah Smith"
  },
  { 
    id: "TRF-003", from: "Cold Storage", to: "VI Branch", items: 8, date: "2026-01-13", status: "pending",
    itemsList: [
      { name: "Frozen Chicken", sku: "FCH-001", quantity: 25, unit: "kg" },
      { name: "Frozen Fish", sku: "FFI-002", quantity: 15, unit: "kg" }
    ],
    notes: "Weekly supply for VI Branch",
    createdBy: "Mike Johnson"
  },
  { 
    id: "TRF-004", from: "Warehouse", to: "Lekki Store", items: 15, date: "2026-01-12", status: "completed",
    itemsList: [
      { name: "Beverages", sku: "BEV-001", quantity: 100, unit: "bottles" },
      { name: "Snacks", sku: "SNK-002", quantity: 50, unit: "packs" }
    ],
    createdBy: "Emily Brown"
  },
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
  const isLoading = useLoading(1000);
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"view" | "edit" | "add">("view");
  const [datePeriod, setDatePeriod] = useState<DatePeriod>("all");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  const dateFiltered = useDatePeriodFilter(transfers, datePeriod, customStartDate, customEndDate, "date");

  const filteredTransfers = dateFiltered.filter(t => 
    t.id.toLowerCase().includes(search.toLowerCase()) ||
    t.from.toLowerCase().includes(search.toLowerCase()) ||
    t.to.toLowerCase().includes(search.toLowerCase())
  );

  const totalItems = filteredTransfers.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedTransfers = filteredTransfers.slice(startIndex, endIndex);

  const handleCustomRange = (start: string, end: string) => {
    setCustomStartDate(start);
    setCustomEndDate(end);
    setCurrentPage(1);
  };

  const openViewSheet = (transfer: Transfer) => {
    setSelectedTransfer(transfer);
    setSheetMode("view");
  };

  const openEditSheet = (transfer: Transfer) => {
    setSelectedTransfer(transfer);
    setSheetMode("edit");
  };

  const openAddSheet = () => {
    setSelectedTransfer(null);
    setSheetMode("add");
    setIsAddSheetOpen(true);
  };

  const closeSheet = () => {
    setSelectedTransfer(null);
    setIsAddSheetOpen(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Stock Transfers</h1>
          <p className="text-sm text-muted-foreground">Move inventory between locations</p>
        </div>
        <Button size="sm" className="w-full sm:w-auto" onClick={openAddSheet}>
          <Plus className="h-4 w-4 mr-2" />
          New Transfer
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
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

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search transfers..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="pl-9" 
              />
            </div>
            <DatePeriodFilter
              value={datePeriod}
              onChange={(v) => { setDatePeriod(v); setCurrentPage(1); }}
              onCustomRange={handleCustomRange}
              customStartDate={customStartDate}
              customEndDate={customEndDate}
            />
          </div>

          {isLoading ? (
            <TransfersSkeleton />
          ) : (
            <>
              <div className="block sm:hidden space-y-3">
                {paginatedTransfers.map((transfer) => (
                  <Card 
                    key={transfer.id} 
                    className="border-border/50 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => openViewSheet(transfer)}
                  >
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
                        {paginatedTransfers.map((transfer) => (
                          <tr 
                            key={transfer.id} 
                            className="border-b border-border/50 last:border-0 group cursor-pointer hover:bg-muted/50"
                            onClick={() => openViewSheet(transfer)}
                          >
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
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  startIndex={startIndex + 1}
                  endIndex={endIndex}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={setPageSize}
                  showPageSize
                />
              </>
            )}
          </div>

        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Recent Transfers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {transfers.slice(0, 3).map((transfer) => (
                <div 
                  key={transfer.id} 
                  className="p-3 border border-border/50 rounded-lg space-y-2 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => openViewSheet(transfer)}
                >
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
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={openAddSheet}>
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

      {/* Transfer Action Sheet */}
      <Sheet open={!!selectedTransfer || isAddSheetOpen} onOpenChange={closeSheet}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle>
                {sheetMode === "add" ? "New Transfer" : sheetMode === "edit" ? "Edit Transfer" : `Transfer ${selectedTransfer?.id}`}
              </SheetTitle>
              {selectedTransfer && sheetMode === "view" && getStatusBadge(selectedTransfer.status)}
            </div>
            <SheetDescription>
              {sheetMode === "add" ? "Create a new stock transfer" : selectedTransfer ? `${selectedTransfer.from} → ${selectedTransfer.to}` : ""}
            </SheetDescription>
          </SheetHeader>

          {sheetMode === "view" && selectedTransfer ? (
            <Tabs defaultValue="details" className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="items">Items</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{selectedTransfer.from}</p>
                      <p className="text-xs text-muted-foreground">From</p>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{selectedTransfer.to}</p>
                      <p className="text-xs text-muted-foreground">To</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Total Items</Label>
                    <p className="text-sm font-medium">{selectedTransfer.items} items</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Date</Label>
                    <p className="text-sm font-medium">{selectedTransfer.date}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Created By</Label>
                    <p className="text-sm font-medium">{selectedTransfer.createdBy || "System"}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Status</Label>
                    {getStatusBadge(selectedTransfer.status)}
                  </div>
                </div>

                {selectedTransfer.notes && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm">{selectedTransfer.notes}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="items" className="space-y-4 mt-4">
                {selectedTransfer.itemsList && selectedTransfer.itemsList.length > 0 ? (
                  <div className="space-y-3">
                    {selectedTransfer.itemsList.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{item.sku}</p>
                        </div>
                        <Badge variant="outline">{item.quantity} {item.unit}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Package className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">No items listed</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="timeline" className="space-y-4 mt-4">
                {selectedTransfer.timeline && selectedTransfer.timeline.length > 0 ? (
                  <div className="relative">
                    <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-border" />
                    <div className="space-y-4">
                      {selectedTransfer.timeline.map((event, idx) => (
                        <div key={idx} className="flex items-start gap-4 relative">
                          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center z-10">
                            <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                          </div>
                          <div className="pt-0.5">
                            <p className="text-sm font-medium">{event.event}</p>
                            <p className="text-xs text-muted-foreground">
                              {event.time}{event.user && ` • ${event.user}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Clock className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">No timeline events</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-4 mt-6">
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
                    <SelectItem value="lekki">Lekki Store</SelectItem>
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
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea placeholder="Add transfer notes..." />
              </div>
            </div>
          )}

          <SheetFooter className="mt-6 flex-col sm:flex-row gap-2">
            {sheetMode === "view" && selectedTransfer ? (
              <>
                <Button variant="outline" onClick={() => openEditSheet(selectedTransfer)} className="w-full sm:w-auto">
                  Edit Transfer
                </Button>
                {selectedTransfer.status === "pending" && (
                  <Button className="w-full sm:w-auto">
                    <Truck className="mr-2 h-4 w-4" />
                    Start Transfer
                  </Button>
                )}
                {selectedTransfer.status === "in-transit" && (
                  <Button className="w-full sm:w-auto">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Mark Completed
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button variant="outline" onClick={closeSheet} className="w-full sm:w-auto">Cancel</Button>
                <Button className="w-full sm:w-auto">
                  {sheetMode === "add" ? "Create Transfer" : "Save Changes"}
                </Button>
              </>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
