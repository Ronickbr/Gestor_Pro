
import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import QuotesList from './pages/QuotesList';
import NewQuoteSelection from './pages/NewQuoteSelection';
import NewQuoteForm from './pages/NewQuoteForm';
import QuoteSummary from './pages/QuoteSummary';
import ContractReview from './pages/ContractReview';
import SignaturePage from './pages/SignaturePage';
import Settings from './pages/Settings';
import ClientsList from './pages/ClientsList';
import NewClient from './pages/NewClient';
import ContractTemplates from './pages/ContractTemplates';
import TechSignature from './pages/TechSignature';
import Login from './pages/Login';
import Subscription from './pages/Subscription';
import PublicQuoteView from './pages/PublicQuoteView';
import LandingPage from './pages/LandingPage';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import { supabase } from './lib/supabase';
import { Sidebar } from './components/Sidebar';
import { Toaster } from 'react-hot-toast';
import { DialogProvider } from './contexts/DialogContext';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { path: '/', label: 'Início', icon: 'home' },
    { path: '/quotes', label: 'Orçamentos', icon: 'request_quote' },
    { path: '/plus', label: '', icon: 'add', isFab: true },
    { path: '/clients', label: 'Clientes', icon: 'group' },
    { path: '/settings', label: 'Ajustes', icon: 'settings' }
  ];

  // Don't show nav on login page
  if (['/login', '/subscription', '/landing', '/terms', '/privacy', '/contact'].includes(location.pathname) || location.pathname.startsWith('/v/')) return null;

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full bg-white dark:bg-surface-dark border-t border-slate-200 dark:border-white/5 pb-6 pt-2 px-6 shadow-lg no-print md:hidden">
      <div className="flex items-center justify-between">
        {tabs.map((tab) => {
          if (tab.isFab) {
            return (
              <div key="fab" className="relative -top-6">
                <button
                  onClick={() => navigate('/new-quote')}
                  className="flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-xl shadow-primary/30 active:scale-95 transition-transform"
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
              className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-slate-400'}`}
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
  const [authorized, setAuthorized] = React.useState<string | boolean | null>(null);
  const location = useLocation();

  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setAuthorized(false);
        return;
      }

      // Check trial status
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('subscription_status, trial_ends_at')
          .eq('id', session.user.id)
          .single();

        if (!error && data) {
          const isExpired = data.subscription_status === 'expired' ||
            (data.trial_ends_at && new Date(data.trial_ends_at) < new Date() && data.subscription_status !== 'active');

          if (isExpired && location.pathname !== '/subscription') {
            // Redirect to subscription if expired
            setAuthorized('expired');
            return;
          }
        }
      } catch (e) {
        console.error("Auth check failed", e);
      }

      setAuthorized(true);
    };
    checkAuth();
  }, [location.pathname]);

  if (authorized === null) return <div className="h-screen flex items-center justify-center animate-pulse">Carregando...</div>;
  if (authorized === 'expired') return <Navigate to="/subscription" replace />;
  return authorized ? <>{children}</> : <Navigate to="/login" replace />;
};


const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const hiddenRoutes = ['/login', '/subscription', '/landing', '/v/', '/terms', '/privacy', '/contact'];
  const isFullWidth = hiddenRoutes.some(route => location.pathname.startsWith(route));

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      {!isFullWidth && <Sidebar />}
      <div className={`flex-1 w-full transition-all duration-300 ${!isFullWidth ? 'md:pl-64 pb-20 md:pb-0' : ''}`}>
        {children}
        {!isFullWidth && <ConditionalBottomNav />}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <DialogProvider>
        <AppLayout>
          <Routes>
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/v/:token" element={<PublicQuoteView />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
        <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      </DialogProvider>
    </HashRouter>
  );
};

const ConditionalBottomNav = () => {
  const location = useLocation();
  const hiddenRoutes = ['/new-quote/form', '/signature', '/edit-quote', '/new-client', '/tech-signature', '/contract/'];
  const shouldHide = hiddenRoutes.some(route => location.pathname.startsWith(route));
  return shouldHide ? null : <BottomNav />;
};

export default App;
