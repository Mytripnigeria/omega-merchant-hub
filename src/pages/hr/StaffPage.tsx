import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Plus, MoreHorizontal, Users, UserCheck, UserX, Building2 } from "lucide-react";
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Staff</h1>
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
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
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

          {/* Staff Table */}
          <Card className="border-border/50">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-transparent">
                      <TableHead className="text-xs font-medium text-muted-foreground">Name</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground">Role</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground hidden sm:table-cell">Dept</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground hidden md:table-cell">Joined</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staff.map((member) => (
                      <TableRow key={member.id} className="border-border/50 group cursor-pointer">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-muted text-xs">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{member.name}</p>
                              <p className="text-xs text-muted-foreground hidden sm:block">{member.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{member.role}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="secondary" className="font-normal text-xs">{member.department}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{member.joinDate}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="secondary" 
                            className={cn(
                              "text-xs font-normal",
                              member.status === "Active" && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                              member.status === "On Leave" && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                              member.status === "Inactive" && "bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400"
                            )}
                          >
                            {member.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Showing 1-6 of 24 staff</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled className="h-8">Previous</Button>
              <Button variant="outline" size="sm" className="h-8">Next</Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
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
