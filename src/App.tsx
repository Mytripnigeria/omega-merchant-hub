import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import OrdersPage from "./pages/orders/OrdersPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          
          {/* Dashboard routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<OrdersPage />} />
            
            {/* Placeholder routes for navigation */}
            <Route path="/orders/transactions" element={<PlaceholderPage title="Transactions" />} />
            <Route path="/orders/account" element={<PlaceholderPage title="Account Balancing" />} />
            <Route path="/stocks/*" element={<PlaceholderPage title="Stocks" />} />
            <Route path="/procurement/*" element={<PlaceholderPage title="Procurement" />} />
            <Route path="/suppliers" element={<PlaceholderPage title="Suppliers" />} />
            <Route path="/customers" element={<PlaceholderPage title="Customers" />} />
            <Route path="/marketing/*" element={<PlaceholderPage title="Marketing" />} />
            <Route path="/operations/*" element={<PlaceholderPage title="Operations" />} />
            <Route path="/hr/*" element={<PlaceholderPage title="HR" />} />
            <Route path="/reports/*" element={<PlaceholderPage title="Reports" />} />
            <Route path="/bookings/*" element={<PlaceholderPage title="Bookings" />} />
            <Route path="/payouts" element={<PlaceholderPage title="Payouts" />} />
            <Route path="/storefront/*" element={<PlaceholderPage title="Storefront" />} />
            <Route path="/plugins/*" element={<PlaceholderPage title="Plugins" />} />
            <Route path="/workstation/*" element={<PlaceholderPage title="Workstation" />} />
            <Route path="/settings/*" element={<PlaceholderPage title="Settings" />} />
          </Route>
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Placeholder component for unbuilt pages
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <span className="text-3xl">🚧</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground max-w-md">
          This section is under development. Check back soon for full functionality.
        </p>
      </div>
    </div>
  );
}

export default App;
