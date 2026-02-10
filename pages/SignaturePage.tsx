
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Quote, QuoteStatus, CompanyInfo } from '../types';
import { quotesService, profileService } from '../services/database';
import SignaturePad from '../components/SignaturePad';
import toast from 'react-hot-toast';

const SignaturePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [clientSignature, setClientSignature] = useState<string | null>(null);
  const [techSign, setTechSign] = useState<string | null>(null);
  const [profile, setProfile] = useState<CompanyInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigning, setIsSigning] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const [quoteData, profileData] = await Promise.all([
          quotesService.getQuote(id),
          profileService.getProfile()
        ]);
        setQuote(quoteData);
        setProfile(profileData as CompanyInfo);
        setTechSign(profileData.techSignature || null);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (isLoading) return <div className="p-10 text-center">Carregando...</div>;
  if (!quote) return <div className="p-10 text-center">Contrato não encontrado.</div>;

  const handleFinish = async () => {
    if (quote && id && clientSignature) {
      const updated = {
        ...quote,
        status: QuoteStatus.COMPLETED,
        signatureData: clientSignature,
        completionDate: new Date().toISOString(),
        warrantyUntil: new Date(new Date().setMonth(new Date().getMonth() + (quote.warrantyDuration || 12))).toISOString()
      };

      try {
        await quotesService.updateQuote(updated);
        navigate(`/quote/${id}`);
      } catch (e) {
        toast.error('Erro ao salvar assinatura.');
      }
    }
  };

  const renderSignature = (signature: string | null) => {
    if (!signature) return null;
    if (signature.startsWith('data:image')) {
        return <img src={signature} alt="Assinatura" className="h-full w-auto object-contain p-4" />;
    }
    // Fallback for SVG paths (legacy/mock)
    return (
        <svg className="w-full h-full p-4" viewBox="0 0 400 150">
            <path d={signature} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-slate-400 dark:text-slate-500" />
        </svg>
    );
  };


  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-50 flex items-center p-4 justify-between border-b border-slate-200 dark:border-slate-800 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="material-symbols-outlined">arrow_back</button>
        <h2 className="font-bold text-lg">Assinatura do Contrato</h2>
        <div className="size-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-32 pt-6">
        <div className="mb-6 p-4 bg-primary/10 rounded-2xl border border-primary/20">
          <h3 className="font-bold text-primary flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined">info</span>
            Formalização Digital
          </h3>
          <p className="text-xs text-slate-500">Este contrato será formalizado com as assinaturas digitais do contratante e do técnico responsável.</p>
        </div>

        {/* Assinatura do Cliente */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">person</span>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Assinatura do Contratante</h3>
          </div>
          <div className="bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-sm space-y-4 border dark:border-white/5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nome do Responsável</label>
              <p className="font-bold text-sm bg-slate-50 dark:bg-background-dark p-3 rounded-xl">{quote.client?.name || 'Cliente'}</p>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-end mb-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Painel de Coleta</label>
                {clientSignature && !isSigning && (
                  <button onClick={() => setIsSigning(true)} className="text-[10px] text-primary font-bold">Refazer Assinatura</button>
                )}
              </div>
              
              <div className="w-full h-48 bg-slate-50 dark:bg-background-dark border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden relative">
                {isSigning ? (
                  <div className="w-full h-full relative">
                      <SignaturePad 
                        onSave={(data) => setClientSignature(data)} 
                        className="w-full h-full bg-white"
                        initialData={clientSignature}
                      />
                      <button 
                        onClick={() => setIsSigning(false)}
                        className="absolute bottom-2 right-2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-lg shadow-sm z-20"
                      >
                        Concluir
                      </button>
                  </div>
                ) : clientSignature ? (
                   <button onClick={() => setIsSigning(true)} className="w-full h-full relative group">
                      {renderSignature(clientSignature)}
                   </button>
                ) : (
                  <button
                    onClick={() => setIsSigning(true)}
                    className="w-full h-full flex flex-col items-center justify-center text-slate-400 active:scale-[0.99] transition-all"
                  >
                    <span className="material-symbols-outlined text-4xl mb-2">draw</span>
                    <p className="text-xs font-bold uppercase tracking-widest">Tocar para Assinar</p>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Assinatura do Técnico */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">engineering</span>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Assinatura do Técnico</h3>
          </div>
          <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm border dark:border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src={profile?.logo || "https://via.placeholder.com/40"} className="size-10 rounded-full border border-primary/20 object-cover" alt="" />
                <div className="flex flex-col">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{profile?.name}</p>
                  <p className="text-[10px] text-slate-500">{profile?.companyName}</p>
                </div>
              </div>
              <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase ring-1 ring-emerald-500/20">Identidade Validada</span>
            </div>

            <div className="h-32 w-full bg-slate-50 dark:bg-background-dark rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-center overflow-hidden">
              {techSign ? (
                renderSignature(techSign)
              ) : (
                <button
                  onClick={() => navigate('/tech-signature')}
                  className="text-xs text-primary font-bold flex flex-col items-center gap-2"
                >
                  <span className="material-symbols-outlined">warning</span>
                  Configurar Assinatura Técnico
                </button>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-4 pb-8 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-t dark:border-white/5 z-50">
        <div className="max-w-md mx-auto">
          <button
            disabled={!clientSignature || !techSign}
            onClick={handleFinish}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold shadow-lg transition-all active:scale-95 ${clientSignature && techSign ? 'bg-primary shadow-primary/30' : 'bg-slate-300 dark:bg-slate-700 opacity-50'}`}
          >
            <span className="material-symbols-outlined">check_circle</span>
            Concluir Contrato e Ativar Garantia
          </button>
        </div>
      </footer>
    </div>
  );
};

export default SignaturePage;
