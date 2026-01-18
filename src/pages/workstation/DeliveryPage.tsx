import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoading } from "@/hooks/use-loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Truck, MapPin, Clock, CheckCircle, Package, Search, Filter, Phone, User, Navigation, FileText } from "lucide-react";
import { DatePeriodFilter, DatePeriod, useDatePeriodFilter } from "@/components/ui/date-period-filter";
import { TablePagination } from "@/components/ui/table-pagination";

interface Delivery {
  id: string;
  customer: string;
  phone: string;
  address: string;
  status: "in_transit" | "pending" | "delivered";
  driver: string;
  eta: string;
  orderId: string;
  items: { name: string; quantity: number }[];
  total: string;
  notes?: string;
  timeline?: { time: string; event: string }[];
  date: string;
}

const deliveries: Delivery[] = [
  { 
    id: "DEL001", customer: "John Doe", phone: "+234 801 234 5678", address: "123 Main St, Victoria Island", 
    status: "in_transit", driver: "Mike", eta: "15 min", orderId: "ORD-1234", date: "2026-01-18",
    items: [{ name: "Jollof Rice", quantity: 2 }, { name: "Grilled Chicken", quantity: 1 }],
    total: "₦8,500", notes: "Please call before arrival",
    timeline: [
      { time: "2:00 PM", event: "Order confirmed" },
      { time: "2:15 PM", event: "Preparing food" },
      { time: "2:35 PM", event: "Picked up by driver" },
      { time: "2:40 PM", event: "In transit" }
    ]
  },
  { 
    id: "DEL002", customer: "Jane Smith", phone: "+234 802 345 6789", address: "456 Oak Ave, Lekki Phase 1", 
    status: "pending", driver: "Unassigned", eta: "-", orderId: "ORD-1235", date: "2026-01-18",
    items: [{ name: "Fried Rice", quantity: 1 }, { name: "Plantain", quantity: 2 }],
    total: "₦5,200"
  },
  { 
    id: "DEL003", customer: "Bob Wilson", phone: "+234 803 456 7890", address: "789 Pine Rd, Ikoyi", 
    status: "delivered", driver: "Sarah", eta: "Completed", orderId: "ORD-1230", date: "2026-01-17",
    items: [{ name: "Suya", quantity: 3 }, { name: "Pepper Soup", quantity: 1 }],
    total: "₦12,000",
    timeline: [
      { time: "1:00 PM", event: "Order confirmed" },
      { time: "1:10 PM", event: "Preparing food" },
      { time: "1:25 PM", event: "Picked up by driver" },
      { time: "1:30 PM", event: "In transit" },
      { time: "1:45 PM", event: "Delivered" }
    ]
  },
  { 
    id: "DEL004", customer: "Lisa Chen", phone: "+234 804 567 8901", address: "321 Elm St, Surulere", 
    status: "in_transit", driver: "Tom", eta: "25 min", orderId: "ORD-1236", date: "2026-01-18",
    items: [{ name: "Egusi Soup", quantity: 1 }, { name: "Pounded Yam", quantity: 2 }],
    total: "₦9,800"
  },
];

const stats = [
  { label: "Pending", value: "8", icon: Package },
  { label: "In Transit", value: "12", icon: Truck },
  { label: "Delivered Today", value: "45", icon: CheckCircle },
  { label: "Avg. Time", value: "28 min", icon: Clock },
];

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-3 sm:p-4 pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-7 w-12" />
              </div>
              <Skeleton className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function DeliveriesSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg">
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-4">
            <div className="space-y-1 text-right">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DeliveryPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const isLoading = useLoading(1000);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"view" | "edit" | "add">("view");
  const [datePeriod, setDatePeriod] = useState<DatePeriod>("all");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const dateFiltered = useDatePeriodFilter(deliveries, datePeriod, customStartDate, customEndDate, "date");

  const filteredDeliveries = dateFiltered.filter(d => 
    (d.customer.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === "all" || d.status === statusFilter)
  );

  const totalItems = filteredDeliveries.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedDeliveries = filteredDeliveries.slice(startIndex, endIndex);

  const handleCustomRange = (start: string, end: string) => {
    setCustomStartDate(start);
    setCustomEndDate(end);
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Delivered</Badge>;
      case "in_transit":
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">In Transit</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const openViewSheet = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setSheetMode("view");
  };

  const openEditSheet = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setSheetMode("edit");
  };

  const openAddSheet = () => {
    setSelectedDelivery(null);
    setSheetMode("add");
    setIsAddSheetOpen(true);
  };

  const closeSheet = () => {
    setSelectedDelivery(null);
    setIsAddSheetOpen(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Delivery Management</h1>
          <p className="text-sm text-muted-foreground">Track and manage deliveries</p>
        </div>
        <Button size="sm" className="w-full sm:w-auto" onClick={openAddSheet}>
          <Truck className="mr-2 h-4 w-4" />
          New Delivery
        </Button>
      </div>

      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-3 sm:p-4 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search deliveries..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <DatePeriodFilter
              value={datePeriod}
              onChange={(v) => { setDatePeriod(v); setCurrentPage(1); }}
              onCustomRange={handleCustomRange}
              customStartDate={customStartDate}
              customEndDate={customEndDate}
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {isLoading ? (
            <DeliveriesSkeleton />
          ) : (
            <>
              <div className="space-y-3">
                {paginatedDeliveries.map((delivery) => (
                  <div 
                    key={delivery.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 border rounded-lg transition-colors hover:bg-muted/50 cursor-pointer"
                    onClick={() => openViewSheet(delivery)}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="p-2 rounded-lg bg-muted shrink-0">
                        <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{delivery.customer}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 truncate">
                          <MapPin className="h-3 w-3 shrink-0" /> {delivery.address}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pl-10 sm:pl-0">
                      <div className="text-right">
                        <p className="text-sm font-medium">{delivery.driver}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">ETA: {delivery.eta}</p>
                      </div>
                      {getStatusBadge(delivery.status)}
                    </div>
                  </div>
                ))}
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

      {/* Delivery Action Sheet */}
      <Sheet open={!!selectedDelivery || isAddSheetOpen} onOpenChange={closeSheet}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle>
                {sheetMode === "add" ? "New Delivery" : sheetMode === "edit" ? "Edit Delivery" : `Delivery ${selectedDelivery?.id}`}
              </SheetTitle>
              {selectedDelivery && sheetMode === "view" && getStatusBadge(selectedDelivery.status)}
            </div>
            <SheetDescription>
              {sheetMode === "add" ? "Create a new delivery" : `Order: ${selectedDelivery?.orderId}`}
            </SheetDescription>
          </SheetHeader>

          {sheetMode === "view" && selectedDelivery ? (
            <Tabs defaultValue="details" className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="items">Items</TabsTrigger>
                <TabsTrigger value="tracking">Tracking</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{selectedDelivery.customer}</p>
                        <p className="text-xs text-muted-foreground">Customer</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{selectedDelivery.phone}</p>
                        <p className="text-xs text-muted-foreground">Phone</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{selectedDelivery.address}</p>
                        <p className="text-xs text-muted-foreground">Address</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Driver</Label>
                      <p className="text-sm font-medium">{selectedDelivery.driver}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">ETA</Label>
                      <p className="text-sm font-medium">{selectedDelivery.eta}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Order Total</Label>
                      <p className="text-sm font-medium">{selectedDelivery.total}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Order ID</Label>
                      <p className="text-sm font-mono">{selectedDelivery.orderId}</p>
                    </div>
                  </div>

                  {selectedDelivery.notes && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Delivery Notes</p>
                      <p className="text-sm">{selectedDelivery.notes}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 pt-4">
                    <Button variant="outline" size="sm">
                      <Phone className="mr-2 h-4 w-4" />
                      Call Customer
                    </Button>
                    <Button variant="outline" size="sm">
                      <Navigation className="mr-2 h-4 w-4" />
                      Open Map
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="items" className="space-y-4 mt-4">
                <div className="space-y-3">
                  {selectedDelivery.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm font-medium">{item.name}</span>
                      <Badge variant="outline">x{item.quantity}</Badge>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">Total</span>
                  <span className="text-sm font-bold">{selectedDelivery.total}</span>
                </div>
              </TabsContent>

              <TabsContent value="tracking" className="space-y-4 mt-4">
                {selectedDelivery.timeline && selectedDelivery.timeline.length > 0 ? (
                  <div className="relative">
                    <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-border" />
                    <div className="space-y-4">
                      {selectedDelivery.timeline.map((event, idx) => (
                        <div key={idx} className="flex items-start gap-4 relative">
                          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center z-10">
                            <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                          </div>
                          <div className="pt-0.5">
                            <p className="text-sm font-medium">{event.event}</p>
                            <p className="text-xs text-muted-foreground">{event.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Clock className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">No tracking updates yet</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label>Order</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select order" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ord-1237">ORD-1237 - New Order</SelectItem>
                    <SelectItem value="ord-1238">ORD-1238 - Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Driver</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Assign driver" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mike">Mike</SelectItem>
                    <SelectItem value="sarah">Sarah</SelectItem>
                    <SelectItem value="tom">Tom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Delivery Notes</Label>
                <Textarea placeholder="Add delivery instructions..." />
              </div>
            </div>
          )}

          <SheetFooter className="mt-6 flex-col sm:flex-row gap-2">
            {sheetMode === "view" && selectedDelivery ? (
              <>
                <Button variant="outline" onClick={() => openEditSheet(selectedDelivery)} className="w-full sm:w-auto">
                  Edit Delivery
                </Button>
                {selectedDelivery.status !== "delivered" && (
                  <Button className="w-full sm:w-auto">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark Delivered
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button variant="outline" onClick={closeSheet} className="w-full sm:w-auto">Cancel</Button>
                <Button className="w-full sm:w-auto">
                  {sheetMode === "add" ? "Create Delivery" : "Save Changes"}
                </Button>
              </>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
