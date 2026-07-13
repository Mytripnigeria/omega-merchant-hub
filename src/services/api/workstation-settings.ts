import { apiRequest } from "@/lib/api-client";

export interface WorkstationSettings {
  businessId: string;

  pinLength: 4 | 6 | 8;
  requirePinRotation: boolean;
  pinRotationDays: number;
  allowPinRecovery: boolean;
  lockOnFailedAttempts: number;

  screenTimeoutMinutes: number;
  showClock: boolean;
  darkModeDefault: boolean;

  autoClockOutHours: number | null;
  requireBreakLogging: boolean;
  allowShiftSwap: boolean;
  minBreakMinutes: number;

  newOrderSound: boolean;
  lowStockAlerts: boolean;
  notificationVolume: number;

  managerOverrideRequired: boolean;
  voidRequiresManager: boolean;
  refundRequiresManager: boolean;

  autoPrintKitchenTickets: boolean;
  autoPrintReceipt: boolean;
  autoPrintShiftSummary: boolean;

  defaultPermissions: string[];
  /** Maps workstation function key → allowed role names. */
  functionRoleAccess: Record<string, string[]> | null;
  offlineModeEnabled: boolean;
  autoSyncMinutes: number;

  geofenceEnabled: boolean;
  geofenceLatitude: number | null;
  geofenceLongitude: number | null;
  geofenceRadiusMeters: number;

  createdAt: string;
  updatedAt: string;
}

export type UpdateWorkstationSettingsPayload = Partial<
  Omit<WorkstationSettings, "businessId" | "createdAt" | "updatedAt">
>;

export const workstationSettingsService = {
  get: (): Promise<WorkstationSettings> =>
    apiRequest<WorkstationSettings>("/workstation-settings"),

  update: (data: UpdateWorkstationSettingsPayload): Promise<WorkstationSettings> =>
    apiRequest<WorkstationSettings>("/workstation-settings", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};
