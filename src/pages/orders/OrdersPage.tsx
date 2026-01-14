import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Search,
  Filter,
  Download,
  Eye,
  MoreHorizontal,
  RefreshCw,
  Clock,
  Utensils,
  Bike,
  Package,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Order {
  id: string;
  customer: string;
  phone: string;
  items: number;
  total: string;
  status: "new" | "ongoing" | "ready" | "transit" | "completed" | "hold" | "cancelled";
  type: "dine-in" | "pickup" | "delivery";
  payment: "paid" | "pending" | "refunded";
  time: string;
  staff: string;
}

const orders: Order[] = [
  {
    id: "OMG-2847",
    customer: "Adaeze Okonkwo",
    phone: "+234 812 345 6789",
    items: 3,
    total: "₦8,800",
    status: "ongoing",
    type: "pickup",
    payment: "paid",
    time: "2 min ago",
    staff: "Chidi E.",
  },
  {
    id: "OMG-2846",
    customer: "Chinedu Eze",
    phone: "+234 803 456 7890",
    items: 5,
    total: "₦15,500",
    status: "new",
    type: "delivery",
    payment: "pending",
    time: "5 min ago",
    staff: "Amara N.",
  },
  {
    id: "OMG-2845",
    customer: "Oluwaseun Adeyemi",
    phone: "+234 809 567 8901",
    items: 2,
    total: "₦6,200",
    status: "ready",
    type: "dine-in",
    payment: "paid",
    time: "12 min ago",
    staff: "Tunde A.",
  },
  {
    id: "OMG-2844",
    customer: "Fatima Abubakar",
    phone: "+234 817 678 9012",
    items: 4,
    total: "₦12,300",
    status: "completed",
    type: "delivery",
    payment: "paid",
    time: "25 min ago",
    staff: "Kemi O.",
  },
  {
    id: "OMG-2843",
    customer: "Emmanuel Obi",
    phone: "+234 708 789 0123",
    items: 1,
    total: "₦3,500",
    status: "cancelled",
    type: "pickup",
    payment: "refunded",
    time: "30 min ago",
    staff: "Chidi E.",
  },
  {
    id: "OMG-2842",
    customer: "Grace Nwosu",
    phone: "+234 805 890 1234",
    items: 6,
    total: "₦22,400",
    status: "transit",
    type: "delivery",
    payment: "paid",
    time: "35 min ago",
    staff: "Amara N.",
  },
];

const statusStyles = {
  new: "bg-info/10 text-info border-info/20",
  ongoing: "bg-warning/10 text-warning border-warning/20",
  ready: "bg-success/10 text-success border-success/20",
  transit: "bg-primary/10 text-primary border-primary/20",
  completed: "bg-muted text-muted-foreground border-border",
  hold: "bg-warning/10 text-warning border-warning/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

const paymentStyles = {
  paid: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  refunded: "bg-muted text-muted-foreground border-border",
};

const typeIcons = {
  "dine-in": Utensils,
  pickup: Package,
  delivery: Bike,
};

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all");
  
  const filteredOrders = activeTab === "all" 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  const statusCounts = {
    all: orders.length,
    new: orders.filter(o => o.status === "new").length,
    ongoing: orders.filter(o => o.status === "ongoing").length,
    ready: orders.filter(o => o.status === "ready").length,
    transit: orders.filter(o => o.status === "transit").length,
    completed: orders.filter(o => o.status === "completed").length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Orders</h1>
          <p className="text-muted-foreground">Manage and track all orders</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by order ID, customer, phone..."
            className="pl-10 bg-muted"
          />
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="all-types">
            <SelectTrigger className="w-[140px] bg-muted">
              <SelectValue placeholder="Order type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-types">All types</SelectItem>
              <SelectItem value="dine-in">Dine-in</SelectItem>
              <SelectItem value="pickup">Pickup</SelectItem>
              <SelectItem value="delivery">Delivery</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="today">
            <SelectTrigger className="w-[140px] bg-muted">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="week">This week</SelectItem>
              <SelectItem value="month">This month</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted">
          <TabsTrigger value="all" className="gap-2">
            All <Badge variant="secondary" className="ml-1">{statusCounts.all}</Badge>
          </TabsTrigger>
          <TabsTrigger value="new" className="gap-2">
            New <Badge variant="secondary" className="ml-1">{statusCounts.new}</Badge>
          </TabsTrigger>
          <TabsTrigger value="ongoing" className="gap-2">
            Ongoing <Badge variant="secondary" className="ml-1">{statusCounts.ongoing}</Badge>
          </TabsTrigger>
          <TabsTrigger value="ready" className="gap-2">
            Ready <Badge variant="secondary" className="ml-1">{statusCounts.ready}</Badge>
          </TabsTrigger>
          <TabsTrigger value="transit" className="gap-2">
            Transit <Badge variant="secondary" className="ml-1">{statusCounts.transit}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            Completed <Badge variant="secondary" className="ml-1">{statusCounts.completed}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="rounded-xl border border-border bg-card shadow-card">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Order</TableHead>
                  <TableHead className="text-muted-foreground">Customer</TableHead>
                  <TableHead className="text-muted-foreground">Items</TableHead>
                  <TableHead className="text-muted-foreground">Total</TableHead>
                  <TableHead className="text-muted-foreground">Type</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Payment</TableHead>
                  <TableHead className="text-muted-foreground">Staff</TableHead>
                  <TableHead className="text-muted-foreground">Time</TableHead>
                  <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const TypeIcon = typeIcons[order.type];
                  return (
                    <TableRow key={order.id} className="group">
                      <TableCell className="font-mono text-sm font-medium text-foreground">
                        #{order.id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{order.customer}</p>
                          <p className="text-xs text-muted-foreground">{order.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{order.items}</TableCell>
                      <TableCell className="font-medium text-foreground">{order.total}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <TypeIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="capitalize text-muted-foreground">{order.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("capitalize", statusStyles[order.status])}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("capitalize", paymentStyles[order.payment])}>
                          {order.payment}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{order.staff}</TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {order.time}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuItem>Print receipt</DropdownMenuItem>
                            <DropdownMenuItem>Update status</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Cancel order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
