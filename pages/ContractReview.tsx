import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useDialog } from '../contexts/DialogContext';
import { Quote } from '../types';

import { quotesService } from '../services/database';

const ContractReview: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { confirm } = useDialog();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [clauses, setClauses] = useState<string>('');
  const [agreed, setAgreed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const data = await quotesService.getQuote(id);
        setQuote(data);
        if (data.contractTerms) setClauses(data.contractTerms);
      } catch (error) {
        console.error('Erro ao carregar orçamento:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleGenerateAI = async () => {
    if (!quote) return;
    setIsGenerating(true);
    try {
      const { generateClauses } = await import('../services/ai');
      const text = await generateClauses(quote);
      setClauses(text);
    } catch (error: any) {
      if (error.message === 'MISSING_API_KEY' || error.message === 'INVALID_API_KEY') {
        const confirmed = await confirm({
          title: 'Configurar IA',
          message: 'Para usar a Inteligência Artificial, você precisa configurar sua chave de API do Google Gemini. Deseja configurar agora? É gratuito.',
          confirmLabel: 'Configurar',
          cancelLabel: 'Depois',
          variant: 'info'
        });

        if (confirmed) {
          navigate('/settings');
        }
      } else {
        toast.error('Erro ao gerar cláusulas: ' + (error.message || 'Erro desconhecido'));
      }
    } finally {
      setIsGenerating(false);
    }
  };


  const handleProceed = async () => {
    if (quote && agreed) {
      try {
        await quotesService.updateQuote({ ...quote, contractTerms: clauses });
        navigate(`/signature/${quote.id}`);
      } catch (e) {
        toast.error('Erro ao salvar contrato.');
      }
    }
  };

  if (isLoading) return <div className="p-10 text-center">Carregando...</div>;

  if (!quote) return <div className="p-10 text-center">Contrato não encontrado.</div>;

  return (
    <div className="flex flex-col min-h-screen w-full mx-auto bg-background-light dark:bg-background-dark md:py-8 md:px-4">
      <div className="w-full max-w-5xl mx-auto md:bg-white md:dark:bg-surface-dark md:rounded-3xl md:shadow-xl md:border md:dark:border-white/5 md:overflow-hidden relative md:flex md:flex-col md:h-[85vh]">
        <header className="sticky top-0 z-50 flex items-center p-4 justify-between border-b border-slate-200 dark:border-slate-800 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md md:bg-white md:dark:bg-surface-dark md:px-8">
          <button onClick={() => navigate(-1)} className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex flex-col items-center">
            <h2 className="font-bold text-lg">Editor de Contrato</h2>
            <span className="text-[10px] text-slate-500 font-bold">{quote.contractNumber || quote.number}</span>
          </div>
          <div className="w-10"></div> {/* Spacer */}
        </header>

        <main className="flex-1 overflow-y-auto px-4 pb-48 pt-6 no-scrollbar md:p-8 md:pb-8">
          <div className="flex flex-col md:flex-row md:items-start gap-8 h-full">
            {/* Left: Sidebar / Instructions (Desktop) */}
            <div className="md:w-1/3 md:shrink-0 space-y-6">
              <div className="mb-6">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <span className="material-symbols-outlined text-lg">description</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Personalização de Cláusulas</span>
                </div>
                <h1 className="text-2xl font-black mb-4">Texto do Contrato</h1>

                <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-900/20 mb-4">
                  <p className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                    <span className="font-black">DICA:</span> Você pode editar livremente o texto na caixa ao lado para adequar os termos ao serviço contratado. O texto final será o que aparecerá no contrato assinado.
                  </p>
                </div>

                <button
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center gap-2 bg-purple-600/10 text-purple-600 px-4 py-3 rounded-xl text-xs font-bold hover:bg-purple-600/20 disabled:opacity-50 transition-colors"
                >
                  {isGenerating ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                      Gerando Cláusulas Inteligentes...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">auto_awesome</span>
                      Gerar Cláusulas com IA
                    </>
                  )}
                </button>
              </div>

              {/* Checkbox (Moved to sidebar on desktop) */}
              <div className="hidden md:block space-y-4">
                <label className="flex items-start gap-3 cursor-pointer select-none group p-4 border border-slate-100 dark:border-white/5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <div className={`mt-1 size-5 rounded border flex items-center justify-center transition-colors ${agreed ? 'bg-primary border-primary' : 'bg-white dark:bg-surface-dark border-slate-300 dark:border-white/10'}`}>
                    {agreed && <span className="material-symbols-outlined text-white text-[16px] font-bold">check</span>}
                  </div>
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={() => setAgreed(!agreed)}
                    className="hidden"
                  />
                  <span className="text-xs text-slate-500 leading-snug group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                    Confirmo que as cláusulas refletem o acordo de serviço e estou pronto para colher a assinatura.
                  </span>
                </label>
                <button
                  disabled={!agreed}
                  onClick={handleProceed}
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-bold shadow-lg transition-all active:scale-95 ${agreed ? 'bg-primary shadow-primary/30 hover:bg-primary-dark' : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed opacity-50'}`}
                >
                  <span>Prosseguir para Assinatura</span>
                  <span className="material-symbols-outlined text-xl">ink_pen</span>
                </button>
              </div>
            </div>

            {/* Right: Editor */}
            <div className="flex-1 h-full flex flex-col gap-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 md:hidden">Corpo do Contrato</label>
              <textarea
                className="w-full flex-1 min-h-[450px] md:min-h-0 bg-white dark:bg-surface-dark md:bg-slate-50 md:dark:bg-black/20 p-6 rounded-2xl text-sm text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-200 dark:border-white/5 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none font-sans"
                value={clauses}
                onChange={(e) => setClauses(e.target.value)}
                placeholder="Escreva aqui as cláusulas do contrato..."
              />
            </div>
          </div>
        </main>

        <footer className="fixed bottom-[90px] left-0 right-0 p-4 pb-4 bg-background-light dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 z-50 md:hidden">
          <div className="max-w-md mx-auto space-y-4">
            <label className="flex items-start gap-3 cursor-pointer select-none group">
              <div className={`mt-1 size-5 rounded border flex items-center justify-center transition-colors ${agreed ? 'bg-primary border-primary' : 'bg-white dark:bg-surface-dark border-slate-300 dark:border-white/10'}`}>
                {agreed && <span className="material-symbols-outlined text-white text-[16px] font-bold">check</span>}
              </div>
              <input
                type="checkbox"
                checked={agreed}
                onChange={() => setAgreed(!agreed)}
                className="hidden"
              />
              <span className="text-xs text-slate-500 leading-snug group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                Confirmo que as cláusulas acima refletem o acordo de serviço e estou pronto para colher a assinatura do cliente.
              </span>
            </label>
            <button
              disabled={!agreed}
              onClick={handleProceed}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold shadow-lg transition-all active:scale-95 ${agreed ? 'bg-primary shadow-primary/30' : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed opacity-50'}`}
            >
              <span>Prosseguir para Assinatura</span>
              <span className="material-symbols-outlined text-xl">ink_pen</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ContractReview;
