import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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

export default function CombosPage() {
  const [combos] = useState<Combo[]>(mockCombos);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Combo Meals</h1>
          <p className="text-muted-foreground">
            Create meal bundles with special pricing
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground">
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
              <div className="grid grid-cols-2 gap-4">
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
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="gradient-primary text-primary-foreground">
                Create Combo
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Combos</p>
          <p className="text-2xl font-bold text-foreground">{combos.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-bold text-success">{combos.filter(c => c.isActive).length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Sales</p>
          <p className="text-2xl font-bold text-foreground">{combos.reduce((acc, c) => acc + c.sales, 0)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Revenue</p>
          <p className="text-2xl font-bold text-foreground">
            {formatPrice(combos.reduce((acc, c) => acc + (c.sales * c.price), 0))}
          </p>
        </div>
      </div>

      {/* Combos Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {combos.map((combo) => (
          <div
            key={combo.id}
            className="rounded-xl border border-border bg-card shadow-card transition-all hover:shadow-elevated"
          >
            <div className="flex items-start justify-between p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Layers className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{combo.name}</h3>
                    <Badge 
                      variant="outline" 
                      className="bg-success/10 text-success border-success/20"
                    >
                      <Tag className="mr-1 h-3 w-3" />
                      {calculateSavings(combo.originalPrice, combo.price)}% off
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{combo.description}</p>
                </div>
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
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="border-t border-border px-6 py-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">INCLUDES</p>
              <div className="flex flex-wrap gap-2">
                {combo.products.map((product, idx) => (
                  <Badge key={idx} variant="secondary">
                    {product.quantity}x {product.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border px-6 py-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-foreground">{formatPrice(combo.price)}</span>
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(combo.originalPrice)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{combo.sales} sold</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {combo.isActive ? "Active" : "Inactive"}
                </span>
                <Switch checked={combo.isActive} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
