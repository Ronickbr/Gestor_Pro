
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useDialog } from '../contexts/DialogContext';
import { Quote, QuoteStatus, QuoteStatusLabels } from '../types';
import { quotesService } from '../services/database';

const QuotesList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { confirm } = useDialog();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const filters = [
    { label: 'Todos', value: 'ALL' },
    { label: 'Pendente', value: QuoteStatus.SENT },
    { label: 'Aprovado', value: QuoteStatus.APPROVED },
    { label: 'Concluído', value: QuoteStatus.COMPLETED }
  ];

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      const data = await quotesService.fetchQuotes();
      setQuotes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filter = params.get('filter');
    if (filter) setActiveFilter(filter); // This might need mapping if URL uses old values, but assuming internal nav uses new values or defaults
  }, [location]);

  const activeFilters = activeFilter === 'ALL' ? quotes : quotes.filter(q => q.status === activeFilter);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    
    const confirmed = await confirm({
      title: 'Excluir Orçamento',
      message: 'Tem certeza que deseja excluir este orçamento? Esta ação não pode ser desfeita.',
      confirmLabel: 'Excluir',
      cancelLabel: 'Cancelar',
      variant: 'danger'
    });

    if (confirmed) {
      try {
        await quotesService.deleteQuote(id);
        setQuotes(prev => prev.filter(q => q.id !== id));
        toast.success('Orçamento excluído com sucesso!');
      } catch (error) {
        toast.error('Erro ao excluir orçamento.');
      }
    }
  };

  return (
    <div className="flex flex-col h-screen w-full md:max-w-7xl mx-auto bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-surface-dark/95 backdrop-blur-md border-b dark:border-white/5">
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="text-xl font-black">{activeFilter === QuoteStatus.COMPLETED ? 'Garantias Ativas' : 'Lista de Orçamentos'}</h2>
          <div className="flex gap-1">
            <button className="size-10 flex items-center justify-center rounded-full"><span className="material-symbols-outlined">search</span></button>
          </div>
        </div>

        <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`flex h-9 shrink-0 items-center justify-center px-4 rounded-full text-xs font-bold transition-all ${activeFilter === f.value ? 'bg-primary text-white shadow-md shadow-primary/30' : 'bg-white dark:bg-background-dark border dark:border-white/10 text-slate-500'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 p-4 overflow-y-auto pb-32">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <span className="material-symbols-outlined animate-spin text-4xl mb-2">sync</span>
            <p className="text-sm font-medium animate-pulse">Carregando...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeFilters.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 col-span-full">
                <span className="material-symbols-outlined text-6xl mb-4">folder_open</span>
                <p className="font-medium text-sm">Nenhum registro encontrado.</p>
              </div>
            )}

            {activeFilters.map(quote => (
              <div
                key={quote.id}
                onClick={() => navigate(`/quote/${quote.id}`)}
                className="group relative flex flex-col bg-white dark:bg-surface-dark rounded-2xl border dark:border-white/5 shadow-sm overflow-hidden active:scale-[0.98] transition-transform hover:shadow-md cursor-pointer"
              >
                <div className="flex gap-4 p-4 items-start">
                  <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${quote.status === QuoteStatus.COMPLETED ? 'bg-emerald-100 text-emerald-600' :
                    quote.status === QuoteStatus.SENT ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                    <span className="material-symbols-outlined filled">
                      {quote.status === QuoteStatus.COMPLETED ? 'verified' :
                        quote.status === QuoteStatus.SENT ? 'pending_actions' : 'description'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-black truncate pr-8 text-slate-900 dark:text-white">{quote.client?.name || 'Cliente Desconhecido'}</p>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ring-1 ring-inset ${quote.status === QuoteStatus.COMPLETED ? 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20' :
                        quote.status === QuoteStatus.SENT ? 'bg-amber-500/10 text-amber-600 ring-amber-500/20' :
                          'bg-blue-500/10 text-blue-600 ring-blue-500/20'
                        }`}>{QuoteStatusLabels[quote.status] || quote.status}</span>
                    </div>
                    <p className="text-xs text-slate-500">#{quote.number} • {quote.services?.[0]?.name || 'Serviço'}</p>
                    <div className="mt-3 flex justify-between items-end">
                      <span className="text-[10px] text-slate-400">{quote.date}</span>
                      <span className="font-black text-slate-900 dark:text-white">
                        R$ {((quote.services?.reduce((a, b) => a + b.price, 0) || 0) + (quote.materials?.reduce((a, b) => a + b.totalPrice, 0) || 0)).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleDelete(e, quote.id)} // Use wrapper function
                    className="size-8 flex items-center justify-center text-slate-300 hover:text-red-500 bg-white/80 dark:bg-surface-dark/80 rounded-full shadow-sm"
                    title="Excluir"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        )}
      </main>

      <button
        onClick={() => navigate('/new-quote')}
        className="fixed bottom-28 right-4 z-40 size-14 rounded-full bg-primary text-white shadow-xl shadow-primary/40 flex items-center justify-center active:scale-90 transition-transform md:hidden"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </div>
  );
};

export default QuotesList;
