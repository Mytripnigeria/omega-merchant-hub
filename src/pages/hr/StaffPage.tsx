import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Plus, MoreHorizontal, Users, UserCheck, UserX, Building2, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface Staff {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  joinDate: string;
  status: "Active" | "On Leave" | "Inactive";
}

const staff: Staff[] = [
  { id: "1", name: "John Doe", email: "john@store.com", role: "Manager", department: "Operations", joinDate: "Jan 15, 2024", status: "Active" },
  { id: "2", name: "Sarah Smith", email: "sarah@store.com", role: "Cashier", department: "Sales", joinDate: "Mar 20, 2024", status: "Active" },
  { id: "3", name: "Mike Johnson", email: "mike@store.com", role: "Chef", department: "Kitchen", joinDate: "Feb 10, 2024", status: "Active" },
  { id: "4", name: "Lisa Brown", email: "lisa@store.com", role: "Server", department: "Service", joinDate: "May 5, 2024", status: "On Leave" },
  { id: "5", name: "David Wilson", email: "david@store.com", role: "Delivery", department: "Logistics", joinDate: "Jun 12, 2024", status: "Active" },
  { id: "6", name: "Emma Davis", email: "emma@store.com", role: "Cashier", department: "Sales", joinDate: "Jul 8, 2024", status: "Inactive" },
];

export default function StaffPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const stats = [
    { label: "Total Staff", value: "24", icon: Users },
    { label: "Active", value: "22", icon: UserCheck },
    { label: "On Leave", value: "2", icon: UserX },
    { label: "Departments", value: "5", icon: Building2 },
  ];

  const departments = [
    { name: "Operations", count: 4 },
    { name: "Sales", count: 6 },
    { name: "Kitchen", count: 8 },
    { name: "Service", count: 4 },
    { name: "Logistics", count: 2 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "On Leave": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Inactive": return "bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400";
      default: return "";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Staff</h1>
          <p className="text-sm text-muted-foreground">Manage your team members</p>
        </div>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      </div>

      {/* Two-column layout for desktop */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Stats */}
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

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search staff..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-muted/50 border-0"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-36 h-9 bg-muted/50 border-0">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Depts</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="kitchen">Kitchen</SelectItem>
                <SelectItem value="service">Service</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-28 h-9 bg-muted/50 border-0">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="leave">On Leave</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Staff List */}
          <Card className="border-border/50">
            <CardContent className="p-0">
              {/* Mobile Card View */}
              <div className="block sm:hidden divide-y divide-border">
                {staff.map((member) => (
                  <div key={member.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarFallback className="bg-muted text-xs">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={cn("text-xs font-normal shrink-0", getStatusColor(member.status))}
                      >
                        {member.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <Badge variant="secondary" className="font-normal">{member.department}</Badge>
                      <span className="text-muted-foreground">Joined {member.joinDate}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Name</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Role</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Dept</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Joined</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {staff.map((member) => (
                      <tr key={member.id} className="border-b border-border last:border-0 group cursor-pointer hover:bg-muted/50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-muted text-xs">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{member.name}</p>
                              <p className="text-xs text-muted-foreground">{member.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm">{member.role}</td>
                        <td className="p-4">
                          <Badge variant="secondary" className="font-normal text-xs">{member.department}</Badge>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{member.joinDate}</td>
                        <td className="p-4">
                          <Badge 
                            variant="secondary" 
                            className={cn("text-xs font-normal", getStatusColor(member.status))}
                          >
                            {member.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">Showing 1-6 of 24 staff</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled className="h-8">Previous</Button>
              <Button variant="outline" size="sm" className="h-8">Next</Button>
            </div>
          </div>
        </div>

        {/* Sidebar - Hidden on mobile, shown on lg */}
        <div className="hidden lg:block space-y-6">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">By Department</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {departments.map((dept) => (
                <div key={dept.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                  <span className="text-sm">{dept.name}</span>
                  <Badge variant="secondary" className="text-xs">{dept.count}</Badge>
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
                Add New Staff
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Import Staff
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Building2 className="mr-2 h-4 w-4" />
                Manage Departments
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Recent Hires</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {staff.slice(0, 3).map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-muted text-xs">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
