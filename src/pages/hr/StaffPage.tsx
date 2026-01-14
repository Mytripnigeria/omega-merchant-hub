import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { Search, Plus, MoreHorizontal, Filter } from "lucide-react";
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

const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  "On Leave": "bg-yellow-100 text-yellow-700",
  Inactive: "bg-gray-100 text-gray-600",
};

export default function StaffPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Staff</h1>
          <p className="text-sm text-muted-foreground">
            Manage your team members
          </p>
        </div>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Staff</p>
            <p className="text-2xl font-semibold">24</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-semibold">22</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">On Leave</p>
            <p className="text-2xl font-semibold text-yellow-600">2</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Departments</p>
            <p className="text-2xl font-semibold">5</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="operations">Operations</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="kitchen">Kitchen</SelectItem>
            <SelectItem value="service">Service</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="leave">On Leave</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Staff Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6 w-12">
                  <input type="checkbox" className="rounded border-border" />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6 w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((member) => (
                <TableRow key={member.id} className="group cursor-pointer hover:bg-muted/50">
                  <TableCell className="pl-6">
                    <input type="checkbox" className="rounded border-border" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-muted text-xs">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">{member.department}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{member.joinDate}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className={cn("font-normal", statusColors[member.status])}
                    >
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6">
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing 1-6 of 24 staff
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
