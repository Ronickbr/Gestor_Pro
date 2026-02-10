import React, { useState, useEffect } from 'react';
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

  // Função auxiliar para converter string DD/MM/AAAA para objeto Date
  const parseDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  // Filtra garantias que vencem em menos de 30 dias
  const expiringWarranties = quotes.filter(q => {
    if (q.status !== QuoteStatus.COMPLETED || !q.warrantyUntil) return false;
    const expiryDate = parseDate(q.warrantyUntil);
    if (!expiryDate) return false;

    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays >= 0 && diffDays <= 30;
  });

  const totalValue = quotes.reduce((acc, q) => {
    const servicesTotal = q.services?.reduce((s, item) => s + item.price, 0) || 0;
    const materialsTotal = q.materials?.reduce((m, item) => m + item.totalPrice, 0) || 0;
    return acc + servicesTotal + materialsTotal;
  }, 0);

  const pendingCount = quotes.filter(q => q.status === QuoteStatus.SENT).length;
  const activeContractsCount = quotes.filter(q => q.status === QuoteStatus.APPROVED || q.status === QuoteStatus.COMPLETED).length;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-slate-400">
        <span className="material-symbols-outlined animate-spin text-4xl mb-2">sync</span>
        <p className="text-sm font-medium animate-pulse">Sincronizando dados...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 w-full mx-auto md:max-w-7xl pb-32 md:pb-10">
      {/* Header */}
      <div className="flex items-center justify-between pt-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={profile?.logo || profile?.avatar}
              className="rounded-full size-10 border-2 border-primary/20 object-cover"
              alt="Profile"
            />
            <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-background-light dark:border-background-dark"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-500">Bem-vindo</span>
            <span className="text-sm font-bold leading-tight text-slate-900 dark:text-white">{profile?.name?.split(' ')[0] || 'Gestor'}</span>
          </div>
        </div>
        <button
          onClick={() => navigate('/settings')}
          className="flex size-10 items-center justify-center rounded-full bg-white dark:bg-surface-dark shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10"
        >
          <span className="material-symbols-outlined">settings</span>
        </button>
      </div>

      <div className="pt-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{getGreeting()}, {profile?.name?.split(' ')[0] || 'Técnico'}</h2>
        <p className="text-slate-500 text-sm mt-1">Sua empresa: {profile?.companyName}</p>
      </div>

      {/* Alerta de Garantias Expirando */}
      {expiringWarranties.length > 0 && (
        <div className="mt-6 animate-in fade-in slide-in-from-top-4 duration-500">
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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
        <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 md:col-span-1">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg text-emerald-600">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase tracking-wide">
              Total
            </span>
          </div>
          <p className="text-slate-500 text-xs font-medium mb-1">Total em Orçamentos</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white truncate">R$ {totalValue.toLocaleString('pt-BR')}</p>
        </div>

        <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 md:col-span-1">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-orange-100 dark:bg-orange-500/20 rounded-lg text-orange-600">
              <span className="material-symbols-outlined">pending_actions</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-600 uppercase tracking-wide">
              {pendingCount}
            </span>
          </div>
          <p className="text-slate-500 text-xs font-medium mb-1">Pendentes</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">Aguardando</p>
        </div>

        <div className="col-span-2 md:col-span-2 bg-primary p-5 rounded-2xl shadow-lg shadow-primary/20 ring-1 ring-white/10 text-white">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <span className="material-symbols-outlined">verified</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-white/20 uppercase tracking-wide">Ativos</span>
          </div>
          <p className="text-blue-100 text-xs font-medium mb-1">Base de Contratos & Garantias</p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold">{activeContractsCount}</p>
            <p className="text-sm pb-1 opacity-80">contratos vigentes</p>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="pt-8">
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
            onClick={() => navigate('/quotes')}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="pt-8 pb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Atividade Recente</h3>
          <button className="text-xs font-semibold text-primary" onClick={() => navigate('/quotes')}>Ver tudo</button>
        </div>
        <div className="space-y-3">
          {quotes.slice(0, 5).map(quote => (
            <div
              key={quote.id}
              onClick={() => navigate(`/quote/${quote.id}`)}
              className="flex items-center justify-between bg-white dark:bg-surface-dark p-3 rounded-xl shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                  <span className="material-symbols-outlined">{quote.status === QuoteStatus.COMPLETED ? 'verified' : 'request_quote'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold truncate max-w-[150px] text-slate-900 dark:text-white">{quote.services?.[0]?.name || 'Serviço'}</span>
                  <span className="text-[10px] text-slate-500">{quote.client?.name || 'Cliente Desconhecido'} • {quote.contractNumber || quote.number}</span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ring-1 ring-inset ${quote.status === QuoteStatus.SENT ? 'bg-yellow-500/10 text-yellow-600 ring-yellow-500/20' :
                quote.status === QuoteStatus.APPROVED ? 'bg-blue-500/10 text-blue-600 ring-blue-500/20' :
                  quote.status === QuoteStatus.COMPLETED ? 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20' :
                    'bg-slate-500/10 text-slate-500 ring-slate-500/20'
                }`}>
                {QuoteStatusLabels[quote.status] || quote.status}
              </span>
            </div>
          ))}
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
    className="group relative flex flex-col items-start justify-between gap-3 rounded-xl p-4 bg-white dark:bg-surface-dark shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 active:scale-[0.98] transition-all overflow-hidden h-32"
  >
    <div className={`z-10 flex size-10 items-center justify-center rounded-lg ${bgColor} ${color}`}>
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <p className="z-10 text-left text-sm font-bold leading-tight text-slate-900 dark:text-white">{label}</p>
    <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-slate-500/5 group-hover:bg-primary/5 transition-colors"></div>
  </button>
);

export default Dashboard;
