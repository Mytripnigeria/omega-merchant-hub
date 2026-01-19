import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { useTableControls } from "@/hooks/use-table-controls";
import { useProducts, useProductStats, useCategories, useToggleProductStatus } from "@/hooks/api";
import { ErrorState } from "@/components/ui/data-states";
import { useStore } from "@/contexts/StoreContext";
import type { Product } from "@/types/products";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SortableHeader } from "@/components/ui/sortable-header";
import { TablePagination } from "@/components/ui/table-pagination";
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
import { Search, MoreHorizontal, Plus, Filter, Image as ImageIcon, Edit, Trash2, Eye, X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

// Using Product type from @/types/products

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

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const { currentStore } = useStore();

  // Fetch products from API
  const { data: products = [], isLoading, error, refetch } = useProducts({ storeId: currentStore?.id });
  const { data: stats } = useProductStats(currentStore?.id);
  const toggleStatus = useToggleProductStatus();

  // Use table controls hook - must be called before any early returns
  const {
    data: paginatedProducts,
    currentPage,
    totalPages,
    totalItems,
    sortConfig,
    handleSort,
    goToPage,
    setPageSize,
    pageSize,
    startIndex,
    endIndex,
  } = useTableControls<Product>({ data: products, initialPageSize: 10 });

  // Error state - after all hooks
  if (error) {
    return (
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">Manage your menu items and inventory</p>
        </div>
        <ErrorState onRetry={refetch} description={error.message} />
      </div>
    );
  }

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditMode(false);
    setIsViewSheetOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditMode(true);
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
                      <span className="font-medium">{formatPrice(product.sellingPrice)}</span>
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
                    <TableHead>
                      <SortableHeader label="Product" field="name" currentSortField={sortConfig.field as string | null} currentSortDirection={sortConfig.direction} onSort={handleSort as (field: string) => void} />
                    </TableHead>
                    <TableHead>
                      <SortableHeader label="Category" field="category" currentSortField={sortConfig.field as string | null} currentSortDirection={sortConfig.direction} onSort={handleSort as (field: string) => void} />
                    </TableHead>
                    <TableHead>
                      <SortableHeader label="Price" field="sellingPrice" currentSortField={sortConfig.field as string | null} currentSortDirection={sortConfig.direction} onSort={handleSort as (field: string) => void} />
                    </TableHead>
                    <TableHead>
                      <SortableHeader label="Stock" field="stock" currentSortField={sortConfig.field as string | null} currentSortDirection={sortConfig.direction} onSort={handleSort as (field: string) => void} />
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="pr-6 w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProducts.map((product) => (
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
                      <TableCell className="font-medium">{formatPrice(product.sellingPrice)}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleEditProduct(product)}>
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
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        startIndex={startIndex}
        endIndex={endIndex}
        pageSize={pageSize}
        onPageChange={goToPage}
        onPageSizeChange={setPageSize}
      />

      {/* Add Product Sheet */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add New Product</SheetTitle>
            <SheetDescription>Create a new menu item with full details</SheetDescription>
          </SheetHeader>
          <Tabs defaultValue="details" className="mt-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="variations">Variants</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Product Name</Label>
                <Input placeholder="e.g., Jollof Rice" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Describe your product..." rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Product Code</Label>
                <Input placeholder="e.g., PRD-001" />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mains">Mains</SelectItem>
                    <SelectItem value="specialties">Specialties</SelectItem>
                    <SelectItem value="starters">Starters</SelectItem>
                    <SelectItem value="drinks">Drinks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Images</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Supplier</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fresh-farms">Fresh Farms Ltd</SelectItem>
                    <SelectItem value="quality-meats">Quality Meats</SelectItem>
                    <SelectItem value="metro">Metro Beverages</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            <TabsContent value="pricing" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>SKU</Label>
                <Input placeholder="e.g., JOL-001" />
              </div>
              <div className="space-y-2">
                <Label>Costing Option</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Price</SelectItem>
                    <SelectItem value="ingredient">Ingredient Based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cost Price (₦)</Label>
                  <Input type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label>Selling Price (₦)</Label>
                  <Input type="number" placeholder="0" />
                </div>
              </div>
              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <Label>Ingredients (Link to Stock)</Label>
                  <Button variant="outline" size="sm"><Plus className="h-4 w-4 mr-1" />Add</Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 border rounded-lg">
                    <Select>
                      <SelectTrigger className="flex-1"><SelectValue placeholder="Select ingredient" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rice">Basmati Rice</SelectItem>
                        <SelectItem value="tomato">Tomato Paste</SelectItem>
                        <SelectItem value="chicken">Chicken</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input type="number" placeholder="Qty" className="w-20" />
                    <span className="text-sm text-muted-foreground">kg</span>
                    <Button variant="ghost" size="icon" className="shrink-0"><X className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="variations" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Variations</Label>
                  <Button variant="outline" size="sm"><Plus className="h-4 w-4 mr-1" />Add Variation</Button>
                </div>
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="space-y-2">
                    <Label>Variation Option</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select (e.g., Small)" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>SKU</Label>
                      <Input placeholder="SKU" />
                    </div>
                    <div className="space-y-2">
                      <Label>Price (₦)</Label>
                      <Input type="number" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label>Selling (₦)</Label>
                      <Input type="number" placeholder="0" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <Label>Add-ons</Label>
                  <Button variant="outline" size="sm"><Plus className="h-4 w-4 mr-1" />Add</Button>
                </div>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select add-on group" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="protein">Extra Protein</SelectItem>
                    <SelectItem value="sides">Sides</SelectItem>
                    <SelectItem value="drinks">Drinks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            <TabsContent value="settings" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Prep Time (minutes)</Label>
                <Input type="number" placeholder="e.g., 25" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tax Option</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard VAT</SelectItem>
                      <SelectItem value="none">No Tax</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Discount Option</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="welcome20">WELCOME20</SelectItem>
                      <SelectItem value="vip25">VIP25</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-3">
                <Label>Visibility</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="pos" />
                    <label htmlFor="pos" className="text-sm">Show on POS</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="self" />
                    <label htmlFor="self" className="text-sm">Show on Self-Order</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="storefront" />
                    <label htmlFor="storefront" className="text-sm">Show on Storefront</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="omni" />
                    <label htmlFor="omni" className="text-sm">Show on Omnichannels</label>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <Label>Publish Status</Label>
                <Select defaultValue="active">
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>
          <SheetFooter className="flex-col sm:flex-row gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsAddSheetOpen(false)} className="w-full sm:w-auto">Cancel</Button>
            <Button className="w-full sm:w-auto">Create Product</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* View/Edit Product Sheet */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {selectedProduct && (
            <>
              <SheetHeader>
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <SheetTitle>{selectedProduct.name}</SheetTitle>
                    <SheetDescription>{selectedProduct.description}</SheetDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{selectedProduct.category}</Badge>
                      <Badge variant={selectedProduct.status ? "default" : "secondary"}>
                        {selectedProduct.status ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </SheetHeader>
              
              <Tabs defaultValue="details" className="mt-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                  <TabsTrigger value="variations">Variants</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Product Code</p>
                      <p className="font-medium">{selectedProduct.productCode}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">SKU</p>
                      <p className="font-medium">{selectedProduct.sku}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="font-medium">{selectedProduct.category}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Stock</p>
                      <p className={cn("font-medium", selectedProduct.stock === 0 && "text-destructive")}>{selectedProduct.stock}</p>
                    </div>
                    <div className="space-y-1 col-span-2">
                      <p className="text-sm text-muted-foreground">Supplier</p>
                      <p className="font-medium">{selectedProduct.supplier}</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="pricing" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Cost Price</p>
                      <p className="font-medium">{formatPrice(selectedProduct.price)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Selling Price</p>
                      <p className="font-medium text-lg">{formatPrice(selectedProduct.sellingPrice)}</p>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-3">Ingredients</p>
                    {selectedProduct.ingredients.length > 0 ? (
                      <div className="space-y-2">
                        {selectedProduct.ingredients.map((ing, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                            <span>{ing.name}</span>
                            <span className="text-muted-foreground">{ing.quantity} {ing.unit}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No ingredients linked</p>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="variations" className="space-y-4 mt-4">
                  <div>
                    <p className="text-sm font-medium mb-3">Variations</p>
                    {selectedProduct.variations.length > 0 ? (
                      <div className="space-y-2">
                        {selectedProduct.variations.map((v, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{v.name}</p>
                              <p className="text-xs text-muted-foreground">{v.sku}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{formatPrice(v.sellingPrice)}</p>
                              <p className="text-xs text-muted-foreground line-through">{formatPrice(v.price)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No variations</p>
                    )}
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-3">Add-on Groups</p>
                    {selectedProduct.addons.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.addons.map((addon, idx) => (
                          <Badge key={idx} variant="secondary">{addon}</Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No add-ons attached</p>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="settings" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Prep Time</p>
                      <p className="font-medium">{selectedProduct.prepTime} minutes</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Tax Option</p>
                      <p className="font-medium">{selectedProduct.taxOption}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Discount</p>
                      <p className="font-medium">{selectedProduct.discountOption}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge variant={selectedProduct.status ? "default" : "secondary"}>
                        {selectedProduct.status ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-3">Visibility</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.visibility.map((v, idx) => (
                        <Badge key={idx} variant="outline" className="capitalize">{v}</Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <SheetFooter className="flex-col sm:flex-row gap-2 mt-6">
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => handleEditProduct(selectedProduct)}>
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
