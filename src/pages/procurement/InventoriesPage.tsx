import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoading } from "@/hooks/use-loading";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Search, Plus, Package, AlertTriangle, DollarSign, MapPin, MoreHorizontal, Eye, Edit, Trash2, History } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TablePagination } from "@/components/ui/table-pagination";
import { SortableHeader } from "@/components/ui/sortable-header";
import { useTableControls } from "@/hooks/use-table-controls";

interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  unit: string;
  location: string;
  reorderLevel: number;
  value: number;
  status: "ok" | "low" | "critical";
  isIngredient: boolean;
  history: { date: string; action: string; quantity: number; by: string; location: string }[];
}

const inventories: InventoryItem[] = [
  { 
    id: 1, name: "Flour", sku: "ING-001", quantity: 50, unit: "kg", location: "Main Kitchen", reorderLevel: 20, value: 75000, status: "ok", isIngredient: true,
    history: [
      { date: "2026-01-15", action: "Stock In", quantity: 25, by: "John D.", location: "Main Kitchen" },
      { date: "2026-01-10", action: "Stock Out", quantity: 10, by: "Sarah M.", location: "Cold Storage" },
    ]
  },
  { 
    id: 2, name: "Olive Oil", sku: "ING-002", quantity: 8, unit: "L", location: "Main Kitchen", reorderLevel: 10, value: 48000, status: "low", isIngredient: true,
    history: [
      { date: "2026-01-14", action: "Stock Out", quantity: 5, by: "Mike R.", location: "Main Kitchen" },
    ]
  },
  { 
    id: 3, name: "Cheese", sku: "ING-003", quantity: 25, unit: "kg", location: "Cold Storage", reorderLevel: 15, value: 187500, status: "ok", isIngredient: true,
    history: []
  },
  { 
    id: 4, name: "Tomatoes", sku: "ING-004", quantity: 5, unit: "kg", location: "Cold Storage", reorderLevel: 10, value: 12500, status: "critical", isIngredient: true,
    history: []
  },
  { 
    id: 5, name: "Chicken", sku: "ING-005", quantity: 30, unit: "kg", location: "Cold Storage", reorderLevel: 20, value: 225000, status: "ok", isIngredient: true,
    history: []
  },
];

const locations = ["Main Kitchen", "Cold Storage", "Warehouse", "VI Branch"];

function StatsSkeleton() {
  return (
    <div className="grid gap-3 grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="border-border/50">
          <CardContent className="p-3 sm:p-4">
            <Skeleton className="h-8 w-8 rounded-lg mb-2" />
            <Skeleton className="h-7 w-16 mb-1" />
            <Skeleton className="h-3 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function InventoriesPage() {
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const isLoading = useLoading(1000);

  // Pre-filter by location before passing to useTableControls
  const preFilteredInventories = inventories.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.sku.toLowerCase().includes(search.toLowerCase());
    const matchesLocation = locationFilter === "all" || item.location === locationFilter;
    return matchesSearch && matchesLocation;
  });

  // Table controls
  const {
    data: paginatedInventories,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    sortConfig,
    handleSort,
    goToPage,
    setPageSize,
    startIndex,
    endIndex,
  } = useTableControls<InventoryItem>({ 
    data: preFilteredInventories,
    initialPageSize: 10 
  });

  // Sheet states
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    { label: "Total Items", value: "156", icon: Package },
    { label: "Low Stock", value: "12", icon: AlertTriangle, color: "text-yellow-600" },
    { label: "Total Value", value: formatPrice(548000), icon: DollarSign },
  ];

  const handleViewItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsViewSheetOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsAddSheetOpen(true);
  };

  const handleAddNew = () => {
    setSelectedItem(null);
    setIsAddSheetOpen(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Inventories</h1>
          <p className="text-sm text-muted-foreground">Manage stock levels across locations</p>
        </div>
        <Button size="sm" onClick={handleAddNew}><Plus className="h-4 w-4 mr-2" />Add Item</Button>
      </div>

      {/* Two-column layout for desktop */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Stats */}
          {isLoading ? (
            <StatsSkeleton />
          ) : (
            <div className="grid gap-3 grid-cols-3">
              {stats.map((stat) => (
                <Card key={stat.label} className="border-border/50">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-muted flex items-center justify-center">
                        <stat.icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${stat.color || "text-muted-foreground"}`} />
                      </div>
                    </div>
                    <p className="text-xl sm:text-2xl font-semibold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search inventory..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="pl-9 h-9 bg-muted/50 border-0" 
              />
            </div>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full sm:w-[160px] h-9 bg-muted/50 border-0">
                <MapPin className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Inventory List */}
          <Card className="border-border/50">
            <CardContent className="p-0">
              {/* Mobile Card View */}
              <div className="block sm:hidden divide-y divide-border">
                {paginatedInventories.map((item) => (
                  <div key={item.id} className="p-4 space-y-3 cursor-pointer" onClick={() => handleViewItem(item)}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.sku}</p>
                      </div>
                      <Badge 
                        variant={item.status === "ok" ? "default" : item.status === "low" ? "secondary" : "destructive"}
                        className="text-xs shrink-0"
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.quantity} {item.unit}</span>
                      <span className="text-muted-foreground">{formatPrice(item.value)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{item.location}</span>
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
                        <SortableHeader label="Item" field="name" currentSortField={sortConfig.field as string | null} currentSortDirection={sortConfig.direction} onSort={handleSort as (field: string) => void} />
                      </th>
                      <th className="text-left p-4">
                        <SortableHeader label="SKU" field="sku" currentSortField={sortConfig.field as string | null} currentSortDirection={sortConfig.direction} onSort={handleSort as (field: string) => void} />
                      </th>
                      <th className="text-left p-4">
                        <SortableHeader label="Qty" field="quantity" currentSortField={sortConfig.field as string | null} currentSortDirection={sortConfig.direction} onSort={handleSort as (field: string) => void} />
                      </th>
                      <th className="text-left p-4">
                        <SortableHeader label="Location" field="location" currentSortField={sortConfig.field as string | null} currentSortDirection={sortConfig.direction} onSort={handleSort as (field: string) => void} />
                      </th>
                      <th className="text-left p-4">
                        <SortableHeader label="Value" field="value" currentSortField={sortConfig.field as string | null} currentSortDirection={sortConfig.direction} onSort={handleSort as (field: string) => void} />
                      </th>
                      <th className="text-left p-4">
                        <SortableHeader label="Status" field="status" currentSortField={sortConfig.field as string | null} currentSortDirection={sortConfig.direction} onSort={handleSort as (field: string) => void} />
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedInventories.map((item) => (
                      <tr key={item.id} className="border-b border-border last:border-0 group cursor-pointer hover:bg-muted/50" onClick={() => handleViewItem(item)}>
                        <td className="p-4 font-medium text-sm">{item.name}</td>
                        <td className="p-4 text-sm text-muted-foreground">{item.sku}</td>
                        <td className="p-4 text-sm">{item.quantity} {item.unit}</td>
                        <td className="p-4 text-sm text-muted-foreground">{item.location}</td>
                        <td className="p-4 text-sm">{formatPrice(item.value)}</td>
                        <td className="p-4">
                          <Badge 
                            variant={item.status === "ok" ? "default" : item.status === "low" ? "secondary" : "destructive"}
                            className="text-xs"
                          >
                            {item.status}
                          </Badge>
                        </td>
                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewItem(item)}>
                                <Eye className="mr-2 h-4 w-4" />View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditItem(item)}>
                                <Edit className="mr-2 h-4 w-4" />Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
        </div>

        {/* Sidebar - Hidden on mobile */}
        <div className="hidden lg:block space-y-6">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {inventories.filter(i => i.status !== "ok").map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50 cursor-pointer" onClick={() => handleViewItem(item)}>
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.quantity} {item.unit} remaining</p>
                  </div>
                  <Badge variant={item.status === "low" ? "secondary" : "destructive"} className="text-xs">
                    {item.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Locations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {locations.map((loc) => (
                <div key={loc} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer" onClick={() => setLocationFilter(loc)}>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{loc}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {inventories.filter(i => i.location === loc).length} items
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleAddNew}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Item
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Package className="mr-2 h-4 w-4" />
                Stock Count
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Reorder Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add/Edit Sheet */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedItem ? "Edit Inventory Item" : "Add Inventory Item"}</SheetTitle>
            <SheetDescription>
              {selectedItem ? "Update item details" : "Add a new item to inventory"}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6">
            {/* Item Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Item Details</h3>
              <div className="space-y-2">
                <Label>Item Name</Label>
                <Input placeholder="Enter item name" defaultValue={selectedItem?.name} />
              </div>
              <div className="space-y-2">
                <Label>SKU</Label>
                <Input placeholder="e.g., ING-001" defaultValue={selectedItem?.sku} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input type="number" defaultValue={selectedItem?.quantity} />
                </div>
                <div className="space-y-2">
                  <Label>Measurement Unit</Label>
                  <Input placeholder="kg, L, pcs" defaultValue={selectedItem?.unit} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Inventory Location</Label>
                <Select defaultValue={selectedItem?.location}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Mark as Ingredient */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Mark as Ingredient</h3>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Use as Ingredient</p>
                  <p className="text-xs text-muted-foreground">Enable to link to products</p>
                </div>
                <Switch defaultChecked={selectedItem?.isIngredient} />
              </div>
            </div>
          </div>
          <SheetFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsAddSheetOpen(false)} className="w-full sm:w-auto">Cancel</Button>
            <Button className="w-full sm:w-auto">{selectedItem ? "Update Item" : "Add Item"}</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* View Details Sheet */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedItem?.name}</SheetTitle>
            <SheetDescription>Inventory item details and history</SheetDescription>
          </SheetHeader>
          {selectedItem && (
            <Tabs defaultValue="details" className="mt-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">SKU</p>
                    <p className="font-medium">{selectedItem.sku}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Quantity</p>
                    <p className="font-medium">{selectedItem.quantity} {selectedItem.unit}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-medium">{selectedItem.location}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Reorder Level</p>
                    <p className="font-medium">{selectedItem.reorderLevel} {selectedItem.unit}</p>
                  </div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Total Value</p>
                  <p className="text-xl font-bold">{formatPrice(selectedItem.value)}</p>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">Status</span>
                  <Badge variant={selectedItem.status === "ok" ? "default" : selectedItem.status === "low" ? "secondary" : "destructive"}>
                    {selectedItem.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">Is Ingredient</span>
                  <Badge variant={selectedItem.isIngredient ? "default" : "secondary"}>
                    {selectedItem.isIngredient ? "Yes" : "No"}
                  </Badge>
                </div>
              </TabsContent>
              <TabsContent value="history" className="space-y-4 mt-4">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Inventory History
                </h3>
                {selectedItem.history.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground border rounded-lg">
                    No history available
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedItem.history.map((entry, index) => (
                      <div key={index} className="p-3 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant={entry.action.includes("In") ? "default" : "secondary"}>
                            {entry.action}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{entry.date}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">{entry.quantity} {selectedItem.unit}</span>
                          <span className="text-muted-foreground"> at {entry.location}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">By: {entry.by}</p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
          <SheetFooter className="flex-col sm:flex-row gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsViewSheetOpen(false)} className="w-full sm:w-auto">Close</Button>
            <Button onClick={() => { setIsViewSheetOpen(false); handleEditItem(selectedItem!); }} className="w-full sm:w-auto">Edit Item</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
