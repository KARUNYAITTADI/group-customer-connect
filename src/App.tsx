
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Customers from "./pages/customers/Customers";
import CustomerGroups from "./pages/customers/CustomerGroups";
import Dashboard from "./pages/Dashboard";
import POS from "./pages/POS";
import Orders from "./pages/Orders";
import Reservations from "./pages/Reservations";
import Catalog from "./pages/Catalog";
import Inventory from "./pages/Inventory";
import PurchaseOrder from "./pages/PurchaseOrder";
import BusinessSettings from "./pages/BusinessSettings";
import Analytics from "./pages/Analytics";
import Marketing from "./pages/Marketing";
import StaffManagement from "./pages/resources/StaffManagement";
import RolesPermissions from "./pages/resources/RolesPermissions";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pos" element={<POS />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/purchase" element={<PurchaseOrder />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customer-groups" element={<CustomerGroups />} />
          <Route path="/marketing" element={<Marketing />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/resources/staff" element={<StaffManagement />} />
          <Route path="/resources/roles" element={<RolesPermissions />} />
          <Route path="/business-settings" element={<BusinessSettings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
