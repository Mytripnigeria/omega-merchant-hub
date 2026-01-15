import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Tag, Percent, Users, MoreHorizontal, Calendar } from "lucide-react";

export default function DiscountCodesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const discounts = [
    { id: 1, code: "WELCOME20", type: "percentage", value: 20, minOrder: 50, uses: 145, maxUses: 500, expires: "2026-02-28", status: "active" },
    { id: 2, code: "FLAT10", type: "fixed", value: 10, minOrder: 30, uses: 89, maxUses: 200, expires: "2026-01-31", status: "active" },
    { id: 3, code: "SUMMER15", type: "percentage", value: 15, minOrder: 40, uses: 200, maxUses: 200, expires: "2026-01-20", status: "expired" },
    { id: 4, code: "VIP25", type: "percentage", value: 25, minOrder: 100, uses: 23, maxUses: 50, expires: "2026-03-31", status: "active" },
  ];

  const stats = [
    { label: "Active Codes", value: "12", icon: Tag },
    { label: "Total Used", value: "457", icon: Users },
    { label: "Avg. Discount", value: "18%", icon: Percent },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Discount Codes</h1>
          <p className="text-sm text-muted-foreground">Create and manage promotional codes</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">Create Code</span></Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Discount Code</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Code</Label><Input placeholder="e.g., SAVE20" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Type</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Value</Label><Input type="number" placeholder="20" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Min. Order</Label><Input type="number" placeholder="50" /></div>
                <div className="space-y-2"><Label>Max Uses</Label><Input type="number" placeholder="100" /></div>
              </div>
              <div className="space-y-2"><Label>Expires</Label><Input type="date" /></div>
              <Button className="w-full">Create Code</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Two-column layout for desktop */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Stats */}
          <div className="grid gap-3 grid-cols-3">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-border/50">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-muted flex items-center justify-center">
                      <stat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="text-xl sm:text-2xl font-semibold">{stat.value}</p>
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
                placeholder="Search codes..." 
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Discount Codes List */}
          <Card className="border-border/50">
            <CardContent className="p-0">
              {/* Mobile Card View */}
              <div className="block sm:hidden divide-y divide-border">
                {discounts.map((discount) => (
                  <div key={discount.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-mono font-medium">{discount.code}</p>
                        <p className="text-lg font-semibold">
                          {discount.type === "percentage" ? `${discount.value}%` : `$${discount.value}`} off
                        </p>
                      </div>
                      <Badge 
                        variant={discount.status === "active" ? "default" : "secondary"} 
                        className="text-xs font-normal shrink-0"
                      >
                        {discount.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Min. ${discount.minOrder}</span>
                      <span>{discount.uses}/{discount.maxUses} uses</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Expires {discount.expires}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Code</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Discount</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Min.</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Uses</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Expires</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {discounts.map((discount) => (
                      <tr key={discount.id} className="border-b border-border last:border-0 group cursor-pointer hover:bg-muted/50">
                        <td className="p-4 font-mono font-medium text-sm">{discount.code}</td>
                        <td className="p-4 text-sm">
                          {discount.type === "percentage" ? `${discount.value}%` : `$${discount.value}`}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">${discount.minOrder}</td>
                        <td className="p-4 text-sm text-muted-foreground">{discount.uses}/{discount.maxUses}</td>
                        <td className="p-4 text-sm text-muted-foreground">{discount.expires}</td>
                        <td className="p-4">
                          <Badge 
                            variant={discount.status === "active" ? "default" : "secondary"} 
                            className="text-xs font-normal"
                          >
                            {discount.status}
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

        {/* Sidebar - Hidden on mobile */}
        <div className="hidden lg:block space-y-6">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Top Performing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {discounts.filter(d => d.status === "active").slice(0, 3).map((discount) => (
                <div key={discount.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-mono text-sm font-medium">{discount.code}</p>
                    <p className="text-xs text-muted-foreground">{discount.uses} uses</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {discount.type === "percentage" ? `${discount.value}%` : `$${discount.value}`}
                  </Badge>
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
                <Plus className="mr-2 h-4 w-4" />
                Create New Code
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Tag className="mr-2 h-4 w-4" />
                Bulk Import
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Percent className="mr-2 h-4 w-4" />
                Analytics
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-muted/30">
            <CardContent className="p-4">
              <h4 className="font-medium text-sm mb-2">Pro Tip</h4>
              <p className="text-xs text-muted-foreground">
                Set expiration dates on your discount codes to create urgency and drive conversions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
