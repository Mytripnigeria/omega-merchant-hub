import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, DollarSign, CheckCircle2, AlertCircle, User } from "lucide-react";

export default function AccountBalancingPage() {
  const [shiftFilter, setShiftFilter] = useState("today");

  const staffBalances = [
    { staff: "John Doe", shift: "Morning", expected: 450.00, actual: 450.00, difference: 0, status: "balanced" },
    { staff: "Jane Smith", shift: "Morning", expected: 380.00, actual: 375.50, difference: -4.50, status: "short" },
    { staff: "Mike Johnson", shift: "Afternoon", expected: 520.00, actual: 525.00, difference: 5.00, status: "over" },
    { staff: "Sarah Williams", shift: "Evening", expected: 610.00, actual: 610.00, difference: 0, status: "balanced" },
  ];

  const stats = [
    { label: "Total Expected", value: "$1,960.00", icon: DollarSign },
    { label: "Total Actual", value: "$1,960.50", icon: DollarSign },
    { label: "Balanced", value: "2 staff", icon: CheckCircle2 },
    { label: "Discrepancies", value: "2 staff", icon: AlertCircle },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Account Balancing</h1>
          <p className="text-muted-foreground">Reconcile staff cash and sales</p>
        </div>
        <Select value={shiftFilter} onValueChange={setShiftFilter}>
          <SelectTrigger className="w-[150px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
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
          <CardTitle>Staff Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Expected</TableHead>
                <TableHead>Actual</TableHead>
                <TableHead>Difference</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffBalances.map((balance) => (
                <TableRow key={`${balance.staff}-${balance.shift}`}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {balance.staff}
                    </div>
                  </TableCell>
                  <TableCell>{balance.shift}</TableCell>
                  <TableCell>${balance.expected.toFixed(2)}</TableCell>
                  <TableCell>${balance.actual.toFixed(2)}</TableCell>
                  <TableCell className={balance.difference === 0 ? "" : balance.difference > 0 ? "text-green-600" : "text-red-600"}>
                    {balance.difference >= 0 ? "+" : ""}{balance.difference.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={balance.status === "balanced" ? "default" : balance.status === "over" ? "secondary" : "destructive"}>
                      {balance.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Review</Button>
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
