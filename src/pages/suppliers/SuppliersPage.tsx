import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MoreHorizontal, Filter, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  category: string;
  outstanding: string;
  status: "Active" | "Inactive";
}

const suppliers: Supplier[] = [
  { id: "1", name: "Fresh Farms Ltd", contact: "John Adams", email: "john@freshfarms.com", phone: "+234 801 234 5678", category: "Produce", outstanding: "₦125,000", status: "Active" },
  { id: "2", name: "Metro Beverages", contact: "Sarah Lee", email: "sarah@metro.com", phone: "+234 802 345 6789", category: "Beverages", outstanding: "₦0", status: "Active" },
  { id: "3", name: "Quality Meats", contact: "Mike Brown", email: "mike@qualitymeats.com", phone: "+234 803 456 7890", category: "Meat", outstanding: "₦340,000", status: "Active" },
  { id: "4", name: "Bakery Supplies Co", contact: "Lisa White", email: "lisa@bakerysupplies.com", phone: "+234 804 567 8901", category: "Baking", outstanding: "₦80,000", status: "Inactive" },
  { id: "5", name: "Seafood Direct", contact: "David Chen", email: "david@seafood.com", phone: "+234 805 678 9012", category: "Seafood", outstanding: "₦215,000", status: "Active" },
];

const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-gray-100 text-gray-600",
};

export default function SuppliersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Suppliers</h1>
          <p className="text-sm text-muted-foreground">
            Manage supplier relationships and orders
          </p>
        </div>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden xs:inline">Add Supplier</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-muted-foreground">Total Suppliers</p>
            <p className="text-xl sm:text-2xl font-semibold">24</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-muted-foreground">Active</p>
            <p className="text-xl sm:text-2xl font-semibold">20</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-muted-foreground">Outstanding</p>
            <p className="text-xl sm:text-2xl font-semibold text-red-600">₦760,000</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-muted-foreground">This Month</p>
            <p className="text-xl sm:text-2xl font-semibold">₦2.4M</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="icon" className="shrink-0">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Suppliers List */}
      <Card>
        <CardContent className="p-0">
          {/* Mobile Card View */}
          <div className="block sm:hidden divide-y divide-border">
            {suppliers.map((supplier) => (
              <div key={supplier.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{supplier.name}</p>
                    <p className="text-xs text-muted-foreground">{supplier.contact}</p>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={cn("text-xs font-normal shrink-0", statusColors[supplier.status])}
                  >
                    {supplier.status}
                  </Badge>
                </div>
                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{supplier.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    <span>{supplier.phone}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <Badge variant="secondary" className="text-xs font-normal">{supplier.category}</Badge>
                  <span className={cn("font-medium", supplier.outstanding !== "₦0" && "text-red-600")}>
                    {supplier.outstanding}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground p-4 pl-6 w-12">
                    <input type="checkbox" className="rounded border-border" />
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Company</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Contact</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Category</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Outstanding</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4 pr-6 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => (
                  <tr key={supplier.id} className="group cursor-pointer hover:bg-muted/50 border-b border-border last:border-0">
                    <td className="p-4 pl-6">
                      <input type="checkbox" className="rounded border-border" />
                    </td>
                    <td className="p-4">
                      <p className="font-medium">{supplier.name}</p>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{supplier.contact}</p>
                        <p className="text-sm text-muted-foreground">{supplier.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary" className="font-normal">{supplier.category}</Badge>
                    </td>
                    <td className={cn("p-4 font-medium", supplier.outstanding !== "₦0" && "text-red-600")}>
                      {supplier.outstanding}
                    </td>
                    <td className="p-4">
                      <Badge 
                        variant="secondary" 
                        className={cn("font-normal", statusColors[supplier.status])}
                      >
                        {supplier.status}
                      </Badge>
                    </td>
                    <td className="p-4 pr-6">
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

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Showing 1-5 of 24 suppliers
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
