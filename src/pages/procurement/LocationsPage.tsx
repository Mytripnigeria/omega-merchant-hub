import { useState } from "react";
import { useStore } from "@/contexts/StoreContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  createdAt: string;
}

const mockLocations: Location[] = [
  {
    id: "loc-1",
    name: "Main Warehouse",
    type: "warehouse",
    address: "45 Industrial Road, Ikeja, Lagos",
    manager: "John Adeyemi",
    phone: "+234 812 345 6789",
    itemCount: 245,
    totalValue: 2450000,
    isActive: true,
    createdAt: "2024-01-15"
  },
  {
    id: "loc-2",
    name: "Lekki Store",
    type: "store",
    address: "15 Admiralty Way, Lekki Phase 1, Lagos",
    manager: "Sarah Okonkwo",
    phone: "+234 812 345 6790",
    itemCount: 120,
    totalValue: 850000,
    isActive: true,
    createdAt: "2024-02-20"
  },
  {
    id: "loc-3",
    name: "VI Kitchen",
    type: "kitchen",
    address: "25 Adeola Odeku Street, VI, Lagos",
    manager: "Michael Eze",
    phone: "+234 812 345 6791",
    itemCount: 85,
    totalValue: 420000,
    isActive: true,
    createdAt: "2024-03-10"
  },
  {
    id: "loc-4",
    name: "Ikeja Mall Store",
    type: "store",
    address: "Shop 45, Ikeja City Mall, Lagos",
    manager: "Grace Nwosu",
    phone: "+234 812 345 6792",
    itemCount: 95,
    totalValue: 680000,
    isActive: false,
    createdAt: "2024-04-05"
  }
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

  const totalLocations = mockLocations.length;
  const activeLocations = mockLocations.filter(l => l.isActive).length;
  const totalItems = mockLocations.reduce((sum, l) => sum + l.itemCount, 0);
  const totalValue = mockLocations.reduce((sum, l) => sum + l.totalValue, 0);

  const getTypeIcon = (type: Location['type']) => {
    switch (type) {
      case 'warehouse': return <Warehouse className="h-4 w-4" />;
      case 'store': return <MapPin className="h-4 w-4" />;
      case 'kitchen': return <Package className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: Location['type']) => {
    const variants: Record<Location['type'], string> = {
      warehouse: "bg-blue-500/10 text-blue-500",
      store: "bg-green-500/10 text-green-500",
      kitchen: "bg-orange-500/10 text-orange-500"
    };
    return (
      <Badge className={variants[type]}>
        {getTypeIcon(type)}
        <span className="ml-1 capitalize">{type}</span>
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Locations</h1>
          <p className="text-muted-foreground">
            Manage inventory locations for {currentStore?.name}
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Location</DialogTitle>
              <DialogDescription>
                Create a new inventory location
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Location Name</Label>
                <Input id="name" placeholder="e.g., Main Warehouse" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select>
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
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                Create Location
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLocations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Locations</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLocations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <span className="text-muted-foreground text-sm">₦</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(totalValue / 1000000).toFixed(1)}M</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredLocations.map((location) => (
          <Card key={location.id} className={!location.isActive ? "opacity-60" : ""}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    {location.name}
                    {!location.isActive && (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{location.address}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Package className="mr-2 h-4 w-4" />
                      View Inventory
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                {getTypeBadge(location.type)}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Manager</p>
                  <p className="font-medium">{location.manager}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{location.phone}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold">{location.itemCount}</p>
                  <p className="text-xs text-muted-foreground">Items</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">₦{(location.totalValue / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-muted-foreground">Value</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLocations.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No locations found</h3>
            <p className="text-muted-foreground text-center mt-1">
              {searchQuery || typeFilter !== "all"
                ? "Try adjusting your filters"
                : "Add your first inventory location"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
