import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "@/contexts/StoreContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Onboarding from "./pages/auth/Onboarding";
import Dashboard from "./pages/Dashboard";

// Orders
import OrdersPage from "./pages/orders/OrdersPage";
import TransactionsPage from "./pages/orders/TransactionsPage";
import AccountBalancingPage from "./pages/orders/AccountBalancingPage";

// Stocks
import ProductsPage from "./pages/stocks/ProductsPage";
import CategoriesPage from "./pages/stocks/CategoriesPage";
import IngredientsPage from "./pages/stocks/IngredientsPage";
import VariationsPage from "./pages/stocks/VariationsPage";
import AddOnsPage from "./pages/stocks/AddOnsPage";
import CombosPage from "./pages/stocks/CombosPage";

// Procurement
import InventoriesPage from "./pages/procurement/InventoriesPage";
import StockTransferPage from "./pages/procurement/StockTransferPage";
import LocationsPage from "./pages/procurement/LocationsPage";
import ProcurementEquipmentPage from "./pages/procurement/EquipmentPage";

// Suppliers
import SuppliersPage from "./pages/suppliers/SuppliersPage";

// Customers
import CustomersPage from "./pages/customers/CustomersPage";

// Marketing
import DiscountCodesPage from "./pages/marketing/DiscountCodesPage";
import LoyaltyPage from "./pages/marketing/LoyaltyPage";
import ReferralsPage from "./pages/marketing/ReferralsPage";

// HR
import StaffPage from "./pages/hr/StaffPage";
import ShiftsPage from "./pages/hr/ShiftsPage";
import PayslipsPage from "./pages/hr/PayslipsPage";
import RolesPage from "./pages/hr/RolesPage";

// Bookings
import BookingsPage from "./pages/bookings/BookingsPage";
import ReservationsPage from "./pages/bookings/ReservationsPage";
import EventsPage from "./pages/bookings/EventsPage";
import CalendarPage from "./pages/bookings/CalendarPage";

// Payouts
import PayoutsPage from "./pages/payouts/PayoutsPage";

// Reports
import ReportsPage from "./pages/reports/ReportsPage";
import DownloadReportsPage from "./pages/reports/DownloadReportsPage";
import BestSellersPage from "./pages/reports/BestSellersPage";
import DailySalesPage from "./pages/reports/DailySalesPage";
import CategoryReportPage from "./pages/reports/CategoryReportPage";
import StockReportPage from "./pages/reports/StockReportPage";

// Storefront
import StorefrontPage from "./pages/storefront/StorefrontPage";
import ThemePage from "./pages/storefront/ThemePage";
import PagesPage from "./pages/storefront/PagesPage";
import StorefrontSettingsPage from "./pages/storefront/StorefrontSettingsPage";

// Operations
import OperationsPage from "./pages/operations/OperationsPage";
import EquipmentPage from "./pages/operations/EquipmentPage";
import ChecklistsPage from "./pages/operations/ChecklistsPage";
import KpiPage from "./pages/operations/KpiPage";
import ExpensesPage from "./pages/operations/ExpensesPage";
import SalesTargetPage from "./pages/operations/SalesTargetPage";
import FoodCostPage from "./pages/operations/FoodCostPage";
import WastePage from "./pages/operations/WastePage";

// Workstation
import WorkstationPage from "./pages/workstation/WorkstationPage";
import DeliveryPage from "./pages/workstation/DeliveryPage";
import UsersPage from "./pages/workstation/UsersPage";
import WorkstationShiftsPage from "./pages/workstation/WorkstationShiftsPage";
import ActivityPage from "./pages/workstation/ActivityPage";
import WorkstationSettingsPage from "./pages/workstation/WorkstationSettingsPage";

// Plugins
import PluginsPage from "./pages/plugins/PluginsPage";
import OmnichannelPage from "./pages/plugins/OmnichannelPage";
import IntegrationsPage from "./pages/plugins/IntegrationsPage";

// Settings
import SettingsPage from "./pages/settings/SettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <StoreProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/onboarding" element={<Onboarding />} />
            
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Orders */}
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/transactions" element={<TransactionsPage />} />
              <Route path="/orders/account" element={<AccountBalancingPage />} />
              
              {/* Stocks */}
              <Route path="/stocks/products" element={<ProductsPage />} />
              <Route path="/stocks/categories" element={<CategoriesPage />} />
              <Route path="/stocks/ingredients" element={<IngredientsPage />} />
              <Route path="/stocks/variations" element={<VariationsPage />} />
              <Route path="/stocks/addons" element={<AddOnsPage />} />
              <Route path="/stocks/combos" element={<CombosPage />} />
              
              {/* Procurement */}
              <Route path="/procurement/inventories" element={<InventoriesPage />} />
              <Route path="/procurement/transfers" element={<StockTransferPage />} />
              <Route path="/procurement/locations" element={<LocationsPage />} />
              <Route path="/procurement/equipment" element={<ProcurementEquipmentPage />} />
              
              {/* Suppliers */}
              <Route path="/suppliers" element={<SuppliersPage />} />
              
              {/* Customers */}
              <Route path="/customers" element={<CustomersPage />} />
              
              {/* Marketing */}
              <Route path="/marketing/discounts" element={<DiscountCodesPage />} />
              <Route path="/marketing/loyalty" element={<LoyaltyPage />} />
              <Route path="/marketing/referrals" element={<ReferralsPage />} />
              
              {/* HR */}
              <Route path="/hr/staff" element={<StaffPage />} />
              <Route path="/hr/shifts" element={<ShiftsPage />} />
              <Route path="/hr/payslips" element={<PayslipsPage />} />
              <Route path="/hr/roles" element={<RolesPage />} />
              
              {/* Reports */}
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/reports/download" element={<DownloadReportsPage />} />
              <Route path="/reports/bestsellers" element={<BestSellersPage />} />
              <Route path="/reports/daily-sales" element={<DailySalesPage />} />
              <Route path="/reports/category" element={<CategoryReportPage />} />
              <Route path="/reports/stock" element={<StockReportPage />} />
              
              {/* Bookings */}
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/bookings/reservations" element={<ReservationsPage />} />
              <Route path="/bookings/events" element={<EventsPage />} />
              <Route path="/bookings/calendar" element={<CalendarPage />} />
              
              {/* Payouts */}
              <Route path="/payouts" element={<PayoutsPage />} />
              
              {/* Storefront */}
              <Route path="/storefront" element={<StorefrontPage />} />
              <Route path="/storefront/theme" element={<ThemePage />} />
              <Route path="/storefront/pages" element={<PagesPage />} />
              <Route path="/storefront/settings" element={<StorefrontSettingsPage />} />
              
              {/* Operations */}
              <Route path="/operations" element={<OperationsPage />} />
              <Route path="/operations/equipment" element={<EquipmentPage />} />
              <Route path="/operations/checklists" element={<ChecklistsPage />} />
              <Route path="/operations/kpi" element={<KpiPage />} />
              <Route path="/operations/expenses" element={<ExpensesPage />} />
              <Route path="/operations/sales-target" element={<SalesTargetPage />} />
              <Route path="/operations/food-cost" element={<FoodCostPage />} />
              <Route path="/operations/waste" element={<WastePage />} />
              
              {/* Workstation */}
              <Route path="/workstation" element={<WorkstationPage />} />
              <Route path="/workstation/delivery" element={<DeliveryPage />} />
              <Route path="/workstation/users" element={<UsersPage />} />
              <Route path="/workstation/shifts" element={<WorkstationShiftsPage />} />
              <Route path="/workstation/activity" element={<ActivityPage />} />
              <Route path="/workstation/settings" element={<WorkstationSettingsPage />} />
              
              {/* Plugins */}
              <Route path="/plugins" element={<PluginsPage />} />
              <Route path="/plugins/omnichannel" element={<OmnichannelPage />} />
              <Route path="/plugins/integrations" element={<IntegrationsPage />} />
              
              {/* Settings */}
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </StoreProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
