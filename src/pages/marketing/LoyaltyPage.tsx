import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Star, Users, Gift, TrendingUp, Plus } from "lucide-react";

export default function LoyaltyPage() {
  const tiers = [
    { name: "Bronze", minPoints: 0, benefits: ["5% off orders", "Birthday reward"], members: 456, color: "bg-orange-100 text-orange-800" },
    { name: "Silver", minPoints: 500, benefits: ["10% off orders", "Free delivery", "Birthday reward"], members: 234, color: "bg-gray-100 text-gray-800" },
    { name: "Gold", minPoints: 1500, benefits: ["15% off orders", "Free delivery", "Priority support", "Birthday reward"], members: 89, color: "bg-yellow-100 text-yellow-800" },
    { name: "Platinum", minPoints: 5000, benefits: ["20% off orders", "Free delivery", "VIP support", "Exclusive events"], members: 23, color: "bg-purple-100 text-purple-800" },
  ];

  const stats = [
    { label: "Total Members", value: "802", icon: Users },
    { label: "Points Issued", value: "125K", icon: Star },
    { label: "Rewards Claimed", value: "1,234", icon: Gift },
    { label: "Retention Rate", value: "78%", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Loyalty Program</h1>
          <p className="text-muted-foreground">Manage tiers, points, and rewards</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Add Tier</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Loyalty Tier</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Tier Name</Label><Input placeholder="e.g., Diamond" /></div>
              <div className="space-y-2"><Label>Minimum Points</Label><Input type="number" /></div>
              <div className="space-y-2"><Label>Discount %</Label><Input type="number" /></div>
              <Button className="w-full">Create Tier</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {tiers.map((tier) => (
          <Card key={tier.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge className={tier.color}>{tier.name}</Badge>
                <span className="text-sm text-muted-foreground">{tier.members} members</span>
              </div>
              <CardTitle className="text-lg">{tier.minPoints.toLocaleString()}+ points</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {tier.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Star className="h-3 w-3 text-primary" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <Button variant="outline" size="sm" className="w-full mt-4">Edit Tier</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Point Redemption Settings</CardTitle>
          <CardDescription>Configure how customers can use their points</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Points per $1 spent</Label>
              <Input type="number" defaultValue="10" />
            </div>
            <div className="space-y-2">
              <Label>Points value ($ per 100 points)</Label>
              <Input type="number" defaultValue="1" />
            </div>
            <div className="space-y-2">
              <Label>Min. points to redeem</Label>
              <Input type="number" defaultValue="100" />
            </div>
          </div>
          <Button>Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}
