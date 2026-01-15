import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoading } from "@/hooks/use-loading";
import { Clock, Play, Square, Users, Calendar } from "lucide-react";

interface Shift {
  id: number;
  user: string;
  role: string;
  started: string;
  duration: string;
}

const activeShifts: Shift[] = [
  { id: 1, user: "John Doe", role: "Cashier", started: "9:00 AM", duration: "4h 30m" },
  { id: 2, user: "Sarah Smith", role: "Manager", started: "8:00 AM", duration: "5h 30m" },
  { id: 3, user: "Mike Johnson", role: "Kitchen", started: "10:00 AM", duration: "3h 30m" },
];

const stats = [
  { label: "Active Shifts", value: "8", icon: Users },
  { label: "Total Hours Today", value: "42h", icon: Clock },
  { label: "Scheduled", value: "12", icon: Calendar },
];

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className={i === 2 ? "col-span-2 md:col-span-1" : ""}>
          <CardContent className="p-3 sm:p-4 pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-7 w-12" />
              </div>
              <Skeleton className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ShiftsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-40" />
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-3">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function WorkstationShiftsPage() {
  const isLoading = useLoading(1000);

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Workstation Shifts</h1>
          <p className="text-sm text-muted-foreground">Manage active shifts and clock in/out</p>
        </div>
        <Button size="sm" className="w-full sm:w-auto">
          <Play className="mr-2 h-4 w-4" />
          Start Shift
        </Button>
      </div>

      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {stats.map((stat, index) => (
            <Card key={stat.label} className={index === 2 ? "col-span-2 md:col-span-1" : ""}>
              <CardContent className="p-3 sm:p-4 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-sm sm:text-base">Active Shifts</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {isLoading ? (
            <ShiftsSkeleton />
          ) : (
            <div className="space-y-3">
              {activeShifts.map((shift) => (
                <div key={shift.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 border rounded-lg transition-colors hover:bg-muted/50">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{shift.user}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{shift.role} • Started at {shift.started}</p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                    <Badge variant="outline" className="text-xs">{shift.duration}</Badge>
                    <Button variant="destructive" size="sm" className="shrink-0">
                      <Square className="mr-1 sm:mr-2 h-3 w-3" />
                      <span className="hidden sm:inline">End Shift</span>
                      <span className="sm:hidden">End</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
