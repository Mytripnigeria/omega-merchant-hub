import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, DollarSign, Users, Calendar, Download, FileText } from "lucide-react";

export default function PayslipsPage() {
  const [search, setSearch] = useState("");
  const [periodFilter, setPeriodFilter] = useState("current");

  const payslips = [
    { id: 1, staff: "John Doe", period: "Jan 2026", baseSalary: 3000, overtime: 250, deductions: 150, netPay: 3100, status: "paid" },
    { id: 2, staff: "Sarah Smith", period: "Jan 2026", baseSalary: 2500, overtime: 100, deductions: 125, netPay: 2475, status: "pending" },
    { id: 3, staff: "Mike Johnson", period: "Jan 2026", baseSalary: 2800, overtime: 0, deductions: 140, netPay: 2660, status: "pending" },
    { id: 4, staff: "Lisa Brown", period: "Dec 2025", baseSalary: 2200, overtime: 180, deductions: 110, netPay: 2270, status: "paid" },
  ];

  const stats = [
    { label: "Total Payroll", value: "$24,500", icon: DollarSign },
    { label: "Staff Paid", value: "18/24", icon: Users },
    { label: "Current Period", value: "Jan 2026", icon: Calendar },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payslips</h1>
          <p className="text-muted-foreground">Manage staff salaries and payments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Generate Payslips
          </Button>
        </div>
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
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current Period</SelectItem>
                <SelectItem value="dec2025">Dec 2025</SelectItem>
                <SelectItem value="nov2025">Nov 2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Base</TableHead>
                <TableHead>Overtime</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead>Net Pay</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payslips.map((slip) => (
                <TableRow key={slip.id}>
                  <TableCell className="font-medium">{slip.staff}</TableCell>
                  <TableCell>{slip.period}</TableCell>
                  <TableCell>${slip.baseSalary.toLocaleString()}</TableCell>
                  <TableCell className="text-green-600">+${slip.overtime}</TableCell>
                  <TableCell className="text-red-600">-${slip.deductions}</TableCell>
                  <TableCell className="font-bold">${slip.netPay.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={slip.status === "paid" ? "default" : "secondary"}>{slip.status}</Badge>
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
