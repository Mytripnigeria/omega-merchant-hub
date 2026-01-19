import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoading } from "@/hooks/use-loading";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, MoreHorizontal, Filter, Phone, Mail, Eye, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Supplier, PurchaseOrder } from "@/types/suppliers";

// Extended Supplier type for UI with computed fields
interface SupplierWithUI extends Supplier {
  businessName: string;
  sellerName: string;
  outstanding: number;
  purchases: PurchaseHistory[];
}

interface PurchaseHistory {
  id: string;
  date: string;
  items: string;
  quantity: string;
  unit: string;
  location: string;
  totalPrice: number;
  paidAmount: number;
  outstanding: number;
}

// Transform API Supplier to UI format
const transformSupplier = (supplier: Supplier): SupplierWithUI => ({
  ...supplier,
  businessName: supplier.name,
  sellerName: supplier.contactName || supplier.name,
  outstanding: supplier.totalSpent * 0.1, // Example: 10% outstanding
  purchases: [], // Will be populated from purchase orders
});

// Map API category to display category
const categoryMap: Record<string, string> = {
  food: "Produce",
  beverages: "Beverages",
  equipment: "Equipment",
  packaging: "Packaging",
  cleaning: "Cleaning",
  other: "Other",
};

const mockSuppliers: Supplier[] = [
  { 
    id: "1", 
    storeId: "store-1",
    name: "Fresh Farms Ltd", 
    contactName: "John Adams", 
    email: "john@freshfarms.com", 
    phone: "+234 801 234 5678", 
    category: "food",
    status: "active",
    totalOrders: 24,
    totalSpent: 1250000,
    createdAt: "2025-06-01",
    updatedAt: "2026-01-15",
  },
  { 
    id: "2", 
    storeId: "store-1",
    name: "Metro Beverages", 
    contactName: "Sarah Lee", 
    email: "sarah@metro.com", 
    phone: "+234 802 345 6789", 
    category: "beverages",
    status: "active",
    totalOrders: 18,
    totalSpent: 850000,
    createdAt: "2025-07-01",
    updatedAt: "2026-01-10",
  },
  { 
    id: "3", 
    storeId: "store-1",
    name: "Quality Meats", 
    contactName: "Mike Brown", 
    email: "mike@qualitymeats.com", 
    phone: "+234 803 456 7890", 
    category: "food",
    status: "active",
    totalOrders: 32,
    totalSpent: 3400000,
    createdAt: "2025-05-15",
    updatedAt: "2026-01-14",
  },
  { 
    id: "4", 
    storeId: "store-1",
    name: "Bakery Supplies Co", 
    contactName: "Lisa White", 
    email: "lisa@bakerysupplies.com", 
    phone: "+234 804 567 8901", 
    category: "food",
    status: "inactive",
    totalOrders: 8,
    totalSpent: 800000,
    createdAt: "2025-08-01",
    updatedAt: "2025-12-01",
  },
  { 
    id: "5", 
    storeId: "store-1",
    name: "Seafood Direct", 
    contactName: "David Chen", 
    email: "david@seafood.com", 
    phone: "+234 805 678 9012", 
    category: "food",
    status: "active",
    totalOrders: 15,
    totalSpent: 2150000,
    createdAt: "2025-06-15",
    updatedAt: "2026-01-12",
  },
];

// Transform to UI format
const suppliers: SupplierWithUI[] = mockSuppliers.map(transformSupplier);

const categories = ["Produce", "Beverages", "Meat", "Baking", "Seafood", "Packaging", "Equipment"];

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  inactive: "bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400",
  blacklisted: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  // Legacy UI status names
  Active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Inactive: "bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400",
};

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

export default function SuppliersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const isLoading = useLoading(1000);

  // Sheet states
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierWithUI | null>(null);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalOutstanding = suppliers.reduce((acc, s) => acc + s.outstanding, 0);

  const handleViewSupplier = (supplier: SupplierWithUI) => {
    setSelectedSupplier(supplier);
    setIsViewSheetOpen(true);
  };

  const handleEditSupplier = (supplier: SupplierWithUI) => {
    setSelectedSupplier(supplier);
    setIsAddSheetOpen(true);
  };

  const handleAddNew = () => {
    setSelectedSupplier(null);
    setIsAddSheetOpen(true);
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.sellerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Suppliers</h1>
          <p className="text-sm text-muted-foreground">
            Manage supplier relationships and orders
          </p>
        </div>
        <Button size="sm" onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden xs:inline">Add Supplier</span>
        </Button>
      </div>

      {/* Stats */}
      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Total Suppliers</p>
              <p className="text-xl sm:text-2xl font-semibold">{suppliers.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Active</p>
              <p className="text-xl sm:text-2xl font-semibold">{suppliers.filter(s => s.status === "active").length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Outstanding</p>
              <p className="text-xl sm:text-2xl font-semibold text-red-600">{formatPrice(totalOutstanding)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">This Month</p>
              <p className="text-xl sm:text-2xl font-semibold">{formatPrice(2400000)}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="icon" className="shrink-0">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Suppliers List */}
      <Card>
        <CardContent className="p-0">
          {/* Mobile Card View */}
          <div className="block sm:hidden divide-y divide-border">
            {filteredSuppliers.map((supplier) => (
              <div key={supplier.id} className="p-4 space-y-3 cursor-pointer" onClick={() => handleViewSupplier(supplier)}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{supplier.businessName}</p>
                    <p className="text-xs text-muted-foreground">{supplier.sellerName}</p>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={cn("text-xs font-normal shrink-0", statusColors[supplier.status])}
                  >
                    {supplier.status}
                  </Badge>
                </div>
                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{supplier.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    <span>{supplier.phone}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <Badge variant="secondary" className="text-xs font-normal">{supplier.category}</Badge>
                  <span className={cn("font-medium", supplier.outstanding > 0 && "text-red-600")}>
                    {formatPrice(supplier.outstanding)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground p-4 pl-6 w-12">
                    <input type="checkbox" className="rounded border-border" />
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Company</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Contact</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Category</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Outstanding</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4 pr-6 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="group cursor-pointer hover:bg-muted/50 border-b border-border last:border-0" onClick={() => handleViewSupplier(supplier)}>
                    <td className="p-4 pl-6" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" className="rounded border-border" />
                    </td>
                    <td className="p-4">
                      <p className="font-medium">{supplier.businessName}</p>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{supplier.sellerName}</p>
                        <p className="text-sm text-muted-foreground">{supplier.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary" className="font-normal">{supplier.category}</Badge>
                    </td>
                    <td className={cn("p-4 font-medium", supplier.outstanding > 0 && "text-red-600")}>
                      {formatPrice(supplier.outstanding)}
                    </td>
                    <td className="p-4">
                      <Badge 
                        variant="secondary" 
                        className={cn("font-normal", statusColors[supplier.status])}
                      >
                        {supplier.status}
                      </Badge>
                    </td>
                    <td className="p-4 pr-6" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewSupplier(supplier)}>
                            <Eye className="mr-2 h-4 w-4" />View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditSupplier(supplier)}>
                            <Edit className="mr-2 h-4 w-4" />Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Showing 1-{filteredSuppliers.length} of {suppliers.length} suppliers
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

      {/* Add/Edit Sheet */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedSupplier ? "Edit Supplier" : "Add Supplier"}</SheetTitle>
            <SheetDescription>
              {selectedSupplier ? "Update supplier details" : "Add a new supplier to your network"}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Business Name</Label>
                <Input placeholder="e.g., Fresh Farms Ltd" defaultValue={selectedSupplier?.businessName} />
              </div>
              <div className="space-y-2">
                <Label>Seller Name</Label>
                <Input placeholder="e.g., John Adams" defaultValue={selectedSupplier?.sellerName} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select defaultValue={selectedSupplier?.category}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="supplier@email.com" defaultValue={selectedSupplier?.email} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input placeholder="+234 800 000 0000" defaultValue={selectedSupplier?.phone} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select defaultValue={selectedSupplier?.status || "Active"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <SheetFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsAddSheetOpen(false)} className="w-full sm:w-auto">Cancel</Button>
            <Button className="w-full sm:w-auto">{selectedSupplier ? "Update Supplier" : "Add Supplier"}</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* View Details Sheet */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedSupplier?.businessName}</SheetTitle>
            <SheetDescription>Supplier details and purchase history</SheetDescription>
          </SheetHeader>
          {selectedSupplier && (
            <Tabs defaultValue="details" className="mt-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="purchases">Purchases</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Business Name</p>
                    <p className="font-medium">{selectedSupplier.businessName}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Seller Name</p>
                    <p className="font-medium">{selectedSupplier.sellerName}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Category</p>
                    <Badge variant="secondary">{selectedSupplier.category}</Badge>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedSupplier.email}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedSupplier.phone}</p>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm">Status</span>
                    <Badge className={statusColors[selectedSupplier.status]}>
                      {selectedSupplier.status}
                    </Badge>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="text-xs text-red-600 dark:text-red-400">Outstanding Balance</p>
                    <p className="text-xl font-bold text-red-600 dark:text-red-400">
                      {formatPrice(selectedSupplier.outstanding)}
                    </p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="purchases" className="space-y-4 mt-4">
                <h3 className="text-sm font-medium text-muted-foreground">Purchase History</h3>
                {selectedSupplier.purchases.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground border rounded-lg">
                    No purchase history
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedSupplier.purchases.map((purchase) => (
                      <div key={purchase.id} className="p-3 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm font-medium">{purchase.id}</span>
                          <span className="text-xs text-muted-foreground">{purchase.date}</span>
                        </div>
                        <div className="text-sm">
                          <p className="font-medium">{purchase.items}</p>
                          <p className="text-muted-foreground">{purchase.quantity} {purchase.unit} • {purchase.location}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <p className="text-muted-foreground">Total</p>
                            <p className="font-medium">{formatPrice(purchase.totalPrice)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Paid</p>
                            <p className="font-medium text-green-600">{formatPrice(purchase.paidAmount)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Outstanding</p>
                            <p className={cn("font-medium", purchase.outstanding > 0 && "text-red-600")}>
                              {formatPrice(purchase.outstanding)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
          <SheetFooter className="flex-col sm:flex-row gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsViewSheetOpen(false)} className="w-full sm:w-auto">Close</Button>
            <Button onClick={() => { setIsViewSheetOpen(false); handleEditSupplier(selectedSupplier!); }} className="w-full sm:w-auto">Edit Supplier</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
