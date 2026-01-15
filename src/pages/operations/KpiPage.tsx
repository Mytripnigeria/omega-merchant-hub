import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoading } from "@/hooks/use-loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Target, BarChart3, Users, DollarSign, Clock, Star } from "lucide-react";

const kpis = [
  { name: "Revenue Target", current: 85000, target: 100000, trend: "up", change: "+12%", icon: DollarSign, format: "currency" },
  { name: "Customer Satisfaction", current: 4.5, target: 5, trend: "up", change: "+0.3", icon: Star, format: "rating" },
  { name: "Average Order Value", current: 28.50, target: 35, trend: "down", change: "-2%", icon: BarChart3, format: "currency" },
  { name: "Table Turnover Rate", current: 3.2, target: 4, trend: "up", change: "+0.5", icon: Clock, format: "number" },
  { name: "Customer Retention", current: 78, target: 85, trend: "up", change: "+5%", icon: Users, format: "percentage" },
  { name: "Staff Efficiency", current: 92, target: 95, trend: "up", change: "+3%", icon: TrendingUp, format: "percentage" },
];

const formatValue = (value: number, format: string) => {
  switch (format) {
    case "currency": return value >= 1000 ? `$${(value / 1000).toFixed(0)}K` : `$${value.toFixed(2)}`;
    case "rating": return value.toFixed(1);
    case "percentage": return `${value}%`;
    default: return value.toString();
  }
};

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

function SummarySkeleton() {
  return (
    <Card className="border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="grid gap-4 grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="text-center p-3 sm:p-4 bg-muted/50 rounded-lg">
              <Skeleton className="h-8 w-8 mx-auto mb-2" />
              <Skeleton className="h-3 w-20 mx-auto" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const KpiPage = () => {
  const isLoading = useLoading(1000);

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Key Performance Indicators</h1>
          <p className="text-sm text-muted-foreground">Track your business performance metrics</p>
        </div>
        <Select defaultValue="this-month">
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this-week">This Week</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
            <SelectItem value="this-quarter">This Quarter</SelectItem>
            <SelectItem value="this-year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <KpisSkeleton />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {kpis.map((kpi) => {
            const progress = Math.min((kpi.current / kpi.target) * 100, 100);
            const Icon = kpi.icon;

            return (
              <Card key={kpi.name} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium">{kpi.name}</span>
                    </div>
                    <div className={`flex items-center text-xs ${kpi.trend === "up" ? "text-green-600" : "text-red-500"}`}>
                      {kpi.trend === "up" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {kpi.change}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <span className="text-xl sm:text-2xl font-semibold">
                      {formatValue(kpi.current, kpi.format)}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      / {formatValue(kpi.target, kpi.format)}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <Progress value={progress} className="h-1.5" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{progress.toFixed(0)}% of target</span>
                      <span>{(kpi.target - kpi.current).toFixed(kpi.format === "rating" ? 1 : 0)} to go</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {isLoading ? (
        <SummarySkeleton />
      ) : (
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium text-sm sm:text-base">Performance Summary</h3>
            </div>
            <div className="grid gap-3 sm:gap-4 grid-cols-3">
              <div className="text-center p-3 sm:p-4 bg-muted/50 rounded-lg">
                <p className="text-xl sm:text-2xl font-semibold text-green-600">4</p>
                <p className="text-xs text-muted-foreground">KPIs On Track</p>
              </div>
              <div className="text-center p-3 sm:p-4 bg-muted/50 rounded-lg">
                <p className="text-xl sm:text-2xl font-semibold text-yellow-600">1</p>
                <p className="text-xs text-muted-foreground">Needs Attention</p>
              </div>
              <div className="text-center p-3 sm:p-4 bg-muted/50 rounded-lg">
                <p className="text-xl sm:text-2xl font-semibold text-red-500">1</p>
                <p className="text-xs text-muted-foreground">Below Target</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KpiPage;
