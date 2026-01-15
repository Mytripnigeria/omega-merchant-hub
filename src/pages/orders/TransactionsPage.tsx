import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Transactions</h1>
          <p className="text-sm text-muted-foreground">View all financial transactions</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Export</span>
        </Button>
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
                <stat.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.color}`} />
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
              <Input placeholder="Search transactions..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
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
        <CardContent className="p-0 sm:px-6 sm:pb-6">
          {/* Mobile Card View */}
          <div className="block sm:hidden divide-y divide-border">
            {transactions.map((txn) => (
              <div key={txn.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-medium">{txn.id}</span>
                  <Badge variant={txn.type === "sale" ? "default" : txn.type === "refund" ? "destructive" : "secondary"}>
                    {txn.type}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{txn.date}</span>
                  <span className={`text-lg font-bold ${txn.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {txn.amount >= 0 ? "+" : ""}{txn.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span>{txn.method}</span>
                    <span>•</span>
                    <span>{txn.reference}</span>
                  </div>
                  <Badge variant={txn.status === "completed" ? "outline" : "secondary"} className="text-xs">
                    {txn.status}
                  </Badge>
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
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Type</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Amount</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Method</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Reference</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="p-4 font-medium">{txn.id}</td>
                    <td className="p-4 text-muted-foreground">{txn.date}</td>
                    <td className="p-4">
                      <Badge variant={txn.type === "sale" ? "default" : txn.type === "refund" ? "destructive" : "secondary"}>
                        {txn.type}
                      </Badge>
                    </td>
                    <td className={`p-4 font-medium ${txn.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {txn.amount >= 0 ? "+" : ""}{txn.amount.toFixed(2)}
                    </td>
                    <td className="p-4 text-muted-foreground">{txn.method}</td>
                    <td className="p-4 text-muted-foreground">{txn.reference}</td>
                    <td className="p-4">
                      <Badge variant={txn.status === "completed" ? "outline" : "secondary"}>{txn.status}</Badge>
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
