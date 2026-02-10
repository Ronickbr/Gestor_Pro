
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVICE_CATEGORIES } from '../constants';

const NewQuoteSelection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto relative bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-50 flex items-center p-4 justify-between h-16 border-b border-slate-200 dark:border-slate-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center justify-center size-10 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold flex-1 text-center">Novo Orçamento</h2>
        <button onClick={() => navigate('/dashboard')} className="text-sm font-medium text-slate-400">Cancelar</button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-24">
        <div className="pt-4 pb-4">
          <div className="relative flex items-center bg-white dark:bg-surface-dark rounded-xl shadow-sm ring-1 ring-slate-900/5 dark:ring-white/5 h-12">
            <span className="material-symbols-outlined ml-4 text-slate-400">search</span>
            <input 
              className="bg-transparent border-none focus:ring-0 flex-1 px-3 text-sm" 
              placeholder="Buscar por serviço ou categoria..."
            />
          </div>
        </div>

        <h3 className="text-xl font-bold mb-4 px-1 text-slate-900 dark:text-white">Categorias de Serviço</h3>
        
        <div className="space-y-3">
          {SERVICE_CATEGORIES.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => navigate('/new-quote/form', { state: { category: cat } })}
              className="w-full group flex items-center gap-4 bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 active:scale-[0.98] transition-all"
            >
              <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-12">
                <span className="material-symbols-outlined text-[28px]">{cat.icon}</span>
              </div>
              <div className="flex flex-col items-start flex-1 min-w-0">
                <p className="font-semibold truncate w-full text-left text-slate-900 dark:text-white">{cat.name}</p>
                <p className="text-slate-500 text-xs truncate w-full text-left">{cat.description}</p>
              </div>
              <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">chevron_right</span>
            </button>
          ))}
          
          <button 
            onClick={() => navigate('/new-quote/form', { state: { category: null } })}
            className="w-full group flex items-center gap-4 bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 active:scale-[0.98] transition-all"
          >
            <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-12">
              <span className="material-symbols-outlined text-[28px]">edit_document</span>
            </div>
            <div className="flex flex-col items-start flex-1 min-w-0">
              <p className="font-semibold text-slate-900 dark:text-white">Modelo em Branco</p>
              <p className="text-slate-500 text-xs text-left">Sem contrato pré-definido.</p>
            </div>
            <span className="material-symbols-outlined text-slate-400">chevron_right</span>
          </button>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full p-4 pb-8 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800">
        <button 
          onClick={() => navigate('/new-quote/form')}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-white shadow-lg active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined">add_circle</span>
          <span className="font-bold">Criar Orçamento Personalizado</span>
        </button>
      </div>
    </div>
  );
};

export default NewQuoteSelection;
