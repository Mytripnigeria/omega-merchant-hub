import { useState } from "react";
import { useStore } from "@/contexts/StoreContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, MapPin, Warehouse, Package, Edit, Trash2, MoreHorizontal, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TablePagination } from "@/components/ui/table-pagination";
import { cn } from "@/lib/utils";
import { useTableControls } from "@/hooks/use-table-controls";

interface Location {
  id: string;
  name: string;
  type: "warehouse" | "store" | "kitchen";
  address: string;
  manager: string;
  phone: string;
  itemCount: number;
  totalValue: number;
  isActive: boolean;
}

const mockLocations: Location[] = [
  { id: "loc-1", name: "Main Warehouse", type: "warehouse", address: "45 Industrial Road, Ikeja, Lagos", manager: "John Adeyemi", phone: "+234 812 345 6789", itemCount: 245, totalValue: 2450000, isActive: true },
  { id: "loc-2", name: "Lekki Store", type: "store", address: "15 Admiralty Way, Lekki Phase 1, Lagos", manager: "Sarah Okonkwo", phone: "+234 812 345 6790", itemCount: 120, totalValue: 850000, isActive: true },
  { id: "loc-3", name: "VI Kitchen", type: "kitchen", address: "25 Adeola Odeku Street, VI, Lagos", manager: "Michael Eze", phone: "+234 812 345 6791", itemCount: 85, totalValue: 420000, isActive: true },
  { id: "loc-4", name: "Ikeja Mall Store", type: "store", address: "Shop 45, Ikeja City Mall, Lagos", manager: "Grace Nwosu", phone: "+234 812 345 6792", itemCount: 95, totalValue: 680000, isActive: false },
];

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount);
};

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

function TableSkeleton() {
  return (
    <Card className="border-border/50">
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function LocationsPage() {
  const { currentStore } = useStore();
  const isLoading = useLoading(1000);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [sheetMode, setSheetMode] = useState<"add" | "edit" | "view">("add");

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredLocations = mockLocations.filter((location) => {
    const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          location.manager.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || location.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalItems = filteredLocations.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalItems);
  const paginatedLocations = filteredLocations.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  const handleSearch = (query: string) => { setSearchQuery(query); setCurrentPage(1); };
  const handleFilterChange = (value: string) => { setTypeFilter(value); setCurrentPage(1); };

  const displayedLocations = paginatedLocations;

  const stats = [
    { label: "Total Locations", value: mockLocations.length.toString(), icon: MapPin },
    { label: "Active", value: mockLocations.filter((l) => l.isActive).length.toString(), icon: Warehouse },
    { label: "Total Items", value: mockLocations.reduce((sum, l) => sum + l.itemCount, 0).toLocaleString(), icon: Package },
  ];

  const handleAddNew = () => {
    setSelectedLocation(null);
    setSheetMode("add");
    setIsSheetOpen(true);
  };

  const handleView = (location: Location) => {
    setSelectedLocation(location);
    setSheetMode("view");
    setIsSheetOpen(true);
  };

  const handleEdit = (location: Location) => {
    setSelectedLocation(location);
    setSheetMode("edit");
    setIsSheetOpen(true);
  };

  const getTypeBadge = (type: Location["type"]) => {
    const colors: Record<Location["type"], string> = {
      warehouse: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      store: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      kitchen: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    };
    return <Badge className={colors[type]}>{type}</Badge>;
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Inventory Locations</h1>
          <p className="text-sm text-muted-foreground">Manage inventory locations for {currentStore?.name}</p>
        </div>
        <Button size="sm" onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Location
        </Button>
      </div>

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
                    <stat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
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
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 h-9 bg-muted/50 border-0"
          />
        </div>
        <Select value={typeFilter} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-full sm:w-[140px] h-9 bg-muted/50 border-0">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="warehouse">Warehouse</SelectItem>
            <SelectItem value="store">Store</SelectItem>
            <SelectItem value="kitchen">Kitchen</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Locations Table */}
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <Card className="border-border/50">
          <CardContent className="p-0">
            {/* Mobile Card View */}
            <div className="block sm:hidden divide-y divide-border">
              {filteredLocations.map((location) => (
                <div
                  key={location.id}
                  className={`p-4 space-y-3 cursor-pointer hover:bg-muted/50 ${!location.isActive ? "opacity-60" : ""}`}
                  onClick={() => handleView(location)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{location.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{location.address}</p>
                    </div>
                    {getTypeBadge(location.type)}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{location.itemCount} items</span>
                    <span className="font-medium">{formatPrice(location.totalValue)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">Name</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">Type</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">Address</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">Manager</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">Items</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">Value</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLocations.map((location) => (
                    <tr
                      key={location.id}
                      className={`border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer ${!location.isActive ? "opacity-60" : ""}`}
                      onClick={() => handleView(location)}
                    >
                      <td className="p-4 font-medium text-sm">{location.name}</td>
                      <td className="p-4">{getTypeBadge(location.type)}</td>
                      <td className="p-4 text-sm text-muted-foreground max-w-[200px] truncate">{location.address}</td>
                      <td className="p-4 text-sm">{location.manager}</td>
                      <td className="p-4 text-sm">{location.itemCount}</td>
                      <td className="p-4 text-sm font-medium">{formatPrice(location.totalValue)}</td>
                      <td className="p-4">
                        <Badge variant={location.isActive ? "default" : "secondary"} className="text-xs">
                          {location.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(location)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(location)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
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
      )}

      {/* Pagination */}
      {!isLoading && totalItems > 0 && (
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
      )}

      {/* Action Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {sheetMode === "add" ? "Add New Location" : sheetMode === "edit" ? "Edit Location" : "Location Details"}
            </SheetTitle>
            <SheetDescription>
              {sheetMode === "add" ? "Create a new inventory location" : sheetMode === "edit" ? "Update location details" : "View location information"}
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-6 py-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Location Name</Label>
                <Input placeholder="e.g., Main Warehouse" defaultValue={selectedLocation?.name} disabled={sheetMode === "view"} />
              </div>

              <div className="space-y-2">
                <Label>Type</Label>
                <Select defaultValue={selectedLocation?.type} disabled={sheetMode === "view"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                    <SelectItem value="store">Store</SelectItem>
                    <SelectItem value="kitchen">Kitchen</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea placeholder="Full address" defaultValue={selectedLocation?.address} disabled={sheetMode === "view"} rows={2} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Manager</Label>
                  <Input placeholder="Manager name" defaultValue={selectedLocation?.manager} disabled={sheetMode === "view"} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input placeholder="+234..." defaultValue={selectedLocation?.phone} disabled={sheetMode === "view"} />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Active</p>
                  <p className="text-xs text-muted-foreground">Location is operational</p>
                </div>
                <Switch defaultChecked={selectedLocation?.isActive ?? true} disabled={sheetMode === "view"} />
              </div>
            </div>

            {sheetMode === "view" && selectedLocation && (
              <Card className="border-border/50">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Items</span>
                    <span className="font-medium">{selectedLocation.itemCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Value</span>
                    <span className="font-medium">{formatPrice(selectedLocation.totalValue)}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {sheetMode !== "view" && (
            <SheetFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsSheetOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsSheetOpen(false)}>
                {sheetMode === "add" ? "Create Location" : "Save Changes"}
              </Button>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
