
import React, { useEffect, lazy, Suspense, useState, Component, ErrorInfo, ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigationType } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
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
const SellerLeadsPage = lazy(() => import("./pages/SellerLeadsPage"));
const AddTerritory = lazy(() => import("./pages/AddTerritory"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));

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

// Enhanced error boundary to handle module loading failures
interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
      <p className="text-gray-700 mb-6">We're sorry, but there was an error loading the page.</p>
      <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-w-full mb-6">
        {error.message}
      </pre>
      <div className="flex gap-4">
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Reload Page
        </button>
        <button 
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Custom error boundary component
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("React Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback 
        error={this.state.error as Error} 
        resetErrorBoundary={() => this.setState({ hasError: false, error: null })} 
      />;
    }

    return this.props.children;
  }
}

// Session cleanup on app initialization
const SessionCleanup = () => {
  useEffect(() => {
    // Check for stale session data
    const checkForStaleSession = async () => {
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        const { data } = await supabase.auth.getSession();
        
        // If there's a session but no valid user data, clear it
        if (data.session && !data.session.user) {
          console.log("Found stale session data, clearing...");
          await supabase.auth.signOut({ scope: 'global' });
        }
      } catch (error) {
        console.error("Session check error:", error);
      }
    };
    
    checkForStaleSession();
  }, []);
  
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
      gcTime: 5 * 60 * 1000, // 5 minutes (renamed from cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Preload critical dependencies
  useEffect(() => {
    const preloadDependencies = async () => {
      try {
        // Wait for critical modules to load
        await Promise.all([
          import('react'),
          import('react-dom'),
          import('@supabase/supabase-js')
        ]);
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to preload dependencies:", error);
        // Continue anyway after a short delay
        setTimeout(() => setIsInitialized(true), 1000);
      }
    };
    
    preloadDependencies();
  }, []);
  
  if (!isInitialized) {
    return <LoadingFallback />;
  }
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <SessionCleanup />
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
                  <Route path="/seller-leads" element={<SellerLeadsPage />} />
                  <Route path="/add-territory" element={<AddTerritory />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
