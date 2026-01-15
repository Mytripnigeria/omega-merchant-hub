import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function HoursSettingsPage() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Operating Hours</h1>
        <p className="text-sm text-muted-foreground">Set your store's business hours</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weekly Schedule</CardTitle>
            <CardDescription>Set opening and closing times for each day</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {days.map((day, index) => (
              <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border gap-3">
                <div className="flex items-center justify-between sm:justify-start">
                  <span className="font-medium text-sm w-24">{day}</span>
                  <Switch defaultChecked={index !== 6} className="sm:hidden" />
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Input 
                    type="time" 
                    defaultValue="09:00" 
                    className="flex-1 sm:w-28 h-9" 
                  />
                  <span className="text-muted-foreground text-sm">to</span>
                  <Input 
                    type="time" 
                    defaultValue={index === 6 ? "18:00" : "22:00"} 
                    className="flex-1 sm:w-28 h-9" 
                  />
                  <Switch defaultChecked={index !== 6} className="hidden sm:flex" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Holiday Hours</CardTitle>
            <CardDescription>Set special hours for holidays</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <p className="text-muted-foreground text-sm mb-4">No holiday hours configured</p>
                <Button variant="outline" size="sm">Add Holiday</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Auto-close Store</CardTitle>
            <CardDescription>Automatically pause online orders outside business hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Pause orders when closed</p>
                <p className="text-xs text-muted-foreground">Customers won't be able to place orders outside business hours</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Button className="w-fit">Save Changes</Button>
      </div>
    </div>
  );
}
