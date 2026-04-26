export type NavItem = {
  path: string;
  label: string;
  icon: string;
};

export const NAV_HIDDEN_EXACT_ROUTES = ['/', '/login', '/subscription', '/landing', '/terms', '/privacy', '/contact'];
export const NAV_HIDDEN_PREFIXES = ['/v/'];

export const FULL_WIDTH_PREFIXES = ['/login', '/subscription', '/landing', '/v/', '/terms', '/privacy', '/contact', '/update-password'];

export const SIDEBAR_NAV_ITEMS: NavItem[] = [
  { path: '/dashboard', label: 'Início', icon: 'dashboard' },
  { path: '/quotes', label: 'Orçamentos', icon: 'request_quote' },
  { path: '/clients', label: 'Clientes', icon: 'group' },
  { path: '/products', label: 'Catálogo', icon: 'inventory_2' },
  { path: '/contract-templates', label: 'Modelos de Contrato', icon: 'description' },
  { path: '/feedback', label: 'Feedback', icon: 'rate_review' },
  { path: '/settings', label: 'Configurações', icon: 'settings' },
];

export type BottomNavItem = NavItem & { isFab?: boolean };

export const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  { path: '/dashboard', label: 'Início', icon: 'home' },
  { path: '/quotes', label: 'Orçamentos', icon: 'request_quote' },
  { path: '/new-quote', label: '', icon: 'add', isFab: true },
  { path: '/clients', label: 'Clientes', icon: 'group' },
  { path: '/settings', label: 'Ajustes', icon: 'settings' },
];

export const shouldHideNav = (pathname: string) => {
  if (NAV_HIDDEN_EXACT_ROUTES.includes(pathname)) return true;
  return NAV_HIDDEN_PREFIXES.some((p) => pathname.startsWith(p));
};

export const isFullWidthRoute = (pathname: string) => {
  return FULL_WIDTH_PREFIXES.some((p) => pathname.startsWith(p));
};

