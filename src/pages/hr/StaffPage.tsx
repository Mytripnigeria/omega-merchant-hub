import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Plus, Users, UserCheck, Clock, Filter } from "lucide-react";

export default function StaffPage() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");

  const staff = [
    { id: 1, name: "John Doe", email: "john@store.com", role: "Manager", department: "Operations", status: "active", joinDate: "2024-01-15" },
    { id: 2, name: "Sarah Smith", email: "sarah@store.com", role: "Cashier", department: "Sales", status: "active", joinDate: "2024-03-20" },
    { id: 3, name: "Mike Johnson", email: "mike@store.com", role: "Chef", department: "Kitchen", status: "active", joinDate: "2024-02-10" },
    { id: 4, name: "Lisa Brown", email: "lisa@store.com", role: "Server", department: "Service", status: "on-leave", joinDate: "2024-05-05" },
  ];

  const stats = [
    { label: "Total Staff", value: "24", icon: Users },
    { label: "Active", value: "22", icon: UserCheck },
    { label: "On Leave", value: "2", icon: Clock },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Staff</h1>
          <p className="text-muted-foreground">Manage your team members</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Add Staff</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Staff Member</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Full Name</Label><Input placeholder="Enter full name" /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="email@store.com" /></div>
              <div className="space-y-2"><Label>Role</Label><Input placeholder="e.g., Cashier" /></div>
              <div className="space-y-2"><Label>Department</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="kitchen">Kitchen</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">Add Staff</Button>
            </div>
          </DialogContent>
        </Dialog>
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
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search staff..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={deptFilter} onValueChange={setDeptFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="kitchen">Kitchen</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>{member.department}</TableCell>
                  <TableCell>{member.joinDate}</TableCell>
                  <TableCell>
                    <Badge variant={member.status === "active" ? "default" : "secondary"}>{member.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
