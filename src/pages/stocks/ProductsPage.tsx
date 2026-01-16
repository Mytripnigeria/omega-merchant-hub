import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoading } from "@/hooks/use-loading";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, Plus, Filter, Image as ImageIcon, Edit, Trash2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  stock: number;
  status: boolean;
}

const products: Product[] = [
  {
    id: "1",
    name: "Signature Jollof Rice",
    description: "Our famous smoky party jollof rice",
    category: "Mains",
    price: "₦3,500",
    stock: 45,
    status: true,
  },
  {
    id: "2",
    name: "Peppered Chicken",
    description: "Crispy fried chicken with spicy pepper sauce",
    category: "Mains",
    price: "₦2,800",
    stock: 28,
    status: true,
  },
  {
    id: "3",
    name: "Suya Platter",
    description: "Thinly sliced beef skewers with suya spice",
    category: "Specialties",
    price: "₦4,500",
    stock: 0,
    status: false,
  },
  {
    id: "4",
    name: "Egusi Soup Combo",
    description: "Rich melon seed soup with assorted meat",
    category: "Specialties",
    price: "₦5,500",
    stock: 12,
    status: true,
  },
  {
    id: "5",
    name: "Chapman",
    description: "Classic Nigerian cocktail",
    category: "Drinks",
    price: "₦1,500",
    stock: 120,
    status: true,
  },
  {
    id: "6",
    name: "Small Chops Platter",
    description: "Assorted finger foods",
    category: "Starters",
    price: "₦3,500",
    stock: 34,
    status: true,
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

function TableSkeleton() {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="block sm:hidden divide-y divide-border">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-6 w-10" />
              </div>
            </div>
          ))}
        </div>
        <div className="hidden sm:block">
          <div className="p-4 border-b">
            <div className="flex gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-20" />
              ))}
            </div>
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 border-b last:border-0">
              <div className="flex gap-4 items-center">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-6 w-10" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const isLoading = useLoading(1000);

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsViewSheetOpen(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">
            Manage your menu items and inventory
          </p>
        </div>
        <Button size="sm" className="w-full sm:w-auto" onClick={() => setIsAddSheetOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Stats */}
      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Total Products</p>
              <p className="text-xl sm:text-2xl font-semibold">42</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Active</p>
              <p className="text-xl sm:text-2xl font-semibold">38</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Out of Stock</p>
              <p className="text-xl sm:text-2xl font-semibold text-destructive">4</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Categories</p>
              <p className="text-xl sm:text-2xl font-semibold">6</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="mains">Mains</SelectItem>
              <SelectItem value="specialties">Specialties</SelectItem>
              <SelectItem value="starters">Starters</SelectItem>
              <SelectItem value="drinks">Drinks</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Products Table */}
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <Card>
          <CardContent className="p-0">
            {/* Mobile Card View */}
            <div className="block sm:hidden divide-y divide-border">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="p-4 space-y-3 cursor-pointer hover:bg-muted/50"
                  onClick={() => handleViewProduct(product)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted shrink-0">
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-normal">{product.category}</Badge>
                      <span className="font-medium">{product.price}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn("text-sm", product.stock === 0 && "text-destructive")}>
                        Stock: {product.stock}
                      </span>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Switch checked={product.status} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6 w-12">
                      <input type="checkbox" className="rounded border-border" />
                    </TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="pr-6 w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow 
                      key={product.id} 
                      className="group cursor-pointer hover:bg-muted/50"
                      onClick={() => handleViewProduct(product)}
                    >
                      <TableCell className="pl-6" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" className="rounded border-border" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1 max-w-[200px]">{product.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal">{product.category}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{product.price}</TableCell>
                      <TableCell>
                        <span className={cn(product.stock === 0 && "text-destructive")}>
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <Switch checked={product.status} />
                          <span className={cn("text-sm", product.status ? "text-green-600" : "text-muted-foreground")}>
                            {product.status ? "Active" : "Inactive"}
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
                            <DropdownMenuItem onClick={() => handleViewProduct(product)}>
                              <Eye className="mr-2 h-4 w-4" />View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />Delete
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
          Showing 1-6 of 42 products
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

      {/* Add Product Sheet */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add New Product</SheetTitle>
            <SheetDescription>Create a new menu item</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input placeholder="e.g., Jollof Rice" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Describe your product..." rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mains">Mains</SelectItem>
                    <SelectItem value="specialties">Specialties</SelectItem>
                    <SelectItem value="starters">Starters</SelectItem>
                    <SelectItem value="drinks">Drinks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Price (₦)</Label>
                <Input type="number" placeholder="0.00" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Initial Stock</Label>
              <Input type="number" placeholder="0" />
            </div>
            <div className="flex items-center justify-between">
              <Label>Active</Label>
              <Switch defaultChecked />
            </div>
          </div>
          <SheetFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsAddSheetOpen(false)} className="w-full sm:w-auto">Cancel</Button>
            <Button className="w-full sm:w-auto">Create Product</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* View Product Sheet */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedProduct && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-muted">
                    <ImageIcon className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <div>
                    <SheetTitle>{selectedProduct.name}</SheetTitle>
                    <SheetDescription>{selectedProduct.description}</SheetDescription>
                  </div>
                </div>
              </SheetHeader>
              <div className="py-6 space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <Badge variant="secondary">{selectedProduct.category}</Badge>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-sm text-muted-foreground">Price</span>
                  <span className="font-semibold">{selectedProduct.price}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-sm text-muted-foreground">Stock</span>
                  <span className={cn("font-medium", selectedProduct.stock === 0 && "text-destructive")}>
                    {selectedProduct.stock} units
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className={selectedProduct.status ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : ""}>
                    {selectedProduct.status ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <SheetFooter className="flex-col sm:flex-row gap-2">
                <Button variant="outline" className="w-full sm:w-auto">
                  <Edit className="h-4 w-4 mr-2" />Edit
                </Button>
                <Button variant="destructive" className="w-full sm:w-auto">
                  <Trash2 className="h-4 w-4 mr-2" />Delete
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
