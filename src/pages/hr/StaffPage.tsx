import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { TablePagination } from "@/components/ui/table-pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Plus,
  Users,
  UserCheck,
  UserX,
  Building2,
  Mail,
  Edit,
  Phone,
  Key,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  useStaff,
  useRoles,
  useCreateStaff,
  useUpdateStaff,
  useDeleteStaff,
  useHRStats,
  useSetStaffPin,
  useClearStaffPin,
} from "@/hooks/api/use-hr";
import { useStore } from "@/contexts/StoreContext";
import type { Staff } from "@/types/hr";

const ALL = "__all__";

interface FormState {
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
  bankName: string;
  bankAccount: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
}

function emptyForm(): FormState {
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
    bankName: "",
    bankAccount: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
  };
}

function staffToForm(s: Staff): FormState {
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
    bankName: s.bankName ?? "",
    bankAccount: s.bankAccount ?? "",
    address: s.address ?? "",
    emergencyContact: s.emergencyContact ?? "",
    emergencyPhone: s.emergencyPhone ?? "",
  };
}

function formatStatus(s: Staff["status"]): string {
  if (s === "on-leave") return "On Leave";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function statusColor(status: Staff["status"]): string {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "on-leave":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "inactive":
      return "bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400";
    case "terminated":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "";
  }
}

export default function StaffPage() {
  const { currentStore } = useStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(ALL);
  const [roleFilter, setRoleFilter] = useState<string>(ALL);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<Staff | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"view" | "add" | "edit">("view");
  const [form, setForm] = useState<FormState>(emptyForm());
  const [pinInput, setPinInput] = useState("");

  const staffQuery = useStaff({
    storeId: currentStore?.id,
    search: search || undefined,
    status: statusFilter === ALL ? undefined : (statusFilter as Staff["status"]),
    roleId: roleFilter === ALL ? undefined : roleFilter,
    page,
    limit: pageSize,
  });
  const rolesQuery = useRoles({ storeId: currentStore?.id, limit: 100 });
  const statsQuery = useHRStats(currentStore?.id);

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
    const s = statsQuery.data;
    return [
      { label: "Total Staff", value: String(s?.totalStaff ?? total), icon: Users },
      { label: "Active", value: String(s?.activeStaff ?? 0), icon: UserCheck },
      { label: "On Leave", value: String(s?.onLeave ?? 0), icon: UserX },
      { label: "Roles", value: String(s?.totalRoles ?? roles.length), icon: Building2 },
    ];
  }, [statsQuery.data, total, roles.length]);

  const recentHires = useMemo(
    () =>
      [...staff]
        .sort((a, b) => new Date(b.hireDate).getTime() - new Date(a.hireDate).getTime())
        .slice(0, 3),
    [staff],
  );

  const openAdd = () => {
    setSelected(null);
    setForm({ ...emptyForm(), roleId: roles[0]?.id ?? "" });
    setSheetMode("add");
    setSheetOpen(true);
  };
  const openView = (s: Staff) => {
    setSelected(s);
    setForm(staffToForm(s));
    setSheetMode("view");
    setSheetOpen(true);
  };
  const openEdit = (s: Staff) => {
    setSelected(s);
    setForm(staffToForm(s));
    setSheetMode("edit");
    setSheetOpen(true);
  };
  const close = () => {
    setSheetOpen(false);
    setSelected(null);
    setPinInput("");
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
        bankName: form.bankName || undefined,
        bankAccount: form.bankAccount || undefined,
        address: form.address || undefined,
        emergencyContact: form.emergencyContact || undefined,
        emergencyPhone: form.emergencyPhone || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Staff added");
          close();
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't add staff"),
      },
    );
  };

  const handleUpdate = () => {
    if (!selected) return;
    updateStaff.mutate(
      {
        id: selected.id,
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
          bankName: form.bankName || undefined,
          bankAccount: form.bankAccount || undefined,
          address: form.address || undefined,
          emergencyContact: form.emergencyContact || undefined,
          emergencyPhone: form.emergencyPhone || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Staff updated");
          close();
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't update staff"),
      },
    );
  };

  const handleDelete = () => {
    if (!selected) return;
    if (!confirm(`Deactivate ${selected.firstName} ${selected.lastName}?`)) return;
    deleteStaff.mutate(selected.id, {
      onSuccess: () => {
        toast.success("Staff deactivated");
        close();
      },
      onError: (e: Error) => toast.error(e.message ?? "Couldn't deactivate"),
    });
  };

  const handleSetPin = () => {
    if (!selected) return;
    if (pinInput.length < 4) {
      toast.error("PIN must be at least 4 digits");
      return;
    }
    setStaffPin.mutate(
      { id: selected.id, pin: pinInput },
      {
        onSuccess: () => {
          toast.success("PIN updated");
          setPinInput("");
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't set PIN"),
      },
    );
  };

  const handleClearPin = () => {
    if (!selected) return;
    clearStaffPin.mutate(selected.id, {
      onSuccess: () => toast.success("PIN cleared"),
      onError: (e: Error) => toast.error(e.message ?? "Couldn't clear PIN"),
    });
  };

  const isLoading = staffQuery.isLoading;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Staff</h1>
          <p className="text-sm text-muted-foreground">Manage your team members</p>
        </div>
        <Button size="sm" onClick={openAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-border/50">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-muted flex items-center justify-center">
                      <stat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="text-xl sm:text-2xl font-semibold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search staff..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 h-9 bg-muted/50 border-0"
              />
            </div>
            <Select
              value={roleFilter}
              onValueChange={(v) => {
                setRoleFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-44 h-9 bg-muted/50 border-0">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All Roles</SelectItem>
                {roles.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-32 h-9 bg-muted/50 border-0">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on-leave">On Leave</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="border-border/50">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4 space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : staff.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">No staff members found</p>
                </div>
              ) : (
                <>
                  <div className="block sm:hidden divide-y divide-border">
                    {staff.map((m) => {
                      const fullName = `${m.firstName} ${m.lastName}`;
                      return (
                        <div
                          key={m.id}
                          className="p-4 space-y-3 cursor-pointer hover:bg-muted/50"
                          onClick={() => openView(m)}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <Avatar className="h-10 w-10 shrink-0">
                                <AvatarFallback className="bg-muted text-xs">
                                  {fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="font-medium truncate">{fullName}</p>
                                <p className="text-xs text-muted-foreground">{m.roleName || "—"}</p>
                              </div>
                            </div>
                            <Badge
                              variant="secondary"
                              className={cn("text-xs font-normal shrink-0", statusColor(m.status))}
                            >
                              {formatStatus(m.status)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{m.email}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <Badge variant="secondary" className="font-normal">
                              {m.employmentType}
                            </Badge>
                            <span className="text-muted-foreground">
                              Joined {format(new Date(m.hireDate), "MMM d, yyyy")}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left text-xs font-medium text-muted-foreground p-4">Name</th>
                          <th className="text-left text-xs font-medium text-muted-foreground p-4">Role</th>
                          <th className="text-left text-xs font-medium text-muted-foreground p-4">Employment</th>
                          <th className="text-left text-xs font-medium text-muted-foreground p-4">Joined</th>
                          <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {staff.map((m) => {
                          const fullName = `${m.firstName} ${m.lastName}`;
                          return (
                            <tr
                              key={m.id}
                              className="border-b border-border last:border-0 cursor-pointer hover:bg-muted/50"
                              onClick={() => openView(m)}
                            >
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-muted text-xs">
                                      {fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium text-sm">{fullName}</p>
                                    <p className="text-xs text-muted-foreground">{m.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 text-sm">{m.roleName || "—"}</td>
                              <td className="p-4">
                                <Badge variant="secondary" className="font-normal text-xs">
                                  {m.employmentType}
                                </Badge>
                              </td>
                              <td className="p-4 text-sm text-muted-foreground">
                                {format(new Date(m.hireDate), "MMM d, yyyy")}
                              </td>
                              <td className="p-4">
                                <Badge
                                  variant="secondary"
                                  className={cn("text-xs font-normal", statusColor(m.status))}
                                >
                                  {formatStatus(m.status)}
                                </Badge>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
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
              onPageSizeChange={(s) => {
                setPageSize(s);
                setPage(1);
              }}
            />
          )}
        </div>

        <div className="hidden lg:block space-y-6">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={openAdd}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Staff
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Recent Hires</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentHires.length === 0 && !isLoading ? (
                <p className="text-sm text-muted-foreground">No recent hires</p>
              ) : (
                recentHires.map((m) => (
                  <div key={m.id} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-muted text-xs">
                        {`${m.firstName} ${m.lastName}`
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {m.firstName} {m.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{m.roleName || "—"}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Sheet open={sheetOpen} onOpenChange={(o) => (o ? setSheetOpen(true) : close())}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="space-y-1 pb-4 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle>
                {sheetMode === "add"
                  ? "Add Staff Member"
                  : sheetMode === "edit"
                    ? "Edit Staff"
                    : selected
                      ? `${selected.firstName} ${selected.lastName}`
                      : "Staff"}
              </SheetTitle>
              {sheetMode === "view" && selected && (
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => openEdit(selected)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
            {sheetMode === "view" && selected && (
              <SheetDescription>
                {selected.roleName || "—"} • {selected.employmentType}
              </SheetDescription>
            )}
          </SheetHeader>

          {sheetMode === "view" && selected ? (
            <div className="space-y-6 mt-4">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">Personal Information</h4>
                <div className="grid gap-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selected.email}</span>
                  </div>
                  {selected.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selected.phone}</span>
                    </div>
                  )}
                  {selected.address && (
                    <div className="text-sm">
                      <p className="text-muted-foreground text-xs mb-1">Address</p>
                      <p>{selected.address}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-sm font-medium text-muted-foreground">Employment Details</h4>
                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Role</span>
                    <span className="font-medium">{selected.roleName || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Employment</span>
                    <span className="font-medium">{selected.employmentType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hire Date</span>
                    <span className="font-medium">
                      {format(new Date(selected.hireDate), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Salary</span>
                    <span className="font-medium">
                      ₦{Number(selected.baseSalary).toLocaleString()} / {selected.salaryPeriod}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status</span>
                    <Badge className={cn("text-xs", statusColor(selected.status))}>
                      {formatStatus(selected.status)}
                    </Badge>
                  </div>
                </div>
              </div>

              {(selected.bankName || selected.bankAccount) && (
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="text-sm font-medium text-muted-foreground">Bank Details</h4>
                  <div className="grid gap-3 text-sm">
                    {selected.bankName && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bank</span>
                        <span className="font-medium">{selected.bankName}</span>
                      </div>
                    )}
                    {selected.bankAccount && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Account</span>
                        <span className="font-medium font-mono">{selected.bankAccount}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(selected.emergencyContact || selected.emergencyPhone) && (
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="text-sm font-medium text-muted-foreground">Emergency Contact</h4>
                  <div className="grid gap-3 text-sm">
                    {selected.emergencyContact && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Contact</span>
                        <span className="font-medium">{selected.emergencyContact}</span>
                      </div>
                    )}
                    {selected.emergencyPhone && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone</span>
                        <span className="font-medium">{selected.emergencyPhone}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-3 pt-4 border-t">
                <h4 className="text-sm font-medium text-muted-foreground">Workstation PIN</h4>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    placeholder="New PIN"
                    maxLength={8}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
                  />
                  <Button
                    size="sm"
                    onClick={handleSetPin}
                    disabled={setStaffPin.isPending || pinInput.length < 4}
                  >
                    <Key className="mr-2 h-4 w-4" /> Set
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearPin}
                  disabled={clearStaffPin.isPending}
                >
                  Clear PIN
                </Button>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" className="flex-1" onClick={() => openEdit(selected)}>
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleDelete}
                  disabled={deleteStaff.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Deactivate
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 mt-4">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Personal Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
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
                  <Label>Address</Label>
                  <Input
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-sm font-medium">Employment</h4>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select
                    value={form.roleId}
                    onValueChange={(v) => setForm({ ...form, roleId: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {rolesQuery.isError && (
                    <p className="text-xs text-destructive">
                      Couldn't load roles. Refresh and try again.
                    </p>
                  )}
                  {!rolesQuery.isError && !rolesQuery.isLoading && roles.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      No roles yet — create one in Roles &amp; Permissions first.
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Employment Type</Label>
                    <Select
                      value={form.employmentType}
                      onValueChange={(v) => setForm({ ...form, employmentType: v as Staff["employmentType"] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full time</SelectItem>
                        <SelectItem value="part-time">Part time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="intern">Intern</SelectItem>
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
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="on-leave">On Leave</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="terminated">Terminated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Base Salary (₦)</Label>
                    <Input
                      type="number"
                      value={form.baseSalary}
                      onChange={(e) => setForm({ ...form, baseSalary: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Salary Period</Label>
                    <Select
                      value={form.salaryPeriod}
                      onValueChange={(v) =>
                        setForm({ ...form, salaryPeriod: v as Staff["salaryPeriod"] })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {sheetMode === "add" && (
                  <div className="space-y-2">
                    <Label>Hire Date</Label>
                    <Input
                      type="date"
                      value={form.hireDate}
                      onChange={(e) => setForm({ ...form, hireDate: e.target.value })}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-sm font-medium">Bank Details</h4>
                <div className="space-y-2">
                  <Label>Bank Name</Label>
                  <Input
                    value={form.bankName}
                    onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Account Number</Label>
                  <Input
                    value={form.bankAccount}
                    onChange={(e) => setForm({ ...form, bankAccount: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-sm font-medium">Emergency Contact</h4>
                <div className="space-y-2">
                  <Label>Contact Name</Label>
                  <Input
                    value={form.emergencyContact}
                    onChange={(e) =>
                      setForm({ ...form, emergencyContact: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact Phone</Label>
                  <Input
                    value={form.emergencyPhone}
                    onChange={(e) => setForm({ ...form, emergencyPhone: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" className="flex-1" onClick={close}>
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={sheetMode === "add" ? handleCreate : handleUpdate}
                  disabled={createStaff.isPending || updateStaff.isPending}
                >
                  {sheetMode === "add" ? "Add Staff" : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
