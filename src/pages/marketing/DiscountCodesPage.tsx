import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Search, Plus, Tag, Percent, Users, MoreHorizontal, Calendar, X, Eye, Edit, ShoppingCart } from "lucide-react";
import { DiscountCode as APIDiscountCode } from "@/types/marketing";

// UI-specific interface with computed fields for display
interface DiscountUI extends APIDiscountCode {
  method: "automatic" | "code";
  minOrder: number; // Alias for minOrderAmount
  maxUsePerUser: number; // Alias for usageLimitPerCustomer
  maxUseTotal: number; // Alias for usageLimit
  uses: number; // Alias for usageCount
  applyToAll: boolean;
  expires: string; // Alias for validTo
  expiresTime: string;
  customersUsed: number;
  ordersUsed: number;
}

const transformDiscount = (discount: APIDiscountCode): DiscountUI => ({
  ...discount,
  method: "code",
  minOrder: discount.minOrderAmount || 0,
  maxUsePerUser: discount.usageLimitPerCustomer || 1,
  maxUseTotal: discount.usageLimit || 500,
  uses: discount.usageCount,
  applyToAll: discount.applicableTo === "all",
  expires: discount.validTo,
  expiresTime: "23:59",
  customersUsed: discount.usageCount,
  ordersUsed: discount.usageCount,
});

// Mock data aligned with API types
const mockDiscounts: APIDiscountCode[] = [
  { id: "1", storeId: "store-1", code: "WELCOME20", name: "Welcome Discount", description: "First time customer discount", type: "percentage", value: 20, minOrderAmount: 5000, applicableTo: "all", usageLimit: 500, usageCount: 145, usageLimitPerCustomer: 1, validFrom: "2026-01-01", validTo: "2026-02-28", status: "active", createdAt: "2026-01-01", updatedAt: "2026-01-15" },
  { id: "2", storeId: "store-1", code: "FLAT10", name: "Flat Ten Off", description: "Flat ₦1000 off on orders", type: "fixed", value: 1000, minOrderAmount: 3000, applicableTo: "all", usageLimit: 200, usageCount: 89, usageLimitPerCustomer: 2, validFrom: "2026-01-01", validTo: "2026-01-31", status: "active", createdAt: "2026-01-01", updatedAt: "2026-01-15" },
  { id: "3", storeId: "store-1", code: "SUMMER15", name: "Summer Sale", description: "Summer season discount", type: "percentage", value: 15, minOrderAmount: 4000, applicableTo: "specific-products", usageLimit: 200, usageCount: 200, usageLimitPerCustomer: 3, validFrom: "2025-06-01", validTo: "2026-01-20", status: "expired", createdAt: "2025-06-01", updatedAt: "2026-01-20" },
  { id: "4", storeId: "store-1", code: "VIP25", name: "VIP Discount", description: "Exclusive VIP member discount", type: "percentage", value: 25, minOrderAmount: 10000, applicableTo: "all", usageLimit: 50, usageCount: 23, usageLimitPerCustomer: 5, validFrom: "2026-01-01", validTo: "2026-03-31", status: "active", createdAt: "2026-01-01", updatedAt: "2026-01-15" },
];

const discountsData: DiscountUI[] = mockDiscounts.map(transformDiscount);

const discountOrders = [
  { id: "ORD-001", customer: "John Doe", date: "2026-01-15", total: 8500, discount: 1700, status: "completed" },
  { id: "ORD-002", customer: "Sarah Smith", date: "2026-01-14", total: 6200, discount: 1240, status: "completed" },
  { id: "ORD-003", customer: "Mike Johnson", date: "2026-01-13", total: 12000, discount: 2400, status: "completed" },
  { id: "ORD-004", customer: "Lisa Brown", date: "2026-01-12", total: 5500, discount: 1100, status: "completed" },
];

export default function DiscountCodesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDiscount, setSelectedDiscount] = useState<DiscountUI | null>(null);
  const [sheetMode, setSheetMode] = useState<"view" | "add" | "edit">("view");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const stats = [
    { label: "Active Codes", value: "12", icon: Tag },
    { label: "Total Used", value: "457", icon: Users },
    { label: "Avg. Discount", value: "18%", icon: Percent },
  ];

  const openSheet = (mode: "view" | "add" | "edit", discount?: DiscountUI) => {
    setSheetMode(mode);
    setSelectedDiscount(discount || null);
    setIsSheetOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "inactive": return "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400";
      case "expired": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default: return "";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Discount Codes</h1>
          <p className="text-sm text-muted-foreground">Create and manage promotional codes</p>
        </div>
        <Button size="sm" onClick={() => openSheet("add")}>
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Create Code</span>
        </Button>
      </div>

      {/* Two-column layout for desktop */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Stats */}
          <div className="grid gap-3 grid-cols-3">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-border/50">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-muted flex items-center justify-center">
                      <stat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="text-xl sm:text-2xl font-semibold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search codes..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="pl-9 h-9 bg-muted/50 border-0" 
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[120px] h-9 bg-muted/50 border-0">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Discount Codes List */}
          <Card className="border-border/50">
            <CardContent className="p-0">
              {/* Mobile Card View */}
              <div className="block sm:hidden divide-y divide-border">
                {discountsData.map((discount) => (
                  <div 
                    key={discount.id} 
                    className="p-4 space-y-3 cursor-pointer hover:bg-muted/50"
                    onClick={() => openSheet("view", discount)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-mono font-medium">{discount.code}</p>
                        <p className="text-lg font-semibold">
                          {discount.type === "percentage" ? `${discount.value}%` : `₦${discount.value.toLocaleString()}`} off
                        </p>
                      </div>
                      <Badge className={`text-xs font-normal shrink-0 ${getStatusColor(discount.status)}`}>
                        {discount.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Min. ₦{discount.minOrder.toLocaleString()}</span>
                      <span>{discount.uses}/{discount.maxUseTotal} uses</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Expires {discount.expires}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Code</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Discount</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Min.</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Uses</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Expires</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {discountsData.map((discount) => (
                      <tr 
                        key={discount.id} 
                        className="border-b border-border last:border-0 group cursor-pointer hover:bg-muted/50"
                        onClick={() => openSheet("view", discount)}
                      >
                        <td className="p-4 font-mono font-medium text-sm">{discount.code}</td>
                        <td className="p-4 text-sm">
                          {discount.type === "percentage" ? `${discount.value}%` : `₦${discount.value.toLocaleString()}`}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">₦{discount.minOrder.toLocaleString()}</td>
                        <td className="p-4 text-sm text-muted-foreground">{discount.uses}/{discount.maxUseTotal}</td>
                        <td className="p-4 text-sm text-muted-foreground">{discount.expires}</td>
                        <td className="p-4">
                          <Badge className={`text-xs font-normal ${getStatusColor(discount.status)}`}>
                            {discount.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Hidden on mobile */}
        <div className="hidden lg:block space-y-6">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Top Performing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {discountsData.filter(d => d.status === "active").slice(0, 3).map((discount) => (
                <div key={discount.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-mono text-sm font-medium">{discount.code}</p>
                    <p className="text-xs text-muted-foreground">{discount.uses} uses</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {discount.type === "percentage" ? `${discount.value}%` : `₦${discount.value.toLocaleString()}`}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => openSheet("add")}>
                <Plus className="mr-2 h-4 w-4" />
                Create New Code
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Tag className="mr-2 h-4 w-4" />
                Bulk Import
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Percent className="mr-2 h-4 w-4" />
                Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="space-y-1 pb-4 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle>
                {sheetMode === "add" ? "Create Discount Code" : sheetMode === "edit" ? "Edit Discount Code" : selectedDiscount?.name}
              </SheetTitle>
              {sheetMode === "view" && selectedDiscount && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setSheetMode("edit")}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            {sheetMode === "view" && selectedDiscount && (
              <SheetDescription>Code: {selectedDiscount.code}</SheetDescription>
            )}
          </SheetHeader>

          {sheetMode === "view" && selectedDiscount ? (
            <Tabs defaultValue="details" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Discount Details</TabsTrigger>
                <TabsTrigger value="orders">Order History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-6 mt-4">
                {/* Details Section */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground">Details</h4>
                  <div className="grid gap-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Name</span>
                      <span className="text-sm font-medium">{selectedDiscount.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Description</span>
                      <span className="text-sm font-medium text-right max-w-[200px]">{selectedDiscount.description}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Code</span>
                      <span className="text-sm font-mono font-medium">{selectedDiscount.code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Type</span>
                      <span className="text-sm font-medium capitalize">{selectedDiscount.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Value</span>
                      <span className="text-sm font-medium">
                        {selectedDiscount.type === "percentage" ? `${selectedDiscount.value}%` : `₦${selectedDiscount.value.toLocaleString()}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Method</span>
                      <span className="text-sm font-medium capitalize">{selectedDiscount.method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Min. Order Value</span>
                      <span className="text-sm font-medium">₦{selectedDiscount.minOrder.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Max Use Per User</span>
                      <span className="text-sm font-medium">{selectedDiscount.maxUsePerUser}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Max Use Total</span>
                      <span className="text-sm font-medium">{selectedDiscount.maxUseTotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Apply to All Products</span>
                      <span className="text-sm font-medium">{selectedDiscount.applyToAll ? "Yes" : "No"}</span>
                    </div>
                  </div>
                </div>

                {/* Usage Details Section */}
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="text-sm font-medium text-muted-foreground">Usage Details</h4>
                  <div className="grid gap-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Number of Customers</span>
                      <span className="text-sm font-medium">{selectedDiscount.customersUsed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Number of Orders</span>
                      <span className="text-sm font-medium">{selectedDiscount.ordersUsed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Usage Left</span>
                      <span className="text-sm font-medium">{selectedDiscount.maxUseTotal - selectedDiscount.uses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Expiration Date</span>
                      <span className="text-sm font-medium">{selectedDiscount.expires} at {selectedDiscount.expiresTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge className={`text-xs ${getStatusColor(selectedDiscount.status)}`}>
                        {selectedDiscount.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="orders" className="mt-4">
                <div className="space-y-3">
                  {discountOrders.map((order) => (
                    <div key={order.id} className="p-3 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-medium">{order.id}</span>
                        <Badge variant="outline" className="text-xs">{order.status}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{order.customer}</span>
                        <span className="font-medium">₦{order.total.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{order.date}</span>
                        <span className="text-green-600">-₦{order.discount.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            /* Add/Edit Form */
            <div className="space-y-6 mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input placeholder="e.g., Welcome Discount" defaultValue={selectedDiscount?.name} />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input placeholder="Brief description" defaultValue={selectedDiscount?.description} />
                </div>
                <div className="space-y-2">
                  <Label>Code</Label>
                  <Input placeholder="e.g., SAVE20" defaultValue={selectedDiscount?.code} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select defaultValue={selectedDiscount?.type || "percentage"}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Value</Label>
                    <Input type="number" placeholder="20" defaultValue={selectedDiscount?.value} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Method</Label>
                  <Select defaultValue={selectedDiscount?.method || "code"}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automatic">Automatic</SelectItem>
                      <SelectItem value="code">Code</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Min. Order (₦)</Label>
                    <Input type="number" placeholder="5000" defaultValue={selectedDiscount?.minOrder} />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Use Per User</Label>
                    <Input type="number" placeholder="1" defaultValue={selectedDiscount?.maxUsePerUser} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Max Use Total</Label>
                  <Input type="number" placeholder="100" defaultValue={selectedDiscount?.maxUseTotal} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Apply to All Products</Label>
                  <Switch defaultChecked={selectedDiscount?.applyToAll ?? true} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Expiration Date</Label>
                    <Input type="date" defaultValue={selectedDiscount?.expires} />
                  </div>
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input type="time" defaultValue={selectedDiscount?.expiresTime} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select defaultValue={selectedDiscount?.status || "active"}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" className="flex-1" onClick={() => setIsSheetOpen(false)}>Cancel</Button>
                <Button className="flex-1">{sheetMode === "add" ? "Create Code" : "Save Changes"}</Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
