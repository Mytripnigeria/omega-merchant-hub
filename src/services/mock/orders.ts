// Mock Order Service
import type { 
  Order, 
  OrderFilters, 
  OrderStats, 
  CreateOrderRequest, 
  UpdateOrderRequest 
} from "@/types/orders";

// Mock data
const mockOrders: Order[] = [
  {
    id: "OMG-2847",
    customer: { id: "1", name: "Adaeze Okonkwo", email: "adaeze@gmail.com", phone: "+234 801 234 5678" },
    items: [
      { id: "1", productId: "p1", name: "Jollof Rice", quantity: 2, price: 2500, variation: { name: "Large", price: 500 }, addons: [{ name: "Extra Chicken", quantity: 1, price: 800 }] },
      { id: "2", productId: "p2", name: "Peppered Chicken", quantity: 3, price: 1500 },
    ],
    total: 8800,
    status: "ready",
    type: "takeaway",
    channel: "POS",
    note: "Please make it extra spicy",
    payment: { transactionId: "TXN-001", status: "paid", method: "paystack", reference: "PAY-2847", subtotal: 8300, discountTotal: 0, taxTotal: 415, deliveryCost: 0, serviceCharge: 85, paymentFee: 0, totalAmount: 8800 },
    processor: { id: "s1", name: "Emmanuel Obi", position: "Cashier", phone: "+234 801 111 2222", email: "emmanuel@omega.com", assignedAt: "2026-01-14 14:30", updatedAt: "2026-01-14 14:32" },
    kitchen: { id: "s2", name: "Chef Amaka", position: "Head Chef", phone: "+234 802 333 4444", email: "amaka@omega.com", assignedAt: "2026-01-14 14:32", updatedAt: "2026-01-14 14:45" },
    storeId: "store-1",
    date: "Jan 14, 2026",
    time: "2:34 PM",
    addedAt: "2026-01-14T14:30:00Z",
    updatedAt: "2026-01-14T14:50:00Z",
  },
  {
    id: "OMG-2846",
    customer: { id: "2", name: "Chinedu Eze", email: "chinedu.eze@mail.com", phone: "+234 802 345 6789" },
    items: [
      { id: "1", productId: "p3", name: "Suya Platter", quantity: 1, price: 5500 },
      { id: "2", productId: "p4", name: "Fried Rice", quantity: 2, price: 3000 },
      { id: "3", productId: "p5", name: "Chapman", quantity: 2, price: 2000 },
    ],
    total: 15500,
    status: "preparing",
    type: "delivery",
    channel: "storefront",
    payment: { transactionId: "TXN-002", status: "paid", method: "flutterwave", reference: "FLW-2846", subtotal: 14000, discountTotal: 500, taxTotal: 700, deliveryCost: 1000, serviceCharge: 300, paymentFee: 0, totalAmount: 15500 },
    processor: { id: "s3", name: "Grace Nwosu", position: "Cashier", phone: "+234 803 555 6666", email: "grace@omega.com", assignedAt: "2026-01-14 14:25", updatedAt: "2026-01-14 14:28" },
    kitchen: { id: "s4", name: "Chef Bola", position: "Sous Chef", phone: "+234 804 777 8888", email: "bola@omega.com", assignedAt: "2026-01-14 14:28", updatedAt: "2026-01-14 14:35" },
    delivery: {
      rider: { id: "s5", name: "Tunde Rider", position: "Delivery Rider", phone: "+234 805 999 0000", email: "tunde@omega.com", assignedAt: "2026-01-14 14:40", updatedAt: "2026-01-14 14:40" },
      customer: { phone: "+234 802 345 6789", region: "Lekki Phase 1", miles: 5.2, address: "12 Admiralty Way, Lekki", charge: 1000 },
    },
    storeId: "store-1",
    date: "Jan 14, 2026",
    time: "2:28 PM",
    addedAt: "2026-01-14T14:25:00Z",
    updatedAt: "2026-01-14T14:40:00Z",
  },
  {
    id: "OMG-2845",
    customer: { id: "3", name: "Oluwaseun Adeyemi", email: "seun.a@outlook.com", phone: "+234 803 456 7890" },
    items: [{ id: "1", productId: "p6", name: "Amala & Ewedu", quantity: 2, price: 3100 }],
    total: 6200,
    status: "completed",
    type: "dine-in",
    channel: "POS",
    tableNumber: "T-05",
    payment: { transactionId: "TXN-003", status: "paid", method: "cash", reference: "OMG-2845", subtotal: 6000, discountTotal: 0, taxTotal: 200, deliveryCost: 0, serviceCharge: 0, paymentFee: 0, totalAmount: 6200 },
    server: { id: "s6", name: "Funke Waiter", position: "Server", phone: "+234 806 111 2222", email: "funke@omega.com", assignedAt: "2026-01-14 13:40", updatedAt: "2026-01-14 14:00" },
    storeId: "store-1",
    date: "Jan 14, 2026",
    time: "1:45 PM",
    addedAt: "2026-01-14T13:40:00Z",
    updatedAt: "2026-01-14T14:05:00Z",
  },
  {
    id: "OMG-2844",
    customer: { id: "4", name: "Fatima Abubakar", email: "fatima.abu@gmail.com", phone: "+234 804 567 8901" },
    items: [
      { id: "1", productId: "p7", name: "Pepper Soup", quantity: 2, price: 4000 },
      { id: "2", productId: "p8", name: "Plantain", quantity: 2, price: 1000 },
    ],
    total: 12300,
    status: "completed",
    type: "delivery",
    channel: "uber",
    payment: { transactionId: "TXN-004", status: "paid", method: "paystack", reference: "UBER-2844", subtotal: 10000, discountTotal: 0, taxTotal: 500, deliveryCost: 1500, serviceCharge: 300, paymentFee: 0, totalAmount: 12300 },
    delivery: {
      rider: { id: "ext-1", name: "Uber Driver", position: "External", phone: "N/A", email: "N/A", assignedAt: "2026-01-14 13:00", updatedAt: "2026-01-14 13:30" },
      customer: { phone: "+234 804 567 8901", region: "Victoria Island", miles: 8.5, address: "25 Adeola Odeku Street, VI", charge: 1500 },
    },
    storeId: "store-1",
    date: "Jan 14, 2026",
    time: "1:12 PM",
    addedAt: "2026-01-14T12:50:00Z",
    updatedAt: "2026-01-14T13:30:00Z",
  },
  {
    id: "OMG-2843",
    customer: { id: "5", name: "Emmanuel Obi", email: "emmanuelobi@mail.com", phone: "+234 805 678 9012" },
    items: [{ id: "1", productId: "p9", name: "Chicken Shawarma", quantity: 1, price: 3500 }],
    total: 3500,
    status: "cancelled",
    type: "takeaway",
    channel: "POS",
    note: "Customer cancelled - out of stock",
    payment: { transactionId: "TXN-005", status: "refunded", method: "cash", reference: "OMG-2843", subtotal: 3500, discountTotal: 0, taxTotal: 0, deliveryCost: 0, serviceCharge: 0, paymentFee: 0, totalAmount: 3500 },
    storeId: "store-1",
    date: "Jan 14, 2026",
    time: "12:48 PM",
    addedAt: "2026-01-14T12:45:00Z",
    updatedAt: "2026-01-14T12:50:00Z",
  },
  {
    id: "OMG-2842",
    customer: { id: "6", name: "Grace Nwosu", email: "grace.n@company.com", phone: "+234 806 789 0123" },
    items: [
      { id: "1", productId: "p1", name: "Jollof Rice", quantity: 4, price: 10000 },
      { id: "2", productId: "p4", name: "Fried Rice", quantity: 2, price: 5000 },
      { id: "3", productId: "p10", name: "Assorted Meat", quantity: 6, price: 7400 },
    ],
    total: 22400,
    status: "pending",
    type: "delivery",
    channel: "storefront",
    payment: { transactionId: "TXN-006", status: "unpaid", method: "paystack", reference: "PENDING", subtotal: 20000, discountTotal: 0, taxTotal: 1000, deliveryCost: 1200, serviceCharge: 200, paymentFee: 0, totalAmount: 22400 },
    delivery: {
      customer: { phone: "+234 806 789 0123", region: "Ikeja GRA", miles: 12.3, address: "45 Joel Ogunnaike Street, Ikeja", charge: 1200 },
    },
    storeId: "store-1",
    date: "Jan 14, 2026",
    time: "12:15 PM",
    addedAt: "2026-01-14T12:15:00Z",
    updatedAt: "2026-01-14T12:15:00Z",
  },
];

// Simulated delay for API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Order Service API
export const orderService = {
  // Get all orders with optional filters
  async getOrders(filters?: OrderFilters): Promise<Order[]> {
    await delay(300);
    
    let result = [...mockOrders];
    
    if (filters?.status) {
      result = result.filter(o => o.status === filters.status);
    }
    if (filters?.type) {
      result = result.filter(o => o.type === filters.type);
    }
    if (filters?.channel) {
      result = result.filter(o => o.channel === filters.channel);
    }
    if (filters?.paymentStatus) {
      result = result.filter(o => o.payment.status === filters.paymentStatus);
    }
    if (filters?.storeId) {
      result = result.filter(o => o.storeId === filters.storeId);
    }
    if (filters?.customerId) {
      result = result.filter(o => o.customer.id === filters.customerId);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(o => 
        o.id.toLowerCase().includes(search) ||
        o.customer.name.toLowerCase().includes(search) ||
        o.customer.email.toLowerCase().includes(search)
      );
    }
    
    return result;
  },

  // Get single order by ID
  async getOrder(id: string): Promise<Order | null> {
    await delay(200);
    return mockOrders.find(o => o.id === id) || null;
  },

  // Create new order
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    await delay(500);
    const newOrder: Order = {
      id: `OMG-${Date.now().toString().slice(-4)}`,
      customer: { id: data.customerId, name: "New Customer", email: "", phone: "" },
      items: data.items.map((item, idx) => ({ ...item, id: `item-${idx}` })),
      total: data.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: "pending",
      type: data.type,
      channel: data.channel,
      tableNumber: data.tableNumber,
      note: data.note,
      payment: {
        transactionId: "",
        status: "unpaid",
        method: "cash",
        reference: "",
        subtotal: 0,
        discountTotal: 0,
        taxTotal: 0,
        deliveryCost: 0,
        serviceCharge: 0,
        paymentFee: 0,
        totalAmount: 0,
      },
      storeId: data.storeId,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      addedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockOrders.unshift(newOrder);
    return newOrder;
  },

  // Update order
  async updateOrder(id: string, data: UpdateOrderRequest): Promise<Order | null> {
    await delay(300);
    const index = mockOrders.findIndex(o => o.id === id);
    if (index === -1) return null;
    
    mockOrders[index] = {
      ...mockOrders[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockOrders[index];
  },

  // Delete order
  async deleteOrder(id: string): Promise<boolean> {
    await delay(300);
    const index = mockOrders.findIndex(o => o.id === id);
    if (index === -1) return false;
    mockOrders.splice(index, 1);
    return true;
  },

  // Get order statistics
  async getStats(storeId?: string): Promise<OrderStats> {
    await delay(200);
    const orders = storeId ? mockOrders.filter(o => o.storeId === storeId) : mockOrders;
    
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === "pending").length,
      inProgress: orders.filter(o => ["preparing", "ready", "delivering"].includes(o.status)).length,
      completed: orders.filter(o => o.status === "completed").length,
      cancelled: orders.filter(o => o.status === "cancelled").length,
      totalRevenue: orders.filter(o => o.payment.status === "paid").reduce((sum, o) => sum + o.total, 0),
    };
  },
};
