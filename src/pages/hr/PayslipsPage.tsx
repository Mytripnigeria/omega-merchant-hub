import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Download, FileText, DollarSign, Users, Clock, Calendar, Mail, Printer, Eye, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Custom Charges Component for Breakdown Tab
interface CustomCharge {
  id: string;
  name: string;
  amount: number;
  type: "earning" | "deduction";
}

function BreakdownTab({ payslip, formatCurrency }: { payslip: Payslip | null; formatCurrency: (amount: number) => string }) {
  const [customCharges, setCustomCharges] = useState<CustomCharge[]>([]);
  const [newChargeName, setNewChargeName] = useState("");
  const [newChargeAmount, setNewChargeAmount] = useState("");
  const [newChargeType, setNewChargeType] = useState<"earning" | "deduction">("earning");

  const addCustomCharge = () => {
    if (newChargeName && newChargeAmount) {
      setCustomCharges([
        ...customCharges,
        {
          id: Date.now().toString(),
          name: newChargeName,
          amount: parseFloat(newChargeAmount),
          type: newChargeType,
        },
      ]);
      setNewChargeName("");
      setNewChargeAmount("");
    }
  };

  const removeCustomCharge = (id: string) => {
    setCustomCharges(customCharges.filter((c) => c.id !== id));
  };

  const customEarnings = customCharges.filter((c) => c.type === "earning");
  const customDeductions = customCharges.filter((c) => c.type === "deduction");

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Earnings</h4>
        <div className="space-y-2">
          <div className="flex justify-between p-3 border rounded-lg">
            <span className="text-sm">Basic Salary</span>
            <span className="font-medium">{formatCurrency(payslip?.baseSalary || 0)}</span>
          </div>
          <div className="flex justify-between p-3 border rounded-lg">
            <span className="text-sm">Overtime (15 hours)</span>
            <span className="font-medium text-green-600">+{formatCurrency(payslip?.overtime || 0)}</span>
          </div>
          <div className="flex justify-between p-3 border rounded-lg">
            <span className="text-sm">Performance Bonus</span>
            <span className="font-medium text-green-600">+{formatCurrency(payslip?.bonus || 0)}</span>
          </div>
          {customEarnings.map((charge) => (
            <div key={charge.id} className="flex items-center justify-between p-3 border rounded-lg border-dashed border-green-300 bg-green-50/50 dark:bg-green-900/10">
              <span className="text-sm">{charge.name}</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-green-600">+{formatCurrency(charge.amount)}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeCustomCharge(charge.id)}>
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium">Deductions</h4>
        <div className="space-y-2">
          <div className="flex justify-between p-3 border rounded-lg">
            <span className="text-sm">Pension (8%)</span>
            <span className="font-medium text-red-600">-{formatCurrency((payslip?.deductions || 0) * 0.6)}</span>
          </div>
          <div className="flex justify-between p-3 border rounded-lg">
            <span className="text-sm">Health Insurance</span>
            <span className="font-medium text-red-600">-{formatCurrency((payslip?.deductions || 0) * 0.4)}</span>
          </div>
          <div className="flex justify-between p-3 border rounded-lg">
            <span className="text-sm">Income Tax (PAYE)</span>
            <span className="font-medium text-red-600">-{formatCurrency(payslip?.tax || 0)}</span>
          </div>
          {customDeductions.map((charge) => (
            <div key={charge.id} className="flex items-center justify-between p-3 border rounded-lg border-dashed border-red-300 bg-red-50/50 dark:bg-red-900/10">
              <span className="text-sm">{charge.name}</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-red-600">-{formatCurrency(charge.amount)}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeCustomCharge(charge.id)}>
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Custom Charge */}
      <div className="space-y-3 pt-3 border-t">
        <h4 className="text-sm font-medium">Add Custom Charge</h4>
        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Charge name"
              value={newChargeName}
              onChange={(e) => setNewChargeName(e.target.value)}
              className="h-9"
            />
            <Input
              type="number"
              placeholder="Amount"
              value={newChargeAmount}
              onChange={(e) => setNewChargeAmount(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={newChargeType} onValueChange={(v: "earning" | "deduction") => setNewChargeType(v)}>
              <SelectTrigger className="flex-1 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="earning">Earning (+)</SelectItem>
                <SelectItem value="deduction">Deduction (-)</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" className="h-9" onClick={addCustomCharge} disabled={!newChargeName || !newChargeAmount}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface Payslip {
  id: string;
  staff: string;
  email: string;
  role: string;
  period: string;
  baseSalary: number;
  overtime: number;
  bonus: number;
  deductions: number;
  tax: number;
  netPay: number;
  status: "Paid" | "Pending" | "Processing";
  paidDate?: string;
  bankAccount?: string;
}

const payslips: Payslip[] = [
  { id: "PS-001", staff: "John Doe", email: "john@store.com", role: "Manager", period: "Jan 2026", baseSalary: 300000, overtime: 25000, bonus: 10000, deductions: 15000, tax: 45000, netPay: 275000, status: "Paid", paidDate: "2026-01-25", bankAccount: "****1234" },
  { id: "PS-002", staff: "Sarah Smith", email: "sarah@store.com", role: "Cashier", period: "Jan 2026", baseSalary: 250000, overtime: 10000, bonus: 0, deductions: 12500, tax: 35000, netPay: 212500, status: "Pending", bankAccount: "****5678" },
  { id: "PS-003", staff: "Mike Johnson", email: "mike@store.com", role: "Chef", period: "Jan 2026", baseSalary: 280000, overtime: 0, bonus: 5000, deductions: 14000, tax: 40000, netPay: 231000, status: "Processing", bankAccount: "****9012" },
  { id: "PS-004", staff: "Lisa Brown", email: "lisa@store.com", role: "Server", period: "Jan 2026", baseSalary: 220000, overtime: 18000, bonus: 8000, deductions: 11000, tax: 32000, netPay: 203000, status: "Paid", paidDate: "2026-01-25", bankAccount: "****3456" },
  { id: "PS-005", staff: "David Wilson", email: "david@store.com", role: "Manager", period: "Jan 2026", baseSalary: 350000, overtime: 30000, bonus: 15000, deductions: 19000, tax: 55000, netPay: 321000, status: "Paid", paidDate: "2026-01-25", bankAccount: "****7890" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Paid": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "Pending": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "Processing": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    default: return "";
  }
};

const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;

export default function PayslipsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [periodFilter, setPeriodFilter] = useState("jan2026");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
  const [isGenerateSheetOpen, setIsGenerateSheetOpen] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);

  const stats = [
    { label: "Total Payroll", value: "₦4.5M", icon: DollarSign, description: "This month" },
    { label: "Staff Paid", value: "18/24", icon: Users, description: "75% complete" },
    { label: "Pending", value: "6", icon: Clock, description: "Awaiting approval" },
    { label: "Period", value: "Jan 2026", icon: Calendar, description: "Current cycle" },
  ];

  const handleViewPayslip = (payslip: Payslip) => {
    setSelectedPayslip(payslip);
    setIsViewSheetOpen(true);
  };

  const filteredPayslips = payslips.filter(p => {
    const matchesSearch = p.staff.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
          <Button size="sm" className="flex-1 sm:flex-none" onClick={() => setIsGenerateSheetOpen(true)}>
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
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-full sm:w-32 h-9 bg-muted/50 border-0">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jan2026">Jan 2026</SelectItem>
                <SelectItem value="dec2025">Dec 2025</SelectItem>
                <SelectItem value="nov2025">Nov 2025</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                {filteredPayslips.map((slip) => (
                  <div 
                    key={slip.id} 
                    className="p-4 space-y-3 cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewPayslip(slip)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-9 w-9 shrink-0">
                          <AvatarFallback className="bg-muted text-xs">
                            {slip.staff.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{slip.staff}</p>
                          <p className="text-xs text-muted-foreground truncate">{slip.role}</p>
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
                        <p className="font-medium">{formatCurrency(slip.baseSalary)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Extras</p>
                        <p className="font-medium text-green-600">+{formatCurrency(slip.overtime + slip.bonus)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Deductions</p>
                        <p className="font-medium text-red-600">-{formatCurrency(slip.deductions + slip.tax)}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-xs text-muted-foreground">{slip.period}</span>
                      <span className="font-semibold">{formatCurrency(slip.netPay)}</span>
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
                    {filteredPayslips.map((slip) => (
                      <tr 
                        key={slip.id} 
                        className="border-b border-border last:border-0 group cursor-pointer hover:bg-muted/50"
                        onClick={() => handleViewPayslip(slip)}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-muted text-xs">
                                {slip.staff.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{slip.staff}</p>
                              <p className="text-xs text-muted-foreground">{slip.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm">{formatCurrency(slip.baseSalary)}</td>
                        <td className="p-4 text-sm text-green-600">+{formatCurrency(slip.overtime)}</td>
                        <td className="p-4 text-sm text-red-600">-{formatCurrency(slip.deductions + slip.tax)}</td>
                        <td className="p-4 font-semibold text-sm">{formatCurrency(slip.netPay)}</td>
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
                            <Eye className="h-4 w-4" />
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
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => setIsGenerateSheetOpen(true)}>
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

      {/* View Payslip Sheet */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {selectedPayslip?.staff.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle>{selectedPayslip?.staff}</SheetTitle>
                <SheetDescription>{selectedPayslip?.role} • {selectedPayslip?.period}</SheetDescription>
              </div>
            </div>
          </SheetHeader>
          
          <Tabs defaultValue="summary" className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge className={cn("text-xs", getStatusColor(selectedPayslip?.status || ""))}>
                  {selectedPayslip?.status}
                </Badge>
              </div>
              
              <Card className="border-border/50">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Salary</span>
                    <span className="font-medium">{formatCurrency(selectedPayslip?.baseSalary || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Overtime</span>
                    <span className="font-medium text-green-600">+{formatCurrency(selectedPayslip?.overtime || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Bonus</span>
                    <span className="font-medium text-green-600">+{formatCurrency(selectedPayslip?.bonus || 0)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Gross Pay</span>
                    <span className="font-medium">{formatCurrency((selectedPayslip?.baseSalary || 0) + (selectedPayslip?.overtime || 0) + (selectedPayslip?.bonus || 0))}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Deductions</span>
                    <span className="font-medium text-red-600">-{formatCurrency(selectedPayslip?.deductions || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium text-red-600">-{formatCurrency(selectedPayslip?.tax || 0)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-medium">Net Pay</span>
                    <span className="text-lg font-semibold text-primary">{formatCurrency(selectedPayslip?.netPay || 0)}</span>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 border rounded-lg">
                  <p className="text-muted-foreground text-xs">Bank Account</p>
                  <p className="font-medium">{selectedPayslip?.bankAccount}</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="text-muted-foreground text-xs">Paid On</p>
                  <p className="font-medium">{selectedPayslip?.paidDate || "Pending"}</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="breakdown" className="space-y-4 mt-4">
              <BreakdownTab payslip={selectedPayslip} formatCurrency={formatCurrency} />
            </TabsContent>
            
            <TabsContent value="history" className="space-y-3 mt-4">
              {["Jan 2026", "Dec 2025", "Nov 2025", "Oct 2025"].map((period, i) => (
                <div key={period} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{period}</p>
                    <p className="text-xs text-muted-foreground">Paid on {25 - i}/01/2026</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency((selectedPayslip?.netPay || 0) - (i * 5000))}</p>
                    <Badge variant="outline" className="text-xs">Paid</Badge>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
          
          <SheetFooter className="flex-col sm:flex-row gap-2 mt-6">
            <Button variant="outline" className="w-full sm:w-auto">
              <Mail className="h-4 w-4 mr-2" />Email
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              <Printer className="h-4 w-4 mr-2" />Print
            </Button>
            <Button className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />Download PDF
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Generate Payslips Sheet */}
      <Sheet open={isGenerateSheetOpen} onOpenChange={setIsGenerateSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Generate Payslips</SheetTitle>
            <SheetDescription>Create payslips for the selected period</SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6">
            <div className="space-y-2">
              <Label>Pay Period</Label>
              <Select defaultValue="jan2026">
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jan2026">January 2026</SelectItem>
                  <SelectItem value="feb2026">February 2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Staff Selection</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Select staff" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Staff (24)</SelectItem>
                  <SelectItem value="managers">Managers Only (4)</SelectItem>
                  <SelectItem value="kitchen">Kitchen Staff (8)</SelectItem>
                  <SelectItem value="servers">Servers (12)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Card className="border-border/50">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Staff Selected</span>
                  <span className="font-medium">24</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estimated Total</span>
                  <span className="font-medium">₦6.07M</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pay Date</span>
                  <span className="font-medium">25th Jan 2026</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <SheetFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsGenerateSheetOpen(false)} className="w-full sm:w-auto">Cancel</Button>
            <Button className="w-full sm:w-auto">Generate Payslips</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
