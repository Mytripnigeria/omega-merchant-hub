import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoading } from "@/hooks/use-loading";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Layers,
  Tag,
  Search,
  Eye,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ComboProduct {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Combo {
  id: string;
  name: string;
  description: string;
  products: ComboProduct[];
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
      { id: "p1", name: "Jollof Rice", quantity: 4, price: 2500 },
      { id: "p2", name: "Peppered Chicken", quantity: 4, price: 1500 },
      { id: "p3", name: "Plantain", quantity: 2, price: 500 },
      { id: "p4", name: "Chapman", quantity: 4, price: 1200 },
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
      { id: "p5", name: "Suya Platter", quantity: 1, price: 3500 },
      { id: "p6", name: "Fried Rice", quantity: 2, price: 2800 },
      { id: "p7", name: "Chapman", quantity: 2, price: 1200 },
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
      { id: "p8", name: "Jollof Rice", quantity: 1, price: 2500 },
      { id: "p9", name: "Peppered Chicken", quantity: 1, price: 1500 },
      { id: "p10", name: "Drink", quantity: 1, price: 500 },
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
      { id: "p11", name: "Jollof Rice", quantity: 10, price: 2500 },
      { id: "p12", name: "Fried Rice", quantity: 10, price: 2800 },
      { id: "p13", name: "Chicken", quantity: 20, price: 1500 },
      { id: "p14", name: "Plantain", quantity: 5, price: 500 },
    ],
    price: 65000,
    originalPrice: 85000,
    isActive: false,
    sales: 12,
  },
];

const availableProducts = [
  { id: "prod-1", name: "Jollof Rice", price: 2500 },
  { id: "prod-2", name: "Fried Rice", price: 2800 },
  { id: "prod-3", name: "Peppered Chicken", price: 1500 },
  { id: "prod-4", name: "Plantain", price: 500 },
  { id: "prod-5", name: "Chapman", price: 1200 },
  { id: "prod-6", name: "Suya Platter", price: 3500 },
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
  const [searchQuery, setSearchQuery] = useState("");
  const isLoading = useLoading(1000);

  // Sheet states
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState<Combo | null>(null);
  const [comboProducts, setComboProducts] = useState<ComboProduct[]>([]);

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

  const handleViewCombo = (combo: Combo) => {
    setSelectedCombo(combo);
    setIsViewSheetOpen(true);
  };

  const handleEditCombo = (combo: Combo) => {
    setSelectedCombo(combo);
    setComboProducts(combo.products);
    setIsAddSheetOpen(true);
  };

  const handleAddNewCombo = () => {
    setSelectedCombo(null);
    setComboProducts([]);
    setIsAddSheetOpen(true);
  };

  const addProductToCombo = () => {
    setComboProducts([...comboProducts, { id: `temp-${Date.now()}`, name: "", quantity: 1, price: 0 }]);
  };

  const removeProductFromCombo = (index: number) => {
    setComboProducts(comboProducts.filter((_, i) => i !== index));
  };

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
        <Button size="sm" className="w-full sm:w-auto" onClick={handleAddNewCombo}>
          <Plus className="mr-2 h-4 w-4" />
          Create Combo
        </Button>
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
              className="transition-all hover:shadow-md cursor-pointer"
              onClick={() => handleViewCombo(combo)}
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
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewCombo(combo); }}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditCombo(combo); }}>
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
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
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

      {/* Add/Edit Combo Sheet */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedCombo ? "Edit Combo" : "Create Combo Meal"}</SheetTitle>
            <SheetDescription>
              Bundle products together with a special price
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6">
            {/* Item Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Item Details</h3>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input placeholder="e.g., Family Feast" defaultValue={selectedCombo?.name} />
              </div>
              <div className="space-y-2">
                <Label>Price (₦)</Label>
                <Input type="number" placeholder="0" defaultValue={selectedCombo?.price} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="e.g., Perfect for 4 people" defaultValue={selectedCombo?.description} />
              </div>
            </div>

            {/* Combo Products */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Combo Products</h3>
                <Button variant="outline" size="sm" onClick={addProductToCombo}>
                  <Plus className="mr-1 h-4 w-4" />
                  Add Product
                </Button>
              </div>
              {comboProducts.length === 0 ? (
                <div className="p-4 border rounded-lg text-center text-sm text-muted-foreground">
                  No products added yet
                </div>
              ) : (
                <div className="space-y-3">
                  {comboProducts.map((product, index) => (
                    <div key={product.id} className="p-3 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Product {index + 1}</Label>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeProductFromCombo(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <Select defaultValue={product.name}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableProducts.map((p) => (
                            <SelectItem key={p.id} value={p.name}>
                              {p.name} - {formatPrice(p.price)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Quantity</Label>
                          <Input type="number" min="1" defaultValue={product.quantity} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Price (₦)</Label>
                          <Input type="number" defaultValue={product.price} disabled className="bg-muted" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Publish */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Publish</h3>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select defaultValue={selectedCombo?.isActive ? "active" : "inactive"}>
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
            <Button variant="outline" onClick={() => setIsAddSheetOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button className="w-full sm:w-auto">
              {selectedCombo ? "Update Combo" : "Create Combo"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* View Combo Details Sheet */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedCombo?.name}</SheetTitle>
            <SheetDescription>{selectedCombo?.description}</SheetDescription>
          </SheetHeader>
          {selectedCombo && (
            <div className="grid gap-6 py-6">
              {/* Pricing */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Pricing</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Combo Price</p>
                    <p className="text-lg font-bold">{formatPrice(selectedCombo.price)}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Original Price</p>
                    <p className="text-lg font-medium line-through text-muted-foreground">{formatPrice(selectedCombo.originalPrice)}</p>
                  </div>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-xs text-green-600 dark:text-green-400">Customer Saves</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    {formatPrice(selectedCombo.originalPrice - selectedCombo.price)} ({calculateSavings(selectedCombo.originalPrice, selectedCombo.price)}% off)
                  </p>
                </div>
              </div>

              {/* Products Included */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Products Included</h3>
                <div className="space-y-2">
                  {selectedCombo.products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">Quantity: {product.quantity}</p>
                      </div>
                      <p className="font-medium">{formatPrice(product.price * product.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Performance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Total Sales</p>
                    <p className="text-xl font-semibold">{selectedCombo.sales}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Revenue</p>
                    <p className="text-xl font-semibold">{formatPrice(selectedCombo.sales * selectedCombo.price)}</p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm">Status</span>
                <Badge className={selectedCombo.isActive 
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : ""
                }>
                  {selectedCombo.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          )}
          <SheetFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsViewSheetOpen(false)} className="w-full sm:w-auto">
              Close
            </Button>
            <Button onClick={() => { setIsViewSheetOpen(false); handleEditCombo(selectedCombo!); }} className="w-full sm:w-auto">
              Edit Combo
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
