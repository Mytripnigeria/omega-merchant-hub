import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Users, Gift, DollarSign, Download, Settings, MoreHorizontal } from "lucide-react";
import { Referral } from "@/types/marketing";

// UI-specific interface extending API type with computed display fields
interface ReferralUI extends Omit<Referral, 'id'> {
  id: string;
  displayReward: string;
  displayDate: string;
  displayStatus: string;
}

// Transform API referral to UI format
const transformReferral = (referral: Referral): ReferralUI => ({
  ...referral,
  displayReward: `₦${(referral.referrerReward || 0).toLocaleString()}`,
  displayDate: referral.createdAt,
  displayStatus: referral.status.replace(/-/g, ' '),
});

// Mock data using API types
const mockReferrals: Referral[] = [
  { id: "ref-1", storeId: "store-1", referrerId: "cust-1", referrerName: "John Doe", referredId: "cust-5", referredName: "Mike Smith", referredEmail: "mike@example.com", referralCode: "JOHN123", status: "rewarded", referrerReward: 1000, referredReward: 500, rewardType: "credit", createdAt: "2026-01-12", updatedAt: "2026-01-12" },
  { id: "ref-2", storeId: "store-1", referrerId: "cust-2", referrerName: "Sarah Lee", referredEmail: "lisa@example.com", referralCode: "SARAH456", status: "pending", referrerReward: 1000, referredReward: 500, rewardType: "credit", createdAt: "2026-01-11", updatedAt: "2026-01-11" },
  { id: "ref-3", storeId: "store-1", referrerId: "cust-1", referrerName: "John Doe", referredId: "cust-6", referredName: "Tom Wilson", referredEmail: "tom@example.com", referralCode: "JOHN123", status: "rewarded", referrerReward: 1000, referredReward: 500, rewardType: "credit", createdAt: "2026-01-10", updatedAt: "2026-01-10" },
  { id: "ref-4", storeId: "store-1", referrerId: "cust-3", referrerName: "Emma Davis", referredId: "cust-7", referredName: "Anna White", referredEmail: "anna@example.com", referralCode: "EMMA789", status: "rewarded", referrerReward: 1000, referredReward: 500, rewardType: "credit", createdAt: "2026-01-09", updatedAt: "2026-01-09" },
];

export default function ReferralsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const referrals: ReferralUI[] = mockReferrals.map(transformReferral);

  const stats = [
    { label: "Total Referrals", value: "234", icon: Users },
    { label: "Completed", value: "198", icon: Gift },
    { label: "Rewards Paid", value: "₦198,000", icon: DollarSign },
  ];

  const statusColors: Record<string, string> = {
    rewarded: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    "first-purchase": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    "signed-up": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    expired: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Referral Program</h1>
          <p className="text-sm text-muted-foreground">Track referrals and manage bonuses</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Two-column layout for desktop */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid gap-3 grid-cols-3">
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

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search referrals..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="pl-9 h-9 bg-muted/50 border-0" 
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[120px] h-9 bg-muted/50 border-0">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="rewarded">Rewarded</SelectItem>
                <SelectItem value="first-purchase">First Purchase</SelectItem>
                <SelectItem value="signed-up">Signed Up</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mobile Card View */}
          <div className="block sm:hidden space-y-3">
            {referrals.map((ref) => (
              <Card key={ref.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">{ref.referrerName}</p>
                      <p className="text-xs text-muted-foreground">referred {ref.referredName || ref.referredEmail}</p>
                    </div>
                    <Badge className={statusColors[ref.status] || "bg-muted text-muted-foreground"} variant="secondary">
                      {ref.displayStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-sm">
                    <span className="text-muted-foreground">{ref.displayDate}</span>
                    <span className="font-medium">{ref.displayReward}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop Table View */}
          <Card className="border-border/50 hidden sm:block">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Referrer</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Referred</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Date</th>
                      <th className="text-right text-xs font-medium text-muted-foreground p-4">Reward</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
                      <th className="w-10 p-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {referrals.map((ref) => (
                      <tr key={ref.id} className="border-b border-border/50 last:border-0 group cursor-pointer hover:bg-muted/50">
                        <td className="font-medium text-sm p-4">{ref.referrerName}</td>
                        <td className="text-sm text-muted-foreground p-4">{ref.referredName || ref.referredEmail}</td>
                        <td className="text-sm text-muted-foreground p-4">{ref.displayDate}</td>
                        <td className="text-sm font-medium text-right p-4">{ref.displayReward}</td>
                        <td className="p-4">
                          <Badge className={statusColors[ref.status] || "bg-muted text-muted-foreground"} variant="secondary">
                            {ref.displayStatus}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-medium">Referral Settings</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Referrer Bonus (₦)</Label>
                <Input type="number" defaultValue="1000" className="h-9 bg-muted/50 border-0" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Referred Bonus (₦)</Label>
                <Input type="number" defaultValue="500" className="h-9 bg-muted/50 border-0" />
              </div>
              <Button size="sm" className="w-full">Save Settings</Button>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Top Referrers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { name: "John Doe", count: 12 },
                { name: "Sarah Lee", count: 8 },
                { name: "Emma Davis", count: 5 },
              ].map((user) => (
                <div key={user.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm">{user.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">{user.count} refs</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                View All Users
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Gift className="mr-2 h-4 w-4" />
                Pay Rewards
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
