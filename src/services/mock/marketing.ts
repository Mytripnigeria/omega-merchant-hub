// Marketing Mock Service
import type {
  DiscountCode,
  LoyaltyTier,
  LoyaltySettings,
  Referral,
  DiscountCodeFilters,
  LoyaltyTierFilters,
  ReferralFilters,
  CreateDiscountCodeRequest,
  UpdateDiscountCodeRequest,
  CreateLoyaltyTierRequest,
  UpdateLoyaltyTierRequest,
  UpdateLoyaltySettingsRequest,
  CreateReferralRequest,
  UpdateReferralRequest,
  MarketingStats,
} from "@/types/marketing";

// Mock data
const mockDiscountCodes: DiscountCode[] = [
  {
    id: "disc-001",
    storeId: "store-1",
    code: "WELCOME20",
    name: "Welcome Discount",
    description: "20% off for new customers",
    type: "percentage",
    value: 20,
    minOrderAmount: 5000,
    maxDiscountAmount: 2000,
    applicableTo: "all",
    usageLimit: 100,
    usageCount: 45,
    usageLimitPerCustomer: 1,
    validFrom: "2024-01-01",
    validTo: "2024-03-31",
    status: "active",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "disc-002",
    storeId: "store-1",
    code: "SAVE500",
    name: "Flat ₦500 Off",
    type: "fixed",
    value: 500,
    minOrderAmount: 3000,
    applicableTo: "all",
    usageLimit: 200,
    usageCount: 120,
    validFrom: "2024-01-15",
    validTo: "2024-02-28",
    status: "active",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
];

const mockLoyaltyTiers: LoyaltyTier[] = [
  {
    id: "tier-001",
    storeId: "store-1",
    name: "Bronze",
    description: "Entry level membership",
    minPoints: 0,
    maxPoints: 999,
    color: "#CD7F32",
    benefits: [
      { id: "ben-001", type: "discount", value: 5, description: "5% off all orders" },
    ],
    memberCount: 150,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "tier-002",
    storeId: "store-1",
    name: "Silver",
    description: "Regular customers",
    minPoints: 1000,
    maxPoints: 4999,
    color: "#C0C0C0",
    benefits: [
      { id: "ben-002", type: "discount", value: 10, description: "10% off all orders" },
      { id: "ben-003", type: "free-shipping", value: 0, description: "Free delivery" },
    ],
    memberCount: 75,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "tier-003",
    storeId: "store-1",
    name: "Gold",
    description: "VIP customers",
    minPoints: 5000,
    color: "#FFD700",
    benefits: [
      { id: "ben-004", type: "discount", value: 15, description: "15% off all orders" },
      { id: "ben-005", type: "free-shipping", value: 0, description: "Free delivery" },
      { id: "ben-006", type: "exclusive-access", value: 0, description: "Early access to new items" },
    ],
    memberCount: 25,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

const mockLoyaltySettings: LoyaltySettings = {
  id: "settings-001",
  storeId: "store-1",
  pointsPerNaira: 0.1,
  nairaPerPoint: 1,
  welcomePoints: 100,
  birthdayPoints: 500,
  referralPoints: 200,
  expiryDays: 365,
  isActive: true,
};

const mockReferrals: Referral[] = [
  {
    id: "ref-001",
    storeId: "store-1",
    referrerId: "cust-001",
    referrerName: "Adebayo Johnson",
    referredId: "cust-005",
    referredName: "Ngozi Eze",
    referredEmail: "ngozi@email.com",
    referredPhone: "+234 804 444 4444",
    referralCode: "ADEBAYO100",
    status: "rewarded",
    referrerReward: 200,
    referredReward: 100,
    rewardType: "points",
    convertedAt: "2024-01-15T00:00:00Z",
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "ref-002",
    storeId: "store-1",
    referrerId: "cust-002",
    referrerName: "Chidinma Okafor",
    referredEmail: "friend@email.com",
    referralCode: "CHIDI200",
    status: "pending",
    referrerReward: 200,
    referredReward: 100,
    rewardType: "points",
    expiresAt: "2024-02-28T00:00:00Z",
    createdAt: "2024-01-18T00:00:00Z",
    updatedAt: "2024-01-18T00:00:00Z",
  },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const marketingService = {
  // Discount Codes
  async getDiscountCodes(filters?: DiscountCodeFilters): Promise<{ data: DiscountCode[]; total: number }> {
    await delay(300);
    let result = [...mockDiscountCodes];
    
    if (filters?.storeId) result = result.filter(d => d.storeId === filters.storeId);
    if (filters?.status) result = result.filter(d => d.status === filters.status);
    if (filters?.type) result = result.filter(d => d.type === filters.type);
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(d => 
        d.code.toLowerCase().includes(search) ||
        d.name.toLowerCase().includes(search)
      );
    }
    
    return { data: result, total: result.length };
  },

  async getDiscountCode(id: string): Promise<DiscountCode | null> {
    await delay(200);
    return mockDiscountCodes.find(d => d.id === id) || null;
  },

  async createDiscountCode(data: CreateDiscountCodeRequest): Promise<DiscountCode> {
    await delay(400);
    const newCode: DiscountCode = {
      ...data,
      id: `disc-${Date.now()}`,
      usageCount: 0,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockDiscountCodes.push(newCode);
    return newCode;
  },

  async updateDiscountCode(id: string, data: UpdateDiscountCodeRequest): Promise<DiscountCode | null> {
    await delay(300);
    const index = mockDiscountCodes.findIndex(d => d.id === id);
    if (index === -1) return null;
    mockDiscountCodes[index] = { ...mockDiscountCodes[index], ...data, updatedAt: new Date().toISOString() };
    return mockDiscountCodes[index];
  },

  async deleteDiscountCode(id: string): Promise<boolean> {
    await delay(300);
    const index = mockDiscountCodes.findIndex(d => d.id === id);
    if (index === -1) return false;
    mockDiscountCodes.splice(index, 1);
    return true;
  },

  // Loyalty Tiers
  async getLoyaltyTiers(filters?: LoyaltyTierFilters): Promise<{ data: LoyaltyTier[]; total: number }> {
    await delay(300);
    let result = [...mockLoyaltyTiers];
    if (filters?.storeId) result = result.filter(t => t.storeId === filters.storeId);
    return { data: result, total: result.length };
  },

  async getLoyaltyTier(id: string): Promise<LoyaltyTier | null> {
    await delay(200);
    return mockLoyaltyTiers.find(t => t.id === id) || null;
  },

  async createLoyaltyTier(data: CreateLoyaltyTierRequest): Promise<LoyaltyTier> {
    await delay(400);
    const newTier: LoyaltyTier = {
      ...data,
      id: `tier-${Date.now()}`,
      benefits: data.benefits.map((b, i) => ({ ...b, id: `ben-${Date.now()}-${i}` })),
      memberCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockLoyaltyTiers.push(newTier);
    return newTier;
  },

  async updateLoyaltyTier(id: string, data: UpdateLoyaltyTierRequest): Promise<LoyaltyTier | null> {
    await delay(300);
    const index = mockLoyaltyTiers.findIndex(t => t.id === id);
    if (index === -1) return null;
    mockLoyaltyTiers[index] = { ...mockLoyaltyTiers[index], ...data, updatedAt: new Date().toISOString() };
    return mockLoyaltyTiers[index];
  },

  async deleteLoyaltyTier(id: string): Promise<boolean> {
    await delay(300);
    const index = mockLoyaltyTiers.findIndex(t => t.id === id);
    if (index === -1) return false;
    mockLoyaltyTiers.splice(index, 1);
    return true;
  },

  // Loyalty Settings
  async getLoyaltySettings(storeId: string): Promise<LoyaltySettings> {
    await delay(200);
    return { ...mockLoyaltySettings, storeId };
  },

  async updateLoyaltySettings(storeId: string, data: UpdateLoyaltySettingsRequest): Promise<LoyaltySettings> {
    await delay(300);
    Object.assign(mockLoyaltySettings, data);
    return mockLoyaltySettings;
  },

  // Referrals
  async getReferrals(filters?: ReferralFilters): Promise<{ data: Referral[]; total: number }> {
    await delay(300);
    let result = [...mockReferrals];
    
    if (filters?.storeId) result = result.filter(r => r.storeId === filters.storeId);
    if (filters?.referrerId) result = result.filter(r => r.referrerId === filters.referrerId);
    if (filters?.status) result = result.filter(r => r.status === filters.status);
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(r => 
        r.referrerName.toLowerCase().includes(search) ||
        r.referredEmail.toLowerCase().includes(search)
      );
    }
    
    return { data: result, total: result.length };
  },

  async getReferral(id: string): Promise<Referral | null> {
    await delay(200);
    return mockReferrals.find(r => r.id === id) || null;
  },

  async createReferral(data: CreateReferralRequest): Promise<Referral> {
    await delay(400);
    const newReferral: Referral = {
      ...data,
      id: `ref-${Date.now()}`,
      referrerName: "Customer", // Would be fetched from customer service
      referralCode: `REF${Date.now().toString(36).toUpperCase()}`,
      status: "pending",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockReferrals.push(newReferral);
    return newReferral;
  },

  async updateReferral(id: string, data: UpdateReferralRequest): Promise<Referral | null> {
    await delay(300);
    const index = mockReferrals.findIndex(r => r.id === id);
    if (index === -1) return null;
    mockReferrals[index] = { ...mockReferrals[index], ...data, updatedAt: new Date().toISOString() };
    return mockReferrals[index];
  },

  // Stats
  async getStats(storeId?: string): Promise<MarketingStats> {
    await delay(200);
    const discounts = storeId ? mockDiscountCodes.filter(d => d.storeId === storeId) : mockDiscountCodes;
    const tiers = storeId ? mockLoyaltyTiers.filter(t => t.storeId === storeId) : mockLoyaltyTiers;
    const referrals = storeId ? mockReferrals.filter(r => r.storeId === storeId) : mockReferrals;
    
    return {
      activeDiscounts: discounts.filter(d => d.status === 'active').length,
      totalDiscountUsage: discounts.reduce((sum, d) => sum + d.usageCount, 0),
      totalDiscountValue: 125000,
      loyaltyMembers: tiers.reduce((sum, t) => sum + t.memberCount, 0),
      pointsIssued: 50000,
      pointsRedeemed: 15000,
      totalReferrals: referrals.length,
      successfulReferrals: referrals.filter(r => r.status === 'rewarded').length,
      referralConversionRate: 45.5,
    };
  },
};
