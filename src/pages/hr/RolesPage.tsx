import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus, Shield, Users, Settings, Key } from "lucide-react";

export default function RolesPage() {
  const [search, setSearch] = useState("");

  const roles = [
    { id: 1, name: "Admin", description: "Full system access", users: 2, permissions: ["all"] },
    { id: 2, name: "Manager", description: "Store management access", users: 4, permissions: ["orders", "staff", "reports", "inventory"] },
    { id: 3, name: "Cashier", description: "POS and order access", users: 8, permissions: ["orders", "payments"] },
    { id: 4, name: "Chef", description: "Kitchen access only", users: 6, permissions: ["orders", "kitchen"] },
    { id: 5, name: "Server", description: "Order taking access", users: 10, permissions: ["orders"] },
  ];

  const permissions = [
    "Orders", "Payments", "Inventory", "Staff", "Reports", "Settings", "Kitchen", "Customers"
  ];

  const stats = [
    { label: "Total Roles", value: "5", icon: Shield },
    { label: "Total Users", value: "30", icon: Users },
    { label: "Permissions", value: "8", icon: Key },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Roles & Permissions</h1>
          <p className="text-sm text-muted-foreground">Define access levels for your team</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-2" />Add Role</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Role</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Role Name</Label><Input placeholder="e.g., Supervisor" /></div>
              <div className="space-y-2"><Label>Description</Label><Input placeholder="Brief description" /></div>
              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 gap-2">
                  {permissions.map((perm) => (
                    <div key={perm} className="flex items-center gap-2">
                      <Checkbox id={perm} />
                      <label htmlFor={perm} className="text-sm">{perm}</label>
                    </div>
                  ))}
                </div>
              </div>
              <Button className="w-full">Create Role</Button>
            </div>
          </DialogContent>
        </Dialog>
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
            {roles.map((role) => (
              <Card key={role.id} className="border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Shield className="h-4 w-4 text-primary" />
                      </div>
                      <CardTitle className="text-base">{role.name}</CardTitle>
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
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Edit Role
                  </Button>
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
              {permissions.map((perm) => (
                <div key={perm} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Key className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{perm}</span>
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
              <Button variant="outline" size="sm" className="w-full justify-start">
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
    </div>
  );
}
