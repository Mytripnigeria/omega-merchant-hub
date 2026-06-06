// Operations Mock Service
import type {
  Checklist,
  Expense,
  WasteLog,
  KPITarget,
  SalesTarget,
  ChecklistFilters,
  ExpenseFilters,
  WasteLogFilters,
  KPITargetFilters,
  SalesTargetFilters,
  CreateChecklistRequest,
  UpdateChecklistRequest,
  CreateExpenseRequest,
  UpdateExpenseRequest,
  CreateWasteLogRequest,
  UpdateWasteLogRequest,
  CreateKPITargetRequest,
  UpdateKPITargetRequest,
  CreateSalesTargetRequest,
  UpdateSalesTargetRequest,
  OperationsStats,
} from "@/types/operations";

// Checklists are now served from the real backend (see services/api/checklists.ts).
// The mock array is kept as an empty stub so the legacy `operationsService.getChecklists`
// signature still type-checks for any straggler callers; new code should use
// `checklistsApi` via the use-modules hooks.
const mockChecklists: Checklist[] = [];

const mockExpenses: Expense[] = [
  {
    id: "exp-001",
    storeId: "store-1",
    category: "supplies",
    name: "Cleaning Supplies",
    description: "Monthly cleaning supplies purchase",
    amount: 45000,
    date: "2024-01-18",
    vendor: "CleanCo Supplies",
    paymentMethod: "bank-transfer",
    status: "approved",
    approvedBy: "staff-001",
    approvedAt: "2024-01-18T14:00:00Z",
    submittedBy: "staff-002",
    submittedByName: "Amina Bello",
    createdAt: "2024-01-18T10:00:00Z",
    updatedAt: "2024-01-18T14:00:00Z",
  },
  {
    id: "exp-002",
    storeId: "store-1",
    category: "utilities",
    name: "Electricity Bill",
    amount: 85000,
    date: "2024-01-15",
    vendor: "EKEDC",
    paymentMethod: "bank-transfer",
    status: "paid",
    submittedBy: "staff-001",
    submittedByName: "Emeka Okonkwo",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-16T00:00:00Z",
  },
];

const mockWasteLogs: WasteLog[] = [
  {
    id: "waste-001",
    storeId: "store-1",
    productId: "prod-001",
    productName: "Jollof Rice",
    quantity: 2.5,
    unit: "kg",
    reason: "expired",
    estimatedValue: 3500,
    date: "2024-01-20",
    time: "14:30",
    reportedBy: "staff-003",
    reportedByName: "Yusuf Adeleke",
    notes: "Prepared yesterday, not sold",
    createdAt: "2024-01-20T14:30:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },
  {
    id: "waste-002",
    storeId: "store-1",
    ingredientId: "ing-002",
    ingredientName: "Tomatoes",
    productName: "Raw Ingredients",
    quantity: 5,
    unit: "kg",
    reason: "damaged",
    estimatedValue: 2500,
    date: "2024-01-19",
    reportedBy: "staff-003",
    reportedByName: "Yusuf Adeleke",
    createdAt: "2024-01-19T09:00:00Z",
    updatedAt: "2024-01-19T09:00:00Z",
  },
];

// KPI targets are now served from the real backend (services/api/kpi-targets.ts).
// This empty stub satisfies the legacy `operationsService.getKPITargets` signature.
const mockKPITargets: KPITarget[] = [];

const mockSalesTargets: SalesTarget[] = [
  {
    id: "st-001",
    storeId: "store-1",
    name: "January Sales Goal",
    targetAmount: 15000000,
    currentAmount: 9750000,
    period: "month",
    periodStart: "2024-01-01",
    periodEnd: "2024-01-31",
    status: "active",
    progress: 65,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const operationsService = {
  // Checklists are served by the real backend (services/api/checklists.ts).
  // These stubs only exist for legacy callers and return empty data.
  async getChecklists(_filters?: ChecklistFilters): Promise<{ data: Checklist[]; total: number }> {
    return { data: [], total: 0 };
  },

  async getChecklist(_id: string): Promise<Checklist | null> {
    return null;
  },

  async createChecklist(_data: CreateChecklistRequest): Promise<Checklist | null> {
    return null;
  },

  async updateChecklist(_id: string, _data: UpdateChecklistRequest): Promise<Checklist | null> {
    return null;
  },

  async deleteChecklist(_id: string): Promise<boolean> {
    return false;
  },

  // Expenses
  async getExpenses(filters?: ExpenseFilters): Promise<{ data: Expense[]; total: number }> {
    await delay(300);
    let result = [...mockExpenses];
    if (filters?.storeId) result = result.filter(e => e.storeId === filters.storeId);
    if (filters?.category) result = result.filter(e => e.category === filters.category);
    if (filters?.status) result = result.filter(e => e.status === filters.status);
    return { data: result, total: result.length };
  },

  async getExpense(id: string): Promise<Expense | null> {
    await delay(200);
    return mockExpenses.find(e => e.id === id) || null;
  },

  async createExpense(data: CreateExpenseRequest): Promise<Expense> {
    await delay(400);
    const newExpense: Expense = {
      ...data,
      id: `exp-${Date.now()}`,
      status: "pending",
      submittedBy: "current-user",
      submittedByName: "Current User",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockExpenses.push(newExpense);
    return newExpense;
  },

  async updateExpense(id: string, data: UpdateExpenseRequest): Promise<Expense | null> {
    await delay(300);
    const index = mockExpenses.findIndex(e => e.id === id);
    if (index === -1) return null;
    mockExpenses[index] = { ...mockExpenses[index], ...data, updatedAt: new Date().toISOString() };
    return mockExpenses[index];
  },

  async deleteExpense(id: string): Promise<boolean> {
    await delay(300);
    const index = mockExpenses.findIndex(e => e.id === id);
    if (index === -1) return false;
    mockExpenses.splice(index, 1);
    return true;
  },

  // Waste Logs
  async getWasteLogs(filters?: WasteLogFilters): Promise<{ data: WasteLog[]; total: number }> {
    await delay(300);
    let result = [...mockWasteLogs];
    if (filters?.storeId) result = result.filter(w => w.storeId === filters.storeId);
    if (filters?.reason) result = result.filter(w => w.reason === filters.reason);
    return { data: result, total: result.length };
  },

  async getWasteLog(id: string): Promise<WasteLog | null> {
    await delay(200);
    return mockWasteLogs.find(w => w.id === id) || null;
  },

  async createWasteLog(data: CreateWasteLogRequest): Promise<WasteLog> {
    await delay(400);
    const newWaste: WasteLog = {
      ...data,
      id: `waste-${Date.now()}`,
      reportedBy: "current-user",
      reportedByName: "Current User",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockWasteLogs.push(newWaste);
    return newWaste;
  },

  async updateWasteLog(id: string, data: UpdateWasteLogRequest): Promise<WasteLog | null> {
    await delay(300);
    const index = mockWasteLogs.findIndex(w => w.id === id);
    if (index === -1) return null;
    mockWasteLogs[index] = { ...mockWasteLogs[index], ...data, updatedAt: new Date().toISOString() };
    return mockWasteLogs[index];
  },

  async deleteWasteLog(id: string): Promise<boolean> {
    await delay(300);
    const index = mockWasteLogs.findIndex(w => w.id === id);
    if (index === -1) return false;
    mockWasteLogs.splice(index, 1);
    return true;
  },

  // KPI Targets are served by the real backend (services/api/kpi-targets.ts).
  // These stubs only exist for legacy callers and return empty/no-op data.
  async getKPITargets(_filters?: KPITargetFilters): Promise<{ data: KPITarget[]; total: number }> {
    return { data: [], total: 0 };
  },
  async getKPITarget(_id: string): Promise<KPITarget | null> {
    return null;
  },
  async createKPITarget(_data: CreateKPITargetRequest): Promise<KPITarget | null> {
    return null;
  },
  async updateKPITarget(_id: string, _data: UpdateKPITargetRequest): Promise<KPITarget | null> {
    return null;
  },
  async deleteKPITarget(_id: string): Promise<boolean> {
    return false;
  },

  // Sales Targets
  async getSalesTargets(filters?: SalesTargetFilters): Promise<{ data: SalesTarget[]; total: number }> {
    await delay(300);
    let result = [...mockSalesTargets];
    if (filters?.storeId) result = result.filter(s => s.storeId === filters.storeId);
    if (filters?.status) result = result.filter(s => s.status === filters.status);
    return { data: result, total: result.length };
  },

  async getSalesTarget(id: string): Promise<SalesTarget | null> {
    await delay(200);
    return mockSalesTargets.find(s => s.id === id) || null;
  },

  async createSalesTarget(data: CreateSalesTargetRequest): Promise<SalesTarget> {
    await delay(400);
    const newTarget: SalesTarget = {
      ...data,
      id: `st-${Date.now()}`,
      currentAmount: 0,
      status: "active",
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockSalesTargets.push(newTarget);
    return newTarget;
  },

  async updateSalesTarget(id: string, data: UpdateSalesTargetRequest): Promise<SalesTarget | null> {
    await delay(300);
    const index = mockSalesTargets.findIndex(s => s.id === id);
    if (index === -1) return null;
    mockSalesTargets[index] = { ...mockSalesTargets[index], ...data, updatedAt: new Date().toISOString() };
    return mockSalesTargets[index];
  },

  async deleteSalesTarget(id: string): Promise<boolean> {
    await delay(300);
    const index = mockSalesTargets.findIndex(s => s.id === id);
    if (index === -1) return false;
    mockSalesTargets.splice(index, 1);
    return true;
  },

  // Stats
  async getStats(storeId?: string): Promise<OperationsStats> {
    await delay(200);
    const checklists = storeId ? mockChecklists.filter(c => c.storeId === storeId) : mockChecklists;
    const expenses = storeId ? mockExpenses.filter(e => e.storeId === storeId) : mockExpenses;
    const waste = storeId ? mockWasteLogs.filter(w => w.storeId === storeId) : mockWasteLogs;
    const kpis = storeId ? mockKPITargets.filter(k => k.storeId === storeId) : mockKPITargets;
    const sales = storeId ? mockSalesTargets.filter(s => s.storeId === storeId) : mockSalesTargets;
    
    return {
      checklistsToday: checklists.length,
      checklistsCompleted: checklists.filter(c => c.status === 'completed').length,
      checklistsOverdue: 0,
      totalExpenses: expenses.reduce((sum, e) => sum + e.amount, 0),
      pendingExpenses: expenses.filter(e => e.status === 'pending').length,
      totalWaste: waste.length,
      wasteValue: waste.reduce((sum, w) => sum + w.estimatedValue, 0),
      kpisOnTrack: kpis.filter(k => k.status === 'on_track' || k.status === 'achieved').length,
      kpisAtRisk: kpis.filter(k => k.status === 'at_risk' || k.status === 'behind').length,
      salesProgress: sales[0]?.progress || 0,
    };
  },
};
