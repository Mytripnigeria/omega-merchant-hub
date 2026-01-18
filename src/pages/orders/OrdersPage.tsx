import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useLoading } from "@/hooks/use-loading";
import { useTableControls } from "@/hooks/use-table-controls";
import { SortableHeader } from "@/components/ui/sortable-header";
import { TablePagination } from "@/components/ui/table-pagination";
import { DatePeriodFilter, useDatePeriodFilter, type DatePeriod } from "@/components/ui/date-period-filter";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
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
  User,
  Package,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  ChefHat,
  Truck,
  UtensilsCrossed,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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
  status: "pending" | "accepted" | "awaiting_preparation" | "preparing" | "ready" | "awaiting_delivery" | "delivering" | "completed" | "cancelled" | "refunded";
  type: "dine-in" | "takeaway" | "delivery";
  channel: "POS" | "storefront" | "uber";
  tableNumber?: string;
  note?: string;
  payment: {
    transactionId: string;
    status: "unpaid" | "partial" | "paid" | "refunded";
    method: "cash" | "paystack" | "flutterwave";
    reference: string;
    subtotal: number;
    discountTotal: number;
    taxTotal: number;
    deliveryCost: number;
    serviceCharge: number;
    paymentFee: number;
    totalAmount: number;
  };
  processor?: { name: string; position: string; phone: string; email: string; assignedAt: string; updatedAt: string };
  kitchen?: { name: string; position: string; phone: string; email: string; assignedAt: string; updatedAt: string };
  server?: { name: string; position: string; phone: string; email: string; assignedAt: string; updatedAt: string };
  delivery?: {
    rider?: { name: string; position: string; phone: string; email: string; assignedAt: string; updatedAt: string };
    customer?: { phone: string; region: string; miles: number; address: string; charge: number };
  };
  pickup?: { address: string; longitude: number; latitude: number; phone: string; email: string };
  date: string;
  time: string;
  addedAt: string;
  updatedAt: string;
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
    status: "ready",
    type: "takeaway",
    channel: "POS",
    note: "Please make it extra spicy",
    payment: { transactionId: "TXN-001", status: "paid", method: "paystack", reference: "PAY-2847", subtotal: 8300, discountTotal: 0, taxTotal: 415, deliveryCost: 0, serviceCharge: 85, paymentFee: 0, totalAmount: 8800 },
    processor: { name: "Emmanuel Obi", position: "Cashier", phone: "+234 801 111 2222", email: "emmanuel@omega.com", assignedAt: "2026-01-14 14:30", updatedAt: "2026-01-14 14:32" },
    kitchen: { name: "Chef Amaka", position: "Head Chef", phone: "+234 802 333 4444", email: "amaka@omega.com", assignedAt: "2026-01-14 14:32", updatedAt: "2026-01-14 14:45" },
    date: "Jan 14, 2026",
    time: "2:34 PM",
    addedAt: "2026-01-14 14:30:00",
    updatedAt: "2026-01-14 14:50:00",
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
    status: "preparing",
    type: "delivery",
    channel: "storefront",
    payment: { transactionId: "TXN-002", status: "paid", method: "flutterwave", reference: "FLW-2846", subtotal: 14000, discountTotal: 500, taxTotal: 700, deliveryCost: 1000, serviceCharge: 300, paymentFee: 0, totalAmount: 15500 },
    processor: { name: "Grace Nwosu", position: "Cashier", phone: "+234 803 555 6666", email: "grace@omega.com", assignedAt: "2026-01-14 14:25", updatedAt: "2026-01-14 14:28" },
    kitchen: { name: "Chef Bola", position: "Sous Chef", phone: "+234 804 777 8888", email: "bola@omega.com", assignedAt: "2026-01-14 14:28", updatedAt: "2026-01-14 14:35" },
    delivery: {
      rider: { name: "Tunde Rider", position: "Delivery Rider", phone: "+234 805 999 0000", email: "tunde@omega.com", assignedAt: "2026-01-14 14:40", updatedAt: "2026-01-14 14:40" },
      customer: { phone: "+234 802 345 6789", region: "Lekki Phase 1", miles: 5.2, address: "12 Admiralty Way, Lekki", charge: 1000 },
    },
    date: "Jan 14, 2026",
    time: "2:28 PM",
    addedAt: "2026-01-14 14:25:00",
    updatedAt: "2026-01-14 14:40:00",
  },
  {
    id: "OMG-2845",
    customer: { name: "Oluwaseun Adeyemi", email: "seun.a@outlook.com", phone: "+234 803 456 7890" },
    items: [{ id: "1", name: "Amala & Ewedu", quantity: 2, price: 3100 }],
    total: 6200,
    status: "completed",
    type: "dine-in",
    channel: "POS",
    tableNumber: "T-05",
    payment: { transactionId: "TXN-003", status: "paid", method: "cash", reference: "OMG-2845", subtotal: 6000, discountTotal: 0, taxTotal: 200, deliveryCost: 0, serviceCharge: 0, paymentFee: 0, totalAmount: 6200 },
    server: { name: "Funke Waiter", position: "Server", phone: "+234 806 111 2222", email: "funke@omega.com", assignedAt: "2026-01-14 13:40", updatedAt: "2026-01-14 14:00" },
    date: "Jan 14, 2026",
    time: "1:45 PM",
    addedAt: "2026-01-14 13:40:00",
    updatedAt: "2026-01-14 14:05:00",
  },
  {
    id: "OMG-2844",
    customer: { name: "Fatima Abubakar", email: "fatima.abu@gmail.com", phone: "+234 804 567 8901" },
    items: [
      { id: "1", name: "Pepper Soup", quantity: 2, price: 4000 },
      { id: "2", name: "Plantain", quantity: 2, price: 1000 },
    ],
    total: 12300,
    status: "completed",
    type: "delivery",
    channel: "uber",
    payment: { transactionId: "TXN-004", status: "paid", method: "paystack", reference: "UBER-2844", subtotal: 10000, discountTotal: 0, taxTotal: 500, deliveryCost: 1500, serviceCharge: 300, paymentFee: 0, totalAmount: 12300 },
    delivery: {
      rider: { name: "Uber Driver", position: "External", phone: "N/A", email: "N/A", assignedAt: "2026-01-14 13:00", updatedAt: "2026-01-14 13:30" },
      customer: { phone: "+234 804 567 8901", region: "Victoria Island", miles: 8.5, address: "25 Adeola Odeku Street, VI", charge: 1500 },
    },
    date: "Jan 14, 2026",
    time: "1:12 PM",
    addedAt: "2026-01-14 12:50:00",
    updatedAt: "2026-01-14 13:30:00",
  },
  {
    id: "OMG-2843",
    customer: { name: "Emmanuel Obi", email: "emmanuelobi@mail.com", phone: "+234 805 678 9012" },
    items: [{ id: "1", name: "Chicken Shawarma", quantity: 1, price: 3500 }],
    total: 3500,
    status: "cancelled",
    type: "takeaway",
    channel: "POS",
    note: "Customer cancelled - out of stock",
    payment: { transactionId: "TXN-005", status: "refunded", method: "cash", reference: "OMG-2843", subtotal: 3500, discountTotal: 0, taxTotal: 0, deliveryCost: 0, serviceCharge: 0, paymentFee: 0, totalAmount: 3500 },
    date: "Jan 14, 2026",
    time: "12:48 PM",
    addedAt: "2026-01-14 12:45:00",
    updatedAt: "2026-01-14 12:50:00",
  },
  {
    id: "OMG-2842",
    customer: { name: "Grace Nwosu", email: "grace.n@company.com", phone: "+234 806 789 0123" },
    items: [
      { id: "1", name: "Jollof Rice", quantity: 4, price: 10000 },
      { id: "2", name: "Fried Rice", quantity: 2, price: 5000 },
      { id: "3", name: "Assorted Meat", quantity: 6, price: 7400 },
    ],
    total: 22400,
    status: "pending",
    type: "delivery",
    channel: "storefront",
    payment: { transactionId: "TXN-006", status: "unpaid", method: "paystack", reference: "PENDING", subtotal: 20000, discountTotal: 0, taxTotal: 1000, deliveryCost: 1200, serviceCharge: 200, paymentFee: 0, totalAmount: 22400 },
    delivery: {
      customer: { phone: "+234 806 789 0123", region: "Ikeja GRA", miles: 12.3, address: "45 Joel Ogunnaike Street, Ikeja", charge: 1200 },
    },
    date: "Jan 14, 2026",
    time: "12:15 PM",
    addedAt: "2026-01-14 12:15:00",
    updatedAt: "2026-01-14 12:15:00",
  },
];

const statusColors: Record<string, string> = {
  pending: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  accepted: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  awaiting_preparation: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  preparing: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  ready: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  awaiting_delivery: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  delivering: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  refunded: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

const paymentStatusColors: Record<string, string> = {
  unpaid: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  partial: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  refunded: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount);
};

const formatStatus = (status: string) => status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-3 sm:p-4">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-7 w-12" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-20" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [datePeriod, setDatePeriod] = useState<DatePeriod>("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const isLoading = useLoading(1000);

  // Apply date period filter
  const dateFilteredOrders = useDatePeriodFilter(
    orders,
    datePeriod,
    customStartDate,
    customEndDate,
    "date" as keyof Order
  );

  // Pre-filter orders
  const preFilteredOrders = dateFilteredOrders.filter(order =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Use table controls hook
  const {
    data: paginatedOrders,
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
  } = useTableControls<Order>({ data: preFilteredOrders, initialPageSize: 10 });

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsSheetOpen(true);
  };

  const stats = [
    { label: "Total Orders", value: orders.length },
    { label: "Pending", value: orders.filter(o => o.status === "pending").length },
    { label: "In Progress", value: orders.filter(o => ["preparing", "ready", "delivering"].includes(o.status)).length },
    { label: "Completed", value: orders.filter(o => o.status === "completed").length },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground">Manage and track all customer orders</p>
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

      {/* Stats */}
      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-xl sm:text-2xl font-semibold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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
        <div className="flex items-center gap-2 flex-wrap">
          <DatePeriodFilter
            value={datePeriod}
            onChange={setDatePeriod}
            onCustomRange={(start, end) => {
              setCustomStartDate(start);
              setCustomEndDate(end);
            }}
            customStartDate={customStartDate}
            customEndDate={customEndDate}
          />
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
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
              <SelectItem value="takeaway">Takeaway</SelectItem>
              <SelectItem value="delivery">Delivery</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <Card>
          <CardContent className="p-0">
            {/* Mobile Card View */}
            <div className="block sm:hidden divide-y divide-border">
              {paginatedOrders.map((order) => (
                <div key={order.id} className="p-4 space-y-3 cursor-pointer hover:bg-muted/50" onClick={() => handleViewOrder(order)}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-medium">#{order.id}</span>
                    <Badge variant="secondary" className={cn("text-xs font-normal", statusColors[order.status])}>
                      {formatStatus(order.status)}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{order.customer.name}</p>
                    <p className="text-xs text-muted-foreground">{order.customer.email}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs font-normal">{order.type}</Badge>
                      <span className="text-xs text-muted-foreground">{order.items.length} items</span>
                    </div>
                    <span className="font-semibold">{formatPrice(order.total)}</span>
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
                    <th className="text-left p-4">
                      <SortableHeader label="Order ID" field="id" currentSortField={sortConfig.field as string | null} currentSortDirection={sortConfig.direction} onSort={handleSort as (field: string) => void} />
                    </th>
                    <th className="text-left p-4">
                      <span className="text-xs font-medium text-muted-foreground">Customer</span>
                    </th>
                    <th className="text-left p-4">
                      <SortableHeader label="Type" field="type" currentSortField={sortConfig.field as string | null} currentSortDirection={sortConfig.direction} onSort={handleSort as (field: string) => void} />
                    </th>
                    <th className="text-left p-4">
                      <SortableHeader label="Channel" field="channel" currentSortField={sortConfig.field as string | null} currentSortDirection={sortConfig.direction} onSort={handleSort as (field: string) => void} />
                    </th>
                    <th className="text-left p-4">
                      <SortableHeader label="Status" field="status" currentSortField={sortConfig.field as string | null} currentSortDirection={sortConfig.direction} onSort={handleSort as (field: string) => void} />
                    </th>
                    <th className="text-left p-4">
                      <SortableHeader label="Total" field="total" currentSortField={sortConfig.field as string | null} currentSortDirection={sortConfig.direction} onSort={handleSort as (field: string) => void} />
                    </th>
                    <th className="text-left p-4">
                      <SortableHeader label="Date" field="date" currentSortField={sortConfig.field as string | null} currentSortDirection={sortConfig.direction} onSort={handleSort as (field: string) => void} />
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4 pr-6 w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order) => (
                    <tr key={order.id} className="group cursor-pointer hover:bg-muted/50 border-b border-border last:border-0" onClick={() => handleViewOrder(order)}>
                      <td className="p-4 pl-6" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" className="rounded border-border" />
                      </td>
                      <td className="p-4 font-mono text-sm font-medium">#{order.id}</td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{order.customer.name}</p>
                          <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary" className="font-normal">{order.type}</Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="font-normal text-xs">{order.channel}</Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary" className={cn("font-normal", statusColors[order.status])}>
                          {formatStatus(order.status)}
                        </Badge>
                      </td>
                      <td className="p-4 font-medium">{formatPrice(order.total)}</td>
                      <td className="p-4">
                        <div>
                          <p className="text-sm">{order.date}</p>
                          <p className="text-sm text-muted-foreground">{order.time}</p>
                        </div>
                      </td>
                      <td className="p-4 pr-6" onClick={(e) => e.stopPropagation()}>
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
      )}

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

      {/* Order Detail Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {selectedOrder && (
            <>
              <SheetHeader className="space-y-1">
                <SheetTitle className="flex items-center gap-2">
                  <span>Order #{selectedOrder.id}</span>
                  <Badge variant="secondary" className={cn("font-normal", statusColors[selectedOrder.status])}>
                    {formatStatus(selectedOrder.status)}
                  </Badge>
                </SheetTitle>
                <SheetDescription>
                  {selectedOrder.date} at {selectedOrder.time}
                </SheetDescription>
              </SheetHeader>

              <Tabs defaultValue="details" className="mt-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="items">Items</TabsTrigger>
                  <TabsTrigger value="payment">Payment</TabsTrigger>
                  <TabsTrigger value="team">Team</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6 mt-4">
                  {/* Customer Details */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Customer Details
                    </h4>
                    <Card>
                      <CardContent className="p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Name</span>
                          <span className="text-sm font-medium">{selectedOrder.customer.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Email</span>
                          <span className="text-sm">{selectedOrder.customer.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Phone</span>
                          <span className="text-sm">{selectedOrder.customer.phone}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Order Details */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Order Details
                    </h4>
                    <Card>
                      <CardContent className="p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Order ID</span>
                          <span className="text-sm font-mono">{selectedOrder.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Type</span>
                          <Badge variant="secondary">{selectedOrder.type}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Status</span>
                          <Badge className={statusColors[selectedOrder.status]}>{formatStatus(selectedOrder.status)}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Channel</span>
                          <Badge variant="outline">{selectedOrder.channel}</Badge>
                        </div>
                        {selectedOrder.tableNumber && (
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Table Number</span>
                            <span className="text-sm font-medium">{selectedOrder.tableNumber}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Added At</span>
                          <span className="text-sm">{selectedOrder.addedAt}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Updated At</span>
                          <span className="text-sm">{selectedOrder.updatedAt}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Note */}
                  {selectedOrder.note && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Special Request
                      </h4>
                      <Card>
                        <CardContent className="p-4">
                          <p className="text-sm text-muted-foreground">{selectedOrder.note}</p>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Delivery Details */}
                  {selectedOrder.delivery?.customer && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Delivery Details
                      </h4>
                      <Card>
                        <CardContent className="p-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Phone</span>
                            <span className="text-sm">{selectedOrder.delivery.customer.phone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Region</span>
                            <span className="text-sm">{selectedOrder.delivery.customer.region}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Distance</span>
                            <span className="text-sm">{selectedOrder.delivery.customer.miles} miles</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Address</span>
                            <span className="text-sm text-right">{selectedOrder.delivery.customer.address}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Delivery Charge</span>
                            <span className="text-sm font-medium">{formatPrice(selectedOrder.delivery.customer.charge)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Pickup Details */}
                  {selectedOrder.pickup && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Pickup Details
                      </h4>
                      <Card>
                        <CardContent className="p-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Address</span>
                            <span className="text-sm">{selectedOrder.pickup.address}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Coordinates</span>
                            <span className="text-sm font-mono">{selectedOrder.pickup.latitude}, {selectedOrder.pickup.longitude}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Phone</span>
                            <span className="text-sm">{selectedOrder.pickup.phone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Email</span>
                            <span className="text-sm">{selectedOrder.pickup.email}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="items" className="space-y-4 mt-4">
                  <h4 className="text-sm font-medium">Order Items ({selectedOrder.items.length})</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <Card key={item.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-medium">{formatPrice(item.price)}</p>
                          </div>
                          {item.variation && (
                            <div className="flex justify-between text-sm pl-4 border-l-2 border-muted mt-2">
                              <span className="text-muted-foreground">+ {item.variation.name}</span>
                              <span>{formatPrice(item.variation.price)}</span>
                            </div>
                          )}
                          {item.addons?.map((addon, idx) => (
                            <div key={idx} className="flex justify-between text-sm pl-4 border-l-2 border-muted mt-1">
                              <span className="text-muted-foreground">+ {addon.name} x{addon.quantity}</span>
                              <span>{formatPrice(addon.price)}</span>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="payment" className="space-y-4 mt-4">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Payment Details
                    </h4>
                    <Card>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Transaction ID</span>
                          <span className="text-sm font-mono">{selectedOrder.payment.transactionId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Status</span>
                          <Badge className={paymentStatusColors[selectedOrder.payment.status]}>{selectedOrder.payment.status}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Method</span>
                          <span className="text-sm capitalize">{selectedOrder.payment.method}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Reference</span>
                          <span className="text-sm font-mono">{selectedOrder.payment.reference}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Subtotal</span>
                          <span className="text-sm">{formatPrice(selectedOrder.payment.subtotal)}</span>
                        </div>
                        {selectedOrder.payment.discountTotal > 0 && (
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Discount</span>
                            <span className="text-sm text-green-600">-{formatPrice(selectedOrder.payment.discountTotal)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Tax</span>
                          <span className="text-sm">{formatPrice(selectedOrder.payment.taxTotal)}</span>
                        </div>
                        {selectedOrder.payment.deliveryCost > 0 && (
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Delivery</span>
                            <span className="text-sm">{formatPrice(selectedOrder.payment.deliveryCost)}</span>
                          </div>
                        )}
                        {selectedOrder.payment.serviceCharge > 0 && (
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Service Charge</span>
                            <span className="text-sm">{formatPrice(selectedOrder.payment.serviceCharge)}</span>
                          </div>
                        )}
                        {selectedOrder.payment.paymentFee > 0 && (
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Payment Fee</span>
                            <span className="text-sm">{formatPrice(selectedOrder.payment.paymentFee)}</span>
                          </div>
                        )}
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Total Amount</span>
                          <span className="text-lg font-bold">{formatPrice(selectedOrder.payment.totalAmount)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="team" className="space-y-6 mt-4">
                  {/* Processor */}
                  {selectedOrder.processor && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Processor Details
                      </h4>
                      <Card>
                        <CardContent className="p-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Name</span>
                            <span className="text-sm font-medium">{selectedOrder.processor.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Position</span>
                            <span className="text-sm">{selectedOrder.processor.position}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Phone</span>
                            <span className="text-sm">{selectedOrder.processor.phone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Email</span>
                            <span className="text-sm">{selectedOrder.processor.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Assigned At</span>
                            <span className="text-sm">{selectedOrder.processor.assignedAt}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Updated At</span>
                            <span className="text-sm">{selectedOrder.processor.updatedAt}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Kitchen */}
                  {selectedOrder.kitchen && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <ChefHat className="h-4 w-4" />
                        Kitchen Details
                      </h4>
                      <Card>
                        <CardContent className="p-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Name</span>
                            <span className="text-sm font-medium">{selectedOrder.kitchen.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Position</span>
                            <span className="text-sm">{selectedOrder.kitchen.position}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Phone</span>
                            <span className="text-sm">{selectedOrder.kitchen.phone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Email</span>
                            <span className="text-sm">{selectedOrder.kitchen.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Assigned At</span>
                            <span className="text-sm">{selectedOrder.kitchen.assignedAt}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Server */}
                  {selectedOrder.server && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <UtensilsCrossed className="h-4 w-4" />
                        Server Details
                      </h4>
                      <Card>
                        <CardContent className="p-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Name</span>
                            <span className="text-sm font-medium">{selectedOrder.server.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Position</span>
                            <span className="text-sm">{selectedOrder.server.position}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Phone</span>
                            <span className="text-sm">{selectedOrder.server.phone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Email</span>
                            <span className="text-sm">{selectedOrder.server.email}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Delivery Rider */}
                  {selectedOrder.delivery?.rider && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Rider Details
                      </h4>
                      <Card>
                        <CardContent className="p-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Name</span>
                            <span className="text-sm font-medium">{selectedOrder.delivery.rider.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Position</span>
                            <span className="text-sm">{selectedOrder.delivery.rider.position}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Phone</span>
                            <span className="text-sm">{selectedOrder.delivery.rider.phone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Assigned At</span>
                            <span className="text-sm">{selectedOrder.delivery.rider.assignedAt}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {!selectedOrder.processor && !selectedOrder.kitchen && !selectedOrder.server && !selectedOrder.delivery?.rider && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm">No team members assigned yet</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <div className="mt-6 flex gap-3">
                <Select defaultValue={selectedOrder.status}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Update Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="awaiting_preparation">Awaiting Preparation</SelectItem>
                    <SelectItem value="preparing">Preparing</SelectItem>
                    <SelectItem value="ready">Ready</SelectItem>
                    <SelectItem value="awaiting_delivery">Awaiting Delivery</SelectItem>
                    <SelectItem value="delivering">Delivering</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
                <Button>Update Order</Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
