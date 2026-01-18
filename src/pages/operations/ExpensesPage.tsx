import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useLoading } from "@/hooks/use-loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, DollarSign, TrendingUp, Receipt, MoreHorizontal, Calendar, Edit, Trash2, CheckCircle, XCircle, Upload } from "lucide-react";
import { DatePeriodFilter, DatePeriod, useDatePeriodFilter } from "@/components/ui/date-period-filter";
import { TablePagination } from "@/components/ui/table-pagination";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Expense {
  id: number;
  description: string;
  category: string;
  amount: number;
  date: string;
  vendor: string;
  status: "approved" | "pending" | "rejected";
  submittedBy?: string;
  approvedBy?: string;
  receipt?: string;
  notes?: string;
}

const expenses: Expense[] = [
  { id: 1, description: "Monthly Supplies Order", category: "Supplies", amount: 250000, date: "2026-01-15", vendor: "FoodCo", status: "approved", submittedBy: "John Doe", approvedBy: "Manager", notes: "Regular monthly order" },
  { id: 2, description: "Utility Bill - Electric", category: "Utilities", amount: 120000, date: "2026-01-14", vendor: "PowerGrid", status: "pending", submittedBy: "Sarah Smith" },
  { id: 3, description: "New Mixer Purchase", category: "Equipment", amount: 500000, date: "2026-01-12", vendor: "KitchenPro", status: "approved", submittedBy: "Mike Johnson", approvedBy: "Owner" },
  { id: 4, description: "Staff Training", category: "Training", amount: 80000, date: "2026-01-10", vendor: "TrainCorp", status: "approved", submittedBy: "Lisa Brown", approvedBy: "Manager" },
  { id: 5, description: "Cleaning Supplies", category: "Supplies", amount: 45000, date: "2026-01-08", vendor: "CleanMart", status: "rejected", submittedBy: "David Wilson", notes: "Wrong vendor - resubmit" },
];

const categories = ["Supplies", "Utilities", "Equipment", "Training", "Marketing", "Maintenance", "Other"];

const stats = [
  { label: "Total This Month", value: "₦2.45M", icon: DollarSign },
  { label: "Pending Approval", value: "₦320K", icon: Receipt },
  { label: "vs Last Month", value: "-8%", icon: TrendingUp, trend: "down" },
];

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className={i === 2 ? "col-span-2 sm:col-span-1" : ""}>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-7 w-20" />
              </div>
              <Skeleton className="h-7 w-7 sm:h-8 sm:w-8 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ExpensesSkeleton() {
  return (
    <>
      <div className="block sm:hidden divide-y divide-border -mx-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="px-3 py-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        ))}
      </div>
      <div className="hidden sm:block overflow-x-auto -mx-4">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              {Array.from({ length: 7 }).map((_, i) => (
                <th key={i} className="p-4"><Skeleton className="h-3 w-16" /></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="p-4"><Skeleton className="h-4 w-36" /></td>
                <td className="p-4"><Skeleton className="h-5 w-16 rounded-full" /></td>
                <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                <td className="p-4"><Skeleton className="h-5 w-16 rounded-full" /></td>
                <td className="p-4"><Skeleton className="h-8 w-8" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

const ExpensesPage = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [datePeriod, setDatePeriod] = useState<DatePeriod>("all");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const isLoading = useLoading(1000);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "pending": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "rejected": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default: return "";
    }
  };

  const dateFiltered = useDatePeriodFilter(expenses, datePeriod, customStartDate, customEndDate, "date");

  const filteredExpenses = dateFiltered.filter(e => {
    const matchesSearch = e.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || e.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesStatus = statusFilter === "all" || e.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalItems = filteredExpenses.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedExpenses = filteredExpenses.slice(startIndex, endIndex);

  const handleViewExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsViewSheetOpen(true);
  };

  const handleCustomRange = (start: string, end: string) => {
    setCustomStartDate(start);
    setCustomEndDate(end);
    setCurrentPage(1);
  };


  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Expenses</h1>
          <p className="text-sm text-muted-foreground">Track and manage business expenses</p>
        </div>
        <Button size="sm" className="w-full sm:w-auto" onClick={() => setIsAddSheetOpen(true)}>
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="sm:inline">Add Expense</span>
        </Button>
      </div>

      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <Card key={stat.label} className={`border-border/50 ${index === 2 ? "col-span-2 sm:col-span-1" : ""}`}>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                    <p className={`text-xl sm:text-2xl font-semibold ${stat.trend === "down" ? "text-green-600" : ""}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <stat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="border-border/50">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search expenses..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="pl-9" 
              />
            </div>
            <DatePeriodFilter
              value={datePeriod}
              onChange={(v) => { setDatePeriod(v); setCurrentPage(1); }}
              onCustomRange={handleCustomRange}
              customStartDate={customStartDate}
              customEndDate={customEndDate}
            />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(c => (
                  <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <ExpensesSkeleton />
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block sm:hidden divide-y divide-border -mx-3">
                {paginatedExpenses.map((expense) => (
                  <div 
                    key={expense.id} 
                    className="px-3 py-4 space-y-3 cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewExpense(expense)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{expense.description}</p>
                        <p className="text-xs text-muted-foreground">{expense.vendor}</p>
                      </div>
                      <Badge className={getStatusColor(expense.status)}>
                        {expense.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <Badge variant="outline" className="text-xs font-normal">
                        {expense.category}
                      </Badge>
                      <span className="font-semibold">₦{expense.amount.toLocaleString()}</span>
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
                    {paginatedExpenses.map((expense) => (
                      <tr 
                        key={expense.id} 
                        className="border-b border-border last:border-0 hover:bg-muted/50 group cursor-pointer"
                        onClick={() => handleViewExpense(expense)}
                      >
                        <td className="p-4 font-medium text-sm">{expense.description}</td>
                        <td className="p-4">
                          <Badge variant="outline" className="text-xs font-normal">
                            {expense.category}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{expense.vendor}</td>
                        <td className="p-4 text-sm text-muted-foreground">{expense.date}</td>
                        <td className="p-4 text-sm font-medium text-right">₦{expense.amount.toLocaleString()}</td>
                        <td className="p-4">
                          <Badge className={getStatusColor(expense.status)}>
                            {expense.status}
                          </Badge>
                        </td>
                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewExpense(expense)}>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              {expense.status === "pending" && (
                                <>
                                  <DropdownMenuItem className="text-green-600">Approve</DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">Reject</DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                startIndex={startIndex + 1}
                endIndex={endIndex}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                showPageSize
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Add Expense Sheet */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add Expense</SheetTitle>
            <SheetDescription>Record a new business expense</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label>Description</Label>
              <Input placeholder="e.g., Monthly supplies order" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => (
                      <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Amount (₦)</Label>
                <Input type="number" placeholder="0" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Vendor</Label>
              <Input placeholder="e.g., FoodCo Supplies" />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Receipt (Optional)</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG or PDF up to 5MB</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea placeholder="Additional details..." rows={2} />
            </div>
          </div>
          <SheetFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsAddSheetOpen(false)} className="w-full sm:w-auto">Cancel</Button>
            <Button className="w-full sm:w-auto">Submit for Approval</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* View Expense Sheet */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedExpense?.description}</SheetTitle>
            <SheetDescription>{selectedExpense?.vendor}</SheetDescription>
          </SheetHeader>
          
          <Tabs defaultValue="details" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="approval">Approval</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="text-lg font-semibold">₦{selectedExpense?.amount.toLocaleString()}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{selectedExpense?.category}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{selectedExpense?.date}</p>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Vendor</p>
                <p className="font-medium">{selectedExpense?.vendor}</p>
              </div>
              {selectedExpense?.notes && (
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{selectedExpense.notes}</p>
                </div>
              )}
              <div className="p-4 border rounded-lg text-center text-sm text-muted-foreground">
                <Receipt className="h-8 w-8 mx-auto mb-2 opacity-50" />
                No receipt attached
              </div>
            </TabsContent>
            
            <TabsContent value="approval" className="space-y-4 mt-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge className={getStatusColor(selectedExpense?.status || "")}>
                  {selectedExpense?.status}
                </Badge>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Submitted By</p>
                <p className="font-medium">{selectedExpense?.submittedBy}</p>
              </div>
              {selectedExpense?.approvedBy && (
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Approved By</p>
                  <p className="font-medium">{selectedExpense.approvedBy}</p>
                </div>
              )}
              {selectedExpense?.status === "pending" && (
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                    <XCircle className="h-4 w-4 mr-2" />Reject
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />Approve
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <SheetFooter className="flex-col sm:flex-row gap-2 mt-6">
            <Button variant="destructive" size="sm" className="w-full sm:w-auto">
              <Trash2 className="h-4 w-4 mr-2" />Delete
            </Button>
            <Button className="w-full sm:w-auto">
              <Edit className="h-4 w-4 mr-2" />Edit
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ExpensesPage;
