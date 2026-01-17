import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoading } from "@/hooks/use-loading";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  options: string;
  optionsList: { id: string; name: string; }[];
  linkedProducts: number;
  isActive: boolean;
}

const mockVariations: VariationGroup[] = [
  {
    id: "var-1",
    name: "Size",
    options: "Small, Medium, Large",
    optionsList: [
      { id: "opt-1", name: "Small" },
      { id: "opt-2", name: "Medium" },
      { id: "opt-3", name: "Large" },
    ],
    linkedProducts: 15,
    isActive: true,
  },
  {
    id: "var-2",
    name: "Protein Choice",
    options: "Chicken, Beef, Fish, Goat",
    optionsList: [
      { id: "opt-4", name: "Chicken" },
      { id: "opt-5", name: "Beef" },
      { id: "opt-6", name: "Fish" },
      { id: "opt-7", name: "Goat" },
    ],
    linkedProducts: 8,
    isActive: true,
  },
  {
    id: "var-3",
    name: "Spice Level",
    options: "Mild, Medium, Hot, Extra Hot",
    optionsList: [
      { id: "opt-8", name: "Mild" },
      { id: "opt-9", name: "Medium" },
      { id: "opt-10", name: "Hot" },
      { id: "opt-11", name: "Extra Hot" },
    ],
    linkedProducts: 12,
    isActive: true,
  },
  {
    id: "var-4",
    name: "Swallow Type",
    options: "Pounded Yam, Eba, Amala, Semovita",
    optionsList: [
      { id: "opt-12", name: "Pounded Yam" },
      { id: "opt-13", name: "Eba" },
      { id: "opt-14", name: "Amala" },
      { id: "opt-15", name: "Semovita" },
    ],
    linkedProducts: 5,
    isActive: false,
  },
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

function TableSkeleton() {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="block sm:hidden divide-y divide-border">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {Array.from({ length: 3 }).map((_, j) => (
                  <Skeleton key={j} className="h-5 w-16 rounded-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="hidden sm:block">
          <div className="p-4 border-b">
            <div className="flex gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-24" />
              ))}
            </div>
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 border-b last:border-0">
              <div className="flex gap-4 items-center">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-4 w-24" />
                <div className="flex gap-1">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <Skeleton key={j} className="h-5 w-16 rounded-full" />
                  ))}
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function VariationsPage() {
  const [variations, setVariations] = useState<VariationGroup[]>(mockVariations);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<VariationGroup | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const isLoading = useLoading(1000);

  const filteredVariations = variations.filter(v =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewVariation = (variation: VariationGroup) => {
    setSelectedVariation(variation);
    setIsEditMode(false);
    setIsViewSheetOpen(true);
  };

  const handleEditVariation = (variation: VariationGroup) => {
    setSelectedVariation(variation);
    setIsEditMode(true);
    setIsViewSheetOpen(true);
  };

  const toggleVariation = (variationId: string) => {
    setVariations(variations.map(v => 
      v.id === variationId ? { ...v, isActive: !v.isActive } : v
    ));
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Variations</h1>
          <p className="text-sm text-muted-foreground">
            Create variation groups to customize products
          </p>
        </div>
        <Button size="sm" className="w-full sm:w-auto" onClick={() => setIsAddSheetOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Variation
        </Button>
      </div>

      {/* Stats */}
      {isLoading ? (
        <StatsSkeleton />
      ) : (
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
                {variations.reduce((acc, v) => acc + v.optionsList.length, 0)}
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
      )}

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
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <Card>
          <CardContent className="p-0">
            {/* Mobile Card View */}
            <div className="block sm:hidden divide-y divide-border">
              {filteredVariations.map((variation) => (
                <div 
                  key={variation.id} 
                  className="p-4 space-y-3 cursor-pointer hover:bg-muted/50"
                  onClick={() => handleViewVariation(variation)}
                >
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
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditVariation(variation)}>
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
                    {variation.optionsList.map((option) => (
                      <Badge key={option.id} variant="secondary" className="text-xs">
                        {option.name}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t" onClick={(e) => e.stopPropagation()}>
                    <span className="text-xs text-muted-foreground">
                      {variation.isActive ? "Active" : "Inactive"}
                    </span>
                    <Switch
                      checked={variation.isActive}
                      onCheckedChange={() => toggleVariation(variation.id)}
                    />
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
                    <TableHead>Status</TableHead>
                    <TableHead className="pr-6 w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVariations.map((variation) => (
                    <TableRow 
                      key={variation.id} 
                      className="group cursor-pointer hover:bg-muted/50"
                      onClick={() => handleViewVariation(variation)}
                    >
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
                          {variation.optionsList.map((option) => (
                            <Badge key={option.id} variant="secondary" className="text-xs">
                              {option.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {variation.linkedProducts} products
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={variation.isActive}
                            onCheckedChange={() => toggleVariation(variation.id)}
                          />
                          <span className="text-sm text-muted-foreground">
                            {variation.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="pr-6" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditVariation(variation)}>
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
      )}

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

      {/* Add Variation Sheet */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add Variation Group</SheetTitle>
            <SheetDescription>
              Create a new variation group (e.g., Size, Protein Choice)
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="name">Group Name</Label>
              <Input id="name" placeholder="e.g., Size" />
            </div>
            <div className="space-y-2">
              <Label>Options (comma separated)</Label>
              <Input placeholder="e.g., Small, Medium, Large" />
              <p className="text-xs text-muted-foreground">Separate each option with a comma</p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <Label>Status</Label>
              <Select defaultValue="active">
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsAddSheetOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button className="w-full sm:w-auto">
              Create Group
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* View/Edit Variation Sheet */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedVariation && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
                    <Settings2 className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <div>
                    <SheetTitle>{selectedVariation.name}</SheetTitle>
                    <SheetDescription>{selectedVariation.linkedProducts} products using</SheetDescription>
                  </div>
                </div>
              </SheetHeader>
              <div className="py-6 space-y-4">
                {isEditMode ? (
                  <>
                    <div className="space-y-2">
                      <Label>Group Name</Label>
                      <Input defaultValue={selectedVariation.name} />
                    </div>
                    <div className="space-y-2">
                      <Label>Options (comma separated)</Label>
                      <Input defaultValue={selectedVariation.options} />
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <Label>Status</Label>
                      <Select defaultValue={selectedVariation.isActive ? "active" : "inactive"}>
                        <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Options</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedVariation.optionsList.map((option) => (
                          <Badge key={option.id} variant="secondary" className="text-sm">
                            {option.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="border-t pt-4 space-y-3">
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-muted-foreground">Linked Products</span>
                        <span className="font-medium">{selectedVariation.linkedProducts}</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <Badge variant={selectedVariation.isActive ? "default" : "secondary"}>
                          {selectedVariation.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <SheetFooter className="flex-col sm:flex-row gap-2">
                {isEditMode ? (
                  <>
                    <Button variant="outline" className="w-full sm:w-auto" onClick={() => setIsEditMode(false)}>
                      Cancel
                    </Button>
                    <Button className="w-full sm:w-auto">Save Changes</Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="w-full sm:w-auto" onClick={() => setIsEditMode(true)}>
                      <Edit className="h-4 w-4 mr-2" />Edit
                    </Button>
                    <Button variant="destructive" className="w-full sm:w-auto">
                      <Trash2 className="h-4 w-4 mr-2" />Delete
                    </Button>
                  </>
                )}
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
