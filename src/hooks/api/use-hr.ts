// HR API Hooks
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hrService } from "@/services/api/hr";
import type { StaffFilters, RoleFilters, ShiftFilters, PayslipFilters, CreateStaffRequest, UpdateStaffRequest, CreateRoleRequest, UpdateRoleRequest, CreateShiftRequest, UpdateShiftRequest, CreatePayslipRequest, UpdatePayslipRequest } from "@/types/hr";

export const hrKeys = {
  all: ["hr"] as const,
  staff: () => [...hrKeys.all, "staff"] as const,
  staffMember: (id: string) => [...hrKeys.staff(), id] as const,
  roles: () => [...hrKeys.all, "roles"] as const,
  role: (id: string) => [...hrKeys.roles(), id] as const,
  shifts: () => [...hrKeys.all, "shifts"] as const,
  shift: (id: string) => [...hrKeys.shifts(), id] as const,
  payslips: () => [...hrKeys.all, "payslips"] as const,
  payslip: (id: string) => [...hrKeys.payslips(), id] as const,
  stats: (storeId?: string) => [...hrKeys.all, "stats", storeId] as const,
};

export function useStaff(filters?: StaffFilters) { return useQuery({ queryKey: [...hrKeys.staff(), filters], queryFn: () => hrService.getStaff(filters) }); }
export function useStaffMember(id: string) { return useQuery({ queryKey: hrKeys.staffMember(id), queryFn: () => hrService.getStaffMember(id), enabled: !!id }); }
export function useCreateStaff() { const qc = useQueryClient(); return useMutation({ mutationFn: (data: CreateStaffRequest) => hrService.createStaff(data), onSuccess: () => qc.invalidateQueries({ queryKey: hrKeys.staff() }) }); }
export function useUpdateStaff() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, data }: { id: string; data: UpdateStaffRequest }) => hrService.updateStaff(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: hrKeys.staff() }) }); }
export function useDeleteStaff() { const qc = useQueryClient(); return useMutation({ mutationFn: (id: string) => hrService.deleteStaff(id), onSuccess: () => qc.invalidateQueries({ queryKey: hrKeys.staff() }) }); }

export function useRoles(filters?: RoleFilters) { return useQuery({ queryKey: [...hrKeys.roles(), filters], queryFn: () => hrService.getRoles(filters) }); }
export function usePermissions() { return useQuery({ queryKey: [...hrKeys.all, "permissions"], queryFn: () => hrService.getPermissions(), staleTime: 5 * 60 * 1000 }); }
export function useRole(id: string) { return useQuery({ queryKey: hrKeys.role(id), queryFn: () => hrService.getRole(id), enabled: !!id }); }
export function useCreateRole() { const qc = useQueryClient(); return useMutation({ mutationFn: (data: CreateRoleRequest) => hrService.createRole(data), onSuccess: () => qc.invalidateQueries({ queryKey: hrKeys.roles() }) }); }
export function useUpdateRole() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, data }: { id: string; data: UpdateRoleRequest }) => hrService.updateRole(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: hrKeys.roles() }) }); }
export function useDeleteRole() { const qc = useQueryClient(); return useMutation({ mutationFn: (id: string) => hrService.deleteRole(id), onSuccess: () => qc.invalidateQueries({ queryKey: hrKeys.roles() }) }); }

export function useShifts(filters?: ShiftFilters) { return useQuery({ queryKey: [...hrKeys.shifts(), filters], queryFn: () => hrService.getShifts(filters) }); }
export function useShift(id: string) { return useQuery({ queryKey: hrKeys.shift(id), queryFn: () => hrService.getShift(id), enabled: !!id }); }
export function useCreateShift() { const qc = useQueryClient(); return useMutation({ mutationFn: (data: CreateShiftRequest) => hrService.createShift(data), onSuccess: () => qc.invalidateQueries({ queryKey: hrKeys.shifts() }) }); }
export function useUpdateShift() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, data }: { id: string; data: UpdateShiftRequest }) => hrService.updateShift(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: hrKeys.shifts() }) }); }
export function useDeleteShift() { const qc = useQueryClient(); return useMutation({ mutationFn: (id: string) => hrService.deleteShift(id), onSuccess: () => qc.invalidateQueries({ queryKey: hrKeys.shifts() }) }); }
export function useAdminEndShift() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => hrService.adminEndShift(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: hrKeys.shifts() }),
  });
}
export function useAddShiftBreak() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      shiftId,
      ...payload
    }: {
      shiftId: string;
      type: "lunch" | "rest" | "other";
      startTime: string;
      durationMinutes: number;
      notes?: string;
    }) => hrService.addShiftBreak(shiftId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: hrKeys.shifts() }),
  });
}
export function useDeleteShiftBreak() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ shiftId, breakId }: { shiftId: string; breakId: string }) =>
      hrService.deleteShiftBreak(shiftId, breakId),
    onSuccess: () => qc.invalidateQueries({ queryKey: hrKeys.shifts() }),
  });
}
export function useSetStaffPin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, pin }: { id: string; pin: string }) =>
      hrService.setStaffPin(id, pin),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: hrKeys.staff() });
      qc.invalidateQueries({ queryKey: hrKeys.staffMember(id) });
    },
  });
}
export function useClearStaffPin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => hrService.clearStaffPin(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: hrKeys.staff() });
      qc.invalidateQueries({ queryKey: hrKeys.staffMember(id) });
    },
  });
}

export function usePayslips(filters?: PayslipFilters) { return useQuery({ queryKey: [...hrKeys.payslips(), filters], queryFn: () => hrService.getPayslips(filters) }); }
export function useApprovePayslip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => hrService.approvePayslip(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: hrKeys.payslips() }),
  });
}
export function useMarkPayslipPaid() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: {
      id: string;
      paymentDate: string;
      paymentMethod: string;
      receiptUrl?: string;
    }) => hrService.markPayslipPaid(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: hrKeys.payslips() }),
  });
}
export function usePayslip(id: string) { return useQuery({ queryKey: hrKeys.payslip(id), queryFn: () => hrService.getPayslip(id), enabled: !!id }); }
export function useCreatePayslip() { const qc = useQueryClient(); return useMutation({ mutationFn: (data: CreatePayslipRequest) => hrService.createPayslip(data), onSuccess: () => qc.invalidateQueries({ queryKey: hrKeys.payslips() }) }); }
export function useUpdatePayslip() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, data }: { id: string; data: UpdatePayslipRequest }) => hrService.updatePayslip(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: hrKeys.payslips() }) }); }
export function useDeletePayslip() { const qc = useQueryClient(); return useMutation({ mutationFn: (id: string) => hrService.deletePayslip(id), onSuccess: () => qc.invalidateQueries({ queryKey: hrKeys.payslips() }) }); }

export function useHRStats(storeId?: string) { return useQuery({ queryKey: hrKeys.stats(storeId), queryFn: () => hrService.getStats(storeId) }); }
