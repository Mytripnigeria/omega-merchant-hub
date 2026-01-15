import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eye, Clock } from "lucide-react";

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
      <div className="flex items-center justify-between border-b border-border p-4 sm:p-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Orders</h3>
          <p className="text-sm text-muted-foreground">Latest orders across all channels</p>
        </div>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>

      {/* Mobile Card View */}
      <div className="block sm:hidden divide-y divide-border">
        {orders.map((order) => (
          <div key={order.id} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-medium">#{order.id}</span>
              <Badge 
                variant="outline" 
                className={cn("capitalize text-xs", statusStyles[order.status])}
              >
                {order.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground truncate max-w-[180px]">{order.customer}</span>
              <span className="font-medium">{order.total}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {order.time}
              </div>
              <Badge variant="secondary" className={cn("capitalize text-xs", typeStyles[order.type])}>
                {order.type}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground p-4 pl-6">Order ID</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Customer</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Items</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Total</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Type</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Time</th>
              <th className="text-right text-xs font-medium text-muted-foreground p-4 pr-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="group border-b border-border last:border-0 hover:bg-muted/50">
                <td className="p-4 pl-6 font-mono text-sm font-medium">#{order.id}</td>
                <td className="p-4">{order.customer}</td>
                <td className="p-4 text-muted-foreground">{order.items}</td>
                <td className="p-4 font-medium">{order.total}</td>
                <td className="p-4">
                  <Badge variant="secondary" className={cn("capitalize", typeStyles[order.type])}>
                    {order.type}
                  </Badge>
                </td>
                <td className="p-4">
                  <Badge 
                    variant="outline" 
                    className={cn("capitalize", statusStyles[order.status])}
                  >
                    {order.status}
                  </Badge>
                </td>
                <td className="p-4 text-muted-foreground">{order.time}</td>
                <td className="p-4 pr-6 text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                    <Eye className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
