import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eye, Clock, X, Package, CreditCard, User, Phone, Mail, MapPin, ChefHat, Truck, UtensilsCrossed } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  variation?: { name: string; price: number };
  addons?: { name: string; quantity: number; price: number }[];
}

interface Order {
  id: string;
  customer: { name: string; email: string; phone: string };
  items: OrderItem[];
  total: number;
  status: "new" | "preparing" | "ready" | "delivered" | "cancelled";
  type: "dine-in" | "pickup" | "delivery";
  channel: string;
  tableNumber?: string;
  note?: string;
  payment: {
    status: string;
    method: string;
    subtotal: number;
    taxTotal: number;
    totalAmount: number;
  };
  time: string;
  date: string;
}

const orders: Order[] = [
  {
    id: "OMG-2847",
    customer: { name: "Adaeze Okonkwo", email: "adaeze@gmail.com", phone: "+234 801 234 5678" },
    items: [
      { id: "1", name: "Jollof Rice", quantity: 2, price: 2500, variation: { name: "Large", price: 500 }, addons: [{ name: "Extra Chicken", quantity: 1, price: 800 }] },
      { id: "2", name: "Peppered Chicken", quantity: 3, price: 1500 },
    ],
    total: 8800,
    status: "preparing",
    type: "pickup",
    channel: "POS",
    note: "Please make it extra spicy",
    payment: { status: "paid", method: "paystack", subtotal: 8300, taxTotal: 415, totalAmount: 8800 },
    time: "2 min ago",
    date: "Jan 14, 2026",
  },
  {
    id: "OMG-2846",
    customer: { name: "Chinedu Eze", email: "chinedu.eze@mail.com", phone: "+234 802 345 6789" },
    items: [
      { id: "1", name: "Suya Platter", quantity: 1, price: 5500 },
      { id: "2", name: "Fried Rice", quantity: 2, price: 3000 },
      { id: "3", name: "Chapman", quantity: 2, price: 2000 },
    ],
    total: 15500,
    status: "new",
    type: "delivery",
    channel: "storefront",
    payment: { status: "paid", method: "flutterwave", subtotal: 14000, taxTotal: 700, totalAmount: 15500 },
    time: "5 min ago",
    date: "Jan 14, 2026",
  },
  {
    id: "OMG-2845",
    customer: { name: "Oluwaseun Adeyemi", email: "seun.a@outlook.com", phone: "+234 803 456 7890" },
    items: [{ id: "1", name: "Amala & Ewedu", quantity: 2, price: 3100 }],
    total: 6200,
    status: "ready",
    type: "dine-in",
    channel: "POS",
    tableNumber: "T-05",
    payment: { status: "paid", method: "cash", subtotal: 6000, taxTotal: 200, totalAmount: 6200 },
    time: "12 min ago",
    date: "Jan 14, 2026",
  },
  {
    id: "OMG-2844",
    customer: { name: "Fatima Abubakar", email: "fatima.abu@gmail.com", phone: "+234 804 567 8901" },
    items: [
      { id: "1", name: "Pepper Soup", quantity: 2, price: 4000 },
      { id: "2", name: "Plantain", quantity: 2, price: 1000 },
    ],
    total: 12300,
    status: "delivered",
    type: "delivery",
    channel: "uber",
    payment: { status: "paid", method: "paystack", subtotal: 10000, taxTotal: 500, totalAmount: 12300 },
    time: "25 min ago",
    date: "Jan 14, 2026",
  },
  {
    id: "OMG-2843",
    customer: { name: "Emmanuel Obi", email: "emmanuelobi@mail.com", phone: "+234 805 678 9012" },
    items: [{ id: "1", name: "Chicken Shawarma", quantity: 1, price: 3500 }],
    total: 3500,
    status: "cancelled",
    type: "pickup",
    channel: "POS",
    note: "Customer cancelled - out of stock",
    payment: { status: "refunded", method: "cash", subtotal: 3500, taxTotal: 0, totalAmount: 3500 },
    time: "30 min ago",
    date: "Jan 14, 2026",
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

const typeIcons = {
  "dine-in": UtensilsCrossed,
  pickup: Package,
  delivery: Truck,
};

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount);
};

export function RecentOrders() {
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsSheetOpen(true);
  };

  const TypeIcon = selectedOrder ? typeIcons[selectedOrder.type] : Package;

  return (
    <>
      <div className="rounded-xl border border-border bg-card shadow-card">
        <div className="flex items-center justify-between border-b border-border p-4 sm:p-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Recent Orders</h3>
            <p className="text-sm text-muted-foreground">Latest orders across all channels</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("/orders")}>
            View All
          </Button>
        </div>

        {/* Mobile Card View */}
        <div className="block sm:hidden divide-y divide-border">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="p-4 space-y-3 cursor-pointer hover:bg-muted/50"
              onClick={() => handleViewOrder(order)}
            >
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
                <span className="text-sm text-muted-foreground truncate max-w-[180px]">{order.customer.name}</span>
                <span className="font-medium">{formatPrice(order.total)}</span>
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
                <tr 
                  key={order.id} 
                  className="group border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleViewOrder(order)}
                >
                  <td className="p-4 pl-6 font-mono text-sm font-medium">#{order.id}</td>
                  <td className="p-4">{order.customer.name}</td>
                  <td className="p-4 text-muted-foreground">{order.items.length}</td>
                  <td className="p-4 font-medium">{formatPrice(order.total)}</td>
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
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewOrder(order);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TypeIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <SheetTitle>Order #{selectedOrder?.id}</SheetTitle>
                <SheetDescription>{selectedOrder?.date} • {selectedOrder?.time}</SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {selectedOrder && (
            <Tabs defaultValue="details" className="mt-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="items">Items</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className={cn("capitalize", statusStyles[selectedOrder.status])}>
                    {selectedOrder.status}
                  </Badge>
                </div>

                {/* Customer Info */}
                <div className="space-y-3 p-4 border rounded-lg">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Customer
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">{selectedOrder.customer.name}</p>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" />
                      {selectedOrder.customer.phone}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      {selectedOrder.customer.email}
                    </div>
                  </div>
                </div>

                {/* Order Info */}
                <div className="space-y-3 p-4 border rounded-lg">
                  <h4 className="text-sm font-medium">Order Information</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <p className="font-medium capitalize">{selectedOrder.type}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Channel</p>
                      <p className="font-medium uppercase">{selectedOrder.channel}</p>
                    </div>
                    {selectedOrder.tableNumber && (
                      <div>
                        <p className="text-muted-foreground">Table</p>
                        <p className="font-medium">{selectedOrder.tableNumber}</p>
                      </div>
                    )}
                  </div>
                  {selectedOrder.note && (
                    <div className="pt-2 border-t text-sm">
                      <p className="text-muted-foreground mb-1">Note</p>
                      <p className="italic">{selectedOrder.note}</p>
                    </div>
                  )}
                </div>

                {/* Payment Summary */}
                <div className="space-y-3 p-4 border rounded-lg">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    Payment
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(selectedOrder.payment.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>{formatPrice(selectedOrder.payment.taxTotal)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(selectedOrder.payment.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-muted-foreground">Method</span>
                      <Badge variant="outline" className="capitalize">{selectedOrder.payment.method}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant="outline" className="capitalize">{selectedOrder.payment.status}</Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="items" className="space-y-4 mt-4">
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                      {item.variation && (
                        <div className="text-sm text-muted-foreground">
                          • {item.variation.name} (+{formatPrice(item.variation.price)})
                        </div>
                      )}
                      {item.addons && item.addons.map((addon, i) => (
                        <div key={i} className="text-sm text-muted-foreground">
                          • {addon.name} x{addon.quantity} (+{formatPrice(addon.price)})
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(selectedOrder.payment.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatPrice(selectedOrder.payment.taxTotal)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(selectedOrder.payment.totalAmount)}</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}

          <div className="flex gap-3 mt-6 pt-4 border-t">
            <Button variant="outline" className="flex-1" onClick={() => setIsSheetOpen(false)}>
              Close
            </Button>
            <Button className="flex-1" onClick={() => {
              setIsSheetOpen(false);
              navigate("/orders");
            }}>
              View Full Details
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}