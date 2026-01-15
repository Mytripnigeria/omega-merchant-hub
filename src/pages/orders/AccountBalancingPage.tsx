import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, DollarSign, CheckCircle2, AlertCircle, User, Clock } from "lucide-react";

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
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Account Balancing</h1>
          <p className="text-sm text-muted-foreground">Reconcile staff cash and sales</p>
        </div>
        <Select value={shiftFilter} onValueChange={setShiftFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
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

      <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-3 sm:pt-6 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-lg sm:text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">Staff Balances</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:px-6 sm:pb-6">
          {/* Mobile Card View */}
          <div className="block sm:hidden divide-y divide-border">
            {staffBalances.map((balance) => (
              <div key={`${balance.staff}-${balance.shift}`} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <User className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium truncate">{balance.staff}</span>
                  </div>
                  <Badge variant={balance.status === "balanced" ? "default" : balance.status === "over" ? "secondary" : "destructive"}>
                    {balance.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{balance.shift} Shift</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Expected</p>
                    <p className="font-medium">${balance.expected.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Actual</p>
                    <p className="font-medium">${balance.actual.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Difference</p>
                    <p className={`font-medium ${balance.difference === 0 ? "" : balance.difference > 0 ? "text-green-600" : "text-red-600"}`}>
                      {balance.difference >= 0 ? "+" : ""}{balance.difference.toFixed(2)}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">Review</Button>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Staff</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Shift</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Expected</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Actual</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Difference</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffBalances.map((balance) => (
                  <tr key={`${balance.staff}-${balance.shift}`} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="p-4 font-medium">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {balance.staff}
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{balance.shift}</td>
                    <td className="p-4">${balance.expected.toFixed(2)}</td>
                    <td className="p-4">${balance.actual.toFixed(2)}</td>
                    <td className={`p-4 ${balance.difference === 0 ? "" : balance.difference > 0 ? "text-green-600" : "text-red-600"}`}>
                      {balance.difference >= 0 ? "+" : ""}{balance.difference.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <Badge variant={balance.status === "balanced" ? "default" : balance.status === "over" ? "secondary" : "destructive"}>
                        {balance.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm">Review</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
