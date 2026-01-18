// Mock Customer Service
import type { 
  Customer, 
  CustomerFilters, 
  CustomerStats, 
  CreateCustomerRequest, 
  UpdateCustomerRequest,
  WalletTransaction,
  PointsTransaction 
} from "@/types/customers";

// Mock data
const mockCustomers: Customer[] = [
  {
    id: "1",
    firstName: "Adaeze",
    lastName: "Okonkwo",
    email: "adaeze@gmail.com",
    phone: "+234 803 456 7890",
    birthday: "1990-05-15",
    gender: "Female",
    country: "Nigeria",
    state: "Lagos",
    city: "Ikeja",
    street: "123 Allen Avenue",
    zipCode: "100001",
    orders: 24,
    spent: 156800,
    lastOrder: "2 hours ago",
    status: "Active",
    source: "POS",
    walletBalance: 5000,
    points: 1250,
    loyaltyTier: "gold",
    groups: ["Regular", "Loyal"],
    referralCode: "ADAEZE2024",
    recentOrders: [
      { id: "ORD-001", date: "2026-01-15", total: 8500, status: "Completed", items: 3 },
      { id: "ORD-002", date: "2026-01-10", total: 12000, status: "Completed", items: 5 },
    ],
    createdAt: "2024-03-15T00:00:00Z",
    updatedAt: "2026-01-14T00:00:00Z",
  },
  {
    id: "2",
    firstName: "Chinedu",
    lastName: "Eze",
    email: "chinedu.eze@mail.com",
    phone: "+234 805 123 4567",
    birthday: "1985-08-20",
    gender: "Male",
    country: "Nigeria",
    state: "Lagos",
    city: "Victoria Island",
    street: "45 Adeola Odeku",
    zipCode: "100212",
    orders: 18,
    spent: 98500,
    lastOrder: "1 day ago",
    status: "Active",
    source: "Storefront",
    walletBalance: 0,
    points: 850,
    loyaltyTier: "silver",
    groups: ["Regular"],
    referralCode: "CHINEDU2024",
    recentOrders: [],
    createdAt: "2024-06-20T00:00:00Z",
    updatedAt: "2026-01-13T00:00:00Z",
  },
  {
    id: "3",
    firstName: "Oluwaseun",
    lastName: "Adeyemi",
    email: "seun.a@outlook.com",
    phone: "+234 809 876 5432",
    birthday: "1992-12-01",
    gender: "Male",
    country: "Nigeria",
    state: "Lagos",
    city: "Lekki",
    street: "10 Admiralty Way",
    zipCode: "105102",
    orders: 45,
    spent: 312000,
    lastOrder: "3 hours ago",
    status: "VIP",
    source: "POS",
    walletBalance: 15000,
    points: 3200,
    loyaltyTier: "platinum",
    groups: ["VIP", "Loyal", "Corporate"],
    referralCode: "SEUN2024",
    recentOrders: [],
    createdAt: "2023-11-10T00:00:00Z",
    updatedAt: "2026-01-14T00:00:00Z",
  },
  {
    id: "4",
    firstName: "Fatima",
    lastName: "Abubakar",
    email: "fatima.abu@gmail.com",
    phone: "+234 802 345 6789",
    birthday: "1988-03-25",
    gender: "Female",
    country: "Nigeria",
    state: "Abuja",
    city: "Wuse",
    street: "Plot 123 Wuse 2",
    zipCode: "900001",
    orders: 12,
    spent: 67200,
    lastOrder: "5 days ago",
    status: "Active",
    source: "UberEats",
    walletBalance: 2500,
    points: 450,
    loyaltyTier: "silver",
    groups: ["Regular"],
    referralCode: "FATIMA2024",
    recentOrders: [],
    createdAt: "2024-09-05T00:00:00Z",
    updatedAt: "2026-01-09T00:00:00Z",
  },
  {
    id: "5",
    firstName: "Emmanuel",
    lastName: "Obi",
    email: "emmanuelobi@mail.com",
    phone: "+234 806 234 5678",
    birthday: "1995-07-10",
    gender: "Male",
    country: "Nigeria",
    state: "Lagos",
    city: "Surulere",
    street: "20 Adeniran Ogunsanya",
    zipCode: "101283",
    orders: 8,
    spent: 42500,
    lastOrder: "2 weeks ago",
    status: "Inactive",
    source: "Storefront",
    walletBalance: 0,
    points: 200,
    loyaltyTier: "bronze",
    groups: [],
    referralCode: "EMMA2024",
    recentOrders: [],
    createdAt: "2025-02-14T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
];

const mockWalletTransactions: WalletTransaction[] = [
  { id: "wt-1", customerId: "1", type: "credit", amount: 5000, balance: 5000, description: "Wallet top-up", createdAt: "2026-01-10T00:00:00Z" },
  { id: "wt-2", customerId: "3", type: "credit", amount: 20000, balance: 20000, description: "Wallet top-up", createdAt: "2026-01-08T00:00:00Z" },
  { id: "wt-3", customerId: "3", type: "debit", amount: 5000, balance: 15000, description: "Order payment", reference: "ORD-123", createdAt: "2026-01-12T00:00:00Z" },
];

const mockPointsTransactions: PointsTransaction[] = [
  { id: "pt-1", customerId: "1", type: "earned", points: 250, balance: 1250, description: "Order bonus", orderId: "ORD-001", createdAt: "2026-01-15T00:00:00Z" },
  { id: "pt-2", customerId: "3", type: "redeemed", points: 500, balance: 3200, description: "Discount redemption", createdAt: "2026-01-12T00:00:00Z" },
];

// Simulated delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Customer Service API
export const customerService = {
  // Get all customers
  async getCustomers(filters?: CustomerFilters): Promise<Customer[]> {
    await delay(300);
    
    let result = [...mockCustomers];
    
    if (filters?.status) {
      result = result.filter(c => c.status === filters.status);
    }
    if (filters?.loyaltyTier) {
      result = result.filter(c => c.loyaltyTier === filters.loyaltyTier);
    }
    if (filters?.source) {
      result = result.filter(c => c.source === filters.source);
    }
    if (filters?.group) {
      result = result.filter(c => c.groups.includes(filters.group!));
    }
    if (filters?.minSpent !== undefined) {
      result = result.filter(c => c.spent >= filters.minSpent!);
    }
    if (filters?.maxSpent !== undefined) {
      result = result.filter(c => c.spent <= filters.maxSpent!);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(c => 
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search) ||
        c.phone.includes(search)
      );
    }
    
    return result;
  },

  // Get single customer
  async getCustomer(id: string): Promise<Customer | null> {
    await delay(200);
    return mockCustomers.find(c => c.id === id) || null;
  },

  // Create customer
  async createCustomer(data: CreateCustomerRequest): Promise<Customer> {
    await delay(500);
    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      birthday: data.birthday,
      gender: data.gender,
      country: data.country || "Nigeria",
      state: data.state || "",
      city: data.city || "",
      street: data.street,
      zipCode: data.zipCode,
      orders: 0,
      spent: 0,
      status: "Active",
      source: "POS",
      walletBalance: 0,
      points: 0,
      loyaltyTier: "bronze",
      groups: data.groups || [],
      referralCode: `${data.firstName.toUpperCase().slice(0, 4)}${Date.now().toString().slice(-4)}`,
      recentOrders: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockCustomers.unshift(newCustomer);
    return newCustomer;
  },

  // Update customer
  async updateCustomer(id: string, data: UpdateCustomerRequest): Promise<Customer | null> {
    await delay(300);
    const index = mockCustomers.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    mockCustomers[index] = {
      ...mockCustomers[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockCustomers[index];
  },

  // Delete customer
  async deleteCustomer(id: string): Promise<boolean> {
    await delay(300);
    const index = mockCustomers.findIndex(c => c.id === id);
    if (index === -1) return false;
    mockCustomers.splice(index, 1);
    return true;
  },

  // Get stats
  async getStats(): Promise<CustomerStats> {
    await delay(200);
    
    return {
      total: mockCustomers.length,
      active: mockCustomers.filter(c => c.status === "Active").length,
      vip: mockCustomers.filter(c => c.status === "VIP").length,
      newThisMonth: mockCustomers.filter(c => {
        const created = new Date(c.createdAt);
        const now = new Date();
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
      }).length,
      totalWalletBalance: mockCustomers.reduce((sum, c) => sum + c.walletBalance, 0),
      totalPoints: mockCustomers.reduce((sum, c) => sum + c.points, 0),
    };
  },

  // Wallet operations
  async getWalletTransactions(customerId: string): Promise<WalletTransaction[]> {
    await delay(200);
    return mockWalletTransactions.filter(t => t.customerId === customerId);
  },

  async creditWallet(customerId: string, amount: number, description: string): Promise<WalletTransaction> {
    await delay(300);
    const customer = mockCustomers.find(c => c.id === customerId);
    if (!customer) throw new Error("Customer not found");
    
    customer.walletBalance += amount;
    const transaction: WalletTransaction = {
      id: `wt-${Date.now()}`,
      customerId,
      type: "credit",
      amount,
      balance: customer.walletBalance,
      description,
      createdAt: new Date().toISOString(),
    };
    mockWalletTransactions.push(transaction);
    return transaction;
  },

  async debitWallet(customerId: string, amount: number, description: string, reference?: string): Promise<WalletTransaction> {
    await delay(300);
    const customer = mockCustomers.find(c => c.id === customerId);
    if (!customer) throw new Error("Customer not found");
    if (customer.walletBalance < amount) throw new Error("Insufficient balance");
    
    customer.walletBalance -= amount;
    const transaction: WalletTransaction = {
      id: `wt-${Date.now()}`,
      customerId,
      type: "debit",
      amount,
      balance: customer.walletBalance,
      description,
      reference,
      createdAt: new Date().toISOString(),
    };
    mockWalletTransactions.push(transaction);
    return transaction;
  },

  // Points operations
  async getPointsTransactions(customerId: string): Promise<PointsTransaction[]> {
    await delay(200);
    return mockPointsTransactions.filter(t => t.customerId === customerId);
  },

  async addPoints(customerId: string, points: number, description: string, orderId?: string): Promise<PointsTransaction> {
    await delay(300);
    const customer = mockCustomers.find(c => c.id === customerId);
    if (!customer) throw new Error("Customer not found");
    
    customer.points += points;
    const transaction: PointsTransaction = {
      id: `pt-${Date.now()}`,
      customerId,
      type: "earned",
      points,
      balance: customer.points,
      description,
      orderId,
      createdAt: new Date().toISOString(),
    };
    mockPointsTransactions.push(transaction);
    return transaction;
  },

  async redeemPoints(customerId: string, points: number, description: string): Promise<PointsTransaction> {
    await delay(300);
    const customer = mockCustomers.find(c => c.id === customerId);
    if (!customer) throw new Error("Customer not found");
    if (customer.points < points) throw new Error("Insufficient points");
    
    customer.points -= points;
    const transaction: PointsTransaction = {
      id: `pt-${Date.now()}`,
      customerId,
      type: "redeemed",
      points,
      balance: customer.points,
      description,
      createdAt: new Date().toISOString(),
    };
    mockPointsTransactions.push(transaction);
    return transaction;
  },
};
