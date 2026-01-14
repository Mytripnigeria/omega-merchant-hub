import { Button } from "@/components/ui/button";
import { 
  Plus, 
  ShoppingCart, 
  Package, 
  Users, 
  FileText, 
  Settings,
  QrCode,
  Truck
} from "lucide-react";

const actions = [
  { label: "New Order", icon: ShoppingCart, variant: "default" as const },
  { label: "Add Product", icon: Package, variant: "outline" as const },
  { label: "Add Customer", icon: Users, variant: "outline" as const },
  { label: "Create Report", icon: FileText, variant: "outline" as const },
  { label: "Scan QR", icon: QrCode, variant: "outline" as const },
  { label: "Track Delivery", icon: Truck, variant: "outline" as const },
];

export function QuickActions() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        <p className="text-sm text-muted-foreground">Frequently used actions</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant={action.variant}
            className="h-auto flex-col gap-2 py-4"
          >
            <action.icon className="h-5 w-5" />
            <span className="text-xs">{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
