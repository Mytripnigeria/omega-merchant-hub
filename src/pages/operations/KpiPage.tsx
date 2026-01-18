import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoading } from "@/hooks/use-loading";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Target, BarChart3, Users, DollarSign, Clock, Star, Plus, Edit, Trash2, Eye, MoreHorizontal, Settings } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface KPI {
  id: string;
  name: string;
  current: number;
  target: number;
  trend: "up" | "down";
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  format: "currency" | "rating" | "percentage" | "number";
  category: "financial" | "customer" | "operations" | "staff";
  description?: string;
  period: string;
}

const kpis: KPI[] = [
  { id: "1", name: "Revenue Target", current: 85000, target: 100000, trend: "up", change: "+12%", icon: DollarSign, format: "currency", category: "financial", description: "Monthly revenue goal", period: "monthly" },
  { id: "2", name: "Customer Satisfaction", current: 4.5, target: 5, trend: "up", change: "+0.3", icon: Star, format: "rating", category: "customer", description: "Average customer rating", period: "monthly" },
  { id: "3", name: "Average Order Value", current: 28.50, target: 35, trend: "down", change: "-2%", icon: BarChart3, format: "currency", category: "financial", description: "Average value per order", period: "weekly" },
  { id: "4", name: "Table Turnover Rate", current: 3.2, target: 4, trend: "up", change: "+0.5", icon: Clock, format: "number", category: "operations", description: "Tables served per hour", period: "daily" },
  { id: "5", name: "Customer Retention", current: 78, target: 85, trend: "up", change: "+5%", icon: Users, format: "percentage", category: "customer", description: "Returning customer rate", period: "monthly" },
  { id: "6", name: "Staff Efficiency", current: 92, target: 95, trend: "up", change: "+3%", icon: TrendingUp, format: "percentage", category: "staff", description: "Task completion rate", period: "weekly" },
];

const formatValue = (value: number, format: string) => {
  switch (format) {
    case "currency":
      return value >= 1000 ? `₦${(value / 1000).toFixed(0)}K` : `₦${value.toFixed(2)}`;
    case "rating":
      return value.toFixed(1);
    case "percentage":
      return `${value}%`;
    default:
      return value.toString();
  }
};

function StatsSkeleton() {
  return (
    <div className="grid gap-3 grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="border-border/50">
          <CardContent className="p-3 sm:p-4">
            <Skeleton className="h-8 w-8 rounded-lg mb-2" />
            <Skeleton className="h-7 w-16 mb-1" />
            <Skeleton className="h-3 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function KpisSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="mb-3">
              <Skeleton className="h-8 w-20" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-1.5 w-full rounded-full" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function KpiPage() {
  const isLoading = useLoading(1000);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("this-month");

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedKpi, setSelectedKpi] = useState<KPI | null>(null);
  const [sheetMode, setSheetMode] = useState<"add" | "edit" | "view">("add");

  const filteredKpis = kpis.filter((kpi) => {
    return categoryFilter === "all" || kpi.category === categoryFilter;
  });

  const onTrack = filteredKpis.filter((kpi) => (kpi.current / kpi.target) * 100 >= 80).length;
  const needsAttention = filteredKpis.filter((kpi) => {
    const progress = (kpi.current / kpi.target) * 100;
    return progress >= 50 && progress < 80;
  }).length;
  const belowTarget = filteredKpis.filter((kpi) => (kpi.current / kpi.target) * 100 < 50).length;

  const stats = [
    { label: "On Track", value: onTrack, color: "text-green-600" },
    { label: "Needs Attention", value: needsAttention, color: "text-yellow-600" },
    { label: "Below Target", value: belowTarget, color: "text-red-500" },
  ];

  const handleAddNew = () => {
    setSelectedKpi(null);
    setSheetMode("add");
    setIsSheetOpen(true);
  };

  const handleView = (kpi: KPI) => {
    setSelectedKpi(kpi);
    setSheetMode("view");
    setIsSheetOpen(true);
  };

  const handleEdit = (kpi: KPI) => {
    setSelectedKpi(kpi);
    setSheetMode("edit");
    setIsSheetOpen(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">KPI Targets</h1>
          <p className="text-sm text-muted-foreground">Track and manage your business performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add KPI
          </Button>
        </div>
      </div>

      {/* Stats */}
      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid gap-3 grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-3 sm:p-4 text-center">
                <p className={`text-xl sm:text-2xl font-semibold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[160px] h-9 bg-muted/50 border-0">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="financial">Financial</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="operations">Operations</SelectItem>
            <SelectItem value="staff">Staff</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPIs Grid */}
      {isLoading ? (
        <KpisSkeleton />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredKpis.map((kpi) => {
            const progress = Math.min((kpi.current / kpi.target) * 100, 100);
            const Icon = kpi.icon;
            const progressColor = progress >= 80 ? "bg-green-500" : progress >= 50 ? "bg-yellow-500" : "bg-red-500";

            return (
              <Card key={kpi.id} className="border-border/50 group">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium">{kpi.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`flex items-center text-xs ${kpi.trend === "up" ? "text-green-600" : "text-red-500"}`}>
                        {kpi.trend === "up" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        {kpi.change}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(kpi)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(kpi)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Target
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="mb-3 cursor-pointer" onClick={() => handleView(kpi)}>
                    <span className="text-xl sm:text-2xl font-semibold">{formatValue(kpi.current, kpi.format)}</span>
                    <span className="text-xs text-muted-foreground ml-2">/ {formatValue(kpi.target, kpi.format)}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${progressColor}`} style={{ width: `${progress}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{progress.toFixed(0)}% of target</span>
                      <Badge variant="secondary" className="text-[10px] px-1.5">{kpi.category}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Performance Summary */}
      {!isLoading && (
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium text-sm sm:text-base">Performance Summary</h3>
            </div>
            <div className="grid gap-3 sm:gap-4 grid-cols-3">
              <div className="text-center p-3 sm:p-4 bg-muted/50 rounded-lg">
                <p className="text-xl sm:text-2xl font-semibold text-green-600">{onTrack}</p>
                <p className="text-xs text-muted-foreground">KPIs On Track</p>
              </div>
              <div className="text-center p-3 sm:p-4 bg-muted/50 rounded-lg">
                <p className="text-xl sm:text-2xl font-semibold text-yellow-600">{needsAttention}</p>
                <p className="text-xs text-muted-foreground">Needs Attention</p>
              </div>
              <div className="text-center p-3 sm:p-4 bg-muted/50 rounded-lg">
                <p className="text-xl sm:text-2xl font-semibold text-red-500">{belowTarget}</p>
                <p className="text-xs text-muted-foreground">Below Target</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {sheetMode === "add" ? "Add New KPI" : sheetMode === "edit" ? "Edit KPI Target" : "KPI Details"}
            </SheetTitle>
            <SheetDescription>
              {sheetMode === "add" ? "Create a new performance metric" : sheetMode === "edit" ? "Update target values" : "View KPI details and history"}
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-6 py-6">
            {sheetMode === "view" && selectedKpi && (
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center">
                    <selectedKpi.icon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{selectedKpi.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedKpi.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-background rounded-lg">
                    <p className="text-2xl font-bold">{formatValue(selectedKpi.current, selectedKpi.format)}</p>
                    <p className="text-xs text-muted-foreground">Current</p>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg">
                    <p className="text-2xl font-bold">{formatValue(selectedKpi.target, selectedKpi.format)}</p>
                    <p className="text-xs text-muted-foreground">Target</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">KPI Details</h3>

              <div className="space-y-2">
                <Label>KPI Name</Label>
                <Input placeholder="e.g., Monthly Revenue" defaultValue={selectedKpi?.name} disabled={sheetMode === "view"} />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input placeholder="Brief description" defaultValue={selectedKpi?.description} disabled={sheetMode === "view"} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Current Value</Label>
                  <Input type="number" step="0.01" defaultValue={selectedKpi?.current} disabled={sheetMode === "view"} />
                </div>
                <div className="space-y-2">
                  <Label>Target Value</Label>
                  <Input type="number" step="0.01" defaultValue={selectedKpi?.target} disabled={sheetMode === "view"} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select defaultValue={selectedKpi?.category} disabled={sheetMode === "view"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Format</Label>
                  <Select defaultValue={selectedKpi?.format} disabled={sheetMode === "view"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="currency">Currency (₦)</SelectItem>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tracking Period</Label>
                <Select defaultValue={selectedKpi?.period || "monthly"} disabled={sheetMode === "view"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {sheetMode === "view" && selectedKpi && (
              <Tabs defaultValue="history" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
                  <TabsTrigger value="insights" className="flex-1">Insights</TabsTrigger>
                </TabsList>
                <TabsContent value="history" className="mt-4 space-y-3">
                  <div className="p-3 border rounded-lg flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Target Updated</p>
                      <p className="text-xs text-muted-foreground">Jan 15, 2026</p>
                    </div>
                    <Badge variant="secondary">₦80K → ₦100K</Badge>
                  </div>
                  <div className="p-3 border rounded-lg flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">KPI Created</p>
                      <p className="text-xs text-muted-foreground">Jan 1, 2026</p>
                    </div>
                    <Badge variant="outline">Initial</Badge>
                  </div>
                </TabsContent>
                <TabsContent value="insights" className="mt-4">
                  <Card className="border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Trending Up</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        This KPI has improved by {selectedKpi.change} compared to the previous period. Keep up the good work!
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>

          {sheetMode !== "view" && (
            <SheetFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsSheetOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsSheetOpen(false)}>
                {sheetMode === "add" ? "Create KPI" : "Save Changes"}
              </Button>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
