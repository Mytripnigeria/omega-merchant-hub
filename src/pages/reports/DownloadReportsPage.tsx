import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Calendar, Filter } from "lucide-react";

const DownloadReportsPage = () => {
  const reports = [
    { name: "Monthly Sales Report", type: "PDF", size: "2.4 MB", date: "2024-01-15" },
    { name: "Inventory Summary", type: "Excel", size: "1.8 MB", date: "2024-01-14" },
    { name: "Staff Performance", type: "PDF", size: "3.1 MB", date: "2024-01-12" },
    { name: "Financial Statement", type: "PDF", size: "4.2 MB", date: "2024-01-10" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Download Reports</h1>
          <p className="text-muted-foreground">Access and download generated reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
          <Button variant="outline"><Calendar className="mr-2 h-4 w-4" /> Date Range</Button>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Available Reports</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-muted-foreground">{report.type} • {report.size} • {report.date}</p>
                  </div>
                </div>
                <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Download</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DownloadReportsPage;
