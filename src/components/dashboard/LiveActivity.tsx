import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  ShoppingCart, 
  UserPlus, 
  CreditCard, 
  Package,
  Clock
} from "lucide-react";

interface Activity {
  id: string;
  type: "order" | "customer" | "payment" | "stock";
  message: string;
  time: string;
  highlight?: boolean;
}

const activities: Activity[] = [
  {
    id: "1",
    type: "order",
    message: "New order #OMG-2847 received",
    time: "Just now",
    highlight: true,
  },
  {
    id: "2",
    type: "payment",
    message: "Payment confirmed for #OMG-2845",
    time: "2 min ago",
  },
  {
    id: "3",
    type: "customer",
    message: "New customer: Fatima Abubakar",
    time: "5 min ago",
  },
  {
    id: "4",
    type: "stock",
    message: "Low stock alert: Suya Spice",
    time: "10 min ago",
  },
  {
    id: "5",
    type: "order",
    message: "Order #OMG-2844 completed",
    time: "15 min ago",
  },
  {
    id: "6",
    type: "payment",
    message: "Refund processed for #OMG-2838",
    time: "25 min ago",
  },
];

const iconMap = {
  order: ShoppingCart,
  customer: UserPlus,
  payment: CreditCard,
  stock: Package,
};

const colorMap = {
  order: "text-info",
  customer: "text-success",
  payment: "text-primary",
  stock: "text-warning",
};

export function LiveActivity() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Live Activity</h3>
          <p className="text-sm text-muted-foreground">Real-time updates</p>
        </div>
        <Badge variant="outline" className="animate-pulse-glow border-success/20 bg-success/10 text-success">
          <span className="mr-1.5 h-2 w-2 rounded-full bg-success" />
          Live
        </Badge>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = iconMap[activity.type];
          return (
            <div
              key={activity.id}
              className={cn(
                "flex items-start gap-3 rounded-lg p-3 transition-colors",
                activity.highlight ? "bg-primary/5 border border-primary/20" : "hover:bg-muted"
              )}
            >
              <div className={cn("mt-0.5", colorMap[activity.type])}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{activity.message}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" />
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
