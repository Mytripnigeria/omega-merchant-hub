import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Plus,
  Clock,
} from "lucide-react";

interface Order {
  id: string;
  customer: string;
  email: string;
  items: number;
  total: string;
  status: "New" | "Preparing" | "Ready" | "Delivered" | "Cancelled";
  type: "Dine-in" | "Pickup" | "Delivery";
  date: string;
  time: string;
}

const orders: Order[] = [
  {
    id: "OMG-2847",
    customer: "Adaeze Okonkwo",
    email: "adaeze@gmail.com",
    items: 3,
    total: "₦8,800",
    status: "Ready",
    type: "Pickup",
    date: "Jan 14, 2026",
    time: "2:34 PM",
  },
  {
    id: "OMG-2846",
    customer: "Chinedu Eze",
    email: "chinedu.eze@mail.com",
    items: 5,
    total: "₦15,500",
    status: "Preparing",
    type: "Delivery",
    date: "Jan 14, 2026",
    time: "2:28 PM",
  },
  {
    id: "OMG-2845",
    customer: "Oluwaseun Adeyemi",
    email: "seun.a@outlook.com",
    items: 2,
    total: "₦6,200",
    status: "Delivered",
    type: "Dine-in",
    date: "Jan 14, 2026",
    time: "1:45 PM",
  },
  {
    id: "OMG-2844",
    customer: "Fatima Abubakar",
    email: "fatima.abu@gmail.com",
    items: 4,
    total: "₦12,300",
    status: "Delivered",
    type: "Delivery",
    date: "Jan 14, 2026",
    time: "1:12 PM",
  },
  {
    id: "OMG-2843",
    customer: "Emmanuel Obi",
    email: "emmanuelobi@mail.com",
    items: 1,
    total: "₦3,500",
    status: "Cancelled",
    type: "Pickup",
    date: "Jan 14, 2026",
    time: "12:48 PM",
  },
  {
    id: "OMG-2842",
    customer: "Grace Nwosu",
    email: "grace.n@company.com",
    items: 6,
    total: "₦22,400",
    status: "New",
    type: "Delivery",
    date: "Jan 14, 2026",
    time: "12:15 PM",
  },
];

const statusColors: Record<string, string> = {
  New: "bg-purple-100 text-purple-700",
  Ready: "bg-green-100 text-green-700",
  Preparing: "bg-yellow-100 text-yellow-700",
  Delivered: "bg-blue-100 text-blue-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground">
            Manage and track all customer orders
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden xs:inline">Export</span>
          </Button>
          <Button size="sm" className="flex-1 sm:flex-none">
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden xs:inline">New Order</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="dine-in">Dine-in</SelectItem>
              <SelectItem value="pickup">Pickup</SelectItem>
              <SelectItem value="delivery">Delivery</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Orders List */}
      <Card>
        <CardContent className="p-0">
          {/* Mobile Card View */}
          <div className="block sm:hidden divide-y divide-border">
            {orders.map((order) => (
              <div key={order.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-medium">#{order.id}</span>
                  <Badge 
                    variant="secondary" 
                    className={cn("text-xs font-normal", statusColors[order.status])}
                  >
                    {order.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-sm">{order.customer}</p>
                  <p className="text-xs text-muted-foreground">{order.email}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs font-normal">
                      {order.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{order.items} items</span>
                  </div>
                  <span className="font-semibold">{order.total}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {order.time}
                  </div>
                  <span>{order.date}</span>
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
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Order ID</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Customer</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Type</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Total</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Date</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4 pr-6 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="group cursor-pointer hover:bg-muted/50 border-b border-border last:border-0">
                    <td className="p-4 pl-6">
                      <input type="checkbox" className="rounded border-border" />
                    </td>
                    <td className="p-4 font-mono text-sm font-medium">#{order.id}</td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-sm text-muted-foreground">{order.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary" className="font-normal">
                        {order.type}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge 
                        variant="secondary" 
                        className={cn("font-normal", statusColors[order.status])}
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="p-4 font-medium">{order.total}</td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm">{order.date}</p>
                        <p className="text-sm text-muted-foreground">{order.time}</p>
                      </div>
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
          Showing 1-6 of 248 orders
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
