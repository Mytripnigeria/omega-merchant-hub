import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, Square, Users, Calendar } from "lucide-react";

export default function WorkstationShiftsPage() {
  const activeShifts = [
    { id: 1, user: "John Doe", role: "Cashier", started: "9:00 AM", duration: "4h 30m" },
    { id: 2, user: "Sarah Smith", role: "Manager", started: "8:00 AM", duration: "5h 30m" },
    { id: 3, user: "Mike Johnson", role: "Kitchen", started: "10:00 AM", duration: "3h 30m" },
  ];

  const stats = [
    { label: "Active Shifts", value: "8", icon: Users },
    { label: "Total Hours Today", value: "42h", icon: Clock },
    { label: "Scheduled", value: "12", icon: Calendar },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Workstation Shifts</h1>
          <p className="text-muted-foreground">Manage active shifts and clock in/out</p>
        </div>
        <Button><Play className="mr-2 h-4 w-4" /> Start Shift</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Active Shifts</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeShifts.map((shift) => (
              <div key={shift.id} className="flex items-center justify-between p-4 border rounded-lg transition-colors hover:bg-muted/50">
                <div>
                  <p className="font-medium">{shift.user}</p>
                  <p className="text-sm text-muted-foreground">{shift.role} • Started at {shift.started}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline">{shift.duration}</Badge>
                  <Button variant="destructive" size="sm">
                    <Square className="mr-2 h-3 w-3" /> End Shift
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
