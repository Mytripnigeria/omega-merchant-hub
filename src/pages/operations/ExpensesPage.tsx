import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, DollarSign, TrendingUp, Receipt, MoreHorizontal, Calendar } from "lucide-react";

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
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Expenses</h1>
          <p className="text-sm text-muted-foreground">Track and manage business expenses</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Add Expense</span>
        </Button>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className={`text-xl sm:text-2xl font-semibold ${stat.trend === "down" ? "text-green-600" : ""}`}>
                    {stat.value}
                  </p>
                </div>
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-muted flex items-center justify-center">
                  <stat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50">
        <CardContent className="p-3 sm:p-4">
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
              <SelectTrigger className="w-full sm:w-[140px] h-9 bg-muted/50 border-0">
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
              <SelectTrigger className="w-full sm:w-[120px] h-9 bg-muted/50 border-0">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mobile Card View */}
          <div className="block sm:hidden divide-y divide-border -mx-3">
            {expenses.map((expense) => (
              <div key={expense.id} className="px-3 py-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{expense.description}</p>
                    <p className="text-xs text-muted-foreground">{expense.vendor}</p>
                  </div>
                  <Badge 
                    variant={expense.status === "approved" ? "default" : "secondary"}
                    className="text-xs font-normal shrink-0"
                  >
                    {expense.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <Badge variant="outline" className="text-xs font-normal">
                    {expense.category}
                  </Badge>
                  <span className="font-semibold">${expense.amount.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{expense.date}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto -mx-4">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Description</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Category</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Vendor</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Date</th>
                  <th className="text-right text-xs font-medium text-muted-foreground p-4">Amount</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="p-4 font-medium text-sm">{expense.description}</td>
                    <td className="p-4">
                      <Badge variant="outline" className="text-xs font-normal">
                        {expense.category}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{expense.vendor}</td>
                    <td className="p-4 text-sm text-muted-foreground">{expense.date}</td>
                    <td className="p-4 text-sm font-medium text-right">${expense.amount.toLocaleString()}</td>
                    <td className="p-4">
                      <Badge 
                        variant={expense.status === "approved" ? "default" : "secondary"}
                        className="text-xs font-normal"
                      >
                        {expense.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
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
};

export default ExpensesPage;
