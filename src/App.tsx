import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "@/contexts/StoreContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageLoader } from "@/components/ui/page-loader";
import {
  GuestRoute,
  ProtectedRoute,
} from "@/components/auth/RouteGuards";

// Lazy load pages for better initial bundle size
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/auth/Login"));
const Onboarding = lazy(() => import("./pages/auth/Onboarding"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

// Orders
const OrdersPage = lazy(() => import("./pages/orders/OrdersPage"));
const TransactionsPage = lazy(() => import("./pages/orders/TransactionsPage"));
const RegistersPage = lazy(() => import("./pages/orders/RegistersPage"));
const AccountBalancingPage = lazy(() => import("./pages/orders/AccountBalancingPage"));

// Stocks
const ProductsPage = lazy(() => import("./pages/stocks/ProductsPage"));
const CategoriesPage = lazy(() => import("./pages/stocks/CategoriesPage"));
const IngredientsPage = lazy(() => import("./pages/stocks/IngredientsPage"));
const AddOnsPage = lazy(() => import("./pages/stocks/AddOnsPage"));
const CombosPage = lazy(() => import("./pages/stocks/CombosPage"));

// Procurement
const InventoriesPage = lazy(() => import("./pages/procurement/InventoriesPage"));
const StockTransferPage = lazy(() => import("./pages/procurement/StockTransferPage"));
const LocationsPage = lazy(() => import("./pages/procurement/LocationsPage"));
const ProcurementEquipmentPage = lazy(() => import("./pages/procurement/EquipmentPage"));

// Suppliers
const SuppliersPage = lazy(() => import("./pages/suppliers/SuppliersPage"));

// Customers
const CustomersPage = lazy(() => import("./pages/customers/CustomersPage"));

// Marketing
const DiscountCodesPage = lazy(() => import("./pages/marketing/DiscountCodesPage"));
const LoyaltyPage = lazy(() => import("./pages/marketing/LoyaltyPage"));
const ReferralsPage = lazy(() => import("./pages/marketing/ReferralsPage"));

// HR
const StaffPage = lazy(() => import("./pages/hr/StaffPage"));
const ShiftsPage = lazy(() => import("./pages/hr/ShiftsPage"));
const PayslipsPage = lazy(() => import("./pages/hr/PayslipsPage"));
const RolesPage = lazy(() => import("./pages/hr/RolesPage"));

// Bookings
const BookingsPage = lazy(() => import("./pages/bookings/BookingsPage"));
const ReservationsPage = lazy(() => import("./pages/bookings/ReservationsPage"));
const EventsPage = lazy(() => import("./pages/bookings/EventsPage"));
const CalendarPage = lazy(() => import("./pages/bookings/CalendarPage"));

// Payouts
const PayoutsPage = lazy(() => import("./pages/payouts/PayoutsPage"));

// Reports
const ReportsPage = lazy(() => import("./pages/reports/ReportsPage"));
const DownloadReportsPage = lazy(() => import("./pages/reports/DownloadReportsPage"));
const BestSellersPage = lazy(() => import("./pages/reports/BestSellersPage"));
const DailySalesPage = lazy(() => import("./pages/reports/DailySalesPage"));
const CategoryReportPage = lazy(() => import("./pages/reports/CategoryReportPage"));
const StockReportPage = lazy(() => import("./pages/reports/StockReportPage"));

// Storefront
const StorefrontPage = lazy(() => import("./pages/storefront/StorefrontPage"));
const ThemePage = lazy(() => import("./pages/storefront/ThemePage"));
const PagesPage = lazy(() => import("./pages/storefront/PagesPage"));
const FeatureBannersPage = lazy(() => import("./pages/storefront/FeatureBannersPage"));
const StorefrontSettingsPage = lazy(() => import("./pages/storefront/StorefrontSettingsPage"));

// Operations
const OperationsPage = lazy(() => import("./pages/operations/OperationsPage"));
const EquipmentPage = lazy(() => import("./pages/operations/EquipmentPage"));
const ChecklistsPage = lazy(() => import("./pages/operations/ChecklistsPage"));
const KpiPage = lazy(() => import("./pages/operations/KpiPage"));
const ExpensesPage = lazy(() => import("./pages/operations/ExpensesPage"));
const FoodCostPage = lazy(() => import("./pages/operations/FoodCostPage"));
const WastePage = lazy(() => import("./pages/operations/WastePage"));
const TablesPage = lazy(() => import("./pages/operations/TablesPage"));

// Workstation
const WorkstationPage = lazy(() => import("./pages/workstation/WorkstationPage"));
const DeliveryPage = lazy(() => import("./pages/workstation/DeliveryPage"));
const UsersPage = lazy(() => import("./pages/workstation/UsersPage"));
const WorkstationShiftsPage = lazy(() => import("./pages/workstation/WorkstationShiftsPage"));
const ActivityPage = lazy(() => import("./pages/workstation/ActivityPage"));
const WorkstationSettingsPage = lazy(() => import("./pages/workstation/WorkstationSettingsPage"));

// Plugins
const PluginsPage = lazy(() => import("./pages/plugins/PluginsPage"));
const OmnichannelPage = lazy(() => import("./pages/plugins/OmnichannelPage"));
const IntegrationsPage = lazy(() => import("./pages/plugins/IntegrationsPage"));

// Settings
const SettingsPage = lazy(() => import("./pages/settings/SettingsPage"));

// Optimized QueryClient with sensible defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <StoreProvider>
            <Toaster />
            <Sonner />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />

                {/* Auth screens — redirect to /dashboard if already signed in. */}
                <Route element={<GuestRoute />}>
                  <Route path="/auth/login" element={<Login />} />
                  <Route path="/auth/onboarding" element={<Onboarding />} />
                  <Route
                    path="/auth/forgot-password"
                    element={<ForgotPassword />}
                  />
                </Route>

                {/* Everything inside DashboardLayout requires auth. */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Orders */}
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/transactions" element={<TransactionsPage />} />
                <Route path="/orders/registers" element={<RegistersPage />} />
                <Route path="/orders/account" element={<AccountBalancingPage />} />
                
                {/* Stocks */}
                <Route path="/stocks/products" element={<ProductsPage />} />
                <Route path="/stocks/categories" element={<CategoriesPage />} />
                <Route path="/stocks/ingredients" element={<IngredientsPage />} />
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
                <Route path="/storefront/banners" element={<FeatureBannersPage />} />
                <Route path="/storefront/settings" element={<StorefrontSettingsPage />} />
                
                {/* Operations */}
                <Route path="/operations" element={<OperationsPage />} />
                <Route path="/operations/equipment" element={<EquipmentPage />} />
                <Route path="/operations/checklists" element={<ChecklistsPage />} />
                <Route path="/operations/kpi" element={<KpiPage />} />
                <Route path="/operations/expenses" element={<ExpensesPage />} />
                <Route path="/operations/food-cost" element={<FoodCostPage />} />
                <Route path="/operations/waste" element={<WastePage />} />
                <Route path="/operations/tables" element={<TablesPage />} />
                
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
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </StoreProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
