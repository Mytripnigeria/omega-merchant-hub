import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payouts</h1>
          <p className="text-muted-foreground">Track your earnings and settlements</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <DollarSign className="h-4 w-4 mr-2" />
            Request Payout
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
              <Input placeholder="Search payouts..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
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
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell className="font-medium">{payout.id}</TableCell>
                  <TableCell>{payout.date}</TableCell>
                  <TableCell className="font-bold">${payout.amount.toLocaleString()}</TableCell>
                  <TableCell>{payout.method}</TableCell>
                  <TableCell>{payout.account}</TableCell>
                  <TableCell>
                    <Badge variant={payout.status === "completed" ? "default" : "secondary"}>{payout.status}</Badge>
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
