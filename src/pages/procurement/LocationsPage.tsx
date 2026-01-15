import { useState } from "react";
import { useStore } from "@/contexts/StoreContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Search, MapPin, Warehouse, Package, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Location {
  id: string;
  name: string;
  type: 'warehouse' | 'store' | 'kitchen';
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

export default function LocationsPage() {
  const { currentStore } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredLocations = mockLocations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         location.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || location.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const stats = [
    { label: "Total Locations", value: mockLocations.length.toString(), icon: MapPin },
    { label: "Active", value: mockLocations.filter(l => l.isActive).length.toString(), icon: Warehouse },
    { label: "Total Items", value: mockLocations.reduce((sum, l) => sum + l.itemCount, 0).toLocaleString(), icon: Package },
  ];

  const getTypeBadge = (type: Location['type']) => {
    const colors: Record<Location['type'], string> = {
      warehouse: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      store: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      kitchen: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
    };
    return <Badge className={colors[type]}>{type}</Badge>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Locations</h1>
          <p className="text-sm text-muted-foreground">Manage inventory locations for {currentStore?.name}</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" />Add Location</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Location</DialogTitle>
              <DialogDescription>Create a new inventory location</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Location Name</Label>
                <Input id="name" placeholder="e.g., Main Warehouse" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                    <SelectItem value="store">Store</SelectItem>
                    <SelectItem value="kitchen">Kitchen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" placeholder="Full address" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="manager">Manager</Label>
                  <Input id="manager" placeholder="Manager name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="+234..." />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="active">Active</Label>
                <Switch id="active" defaultChecked />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>Create Location</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Two-column layout for desktop */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid gap-3 grid-cols-3">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-muted/50 border-0"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
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

          {/* Locations Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredLocations.map((location) => (
              <Card key={location.id} className={`border-border/50 ${!location.isActive ? "opacity-60" : ""}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        {location.name}
                        {!location.isActive && <Badge variant="secondary" className="text-xs">Inactive</Badge>}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground line-clamp-1">{location.address}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                        <DropdownMenuItem><Package className="mr-2 h-4 w-4" />View Inventory</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {getTypeBadge(location.type)}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Manager</p>
                      <p className="font-medium text-sm">{location.manager}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Items</p>
                      <p className="font-medium text-sm">{location.itemCount}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Value</span>
                    <span className="font-semibold">₦{(location.totalValue / 1000).toFixed(0)}K</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Location Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                <div className="flex items-center gap-2">
                  <Warehouse className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Warehouses</span>
                </div>
                <Badge variant="secondary" className="text-xs">1</Badge>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Stores</span>
                </div>
                <Badge variant="secondary" className="text-xs">2</Badge>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">Kitchens</span>
                </div>
                <Badge variant="secondary" className="text-xs">1</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Add New Location
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Package className="mr-2 h-4 w-4" />
                Transfer Stock
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <MapPin className="mr-2 h-4 w-4" />
                View Map
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">₦{(mockLocations.reduce((sum, l) => sum + l.totalValue, 0) / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-muted-foreground mt-1">Across all locations</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
