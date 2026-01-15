import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, MoreHorizontal, Plus, Filter, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  spent: string;
  lastOrder: string;
  status: "Active" | "VIP" | "Inactive";
}

const customers: Customer[] = [
  {
    id: "1",
    name: "Adaeze Okonkwo",
    email: "adaeze@gmail.com",
    phone: "+234 803 456 7890",
    orders: 24,
    spent: "₦156,800",
    lastOrder: "2 hours ago",
    status: "Active",
  },
  {
    id: "2",
    name: "Chinedu Eze",
    email: "chinedu.eze@mail.com",
    phone: "+234 805 123 4567",
    orders: 18,
    spent: "₦98,500",
    lastOrder: "1 day ago",
    status: "Active",
  },
  {
    id: "3",
    name: "Oluwaseun Adeyemi",
    email: "seun.a@outlook.com",
    phone: "+234 809 876 5432",
    orders: 45,
    spent: "₦312,000",
    lastOrder: "3 hours ago",
    status: "VIP",
  },
  {
    id: "4",
    name: "Fatima Abubakar",
    email: "fatima.abu@gmail.com",
    phone: "+234 802 345 6789",
    orders: 12,
    spent: "₦67,200",
    lastOrder: "5 days ago",
    status: "Active",
  },
  {
    id: "5",
    name: "Emmanuel Obi",
    email: "emmanuelobi@mail.com",
    phone: "+234 806 234 5678",
    orders: 8,
    spent: "₦42,500",
    lastOrder: "2 weeks ago",
    status: "Inactive",
  },
];

const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  VIP: "bg-purple-100 text-purple-700",
  Inactive: "bg-gray-100 text-gray-600",
};

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");

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
          <Button size="sm" className="flex-1 sm:flex-none">
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden xs:inline">Add Customer</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
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
          {/* Mobile Card View */}
          <div className="block sm:hidden divide-y divide-border">
            {customers.map((customer) => (
              <div key={customer.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarFallback className="bg-muted text-xs">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{customer.name}</p>
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
                    <p className="font-medium">{customer.spent}</p>
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
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Customer</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Phone</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Orders</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Total Spent</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Last Order</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4 pr-6 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="group cursor-pointer hover:bg-muted/50 border-b border-border last:border-0">
                    <td className="p-4 pl-6">
                      <input type="checkbox" className="rounded border-border" />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-muted text-xs">
                            {customer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{customer.phone}</td>
                    <td className="p-4">{customer.orders}</td>
                    <td className="p-4 font-medium">{customer.spent}</td>
                    <td className="p-4 text-muted-foreground">{customer.lastOrder}</td>
                    <td className="p-4">
                      <Badge 
                        variant="secondary" 
                        className={cn("font-normal", statusColors[customer.status])}
                      >
                        {customer.status}
                      </Badge>
                    </td>
                    <td className="p-4 pr-6">
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

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Showing 1-5 of 1,284 customers
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
