import { useState } from "react";
import { useLoading } from "@/hooks/use-loading";
import { useTableControls } from "@/hooks/use-table-controls";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { SortableHeader } from "@/components/ui/sortable-header";
import { TablePagination } from "@/components/ui/table-pagination";
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
import { Search, MoreHorizontal, Plus, Filter, Mail, Phone, Eye, Edit, Trash2, Calendar, MapPin, Wallet, Gift } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: number;
}

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthday: string;
  gender: string;
  country: string;
  state: string;
  city: string;
  street: string;
  zipCode: string;
  orders: number;
  spent: number;
  lastOrder: string;
  status: "Active" | "VIP" | "Inactive";
  source: string;
  walletBalance: number;
  points: number;
  groups: string[];
  recentOrders: Order[];
}

const customers: Customer[] = [
  {
    id: "1",
    firstName: "Adaeze",
    lastName: "Okonkwo",
    email: "adaeze@gmail.com",
    phone: "+234 803 456 7890",
    birthday: "1990-05-15",
    gender: "Female",
    country: "Nigeria",
    state: "Lagos",
    city: "Ikeja",
    street: "123 Allen Avenue",
    zipCode: "100001",
    orders: 24,
    spent: 156800,
    lastOrder: "2 hours ago",
    status: "Active",
    source: "POS",
    walletBalance: 5000,
    points: 1250,
    groups: ["Regular", "Loyal"],
    recentOrders: [
      { id: "ORD-001", date: "2026-01-15", total: 8500, status: "Completed", items: 3 },
      { id: "ORD-002", date: "2026-01-10", total: 12000, status: "Completed", items: 5 },
    ]
  },
  {
    id: "2",
    firstName: "Chinedu",
    lastName: "Eze",
    email: "chinedu.eze@mail.com",
    phone: "+234 805 123 4567",
    birthday: "1985-08-20",
    gender: "Male",
    country: "Nigeria",
    state: "Lagos",
    city: "Victoria Island",
    street: "45 Adeola Odeku",
    zipCode: "100212",
    orders: 18,
    spent: 98500,
    lastOrder: "1 day ago",
    status: "Active",
    source: "Storefront",
    walletBalance: 0,
    points: 850,
    groups: ["Regular"],
    recentOrders: []
  },
  {
    id: "3",
    firstName: "Oluwaseun",
    lastName: "Adeyemi",
    email: "seun.a@outlook.com",
    phone: "+234 809 876 5432",
    birthday: "1992-12-01",
    gender: "Male",
    country: "Nigeria",
    state: "Lagos",
    city: "Lekki",
    street: "10 Admiralty Way",
    zipCode: "105102",
    orders: 45,
    spent: 312000,
    lastOrder: "3 hours ago",
    status: "VIP",
    source: "POS",
    walletBalance: 15000,
    points: 3200,
    groups: ["VIP", "Loyal", "Corporate"],
    recentOrders: []
  },
  {
    id: "4",
    firstName: "Fatima",
    lastName: "Abubakar",
    email: "fatima.abu@gmail.com",
    phone: "+234 802 345 6789",
    birthday: "1988-03-25",
    gender: "Female",
    country: "Nigeria",
    state: "Abuja",
    city: "Wuse",
    street: "Plot 123 Wuse 2",
    zipCode: "900001",
    orders: 12,
    spent: 67200,
    lastOrder: "5 days ago",
    status: "Active",
    source: "UberEats",
    walletBalance: 2500,
    points: 450,
    groups: ["Regular"],
    recentOrders: []
  },
  {
    id: "5",
    firstName: "Emmanuel",
    lastName: "Obi",
    email: "emmanuelobi@mail.com",
    phone: "+234 806 234 5678",
    birthday: "1995-07-10",
    gender: "Male",
    country: "Nigeria",
    state: "Lagos",
    city: "Surulere",
    street: "20 Adeniran Ogunsanya",
    zipCode: "101283",
    orders: 8,
    spent: 42500,
    lastOrder: "2 weeks ago",
    status: "Inactive",
    source: "Storefront",
    walletBalance: 0,
    points: 200,
    groups: [],
    recentOrders: []
  },
];

const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  VIP: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
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

function CustomersSkeleton() {
  return (
    <>
      <div className="block sm:hidden divide-y divide-border">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-36" />
                </div>
              </div>
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
          </div>
        ))}
      </div>
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {Array.from({ length: 8 }).map((_, i) => (
                <th key={i} className="p-4"><Skeleton className="h-3 w-16" /></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-border last:border-0">
                {Array.from({ length: 8 }).map((_, j) => (
                  <td key={j} className="p-4"><Skeleton className="h-4 w-20" /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const isLoading = useLoading(1000);

  // Sheet states
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Pre-filter customers
  const preFilteredCustomers = customers.filter(c => 
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Use table controls hook
  const {
    data: filteredCustomers,
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
  } = useTableControls<Customer>({ data: preFilteredCustomers, initialPageSize: 10 });

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsViewSheetOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsAddSheetOpen(true);
  };

  const handleAddNew = () => {
    setSelectedCustomer(null);
    setIsAddSheetOpen(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Customers</h1>
          <p className="text-sm text-muted-foreground">
            View and manage your customer database
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Mail className="mr-2 h-4 w-4" />
            <span className="hidden xs:inline">Email All</span>
          </Button>
          <Button size="sm" className="flex-1 sm:flex-none" onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden xs:inline">Add Customer</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Total Customers</p>
              <p className="text-xl sm:text-2xl font-semibold">1,284</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Active</p>
              <p className="text-xl sm:text-2xl font-semibold">1,156</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">VIP Members</p>
              <p className="text-xl sm:text-2xl font-semibold">89</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">New This Month</p>
              <p className="text-xl sm:text-2xl font-semibold">156</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="icon" className="shrink-0">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Customers List */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <CustomersSkeleton />
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block sm:hidden divide-y divide-border">
                {filteredCustomers.map((customer) => (
                  <div key={customer.id} className="p-4 space-y-3 cursor-pointer" onClick={() => handleViewCustomer(customer)}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarFallback className="bg-muted text-xs">
                            {customer.firstName[0]}{customer.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{customer.firstName} {customer.lastName}</p>
                          <p className="text-xs text-muted-foreground truncate">{customer.email}</p>
                        </div>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={cn("text-xs font-normal shrink-0", statusColors[customer.status])}
                      >
                        {customer.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <span>{customer.phone}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="space-y-0.5">
                        <p className="text-muted-foreground text-xs">{customer.orders} orders</p>
                        <p className="font-medium">{formatPrice(customer.spent)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground text-xs">Last order</p>
                        <p className="text-sm">{customer.lastOrder}</p>
                      </div>
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
                      <th className="text-left p-4">
                        <span className="text-xs font-medium text-muted-foreground">Customer</span>
                      </th>
                      <th className="text-left p-4">
                        <SortableHeader label="Phone" field="phone" currentSortField={sortConfig.field as string | null} currentSortDirection={sortConfig.direction} onSort={handleSort as (field: string) => void} />
                      </th>
                      <th className="text-left p-4">
                        <SortableHeader label="Orders" field="orders" currentSortField={sortConfig.field as string | null} currentSortDirection={sortConfig.direction} onSort={handleSort as (field: string) => void} />
                      </th>
                      <th className="text-left p-4">
                        <SortableHeader label="Total Spent" field="spent" currentSortField={sortConfig.field as string | null} currentSortDirection={sortConfig.direction} onSort={handleSort as (field: string) => void} />
                      </th>
                      <th className="text-left p-4">
                        <SortableHeader label="Last Order" field="lastOrder" currentSortField={sortConfig.field as string | null} currentSortDirection={sortConfig.direction} onSort={handleSort as (field: string) => void} />
                      </th>
                      <th className="text-left p-4">
                        <SortableHeader label="Status" field="status" currentSortField={sortConfig.field as string | null} currentSortDirection={sortConfig.direction} onSort={handleSort as (field: string) => void} />
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4 pr-6 w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="group cursor-pointer hover:bg-muted/50 border-b border-border last:border-0" onClick={() => handleViewCustomer(customer)}>
                        <td className="p-4 pl-6" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" className="rounded border-border" />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-muted text-xs">
                                {customer.firstName[0]}{customer.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{customer.firstName} {customer.lastName}</p>
                              <p className="text-sm text-muted-foreground">{customer.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">{customer.phone}</td>
                        <td className="p-4">{customer.orders}</td>
                        <td className="p-4 font-medium">{formatPrice(customer.spent)}</td>
                        <td className="p-4 text-muted-foreground">{customer.lastOrder}</td>
                        <td className="p-4">
                          <Badge 
                            variant="secondary" 
                            className={cn("font-normal", statusColors[customer.status])}
                          >
                            {customer.status}
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
                              <DropdownMenuItem onClick={() => handleViewCustomer(customer)}>
                                <Eye className="mr-2 h-4 w-4" />View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditCustomer(customer)}>
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
            </>
          )}
        </CardContent>
      </Card>

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

      {/* Add/Edit Sheet */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedCustomer ? "Edit Customer" : "Add Customer"}</SheetTitle>
            <SheetDescription>
              {selectedCustomer ? "Update customer details" : "Add a new customer to your database"}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6">
            {/* Individual Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Individual Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input placeholder="John" defaultValue={selectedCustomer?.firstName} />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input placeholder="Doe" defaultValue={selectedCustomer?.lastName} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Birthday</Label>
                  <Input type="date" defaultValue={selectedCustomer?.birthday} />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select defaultValue={selectedCustomer?.gender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Contact Details</h3>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="customer@email.com" defaultValue={selectedCustomer?.email} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input placeholder="+234 800 000 0000" defaultValue={selectedCustomer?.phone} />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input placeholder="Nigeria" defaultValue={selectedCustomer?.country} />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input placeholder="Lagos" defaultValue={selectedCustomer?.state} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input placeholder="Ikeja" defaultValue={selectedCustomer?.city} />
                </div>
                <div className="space-y-2">
                  <Label>Zip/Postal Code</Label>
                  <Input placeholder="100001" defaultValue={selectedCustomer?.zipCode} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Street</Label>
                <Input placeholder="123 Main Street" defaultValue={selectedCustomer?.street} />
              </div>
            </div>

            {/* Other Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Other Information</h3>
              <div className="space-y-2">
                <Label>Customer Groups (comma separated)</Label>
                <Input placeholder="VIP, Regular, Loyal" defaultValue={selectedCustomer?.groups.join(", ")} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select defaultValue={selectedCustomer?.status || "Active"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="VIP">VIP</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <SheetFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsAddSheetOpen(false)} className="w-full sm:w-auto">Cancel</Button>
            <Button className="w-full sm:w-auto">{selectedCustomer ? "Update Customer" : "Add Customer"}</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* View Details Sheet */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedCustomer?.firstName} {selectedCustomer?.lastName}</SheetTitle>
            <SheetDescription>Customer details and order history</SheetDescription>
          </SheetHeader>
          {selectedCustomer && (
            <Tabs defaultValue="details" className="mt-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="orders">Order History</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4 mt-4">
                {/* Individual Details */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground">Individual Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">First Name</p>
                      <p className="font-medium">{selectedCustomer.firstName}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Last Name</p>
                      <p className="font-medium">{selectedCustomer.lastName}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> Birthday</p>
                      <p className="font-medium">{selectedCustomer.birthday}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Gender</p>
                      <p className="font-medium">{selectedCustomer.gender}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground">Contact Details</h3>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" /> Email</p>
                    <p className="font-medium">{selectedCustomer.email}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" /> Phone</p>
                    <p className="font-medium">{selectedCustomer.phone}</p>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> Full Address</p>
                    <p className="font-medium">{selectedCustomer.street}, {selectedCustomer.city}, {selectedCustomer.state}, {selectedCustomer.country}</p>
                  </div>
                </div>

                {/* Other Information */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground">Other Information</h3>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Source</p>
                    <Badge variant="secondary">{selectedCustomer.source}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><Wallet className="h-3 w-3" /> Wallet Balance</p>
                      <p className="font-medium">{formatPrice(selectedCustomer.walletBalance)}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><Gift className="h-3 w-3" /> Points</p>
                      <p className="font-medium">{selectedCustomer.points}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">Customer Groups</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedCustomer.groups.length > 0 ? selectedCustomer.groups.map((group) => (
                        <Badge key={group} variant="secondary">{group}</Badge>
                      )) : <span className="text-sm text-muted-foreground">No groups</span>}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm">Status</span>
                    <Badge className={statusColors[selectedCustomer.status]}>
                      {selectedCustomer.status}
                    </Badge>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="orders" className="space-y-4 mt-4">
                <h3 className="text-sm font-medium text-muted-foreground">Recent Orders (Last 10)</h3>
                {selectedCustomer.recentOrders.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground border rounded-lg">
                    No order history
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedCustomer.recentOrders.map((order) => (
                      <div key={order.id} className="p-3 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm font-medium">{order.id}</span>
                          <Badge variant={order.status === "Completed" ? "default" : "secondary"}>
                            {order.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{order.date}</span>
                          <span className="font-medium">{formatPrice(order.total)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{order.items} items</p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
          <SheetFooter className="flex-col sm:flex-row gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsViewSheetOpen(false)} className="w-full sm:w-auto">Close</Button>
            <Button onClick={() => { setIsViewSheetOpen(false); handleEditCustomer(selectedCustomer!); }} className="w-full sm:w-auto">Edit Customer</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
