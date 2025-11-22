import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

// Pages
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductNew from "./pages/ProductNew";
import ProductDetail from "./pages/ProductDetail";
import Receipts from "./pages/operations/Receipts";
import ReceiptNew from "./pages/operations/ReceiptNew";
import ReceiptDetail from "./pages/operations/ReceiptDetail";
import Deliveries from "./pages/operations/Deliveries";
import DeliveryDetail from "./pages/operations/DeliveryDetail";
import Transfers from "./pages/operations/Transfers";
import TransferNew from "./pages/operations/TransferNew";
import TransferDetail from "./pages/operations/TransferDetail";
import Adjustments from "./pages/operations/Adjustments";
import AdjustmentNew from "./pages/operations/AdjustmentNew";
import AdjustmentDetail from "./pages/operations/AdjustmentDetail";
import Ledger from "./pages/operations/Ledger";
import Warehouses from "./pages/settings/Warehouses";
import WarehouseDetail from "./pages/settings/WarehouseDetail";
import Categories from "./pages/settings/Categories";
import UOM from "./pages/settings/UOM";
import Users from "./pages/settings/Users";
import NotFound from "./pages/NotFound";

// Stores - Initialize data on mount
import { useProductsStore } from "./store/productsStore";
import { useOperationsStore } from "./store/operationsStore";
import { useWarehousesStore } from "./store/warehousesStore";
import { useAuthStore } from "./store/authStore";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/sign-in" />;
};

// Component to initialize stores and seed data
const StoreInitializer = () => {
  const fetchProducts = useProductsStore((state) => state.fetchProducts);
  const fetchReceipts = useOperationsStore((state) => state.fetchReceipts);
  const fetchDeliveries = useOperationsStore((state) => state.fetchDeliveries);
  const fetchTransfers = useOperationsStore((state) => state.fetchTransfers);
  const fetchAdjustments = useOperationsStore((state) => state.fetchAdjustments);
  const fetchStockMoves = useOperationsStore((state) => state.fetchStockMoves);
  const fetchWarehouses = useWarehousesStore((state) => state.fetchWarehouses);
  const fetchCategories = useWarehousesStore((state) => state.fetchCategories);
  const fetchUOMs = useWarehousesStore((state) => state.fetchUOMs);

  useEffect(() => {
    // Initialize all stores
    fetchProducts();
    fetchReceipts();
    fetchDeliveries();
    fetchTransfers();
    fetchAdjustments();
    fetchStockMoves();
    fetchWarehouses();
    fetchCategories();
    fetchUOMs();
  }, []);

  return null;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <StoreInitializer />
          <Routes>
            <Route
              path="/"
              element={
                <Navigate to="/dashboard" replace />
              }
            />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/new"
              element={
                <ProtectedRoute>
                  <ProductNew />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/:id"
              element={
                <ProtectedRoute>
                  <ProductDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/operations/receipts"
              element={
                <ProtectedRoute>
                  <Receipts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/operations/receipts/new"
              element={
                <ProtectedRoute>
                  <ReceiptNew />
                </ProtectedRoute>
              }
            />
            <Route
              path="/operations/receipts/:id"
              element={
                <ProtectedRoute>
                  <ReceiptDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/operations/deliveries"
              element={
                <ProtectedRoute>
                  <Deliveries />
                </ProtectedRoute>
              }
            />
            <Route
              path="/operations/deliveries/:id"
              element={
                <ProtectedRoute>
                  <DeliveryDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/operations/transfers"
              element={
                <ProtectedRoute>
                  <Transfers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/operations/transfers/new"
              element={
                <ProtectedRoute>
                  <TransferNew />
                </ProtectedRoute>
              }
            />
            <Route
              path="/operations/transfers/:id"
              element={
                <ProtectedRoute>
                  <TransferDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/operations/adjustments"
              element={
                <ProtectedRoute>
                  <Adjustments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/operations/adjustments/new"
              element={
                <ProtectedRoute>
                  <AdjustmentNew />
                </ProtectedRoute>
              }
            />
            <Route
              path="/operations/adjustments/:id"
              element={
                <ProtectedRoute>
                  <AdjustmentDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/operations/ledger"
              element={
                <ProtectedRoute>
                  <Ledger />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/warehouses"
              element={
                <ProtectedRoute>
                  <Warehouses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/warehouses/:id"
              element={
                <ProtectedRoute>
                  <WarehouseDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/categories"
              element={
                <ProtectedRoute>
                  <Categories />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/uom"
              element={
                <ProtectedRoute>
                  <UOM />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/users"
              element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
