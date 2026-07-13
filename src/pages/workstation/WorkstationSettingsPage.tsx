import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings,
  Key,
  Bell,
  Shield,
  Clock,
  Monitor,
  Printer,
  MapPin,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import {
  useWorkstationSettings,
  useUpdateWorkstationSettings,
} from "@/hooks/api/use-workstation-settings";
import { useRoles } from "@/hooks/api/use-hr";
import type {
  UpdateWorkstationSettingsPayload,
  WorkstationSettings,
} from "@/services/api/workstation-settings";

type Form = WorkstationSettings;

// Workstation functions that can be restricted to specific roles.
const WORKSTATION_FUNCTIONS: { key: string; label: string }[] = [
  { key: "counter_pos", label: "Counter POS" },
  { key: "self_service", label: "Self-Service" },
  { key: "kitchen", label: "Kitchen" },
  { key: "waiter", label: "Waiter" },
  { key: "delivery", label: "Delivery" },
  { key: "lobby", label: "Lobby" },
  { key: "instore", label: "Instore" },
  { key: "outstore", label: "Outstore" },
  { key: "expenses", label: "Expenses" },
  { key: "managers", label: "Managers" },
];

export default function WorkstationSettingsPage() {
  const settingsQuery = useWorkstationSettings();
  const updateSettings = useUpdateWorkstationSettings();
  const rolesQuery = useRoles();
  const roles = ((rolesQuery.data?.data ?? []) as Array<{ id: string; name: string }>);
  const [form, setForm] = useState<Form | null>(null);

  useEffect(() => {
    if (settingsQuery.data && !form) {
      setForm(settingsQuery.data);
    }
  }, [settingsQuery.data, form]);

  if (settingsQuery.isLoading || !form) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Workstation Settings</h1>
          <p className="text-muted-foreground">Loading…</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const saveSection = (fields: (keyof Form)[]) => {
    if (!form) return;
    const payload: UpdateWorkstationSettingsPayload = {};
    for (const f of fields) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (payload as any)[f] = form[f];
    }
    updateSettings.mutate(payload, {
      // Merge the response so a PATCH that echoes only the changed fields
      // doesn't blank out the other cards (the "doesn't show saved info until
      // reload" bug).
      onSuccess: (next) => {
        setForm((prev) => (prev ? { ...prev, ...next } : next));
        toast.success("Settings saved");
      },
      onError: (e: Error) => toast.error(e.message ?? "Couldn't save"),
    });
  };

  const access = form.functionRoleAccess ?? {};
  const toggleFunctionRole = (funcKey: string, roleName: string) => {
    const current = access[funcKey] ?? [];
    const nextRoles = current.includes(roleName)
      ? current.filter((r) => r !== roleName)
      : [...current, roleName];
    set("functionRoleAccess", { ...access, [funcKey]: nextRoles });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Workstation Settings</h1>
        <p className="text-muted-foreground">Configure workstation access and policy enforced on staff devices</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              PIN Settings
            </CardTitle>
            <CardDescription>Configure staff PIN requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>PIN Length</Label>
              <Select
                value={String(form.pinLength)}
                onValueChange={(v) => set("pinLength", Number(v) as 4 | 6 | 8)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4 Digits</SelectItem>
                  <SelectItem value="6">6 Digits</SelectItem>
                  <SelectItem value="8">8 Digits</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Require PIN Rotation</p>
                <p className="text-xs text-muted-foreground">Force PIN change after a fixed interval</p>
              </div>
              <Switch
                checked={form.requirePinRotation}
                onCheckedChange={(v) => set("requirePinRotation", v)}
              />
            </div>
            {form.requirePinRotation && (
              <div className="space-y-2">
                <Label>Rotation interval (days)</Label>
                <Input
                  type="number"
                  min={1}
                  max={365}
                  value={form.pinRotationDays}
                  onChange={(e) => set("pinRotationDays", Number(e.target.value))}
                />
              </div>
            )}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Allow PIN Recovery</p>
                <p className="text-xs text-muted-foreground">Managers may reset staff PINs</p>
              </div>
              <Switch
                checked={form.allowPinRecovery}
                onCheckedChange={(v) => set("allowPinRecovery", v)}
              />
            </div>
            <div className="space-y-2">
              <Label>Lock after failed attempts</Label>
              <Input
                type="number"
                min={1}
                max={20}
                value={form.lockOnFailedAttempts}
                onChange={(e) => set("lockOnFailedAttempts", Number(e.target.value))}
              />
            </div>
            <Button
              onClick={() =>
                saveSection([
                  "pinLength",
                  "requirePinRotation",
                  "pinRotationDays",
                  "allowPinRecovery",
                  "lockOnFailedAttempts",
                ])
              }
              disabled={updateSettings.isPending}
            >
              <Save className="h-4 w-4 mr-2" />Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Display Settings
            </CardTitle>
            <CardDescription>Configure workstation display</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Screen Timeout (minutes)</Label>
              <Input
                type="number"
                min={1}
                max={240}
                value={form.screenTimeoutMinutes}
                onChange={(e) => set("screenTimeoutMinutes", Number(e.target.value))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Show Clock</p>
                <p className="text-xs text-muted-foreground">Display clock on workstation</p>
              </div>
              <Switch
                checked={form.showClock}
                onCheckedChange={(v) => set("showClock", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Dark Mode (default)</p>
                <p className="text-xs text-muted-foreground">Use dark theme for new sessions</p>
              </div>
              <Switch
                checked={form.darkModeDefault}
                onCheckedChange={(v) => set("darkModeDefault", v)}
              />
            </div>
            <Button
              onClick={() =>
                saveSection(["screenTimeoutMinutes", "showClock", "darkModeDefault"])
              }
              disabled={updateSettings.isPending}
            >
              <Save className="h-4 w-4 mr-2" />Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Shift Settings
            </CardTitle>
            <CardDescription>Configure shift management rules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Auto Clock-out</p>
                <p className="text-xs text-muted-foreground">End shifts after a fixed number of hours</p>
              </div>
              <Switch
                checked={form.autoClockOutHours !== null}
                onCheckedChange={(v) => set("autoClockOutHours", v ? 12 : null)}
              />
            </div>
            {form.autoClockOutHours !== null && (
              <div className="space-y-2">
                <Label>Auto clock-out hours</Label>
                <Input
                  type="number"
                  min={1}
                  max={24}
                  value={form.autoClockOutHours}
                  onChange={(e) => set("autoClockOutHours", Number(e.target.value))}
                />
              </div>
            )}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Require Break Logging</p>
                <p className="text-xs text-muted-foreground">Staff must log breaks</p>
              </div>
              <Switch
                checked={form.requireBreakLogging}
                onCheckedChange={(v) => set("requireBreakLogging", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Allow Shift Swap</p>
                <p className="text-xs text-muted-foreground">Staff can request shift swaps</p>
              </div>
              <Switch
                checked={form.allowShiftSwap}
                onCheckedChange={(v) => set("allowShiftSwap", v)}
              />
            </div>
            <div className="space-y-2">
              <Label>Minimum Break Duration (minutes)</Label>
              <Input
                type="number"
                min={1}
                max={240}
                value={form.minBreakMinutes}
                onChange={(e) => set("minBreakMinutes", Number(e.target.value))}
              />
            </div>
            <Button
              onClick={() =>
                saveSection([
                  "autoClockOutHours",
                  "requireBreakLogging",
                  "allowShiftSwap",
                  "minBreakMinutes",
                ])
              }
              disabled={updateSettings.isPending}
            >
              <Save className="h-4 w-4 mr-2" />Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Workstation alert preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">New Order Sound</p>
              <Switch
                checked={form.newOrderSound}
                onCheckedChange={(v) => set("newOrderSound", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Low Stock Alert</p>
              <Switch
                checked={form.lowStockAlerts}
                onCheckedChange={(v) => set("lowStockAlerts", v)}
              />
            </div>
            <div className="space-y-2">
              <Label>Alert Volume (0–100)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={form.notificationVolume}
                onChange={(e) => set("notificationVolume", Number(e.target.value))}
              />
            </div>
            <Button
              onClick={() =>
                saveSection(["newOrderSound", "lowStockAlerts", "notificationVolume"])
              }
              disabled={updateSettings.isPending}
            >
              <Save className="h-4 w-4 mr-2" />Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>Access control settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Manager Override Required</p>
                <p className="text-xs text-muted-foreground">For sensitive workstation actions</p>
              </div>
              <Switch
                checked={form.managerOverrideRequired}
                onCheckedChange={(v) => set("managerOverrideRequired", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Void Requires Manager</p>
                <p className="text-xs text-muted-foreground">Manager PIN to void an order</p>
              </div>
              <Switch
                checked={form.voidRequiresManager}
                onCheckedChange={(v) => set("voidRequiresManager", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Refund Requires Manager</p>
                <p className="text-xs text-muted-foreground">Manager PIN to issue a refund</p>
              </div>
              <Switch
                checked={form.refundRequiresManager}
                onCheckedChange={(v) => set("refundRequiresManager", v)}
              />
            </div>
            <Button
              onClick={() =>
                saveSection([
                  "managerOverrideRequired",
                  "voidRequiresManager",
                  "refundRequiresManager",
                ])
              }
              disabled={updateSettings.isPending}
            >
              <Save className="h-4 w-4 mr-2" />Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Geofencing
            </CardTitle>
            <CardDescription>Restrict staff login to the work location</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Enable Geofencing</p>
                <p className="text-xs text-muted-foreground">Restrict staff login and clock-in to within this radius of the work location.</p>
              </div>
              <Switch
                checked={form.geofenceEnabled}
                onCheckedChange={(v) => set("geofenceEnabled", v)}
              />
            </div>
            {form.geofenceEnabled && (
              <>
                <div className="space-y-2">
                  <Label>Latitude</Label>
                  <Input
                    type="number"
                    value={form.geofenceLatitude ?? ""}
                    onChange={(e) =>
                      set(
                        "geofenceLatitude",
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Longitude</Label>
                  <Input
                    type="number"
                    value={form.geofenceLongitude ?? ""}
                    onChange={(e) =>
                      set(
                        "geofenceLongitude",
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Radius (metres)</Label>
                  <Input
                    type="number"
                    min={1}
                    value={form.geofenceRadiusMeters}
                    onChange={(e) => set("geofenceRadiusMeters", Number(e.target.value))}
                  />
                </div>
              </>
            )}
            <Button
              onClick={() =>
                saveSection([
                  "geofenceEnabled",
                  "geofenceLatitude",
                  "geofenceLongitude",
                  "geofenceRadiusMeters",
                ])
              }
              disabled={updateSettings.isPending}
            >
              <Save className="h-4 w-4 mr-2" />Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Printer className="h-5 w-5" />
              Receipt & Printing
            </CardTitle>
            <CardDescription>Receipt printing settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Auto-print Kitchen Tickets</p>
              <Switch
                checked={form.autoPrintKitchenTickets}
                onCheckedChange={(v) => set("autoPrintKitchenTickets", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Print Customer Receipt</p>
              <Switch
                checked={form.autoPrintReceipt}
                onCheckedChange={(v) => set("autoPrintReceipt", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Print Shift Summary</p>
              <Switch
                checked={form.autoPrintShiftSummary}
                onCheckedChange={(v) => set("autoPrintShiftSummary", v)}
              />
            </div>
            <Button
              onClick={() =>
                saveSection([
                  "autoPrintKitchenTickets",
                  "autoPrintReceipt",
                  "autoPrintShiftSummary",
                ])
              }
              disabled={updateSettings.isPending}
            >
              <Save className="h-4 w-4 mr-2" />Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Advanced
            </CardTitle>
            <CardDescription>Advanced workstation options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Offline Mode</p>
                <p className="text-xs text-muted-foreground">Allow offline transactions</p>
              </div>
              <Switch
                checked={form.offlineModeEnabled}
                onCheckedChange={(v) => set("offlineModeEnabled", v)}
              />
            </div>
            <div className="space-y-2">
              <Label>Auto-sync interval (minutes)</Label>
              <Input
                type="number"
                min={1}
                max={60}
                value={form.autoSyncMinutes}
                onChange={(e) => set("autoSyncMinutes", Number(e.target.value))}
              />
            </div>
            <Button
              onClick={() => saveSection(["offlineModeEnabled", "autoSyncMinutes"])}
              disabled={updateSettings.isPending}
            >
              <Save className="h-4 w-4 mr-2" />Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" /> Function Access by Role
            </CardTitle>
            <CardDescription>
              Restrict each workstation function to specific roles. Leave a
              function with no roles selected to allow all roles.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {roles.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No roles found — create roles first to configure access.
              </p>
            ) : (
              <div className="space-y-4">
                {WORKSTATION_FUNCTIONS.map((fn) => (
                  <div key={fn.key} className="border rounded-lg p-3">
                    <p className="text-sm font-medium mb-2">{fn.label}</p>
                    <div className="flex flex-wrap gap-3">
                      {roles.map((role) => {
                        const selected = (access[fn.key] ?? []).includes(role.name);
                        return (
                          <label
                            key={role.id}
                            className="flex items-center gap-2 text-sm cursor-pointer"
                          >
                            <Checkbox
                              checked={selected}
                              onCheckedChange={() => toggleFunctionRole(fn.key, role.name)}
                            />
                            {role.name}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button
              onClick={() => saveSection(["functionRoleAccess"])}
              disabled={updateSettings.isPending}
            >
              <Save className="h-4 w-4 mr-2" />Save Changes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
