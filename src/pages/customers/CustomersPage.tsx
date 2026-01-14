import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, MoreHorizontal, Plus, Filter, Mail } from "lucide-react";
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
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
          <p className="text-sm text-muted-foreground">
            View and manage your customer database
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Mail className="mr-2 h-4 w-4" />
            Email All
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Customers</p>
            <p className="text-2xl font-semibold">1,284</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-semibold">1,156</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">VIP Members</p>
            <p className="text-2xl font-semibold">89</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">New This Month</p>
            <p className="text-2xl font-semibold">156</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Customers Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6 w-12">
                  <input type="checkbox" className="rounded border-border" />
                </TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6 w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id} className="group cursor-pointer hover:bg-muted/50">
                  <TableCell className="pl-6">
                    <input type="checkbox" className="rounded border-border" />
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell className="text-muted-foreground">{customer.phone}</TableCell>
                  <TableCell>{customer.orders}</TableCell>
                  <TableCell className="font-medium">{customer.spent}</TableCell>
                  <TableCell className="text-muted-foreground">{customer.lastOrder}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className={cn("font-normal", statusColors[customer.status])}
                    >
                      {customer.status}
                    </Badge>
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
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
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
