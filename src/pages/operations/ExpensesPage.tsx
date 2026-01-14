import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, DollarSign, TrendingUp, Receipt, MoreHorizontal } from "lucide-react";

const ExpensesPage = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const expenses = [
    { id: 1, description: "Monthly Supplies Order", category: "Supplies", amount: 2500, date: "2026-01-15", vendor: "FoodCo", status: "approved" },
    { id: 2, description: "Utility Bill - Electric", category: "Utilities", amount: 1200, date: "2026-01-14", vendor: "PowerGrid", status: "pending" },
    { id: 3, description: "New Mixer Purchase", category: "Equipment", amount: 5000, date: "2026-01-12", vendor: "KitchenPro", status: "approved" },
    { id: 4, description: "Staff Training", category: "Training", amount: 800, date: "2026-01-10", vendor: "TrainCorp", status: "approved" },
  ];

  const stats = [
    { label: "Total This Month", value: "$24,500", icon: DollarSign },
    { label: "Pending Approval", value: "$3,200", icon: Receipt },
    { label: "vs Last Month", value: "-8%", icon: TrendingUp, trend: "down" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Expenses</h1>
          <p className="text-sm text-muted-foreground">Track and manage business expenses</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className={`text-2xl font-semibold ${stat.trend === "down" ? "text-green-600" : ""}`}>
                    {stat.value}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search expenses..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="pl-9 h-9 bg-muted/50 border-0" 
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px] h-9 bg-muted/50 border-0">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="supplies">Supplies</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px] h-9 bg-muted/50 border-0">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-xs font-medium text-muted-foreground">Description</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Category</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Vendor</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Date</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground text-right">Amount</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id} className="border-border/50">
                  <TableCell className="font-medium text-sm">{expense.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs font-normal">
                      {expense.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{expense.vendor}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{expense.date}</TableCell>
                  <TableCell className="text-sm font-medium text-right">${expense.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={expense.status === "approved" ? "default" : "secondary"}
                      className="text-xs font-normal"
                    >
                      {expense.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpensesPage;
