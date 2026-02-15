
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Quote, QuoteStatus, CompanyInfo } from '../types';
import { quotesService, profileService } from '../services/database';
import { ContractPrintView, WarrantyPrintView, QuotePrintView } from '../components/PrintViews';
import toast from 'react-hot-toast';

import { Avatar } from '../components/ui/Avatar';

const QuoteSummary: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<CompanyInfo | null>(null);
  const [displayProfile, setDisplayProfile] = useState<CompanyInfo | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [printMode, setPrintMode] = useState<'quote' | 'contract' | 'warranty' | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (printMode) {
      setTimeout(() => {
        window.print();
        // Optional: Reset print mode after print dialog closes (difficult to detect reliably across browsers)
        // So we will provide a "Back" button in the print view.
      }, 500);
    }
  }, [printMode]);

  useEffect(() => {
    if (location.state?.created) {
      setShowSuccessModal(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    const loadQuote = async () => {
      if (id) {
        try {
          const [quoteData, profileData] = await Promise.all([
            quotesService.getQuote(id),
            profileService.getProfile()
          ]);
          setQuote(quoteData);
          setProfile(profileData as CompanyInfo);
          // If quote has companyInfo snapshot, use it. Else use current profile.
          setDisplayProfile((quoteData.companyInfo || profileData) as CompanyInfo);
        } catch (error) {
          console.error("Erro ao carregar:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadQuote();
  }, [id]);

  const updateQuoteStatus = async (id: string, status: QuoteStatus) => {
    if (!quote) return;
    const updated = { ...quote, status };

    if (status === QuoteStatus.APPROVED && !updated.contractNumber) {
      updated.contractNumber = `CTR-${quote.number.replace('#', '')}`;
    }

    try {
      await quotesService.updateQuote(updated);
      setQuote(updated);
    } catch (e) {
      console.error('Erro ao atualizar status:', e);
      toast.error('Erro ao atualizar status.');
    }
  };

  const techSign = displayProfile?.techSignature;

  if (loading) return <div className="p-10 text-center">Carregando...</div>;
  if (!quote) return <div className="p-10 text-center">Orçamento não encontrado.</div>;

  const servicesTotal = quote.services?.reduce((acc, s) => acc + s.price, 0) || 0;
  const materialsTotal = quote.materials?.reduce((acc, m) => acc + m.totalPrice, 0) || 0;
  const total = servicesTotal + materialsTotal;

  const handleWhatsApp = () => {
    const docType = quote.status === QuoteStatus.SENT ? 'orçamento' : 'contrato';
    const docNum = quote.contractNumber || quote.number;
    const link = quote.publicToken ? `${window.location.origin}/#/v/${quote.publicToken}` : '';
    const passwordText = quote.accessPassword ? `\n🔒 Senha de acesso: *${quote.accessPassword}*` : '';
    const message = `Olá ${quote.client?.name || 'Cliente'}, segue o ${docType} ${docNum} para os serviços de ${quote.services?.[0]?.name || 'instalação'}. Total: R$ ${total.toLocaleString('pt-BR')}. ${link ? `Acesse: ${link}` : ''}${passwordText}`;
    window.open(`https://wa.me/${(quote.client?.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(message)}`);
  };

  const handleCopyLink = () => {
    if (quote.publicToken) {
      const url = `${window.location.origin}/#/v/${quote.publicToken}`;
      navigator.clipboard.writeText(url);
      toast.success('Link copiado!');
    } else {
      toast.error('Este orçamento não possui link público gerado.');
    }
  };

  const handlePrint = (mode: 'quote' | 'contract' | 'warranty' = 'quote') => {
    setPrintMode(mode);
  };

  const isApproved = quote.status === QuoteStatus.APPROVED || quote.status === QuoteStatus.COMPLETED;
  const isWarranty = quote.status === QuoteStatus.COMPLETED;

  if (printMode === 'contract') {
    return <ContractPrintView quote={quote} profile={displayProfile} onBack={() => setPrintMode(null)} />;
  }
  if (printMode === 'warranty') {
    return <WarrantyPrintView quote={quote} profile={displayProfile} onBack={() => setPrintMode(null)} />;
  }
  if (printMode === 'quote') {
    return <QuotePrintView quote={quote} profile={displayProfile} onBack={() => setPrintMode(null)} />;
  }

  return (
    <div className="flex flex-col min-h-screen w-full mx-auto bg-background-light dark:bg-background-dark md:py-8 md:px-4 print:bg-white print:m-0 print:p-0">
      <div className="w-full max-w-5xl mx-auto md:bg-white md:dark:bg-surface-dark md:rounded-3xl md:shadow-xl md:border md:dark:border-white/5 md:overflow-hidden relative print:shadow-none print:border-none print:w-full print:max-w-none">

        {/* HEADER MOBILE UI */}
        <header className="sticky top-0 z-50 flex items-center bg-white dark:bg-surface-dark p-4 justify-between border-b dark:border-white/5 no-print md:px-8">
          <button onClick={() => navigate(-1)} className="material-symbols-outlined hover:bg-slate-100 dark:hover:bg-white/5 p-2 rounded-full transition-colors">arrow_back</button>
          <div className="flex flex-col items-center">
            <h2 className="text-sm font-bold">
              {isWarranty ? 'Certificado de Garantia' : isApproved ? 'Contrato de Serviço' : 'Orçamento'}
            </h2>
            <span className="text-[10px] text-slate-500 font-bold">{quote.contractNumber || quote.number}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsApp}
              className="material-symbols-outlined text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 p-2 rounded-full transition-colors"
              title="Enviar via WhatsApp"
            >
              chat
            </button>
            <button
              onClick={() => window.open(`#/v/${quote.publicToken}`, '_blank')}
              className="material-symbols-outlined text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 p-2 rounded-full transition-colors"
              title="Visualizar como Cliente"
            >
              visibility
            </button>
            <button
              onClick={() => navigate(`/edit-quote/${quote.id}`)}
              className="material-symbols-outlined text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 p-2 rounded-full transition-colors"
            >
              edit
            </button>
            <button onClick={() => handlePrint('quote')} className="material-symbols-outlined hover:bg-slate-100 dark:hover:bg-white/5 p-2 rounded-full transition-colors">print</button>
          </div>
        </header>

        {/* DOCUMENT HEADER (VISIBLE ON PRINT AND DESKTOP) */}
        <div className="hidden md:flex print:flex flex-col p-8 md:bg-slate-50 md:dark:bg-black/20 border-b border-primary/20 md:border-slate-100 md:dark:border-white/5 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              {displayProfile?.logo ? (
                <img src={displayProfile.logo} className="h-16 w-auto object-contain mb-4" alt="Logo Empresa" />
              ) : null}
              <h1 className="text-3xl font-black text-primary uppercase">
                {isWarranty ? 'Certificado de Garantia' : isApproved ? `Contrato de Serviço` : `Orçamento de Serviço`}
              </h1>
              <p className="text-slate-500 font-bold">Documento Nº {quote.contractNumber || quote.number}</p>
            </div>
            <div className="text-right">
              <p className="font-black text-lg">{displayProfile?.companyName}</p>
              <p className="text-xs text-slate-500">Documento: {displayProfile?.document}</p>
              <p className="text-xs text-slate-500">{displayProfile?.email}</p>
              <p className="text-xs text-slate-500">{displayProfile?.phone}</p>
              {quote.viewedAt && (
                  <p className="text-xs text-emerald-600 font-bold mt-1 flex items-center justify-end gap-1">
                      <span className="material-symbols-outlined text-sm">visibility</span>
                      Visualizado em {new Date(quote.viewedAt).toLocaleDateString('pt-BR')} às {new Date(quote.viewedAt).toLocaleTimeString('pt-BR')}
                  </p>
              )}
            </div>
          </div>
          <p className="text-xs text-slate-400 text-right">Data de Emissão: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        <main className="p-4 flex-1 pb-48 print:p-8 print:pb-32 md:p-8 md:pb-32">
          {/* ACTION BANNERS */}
          {isWarranty && (
            <div className="bg-emerald-500 text-white p-4 rounded-2xl mb-6 flex items-center gap-3 shadow-lg shadow-emerald-500/20 no-print">
              <span className="material-symbols-outlined text-3xl filled">verified</span>
              <div className="flex-1">
                <p className="font-bold text-sm">Garantia Ativa ({quote.warrantyDuration} meses)</p>
                <p className="text-[10px] opacity-90">
                  Expira em: {quote.warrantyUntil ? new Date(quote.warrantyUntil).toLocaleDateString('pt-BR') : '-'}
                </p>
              </div>
              <button onClick={() => handlePrint('warranty')} className="bg-white/20 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-white/30 transition-colors">Ver PDF</button>
            </div>
          )}

          {isApproved && !isWarranty && (
            <div className="bg-blue-600 text-white p-4 rounded-2xl mb-6 flex items-center gap-3 shadow-lg shadow-blue-500/20 no-print">
              <span className="material-symbols-outlined text-3xl">description</span>
              <div className="flex-1">
                <p className="font-bold text-sm">Contrato Gerado</p>
                <p className="text-[10px] opacity-90">Pronto para execução técnica.</p>
              </div>
              <button onClick={() => handlePrint('contract')} className="bg-white/20 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-white/30 transition-colors">Ver PDF</button>
            </div>
          )}

          <div className="flex flex-col md:flex-row md:justify-between md:items-end items-center py-8 bg-white dark:bg-surface-dark md:bg-slate-50 md:dark:bg-white/5 rounded-2xl shadow-sm md:shadow-none md:border md:border-slate-100 md:dark:border-white/5 mb-8 border dark:border-white/5 print:border-none print:shadow-none print:py-4 print:bg-transparent px-8">
            <div className="flex items-center gap-4 bg-white dark:bg-surface-dark md:bg-transparent p-4 md:p-0 rounded-xl w-full md:w-auto mb-4 md:mb-0 print:p-0">
              <Avatar src={quote.client?.avatar} name={quote.client?.name || 'C'} size="size-14" className="shrink-0 border-2 border-primary/20 no-print" />
              <div className="flex-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Cliente</p>
                <p className="font-bold text-lg print:text-base leading-tight">{quote.client?.name || 'Cliente Desconhecido'}</p>
                <p className="text-xs text-slate-500 leading-tight mt-1">{quote.client?.address || ''}</p>
                <p className="text-xs text-slate-500 leading-tight">Doc: {quote.client?.document || ''}</p>
              </div>
            </div>

            <div className="text-center md:text-right">
              <p className="text-slate-500 text-xs font-medium mb-1 uppercase tracking-wider">
                {isWarranty ? 'Valor Total Pago' : 'Valor do Investimento'}
              </p>
              <h1 className="text-primary text-4xl font-extrabold print:text-2xl">R$ {total.toLocaleString('pt-BR')}</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:block">
            {/* Left Column: Items */}
            <section className="print:mb-6">
              <h3 className="font-bold text-lg mb-4 px-1 pb-1 text-slate-400 uppercase text-xs tracking-widest print:text-slate-900 print:border-b-2 print:border-slate-900">Descrição dos Serviços e Materiais</h3>
              <div className="bg-white dark:bg-surface-dark rounded-xl overflow-hidden border dark:border-white/5 divide-y dark:divide-white/5 print:border print:border-slate-200 print:divide-slate-200 md:shadow-sm md:border-slate-100">
                {quote.services?.map(s => (
                  <div key={s.id} className="p-4 flex justify-between items-start hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <div className="flex-1 pr-4">
                      <p className="font-bold text-sm text-slate-900 dark:text-white">{s.name}</p>
                      <p className="text-[10px] text-slate-500">{s.description || 'Execução técnica especializada.'}</p>
                    </div>
                    <p className="font-bold text-sm shrink-0">R$ {s.price.toLocaleString('pt-BR')}</p>
                  </div>
                ))}
                {quote.materials?.map(m => (
                  <div key={m.id} className="p-4 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30 print:bg-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                    <div className="flex-1 pr-4">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{m.name}</p>
                      <p className="text-[10px] text-slate-500">Qtd: {m.quantity} x R$ {m.unitPrice.toLocaleString('pt-BR')}</p>
                    </div>
                    <p className="font-bold text-sm shrink-0">R$ {m.totalPrice.toLocaleString('pt-BR')}</p>
                  </div>
                ))}
                <div className="p-4 bg-slate-100 dark:bg-slate-900 flex justify-between items-center print:bg-slate-100">
                  <p className="font-black text-xs uppercase">Valor Total do Documento</p>
                  <p className="font-black text-lg">R$ {total.toLocaleString('pt-BR')}</p>
                </div>
              </div>
            </section>

            {/* Right Column: Terms */}
            <section className="print:mb-6 print:break-before-auto">
              <h3 className="font-bold text-lg mb-4 px-1 pb-1 text-slate-400 uppercase text-xs tracking-widest print:text-slate-900 print:border-b-2 print:border-slate-900">Condições e Termos</h3>
              <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30 print:bg-white print:border-slate-200 print:p-0 md:bg-white md:dark:bg-surface-dark md:border-slate-100 md:shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white dark:bg-surface-dark p-3 rounded-lg border border-blue-100 dark:border-white/5 print:border-slate-200 md:bg-slate-50 md:dark:bg-black/20 md:border-slate-200">
                    <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Validade</p>
                    <p className="font-bold text-sm text-slate-700 dark:text-white">
                      {new Date(quote.validUntil).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-surface-dark p-3 rounded-lg border border-blue-100 dark:border-white/5 print:border-slate-200 md:bg-slate-50 md:dark:bg-black/20 md:border-slate-200">
                    <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Garantia</p>
                    <p className="font-bold text-sm text-slate-700 dark:text-white">
                      {quote.warrantyDuration} Meses
                    </p>
                  </div>
                  <div className="bg-white dark:bg-surface-dark p-3 rounded-lg border border-blue-100 dark:border-white/5 print:border-slate-200 md:bg-slate-50 md:dark:bg-black/20 md:border-slate-200">
                    <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Pagamento</p>
                    <p className="font-bold text-sm text-slate-700 dark:text-white">
                      {quote.paymentTerms || 'A combinar'}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-blue-200 dark:border-blue-900/30 print:border-slate-200 md:border-slate-100">
                  <p className="font-bold text-blue-600 dark:text-blue-400 mb-2 text-xs uppercase tracking-widest print:text-slate-900">Observações Gerais / Contrato</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap text-justify">
                    {quote.contractTerms || `O serviço inclui a garantia de ${quote.warrantyDuration} meses descrita acima.`}
                  </p>
                  {isWarranty && quote.completionDate && quote.warrantyUntil && !isNaN(new Date(quote.completionDate).getTime()) && !isNaN(new Date(quote.warrantyUntil).getTime()) && (
                    <p className="mt-4 pt-4 border-t border-blue-200 text-[10px] text-emerald-600 font-bold print:border-slate-200 print:text-slate-900">
                      * SERVIÇO CONCLUÍDO EM {new Date(quote.completionDate).toLocaleDateString('pt-BR')}. GARANTIA VÁLIDA ATÉ {new Date(quote.warrantyUntil).toLocaleDateString('pt-BR')}.
                    </p>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* SIGNATURES (VISIBLE ON PRINT OR COMPLETED) */}
          {(isWarranty || quote.signatureData) && (
            <section className="mt-12 grid grid-cols-2 gap-8 print:hidden md:border-t md:border-slate-100 md:dark:border-white/5 md:pt-12">
              <div className="flex flex-col items-center">
                <div className="h-24 w-full flex items-center justify-center border-b border-slate-300 dark:border-white/10 mb-2">
                  {quote.signatureData && (
                    quote.signatureData.startsWith('data:image') ? (
                        <img src={quote.signatureData} className="w-full h-full max-h-16 object-contain" alt="Assinatura" />
                    ) : (
                        <svg className="w-full h-full max-h-16" viewBox="0 0 400 150">
                        <path d={quote.signatureData} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                    )
                  )}
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Assinatura do Contratante</p>
                <p className="text-xs font-black">{quote.client?.name || 'Cliente'}</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-24 w-full flex items-center justify-center border-b border-slate-300 dark:border-white/10 mb-2">
                  {techSign ? (
                    techSign.startsWith('data:image') ? (
                        <img src={techSign} className="w-full h-full max-h-16 object-contain" alt="Assinatura" />
                    ) : (
                        <svg className="w-full h-full max-h-16" viewBox="0 0 400 150">
                        <path d={techSign} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                    )
                  ) : (
                    <span className="material-symbols-outlined text-4xl text-primary printable-icon">verified</span>
                  )}
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Assinatura do Contratado</p>
                <p className="text-xs font-black">{displayProfile?.companyName}</p>
              </div>
            </section>
          )}
        </main>

        {/* PRINT-ONLY REPEATED FOOTER (RUBRIC) */}
        {/* PRINT-ONLY REPEATED FOOTER (Signature/Rubric Unified) */}
        <div className="hidden print:flex fixed bottom-0 left-0 right-0 px-8 py-6 justify-between items-end bg-white z-50 border-t border-slate-100">
          <div className="flex gap-16 w-full">
            {/* Contratante */}
            <div className="flex flex-col items-center flex-1">
              <div className="h-16 w-full flex items-end justify-center border-b border-slate-900 mb-1">
                {quote.signatureData ? (
                  quote.signatureData.startsWith('data:image') ? (
                    <img src={quote.signatureData} className="h-full w-auto max-w-[200px] object-contain" alt="Assinatura" />
                  ) : (
                    <svg className="h-full w-auto max-w-[200px]" viewBox="0 0 400 150" preserveAspectRatio="xMidYMid meet">
                        <path d={quote.signatureData} fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  )
                ) : (
                  <div className="h-8 w-full"></div>
                )}
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center w-full">
                Assinatura Contratante
              </p>
              <p className="text-[8px] text-slate-400 font-medium truncate max-w-[200px]">{quote.client?.name || 'Cliente'}</p>
            </div>

            {/* Contratado */}
            <div className="flex flex-col items-center flex-1">
              <div className="h-16 w-full flex items-end justify-center border-b border-slate-900 mb-1">
                {techSign ? (
                  techSign.startsWith('data:image') ? (
                    <img src={techSign} className="h-full w-auto max-w-[200px] object-contain" alt="Assinatura" />
                  ) : (
                    <svg className="h-full w-auto max-w-[200px]" viewBox="0 0 400 150" preserveAspectRatio="xMidYMid meet">
                        <path d={techSign} fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  )
                ) : (
                  <div className="h-8 w-full"></div>
                )}
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center w-full">
                Assinatura Contratado
              </p>
              <p className="text-[8px] text-slate-400 font-medium truncate max-w-[200px]">{displayProfile?.companyName || displayProfile?.name}</p>
            </div>

            {/* Meta */}
            <div className="flex flex-col justify-end items-end w-40">
              <img src="https://i.imgur.com/6i2hhmf.png" className="h-6 mb-1 opacity-20 grayscale" alt="Gestor Pro" />
              <p className="text-[8px] text-slate-300 font-mono text-right leading-tight">
                Doc: {quote.contractNumber || quote.number}<br />
                Emissão: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER MOBILE UI & DESKTOP ACTIONS */}
        <footer className="fixed bottom-[90px] left-0 right-0 p-4 pb-4 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-t dark:border-white/5 z-50 no-print md:absolute md:bottom-0 md:left-0 md:bg-white md:dark:bg-surface-dark md:border-t-0 md:pb-4">
          <div className="max-w-md mx-auto space-y-3 md:max-w-none md:flex md:items-end md:justify-end md:space-y-0 md:gap-4 md:px-8">
            {quote.status === QuoteStatus.SENT && (
              <button
                onClick={() => updateQuoteStatus(quote.id, QuoteStatus.APPROVED)}
                className="w-full bg-primary py-4 rounded-xl text-white font-bold shadow-lg shadow-primary/30 active:scale-95 transition-transform md:w-auto md:px-8 md:py-3 md:text-sm md:rounded-lg"
              >
                Gerar Contrato de Serviço
              </button>
            )}

            {quote.status === QuoteStatus.APPROVED && (
              <button
                onClick={() => navigate(`/contract/${quote.id}`)}
                className="w-full bg-emerald-600 py-4 rounded-xl text-white font-bold shadow-lg shadow-emerald-600/30 active:scale-95 transition-transform flex items-center justify-center gap-2 md:w-auto md:px-8 md:py-3 md:text-sm md:rounded-lg"
              >
                <span className="material-symbols-outlined">description</span>
                Revisar Contrato e Finalizar
              </button>
            )}

            <div className="grid grid-cols-3 gap-2 md:flex md:gap-3">
              <button
                onClick={handleWhatsApp}
                className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl font-bold text-sm active:scale-95 transition-transform shadow-sm md:px-6 md:py-2 md:rounded-lg md:text-xs"
              >
                <span className="material-symbols-outlined text-sm">share</span> <span className="md:hidden lg:inline">WhatsApp</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 bg-indigo-500 text-white py-3 rounded-xl font-bold text-sm active:scale-95 transition-transform shadow-sm md:px-6 md:py-2 md:rounded-lg md:text-xs"
              >
                <span className="material-symbols-outlined text-sm">link</span> <span className="md:hidden lg:inline">Link</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-surface-dark border dark:border-white/5 py-3 rounded-xl font-bold text-sm active:scale-95 transition-transform md:px-6 md:py-2 md:rounded-lg md:text-xs md:hover:bg-slate-200"
              >
                <span className="material-symbols-outlined text-sm">picture_as_pdf</span> <span className="md:hidden lg:inline">PDF / Imprimir</span>
              </button>
            </div>
          </div>
        </footer>

        {showSuccessModal && quote && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-surface-dark w-full max-w-sm rounded-3xl p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
              <div className="flex flex-col items-center text-center">
                <div className="size-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-3xl">check</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Orçamento Criado!</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  O orçamento #{quote.number} foi salvo com sucesso.
                </p>

                {quote.accessPassword && (
                    <div className="bg-slate-100 dark:bg-white/5 p-3 rounded-xl mb-6 w-full border border-slate-200 dark:border-white/10">
                        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Senha de Acesso</p>
                        <div className="flex justify-between items-center">
                            <p className="text-xl font-mono font-black tracking-widest select-all">{quote.accessPassword}</p>
                            <span className="material-symbols-outlined text-slate-400 text-sm">lock</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">Envie esta senha para o cliente.</p>
                    </div>
                )}

                <div className="flex flex-col gap-3 w-full">
                  <button
                    onClick={() => {
                      window.open(`#/v/${quote.publicToken}`, '_blank');
                      setShowSuccessModal(false);
                    }}
                    className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">visibility</span>
                    Visualizar como Cliente
                  </button>

                  <button
                    onClick={() => {
                      handleWhatsApp();
                      setShowSuccessModal(false);
                    }}
                    className="w-full bg-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">share</span>
                    Enviar no WhatsApp
                  </button>

                  <button
                    onClick={() => setShowSuccessModal(false)}
                    className="mt-2 text-sm font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteSummary;
