import { apiRequest } from '@/lib/api-client';
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
} from '@/types/hr';

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function buildQuery(params: Record<string, unknown>): string {
  const q = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      q.set(key, String(value));
    }
  }
  const s = q.toString();
  return s ? `?${s}` : '';
}

export interface DashboardAccess {
  hasAccess: boolean;
  adminId: string | null;
  email: string | null;
  role: string | null;
  storeIds: string[] | null;
  /** Module permissions, e.g. ["orders.view", "stocks.manage"]. */
  permissions: string[];
  mustChangePassword: boolean;
}

export interface DashboardCredentials {
  adminId: string;
  email: string;
  /** Shown once — never retrievable again. */
  temporaryPassword: string;
  role: string;
  storeIds: string[] | null;
  permissions: string[];
}

export const hrService = {
  async getStaff(filters?: StaffFilters): Promise<PaginatedResponse<Staff>> {
    return apiRequest(`/staff${buildQuery(filters ?? {})}`);
  },

  async getStaffMember(id: string): Promise<Staff> {
    return apiRequest(`/staff/${id}`);
  },

  async createStaff(data: CreateStaffRequest): Promise<Staff> {
    return apiRequest('/staff', { method: 'POST', body: JSON.stringify(data) });
  },

  async updateStaff(id: string, data: UpdateStaffRequest): Promise<Staff> {
    return apiRequest(`/staff/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  },

  async deleteStaff(id: string): Promise<void> {
    return apiRequest(`/staff/${id}`, { method: 'DELETE' });
  },

  async setStaffPin(id: string, pin: string): Promise<void> {
    return apiRequest(`/staff/${id}/pin`, { method: 'PATCH', body: JSON.stringify({ pin }) });
  },

  async clearStaffPin(id: string): Promise<void> {
    return apiRequest(`/staff/${id}/pin`, { method: 'DELETE' });
  },

  /** Current merchant-dashboard access state (never includes the password). */
  async getDashboardAccess(id: string): Promise<DashboardAccess> {
    return apiRequest(`/staff/${id}/dashboard-access`);
  },

  /**
   * Grants (or re-issues) a dashboard login. The returned temporary password is
   * shown once and cannot be read back afterwards.
   */
  async grantDashboardAccess(
    id: string,
    payload: {
      email?: string;
      role?: string;
      storeIds?: string[];
      permissions?: string[];
    },
  ): Promise<DashboardCredentials> {
    return apiRequest(`/staff/${id}/dashboard-access`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async revokeDashboardAccess(id: string): Promise<void> {
    return apiRequest(`/staff/${id}/dashboard-access`, { method: 'DELETE' });
  },

  async getRoles(filters?: RoleFilters): Promise<PaginatedResponse<Role>> {
    return apiRequest(`/roles${buildQuery(filters ?? {})}`);
  },

  async getRole(id: string): Promise<Role> {
    return apiRequest(`/roles/${id}`);
  },

  async createRole(data: CreateRoleRequest): Promise<Role> {
    return apiRequest('/roles', { method: 'POST', body: JSON.stringify(data) });
  },

  async updateRole(id: string, data: UpdateRoleRequest): Promise<Role> {
    return apiRequest(`/roles/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  },

  async deleteRole(id: string): Promise<void> {
    return apiRequest(`/roles/${id}`, { method: 'DELETE' });
  },

  async getPermissions(): Promise<string[]> {
    return apiRequest('/roles/permissions');
  },

  async getShifts(filters?: ShiftFilters): Promise<PaginatedResponse<Shift>> {
    return apiRequest(`/shifts${buildQuery(filters ?? {})}`);
  },

  async getShift(id: string): Promise<Shift> {
    return apiRequest(`/shifts/${id}`);
  },

  async createShift(data: CreateShiftRequest): Promise<Shift> {
    return apiRequest('/shifts', { method: 'POST', body: JSON.stringify(data) });
  },

  async updateShift(id: string, data: UpdateShiftRequest): Promise<Shift> {
    return apiRequest(`/shifts/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  },

  async deleteShift(id: string): Promise<void> {
    return apiRequest(`/shifts/${id}`, { method: 'DELETE' });
  },

  async adminEndShift(id: string): Promise<Shift> {
    return apiRequest(`/shifts/${id}/admin-end`, { method: 'POST' });
  },

  async addShiftBreak(
    id: string,
    payload: {
      type: 'lunch' | 'rest' | 'other';
      startTime: string;
      durationMinutes: number;
      notes?: string;
    },
  ): Promise<Shift> {
    return apiRequest(`/shifts/${id}/breaks`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async deleteShiftBreak(id: string, breakId: string): Promise<Shift> {
    return apiRequest(`/shifts/${id}/breaks/${breakId}`, { method: 'DELETE' });
  },

  async getPayslips(filters?: PayslipFilters): Promise<PaginatedResponse<Payslip>> {
    return apiRequest(`/payslips${buildQuery(filters ?? {})}`);
  },

  async getPayslip(id: string): Promise<Payslip> {
    return apiRequest(`/payslips/${id}`);
  },

  async createPayslip(data: CreatePayslipRequest): Promise<Payslip> {
    return apiRequest('/payslips', { method: 'POST', body: JSON.stringify(data) });
  },

  async updatePayslip(id: string, data: UpdatePayslipRequest): Promise<Payslip> {
    return apiRequest(`/payslips/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  },

  async deletePayslip(id: string): Promise<void> {
    return apiRequest(`/payslips/${id}`, { method: 'DELETE' });
  },

  async approvePayslip(id: string): Promise<Payslip> {
    return apiRequest(`/payslips/${id}/approve`, { method: 'POST' });
  },

  async markPayslipPaid(
    id: string,
    payload: { paymentDate: string; paymentMethod: string; receiptUrl?: string },
  ): Promise<Payslip> {
    return apiRequest(`/payslips/${id}/mark-paid`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getStats(storeId?: string): Promise<HRStats> {
    return apiRequest(`/staff/stats${storeId ? `?storeId=${storeId}` : ''}`);
  },
};
