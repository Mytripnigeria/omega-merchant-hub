import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, DollarSign, Clock, CheckCircle2, Download, Filter, Wallet } from "lucide-react";

export default function PayoutsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const payouts = [
    { id: "PAY-001", date: "2026-01-10", amount: 2500.00, method: "Bank Transfer", account: "****4521", status: "completed" },
    { id: "PAY-002", date: "2026-01-05", amount: 1850.00, method: "Bank Transfer", account: "****4521", status: "completed" },
    { id: "PAY-003", date: "2026-01-14", amount: 3200.00, method: "Bank Transfer", account: "****4521", status: "pending" },
    { id: "PAY-004", date: "2025-12-28", amount: 2100.00, method: "Bank Transfer", account: "****4521", status: "completed" },
  ];

  const stats = [
    { label: "Available Balance", value: "$4,250.00", icon: Wallet },
    { label: "Pending Payout", value: "$3,200.00", icon: Clock },
    { label: "Total Paid Out", value: "$45,600.00", icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Payouts</h1>
          <p className="text-sm text-muted-foreground">Track your earnings and settlements</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Download className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button size="sm" className="flex-1 sm:flex-none">
            <DollarSign className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Request Payout</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 sm:pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search payouts..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:px-6 sm:pb-6">
          {/* Mobile Card View */}
          <div className="block sm:hidden divide-y divide-border">
            {payouts.map((payout) => (
              <div key={payout.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-medium">{payout.id}</span>
                  <Badge variant={payout.status === "completed" ? "default" : "secondary"}>
                    {payout.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{payout.date}</span>
                  <span className="text-lg font-bold">${payout.amount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{payout.method}</span>
                  <span>{payout.account}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">ID</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Date</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Amount</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Method</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Account</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((payout) => (
                  <tr key={payout.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="p-4 font-medium">{payout.id}</td>
                    <td className="p-4 text-muted-foreground">{payout.date}</td>
                    <td className="p-4 font-bold">${payout.amount.toLocaleString()}</td>
                    <td className="p-4 text-muted-foreground">{payout.method}</td>
                    <td className="p-4 text-muted-foreground">{payout.account}</td>
                    <td className="p-4">
                      <Badge variant={payout.status === "completed" ? "default" : "secondary"}>{payout.status}</Badge>
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm">View</Button>
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
