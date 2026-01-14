import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, ArrowUpRight, ArrowDownRight, Filter, Calendar } from "lucide-react";

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const transactions = [
    { id: "TXN-001", date: "2026-01-14 14:30", type: "sale", amount: 45.50, method: "Card", reference: "ORD-1234", status: "completed" },
    { id: "TXN-002", date: "2026-01-14 14:15", type: "refund", amount: -12.00, method: "Card", reference: "ORD-1230", status: "completed" },
    { id: "TXN-003", date: "2026-01-14 13:45", type: "sale", amount: 89.00, method: "Cash", reference: "ORD-1233", status: "completed" },
    { id: "TXN-004", date: "2026-01-14 12:30", type: "sale", amount: 23.50, method: "Mobile", reference: "ORD-1232", status: "pending" },
    { id: "TXN-005", date: "2026-01-14 11:00", type: "payout", amount: -500.00, method: "Bank", reference: "PAY-001", status: "completed" },
  ];

  const stats = [
    { label: "Total In", value: "$1,234.50", icon: ArrowUpRight, color: "text-green-600" },
    { label: "Total Out", value: "$512.00", icon: ArrowDownRight, color: "text-red-600" },
    { label: "Pending", value: "$23.50", icon: Calendar, color: "text-yellow-600" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
          <p className="text-muted-foreground">View all financial transactions</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
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
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
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
              <Input placeholder="Search transactions..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sale">Sales</SelectItem>
                <SelectItem value="refund">Refunds</SelectItem>
                <SelectItem value="payout">Payouts</SelectItem>
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
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell className="font-medium">{txn.id}</TableCell>
                  <TableCell>{txn.date}</TableCell>
                  <TableCell>
                    <Badge variant={txn.type === "sale" ? "default" : txn.type === "refund" ? "destructive" : "secondary"}>
                      {txn.type}
                    </Badge>
                  </TableCell>
                  <TableCell className={txn.amount >= 0 ? "text-green-600" : "text-red-600"}>
                    {txn.amount >= 0 ? "+" : ""}{txn.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>{txn.method}</TableCell>
                  <TableCell>{txn.reference}</TableCell>
                  <TableCell>
                    <Badge variant={txn.status === "completed" ? "outline" : "secondary"}>{txn.status}</Badge>
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
