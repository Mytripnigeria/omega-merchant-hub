import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TablePagination } from "@/components/ui/table-pagination";
import {
  Plus,
  Users,
  Shield,
  Clock,
  Search,
  Mail,
  Phone,
  Key,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import {
  useStaff,
  useRoles,
  useCreateStaff,
  useUpdateStaff,
  useDeleteStaff,
  useSetStaffPin,
  useClearStaffPin,
} from "@/hooks/api/use-hr";
import { useActivityLog } from "@/hooks/api/use-activity-log";
import { useStore } from "@/contexts/StoreContext";
import type { Staff } from "@/types/hr";

const ALL = "__all__";
type SheetMode = "view" | "edit" | "add";

interface UserFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roleId: string;
  status: Staff["status"];
  employmentType: Staff["employmentType"];
  baseSalary: string;
  salaryPeriod: Staff["salaryPeriod"];
  hireDate: string;
}

function emptyForm(): UserFormState {
  return {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    roleId: "",
    status: "active",
    employmentType: "full-time",
    baseSalary: "0",
    salaryPeriod: "monthly",
    hireDate: new Date().toISOString().slice(0, 10),
  };
}

function staffToForm(s: Staff): UserFormState {
  return {
    firstName: s.firstName,
    lastName: s.lastName,
    email: s.email,
    phone: s.phone,
    roleId: s.roleId,
    status: s.status,
    employmentType: s.employmentType,
    baseSalary: String(s.baseSalary ?? 0),
    salaryPeriod: s.salaryPeriod,
    hireDate: s.hireDate,
  };
}

export default function UsersPage() {
  const { currentStore } = useStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(ALL);
  const [roleFilter, setRoleFilter] = useState<string>(ALL);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selectedUser, setSelectedUser] = useState<Staff | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<SheetMode>("view");
  const [form, setForm] = useState<UserFormState>(emptyForm());
  const [pin, setPin] = useState("");

  const staffQuery = useStaff({
    storeId: currentStore?.id,
    search: search || undefined,
    status: statusFilter === ALL ? undefined : (statusFilter as Staff["status"]),
    roleId: roleFilter === ALL ? undefined : roleFilter,
    page,
    limit: pageSize,
  });
  const rolesQuery = useRoles({ storeId: currentStore?.id, limit: 100 });

  const createStaff = useCreateStaff();
  const updateStaff = useUpdateStaff();
  const deleteStaff = useDeleteStaff();
  const setStaffPin = useSetStaffPin();
  const clearStaffPin = useClearStaffPin();

  const staff = staffQuery.data?.data ?? [];
  const total = staffQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);
  const roles = rolesQuery.data?.data ?? [];

  const stats = useMemo(() => {
    const list = staff;
    const active = list.filter((s) => s.status === "active").length;
    return [
      { label: "Total Users", value: String(total), icon: Users },
      { label: "Active", value: String(active), icon: Shield },
      { label: "Roles", value: String(roles.length), icon: Clock },
    ];
  }, [staff, roles.length, total]);

  const activityQuery = useActivityLog(
    selectedUser ? { actorId: selectedUser.id, limit: 20 } : { limit: 0 },
  );

  const openView = (s: Staff) => {
    setSelectedUser(s);
    setForm(staffToForm(s));
    setSheetMode("view");
    setSheetOpen(true);
  };
  const openEdit = (s: Staff) => {
    setSelectedUser(s);
    setForm(staffToForm(s));
    setSheetMode("edit");
    setSheetOpen(true);
  };
  const openAdd = () => {
    setSelectedUser(null);
    setForm({
      ...emptyForm(),
      roleId: roles[0]?.id ?? "",
    });
    setSheetMode("add");
    setSheetOpen(true);
  };
  const closeSheet = () => {
    setSheetOpen(false);
    setSelectedUser(null);
    setPin("");
  };

  const handleCreate = () => {
    if (!currentStore) {
      toast.error("Select a store first");
      return;
    }
    if (!form.firstName || !form.lastName || !form.email || !form.roleId) {
      toast.error("First name, last name, email and role are required");
      return;
    }
    createStaff.mutate(
      {
        storeId: currentStore.id,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        roleId: form.roleId,
        employmentType: form.employmentType,
        baseSalary: Number(form.baseSalary) || 0,
        salaryPeriod: form.salaryPeriod,
        hireDate: form.hireDate,
      },
      {
        onSuccess: () => {
          toast.success("User created");
          closeSheet();
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't create user"),
      },
    );
  };

  const handleUpdate = () => {
    if (!selectedUser) return;
    updateStaff.mutate(
      {
        id: selectedUser.id,
        data: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          roleId: form.roleId,
          status: form.status,
          employmentType: form.employmentType,
          baseSalary: Number(form.baseSalary) || 0,
          salaryPeriod: form.salaryPeriod,
        },
      },
      {
        onSuccess: () => {
          toast.success("User updated");
          closeSheet();
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't update user"),
      },
    );
  };

  const handleSetPin = () => {
    if (!selectedUser) return;
    if (pin.length < 4) {
      toast.error("PIN must be at least 4 digits");
      return;
    }
    setStaffPin.mutate(
      { id: selectedUser.id, pin },
      {
        onSuccess: () => {
          toast.success("PIN updated");
          setPin("");
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't set PIN"),
      },
    );
  };

  const handleClearPin = () => {
    if (!selectedUser) return;
    clearStaffPin.mutate(selectedUser.id, {
      onSuccess: () => toast.success("PIN cleared"),
      onError: (e: Error) => toast.error(e.message ?? "Couldn't clear PIN"),
    });
  };

  const handleToggleStatus = (s: Staff) => {
    const next: Staff["status"] = s.status === "active" ? "inactive" : "active";
    updateStaff.mutate(
      { id: s.id, data: { status: next } },
      {
        onSuccess: () => toast.success(`User ${next === "active" ? "activated" : "deactivated"}`),
        onError: (e: Error) => toast.error(e.message ?? "Couldn't update status"),
      },
    );
  };

  const handleDelete = () => {
    if (!selectedUser) return;
    if (!confirm(`Delete ${selectedUser.firstName} ${selectedUser.lastName}?`)) return;
    deleteStaff.mutate(selectedUser.id, {
      onSuccess: () => {
        toast.success("User deleted");
        closeSheet();
      },
      onError: (e: Error) => toast.error(e.message ?? "Couldn't delete user"),
    });
  };

  const isLoading = staffQuery.isLoading;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Users</h1>
          <p className="text-sm text-muted-foreground">Manage workstation users and access</p>
        </div>
        <Button size="sm" className="w-full sm:w-auto" onClick={openAdd}>
          <Plus className="mr-2 h-4 w-4" />Add User
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={stat.label} className={index === 2 ? "col-span-2 md:col-span-1" : ""}>
            <CardContent className="p-3 sm:p-4 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground shrink-0" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="p-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="on-leave">On leave</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All roles</SelectItem>
                {roles.map((r) => (
                  <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-4 border rounded-lg">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              ))}
            </div>
          ) : staff.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Users className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No users found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {staff.map((u) => {
                const fullName = `${u.firstName} ${u.lastName}`.trim();
                return (
                  <div
                    key={u.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 border rounded-lg transition-colors hover:bg-muted/50 cursor-pointer"
                    onClick={() => openView(u)}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <Avatar className="h-9 w-9 sm:h-10 sm:w-10 shrink-0">
                        <AvatarFallback className="text-xs">
                          {fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{fullName}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 pl-12 sm:pl-0">
                      <Badge variant="outline" className="text-xs">{u.roleName || "—"}</Badge>
                      <span className="text-xs sm:text-sm text-muted-foreground shrink-0">
                        {formatDistanceToNow(new Date(u.updatedAt), { addSuffix: true })}
                      </span>
                      <Badge
                        className={
                          u.status === "active"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : ""
                        }
                        variant="secondary"
                      >
                        {u.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {total > 0 && (
        <TablePagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={total}
          startIndex={startIndex + 1}
          endIndex={endIndex}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      )}

      <Sheet open={sheetOpen} onOpenChange={(o) => (o ? setSheetOpen(true) : closeSheet())}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center gap-3">
              {selectedUser && (
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {`${selectedUser.firstName} ${selectedUser.lastName}`.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              )}
              <div>
                <SheetTitle>
                  {sheetMode === "add"
                    ? "Add User"
                    : sheetMode === "edit"
                      ? "Edit User"
                      : selectedUser
                        ? `${selectedUser.firstName} ${selectedUser.lastName}`
                        : "User"}
                </SheetTitle>
                <SheetDescription>
                  {sheetMode === "add" ? "Create a new workstation user" : selectedUser?.email}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {sheetMode === "view" && selectedUser ? (
            <Tabs defaultValue="details" className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{selectedUser.email}</p>
                      <p className="text-xs text-muted-foreground">Email</p>
                    </div>
                  </div>
                  {selectedUser.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{selectedUser.phone}</p>
                        <p className="text-xs text-muted-foreground">Phone</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Role</Label>
                    <Badge variant="outline">{selectedUser.roleName || "—"}</Badge>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Status</Label>
                    <Badge
                      className={
                        selectedUser.status === "active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : ""
                      }
                      variant="secondary"
                    >
                      {selectedUser.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Hire date</Label>
                    <p className="text-sm font-medium">{selectedUser.hireDate}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Last update</Label>
                    <p className="text-sm font-medium">
                      {formatDistanceToNow(new Date(selectedUser.updatedAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="security" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Set or rotate PIN</Label>
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      placeholder="New PIN"
                      maxLength={8}
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                    />
                    <Button
                      size="sm"
                      onClick={handleSetPin}
                      disabled={setStaffPin.isPending || pin.length < 4}
                    >
                      <Key className="mr-2 h-4 w-4" />Save
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    PINs are used by staff to authenticate on the workstation app.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearPin}
                  disabled={clearStaffPin.isPending}
                >
                  Clear PIN
                </Button>
                <div className="border-t pt-4 space-y-2">
                  <Label>Account status</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(selectedUser)}
                    disabled={updateStaff.isPending}
                  >
                    {selectedUser.status === "active" ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4 mt-4">
                {activityQuery.isLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-14 w-full" />
                    ))}
                  </div>
                ) : (activityQuery.data?.data?.length ?? 0) > 0 ? (
                  <div className="space-y-3">
                    {activityQuery.data!.data.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-start justify-between gap-3 p-3 border rounded-lg"
                      >
                        <div className="flex items-start gap-3">
                          <Activity className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">{entry.action.replace(/[._]/g, " ")}</p>
                            {entry.resourceType && (
                              <p className="text-xs text-muted-foreground">{entry.resourceType}</p>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Activity className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">No recent activity</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>First name</Label>
                  <Input
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last name</Label>
                  <Input
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={form.roleId}
                  onValueChange={(v) => setForm({ ...form, roleId: v })}
                >
                  <SelectTrigger><SelectValue placeholder="Pick a role" /></SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {sheetMode === "edit" && (
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) => setForm({ ...form, status: v as Staff["status"] })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="on-leave">On leave</SelectItem>
                      <SelectItem value="terminated">Terminated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Employment</Label>
                  <Select
                    value={form.employmentType}
                    onValueChange={(v) => setForm({ ...form, employmentType: v as Staff["employmentType"] })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full time</SelectItem>
                      <SelectItem value="part-time">Part time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="intern">Intern</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Salary period</Label>
                  <Select
                    value={form.salaryPeriod}
                    onValueChange={(v) => setForm({ ...form, salaryPeriod: v as Staff["salaryPeriod"] })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Base salary</Label>
                  <Input
                    type="number"
                    value={form.baseSalary}
                    onChange={(e) => setForm({ ...form, baseSalary: e.target.value })}
                  />
                </div>
                {sheetMode === "add" && (
                  <div className="space-y-2">
                    <Label>Hire date</Label>
                    <Input
                      type="date"
                      value={form.hireDate}
                      onChange={(e) => setForm({ ...form, hireDate: e.target.value })}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <SheetFooter className="mt-6 flex-col sm:flex-row gap-2">
            {sheetMode === "view" && selectedUser ? (
              <>
                <Button variant="outline" onClick={() => openEdit(selectedUser)} className="w-full sm:w-auto">
                  Edit User
                </Button>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto text-destructive"
                  onClick={handleDelete}
                  disabled={deleteStaff.isPending}
                >
                  Delete
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={closeSheet} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button
                  className="w-full sm:w-auto"
                  onClick={sheetMode === "add" ? handleCreate : handleUpdate}
                  disabled={createStaff.isPending || updateStaff.isPending}
                >
                  {sheetMode === "add" ? "Create User" : "Save Changes"}
                </Button>
              </>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
