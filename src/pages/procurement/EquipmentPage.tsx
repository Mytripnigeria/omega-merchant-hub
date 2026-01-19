import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoading } from "@/hooks/use-loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Search, Plus, Wrench, CheckCircle, AlertTriangle, MoreHorizontal, Calendar, 
  Edit, Trash2, Settings, Thermometer, Clock, X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Equipment as APIEquipment } from "@/types/procurement";

// UI-specific interface extending API type with computed display fields
interface EquipmentUI extends Omit<APIEquipment, 'id'> {
  id: string;
  location: string;
  displayTemperature?: string;
  displayUptime?: string;
  lastMaintenance: string;
  nextMaintenance: string;
  displayCategory: string;
}

// Transform API equipment to UI format
const transformEquipment = (equipment: APIEquipment): EquipmentUI => ({
  ...equipment,
  location: equipment.locationName || "Unknown",
  displayTemperature: equipment.currentTemperature !== undefined ? `${equipment.currentTemperature}°C` : undefined,
  displayUptime: equipment.uptime !== undefined ? `${equipment.uptime}%` : undefined,
  lastMaintenance: equipment.lastMaintenanceDate || "N/A",
  nextMaintenance: equipment.nextMaintenanceDate || "N/A",
  displayCategory: equipment.category.charAt(0).toUpperCase() + equipment.category.slice(1),
});

// Mock data using API types
const mockEquipmentList: APIEquipment[] = [
  { id: "eq-1", storeId: "store-1", locationId: "loc-1", locationName: "Kitchen A", name: "Industrial Oven", category: "kitchen", status: "operational", lastMaintenanceDate: "2026-01-10", nextMaintenanceDate: "2026-04-10", currentTemperature: 180, uptime: 99.8, createdAt: "2025-01-01", updatedAt: "2026-01-10" },
  { id: "eq-2", storeId: "store-1", locationId: "loc-2", locationName: "Back Area", name: "Walk-in Freezer", category: "refrigeration", status: "maintenance", lastMaintenanceDate: "2026-01-05", nextMaintenanceDate: "2026-02-05", currentTemperature: -18, uptime: 98.5, createdAt: "2025-01-01", updatedAt: "2026-01-05" },
  { id: "eq-3", storeId: "store-1", locationId: "loc-3", locationName: "Kitchen B", name: "Dishwasher", category: "kitchen", status: "operational", lastMaintenanceDate: "2026-01-15", nextMaintenanceDate: "2026-04-15", uptime: 99.2, createdAt: "2025-01-01", updatedAt: "2026-01-15" },
  { id: "eq-4", storeId: "store-1", locationId: "loc-4", locationName: "Bar", name: "Espresso Machine", category: "kitchen", status: "operational", lastMaintenanceDate: "2026-01-08", nextMaintenanceDate: "2026-03-08", currentTemperature: 92, uptime: 99.9, createdAt: "2025-01-01", updatedAt: "2026-01-08" },
  { id: "eq-5", storeId: "store-1", locationId: "loc-1", locationName: "Kitchen A", name: "Refrigerator Unit 1", category: "refrigeration", status: "operational", lastMaintenanceDate: "2026-01-12", nextMaintenanceDate: "2026-04-12", currentTemperature: 4, uptime: 99.7, createdAt: "2025-01-01", updatedAt: "2026-01-12" },
  { id: "eq-6", storeId: "store-1", locationId: "loc-1", locationName: "Kitchen A", name: "Deep Fryer", category: "kitchen", status: "offline", lastMaintenanceDate: "2025-12-20", nextMaintenanceDate: "2026-01-20", uptime: 95.0, createdAt: "2025-01-01", updatedAt: "2025-12-20" },
];

const equipmentList: EquipmentUI[] = mockEquipmentList.map(transformEquipment);

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-7 w-12" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EquipmentSkeleton() {
  return (
    <>
      {/* Mobile skeleton */}
      <div className="block sm:hidden space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop skeleton */}
      <Card className="hidden sm:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <th key={i} className="p-4"><Skeleton className="h-3 w-20" /></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="p-4"><Skeleton className="h-4 w-28" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-24" /></td>
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

export default function EquipmentPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentUI | null>(null);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
  const isLoading = useLoading(1000);

  const stats = [
    { label: "Total Equipment", value: "24", icon: Wrench, color: "text-muted-foreground" },
    { label: "Operational", value: "21", icon: CheckCircle, color: "text-green-600" },
    { label: "Needs Attention", value: "3", icon: AlertTriangle, color: "text-orange-500" },
  ];

  const filteredEquipment = equipmentList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                          item.displayCategory.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Operational</Badge>;
      case "maintenance":
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Maintenance</Badge>;
      case "offline":
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Offline</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleViewEquipment = (equipment: EquipmentUI) => {
    setSelectedEquipment(equipment);
    setIsViewSheetOpen(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Equipment Monitoring</h1>
          <p className="text-sm text-muted-foreground">Track and manage equipment maintenance</p>
        </div>
        <Button size="sm" className="w-full sm:w-auto" onClick={() => setIsAddSheetOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Equipment
        </Button>
      </div>

      {/* Stats */}
      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                    <p className={`text-xl sm:text-2xl font-semibold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
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
            placeholder="Search equipment..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="pl-9" 
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="operational">Operational</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Equipment List */}
      {isLoading ? (
        <EquipmentSkeleton />
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="block sm:hidden space-y-3">
            {filteredEquipment.map((item) => (
              <Card key={item.id} className="cursor-pointer" onClick={() => handleViewEquipment(item)}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`h-10 w-10 shrink-0 rounded-lg flex items-center justify-center ${
                        item.status === "operational" ? "bg-green-100 dark:bg-green-900/30" :
                        item.status === "maintenance" ? "bg-yellow-100 dark:bg-yellow-900/30" :
                        "bg-red-100 dark:bg-red-900/30"
                      }`}>
                        <Wrench className={`h-5 w-5 ${
                          item.status === "operational" ? "text-green-600" :
                          item.status === "maintenance" ? "text-yellow-600" :
                          "text-red-600"
                        }`} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.displayCategory} · {item.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {getStatusBadge(item.status)}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {item.displayTemperature && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Thermometer className="h-3 w-3" />
                        <span>{item.displayTemperature}</span>
                      </div>
                    )}
                    {item.displayUptime && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Uptime: {item.displayUptime}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Last: {item.lastMaintenance}</span>
                    </div>
                    <span>Next: {item.nextMaintenance}</span>
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
                      <th className="text-left text-xs font-medium text-muted-foreground p-4 pl-6">Equipment</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Category</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Location</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Last Maintenance</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Next Due</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4 pr-6 w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEquipment.map((item) => (
                      <tr 
                        key={item.id} 
                        className="border-b border-border/50 last:border-0 hover:bg-muted/50 group cursor-pointer"
                        onClick={() => handleViewEquipment(item)}
                      >
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                              item.status === "operational" ? "bg-green-100 dark:bg-green-900/30" :
                              item.status === "maintenance" ? "bg-yellow-100 dark:bg-yellow-900/30" :
                              "bg-red-100 dark:bg-red-900/30"
                            }`}>
                              <Wrench className={`h-4 w-4 ${
                                item.status === "operational" ? "text-green-600" :
                                item.status === "maintenance" ? "text-yellow-600" :
                                "text-red-600"
                              }`} />
                            </div>
                            <span className="font-medium text-sm">{item.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{item.displayCategory}</td>
                        <td className="p-4 text-sm text-muted-foreground">{item.location}</td>
                        <td className="p-4 text-sm text-muted-foreground">{item.lastMaintenance}</td>
                        <td className="p-4 text-sm text-muted-foreground">{item.nextMaintenance}</td>
                        <td className="p-4">{getStatusBadge(item.status)}</td>
                        <td className="p-4 pr-6" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewEquipment(item)}>
                                <Settings className="mr-2 h-4 w-4" />View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Remove</DropdownMenuItem>
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
        </>
      )}

      {/* Add Equipment Sheet */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add New Equipment</SheetTitle>
            <SheetDescription>Register a new piece of equipment for monitoring</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label>Equipment Name</Label>
              <Input placeholder="e.g., Industrial Oven" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cooking">Cooking</SelectItem>
                    <SelectItem value="storage">Storage</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    <SelectItem value="beverage">Beverage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input placeholder="e.g., Kitchen A" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Last Maintenance Date</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Next Maintenance Date</Label>
              <Input type="date" />
            </div>
          </div>
          <SheetFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsAddSheetOpen(false)} className="w-full sm:w-auto">Cancel</Button>
            <Button className="w-full sm:w-auto">Add Equipment</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* View Equipment Sheet */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedEquipment && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                    selectedEquipment.status === "operational" ? "bg-green-100 dark:bg-green-900/30" :
                    selectedEquipment.status === "maintenance" ? "bg-yellow-100 dark:bg-yellow-900/30" :
                    "bg-red-100 dark:bg-red-900/30"
                  }`}>
                    <Wrench className={`h-6 w-6 ${
                      selectedEquipment.status === "operational" ? "text-green-600" :
                      selectedEquipment.status === "maintenance" ? "text-yellow-600" :
                      "text-red-600"
                    }`} />
                  </div>
                  <div>
                    <SheetTitle>{selectedEquipment.name}</SheetTitle>
                    <SheetDescription>{selectedEquipment.displayCategory} · {selectedEquipment.location}</SheetDescription>
                  </div>
                </div>
              </SheetHeader>
              <div className="py-6 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  {getStatusBadge(selectedEquipment.status)}
                </div>
                {selectedEquipment.displayTemperature && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Temperature</span>
                    <span className="font-medium">{selectedEquipment.displayTemperature}</span>
                  </div>
                )}
                {selectedEquipment.displayUptime && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Uptime</span>
                    <span className="font-medium">{selectedEquipment.displayUptime}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Maintenance</span>
                  <span className="font-medium">{selectedEquipment.lastMaintenance}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Next Maintenance</span>
                  <span className="font-medium">{selectedEquipment.nextMaintenance}</span>
                </div>
              </div>
              <SheetFooter className="flex-col sm:flex-row gap-2">
                <Button variant="outline" className="w-full sm:w-auto">
                  <Edit className="h-4 w-4 mr-2" />Edit
                </Button>
                <Button variant="destructive" className="w-full sm:w-auto">
                  <Trash2 className="h-4 w-4 mr-2" />Remove
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
