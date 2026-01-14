import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText, Calendar, Search, Filter, File, FileSpreadsheet } from "lucide-react";

export default function DownloadReportsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const reports = [
    { name: "Monthly Sales Report", type: "PDF", size: "2.4 MB", date: "2026-01-15", category: "Sales" },
    { name: "Inventory Summary", type: "Excel", size: "1.8 MB", date: "2026-01-14", category: "Inventory" },
    { name: "Staff Performance", type: "PDF", size: "3.1 MB", date: "2026-01-12", category: "HR" },
    { name: "Financial Statement", type: "PDF", size: "4.2 MB", date: "2026-01-10", category: "Finance" },
    { name: "Customer Analytics", type: "Excel", size: "2.8 MB", date: "2026-01-08", category: "Customers" },
    { name: "Product Performance", type: "PDF", size: "1.5 MB", date: "2026-01-05", category: "Sales" },
  ];

  const stats = [
    { label: "Total Reports", value: reports.length.toString() },
    { label: "This Month", value: "4" },
    { label: "Total Size", value: "15.8 MB" },
  ];

  const filteredReports = reports.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) &&
    (typeFilter === "all" || r.type === typeFilter)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Download Reports</h1>
          <p className="text-muted-foreground">Access and download generated reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Date Range
          </Button>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search reports..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="pl-10" 
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[140px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="PDF">PDF</SelectItem>
            <SelectItem value="Excel">Excel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredReports.map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg transition-colors hover:bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${report.type === "PDF" ? "bg-red-100 dark:bg-red-900/20" : "bg-green-100 dark:bg-green-900/20"}`}>
                    {report.type === "PDF" ? (
                      <File className={`h-5 w-5 ${report.type === "PDF" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`} />
                    ) : (
                      <FileSpreadsheet className="h-5 w-5 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {report.category} • {report.size} • {report.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{report.type}</Badge>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
