import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, Square, Users } from "lucide-react";

const WorkstationShiftsPage = () => {
  const activeShifts = [
    { id: 1, user: "John Doe", role: "Cashier", started: "9:00 AM", duration: "4h 30m" },
    { id: 2, user: "Sarah Smith", role: "Manager", started: "8:00 AM", duration: "5h 30m" },
    { id: 3, user: "Mike Johnson", role: "Kitchen", started: "10:00 AM", duration: "3h 30m" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Workstation Shifts</h1>
          <p className="text-muted-foreground">Manage active shifts and clock in/out</p>
        </div>
        <Button><Play className="mr-2 h-4 w-4" /> Start Shift</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Shifts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">8</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Hours Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">42h</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">12</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Active Shifts</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeShifts.map((shift) => (
              <div key={shift.id} className="flex items-center justify-between p-4 border rounded-lg">
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
};

export default WorkstationShiftsPage;
