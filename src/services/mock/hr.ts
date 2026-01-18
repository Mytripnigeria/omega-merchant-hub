// HR Mock Service
import type {
  Staff,
  Role,
  Shift,
  Payslip,
  StaffFilters,
  RoleFilters,
  ShiftFilters,
  PayslipFilters,
  CreateStaffRequest,
  UpdateStaffRequest,
  CreateRoleRequest,
  UpdateRoleRequest,
  CreateShiftRequest,
  UpdateShiftRequest,
  CreatePayslipRequest,
  UpdatePayslipRequest,
  HRStats,
} from "@/types/hr";

// Mock data
const mockRoles: Role[] = [
  {
    id: "role-001",
    storeId: "store-1",
    name: "Manager",
    description: "Store manager with full access",
    permissions: ["orders", "products", "staff", "reports", "settings"],
    color: "#10B981",
    staffCount: 2,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "role-002",
    storeId: "store-1",
    name: "Cashier",
    description: "Handle POS transactions",
    permissions: ["orders", "products"],
    color: "#3B82F6",
    staffCount: 4,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "role-003",
    storeId: "store-1",
    name: "Kitchen Staff",
    description: "Food preparation and kitchen duties",
    permissions: ["orders"],
    color: "#F59E0B",
    staffCount: 3,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

const mockStaff: Staff[] = [
  {
    id: "staff-001",
    storeId: "store-1",
    firstName: "Emeka",
    lastName: "Okonkwo",
    email: "emeka@omega.com",
    phone: "+234 801 111 1111",
    roleId: "role-001",
    roleName: "Manager",
    employmentType: "full-time",
    status: "active",
    baseSalary: 350000,
    salaryPeriod: "monthly",
    bankName: "GTBank",
    bankAccount: "0123456789",
    hireDate: "2023-01-15",
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "staff-002",
    storeId: "store-1",
    firstName: "Amina",
    lastName: "Bello",
    email: "amina@omega.com",
    phone: "+234 802 222 2222",
    roleId: "role-002",
    roleName: "Cashier",
    employmentType: "full-time",
    status: "active",
    baseSalary: 150000,
    salaryPeriod: "monthly",
    hireDate: "2023-06-01",
    createdAt: "2023-06-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "staff-003",
    storeId: "store-1",
    firstName: "Yusuf",
    lastName: "Adeleke",
    email: "yusuf@omega.com",
    phone: "+234 803 333 3333",
    roleId: "role-003",
    roleName: "Kitchen Staff",
    employmentType: "full-time",
    status: "active",
    baseSalary: 120000,
    salaryPeriod: "monthly",
    hireDate: "2023-09-01",
    createdAt: "2023-09-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

const mockShifts: Shift[] = [
  {
    id: "shift-001",
    storeId: "store-1",
    staffId: "staff-001",
    staffName: "Emeka Okonkwo",
    roleId: "role-001",
    roleName: "Manager",
    date: "2024-01-20",
    startTime: "08:00",
    endTime: "16:00",
    breakDuration: 60,
    status: "scheduled",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "shift-002",
    storeId: "store-1",
    staffId: "staff-002",
    staffName: "Amina Bello",
    roleId: "role-002",
    roleName: "Cashier",
    date: "2024-01-20",
    startTime: "09:00",
    endTime: "17:00",
    breakDuration: 60,
    status: "scheduled",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
];

const mockPayslips: Payslip[] = [
  {
    id: "payslip-001",
    storeId: "store-1",
    staffId: "staff-001",
    staffName: "Emeka Okonkwo",
    period: "2024-01",
    periodStart: "2024-01-01",
    periodEnd: "2024-01-31",
    baseSalary: 350000,
    hoursWorked: 176,
    overtimeHours: 8,
    overtimeRate: 2500,
    additions: [
      { id: "add-001", name: "Transport Allowance", amount: 30000, type: "allowance" },
      { id: "add-002", name: "Performance Bonus", amount: 50000, type: "bonus" },
    ],
    deductions: [
      { id: "ded-001", name: "Tax", amount: 45000, type: "tax" },
      { id: "ded-002", name: "Pension", amount: 28000, type: "insurance" },
    ],
    grossPay: 450000,
    netPay: 377000,
    status: "paid",
    paymentDate: "2024-01-28",
    paymentMethod: "bank",
    createdAt: "2024-01-25T00:00:00Z",
    updatedAt: "2024-01-28T00:00:00Z",
  },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const hrService = {
  // Staff
  async getStaff(filters?: StaffFilters): Promise<{ data: Staff[]; total: number }> {
    await delay(300);
    let result = [...mockStaff];
    
    if (filters?.storeId) result = result.filter(s => s.storeId === filters.storeId);
    if (filters?.roleId) result = result.filter(s => s.roleId === filters.roleId);
    if (filters?.status) result = result.filter(s => s.status === filters.status);
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(s => 
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(search) ||
        s.email.toLowerCase().includes(search)
      );
    }
    
    const total = result.length;
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    result = result.slice((page - 1) * limit, page * limit);
    
    return { data: result, total };
  },

  async getStaffMember(id: string): Promise<Staff | null> {
    await delay(200);
    return mockStaff.find(s => s.id === id) || null;
  },

  async createStaff(data: CreateStaffRequest): Promise<Staff> {
    await delay(400);
    const role = mockRoles.find(r => r.id === data.roleId);
    const newStaff: Staff = {
      ...data,
      id: `staff-${Date.now()}`,
      roleName: role?.name || "Unknown",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockStaff.push(newStaff);
    return newStaff;
  },

  async updateStaff(id: string, data: UpdateStaffRequest): Promise<Staff | null> {
    await delay(300);
    const index = mockStaff.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    if (data.roleId) {
      const role = mockRoles.find(r => r.id === data.roleId);
      (data as Staff).roleName = role?.name || mockStaff[index].roleName;
    }
    
    mockStaff[index] = { ...mockStaff[index], ...data, updatedAt: new Date().toISOString() };
    return mockStaff[index];
  },

  async deleteStaff(id: string): Promise<boolean> {
    await delay(300);
    const index = mockStaff.findIndex(s => s.id === id);
    if (index === -1) return false;
    mockStaff.splice(index, 1);
    return true;
  },

  // Roles
  async getRoles(filters?: RoleFilters): Promise<{ data: Role[]; total: number }> {
    await delay(300);
    let result = [...mockRoles];
    
    if (filters?.storeId) result = result.filter(r => r.storeId === filters.storeId);
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(r => r.name.toLowerCase().includes(search));
    }
    
    return { data: result, total: result.length };
  },

  async getRole(id: string): Promise<Role | null> {
    await delay(200);
    return mockRoles.find(r => r.id === id) || null;
  },

  async createRole(data: CreateRoleRequest): Promise<Role> {
    await delay(400);
    const newRole: Role = {
      ...data,
      id: `role-${Date.now()}`,
      staffCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockRoles.push(newRole);
    return newRole;
  },

  async updateRole(id: string, data: UpdateRoleRequest): Promise<Role | null> {
    await delay(300);
    const index = mockRoles.findIndex(r => r.id === id);
    if (index === -1) return null;
    mockRoles[index] = { ...mockRoles[index], ...data, updatedAt: new Date().toISOString() };
    return mockRoles[index];
  },

  async deleteRole(id: string): Promise<boolean> {
    await delay(300);
    const index = mockRoles.findIndex(r => r.id === id);
    if (index === -1) return false;
    mockRoles.splice(index, 1);
    return true;
  },

  // Shifts
  async getShifts(filters?: ShiftFilters): Promise<{ data: Shift[]; total: number }> {
    await delay(300);
    let result = [...mockShifts];
    
    if (filters?.storeId) result = result.filter(s => s.storeId === filters.storeId);
    if (filters?.staffId) result = result.filter(s => s.staffId === filters.staffId);
    if (filters?.date) result = result.filter(s => s.date === filters.date);
    if (filters?.status) result = result.filter(s => s.status === filters.status);
    
    return { data: result, total: result.length };
  },

  async getShift(id: string): Promise<Shift | null> {
    await delay(200);
    return mockShifts.find(s => s.id === id) || null;
  },

  async createShift(data: CreateShiftRequest): Promise<Shift> {
    await delay(400);
    const staff = mockStaff.find(s => s.id === data.staffId);
    const role = data.roleId ? mockRoles.find(r => r.id === data.roleId) : null;
    
    const newShift: Shift = {
      ...data,
      id: `shift-${Date.now()}`,
      staffName: staff ? `${staff.firstName} ${staff.lastName}` : "Unknown",
      roleName: role?.name,
      status: "scheduled",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockShifts.push(newShift);
    return newShift;
  },

  async updateShift(id: string, data: UpdateShiftRequest): Promise<Shift | null> {
    await delay(300);
    const index = mockShifts.findIndex(s => s.id === id);
    if (index === -1) return null;
    mockShifts[index] = { ...mockShifts[index], ...data, updatedAt: new Date().toISOString() };
    return mockShifts[index];
  },

  async deleteShift(id: string): Promise<boolean> {
    await delay(300);
    const index = mockShifts.findIndex(s => s.id === id);
    if (index === -1) return false;
    mockShifts.splice(index, 1);
    return true;
  },

  // Payslips
  async getPayslips(filters?: PayslipFilters): Promise<{ data: Payslip[]; total: number }> {
    await delay(300);
    let result = [...mockPayslips];
    
    if (filters?.storeId) result = result.filter(p => p.storeId === filters.storeId);
    if (filters?.staffId) result = result.filter(p => p.staffId === filters.staffId);
    if (filters?.status) result = result.filter(p => p.status === filters.status);
    if (filters?.period) result = result.filter(p => p.period === filters.period);
    
    return { data: result, total: result.length };
  },

  async getPayslip(id: string): Promise<Payslip | null> {
    await delay(200);
    return mockPayslips.find(p => p.id === id) || null;
  },

  async createPayslip(data: CreatePayslipRequest): Promise<Payslip> {
    await delay(400);
    const staff = mockStaff.find(s => s.id === data.staffId);
    const additions = (data.additions || []).map((a, i) => ({ ...a, id: `add-${Date.now()}-${i}` }));
    const deductions = (data.deductions || []).map((d, i) => ({ ...d, id: `ded-${Date.now()}-${i}` }));
    
    const overtimePay = (data.overtimeHours || 0) * (data.overtimeRate || 0);
    const additionsTotal = additions.reduce((sum, a) => sum + a.amount, 0);
    const deductionsTotal = deductions.reduce((sum, d) => sum + d.amount, 0);
    const grossPay = data.baseSalary + overtimePay + additionsTotal;
    const netPay = grossPay - deductionsTotal;
    
    const newPayslip: Payslip = {
      ...data,
      id: `payslip-${Date.now()}`,
      staffName: staff ? `${staff.firstName} ${staff.lastName}` : "Unknown",
      additions,
      deductions,
      grossPay,
      netPay,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockPayslips.push(newPayslip);
    return newPayslip;
  },

  async updatePayslip(id: string, data: UpdatePayslipRequest): Promise<Payslip | null> {
    await delay(300);
    const index = mockPayslips.findIndex(p => p.id === id);
    if (index === -1) return null;
    mockPayslips[index] = { ...mockPayslips[index], ...data, updatedAt: new Date().toISOString() };
    return mockPayslips[index];
  },

  async deletePayslip(id: string): Promise<boolean> {
    await delay(300);
    const index = mockPayslips.findIndex(p => p.id === id);
    if (index === -1) return false;
    mockPayslips.splice(index, 1);
    return true;
  },

  // Stats
  async getStats(storeId?: string): Promise<HRStats> {
    await delay(200);
    const staff = storeId ? mockStaff.filter(s => s.storeId === storeId) : mockStaff;
    const roles = storeId ? mockRoles.filter(r => r.storeId === storeId) : mockRoles;
    const shifts = storeId ? mockShifts.filter(s => s.storeId === storeId) : mockShifts;
    const payslips = storeId ? mockPayslips.filter(p => p.storeId === storeId) : mockPayslips;
    
    const today = new Date().toISOString().split('T')[0];
    
    return {
      totalStaff: staff.length,
      activeStaff: staff.filter(s => s.status === 'active').length,
      onLeave: staff.filter(s => s.status === 'on-leave').length,
      totalRoles: roles.length,
      shiftsToday: shifts.filter(s => s.date === today).length,
      pendingPayslips: payslips.filter(p => p.status === 'pending').length,
      totalPayroll: payslips.reduce((sum, p) => sum + p.netPay, 0),
    };
  },
};
