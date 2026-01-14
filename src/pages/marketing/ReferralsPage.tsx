import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Referral Program</h1>
          <p className="text-sm text-muted-foreground">Track referrals and manage bonuses</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium">Referral Settings</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Referrer Bonus ($)</Label>
              <Input type="number" defaultValue="10" className="h-9 bg-muted/50 border-0" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Referred Bonus ($)</Label>
              <Input type="number" defaultValue="5" className="h-9 bg-muted/50 border-0" />
            </div>
          </div>
          <Button size="sm" className="mt-4">Save Settings</Button>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
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
              <SelectTrigger className="w-[120px] h-9 bg-muted/50 border-0">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-xs font-medium text-muted-foreground">Referrer</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Referred</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Date</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground text-right">Reward</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals.map((ref) => (
                <TableRow key={ref.id} className="border-border/50">
                  <TableCell className="font-medium text-sm">{ref.referrer}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{ref.referred}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{ref.date}</TableCell>
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
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
