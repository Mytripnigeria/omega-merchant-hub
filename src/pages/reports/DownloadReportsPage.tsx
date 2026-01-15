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
    { label: "Total Reports", value: reports.length.toString(), icon: FileText },
    { label: "This Month", value: "4", icon: Calendar },
    { label: "Total Size", value: "15.8 MB", icon: Download },
  ];

  const filteredReports = reports.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) &&
    (typeFilter === "all" || r.type === typeFilter)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Download Reports</h1>
          <p className="text-sm text-muted-foreground">Access and download generated reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Date Range
          </Button>
          <Button size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Generate
          </Button>
        </div>
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
                placeholder="Search reports..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="pl-9 h-9 bg-muted/50 border-0" 
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[120px] h-9 bg-muted/50 border-0">
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

          {/* Reports List */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Available Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredReports.map((report, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                      report.type === "PDF" 
                        ? "bg-red-100 dark:bg-red-900/20" 
                        : "bg-green-100 dark:bg-green-900/20"
                    }`}>
                      {report.type === "PDF" ? (
                        <File className="h-4 w-4 text-red-600 dark:text-red-400" />
                      ) : (
                        <FileSpreadsheet className="h-4 w-4 text-green-600 dark:text-green-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{report.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {report.category} • {report.size} • {report.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs hidden sm:flex">{report.type}</Badge>
                    <Button variant="outline" size="sm" className="h-8">
                      <Download className="h-3 w-3 sm:mr-2" />
                      <span className="hidden sm:inline">Download</span>
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">By Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {["Sales", "Inventory", "HR", "Finance", "Customers"].map((cat) => (
                <div key={cat} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                  <span className="text-sm">{cat}</span>
                  <Badge variant="secondary" className="text-xs">
                    {reports.filter(r => r.category === cat).length}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Quick Generate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Sales Report
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Inventory Export
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <File className="mr-2 h-4 w-4" />
                Staff Report
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-muted/30">
            <CardContent className="p-4">
              <h4 className="font-medium text-sm mb-2">Scheduled Reports</h4>
              <p className="text-xs text-muted-foreground">
                Set up automatic report generation and delivery to your email.
              </p>
              <Button size="sm" variant="outline" className="mt-3 w-full">
                Configure
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
