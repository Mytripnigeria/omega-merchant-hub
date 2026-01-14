import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Add-ons</h1>
          <p className="text-muted-foreground">
            Create add-on groups for extra items and upgrades
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground">
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
              <Button className="gradient-primary text-primary-foreground">
                Create Group
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Add-on Groups</p>
          <p className="text-2xl font-bold text-foreground">{addOnGroups.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Add-ons</p>
          <p className="text-2xl font-bold text-foreground">
            {addOnGroups.reduce((acc, g) => acc + g.addOns.length, 0)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Available</p>
          <p className="text-2xl font-bold text-success">
            {addOnGroups.reduce((acc, g) => acc + g.addOns.filter(a => a.isAvailable).length, 0)}
          </p>
        </div>
      </div>

      {/* Groups */}
      <div className="space-y-6">
        {addOnGroups.map((group) => (
          <div key={group.id} className="rounded-xl border border-border bg-card shadow-card">
            <div className="flex items-center justify-between border-b border-border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <PlusCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{group.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {group.minSelection === 0 ? "Optional" : `Min ${group.minSelection}`} · Max {group.maxSelection} selections · {group.linkedProducts} products
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Plus className="mr-1 h-4 w-4" />
                  Add Item
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
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
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Add-on</TableHead>
                  <TableHead className="text-muted-foreground">Price</TableHead>
                  <TableHead className="text-muted-foreground">Available</TableHead>
                  <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.addOns.map((addon) => (
                  <TableRow key={addon.id}>
                    <TableCell className="font-medium text-foreground">{addon.name}</TableCell>
                    <TableCell className="text-foreground">{formatPrice(addon.price)}</TableCell>
                    <TableCell>
                      <Switch checked={addon.isAvailable} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}
      </div>
    </div>
  );
}
