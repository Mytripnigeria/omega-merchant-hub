import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Tag, Percent, Calendar, Users } from "lucide-react";

export default function DiscountCodesPage() {
  const [search, setSearch] = useState("");

  const discounts = [
    { id: 1, code: "WELCOME20", type: "percentage", value: 20, minOrder: 50, uses: 145, maxUses: 500, expires: "2026-02-28", status: "active" },
    { id: 2, code: "FLAT10", type: "fixed", value: 10, minOrder: 30, uses: 89, maxUses: 200, expires: "2026-01-31", status: "active" },
    { id: 3, code: "SUMMER15", type: "percentage", value: 15, minOrder: 40, uses: 200, maxUses: 200, expires: "2026-01-20", status: "expired" },
    { id: 4, code: "VIP25", type: "percentage", value: 25, minOrder: 100, uses: 23, maxUses: 50, expires: "2026-03-31", status: "active" },
  ];

  const stats = [
    { label: "Active Codes", value: "12", icon: Tag },
    { label: "Total Redeemed", value: "457", icon: Users },
    { label: "Avg. Discount", value: "18%", icon: Percent },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Discount Codes</h1>
          <p className="text-muted-foreground">Create and manage promotional codes</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Create Code</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Discount Code</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Code</Label><Input placeholder="e.g., SUMMER20" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Type</Label><Input placeholder="percentage / fixed" /></div>
                <div className="space-y-2"><Label>Value</Label><Input type="number" /></div>
              </div>
              <div className="space-y-2"><Label>Min. Order Amount</Label><Input type="number" /></div>
              <div className="space-y-2"><Label>Expiry Date</Label><Input type="date" /></div>
              <Button className="w-full">Create Code</Button>
            </div>
          </DialogContent>
        </Dialog>
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
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search codes..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Min. Order</TableHead>
                <TableHead>Uses</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discounts.map((discount) => (
                <TableRow key={discount.id}>
                  <TableCell className="font-mono font-medium">{discount.code}</TableCell>
                  <TableCell>{discount.type === "percentage" ? `${discount.value}%` : `$${discount.value}`}</TableCell>
                  <TableCell>${discount.minOrder}</TableCell>
                  <TableCell>{discount.uses}/{discount.maxUses}</TableCell>
                  <TableCell>{discount.expires}</TableCell>
                  <TableCell>
                    <Badge variant={discount.status === "active" ? "default" : "secondary"}>{discount.status}</Badge>
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
