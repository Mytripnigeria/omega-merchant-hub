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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Search,
  Plus,
  AlertTriangle,
  TrendingDown,
  Package,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Ingredient {
  id: string;
  name: string;
  sku: string;
  unit: string;
  currentStock: number;
  minStock: number;
  costPerUnit: number;
  supplier: string;
  linkedProducts: number;
  lastRestocked: string;
}

const mockIngredients: Ingredient[] = [
  { id: "ing-1", name: "Basmati Rice", sku: "ING-001", unit: "kg", currentStock: 45, minStock: 20, costPerUnit: 2500, supplier: "Lagos Agro Foods", linkedProducts: 5, lastRestocked: "2024-01-10" },
  { id: "ing-2", name: "Tomato Paste", sku: "ING-002", unit: "tin", currentStock: 8, minStock: 15, costPerUnit: 800, supplier: "Gino Foods", linkedProducts: 8, lastRestocked: "2024-01-08" },
  { id: "ing-3", name: "Chicken (Whole)", sku: "ING-003", unit: "kg", currentStock: 25, minStock: 30, costPerUnit: 4500, supplier: "Fresh Farms Nigeria", linkedProducts: 6, lastRestocked: "2024-01-12" },
  { id: "ing-4", name: "Palm Oil", sku: "ING-004", unit: "litre", currentStock: 35, minStock: 10, costPerUnit: 1200, supplier: "Local Supplier", linkedProducts: 12, lastRestocked: "2024-01-05" },
  { id: "ing-5", name: "Suya Spice Mix", sku: "ING-005", unit: "kg", currentStock: 3, minStock: 5, costPerUnit: 3500, supplier: "Spice Masters", linkedProducts: 3, lastRestocked: "2024-01-07" },
];

export default function IngredientsPage() {
  const [ingredients] = useState<Ingredient[]>(mockIngredients);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredIngredients = ingredients.filter((ing) =>
    ing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ing.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockItems = ingredients.filter(i => i.currentStock <= i.minStock);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStockStatus = (current: number, min: number) => {
    if (current <= min * 0.5) return { label: "Critical", class: "bg-red-100 text-red-700" };
    if (current <= min) return { label: "Low", class: "bg-yellow-100 text-yellow-700" };
    return { label: "Good", class: "bg-green-100 text-green-700" };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Ingredients</h1>
          <p className="text-sm text-muted-foreground">Manage raw materials and stock levels</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Ingredient
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Ingredient</DialogTitle>
              <DialogDescription>
                Add a new ingredient to your inventory
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="e.g., Basmati Rice" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" placeholder="e.g., ING-001" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilogram (kg)</SelectItem>
                      <SelectItem value="g">Gram (g)</SelectItem>
                      <SelectItem value="litre">Litre</SelectItem>
                      <SelectItem value="piece">Piece</SelectItem>
                      <SelectItem value="tin">Tin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStock">Min Stock</Label>
                  <Input id="minStock" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost/Unit (₦)</Label>
                  <Input id="cost" type="number" placeholder="0" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button>
                Add Ingredient
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alert Banner */}
      {lowStockItems.length > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <div className="flex-1">
            <p className="font-medium text-yellow-800">Low Stock Alert</p>
            <p className="text-sm text-yellow-700">
              {lowStockItems.length} ingredient(s) need restocking
            </p>
          </div>
          <Button variant="outline" size="sm" className="border-yellow-300 text-yellow-800 hover:bg-yellow-100">
            View All
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-muted-foreground">Total Ingredients</p>
            <p className="text-xl sm:text-2xl font-semibold">{ingredients.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-muted-foreground">Low Stock</p>
            <p className="text-xl sm:text-2xl font-semibold text-yellow-600">{lowStockItems.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-muted-foreground">Total Value</p>
            <p className="text-xl sm:text-2xl font-semibold">
              {formatPrice(ingredients.reduce((acc, i) => acc + (i.currentStock * i.costPerUnit), 0))}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-muted-foreground">Suppliers</p>
            <p className="text-xl sm:text-2xl font-semibold">
              {new Set(ingredients.map(i => i.supplier)).size}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search ingredients..."
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
            {filteredIngredients.map((ingredient) => {
              const status = getStockStatus(ingredient.currentStock, ingredient.minStock);
              return (
                <div key={ingredient.id} className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted shrink-0">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium">{ingredient.name}</p>
                          <p className="text-xs font-mono text-muted-foreground">{ingredient.sku}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Plus className="mr-2 h-4 w-4" />
                              Add Stock
                            </DropdownMenuItem>
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
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{ingredient.currentStock} {ingredient.unit}</span>
                      {ingredient.currentStock <= ingredient.minStock && (
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      )}
                      <Badge variant="secondary" className={cn("font-normal text-xs", status.class)}>
                        {status.label}
                      </Badge>
                    </div>
                    <span className="text-muted-foreground">{formatPrice(ingredient.costPerUnit)}/{ingredient.unit}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{ingredient.supplier}</p>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Ingredient</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cost/Unit</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Linked</TableHead>
                  <TableHead className="pr-6 w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIngredients.map((ingredient) => {
                  const status = getStockStatus(ingredient.currentStock, ingredient.minStock);
                  return (
                    <TableRow key={ingredient.id} className="group cursor-pointer hover:bg-muted/50">
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                            <Package className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <span className="font-medium">{ingredient.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {ingredient.sku}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {ingredient.currentStock}
                          </span>
                          <span className="text-muted-foreground">{ingredient.unit}</span>
                          {ingredient.currentStock <= ingredient.minStock && (
                            <TrendingDown className="h-4 w-4 text-destructive" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={cn("font-normal", status.class)}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatPrice(ingredient.costPerUnit)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {ingredient.supplier}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {ingredient.linkedProducts} products
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
                              <Plus className="mr-2 h-4 w-4" />
                              Add Stock
                            </DropdownMenuItem>
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
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing 1-{filteredIngredients.length} of {ingredients.length} ingredients
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
