import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoading } from "@/hooks/use-loading";
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
  Layers,
  Tag,
  Search,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Combo {
  id: string;
  name: string;
  description: string;
  products: { name: string; quantity: number }[];
  price: number;
  originalPrice: number;
  isActive: boolean;
  sales: number;
}

const mockCombos: Combo[] = [
  {
    id: "combo-1",
    name: "Family Feast",
    description: "Perfect for 4 people",
    products: [
      { name: "Jollof Rice", quantity: 4 },
      { name: "Peppered Chicken", quantity: 4 },
      { name: "Plantain", quantity: 2 },
      { name: "Chapman", quantity: 4 },
    ],
    price: 18500,
    originalPrice: 24000,
    isActive: true,
    sales: 45,
  },
  {
    id: "combo-2",
    name: "Couple Special",
    description: "Romantic dinner for 2",
    products: [
      { name: "Suya Platter", quantity: 1 },
      { name: "Fried Rice", quantity: 2 },
      { name: "Chapman", quantity: 2 },
    ],
    price: 12000,
    originalPrice: 15500,
    isActive: true,
    sales: 72,
  },
  {
    id: "combo-3",
    name: "Solo Lunch",
    description: "Quick lunch deal",
    products: [
      { name: "Jollof Rice", quantity: 1 },
      { name: "Peppered Chicken", quantity: 1 },
      { name: "Drink", quantity: 1 },
    ],
    price: 4500,
    originalPrice: 5800,
    isActive: true,
    sales: 156,
  },
  {
    id: "combo-4",
    name: "Party Pack",
    description: "For celebrations",
    products: [
      { name: "Jollof Rice", quantity: 10 },
      { name: "Fried Rice", quantity: 10 },
      { name: "Chicken", quantity: 20 },
      { name: "Plantain", quantity: 5 },
    ],
    price: 65000,
    originalPrice: 85000,
    isActive: false,
    sales: 12,
  },
];

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
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

function CombosSkeleton() {
  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Skeleton className="h-14 w-14 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-4 w-36" />
                </div>
              </div>
              <Skeleton className="h-8 w-8" />
            </div>
            <div className="mt-4 border-t pt-4">
              <Skeleton className="h-4 w-16 mb-2" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between border-t mt-4 pt-4">
              <div className="space-y-1">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-6 w-10 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function CombosPage() {
  const [combos] = useState<Combo[]>(mockCombos);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isLoading = useLoading(1000);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateSavings = (original: number, discounted: number) => {
    return Math.round(((original - discounted) / original) * 100);
  };

  const filteredCombos = combos.filter(combo =>
    combo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Combo Meals</h1>
          <p className="text-sm text-muted-foreground">
            Create meal bundles with special pricing
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Create Combo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Combo Meal</DialogTitle>
              <DialogDescription>
                Bundle products together with a special price
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Combo Name</Label>
                  <Input id="name" placeholder="e.g., Family Feast" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Combo Price (₦)</Label>
                  <Input id="price" type="number" placeholder="0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="e.g., Perfect for 4 people" />
              </div>
              <div className="space-y-2">
                <Label>Products in Combo</Label>
                <p className="text-sm text-muted-foreground">Add products to this combo</p>
                <Button variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button className="w-full sm:w-auto">
                Create Combo
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Total Combos</p>
              <p className="text-xl sm:text-2xl font-semibold">{combos.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Active</p>
              <p className="text-xl sm:text-2xl font-semibold text-green-600">{combos.filter(c => c.isActive).length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Total Sales</p>
              <p className="text-xl sm:text-2xl font-semibold">{combos.reduce((acc, c) => acc + c.sales, 0)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Revenue</p>
              <p className="text-xl sm:text-2xl font-semibold truncate">
                {formatPrice(combos.reduce((acc, c) => acc + (c.sales * c.price), 0))}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search */}
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search combos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Combos Grid */}
      {isLoading ? (
        <CombosSkeleton />
      ) : (
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {filteredCombos.map((combo) => (
            <Card
              key={combo.id}
              className="transition-all hover:shadow-md"
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                    <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Layers className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-sm sm:text-base">{combo.name}</h3>
                        <Badge 
                          variant="secondary" 
                          className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs"
                        >
                          <Tag className="mr-1 h-3 w-3" />
                          {calculateSavings(combo.originalPrice, combo.price)}% off
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">{combo.description}</p>
                    </div>
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
                
                <div className="mt-4 border-t pt-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2">INCLUDES</p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {combo.products.map((product, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {product.quantity}x {product.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t mt-4 pt-4">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg sm:text-xl font-bold">{formatPrice(combo.price)}</span>
                      <span className="text-xs sm:text-sm text-muted-foreground line-through">
                        {formatPrice(combo.originalPrice)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{combo.sales} sold</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">
                      {combo.isActive ? "Active" : "Inactive"}
                    </span>
                    <Switch checked={combo.isActive} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
