import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus, Shield, Users, Settings, Key, X, Edit, Trash2 } from "lucide-react";
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

interface Role {
  id: number;
  name: string;
  description: string;
  users: number;
  permissions: string[];
  isSystem?: boolean;
  createdAt?: string;
}

const allPermissions = [
  { id: "orders", label: "Orders", description: "View and manage orders" },
  { id: "payments", label: "Payments", description: "Process payments and refunds" },
  { id: "inventory", label: "Inventory", description: "Manage stock and inventory" },
  { id: "staff", label: "Staff", description: "Manage staff and schedules" },
  { id: "reports", label: "Reports", description: "Access business reports" },
  { id: "settings", label: "Settings", description: "Modify system settings" },
  { id: "kitchen", label: "Kitchen", description: "Access kitchen display" },
  { id: "customers", label: "Customers", description: "View customer data" },
];

const rolesData: Role[] = [
  { id: 1, name: "Admin", description: "Full system access", users: 2, permissions: ["all"], isSystem: true, createdAt: "2025-01-01" },
  { id: 2, name: "Manager", description: "Store management access", users: 4, permissions: ["orders", "staff", "reports", "inventory"], createdAt: "2025-02-15" },
  { id: 3, name: "Cashier", description: "POS and order access", users: 8, permissions: ["orders", "payments"], createdAt: "2025-03-10" },
  { id: 4, name: "Chef", description: "Kitchen access only", users: 6, permissions: ["orders", "kitchen"], createdAt: "2025-03-10" },
  { id: 5, name: "Server", description: "Order taking access", users: 10, permissions: ["orders"], createdAt: "2025-04-01" },
];

export default function RolesPage() {
  const [search, setSearch] = useState("");
  const [roles] = useState(rolesData);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const stats = [
    { label: "Total Roles", value: roles.length.toString(), icon: Shield },
    { label: "Total Users", value: roles.reduce((sum, r) => sum + r.users, 0).toString(), icon: Users },
    { label: "Permissions", value: allPermissions.length.toString(), icon: Key },
  ];

  const handleViewRole = (role: Role) => {
    setSelectedRole(role);
    setSelectedPermissions(role.permissions);
    setIsViewSheetOpen(true);
  };

  const handleAddRole = () => {
    setSelectedRole(null);
    setSelectedPermissions([]);
    setIsAddSheetOpen(true);
  };

  const togglePermission = (permId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permId) 
        ? prev.filter(p => p !== permId)
        : [...prev, permId]
    );
  };

  const filteredRoles = roles.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Roles & Permissions</h1>
          <p className="text-sm text-muted-foreground">Define access levels for your team</p>
        </div>
        <Button size="sm" onClick={handleAddRole}>
          <Plus className="h-4 w-4 mr-2" />Add Role
        </Button>
      </div>

      {/* Two-column layout for desktop */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
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

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search roles..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="pl-9 h-9 bg-muted/50 border-0" 
            />
          </div>

          {/* Roles Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredRoles.map((role) => (
              <Card 
                key={role.id} 
                className="border-border/50 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleViewRole(role)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Shield className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{role.name}</CardTitle>
                        {role.isSystem && (
                          <Badge variant="outline" className="text-xs mt-0.5">System</Badge>
                        )}
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      {role.users}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.slice(0, 4).map((perm) => (
                      <Badge key={perm} variant="outline" className="text-xs">{perm}</Badge>
                    ))}
                    {role.permissions.length > 4 && (
                      <Badge variant="outline" className="text-xs">+{role.permissions.length - 4}</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">All Permissions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {allPermissions.map((perm) => (
                <div key={perm.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Key className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{perm.label}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleAddRole}>
                <Plus className="mr-2 h-4 w-4" />
                Create New Role
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Key className="mr-2 h-4 w-4" />
                Manage Permissions
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Role Settings
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-muted/30">
            <CardContent className="p-4">
              <h4 className="font-medium text-sm mb-2">Security Tip</h4>
              <p className="text-xs text-muted-foreground">
                Follow the principle of least privilege - only grant permissions that are necessary for each role.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Role Sheet */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Create New Role</SheetTitle>
            <SheetDescription>Define a new role with specific permissions</SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6">
            <div className="space-y-2">
              <Label>Role Name</Label>
              <Input placeholder="e.g., Supervisor" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Brief description of this role" rows={2} />
            </div>
            <div className="space-y-4">
              <Label>Permissions</Label>
              <div className="space-y-3">
                {allPermissions.map((perm) => (
                  <div 
                    key={perm.id} 
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => togglePermission(perm.id)}
                  >
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">{perm.label}</p>
                      <p className="text-xs text-muted-foreground">{perm.description}</p>
                    </div>
                    <Switch checked={selectedPermissions.includes(perm.id)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <SheetFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsAddSheetOpen(false)} className="w-full sm:w-auto">Cancel</Button>
            <Button className="w-full sm:w-auto">Create Role</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* View/Edit Role Sheet */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle>{selectedRole?.name}</SheetTitle>
                <SheetDescription>{selectedRole?.description}</SheetDescription>
              </div>
              {selectedRole?.isSystem && (
                <Badge variant="outline">System Role</Badge>
              )}
            </div>
          </SheetHeader>
          
          <Tabs defaultValue="details" className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Role Name</Label>
                <Input defaultValue={selectedRole?.name} disabled={selectedRole?.isSystem} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea defaultValue={selectedRole?.description} rows={2} disabled={selectedRole?.isSystem} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-2xl font-semibold">{selectedRole?.users}</p>
                  <p className="text-xs text-muted-foreground">Assigned Users</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-2xl font-semibold">{selectedRole?.permissions.length}</p>
                  <p className="text-xs text-muted-foreground">Permissions</p>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Created: {selectedRole?.createdAt}
              </div>
            </TabsContent>
            
            <TabsContent value="permissions" className="space-y-3 mt-4">
              {allPermissions.map((perm) => (
                <div 
                  key={perm.id} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => !selectedRole?.isSystem && togglePermission(perm.id)}
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">{perm.label}</p>
                    <p className="text-xs text-muted-foreground">{perm.description}</p>
                  </div>
                  <Switch 
                    checked={selectedPermissions.includes(perm.id) || selectedRole?.permissions.includes("all")} 
                    disabled={selectedRole?.isSystem}
                  />
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="users" className="space-y-3 mt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Users with this role</p>
                <Button size="sm" variant="outline">
                  <Plus className="h-3 w-3 mr-1" />Add
                </Button>
              </div>
              {Array.from({ length: selectedRole?.users || 0 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-xs font-medium">U{i + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">User {i + 1}</p>
                      <p className="text-xs text-muted-foreground">user{i + 1}@store.com</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </TabsContent>
          </Tabs>
          
          <SheetFooter className="flex-col sm:flex-row gap-2 mt-6">
            {!selectedRole?.isSystem && (
              <>
                <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                  <Trash2 className="h-4 w-4 mr-2" />Delete
                </Button>
                <Button className="w-full sm:w-auto">
                  <Edit className="h-4 w-4 mr-2" />Save Changes
                </Button>
              </>
            )}
            {selectedRole?.isSystem && (
              <p className="text-xs text-muted-foreground text-center w-full">
                System roles cannot be modified
              </p>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
