import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, Shield, Users, Key, Edit, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  useRoles,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
  usePermissions,
  useStaff,
} from "@/hooks/api/use-hr";
import { useStore } from "@/contexts/StoreContext";
import type { Role } from "@/types/hr";

interface RoleForm {
  name: string;
  description: string;
  permissions: string[];
  color: string;
}

const emptyForm = (): RoleForm => ({
  name: "",
  description: "",
  permissions: [],
  color: "#6366F1",
});

function permissionLabel(perm: string): string {
  return perm
    .replace(/[._:]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function RolesPage() {
  const { currentStore } = useStore();
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<Role | null>(null);
  const [form, setForm] = useState<RoleForm>(emptyForm());

  const rolesQuery = useRoles({ storeId: currentStore?.id, limit: 100 });
  const permissionsQuery = usePermissions();
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const deleteRole = useDeleteRole();

  const allPermissions = permissionsQuery.data ?? [];
  const roles = rolesQuery.data?.data ?? [];

  const staffByRole = useStaff({
    storeId: currentStore?.id,
    roleId: selected?.id,
    limit: 100,
  });

  const filtered = useMemo(
    () =>
      roles.filter(
        (r) =>
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          (r.description ?? "").toLowerCase().includes(search.toLowerCase()),
      ),
    [roles, search],
  );

  const stats = [
    { label: "Total Roles", value: String(roles.length), icon: Shield },
    {
      label: "Total Staff",
      value: String(roles.reduce((sum, r) => sum + (r.staffCount ?? 0), 0)),
      icon: Users,
    },
    { label: "Permissions", value: String(allPermissions.length), icon: Key },
  ];

  const openCreate = () => {
    setSelected(null);
    setForm(emptyForm());
    setCreateOpen(true);
  };

  const openView = (role: Role) => {
    setSelected(role);
    setForm({
      name: role.name,
      description: role.description ?? "",
      permissions: [...(role.permissions ?? [])],
      color: role.color ?? "#6366F1",
    });
    setViewOpen(true);
  };

  const togglePerm = (perm: string) => {
    setForm((f) => ({
      ...f,
      permissions: f.permissions.includes(perm)
        ? f.permissions.filter((p) => p !== perm)
        : [...f.permissions, perm],
    }));
  };

  const handleCreate = () => {
    if (!currentStore) {
      toast.error("Select a store first");
      return;
    }
    if (!form.name.trim()) {
      toast.error("Role name is required");
      return;
    }
    if (form.permissions.length === 0) {
      toast.error("Select at least one permission");
      return;
    }
    createRole.mutate(
      {
        storeId: currentStore.id,
        name: form.name,
        description: form.description || undefined,
        permissions: form.permissions,
        color: form.color || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Role created");
          setCreateOpen(false);
          setForm(emptyForm());
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't create role"),
      },
    );
  };

  const handleUpdate = () => {
    if (!selected) return;
    if (form.permissions.length === 0) {
      toast.error("Select at least one permission");
      return;
    }
    updateRole.mutate(
      {
        id: selected.id,
        data: {
          name: form.name,
          description: form.description || undefined,
          permissions: form.permissions,
          color: form.color || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Role updated");
          setViewOpen(false);
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't update role"),
      },
    );
  };

  const handleDelete = () => {
    if (!selected) return;
    if (!confirm(`Delete role ${selected.name}?`)) return;
    deleteRole.mutate(selected.id, {
      onSuccess: () => {
        toast.success("Role deleted");
        setViewOpen(false);
      },
      onError: (e: Error) => toast.error(e.message ?? "Couldn't delete role"),
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Roles & Permissions</h1>
          <p className="text-sm text-muted-foreground">Define access levels for your team</p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Role
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-3 grid-cols-3">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search roles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 bg-muted/50 border-0"
            />
          </div>

          {rolesQuery.isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Shield className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No roles yet</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={openCreate}>
                Create your first role
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map((role) => (
                <Card
                  key={role.id}
                  className="border-border/50 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => openView(role)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-8 w-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: (role.color ?? "#6366F1") + "20" }}
                        >
                          <Shield
                            className="h-4 w-4"
                            style={{ color: role.color ?? "#6366F1" }}
                          />
                        </div>
                        <div>
                          <CardTitle className="text-base">{role.name}</CardTitle>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        {role.staffCount ?? 0}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {role.description && (
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    )}
                    <div className="flex flex-wrap gap-1">
                      {(role.permissions ?? []).slice(0, 4).map((perm) => (
                        <Badge key={perm} variant="outline" className="text-xs">
                          {permissionLabel(perm)}
                        </Badge>
                      ))}
                      {(role.permissions ?? []).length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{(role.permissions ?? []).length - 4}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">All Permissions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-y-auto">
              {permissionsQuery.isLoading ? (
                Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)
              ) : allPermissions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No permissions defined</p>
              ) : (
                allPermissions.map((perm) => (
                  <div
                    key={perm}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50"
                  >
                    <Key className="h-3 w-3 text-muted-foreground shrink-0" />
                    <span className="text-sm truncate">{permissionLabel(perm)}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-muted/30">
            <CardContent className="p-4">
              <h4 className="font-medium text-sm mb-2">Security Tip</h4>
              <p className="text-xs text-muted-foreground">
                Follow the principle of least privilege — only grant the permissions a role
                actually needs to do its job.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Sheet open={createOpen} onOpenChange={setCreateOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Create New Role</SheetTitle>
            <SheetDescription>Define a new role with specific permissions</SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6">
            <div className="space-y-2">
              <Label>Role Name</Label>
              <Input
                placeholder="e.g., Supervisor"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Brief description of this role"
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <Input
                type="color"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="h-10 w-20 p-1"
              />
            </div>
            <div className="space-y-4">
              <Label>Permissions</Label>
              {permissionsQuery.isLoading ? (
                <Skeleton className="h-40 w-full" />
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {allPermissions.map((perm) => (
                    <div
                      key={perm}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => togglePerm(perm)}
                    >
                      <p className="text-sm font-medium">{permissionLabel(perm)}</p>
                      <Switch checked={form.permissions.includes(perm)} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <SheetFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setCreateOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={handleCreate}
              disabled={createRole.isPending}
            >
              Create Role
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={viewOpen} onOpenChange={setViewOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selected?.name}</SheetTitle>
            <SheetDescription>{selected?.description ?? "Role details"}</SheetDescription>
          </SheetHeader>

          <Tabs defaultValue="details" className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Role Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <Input
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="h-10 w-20 p-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-2xl font-semibold">{selected?.staffCount ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Assigned Staff</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-2xl font-semibold">{form.permissions.length}</p>
                  <p className="text-xs text-muted-foreground">Permissions</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-3 mt-4">
              {permissionsQuery.isLoading ? (
                <Skeleton className="h-40 w-full" />
              ) : (
                allPermissions.map((perm) => (
                  <div
                    key={perm}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => togglePerm(perm)}
                  >
                    <p className="text-sm font-medium">{permissionLabel(perm)}</p>
                    <Switch checked={form.permissions.includes(perm)} />
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="staff" className="space-y-3 mt-4">
              {staffByRole.isLoading ? (
                <Skeleton className="h-40 w-full" />
              ) : (staffByRole.data?.data ?? []).length === 0 ? (
                <div className="text-center py-6 text-sm text-muted-foreground">
                  No staff assigned to this role
                </div>
              ) : (
                (staffByRole.data?.data ?? []).map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {(s.firstName[0] ?? "") + (s.lastName[0] ?? "")}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {s.firstName} {s.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{s.email}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>

          <SheetFooter className="flex-col sm:flex-row gap-2 mt-6">
            <Button
              variant="destructive"
              size="sm"
              className="w-full sm:w-auto"
              onClick={handleDelete}
              disabled={deleteRole.isPending}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={handleUpdate}
              disabled={updateRole.isPending}
            >
              <Edit className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
