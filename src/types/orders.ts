// Order Domain Types

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  variation?: { name: string; price: number };
  addons?: { name: string; quantity: number; price: number }[];
  specialInstructions?: string;
}

export type OrderStatus = 
  | "pending" 
  | "accepted" 
  | "awaiting_preparation" 
  | "preparing" 
  | "ready" 
  | "awaiting_delivery" 
  | "delivering" 
  | "completed" 
  | "cancelled" 
  | "refunded";

export type OrderType = "dine-in" | "takeaway" | "delivery";
export type OrderChannel = "POS" | "storefront" | "uber" | "glovo" | "chowdeck";
export type PaymentStatus = "unpaid" | "partial" | "paid" | "refunded";
export type PaymentMethod = "cash" | "paystack" | "flutterwave" | "transfer" | "card";

export interface OrderPayment {
  transactionId: string;
  status: PaymentStatus;
  method: PaymentMethod;
  reference: string;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  deliveryCost: number;
  serviceCharge: number;
  paymentFee: number;
  totalAmount: number;
}

export interface OrderStaff {
  id: string;
  name: string;
  position: string;
  phone: string;
  email: string;
  assignedAt: string;
  updatedAt: string;
}

export interface OrderDelivery {
  rider?: OrderStaff;
  customer?: {
    phone: string;
    region: string;
    miles: number;
    address: string;
    charge: number;
  };
}

export interface OrderPickup {
  address: string;
  longitude: number;
  latitude: number;
  phone: string;
  email: string;
}

export interface Order {
  id: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  type: OrderType;
  channel: OrderChannel;
  tableNumber?: string;
  note?: string;
  payment: OrderPayment;
  processor?: OrderStaff;
  kitchen?: OrderStaff;
  server?: OrderStaff;
  delivery?: OrderDelivery;
  pickup?: OrderPickup;
  storeId: string;
  date: string;
  time: string;
  addedAt: string;
  updatedAt: string;
}

// API Request/Response Types
export interface CreateOrderRequest {
  customerId: string;
  items: Omit<OrderItem, 'id'>[];
  type: OrderType;
  channel: OrderChannel;
  tableNumber?: string;
  note?: string;
  storeId: string;
}

export interface UpdateOrderRequest {
  status?: OrderStatus;
  items?: OrderItem[];
  note?: string;
  processorId?: string;
  kitchenStaffId?: string;
  serverId?: string;
  riderId?: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  type?: OrderType;
  channel?: OrderChannel;
  paymentStatus?: PaymentStatus;
  storeId?: string;
  customerId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface OrderStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  totalRevenue: number;
}
