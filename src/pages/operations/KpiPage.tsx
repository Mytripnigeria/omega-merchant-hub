import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Target, BarChart3 } from "lucide-react";

const KpiPage = () => {
  const kpis = [
    { name: "Revenue Target", current: 85000, target: 100000, trend: "up", change: "+12%" },
    { name: "Customer Satisfaction", current: 4.5, target: 5, trend: "up", change: "+0.3" },
    { name: "Average Order Value", current: 28.50, target: 35, trend: "down", change: "-2%" },
    { name: "Table Turnover Rate", current: 3.2, target: 4, trend: "up", change: "+0.5" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Key Performance Indicators</h1>
        <p className="text-muted-foreground">Track your business performance metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{kpi.name}</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {typeof kpi.current === "number" && kpi.current > 100 
                  ? `$${kpi.current.toLocaleString()}` 
                  : kpi.current}
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">
                  Target: {typeof kpi.target === "number" && kpi.target > 100 
                    ? `$${kpi.target.toLocaleString()}` 
                    : kpi.target}
                </span>
                <div className={`flex items-center text-xs ${kpi.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                  {kpi.trend === "up" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {kpi.change}
                </div>
              </div>
              <div className="w-full bg-secondary rounded-full h-2 mt-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${Math.min((kpi.current / kpi.target) * 100, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" /> Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Detailed KPI analytics and trends will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default KpiPage;
