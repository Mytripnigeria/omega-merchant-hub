import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Users, Gift, DollarSign, Download, Settings, MoreHorizontal } from "lucide-react";

export default function ReferralsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const referrals = [
    { id: 1, referrer: "John Doe", referred: "Mike Smith", date: "2026-01-12", status: "completed", reward: 10.00 },
    { id: 2, referrer: "Sarah Lee", referred: "Lisa Brown", date: "2026-01-11", status: "pending", reward: 10.00 },
    { id: 3, referrer: "John Doe", referred: "Tom Wilson", date: "2026-01-10", status: "completed", reward: 10.00 },
    { id: 4, referrer: "Emma Davis", referred: "Anna White", date: "2026-01-09", status: "completed", reward: 10.00 },
  ];

  const stats = [
    { label: "Total Referrals", value: "234", icon: Users },
    { label: "Completed", value: "198", icon: Gift },
    { label: "Rewards Paid", value: "$1,980", icon: DollarSign },
  ];

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
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Referrals Table */}
          <Card className="border-border/50">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-transparent">
                      <TableHead className="text-xs font-medium text-muted-foreground">Referrer</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground">Referred</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground hidden sm:table-cell">Date</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground text-right">Reward</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {referrals.map((ref) => (
                      <TableRow key={ref.id} className="border-border/50 group cursor-pointer">
                        <TableCell className="font-medium text-sm">{ref.referrer}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{ref.referred}</TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">{ref.date}</TableCell>
                        <TableCell className="text-sm font-medium text-right">${ref.reward.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={ref.status === "completed" ? "default" : "secondary"} 
                            className="text-xs font-normal"
                          >
                            {ref.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                <Label className="text-xs text-muted-foreground">Referrer Bonus ($)</Label>
                <Input type="number" defaultValue="10" className="h-9 bg-muted/50 border-0" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Referred Bonus ($)</Label>
                <Input type="number" defaultValue="5" className="h-9 bg-muted/50 border-0" />
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
