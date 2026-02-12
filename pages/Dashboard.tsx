import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Quote, QuoteStatus, QuoteStatusLabels, UserProfile } from '../types';
import { profileService, quotesService } from '../services/database';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const loadData = async () => {
    try {
      const [quotesData, profileData] = await Promise.all([
        quotesService.fetchQuotes(),
        profileService.getProfile()
      ]);
      setQuotes(quotesData);
      setProfile(profileData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função auxiliar para converter string de data para objeto Date
  const parseDate = (dateStr?: string) => {
    if (!dateStr) return null;
    
    // Tenta formato ISO/YYYY-MM-DD
    if (dateStr.includes('-')) {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    
    // Tenta formato DD/MM/AAAA
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/').map(Number);
      return new Date(year, month - 1, day);
    }

    return new Date(dateStr);
  };

  // Cálculos de Métricas
  const metrics = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const totalValue = quotes.reduce((acc, q) => {
      const servicesTotal = q.services?.reduce((s, item) => s + item.price, 0) || 0;
      const materialsTotal = q.materials?.reduce((m, item) => m + item.totalPrice, 0) || 0;
      return acc + servicesTotal + materialsTotal;
    }, 0);

    const pendingCount = quotes.filter(q => q.status === QuoteStatus.SENT).length;
    const approvedCount = quotes.filter(q => q.status === QuoteStatus.APPROVED).length;
    const completedCount = quotes.filter(q => q.status === QuoteStatus.COMPLETED).length;
    const rejectedCount = quotes.filter(q => q.status === QuoteStatus.REJECTED).length;

    const activeContractsCount = approvedCount + completedCount;
    
    // Conversion Rate
    const totalFinished = approvedCount + completedCount + rejectedCount;
    const conversionRate = totalFinished > 0 
      ? Math.round(((approvedCount + completedCount) / totalFinished) * 100) 
      : 0;

    // Monthly Revenue (Current Month)
    const currentMonthRevenue = quotes
      .filter(q => {
        const d = parseDate(q.date);
        return d && d.getMonth() === currentMonth && d.getFullYear() === currentYear && (q.status === QuoteStatus.APPROVED || q.status === QuoteStatus.COMPLETED);
      })
      .reduce((acc, q) => {
        const servicesTotal = q.services?.reduce((s, item) => s + item.price, 0) || 0;
        const materialsTotal = q.materials?.reduce((m, item) => m + item.totalPrice, 0) || 0;
        return acc + servicesTotal + materialsTotal;
      }, 0);

    // Average Ticket
    const avgTicket = quotes.length > 0 ? totalValue / quotes.length : 0;

    return {
      totalValue,
      pendingCount,
      activeContractsCount,
      conversionRate,
      currentMonthRevenue,
      avgTicket
    };
  }, [quotes]);

  // Filtra garantias que vencem em menos de 30 dias
  const expiringWarranties = useMemo(() => quotes.filter(q => {
    if (q.status !== QuoteStatus.COMPLETED || !q.warrantyUntil) return false;
    const expiryDate = parseDate(q.warrantyUntil);
    if (!expiryDate) return false;

    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays >= 0 && diffDays <= 30;
  }), [quotes]);

  // Prepare Chart Data
  const monthlyRevenueData = useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      return {
        month: d.getMonth(),
        year: d.getFullYear(),
        label: d.toLocaleString('pt-BR', { month: 'short' }).toUpperCase(),
        value: 0
      };
    });

    quotes.forEach(q => {
      if (q.status !== QuoteStatus.APPROVED && q.status !== QuoteStatus.COMPLETED) return;
      const d = parseDate(q.date);
      if (!d) return;

      const monthData = last6Months.find(m => m.month === d.getMonth() && m.year === d.getFullYear());
      if (monthData) {
        const val = (q.services?.reduce((s, i) => s + i.price, 0) || 0) + (q.materials?.reduce((m, i) => m + i.totalPrice, 0) || 0);
        monthData.value += val;
      }
    });

    const maxVal = Math.max(...last6Months.map(d => d.value), 1); // Avoid div by zero
    return last6Months.map(d => ({ ...d, height: (d.value / maxVal) * 100 }));
  }, [quotes]);

  // Top Clients
  const topClients = useMemo(() => {
    const clientMap = new Map<string, { name: string, value: number, count: number }>();

    quotes.forEach(q => {
      if (!q.client?.name) return;
      const val = (q.services?.reduce((s, i) => s + i.price, 0) || 0) + (q.materials?.reduce((m, i) => m + i.totalPrice, 0) || 0);
      
      const existing = clientMap.get(q.client.id) || { name: q.client.name, value: 0, count: 0 };
      clientMap.set(q.client.id, { 
        name: q.client.name, 
        value: existing.value + val, 
        count: existing.count + 1 
      });
    });

    return Array.from(clientMap.values())
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);
  }, [quotes]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-slate-400">
        <span className="material-symbols-outlined animate-spin text-4xl mb-2">sync</span>
        <p className="text-sm font-medium animate-pulse">Sincronizando dados...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 w-full mx-auto md:max-w-7xl pb-32 md:pb-10 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={profile?.logo || profile?.avatar}
              className="rounded-full size-12 border-2 border-primary/20 object-cover"
              alt="Profile"
            />
            <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-background-light dark:border-background-dark"></div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
              {getGreeting()}, {profile?.name?.split(' ')[0] || 'Gestor'}
            </h2>
            <p className="text-sm text-slate-500">{profile?.companyName || 'Sua Empresa'}</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/settings')}
          className="flex size-10 items-center justify-center rounded-full bg-white dark:bg-surface-dark shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
        >
          <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">settings</span>
        </button>
      </div>

      {/* Alerta de Garantias Expirando */}
      {expiringWarranties.length > 0 && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-2xl p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
                <span className="material-symbols-outlined filled">warning</span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-amber-900 dark:text-amber-400">Garantias Expirando</h4>
                <p className="text-xs text-amber-700 dark:text-amber-500/80 mb-3">
                  {expiringWarranties.length === 1
                    ? `O serviço de ${expiringWarranties[0].client?.name || 'Cliente'} vence em breve.`
                    : `Você tem ${expiringWarranties.length} serviços com garantia vencendo este mês.`}
                </p>
                <div className="flex flex-wrap gap-2">
                  {expiringWarranties.slice(0, 2).map(q => (
                    <button
                      key={q.id}
                      onClick={() => navigate(`/quote/${q.id}`)}
                      className="text-[10px] font-bold bg-amber-500 text-white px-3 py-1.5 rounded-full hover:bg-amber-600 transition-colors"
                    >
                      Ver {q.client?.name?.split(' ')[0] || 'Cliente'}
                    </button>
                  ))}
                  {expiringWarranties.length > 2 && (
                    <button
                      onClick={() => navigate(`/quotes?filter=${QuoteStatus.COMPLETED}`)}
                      className="text-[10px] font-bold text-amber-600 dark:text-amber-400 px-2 py-1.5"
                    >
                      Ver todos
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg text-emerald-600">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase tracking-wide">
              Total
            </span>
          </div>
          <div>
            <p className="text-slate-500 text-xs font-medium">Faturamento Total</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white truncate">R$ {metrics.totalValue.toLocaleString('pt-BR')}</p>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg text-blue-600">
              <span className="material-symbols-outlined">calendar_month</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 uppercase tracking-wide">
              Mês Atual
            </span>
          </div>
          <div>
            <p className="text-slate-500 text-xs font-medium">Faturamento Mensal</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white truncate">R$ {metrics.currentMonthRevenue.toLocaleString('pt-BR')}</p>
          </div>
        </div>

        {/* Active Contracts */}
        <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-lg text-purple-600">
              <span className="material-symbols-outlined">verified</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 uppercase tracking-wide">
              {metrics.conversionRate}% Conv.
            </span>
          </div>
          <div>
            <p className="text-slate-500 text-xs font-medium">Contratos Ativos</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{metrics.activeContractsCount}</p>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-orange-100 dark:bg-orange-500/20 rounded-lg text-orange-600">
              <span className="material-symbols-outlined">pending_actions</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-orange-50 dark:bg-orange-900/30 text-orange-600 uppercase tracking-wide">
              Aguardando
            </span>
          </div>
          <div>
            <p className="text-slate-500 text-xs font-medium">Orçamentos Pendentes</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{metrics.pendingCount}</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Charts & Top Clients */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Revenue Chart */}
        <div className="md:col-span-2 bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 dark:text-white">Receita últimos 6 meses</h3>
            <span className="text-xs text-slate-500 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
              Confirmados
            </span>
          </div>
          
          <div className="flex items-end justify-between h-40 gap-2 mt-4">
            {monthlyRevenueData.map((data, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 flex-1 h-full group">
                <div className="w-full relative flex items-end justify-center flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-t-lg">
                  <div 
                    className="w-full bg-primary/80 group-hover:bg-primary transition-all duration-500 rounded-t-sm relative"
                    style={{ height: `${data.height}%` }}
                  >
                    {data.value > 0 && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                        R$ {data.value.toLocaleString('pt-BR', { notation: 'compact' })}
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">{data.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Clients */}
        <div className="md:col-span-1 bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">Top Clientes</h3>
          <div className="space-y-4">
            {topClients.length > 0 ? topClients.map((client, idx) => (
              <div key={idx} className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                  idx === 1 ? 'bg-slate-200 text-slate-600' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{client.name}</p>
                  <p className="text-xs text-slate-500">{client.count} serviços</p>
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {client.value.toLocaleString('pt-BR', { notation: 'compact', style: 'currency', currency: 'BRL' })}
                </p>
              </div>
            )) : (
              <p className="text-sm text-slate-500 text-center py-8">Nenhum cliente ainda</p>
            )}
          </div>
          {topClients.length > 0 && (
             <button 
               onClick={() => navigate('/quotes')}
               className="w-full mt-4 text-xs font-semibold text-primary py-2 hover:bg-primary/5 rounded-lg transition-colors"
             >
               Ver todos os clientes
             </button>
          )}
        </div>
      </div>

      {/* Quick Access */}
      <div>
        <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Acesso Rápido</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickAction
            icon="add_circle"
            label="Novo Orçamento"
            color="text-primary"
            bgColor="bg-primary/10"
            onClick={() => navigate('/new-quote')}
          />
          <QuickAction
            icon="history"
            label="Ver Histórico"
            color="text-purple-600"
            bgColor="bg-purple-100 dark:bg-purple-900/20"
            onClick={() => navigate('/quotes')}
          />
          <QuickAction
            icon="description"
            label="Meus Contratos"
            color="text-emerald-600"
            bgColor="bg-emerald-100 dark:bg-emerald-900/20"
            onClick={() => navigate(`/quotes?filter=${QuoteStatus.APPROVED}`)}
          />
          <QuickAction
            icon="group"
            label="Gerenciar Clientes"
            color="text-orange-600"
            bgColor="bg-orange-100 dark:bg-orange-900/20"
            onClick={() => navigate('/clients')} // Assuming /clients route exists or handled via /quotes
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="pb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Atividade Recente</h3>
          <button className="text-xs font-semibold text-primary" onClick={() => navigate('/quotes')}>Ver tudo</button>
        </div>
        <div className="space-y-3">
          {quotes.slice(0, 5).map(quote => (
            <div
              key={quote.id}
              onClick={() => navigate(`/quote/${quote.id}`)}
              className="flex items-center justify-between bg-white dark:bg-surface-dark p-3 rounded-xl shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 cursor-pointer active:scale-[0.98] transition-transform hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className={`flex size-10 items-center justify-center rounded-full ${
                  quote.status === QuoteStatus.COMPLETED ? 'bg-emerald-100 text-emerald-600' : 
                  quote.status === QuoteStatus.APPROVED ? 'bg-blue-100 text-blue-600' :
                  'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  <span className="material-symbols-outlined">
                    {quote.status === QuoteStatus.COMPLETED ? 'verified' : 
                     quote.status === QuoteStatus.APPROVED ? 'assignment_turned_in' : 'request_quote'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold truncate max-w-[150px] md:max-w-xs text-slate-900 dark:text-white">
                    {quote.services?.[0]?.name || 'Serviço'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {quote.client?.name || 'Cliente'} • {parseDate(quote.date)?.toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ring-1 ring-inset ${
                  quote.status === QuoteStatus.SENT ? 'bg-yellow-500/10 text-yellow-600 ring-yellow-500/20' :
                  quote.status === QuoteStatus.APPROVED ? 'bg-blue-500/10 text-blue-600 ring-blue-500/20' :
                  quote.status === QuoteStatus.COMPLETED ? 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20' :
                  quote.status === QuoteStatus.REJECTED ? 'bg-red-500/10 text-red-600 ring-red-500/20' :
                  'bg-slate-500/10 text-slate-500 ring-slate-500/20'
                }`}>
                  {QuoteStatusLabels[quote.status] || quote.status}
                </span>
                <span className="text-[10px] font-medium text-slate-400">
                  R$ {((quote.services?.reduce((s, i) => s + i.price, 0) || 0) + (quote.materials?.reduce((m, i) => m + i.totalPrice, 0) || 0)).toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          ))}
          {quotes.length === 0 && (
            <div className="text-center py-10 bg-white dark:bg-surface-dark rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
              <p className="text-slate-500 text-sm">Nenhum orçamento criado ainda.</p>
              <button 
                onClick={() => navigate('/new-quote')}
                className="mt-2 text-primary font-bold text-sm hover:underline"
              >
                Criar o primeiro
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

interface QuickActionProps {
  icon: string;
  label: string;
  color: string;
  bgColor: string;
  onClick: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({ icon, label, color, bgColor, onClick }) => (
  <button
    onClick={onClick}
    className="group relative flex flex-col items-start justify-between gap-3 rounded-xl p-4 bg-white dark:bg-surface-dark shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 active:scale-[0.98] transition-all overflow-hidden h-32 hover:shadow-md"
  >
    <div className={`z-10 flex size-10 items-center justify-center rounded-lg ${bgColor} ${color}`}>
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <p className="z-10 text-left text-sm font-bold leading-tight text-slate-900 dark:text-white">{label}</p>
    <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-slate-500/5 group-hover:bg-primary/5 transition-colors"></div>
  </button>
);

export default Dashboard;
