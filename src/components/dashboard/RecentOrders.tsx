import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Eye, MoreHorizontal } from "lucide-react";

interface Order {
  id: string;
  customer: string;
  items: number;
  total: string;
  status: "new" | "preparing" | "ready" | "delivered" | "cancelled";
  type: "dine-in" | "pickup" | "delivery";
  time: string;
}

const orders: Order[] = [
  {
    id: "OMG-2847",
    customer: "Adaeze Okonkwo",
    items: 3,
    total: "₦8,800",
    status: "preparing",
    type: "pickup",
    time: "2 min ago",
  },
  {
    id: "OMG-2846",
    customer: "Chinedu Eze",
    items: 5,
    total: "₦15,500",
    status: "new",
    type: "delivery",
    time: "5 min ago",
  },
  {
    id: "OMG-2845",
    customer: "Oluwaseun Adeyemi",
    items: 2,
    total: "₦6,200",
    status: "ready",
    type: "dine-in",
    time: "12 min ago",
  },
  {
    id: "OMG-2844",
    customer: "Fatima Abubakar",
    items: 4,
    total: "₦12,300",
    status: "delivered",
    type: "delivery",
    time: "25 min ago",
  },
  {
    id: "OMG-2843",
    customer: "Emmanuel Obi",
    items: 1,
    total: "₦3,500",
    status: "cancelled",
    type: "pickup",
    time: "30 min ago",
  },
];

const statusStyles = {
  new: "bg-info/10 text-info border-info/20",
  preparing: "bg-warning/10 text-warning border-warning/20",
  ready: "bg-success/10 text-success border-success/20",
  delivered: "bg-primary/10 text-primary border-primary/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

const typeStyles = {
  "dine-in": "bg-secondary text-secondary-foreground",
  pickup: "bg-secondary text-secondary-foreground",
  delivery: "bg-secondary text-secondary-foreground",
};

export function RecentOrders() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-card">
      <div className="flex items-center justify-between border-b border-border p-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Orders</h3>
          <p className="text-sm text-muted-foreground">Latest orders across all channels</p>
        </div>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-muted-foreground">Order ID</TableHead>
            <TableHead className="text-muted-foreground">Customer</TableHead>
            <TableHead className="text-muted-foreground">Items</TableHead>
            <TableHead className="text-muted-foreground">Total</TableHead>
            <TableHead className="text-muted-foreground">Type</TableHead>
            <TableHead className="text-muted-foreground">Status</TableHead>
            <TableHead className="text-muted-foreground">Time</TableHead>
            <TableHead className="text-right text-muted-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="group">
              <TableCell className="font-mono text-sm font-medium text-foreground">
                #{order.id}
              </TableCell>
              <TableCell className="text-foreground">{order.customer}</TableCell>
              <TableCell className="text-muted-foreground">{order.items}</TableCell>
              <TableCell className="font-medium text-foreground">{order.total}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={cn("capitalize", typeStyles[order.type])}>
                  {order.type}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={cn("capitalize", statusStyles[order.status])}
                >
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{order.time}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
