import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Users, Shield, Clock, Search } from "lucide-react";

export default function UsersPage() {
  const [search, setSearch] = useState("");

  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "active", lastActive: "Now" },
    { id: 2, name: "Sarah Smith", email: "sarah@example.com", role: "Manager", status: "active", lastActive: "5m ago" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "Cashier", status: "inactive", lastActive: "2h ago" },
    { id: 4, name: "Emily Brown", email: "emily@example.com", role: "Kitchen", status: "active", lastActive: "Now" },
  ];

  const stats = [
    { label: "Total Users", value: "24", icon: Users },
    { label: "Active Now", value: "8", icon: Shield },
    { label: "Roles", value: "5", icon: Clock },
  ];

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Users</h1>
          <p className="text-muted-foreground">Manage workstation users and access</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" /> Add User</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg transition-colors hover:bg-muted/50">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>{user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline">{user.role}</Badge>
                  <span className="text-sm text-muted-foreground">{user.lastActive}</span>
                  <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
