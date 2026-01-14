import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus, Shield, Users } from "lucide-react";

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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Roles & Permissions</h1>
          <p className="text-muted-foreground">Define access levels for your team</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Add Role</Button>
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

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search roles..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{role.name}</CardTitle>
                </div>
                <Badge variant="secondary">
                  <Users className="h-3 w-3 mr-1" />
                  {role.users}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{role.description}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {role.permissions.map((perm) => (
                  <Badge key={perm} variant="outline" className="text-xs">{perm}</Badge>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full">Edit Role</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
