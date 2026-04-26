
import React, { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Sidebar } from './components/Sidebar';
import { Toaster } from 'react-hot-toast';
import { DialogProvider } from './contexts/DialogContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './hooks/useAuth';
import { BOTTOM_NAV_ITEMS, isFullWidthRoute, shouldHideNav } from './lib/navigation';
import { PwaUpdatePrompt } from './components/PwaUpdatePrompt';

// Lazy loading pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const QuotesList = lazy(() => import('./pages/QuotesList'));
const NewQuoteSelection = lazy(() => import('./pages/NewQuoteSelection'));
const NewQuoteForm = lazy(() => import('./pages/NewQuoteForm'));
const QuoteSummary = lazy(() => import('./pages/QuoteSummary'));
const ContractReview = lazy(() => import('./pages/ContractReview'));
const SignaturePage = lazy(() => import('./pages/SignaturePage'));
const Settings = lazy(() => import('./pages/Settings'));
const ClientsList = lazy(() => import('./pages/ClientsList'));
const NewClient = lazy(() => import('./pages/NewClient'));
const ContractTemplates = lazy(() => import('./pages/ContractTemplates'));
const TechSignature = lazy(() => import('./pages/TechSignature'));
const Login = lazy(() => import('./pages/Login'));
const Subscription = lazy(() => import('./pages/Subscription'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const PublicQuoteView = lazy(() => import('./pages/PublicQuoteView'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Contact = lazy(() => import('./pages/Contact'));
const UpdatePassword = lazy(() => import('./pages/UpdatePassword'));
const Feedback = lazy(() => import('./pages/Feedback'));
const Products = lazy(() => import('./pages/Products'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Don't show nav on login page
  if (shouldHideNav(location.pathname)) return null;

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full glass shadow-lg no-print md:hidden pb-6 pt-2 px-6">
      <div className="flex items-center justify-between">
        {BOTTOM_NAV_ITEMS.map((tab) => {
          if (tab.isFab) {
            return (
              <div key="fab" className="relative -top-6">
                <button
                  onClick={() => navigate(tab.path)}
                  className="flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-xl shadow-primary/30 active:scale-95 transition-transform"
                  aria-label="Novo orçamento"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>{tab.icon}</span>
                </button>
              </div>
            );
          }
          const isActive = location.pathname === tab.path;

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-1 transition-colors focus-ring rounded-lg px-2 py-1 ${isActive ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className={`material-symbols-outlined ${isActive ? 'filled' : ''}`}>{tab.icon}</span>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { status, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="h-screen flex items-center justify-center animate-pulse">Carregando...</div>;
  }

  if (status === 'expired' && location.pathname !== '/subscription' && location.pathname !== '/payment-success') {
    return <Navigate to="/subscription" replace />;
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};


const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        navigate('/update-password');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  React.useEffect(() => {
    const w = window as any;
    const iOSStandalone = typeof w.navigator?.standalone === 'boolean' ? w.navigator.standalone : false;
    const displayStandalone = window.matchMedia?.('(display-mode: standalone)').matches ?? false;
    const displayFullscreen = window.matchMedia?.('(display-mode: fullscreen)').matches ?? false;
    const displayMinimal = window.matchMedia?.('(display-mode: minimal-ui)').matches ?? false;
    const isStandalone = Boolean(iOSStandalone || displayStandalone || displayFullscreen || displayMinimal);

    if (isStandalone && (location.pathname === '/' || location.pathname === '/landing')) {
      navigate('/login', { replace: true });
    }
  }, [location.pathname, navigate]);
  const isFullWidth = location.pathname === '/' || isFullWidthRoute(location.pathname);

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      {!isFullWidth && <Sidebar />}
      <div className={`flex-1 w-full transition-all duration-300 ${!isFullWidth ? 'md:pl-64 pb-20 md:pb-0' : ''}`}>
        {children}
        <PwaUpdatePrompt />
        {!isFullWidth && <ConditionalBottomNav />}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <DialogProvider>
          <AppLayout>
            <Suspense fallback={<div className="h-screen flex items-center justify-center animate-pulse text-primary font-medium">Carregando...</div>}>
              <Routes>
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/update-password" element={<UpdatePassword />} />
                <Route path="/v/:token" element={<PublicQuoteView />} />
                <Route path="/" element={<Navigate to="/landing" replace />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/quotes" element={<PrivateRoute><QuotesList /></PrivateRoute>} />
                <Route path="/clients" element={<PrivateRoute><ClientsList /></PrivateRoute>} />
                <Route path="/new-client" element={<PrivateRoute><NewClient /></PrivateRoute>} />
                <Route path="/edit-client/:id" element={<PrivateRoute><NewClient /></PrivateRoute>} />
                <Route path="/new-quote" element={<PrivateRoute><NewQuoteSelection /></PrivateRoute>} />
                <Route path="/new-quote/form" element={<PrivateRoute><NewQuoteForm /></PrivateRoute>} />
                <Route path="/edit-quote/:id" element={<PrivateRoute><NewQuoteForm /></PrivateRoute>} />
                <Route path="/quote/:id" element={<PrivateRoute><QuoteSummary /></PrivateRoute>} />
                <Route path="/contract/:id" element={<PrivateRoute><ContractReview /></PrivateRoute>} />
                <Route path="/signature/:id" element={<PrivateRoute><SignaturePage /></PrivateRoute>} />
                <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
                <Route path="/contract-templates" element={<PrivateRoute><ContractTemplates /></PrivateRoute>} />
                <Route path="/tech-signature" element={<PrivateRoute><TechSignature /></PrivateRoute>} />
                <Route path="/subscription" element={<PrivateRoute><Subscription /></PrivateRoute>} />
                <Route path="/payment-success" element={<PrivateRoute><PaymentSuccess /></PrivateRoute>} />
                <Route path="/feedback" element={<PrivateRoute><Feedback /></PrivateRoute>} />
                <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </AppLayout>
        <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      </DialogProvider>
    </HashRouter>
  </QueryClientProvider>
  );
};

const ConditionalBottomNav = () => {
  const location = useLocation();
  const hiddenRoutes = ['/new-quote/form', '/signature', '/edit-quote', '/new-client', '/tech-signature', '/contract/'];
  const shouldHide = hiddenRoutes.some(route => location.pathname.startsWith(route));
  return shouldHide ? null : <BottomNav />;
};

export default App;
