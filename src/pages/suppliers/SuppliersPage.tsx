import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Building2, Phone, Mail, DollarSign } from "lucide-react";

export default function SuppliersPage() {
  const [search, setSearch] = useState("");

  const suppliers = [
    { id: 1, name: "Fresh Farms Ltd", contact: "John Adams", phone: "+234 801 234 5678", email: "john@freshfarms.com", category: "Produce", outstanding: 1250.00, status: "active" },
    { id: 2, name: "Metro Beverages", contact: "Sarah Lee", phone: "+234 802 345 6789", email: "sarah@metro.com", category: "Beverages", outstanding: 0, status: "active" },
    { id: 3, name: "Quality Meats", contact: "Mike Brown", phone: "+234 803 456 7890", email: "mike@qualitymeats.com", category: "Meat", outstanding: 3400.00, status: "active" },
    { id: 4, name: "Bakery Supplies Co", contact: "Lisa White", phone: "+234 804 567 8901", email: "lisa@bakerysupplies.com", category: "Baking", outstanding: 800.00, status: "inactive" },
  ];

  const stats = [
    { label: "Total Suppliers", value: "24", icon: Building2 },
    { label: "Active", value: "20", icon: Building2 },
    { label: "Outstanding", value: "$5,450", icon: DollarSign },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Suppliers</h1>
          <p className="text-muted-foreground">Manage supplier relationships</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Add Supplier</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Supplier</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Company Name</Label><Input placeholder="Enter company name" /></div>
              <div className="space-y-2"><Label>Contact Person</Label><Input placeholder="Contact name" /></div>
              <div className="space-y-2"><Label>Phone</Label><Input placeholder="+234..." /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="email@company.com" /></div>
              <Button className="w-full">Add Supplier</Button>
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
            <Input placeholder="Search suppliers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Outstanding</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>
                    <div>
                      <p>{supplier.contact}</p>
                      <p className="text-xs text-muted-foreground">{supplier.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{supplier.category}</TableCell>
                  <TableCell>${supplier.outstanding.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={supplier.status === "active" ? "default" : "secondary"}>{supplier.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">View</Button>
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
