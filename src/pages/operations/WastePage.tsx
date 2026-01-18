import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useLoading } from "@/hooks/use-loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Trash2, TrendingDown, AlertTriangle, MoreHorizontal, Calendar, User, X, Edit } from "lucide-react";
import { DatePeriodFilter, DatePeriod, useDatePeriodFilter } from "@/components/ui/date-period-filter";
import { TablePagination } from "@/components/ui/table-pagination";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WasteItem {
  id: number;
  item: string;
  quantity: string;
  unit: string;
  reason: string;
  cost: number;
  date: string;
  loggedBy: string;
  notes?: string;
}

const wasteLog: WasteItem[] = [
  { id: 1, item: "Lettuce", quantity: "5", unit: "kg", reason: "Spoilage", cost: 2500, date: "2026-01-15", loggedBy: "John D.", notes: "Found moldy in storage" },
  { id: 2, item: "Chicken Breast", quantity: "3", unit: "kg", reason: "Overproduction", cost: 4500, date: "2026-01-15", loggedBy: "Sarah M.", notes: "Prepared too much for slow day" },
  { id: 3, item: "Milk", quantity: "2", unit: "L", reason: "Expired", cost: 800, date: "2026-01-14", loggedBy: "Mike R." },
  { id: 4, item: "Bread Rolls", quantity: "24", unit: "pcs", reason: "Overproduction", cost: 1200, date: "2026-01-14", loggedBy: "Emma W." },
];

const stats = [
  { label: "Total Waste (MTD)", value: "₦125,000", icon: Trash2 },
  { label: "Waste %", value: "3.2%", icon: AlertTriangle },
  { label: "vs Last Month", value: "-15%", icon: TrendingDown, positive: true },
  { label: "Items Logged", value: "42", icon: Trash2 },
];

const reasons = ["Spoilage", "Expired", "Overproduction", "Damaged", "Customer Return", "Other"];

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="border-border/50">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-7 w-16" />
              </div>
              <Skeleton className="h-7 w-7 sm:h-8 sm:w-8 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function WasteSkeleton() {
  return (
    <>
      <div className="block sm:hidden divide-y divide-border -mx-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="px-3 py-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        ))}
      </div>
      <div className="hidden sm:block overflow-x-auto -mx-4">
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
                <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                <td className="p-4"><Skeleton className="h-5 w-20 rounded-full" /></td>
                <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                <td className="p-4"><Skeleton className="h-4 w-12" /></td>
                <td className="p-4"><Skeleton className="h-8 w-8" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

const WastePage = () => {
  const [search, setSearch] = useState("");
  const [reasonFilter, setReasonFilter] = useState("all");
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
  const [selectedWaste, setSelectedWaste] = useState<WasteItem | null>(null);
  const [datePeriod, setDatePeriod] = useState<DatePeriod>("all");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const isLoading = useLoading(1000);

  const getReasonColor = (reason: string) => {
    switch (reason.toLowerCase()) {
      case "spoilage": return "destructive";
      case "expired": return "destructive";
      case "overproduction": return "secondary";
      default: return "outline";
    }
  };

  const dateFiltered = useDatePeriodFilter(wasteLog, datePeriod, customStartDate, customEndDate, "date");

  const filteredWaste = dateFiltered.filter(w => {
    const matchesSearch = w.item.toLowerCase().includes(search.toLowerCase());
    const matchesReason = reasonFilter === "all" || w.reason.toLowerCase() === reasonFilter;
    return matchesSearch && matchesReason;
  });

  const totalItems = filteredWaste.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedWaste = filteredWaste.slice(startIndex, endIndex);

  const handleViewWaste = (waste: WasteItem) => {
    setSelectedWaste(waste);
    setIsViewSheetOpen(true);
  };

  const handleCustomRange = (start: string, end: string) => {
    setCustomStartDate(start);
    setCustomEndDate(end);
    setCurrentPage(1);
  };


  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Waste Management</h1>
          <p className="text-sm text-muted-foreground">Track and reduce food waste</p>
        </div>
        <Button size="sm" className="w-full sm:w-auto" onClick={() => setIsAddSheetOpen(true)}>
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="sm:inline">Log Waste</span>
        </Button>
      </div>

      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                    <p className={`text-xl sm:text-2xl font-semibold ${stat.positive ? "text-green-600" : ""}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <stat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="border-border/50">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search waste log..." 
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
            <Select value={reasonFilter} onValueChange={setReasonFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="All Reasons" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reasons</SelectItem>
                <SelectItem value="spoilage">Spoilage</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="overproduction">Overproduction</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <WasteSkeleton />
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block sm:hidden divide-y divide-border -mx-3">
                {paginatedWaste.map((item) => (
                  <div 
                    key={item.id} 
                    className="px-3 py-4 space-y-3 cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewWaste(item)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-sm">{item.item}</p>
                        <p className="text-xs text-muted-foreground">{item.quantity} {item.unit}</p>
                      </div>
                      <Badge 
                        variant={getReasonColor(item.reason) as "default" | "secondary" | "destructive" | "outline"}
                        className="text-xs font-normal shrink-0"
                      >
                        {item.reason}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{item.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{item.loggedBy}</span>
                        </div>
                      </div>
                      <span className="font-medium text-red-500">-₦{item.cost.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto -mx-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Item</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Quantity</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Reason</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Date</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Logged By</th>
                      <th className="text-right text-xs font-medium text-muted-foreground p-4">Cost</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedWaste.map((item) => (
                      <tr 
                        key={item.id} 
                        className="border-b border-border last:border-0 hover:bg-muted/50 group cursor-pointer"
                        onClick={() => handleViewWaste(item)}
                      >
                        <td className="p-4 font-medium text-sm">{item.item}</td>
                        <td className="p-4 text-sm text-muted-foreground">{item.quantity} {item.unit}</td>
                        <td className="p-4">
                          <Badge 
                            variant={getReasonColor(item.reason) as "default" | "secondary" | "destructive" | "outline"}
                            className="text-xs font-normal"
                          >
                            {item.reason}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{item.date}</td>
                        <td className="p-4 text-sm text-muted-foreground">{item.loggedBy}</td>
                        <td className="p-4 text-sm font-medium text-right text-red-500">
                          -₦{item.cost.toLocaleString()}
                        </td>
                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewWaste(item)}>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
        </CardContent>
      </Card>

      {/* Add Waste Sheet */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Log Waste Item</SheetTitle>
            <SheetDescription>Record wasted items for tracking</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label>Item Name</Label>
              <Input placeholder="e.g., Lettuce" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Unit</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kg</SelectItem>
                    <SelectItem value="g">Grams</SelectItem>
                    <SelectItem value="L">Liters</SelectItem>
                    <SelectItem value="pcs">Pieces</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
                <SelectContent>
                  {reasons.map(r => (
                    <SelectItem key={r} value={r.toLowerCase()}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Estimated Cost (₦)</Label>
              <Input type="number" placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea placeholder="Additional details about this waste..." rows={3} />
            </div>
          </div>
          <SheetFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsAddSheetOpen(false)} className="w-full sm:w-auto">Cancel</Button>
            <Button className="w-full sm:w-auto">Log Waste</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* View Waste Sheet */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedWaste?.item}</SheetTitle>
            <SheetDescription>Waste log details</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <span className="text-sm text-muted-foreground">Quantity</span>
              <span className="font-medium">{selectedWaste?.quantity} {selectedWaste?.unit}</span>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <span className="text-sm text-muted-foreground">Reason</span>
              <Badge variant={getReasonColor(selectedWaste?.reason || "") as "default" | "secondary" | "destructive" | "outline"}>
                {selectedWaste?.reason}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <span className="text-sm text-muted-foreground">Cost</span>
              <span className="font-medium text-red-500">-₦{selectedWaste?.cost.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <span className="text-sm text-muted-foreground">Date</span>
              <span className="font-medium">{selectedWaste?.date}</span>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <span className="text-sm text-muted-foreground">Logged By</span>
              <span className="font-medium">{selectedWaste?.loggedBy}</span>
            </div>
            {selectedWaste?.notes && (
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Notes</p>
                <p className="text-sm">{selectedWaste.notes}</p>
              </div>
            )}
          </div>
          <SheetFooter className="flex-col sm:flex-row gap-2">
            <Button variant="destructive" size="sm" className="w-full sm:w-auto">
              <Trash2 className="h-4 w-4 mr-2" />Delete
            </Button>
            <Button className="w-full sm:w-auto">
              <Edit className="h-4 w-4 mr-2" />Edit
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default WastePage;
