import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, TrendingUp, Calendar, Award } from "lucide-react";

const SalesTargetPage = () => {
  const targets = [
    { period: "Daily", target: 5000, achieved: 4200, percentage: 84 },
    { period: "Weekly", target: 35000, achieved: 28500, percentage: 81 },
    { period: "Monthly", target: 150000, achieved: 112000, percentage: 75 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales Targets</h1>
          <p className="text-muted-foreground">Set and track sales goals</p>
        </div>
        <Button><Target className="mr-2 h-4 w-4" /> Set New Target</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {targets.map((target) => (
          <Card key={target.period}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {target.period} Target
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{target.percentage}%</div>
                <p className="text-sm text-muted-foreground">of target achieved</p>
              </div>
              <div className="w-full bg-secondary rounded-full h-3">
                <div 
                  className="bg-primary h-3 rounded-full transition-all" 
                  style={{ width: `${target.percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span>${target.achieved.toLocaleString()}</span>
                <span className="text-muted-foreground">${target.target.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" /> Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Staff performance against sales targets will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesTargetPage;
