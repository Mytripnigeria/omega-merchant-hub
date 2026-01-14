import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Settings2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VariationGroup {
  id: string;
  name: string;
  options: { id: string; name: string; }[];
  linkedProducts: number;
}

const mockVariations: VariationGroup[] = [
  {
    id: "var-1",
    name: "Size",
    options: [
      { id: "opt-1", name: "Small" },
      { id: "opt-2", name: "Medium" },
      { id: "opt-3", name: "Large" },
    ],
    linkedProducts: 15,
  },
  {
    id: "var-2",
    name: "Protein Choice",
    options: [
      { id: "opt-4", name: "Chicken" },
      { id: "opt-5", name: "Beef" },
      { id: "opt-6", name: "Fish" },
      { id: "opt-7", name: "Goat" },
    ],
    linkedProducts: 8,
  },
  {
    id: "var-3",
    name: "Spice Level",
    options: [
      { id: "opt-8", name: "Mild" },
      { id: "opt-9", name: "Medium" },
      { id: "opt-10", name: "Hot" },
      { id: "opt-11", name: "Extra Hot" },
    ],
    linkedProducts: 12,
  },
  {
    id: "var-4",
    name: "Swallow Type",
    options: [
      { id: "opt-12", name: "Pounded Yam" },
      { id: "opt-13", name: "Eba" },
      { id: "opt-14", name: "Amala" },
      { id: "opt-15", name: "Semovita" },
    ],
    linkedProducts: 5,
  },
];

export default function VariationsPage() {
  const [variations] = useState<VariationGroup[]>(mockVariations);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Variations</h1>
          <p className="text-muted-foreground">
            Create variation groups to customize products
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" />
              Add Variation Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Variation Group</DialogTitle>
              <DialogDescription>
                Create a new variation group (e.g., Size, Protein Choice)
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Group Name</Label>
                <Input id="name" placeholder="e.g., Size" />
              </div>
              <div className="space-y-2">
                <Label>Options (comma separated)</Label>
                <Input placeholder="e.g., Small, Medium, Large" />
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
          <p className="text-sm text-muted-foreground">Variation Groups</p>
          <p className="text-2xl font-bold text-foreground">{variations.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Options</p>
          <p className="text-2xl font-bold text-foreground">
            {variations.reduce((acc, v) => acc + v.options.length, 0)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Products Using Variations</p>
          <p className="text-2xl font-bold text-foreground">
            {new Set(variations.flatMap(v => v.linkedProducts)).size}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-muted-foreground">Group Name</TableHead>
              <TableHead className="text-muted-foreground">Options</TableHead>
              <TableHead className="text-muted-foreground">Linked Products</TableHead>
              <TableHead className="text-right text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variations.map((variation) => (
              <TableRow key={variation.id} className="group">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Settings2 className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <span className="font-medium text-foreground">{variation.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {variation.options.map((option) => (
                      <Badge key={option.id} variant="secondary" className="text-xs">
                        {option.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {variation.linkedProducts} products
                </TableCell>
                <TableCell className="text-right">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
