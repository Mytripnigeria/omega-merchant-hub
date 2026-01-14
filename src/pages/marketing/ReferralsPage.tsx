import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Search, Users, Gift, DollarSign, Download } from "lucide-react";

export default function ReferralsPage() {
  const [search, setSearch] = useState("");

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
          <h1 className="text-3xl font-bold text-foreground">Referral Program</h1>
          <p className="text-muted-foreground">Track referrals and manage bonuses</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
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
          <CardTitle>Referral Settings</CardTitle>
          <CardDescription>Configure referral bonuses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Referrer Bonus ($)</Label>
              <Input type="number" defaultValue="10" />
            </div>
            <div className="space-y-2">
              <Label>Referred Bonus ($)</Label>
              <Input type="number" defaultValue="5" />
            </div>
          </div>
          <Button>Save Settings</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search referrals..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Referrer</TableHead>
                <TableHead>Referred</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Reward</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals.map((ref) => (
                <TableRow key={ref.id}>
                  <TableCell className="font-medium">{ref.referrer}</TableCell>
                  <TableCell>{ref.referred}</TableCell>
                  <TableCell>{ref.date}</TableCell>
                  <TableCell>${ref.reward.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={ref.status === "completed" ? "default" : "secondary"}>{ref.status}</Badge>
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
