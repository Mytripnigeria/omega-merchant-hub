import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import { Search, MoreHorizontal, Plus, Filter, Image as ImageIcon } from "lucide-react";
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

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">
            Manage your menu items and inventory
          </p>
        </div>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Stats */}
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
      <Card>
        <CardContent className="p-0">
          {/* Mobile Card View */}
          <div className="block sm:hidden divide-y divide-border">
            {products.map((product) => (
              <div key={product.id} className="p-4 space-y-3">
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
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
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
                    <div className="flex items-center gap-2">
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
                  <TableRow key={product.id} className="group cursor-pointer hover:bg-muted/50">
                    <TableCell className="pl-6">
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
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch checked={product.status} />
                        <span className={cn("text-sm", product.status ? "text-green-600" : "text-muted-foreground")}>
                          {product.status ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="pr-6">
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
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
    </div>
  );
}
