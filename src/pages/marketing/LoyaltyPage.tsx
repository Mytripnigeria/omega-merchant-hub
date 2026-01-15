import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Star, Users, Gift, TrendingUp, Plus, Settings } from "lucide-react";

export default function LoyaltyPage() {
  const tiers = [
    { name: "Bronze", minPoints: 0, discount: 5, benefits: ["5% off orders", "Birthday reward"], members: 456, color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" },
    { name: "Silver", minPoints: 500, discount: 10, benefits: ["10% off orders", "Free delivery"], members: 234, color: "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300" },
    { name: "Gold", minPoints: 1500, discount: 15, benefits: ["15% off orders", "Priority support"], members: 89, color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
    { name: "Platinum", minPoints: 5000, discount: 20, benefits: ["20% off orders", "VIP events"], members: 23, color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
  ];

  const stats = [
    { label: "Members", value: "802", icon: Users },
    { label: "Points Issued", value: "125K", icon: Star },
    { label: "Rewards", value: "1,234", icon: Gift },
    { label: "Retention", value: "78%", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Loyalty Program</h1>
          <p className="text-sm text-muted-foreground">Manage tiers, points, and rewards</p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4 mr-2" />Add Tier</Button>
      </div>

      {/* Two-column layout for desktop */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Loyalty Tiers */}
          <div className="grid gap-4 sm:grid-cols-2">
            {tiers.map((tier) => (
              <Card key={tier.name} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={`${tier.color} text-xs font-medium`}>{tier.name}</Badge>
                    <span className="text-xs text-muted-foreground">{tier.members} members</span>
                  </div>
                  <p className="text-lg font-semibold mb-1">{tier.minPoints.toLocaleString()}+ pts</p>
                  <p className="text-sm text-muted-foreground mb-3">{tier.discount}% discount</p>
                  <ul className="space-y-1.5 mb-4">
                    {tier.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 text-primary" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" size="sm" className="w-full text-xs">Edit Tier</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-medium">Point Settings</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Points per $1</Label>
                <Input type="number" defaultValue="10" className="h-9 bg-muted/50 border-0" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Value per 100 pts</Label>
                <Input type="number" defaultValue="1" className="h-9 bg-muted/50 border-0" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Min. to redeem</Label>
                <Input type="number" defaultValue="100" className="h-9 bg-muted/50 border-0" />
              </div>
              <Button size="sm" className="w-full">Save Settings</Button>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Add New Tier
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Gift className="mr-2 h-4 w-4" />
                Create Reward
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                View Members
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Top Members</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {["John Doe", "Sarah Smith", "Mike Johnson"].map((name, i) => (
                <div key={name} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                      {name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm">{name}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">{(5000 - i * 1200).toLocaleString()} pts</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
