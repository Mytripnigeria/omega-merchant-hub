// HR Types

export interface Staff {
  id: string;
  storeId: string;
  /** Human-readable Staff ID — what the staff types on the workstation
   *  sign-in screen, alongside their PIN. Unique per business. */
  staffCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  roleId: string;
  roleName: string;
  employmentType: "full-time" | "part-time" | "contract" | "intern";
  status: "active" | "inactive" | "on-leave" | "terminated";
  baseSalary: number;
  salaryPeriod: "hourly" | "daily" | "weekly" | "monthly";
  bankName?: string;
  bankAccount?: string;
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  hireDate: string;
  terminationDate?: string;
  documents?: StaffDocument[];
  createdAt: string;
  updatedAt: string;
}

export interface StaffDocument {
  id: string;
  name: string;
  type: "cv" | "contract" | "id" | "certificate" | "other";
  url: string;
  uploadedAt: string;
}

export interface Role {
  id: string;
  storeId: string;
  name: string;
  description?: string;
  permissions: string[];
  color?: string;
  staffCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShiftBreak {
  id: string;
  type: "lunch" | "rest" | "other";
  startTime: string;
  durationMinutes: number;
  notes?: string | null;
}

export interface Shift {
  id: string;
  storeId: string;
  staffId: string;
  staffName: string;
  roleId?: string | null;
  roleName?: string | null;
  date: string;
  startTime: string;
  endTime: string;
  breakDuration?: number | null; // in minutes
  status: "scheduled" | "in-progress" | "completed" | "missed" | "cancelled";
  actualClockIn?: string | null;
  actualClockOut?: string | null;
  notes?: string | null;
  breaks?: ShiftBreak[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface Payslip {
  id: string;
  storeId: string;
  staffId: string;
  staffName: string;
  period: string; // e.g., "2024-01" for January 2024
  periodStart: string;
  periodEnd: string;
  baseSalary: number;
  hoursWorked?: number;
  overtimeHours?: number;
  overtimeRate?: number;
  additions: PayslipAdjustment[];
  deductions: PayslipAdjustment[];
  grossPay: number;
  netPay: number;
  status: "draft" | "pending" | "approved" | "paid" | "cancelled";
  paymentDate?: string;
  paymentMethod?: "bank" | "cash" | "check";
  receiptUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PayslipAdjustment {
  id: string;
  name: string;
  amount: number;
  type: "bonus" | "allowance" | "commission" | "tax" | "insurance" | "loan" | "other";
}

// Filters
export interface StaffFilters {
  storeId?: string;
  roleId?: string;
  status?: Staff["status"];
  employmentType?: Staff["employmentType"];
  search?: string;
  page?: number;
  limit?: number;
}

export interface RoleFilters {
  storeId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ShiftFilters {
  storeId?: string;
  staffId?: string;
  roleId?: string;
  status?: Shift["status"];
  date?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface PayslipFilters {
  storeId?: string;
  staffId?: string;
  status?: Payslip["status"];
  period?: string;
  periodFrom?: string;
  periodTo?: string;
  page?: number;
  limit?: number;
}

// Request types
export interface CreateStaffRequest {
  storeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roleId: string;
  employmentType: Staff["employmentType"];
  baseSalary: number;
  salaryPeriod: Staff["salaryPeriod"];
  hireDate: string;
  bankName?: string;
  bankAccount?: string;
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

export interface UpdateStaffRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  roleId?: string;
  employmentType?: Staff["employmentType"];
  status?: Staff["status"];
  baseSalary?: number;
  salaryPeriod?: Staff["salaryPeriod"];
  bankName?: string;
  bankAccount?: string;
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  terminationDate?: string;
}

export interface CreateRoleRequest {
  storeId: string;
  name: string;
  description?: string;
  permissions: string[];
  color?: string;
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  permissions?: string[];
  color?: string;
}

export interface CreateShiftRequest {
  storeId: string;
  staffId: string;
  roleId?: string;
  date: string;
  startTime: string;
  endTime: string;
  breakDuration?: number;
  notes?: string;
}

export interface UpdateShiftRequest {
  staffId?: string;
  roleId?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  breakDuration?: number;
  status?: Shift["status"];
  actualClockIn?: string;
  actualClockOut?: string;
  notes?: string;
}

export interface PayslipAdjustmentInput {
  name: string;
  amount: number;
  type: PayslipAdjustment["type"];
  isDeduction: boolean;
}

export interface CreatePayslipRequest {
  storeId: string;
  staffId: string;
  period: string;
  periodStart: string;
  periodEnd: string;
  baseSalary: number;
  hoursWorked?: number;
  overtimeHours?: number;
  overtimeRate?: number;
  adjustments?: PayslipAdjustmentInput[];
  notes?: string;
}

export interface UpdatePayslipRequest {
  baseSalary?: number;
  hoursWorked?: number;
  overtimeHours?: number;
  overtimeRate?: number;
  adjustments?: PayslipAdjustmentInput[];
  paymentDate?: string;
  paymentMethod?: Payslip["paymentMethod"];
  receiptUrl?: string;
  notes?: string;
  period?: string;
  periodStart?: string;
  periodEnd?: string;
}

// Stats
export interface HRStats {
  totalStaff: number;
  activeStaff: number;
  onLeave: number;
  totalRoles: number;
  shiftsToday: number;
  pendingPayslips: number;
  totalPayroll: number;
}
