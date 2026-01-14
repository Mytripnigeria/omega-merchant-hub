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
import { Search, Download, FileText, MoreHorizontal } from "lucide-react";
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

const statusColors: Record<string, string> = {
  Paid: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
};

export default function PayslipsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Payslips</h1>
          <p className="text-sm text-muted-foreground">
            Manage staff salaries and payments
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Generate Payslips
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Payroll</p>
            <p className="text-2xl font-semibold">₦4.5M</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Staff Paid</p>
            <p className="text-2xl font-semibold">18/24</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-semibold text-yellow-600">6</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Current Period</p>
            <p className="text-2xl font-semibold">Jan 2026</p>
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
        <Select defaultValue="jan2026">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="jan2026">Jan 2026</SelectItem>
            <SelectItem value="dec2025">Dec 2025</SelectItem>
            <SelectItem value="nov2025">Nov 2025</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-32">
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

      {/* Payslips Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6 w-12">
                  <input type="checkbox" className="rounded border-border" />
                </TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Base Salary</TableHead>
                <TableHead>Overtime</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead>Net Pay</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6 w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payslips.map((slip) => (
                <TableRow key={slip.id} className="group cursor-pointer hover:bg-muted/50">
                  <TableCell className="pl-6">
                    <input type="checkbox" className="rounded border-border" />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{slip.staff}</p>
                      <p className="text-sm text-muted-foreground">{slip.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{slip.period}</TableCell>
                  <TableCell>{slip.baseSalary}</TableCell>
                  <TableCell className="text-green-600">{slip.overtime}</TableCell>
                  <TableCell className="text-red-600">{slip.deductions}</TableCell>
                  <TableCell className="font-semibold">{slip.netPay}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className={cn("font-normal", statusColors[slip.status])}
                    >
                      {slip.status}
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
          Showing 1-5 of 24 payslips
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
