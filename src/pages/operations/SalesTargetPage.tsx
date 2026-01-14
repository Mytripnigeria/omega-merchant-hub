import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Target, Calendar, Award, TrendingUp, Plus } from "lucide-react";

const SalesTargetPage = () => {
  const targets = [
    { period: "Daily", target: 5000, achieved: 4200, percentage: 84 },
    { period: "Weekly", target: 35000, achieved: 28500, percentage: 81 },
    { period: "Monthly", target: 150000, achieved: 112000, percentage: 75 },
  ];

  const topPerformers = [
    { name: "Sarah Johnson", role: "Server", sales: 12500, target: 10000 },
    { name: "Mike Chen", role: "Server", sales: 11800, target: 10000 },
    { name: "Emma Wilson", role: "Bartender", sales: 9500, target: 8000 },
    { name: "James Brown", role: "Server", sales: 8900, target: 10000 },
  ];

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-red-500";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Sales Targets</h1>
          <p className="text-sm text-muted-foreground">Set and track sales goals</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Set New Target
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {targets.map((target) => (
          <Card key={target.period} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{target.period} Target</span>
                </div>
                <Badge variant="outline" className="text-xs font-normal">
                  {target.percentage}%
                </Badge>
              </div>
              
              <div className="text-center py-4">
                <p className={`text-3xl font-semibold ${getProgressColor(target.percentage)}`}>
                  ${target.achieved.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  of ${target.target.toLocaleString()} target
                </p>
              </div>

              <div className="space-y-2">
                <Progress value={target.percentage} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>${(target.target - target.achieved).toLocaleString()} remaining</span>
                  {target.percentage >= 80 && (
                    <span className="text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      On track
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium">Top Performers</h3>
          </div>
          
          <div className="space-y-3">
            {topPerformers.map((performer, index) => {
              const progress = (performer.sales / performer.target) * 100;
              return (
                <div key={performer.name} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-xs font-medium">
                    {index + 1}
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {performer.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{performer.name}</p>
                        <p className="text-xs text-muted-foreground">{performer.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">${performer.sales.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{progress.toFixed(0)}% of target</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesTargetPage;
