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

// Mock data
const mockChecklists: Checklist[] = [
  {
    id: "check-001",
    storeId: "store-1",
    name: "Morning Opening Checklist",
    description: "Tasks to complete before opening",
    assignmentType: "shift",
    assignedTo: "shift-morning",
    assignedToName: "Morning Shift",
    frequency: "daily",
    items: [
      { id: "item-001", title: "Check inventory levels", isCompleted: true, completedAt: "2024-01-20T07:30:00Z", order: 1 },
      { id: "item-002", title: "Clean work surfaces", isCompleted: true, completedAt: "2024-01-20T07:45:00Z", order: 2 },
      { id: "item-003", title: "Turn on equipment", isCompleted: false, order: 3 },
      { id: "item-004", title: "Verify cash register", isCompleted: false, order: 4 },
    ],
    dueTime: "08:00",
    status: "in-progress",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-20T07:45:00Z",
  },
  {
    id: "check-002",
    storeId: "store-1",
    name: "Evening Closing Checklist",
    assignmentType: "role",
    assignedTo: "role-002",
    assignedToName: "Cashier",
    frequency: "daily",
    items: [
      { id: "item-005", title: "Count cash drawer", isCompleted: false, order: 1 },
      { id: "item-006", title: "Clean POS area", isCompleted: false, order: 2 },
      { id: "item-007", title: "Lock safe", isCompleted: false, order: 3 },
    ],
    dueTime: "22:00",
    status: "pending",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

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

const mockKPITargets: KPITarget[] = [
  {
    id: "kpi-001",
    storeId: "store-1",
    name: "Daily Sales Target",
    category: "sales",
    targetValue: 500000,
    currentValue: 385000,
    unit: "₦",
    period: "day",
    periodStart: "2024-01-20",
    periodEnd: "2024-01-20",
    status: "on-track",
    progress: 77,
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-01-20T15:00:00Z",
  },
  {
    id: "kpi-002",
    storeId: "store-1",
    name: "Monthly Orders",
    category: "orders",
    targetValue: 1000,
    currentValue: 650,
    unit: "orders",
    period: "month",
    periodStart: "2024-01-01",
    periodEnd: "2024-01-31",
    status: "at-risk",
    progress: 65,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
  {
    id: "kpi-003",
    storeId: "store-1",
    name: "Waste Reduction",
    category: "waste",
    targetValue: 2,
    currentValue: 3.5,
    unit: "%",
    period: "month",
    periodStart: "2024-01-01",
    periodEnd: "2024-01-31",
    status: "behind",
    progress: 57,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
];

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
  // Checklists
  async getChecklists(filters?: ChecklistFilters): Promise<{ data: Checklist[]; total: number }> {
    await delay(300);
    let result = [...mockChecklists];
    if (filters?.storeId) result = result.filter(c => c.storeId === filters.storeId);
    if (filters?.status) result = result.filter(c => c.status === filters.status);
    if (filters?.assignmentType) result = result.filter(c => c.assignmentType === filters.assignmentType);
    return { data: result, total: result.length };
  },

  async getChecklist(id: string): Promise<Checklist | null> {
    await delay(200);
    return mockChecklists.find(c => c.id === id) || null;
  },

  async createChecklist(data: CreateChecklistRequest): Promise<Checklist> {
    await delay(400);
    const newChecklist: Checklist = {
      ...data,
      id: `check-${Date.now()}`,
      assignedToName: data.assignedTo,
      items: data.items.map((item, i) => ({ ...item, id: `item-${Date.now()}-${i}`, isCompleted: false })),
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockChecklists.push(newChecklist);
    return newChecklist;
  },

  async updateChecklist(id: string, data: UpdateChecklistRequest): Promise<Checklist | null> {
    await delay(300);
    const index = mockChecklists.findIndex(c => c.id === id);
    if (index === -1) return null;
    mockChecklists[index] = { ...mockChecklists[index], ...data, updatedAt: new Date().toISOString() };
    return mockChecklists[index];
  },

  async deleteChecklist(id: string): Promise<boolean> {
    await delay(300);
    const index = mockChecklists.findIndex(c => c.id === id);
    if (index === -1) return false;
    mockChecklists.splice(index, 1);
    return true;
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

  // KPI Targets
  async getKPITargets(filters?: KPITargetFilters): Promise<{ data: KPITarget[]; total: number }> {
    await delay(300);
    let result = [...mockKPITargets];
    if (filters?.storeId) result = result.filter(k => k.storeId === filters.storeId);
    if (filters?.category) result = result.filter(k => k.category === filters.category);
    if (filters?.status) result = result.filter(k => k.status === filters.status);
    return { data: result, total: result.length };
  },

  async getKPITarget(id: string): Promise<KPITarget | null> {
    await delay(200);
    return mockKPITargets.find(k => k.id === id) || null;
  },

  async createKPITarget(data: CreateKPITargetRequest): Promise<KPITarget> {
    await delay(400);
    const newKPI: KPITarget = {
      ...data,
      id: `kpi-${Date.now()}`,
      currentValue: 0,
      status: "on-track",
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockKPITargets.push(newKPI);
    return newKPI;
  },

  async updateKPITarget(id: string, data: UpdateKPITargetRequest): Promise<KPITarget | null> {
    await delay(300);
    const index = mockKPITargets.findIndex(k => k.id === id);
    if (index === -1) return null;
    mockKPITargets[index] = { ...mockKPITargets[index], ...data, updatedAt: new Date().toISOString() };
    return mockKPITargets[index];
  },

  async deleteKPITarget(id: string): Promise<boolean> {
    await delay(300);
    const index = mockKPITargets.findIndex(k => k.id === id);
    if (index === -1) return false;
    mockKPITargets.splice(index, 1);
    return true;
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
      checklistsOverdue: checklists.filter(c => c.status === 'overdue').length,
      totalExpenses: expenses.reduce((sum, e) => sum + e.amount, 0),
      pendingExpenses: expenses.filter(e => e.status === 'pending').length,
      totalWaste: waste.length,
      wasteValue: waste.reduce((sum, w) => sum + w.estimatedValue, 0),
      kpisOnTrack: kpis.filter(k => k.status === 'on-track' || k.status === 'achieved').length,
      kpisAtRisk: kpis.filter(k => k.status === 'at-risk' || k.status === 'behind').length,
      salesProgress: sales[0]?.progress || 0,
    };
  },
};
