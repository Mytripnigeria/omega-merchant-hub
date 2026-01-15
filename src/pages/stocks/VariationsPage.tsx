import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
  Search,
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
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVariations = variations.filter(v =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Variations</h1>
          <p className="text-sm text-muted-foreground">
            Create variation groups to customize products
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Variation
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
              <Button>
                Create Group
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-muted-foreground">Variation Groups</p>
            <p className="text-xl sm:text-2xl font-semibold">{variations.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-muted-foreground">Total Options</p>
            <p className="text-xl sm:text-2xl font-semibold">
              {variations.reduce((acc, v) => acc + v.options.length, 0)}
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-2 md:col-span-1">
          <CardContent className="p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-muted-foreground">Products Using</p>
            <p className="text-xl sm:text-2xl font-semibold">
              {variations.reduce((acc, v) => acc + v.linkedProducts, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search variations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {/* Mobile Card View */}
          <div className="block sm:hidden divide-y divide-border">
            {filteredVariations.map((variation) => (
              <div key={variation.id} className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted shrink-0">
                    <Settings2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{variation.name}</p>
                        <p className="text-sm text-muted-foreground">{variation.linkedProducts} products</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
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
                </div>
                <div className="flex flex-wrap gap-1">
                  {variation.options.map((option) => (
                    <Badge key={option.id} variant="secondary" className="text-xs">
                      {option.name}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Group Name</TableHead>
                  <TableHead>Options</TableHead>
                  <TableHead>Linked Products</TableHead>
                  <TableHead className="pr-6 w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVariations.map((variation) => (
                  <TableRow key={variation.id} className="group cursor-pointer hover:bg-muted/50">
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <Settings2 className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <span className="font-medium">{variation.name}</span>
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
                    <TableCell className="pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
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
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing 1-{filteredVariations.length} of {variations.length} variations
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
