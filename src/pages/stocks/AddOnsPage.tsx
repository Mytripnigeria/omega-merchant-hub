import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  PlusCircle,
  Search,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AddOnGroup {
  id: string;
  name: string;
  addOns: { id: string; name: string; price: number; isAvailable: boolean }[];
  minSelection: number;
  maxSelection: number;
  linkedProducts: number;
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
  },
];

export default function AddOnsPage() {
  const [addOnGroups] = useState<AddOnGroup[]>(mockAddOnGroups);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Add-ons</h1>
          <p className="text-sm text-muted-foreground">
            Create add-on groups for extra items and upgrades
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Add-on Group</DialogTitle>
              <DialogDescription>
                Create a new add-on group (e.g., Extra Sides, Drinks)
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Group Name</Label>
                <Input id="name" placeholder="e.g., Extra Sides" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min">Min Selection</Label>
                  <Input id="min" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max">Max Selection</Label>
                  <Input id="max" type="number" placeholder="3" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button>
                Create Group
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Add-on Groups</p>
            <p className="text-2xl font-semibold">{addOnGroups.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Add-ons</p>
            <p className="text-2xl font-semibold">
              {addOnGroups.reduce((acc, g) => acc + g.addOns.length, 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Available</p>
            <p className="text-2xl font-semibold text-green-600">
              {addOnGroups.reduce((acc, g) => acc + g.addOns.filter(a => a.isAvailable).length, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

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

      {/* Groups - Two column layout on large screens */}
      <div className="grid gap-6 lg:grid-cols-2">
        {filteredGroups.map((group) => (
          <Card key={group.id}>
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <PlusCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{group.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {group.minSelection === 0 ? "Optional" : `Min ${group.minSelection}`} · Max {group.maxSelection} · {group.linkedProducts} products
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="hidden sm:flex">
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
                    <DropdownMenuItem className="sm:hidden">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Add-on
                    </DropdownMenuItem>
                    <DropdownMenuItem>
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
                      <p className="font-medium">{addon.name}</p>
                      <p className="text-sm text-muted-foreground">{formatPrice(addon.price)}</p>
                    </div>
                    <div className="flex items-center gap-3">
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
    </div>
  );
}
