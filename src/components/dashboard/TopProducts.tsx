import { Progress } from "@/components/ui/progress";

interface Product {
  name: string;
  sales: number;
  revenue: string;
  percentage: number;
}

const products: Product[] = [
  { name: "Signature Jollof Rice", sales: 145, revenue: "₦507,500", percentage: 100 },
  { name: "Peppered Chicken", sales: 128, revenue: "₦358,400", percentage: 88 },
  { name: "Suya Platter", sales: 97, revenue: "₦436,500", percentage: 67 },
  { name: "Egusi Soup Combo", sales: 85, revenue: "₦467,500", percentage: 59 },
  { name: "Small Chops Platter", sales: 72, revenue: "₦252,000", percentage: 50 },
];

export function TopProducts() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Top Products</h3>
        <p className="text-sm text-muted-foreground">Best sellers this week</p>
      </div>
      <div className="space-y-5">
        {products.map((product, index) => (
          <div key={product.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-foreground">{product.name}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{product.revenue}</p>
                <p className="text-xs text-muted-foreground">{product.sales} orders</p>
              </div>
            </div>
            <Progress value={product.percentage} className="h-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
