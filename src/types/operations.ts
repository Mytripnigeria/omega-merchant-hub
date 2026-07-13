// Operations Types

export type ChecklistAssignmentType = "all_staff" | "role" | "staff";
export type ChecklistFrequency =
  | "one_off"
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "yearly";
export type ChecklistStatus = "pending" | "in_progress" | "completed";

export interface Checklist {
  id: string;
  businessId: string;
  storeId: string;
  name: string;
  description: string | null;
  assignmentType: ChecklistAssignmentType;
  /** roleId, staffId, or null when assignmentType=all_staff */
  assignedToId: string | null;
  /** Display label ("All Staff", role name, staff full name) */
  assignedToName: string | null;
  frequency: ChecklistFrequency;
  items: ChecklistItem[];
  dueDate: string | null;
  dueTime: string | null;
  status: ChecklistStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  completedAt?: string | null;
  completedBy?: string | null;
  completedByName?: string | null;
  order: number;
}

export interface Expense {
  id: string;
  storeId: string;
  category: "supplies" | "utilities" | "maintenance" | "marketing" | "payroll" | "rent" | "equipment" | "other";
  name: string;
  description?: string;
  amount: number;
  date: string;
  vendor?: string;
  receiptUrl?: string;
  paymentMethod?: "cash" | "card" | "bank-transfer" | "check";
  status: "pending" | "approved" | "paid" | "rejected";
  approvedBy?: string;
  approvedAt?: string;
  submittedBy: string;
  submittedByName: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WasteLog {
  id: string;
  storeId: string;
  productId?: string;
  productName: string;
  ingredientId?: string;
  ingredientName?: string;
  quantity: number;
  unit: string;
  reason: "expired" | "damaged" | "overproduction" | "preparation" | "customer-return" | "other";
  estimatedValue: number;
  date: string;
  time?: string;
  reportedBy: string;
  reportedByName: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type KpiCategory =
  | "sales"
  | "orders"
  | "customers"
  | "efficiency"
  | "waste"
  | "labor"
  | "custom";
export type KpiAssignmentType = ChecklistAssignmentType; // identical shape
export type KpiPeriod = ChecklistFrequency; // identical shape (one_off..yearly)
export type KpiStatus =
  | "on_track"
  | "at_risk"
  | "behind"
  | "achieved"
  | "exceeded";

export interface KPITarget {
  id: string;
  businessId: string;
  storeId: string;
  name: string;
  description: string | null;
  category: KpiCategory;
  assignmentType: KpiAssignmentType;
  assignedToId: string | null;
  assignedToName: string | null;
  period: KpiPeriod;
  targetValue: number;
  currentValue: number;
  unit: string;
  periodStart: string | null;
  periodEnd: string | null;
  status: KpiStatus;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface KpiPerformanceRow {
  staffId: string;
  staffName: string;
  roleName: string | null;
  value: number;
  share: number;
  progress: number;
  source: "computed" | "manual";
}

export interface ChecklistPerformance {
  staffId: string;
  staffName: string;
  roleName: string | null;
  completed: number;
  total: number;
  /** 0-100 */
  progress: number;
  lastCompletedAt: string | null;
}

export interface SalesTarget {
  id: string;
  storeId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  period: "day" | "week" | "month" | "quarter" | "year";
  periodStart: string;
  periodEnd: string;
  assignedTo?: string;
  assignedToName?: string;
  status: "active" | "achieved" | "missed" | "cancelled";
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface FoodCostEntry {
  id: string;
  storeId: string;
  productId: string;
  productName: string;
  ingredients: FoodCostIngredient[];
  totalCost: number;
  sellingPrice: number;
  margin: number;
  marginPercentage: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface FoodCostIngredient {
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
}

// Filters
export interface ChecklistFilters {
  storeId?: string;
  assignmentType?: ChecklistAssignmentType;
  status?: ChecklistStatus;
  frequency?: ChecklistFrequency;
  staffId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ExpenseFilters {
  storeId?: string;
  category?: Expense["category"];
  status?: Expense["status"];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface WasteLogFilters {
  storeId?: string;
  reason?: WasteLog["reason"];
  productId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface KPITargetFilters {
  storeId?: string;
  category?: KpiCategory;
  status?: KpiStatus;
  period?: KpiPeriod;
  assignmentType?: KpiAssignmentType;
  search?: string;
  page?: number;
  limit?: number;
}

export interface SalesTargetFilters {
  storeId?: string;
  status?: SalesTarget["status"];
  period?: SalesTarget["period"];
  assignedTo?: string;
  page?: number;
  limit?: number;
}

export interface FoodCostFilters {
  storeId?: string;
  productId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface ChecklistItemInput {
  /** Omit on new items — the server stamps a UUID. */
  id?: string;
  title: string;
  description?: string;
  isCompleted?: boolean;
  order: number;
}

// Request types
export interface CreateChecklistRequest {
  storeId: string;
  name: string;
  description?: string;
  assignmentType: ChecklistAssignmentType;
  /** Required for role/staff; omit for all_staff. */
  assignedToId?: string;
  assignedToName?: string;
  frequency: ChecklistFrequency;
  items: ChecklistItemInput[];
  dueDate?: string;
  dueTime?: string;
}

export interface UpdateChecklistRequest {
  storeId?: string;
  name?: string;
  description?: string;
  assignmentType?: ChecklistAssignmentType;
  assignedToId?: string;
  assignedToName?: string;
  frequency?: ChecklistFrequency;
  items?: ChecklistItemInput[];
  dueDate?: string;
  dueTime?: string;
}

export interface CreateExpenseRequest {
  storeId: string;
  category: Expense["category"];
  name: string;
  description?: string;
  amount: number;
  date: string;
  vendor?: string;
  receiptUrl?: string;
  paymentMethod?: Expense["paymentMethod"];
  notes?: string;
}

export interface UpdateExpenseRequest {
  category?: Expense["category"];
  name?: string;
  description?: string;
  amount?: number;
  date?: string;
  vendor?: string;
  receiptUrl?: string;
  paymentMethod?: Expense["paymentMethod"];
  status?: Expense["status"];
  notes?: string;
}

export interface CreateWasteLogRequest {
  storeId: string;
  productId?: string;
  productName: string;
  ingredientId?: string;
  ingredientName?: string;
  quantity: number;
  unit: string;
  reason: WasteLog["reason"];
  estimatedValue: number;
  date: string;
  time?: string;
  notes?: string;
}

export interface UpdateWasteLogRequest {
  productId?: string;
  productName?: string;
  ingredientId?: string;
  ingredientName?: string;
  quantity?: number;
  unit?: string;
  reason?: WasteLog["reason"];
  estimatedValue?: number;
  notes?: string;
}

export interface CreateKPITargetRequest {
  storeId: string;
  name: string;
  description?: string;
  category: KpiCategory;
  assignmentType: KpiAssignmentType;
  /** Required for role/staff; omit for all_staff. */
  assignedToId?: string;
  assignedToName?: string;
  targetValue: number;
  unit?: string;
  period: KpiPeriod;
  periodStart?: string;
  periodEnd?: string;
}

export interface UpdateKPITargetRequest {
  storeId?: string;
  name?: string;
  description?: string;
  category?: KpiCategory;
  assignmentType?: KpiAssignmentType;
  assignedToId?: string;
  assignedToName?: string;
  targetValue?: number;
  unit?: string;
  period?: KpiPeriod;
  periodStart?: string;
  periodEnd?: string;
}

export interface CreateSalesTargetRequest {
  storeId: string;
  name: string;
  targetAmount: number;
  period: SalesTarget["period"];
  periodStart: string;
  periodEnd: string;
  assignedTo?: string;
}

export interface UpdateSalesTargetRequest {
  name?: string;
  targetAmount?: number;
  currentAmount?: number;
  period?: SalesTarget["period"];
  periodStart?: string;
  periodEnd?: string;
  assignedTo?: string;
  status?: SalesTarget["status"];
}

// Stats
export interface OperationsStats {
  checklistsToday: number;
  checklistsCompleted: number;
  checklistsOverdue: number;
  totalExpenses: number;
  pendingExpenses: number;
  totalWaste: number;
  wasteValue: number;
  kpisOnTrack: number;
  kpisAtRisk: number;
  salesProgress: number;
}
