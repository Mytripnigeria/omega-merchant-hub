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
  {
    id: "ing-1",
    name: "Basmati Rice",
    sku: "ING-001",
    unit: "kg",
    currentStock: 45,
    minStock: 20,
    costPerUnit: 2500,
    supplier: "Lagos Agro Foods",
    linkedProducts: 5,
    lastRestocked: "2024-01-10",
  },
  {
    id: "ing-2",
    name: "Tomato Paste",
    sku: "ING-002",
    unit: "tin",
    currentStock: 8,
    minStock: 15,
    costPerUnit: 800,
    supplier: "Gino Foods",
    linkedProducts: 8,
    lastRestocked: "2024-01-08",
  },
  {
    id: "ing-3",
    name: "Chicken (Whole)",
    sku: "ING-003",
    unit: "kg",
    currentStock: 25,
    minStock: 30,
    costPerUnit: 4500,
    supplier: "Fresh Farms Nigeria",
    linkedProducts: 6,
    lastRestocked: "2024-01-12",
  },
  {
    id: "ing-4",
    name: "Palm Oil",
    sku: "ING-004",
    unit: "litre",
    currentStock: 35,
    minStock: 10,
    costPerUnit: 1200,
    supplier: "Local Supplier",
    linkedProducts: 12,
    lastRestocked: "2024-01-05",
  },
  {
    id: "ing-5",
    name: "Suya Spice Mix",
    sku: "ING-005",
    unit: "kg",
    currentStock: 3,
    minStock: 5,
    costPerUnit: 3500,
    supplier: "Spice Masters",
    linkedProducts: 3,
    lastRestocked: "2024-01-07",
  },
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
    if (current <= min * 0.5) return { label: "Critical", class: "bg-destructive/10 text-destructive" };
    if (current <= min) return { label: "Low", class: "bg-warning/10 text-warning" };
    return { label: "Good", class: "bg-success/10 text-success" };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Ingredients</h1>
          <p className="text-muted-foreground">Manage raw materials and stock levels</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground">
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
              <Button className="gradient-primary text-primary-foreground">
                Add Ingredient
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alert Banner */}
      {lowStockItems.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-warning/20 bg-warning/10 p-4">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <div>
            <p className="font-medium text-warning">Low Stock Alert</p>
            <p className="text-sm text-muted-foreground">
              {lowStockItems.length} ingredient(s) need restocking
            </p>
          </div>
          <Button variant="outline" size="sm" className="ml-auto border-warning/20 text-warning hover:bg-warning/10">
            View All
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Ingredients</p>
          <p className="text-2xl font-bold text-foreground">{ingredients.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Low Stock</p>
          <p className="text-2xl font-bold text-warning">{lowStockItems.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Value</p>
          <p className="text-2xl font-bold text-foreground">
            {formatPrice(ingredients.reduce((acc, i) => acc + (i.currentStock * i.costPerUnit), 0))}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Suppliers</p>
          <p className="text-2xl font-bold text-foreground">
            {new Set(ingredients.map(i => i.supplier)).size}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search ingredients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-muted"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-muted-foreground">Ingredient</TableHead>
              <TableHead className="text-muted-foreground">SKU</TableHead>
              <TableHead className="text-muted-foreground">Stock</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Cost/Unit</TableHead>
              <TableHead className="text-muted-foreground">Supplier</TableHead>
              <TableHead className="text-muted-foreground">Linked</TableHead>
              <TableHead className="text-right text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredIngredients.map((ingredient) => {
              const status = getStockStatus(ingredient.currentStock, ingredient.minStock);
              return (
                <TableRow key={ingredient.id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <span className="font-medium text-foreground">{ingredient.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {ingredient.sku}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {ingredient.currentStock}
                      </span>
                      <span className="text-muted-foreground">{ingredient.unit}</span>
                      {ingredient.currentStock <= ingredient.minStock && (
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("border-0", status.class)}>
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-foreground">
                    {formatPrice(ingredient.costPerUnit)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {ingredient.supplier}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {ingredient.linkedProducts} products
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
    </div>
  );
}
