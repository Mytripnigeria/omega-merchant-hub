import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoading } from "@/hooks/use-loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  PlusCircle,
  Search,
  X,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AddOn {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
}

interface AddOnGroup {
  id: string;
  name: string;
  addOns: AddOn[];
  minSelection: number;
  maxSelection: number;
  linkedProducts: number;
  status: "active" | "inactive";
}

const mockAddOnGroups: AddOnGroup[] = [
  {
    id: "addon-1",
    name: "Extra Protein",
    addOns: [
      { id: "a1", name: "Extra Chicken", price: 800, isAvailable: true },
      { id: "a2", name: "Extra Beef", price: 1000, isAvailable: true },
      { id: "a3", name: "Extra Fish", price: 1200, isAvailable: false },
    ],
    minSelection: 0,
    maxSelection: 3,
    linkedProducts: 10,
    status: "active",
  },
  {
    id: "addon-2",
    name: "Sides",
    addOns: [
      { id: "a4", name: "Plantain", price: 500, isAvailable: true },
      { id: "a5", name: "Coleslaw", price: 400, isAvailable: true },
      { id: "a6", name: "Moi Moi", price: 600, isAvailable: true },
    ],
    minSelection: 0,
    maxSelection: 2,
    linkedProducts: 8,
    status: "active",
  },
  {
    id: "addon-3",
    name: "Drinks",
    addOns: [
      { id: "a7", name: "Coke", price: 500, isAvailable: true },
      { id: "a8", name: "Fanta", price: 500, isAvailable: true },
      { id: "a9", name: "Water", price: 200, isAvailable: true },
      { id: "a10", name: "Chapman", price: 1500, isAvailable: true },
    ],
    minSelection: 0,
    maxSelection: 1,
    linkedProducts: 15,
    status: "active",
  },
];

const mockProducts = [
  { id: "p1", name: "Jollof Rice", price: 2500 },
  { id: "p2", name: "Fried Rice", price: 2800 },
  { id: "p3", name: "Chicken Suya", price: 1500 },
  { id: "p4", name: "Peppered Snail", price: 3500 },
];

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-3 sm:p-4">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-7 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function AddOnsSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
            <Skeleton className="h-8 w-8" />
          </div>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-10 rounded-full" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function AddOnsPage() {
  const [addOnGroups] = useState<AddOnGroup[]>(mockAddOnGroups);
  const [searchQuery, setSearchQuery] = useState("");
  const isLoading = useLoading(1000);

  // Sheet states
  const [isAddGroupSheetOpen, setIsAddGroupSheetOpen] = useState(false);
  const [isAddItemSheetOpen, setIsAddItemSheetOpen] = useState(false);
  const [isViewGroupSheetOpen, setIsViewGroupSheetOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<AddOnGroup | null>(null);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredGroups = addOnGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewGroup = (group: AddOnGroup) => {
    setSelectedGroup(group);
    setIsViewGroupSheetOpen(true);
  };

  const handleEditGroup = (group: AddOnGroup) => {
    setSelectedGroup(group);
    setIsAddGroupSheetOpen(true);
  };

  const handleAddItem = (group: AddOnGroup) => {
    setSelectedGroup(group);
    setIsAddItemSheetOpen(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Add-ons</h1>
          <p className="text-sm text-muted-foreground">
            Create add-on groups for extra items and upgrades
          </p>
        </div>
        <Button size="sm" className="w-full sm:w-auto" onClick={() => { setSelectedGroup(null); setIsAddGroupSheetOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Group
        </Button>
      </div>

      {/* Stats */}
      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Add-on Groups</p>
              <p className="text-xl sm:text-2xl font-semibold">{addOnGroups.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Total Add-ons</p>
              <p className="text-xl sm:text-2xl font-semibold">
                {addOnGroups.reduce((acc, g) => acc + g.addOns.length, 0)}
              </p>
            </CardContent>
          </Card>
          <Card className="col-span-2 md:col-span-1">
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Available</p>
              <p className="text-xl sm:text-2xl font-semibold text-green-600">
                {addOnGroups.reduce((acc, g) => acc + g.addOns.filter(a => a.isAvailable).length, 0)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search */}
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search add-on groups..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Groups */}
      {isLoading ? (
        <AddOnsSkeleton />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredGroups.map((group) => (
            <Card key={group.id}>
              <div className="flex items-center justify-between border-b p-4">
                <div 
                  className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                  onClick={() => handleViewGroup(group)}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <PlusCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base truncate">{group.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {group.minSelection === 0 ? "Optional" : `Min ${group.minSelection}`} · Max {group.maxSelection} · {group.linkedProducts} products
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="sm" className="hidden sm:flex" onClick={() => handleAddItem(group)}>
                    <Plus className="mr-1 h-4 w-4" />
                    Add
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewGroup(group)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="sm:hidden" onClick={() => handleAddItem(group)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Add-on
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditGroup(group)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Group
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Group
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <CardContent className="p-0">
                {/* Mobile List View */}
                <div className="block sm:hidden divide-y divide-border">
                  {group.addOns.map((addon) => (
                    <div key={addon.id} className="p-4 flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{addon.name}</p>
                        <p className="text-xs text-muted-foreground">{formatPrice(addon.price)}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <Switch checked={addon.isAvailable} />
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
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="pl-6">Add-on</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Available</TableHead>
                        <TableHead className="pr-6 w-20">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.addOns.map((addon) => (
                        <TableRow key={addon.id} className="group">
                          <TableCell className="pl-6 font-medium">{addon.name}</TableCell>
                          <TableCell>{formatPrice(addon.price)}</TableCell>
                          <TableCell>
                            <Switch checked={addon.isAvailable} />
                          </TableCell>
                          <TableCell className="pr-6">
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Group Sheet */}
      <Sheet open={isAddGroupSheetOpen} onOpenChange={setIsAddGroupSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedGroup ? "Edit Add-on Group" : "Add Add-on Group"}</SheetTitle>
            <SheetDescription>
              {selectedGroup ? "Update group details" : "Create a new add-on group (e.g., Extra Sides, Drinks)"}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6">
            {/* Group Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Group Details</h3>
              <div className="space-y-2">
                <Label htmlFor="name">Group Name</Label>
                <Input id="name" placeholder="e.g., Extra Sides" defaultValue={selectedGroup?.name} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min">Minimum Selection</Label>
                  <Input id="min" type="number" placeholder="0" defaultValue={selectedGroup?.minSelection || 0} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max">Maximum Selection</Label>
                  <Input id="max" type="number" placeholder="3" defaultValue={selectedGroup?.maxSelection || 3} />
                </div>
              </div>
            </div>

            {/* Publish */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Publish</h3>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select defaultValue={selectedGroup?.status || "active"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <SheetFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsAddGroupSheetOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button className="w-full sm:w-auto">
              {selectedGroup ? "Update Group" : "Create Group"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Add Item to Group Sheet */}
      <Sheet open={isAddItemSheetOpen} onOpenChange={setIsAddItemSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add Item to {selectedGroup?.name}</SheetTitle>
            <SheetDescription>
              Add a new item to this add-on group
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6">
            {/* Item Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Item Details</h3>
              <div className="space-y-2">
                <Label>Select from Products</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProducts.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} - {formatPrice(product.price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Or Enter Custom Name</Label>
                <Input placeholder="e.g., Extra Cheese" />
              </div>
              <div className="space-y-2">
                <Label>Selling Price</Label>
                <Input type="number" placeholder="0" />
              </div>
            </div>
          </div>
          <SheetFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsAddItemSheetOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button className="w-full sm:w-auto">Add Item</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* View Group Details Sheet */}
      <Sheet open={isViewGroupSheetOpen} onOpenChange={setIsViewGroupSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedGroup?.name}</SheetTitle>
            <SheetDescription>Add-on group details and items</SheetDescription>
          </SheetHeader>
          {selectedGroup && (
            <div className="grid gap-6 py-6">
              {/* Group Info */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Group Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Min Selection</p>
                    <p className="font-medium">{selectedGroup.minSelection}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Max Selection</p>
                    <p className="font-medium">{selectedGroup.maxSelection}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm">Linked Products</span>
                  <Badge variant="secondary">{selectedGroup.linkedProducts}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm">Status</span>
                  <Badge className={selectedGroup.status === "active" 
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : ""
                  }>
                    {selectedGroup.status}
                  </Badge>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">Items ({selectedGroup.addOns.length})</h3>
                  <Button variant="outline" size="sm" onClick={() => { setIsViewGroupSheetOpen(false); handleAddItem(selectedGroup); }}>
                    <Plus className="mr-1 h-4 w-4" />
                    Add Item
                  </Button>
                </div>
                <div className="space-y-2">
                  {selectedGroup.addOns.map((addon) => (
                    <div key={addon.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{addon.name}</p>
                        <p className="text-xs text-muted-foreground">{formatPrice(addon.price)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={addon.isAvailable ? "default" : "secondary"}>
                          {addon.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <SheetFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsViewGroupSheetOpen(false)} className="w-full sm:w-auto">
              Close
            </Button>
            <Button onClick={() => { setIsViewGroupSheetOpen(false); handleEditGroup(selectedGroup!); }} className="w-full sm:w-auto">
              Edit Group
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
