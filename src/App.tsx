
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigationType } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { useEffect, lazy, Suspense } from "react";
import BreadcrumbNav from "./components/BreadcrumbNav";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const CheckAvailability = lazy(() => import("./pages/CheckAvailability"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Payment = lazy(() => import("./pages/Payment"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const HowItWorksPage = lazy(() => import("./pages/HowItWorksPage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const AboutUsPage = lazy(() => import("./pages/AboutUsPage"));
const InvestorLeadsPage = lazy(() => import("./pages/InvestorLeadsPage"));
const RealtorLeadsPage = lazy(() => import("./pages/RealtorLeadsPage"));
const AddTerritory = lazy(() => import("./pages/AddTerritory"));

// Scroll restoration component
const ScrollToTop = () => {
  const { pathname, state } = useLocation();
  const navigationType = useNavigationType();
  
  useEffect(() => {
    // Scroll to top on page navigation
    if (state?.scrollToTop || navigationType === 'PUSH') {
      window.scrollTo(0, 0);
    }
  }, [pathname, state, navigationType]);
  
  return null;
};

// Create a loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="w-8 h-8 border-4 border-accent-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Configure React Query with performance settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      cacheTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <BreadcrumbNav />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/check-availability" element={<CheckAvailability />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/investor-leads" element={<InvestorLeadsPage />} />
              <Route path="/realtor-leads" element={<RealtorLeadsPage />} />
              <Route path="/add-territory" element={<AddTerritory />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
