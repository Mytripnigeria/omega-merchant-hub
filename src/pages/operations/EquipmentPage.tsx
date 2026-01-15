import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoading } from "@/hooks/use-loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Search, Plus, Wrench, CheckCircle, AlertTriangle, MoreHorizontal, Calendar, 
  Edit, Trash2, Settings, Thermometer, Clock
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Equipment {
  id: number;
  name: string;
  category: string;
  status: "operational" | "maintenance" | "offline";
  lastMaintenance: string;
  nextMaintenance: string;
  location: string;
  temperature?: string;
  uptime?: string;
}

const equipmentList: Equipment[] = [
  { id: 1, name: "Industrial Oven", category: "Cooking", status: "operational", lastMaintenance: "2026-01-10", nextMaintenance: "2026-04-10", location: "Kitchen A", temperature: "180°C", uptime: "99.8%" },
  { id: 2, name: "Walk-in Freezer", category: "Storage", status: "maintenance", lastMaintenance: "2026-01-05", nextMaintenance: "2026-02-05", location: "Back Area", temperature: "-18°C", uptime: "98.5%" },
  { id: 3, name: "Dishwasher", category: "Cleaning", status: "operational", lastMaintenance: "2026-01-15", nextMaintenance: "2026-04-15", location: "Kitchen B", uptime: "99.2%" },
  { id: 4, name: "Espresso Machine", category: "Beverage", status: "operational", lastMaintenance: "2026-01-08", nextMaintenance: "2026-03-08", location: "Bar", temperature: "92°C", uptime: "99.9%" },
  { id: 5, name: "Refrigerator Unit 1", category: "Storage", status: "operational", lastMaintenance: "2026-01-12", nextMaintenance: "2026-04-12", location: "Kitchen A", temperature: "4°C", uptime: "99.7%" },
  { id: 6, name: "Deep Fryer", category: "Cooking", status: "offline", lastMaintenance: "2025-12-20", nextMaintenance: "2026-01-20", location: "Kitchen A", uptime: "95.0%" },
];

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

const EquipmentPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const isLoading = useLoading(1000);

  const stats = [
    { label: "Total Equipment", value: "24", icon: Wrench, color: "text-muted-foreground" },
    { label: "Operational", value: "21", icon: CheckCircle, color: "text-green-600" },
    { label: "Needs Attention", value: "3", icon: AlertTriangle, color: "text-orange-500" },
  ];

  const filteredEquipment = equipmentList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                          item.category.toLowerCase().includes(search.toLowerCase());
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

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Equipment Monitoring</h1>
          <p className="text-sm text-muted-foreground">Track and manage equipment maintenance</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Equipment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Equipment</DialogTitle>
              <DialogDescription>Register a new piece of equipment for monitoring</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
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
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="w-full sm:w-auto">Cancel</Button>
              <Button className="w-full sm:w-auto">Add Equipment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
              <Card key={item.id}>
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
                        <p className="text-xs text-muted-foreground">{item.category} · {item.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {getStatusBadge(item.status)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem><Settings className="mr-2 h-4 w-4" />Configure</DropdownMenuItem>
                          <DropdownMenuItem><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {item.temperature && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Thermometer className="h-3 w-3" />
                        <span>{item.temperature}</span>
                      </div>
                    )}
                    {item.uptime && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Uptime: {item.uptime}</span>
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
                      <tr key={item.id} className="border-b border-border/50 last:border-0 hover:bg-muted/50 group cursor-pointer">
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
                        <td className="p-4 text-sm text-muted-foreground">{item.category}</td>
                        <td className="p-4 text-sm text-muted-foreground">{item.location}</td>
                        <td className="p-4 text-sm text-muted-foreground">{item.lastMaintenance}</td>
                        <td className="p-4 text-sm text-muted-foreground">{item.nextMaintenance}</td>
                        <td className="p-4">{getStatusBadge(item.status)}</td>
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
  );
};

export default EquipmentPage;
