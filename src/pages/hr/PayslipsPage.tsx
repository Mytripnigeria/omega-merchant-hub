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
import { Search, Download, FileText, MoreHorizontal, DollarSign, Users, Clock, Calendar, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface Payslip {
  id: string;
  staff: string;
  email: string;
  period: string;
  baseSalary: string;
  overtime: string;
  deductions: string;
  netPay: string;
  status: "Paid" | "Pending" | "Processing";
}

const payslips: Payslip[] = [
  { id: "1", staff: "John Doe", email: "john@store.com", period: "Jan 2026", baseSalary: "₦300,000", overtime: "+₦25,000", deductions: "-₦15,000", netPay: "₦310,000", status: "Paid" },
  { id: "2", staff: "Sarah Smith", email: "sarah@store.com", period: "Jan 2026", baseSalary: "₦250,000", overtime: "+₦10,000", deductions: "-₦12,500", netPay: "₦247,500", status: "Pending" },
  { id: "3", staff: "Mike Johnson", email: "mike@store.com", period: "Jan 2026", baseSalary: "₦280,000", overtime: "₦0", deductions: "-₦14,000", netPay: "₦266,000", status: "Processing" },
  { id: "4", staff: "Lisa Brown", email: "lisa@store.com", period: "Jan 2026", baseSalary: "₦220,000", overtime: "+₦18,000", deductions: "-₦11,000", netPay: "₦227,000", status: "Paid" },
  { id: "5", staff: "David Wilson", email: "david@store.com", period: "Jan 2026", baseSalary: "₦350,000", overtime: "+₦30,000", deductions: "-₦19,000", netPay: "₦361,000", status: "Paid" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Paid": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "Pending": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "Processing": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    default: return "";
  }
};

export default function PayslipsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const stats = [
    { label: "Total Payroll", value: "₦4.5M", icon: DollarSign, description: "This month" },
    { label: "Staff Paid", value: "18/24", icon: Users, description: "75% complete" },
    { label: "Pending", value: "6", icon: Clock, description: "Awaiting approval" },
    { label: "Period", value: "Jan 2026", icon: Calendar, description: "Current cycle" },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Payslips</h1>
          <p className="text-sm text-muted-foreground">Manage staff salaries and payments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden xs:inline">Export</span>
          </Button>
          <Button size="sm" className="flex-1 sm:flex-none">
            <FileText className="mr-2 h-4 w-4" />
            <span className="hidden xs:inline">Generate</span>
          </Button>
        </div>
      </div>

      {/* Two-column layout for desktop */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content - 2 columns on desktop */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Stats - 2x2 grid on mobile, 4 columns on desktop */}
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
            <Select defaultValue="jan2026">
              <SelectTrigger className="w-full sm:w-32 h-9 bg-muted/50 border-0">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jan2026">Jan 2026</SelectItem>
                <SelectItem value="dec2025">Dec 2025</SelectItem>
                <SelectItem value="nov2025">Nov 2025</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-28 h-9 bg-muted/50 border-0">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payslips List */}
          <Card className="border-border/50">
            <CardContent className="p-0">
              {/* Mobile Card View */}
              <div className="block sm:hidden divide-y divide-border">
                {payslips.map((slip) => (
                  <div key={slip.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-9 w-9 shrink-0">
                          <AvatarFallback className="bg-muted text-xs">
                            {slip.staff.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{slip.staff}</p>
                          <p className="text-xs text-muted-foreground truncate">{slip.email}</p>
                        </div>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={cn("text-xs font-normal shrink-0", getStatusColor(slip.status))}
                      >
                        {slip.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Base</p>
                        <p className="font-medium">{slip.baseSalary}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Overtime</p>
                        <p className="font-medium text-green-600">{slip.overtime}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Deductions</p>
                        <p className="font-medium text-red-600">{slip.deductions}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-xs text-muted-foreground">{slip.period}</span>
                      <span className="font-semibold">{slip.netPay}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Staff</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Base</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Overtime</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Deductions</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Net Pay</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {payslips.map((slip) => (
                      <tr key={slip.id} className="border-b border-border last:border-0 group cursor-pointer hover:bg-muted/50">
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-sm">{slip.staff}</p>
                            <p className="text-xs text-muted-foreground">{slip.email}</p>
                          </div>
                        </td>
                        <td className="p-4 text-sm">{slip.baseSalary}</td>
                        <td className="p-4 text-sm text-green-600">{slip.overtime}</td>
                        <td className="p-4 text-sm text-red-600">{slip.deductions}</td>
                        <td className="p-4 font-semibold text-sm">{slip.netPay}</td>
                        <td className="p-4">
                          <Badge 
                            variant="secondary" 
                            className={cn("text-xs font-normal", getStatusColor(slip.status))}
                          >
                            {slip.status}
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
            <p className="text-xs text-muted-foreground">Showing 1-5 of 24 payslips</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled className="h-8">Previous</Button>
              <Button variant="outline" size="sm" className="h-8">Next</Button>
            </div>
          </div>
        </div>

        {/* Sidebar - Hidden on mobile */}
        <div className="hidden lg:block space-y-6">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Generate All Payslips
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Export to Excel
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Bulk Pay
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Base</span>
                <span className="font-medium">₦6.0M</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Overtime</span>
                <span className="font-medium text-green-600">+₦450K</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Deductions</span>
                <span className="font-medium text-red-600">-₦380K</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-sm">
                <span className="font-medium">Net Payroll</span>
                <span className="font-semibold">₦6.07M</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { action: "Payslip generated", staff: "John Doe", time: "2 hours ago" },
                { action: "Payment approved", staff: "Sarah Smith", time: "4 hours ago" },
                { action: "Overtime added", staff: "Mike Johnson", time: "1 day ago" },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                  <div>
                    <p className="text-muted-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.staff} • {activity.time}</p>
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
