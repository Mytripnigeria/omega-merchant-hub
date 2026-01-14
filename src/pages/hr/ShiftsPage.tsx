import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Plus, Users, ArrowLeftRight } from "lucide-react";

export default function ShiftsPage() {
  const [view, setView] = useState("week");

  const shifts = [
    { id: 1, staff: "John Doe", day: "Mon", time: "06:00 - 14:00", type: "Morning" },
    { id: 2, staff: "Sarah Smith", day: "Mon", time: "14:00 - 22:00", type: "Afternoon" },
    { id: 3, staff: "Mike Johnson", day: "Mon", time: "06:00 - 14:00", type: "Morning" },
    { id: 4, staff: "Lisa Brown", day: "Tue", time: "14:00 - 22:00", type: "Afternoon" },
  ];

  const swapRequests = [
    { id: 1, from: "John Doe", to: "Sarah Smith", date: "Jan 15", status: "pending" },
    { id: 2, from: "Mike Johnson", to: "Lisa Brown", date: "Jan 16", status: "approved" },
  ];

  const stats = [
    { label: "Shifts This Week", value: "48", icon: Calendar },
    { label: "Staff Scheduled", value: "12", icon: Users },
    { label: "Swap Requests", value: "3", icon: ArrowLeftRight },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Shifts</h1>
          <p className="text-muted-foreground">Schedule and manage staff shifts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={view === "week" ? "default" : "outline"} size="sm" onClick={() => setView("week")}>Week</Button>
          <Button variant={view === "day" ? "default" : "outline"} size="sm" onClick={() => setView("day")}>Day</Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />Add Shift</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Shift</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2"><Label>Staff Member</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select staff" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john">John Doe</SelectItem>
                      <SelectItem value="sarah">Sarah Smith</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Date</Label><Input type="date" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Start Time</Label><Input type="time" /></div>
                  <div className="space-y-2"><Label>End Time</Label><Input type="time" /></div>
                </div>
                <Button className="w-full">Create Shift</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
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
        <CardHeader>
          <CardTitle>This Week's Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} className="text-center">
                <p className="font-medium text-sm mb-2">{day}</p>
                <div className="space-y-1">
                  {shifts.filter(s => s.day === day).map((shift) => (
                    <div key={shift.id} className="p-2 bg-primary/10 rounded text-xs">
                      <p className="font-medium truncate">{shift.staff}</p>
                      <p className="text-muted-foreground">{shift.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Swap Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {swapRequests.map((req) => (
              <div key={req.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <span>{req.from}</span>
                  <ArrowLeftRight className="h-4 w-4" />
                  <span>{req.to}</span>
                  <Badge variant="outline">{req.date}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={req.status === "approved" ? "default" : "secondary"}>{req.status}</Badge>
                  {req.status === "pending" && (
                    <>
                      <Button size="sm" variant="outline">Deny</Button>
                      <Button size="sm">Approve</Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
