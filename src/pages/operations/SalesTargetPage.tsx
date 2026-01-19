import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoading } from "@/hooks/use-loading";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Calendar, Award, TrendingUp, Plus, DollarSign, User, BarChart3 } from "lucide-react";
import { SalesTarget as APISalesTarget } from "@/types/operations";

// UI-specific interface with computed fields for display
interface SalesTargetUI extends APISalesTarget {
  target: number; // Alias for targetAmount
  achieved: number; // Alias for currentAmount
  percentage: number; // Alias for progress
  startDate: string; // Alias for periodStart
  endDate: string; // Alias for periodEnd
}

interface Performer {
  id: string;
  name: string;
  role: string;
  sales: number;
  target: number;
  orders: number;
}

const transformSalesTarget = (target: APISalesTarget): SalesTargetUI => ({
  ...target,
  target: target.targetAmount,
  achieved: target.currentAmount,
  percentage: target.progress,
  startDate: target.periodStart,
  endDate: target.periodEnd,
});

// Mock data aligned with API types
const mockSalesTargets: APISalesTarget[] = [
  { id: "1", storeId: "store-1", name: "Daily Target", targetAmount: 500000, currentAmount: 420000, period: "day", periodStart: "2026-01-15", periodEnd: "2026-01-15", status: "active", progress: 84, createdAt: "2026-01-15", updatedAt: "2026-01-15" },
  { id: "2", storeId: "store-1", name: "Weekly Target", targetAmount: 3500000, currentAmount: 2850000, period: "week", periodStart: "2026-01-13", periodEnd: "2026-01-19", status: "active", progress: 81, createdAt: "2026-01-13", updatedAt: "2026-01-15" },
  { id: "3", storeId: "store-1", name: "Monthly Target", targetAmount: 15000000, currentAmount: 11200000, period: "month", periodStart: "2026-01-01", periodEnd: "2026-01-31", status: "active", progress: 75, createdAt: "2026-01-01", updatedAt: "2026-01-15" },
];

const targets: SalesTargetUI[] = mockSalesTargets.map(transformSalesTarget);

const topPerformers: Performer[] = [
  { id: "1", name: "Sarah Johnson", role: "Server", sales: 1250000, target: 1000000, orders: 85 },
  { id: "2", name: "Mike Chen", role: "Server", sales: 1180000, target: 1000000, orders: 78 },
  { id: "3", name: "Emma Wilson", role: "Bartender", sales: 950000, target: 800000, orders: 120 },
  { id: "4", name: "James Brown", role: "Server", sales: 890000, target: 1000000, orders: 62 },
];

function TargetsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><Skeleton className="h-4 w-4" /><Skeleton className="h-4 w-24" /></div><Skeleton className="h-5 w-12 rounded-full" /></div>
            <div className="text-center py-4"><Skeleton className="h-8 w-24 mx-auto mb-2" /><Skeleton className="h-3 w-32 mx-auto" /></div>
            <div className="space-y-2"><Skeleton className="h-2 w-full rounded-full" /><div className="flex items-center justify-between"><Skeleton className="h-3 w-24" /><Skeleton className="h-3 w-16" /></div></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PerformersSkeleton() {
  return (
    <Card className="border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4"><Skeleton className="h-4 w-4" /><Skeleton className="h-5 w-32" /></div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1"><div className="flex items-center justify-between"><div className="space-y-1"><Skeleton className="h-4 w-28" /><Skeleton className="h-3 w-16" /></div><div className="text-right space-y-1"><Skeleton className="h-4 w-20" /><Skeleton className="h-3 w-24" /></div></div></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const getProgressColor = (percentage: number) => {
  if (percentage >= 90) return "text-green-600";
  if (percentage >= 70) return "text-yellow-600";
  return "text-red-500";
};

export default function SalesTargetPage() {
  const isLoading = useLoading(1000);
  const [selectedTarget, setSelectedTarget] = useState<SalesTargetUI | null>(null);
  const [selectedPerformer, setSelectedPerformer] = useState<Performer | null>(null);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [sheetType, setSheetType] = useState<"target" | "performer">("target");

  const openTargetSheet = (target: SalesTargetUI) => { setSelectedTarget(target); setSelectedPerformer(null); setSheetType("target"); };
  const openPerformerSheet = (performer: Performer) => { setSelectedPerformer(performer); setSelectedTarget(null); setSheetType("performer"); };
  const openAddSheet = () => { setSelectedTarget(null); setSelectedPerformer(null); setIsAddSheetOpen(true); setSheetType("target"); };
  const closeSheet = () => { setSelectedTarget(null); setSelectedPerformer(null); setIsAddSheetOpen(false); };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Sales Targets</h1>
          <p className="text-sm text-muted-foreground">Set and track sales goals</p>
        </div>
        <Button size="sm" className="w-full sm:w-auto" onClick={openAddSheet}><Plus className="h-4 w-4 mr-2" />Set New Target</Button>
      </div>

      {isLoading ? <TargetsSkeleton /> : (
        <div className="grid gap-4 md:grid-cols-3">
          {targets.map((target) => (
            <Card key={target.id} className="border-border/50 cursor-pointer hover:shadow-md transition-shadow" onClick={() => openTargetSheet(target)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /><span className="text-xs sm:text-sm font-medium">{target.period} Target</span></div>
                  <Badge variant="outline" className="text-xs font-normal">{target.percentage}%</Badge>
                </div>
                <div className="text-center py-3 sm:py-4">
                  <p className={`text-2xl sm:text-3xl font-semibold ${getProgressColor(target.percentage)}`}>₦{(target.achieved / 1000).toLocaleString()}K</p>
                  <p className="text-xs text-muted-foreground mt-1">of ₦{(target.target / 1000).toLocaleString()}K target</p>
                </div>
                <div className="space-y-2">
                  <Progress value={target.percentage} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>₦{((target.target - target.achieved) / 1000).toLocaleString()}K remaining</span>
                    {target.percentage >= 80 && <span className="text-green-600 flex items-center"><TrendingUp className="h-3 w-3 mr-1" />On track</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isLoading ? <PerformersSkeleton /> : (
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4"><Award className="h-4 w-4 text-muted-foreground" /><h3 className="font-medium text-sm sm:text-base">Top Performers</h3></div>
            <div className="space-y-3">
              {topPerformers.map((performer, index) => {
                const progress = (performer.sales / performer.target) * 100;
                return (
                  <div key={performer.id} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50" onClick={() => openPerformerSheet(performer)}>
                    <div className="flex items-center justify-center h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-primary/10 text-xs font-medium shrink-0">{index + 1}</div>
                    <Avatar className="h-7 w-7 sm:h-8 sm:w-8 shrink-0"><AvatarFallback className="text-xs">{performer.name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0"><p className="text-sm font-medium truncate">{performer.name}</p><p className="text-xs text-muted-foreground">{performer.role}</p></div>
                        <div className="text-right shrink-0"><p className="text-sm font-medium">₦{(performer.sales / 1000).toLocaleString()}K</p><p className="text-xs text-muted-foreground">{progress.toFixed(0)}% of target</p></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Sheet open={!!selectedTarget || !!selectedPerformer || isAddSheetOpen} onOpenChange={closeSheet}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {isAddSheetOpen ? "Set New Target" : sheetType === "target" ? `${selectedTarget?.period} Target` : selectedPerformer?.name}
            </SheetTitle>
            <SheetDescription>
              {isAddSheetOpen ? "Create a new sales target" : sheetType === "target" ? `${selectedTarget?.startDate} - ${selectedTarget?.endDate}` : selectedPerformer?.role}
            </SheetDescription>
          </SheetHeader>

          {selectedTarget && sheetType === "target" ? (
            <Tabs defaultValue="overview" className="mt-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                <div className="text-center p-6 bg-muted/30 rounded-lg">
                  <Target className="h-10 w-10 mx-auto text-primary mb-3" />
                  <p className={`text-3xl font-bold ${getProgressColor(selectedTarget.percentage)}`}>₦{(selectedTarget.achieved / 1000).toLocaleString()}K</p>
                  <p className="text-sm text-muted-foreground">of ₦{(selectedTarget.target / 1000).toLocaleString()}K target</p>
                  <Progress value={selectedTarget.percentage} className="h-3 mt-4" />
                  <p className="text-sm font-medium mt-2">{selectedTarget.percentage}% Complete</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><Label className="text-xs text-muted-foreground">Start Date</Label><p className="text-sm font-medium">{selectedTarget.startDate}</p></div>
                  <div className="space-y-1"><Label className="text-xs text-muted-foreground">End Date</Label><p className="text-sm font-medium">{selectedTarget.endDate}</p></div>
                  <div className="space-y-1"><Label className="text-xs text-muted-foreground">Remaining</Label><p className="text-sm font-medium">₦{((selectedTarget.target - selectedTarget.achieved) / 1000).toLocaleString()}K</p></div>
                  <div className="space-y-1"><Label className="text-xs text-muted-foreground">Status</Label><Badge className={selectedTarget.percentage >= 80 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : ""} variant="secondary">{selectedTarget.percentage >= 80 ? "On Track" : "Behind"}</Badge></div>
                </div>
              </TabsContent>

              <TabsContent value="breakdown" className="space-y-4 mt-4">
                <div className="space-y-3">
                  {["Dine-In", "Takeaway", "Delivery", "Events"].map((channel, idx) => (
                    <div key={channel} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium">{channel}</span><span className="text-sm font-bold">₦{(Math.random() * 500 + 100).toFixed(0)}K</span></div>
                      <Progress value={Math.random() * 100} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          ) : selectedPerformer && sheetType === "performer" ? (
            <Tabs defaultValue="performance" className="mt-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="targets">Targets</TabsTrigger>
              </TabsList>

              <TabsContent value="performance" className="space-y-4 mt-4">
                <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                  <Avatar className="h-12 w-12"><AvatarFallback>{selectedPerformer.name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                  <div><p className="font-medium">{selectedPerformer.name}</p><p className="text-sm text-muted-foreground">{selectedPerformer.role}</p></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg text-center"><DollarSign className="h-6 w-6 mx-auto text-muted-foreground mb-2" /><p className="text-xl font-bold">₦{(selectedPerformer.sales / 1000).toLocaleString()}K</p><p className="text-xs text-muted-foreground">Total Sales</p></div>
                  <div className="p-4 border rounded-lg text-center"><BarChart3 className="h-6 w-6 mx-auto text-muted-foreground mb-2" /><p className="text-xl font-bold">{selectedPerformer.orders}</p><p className="text-xs text-muted-foreground">Orders</p></div>
                </div>
                <div className="space-y-2"><Label className="text-xs text-muted-foreground">Target Progress</Label><Progress value={(selectedPerformer.sales / selectedPerformer.target) * 100} className="h-3" /><p className="text-sm text-center">{((selectedPerformer.sales / selectedPerformer.target) * 100).toFixed(0)}% of ₦{(selectedPerformer.target / 1000).toLocaleString()}K target</p></div>
              </TabsContent>

              <TabsContent value="targets" className="space-y-4 mt-4">
                <div className="space-y-2"><Label>Personal Target</Label><Input type="number" defaultValue={selectedPerformer.target} /></div>
                <div className="space-y-2">
                  <Label>Target Period</Label>
                  <Select defaultValue="monthly"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="daily">Daily</SelectItem><SelectItem value="weekly">Weekly</SelectItem><SelectItem value="monthly">Monthly</SelectItem></SelectContent></Select>
                </div>
                <Button className="w-full">Update Target</Button>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label>Target Period</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select period" /></SelectTrigger><SelectContent><SelectItem value="daily">Daily</SelectItem><SelectItem value="weekly">Weekly</SelectItem><SelectItem value="monthly">Monthly</SelectItem><SelectItem value="quarterly">Quarterly</SelectItem></SelectContent></Select>
              </div>
              <div className="space-y-2"><Label>Target Amount (₦)</Label><Input type="number" placeholder="e.g., 5000000" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Start Date</Label><Input type="date" /></div>
                <div className="space-y-2"><Label>End Date</Label><Input type="date" /></div>
              </div>
            </div>
          )}

          <SheetFooter className="mt-6 flex-col sm:flex-row gap-2">
            {(selectedTarget || selectedPerformer) ? (
              <Button variant="outline" onClick={closeSheet} className="w-full">Close</Button>
            ) : (
              <>
                <Button variant="outline" onClick={closeSheet} className="w-full sm:w-auto">Cancel</Button>
                <Button className="w-full sm:w-auto">Create Target</Button>
              </>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
