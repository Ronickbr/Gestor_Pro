
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Quote, QuoteStatus } from '../types';
import { quotesService } from '../services/database';
import { QuotePrintView } from '../components/PrintViews';
import toast from 'react-hot-toast';

const PublicQuoteView: React.FC = () => {
    const { token } = useParams();
    const [quote, setQuote] = useState<Quote | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Password protection state
    const [requiresPassword, setRequiresPassword] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    useEffect(() => {
        const checkAndLoad = async () => {
            if (!token) return;
            try {
                // 1. Check if password is required
                const access = await quotesService.checkPublicQuoteAccess(token);
                
                if (!access.exists) {
                    setError('Orçamento não encontrado ou expirado.');
                    setIsLoading(false);
                    return;
                }

                if (access.requires_password) {
                    setRequiresPassword(true);
                    setIsLoading(false);
                } else {
                    // No password needed, load directly
                    await loadQuoteData();
                }
            } catch (err) {
                console.error(err);
                setError('Erro ao verificar acesso.');
                setIsLoading(false);
            }
        };
        checkAndLoad();
    }, [token]);

    const loadQuoteData = async (password?: string) => {
        if (!token) return;
        try {
            const data = await quotesService.getQuoteByToken(token, password);
            setQuote(data);
            setRequiresPassword(false); // Success
        } catch (err) {
            console.error(err);
            if (password) {
                setPasswordError('Senha incorreta.');
            } else {
                setError('Orçamento não encontrado ou expirado.');
            }
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!passwordInput) return;
        
        setIsVerifying(true);
        setPasswordError('');
        
        try {
            await loadQuoteData(passwordInput);
        } catch (e) {
            // Error handled in loadQuoteData
        } finally {
            setIsVerifying(false);
        }
    };

    const handleApprove = async () => {
        if (!quote) return;
        try {
            await quotesService.publicUpdateStatus(quote.id, QuoteStatus.APPROVED);
            setQuote({ ...quote, status: QuoteStatus.APPROVED });
            toast.success('Orçamento aprovado com sucesso! Entraremos em contato em breve.');
        } catch (e) {
            toast.error('Erro ao aprovar orçamento.');
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center">
                <span className="material-symbols-outlined animate-spin text-4xl text-primary mb-4">sync</span>
                <p className="text-slate-500 font-medium">Carregando proposta...</p>
            </div>
        </div>
    );

    if (requiresPassword) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center">
                <div className="size-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                    <span className="material-symbols-outlined text-3xl">lock</span>
                </div>
                <h1 className="text-xl font-bold mb-2 text-slate-900">Acesso Protegido</h1>
                <p className="text-slate-500 mb-6 text-sm">Este orçamento está protegido por senha. Digite a senha enviada pelo prestador para visualizar.</p>
                
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="relative">
                        <input 
                            type="text" 
                            className={`w-full bg-slate-50 border-none rounded-xl h-12 px-4 font-bold text-center tracking-widest focus:ring-2 focus:ring-primary ${passwordError ? 'ring-2 ring-red-500/50 bg-red-50' : ''}`}
                            placeholder="0 0 0 0"
                            value={passwordInput}
                            onChange={e => setPasswordInput(e.target.value)}
                            maxLength={8}
                        />
                    </div>
                    {passwordError && (
                        <p className="text-xs font-bold text-red-500 animate-in slide-in-from-top-1">{passwordError}</p>
                    )}
                    <button 
                        type="submit"
                        disabled={!passwordInput || isVerifying}
                        className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                    >
                        {isVerifying ? (
                            <>
                                <span className="material-symbols-outlined animate-spin text-lg">sync</span>
                                Verificando...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined">key</span>
                                Acessar Orçamento
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );

    if (error || !quote) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 text-center">
            <div className="max-w-md bg-white p-8 rounded-2xl shadow-lg">
                <span className="material-symbols-outlined text-6xl text-red-400 mb-4">error</span>
                <h1 className="text-xl font-bold mb-2">Link Inválido</h1>
                <p className="text-slate-500">{error || 'Não foi possível carregar o orçamento.'}</p>
            </div>
        </div>
    );

    const servicesTotal = quote.services?.reduce((acc, s) => acc + s.price, 0) || 0;
    const materialsTotal = quote.materials?.reduce((acc, m) => acc + m.totalPrice, 0) || 0;
    const total = servicesTotal + materialsTotal;

    return (
      <>
        <div className="print:hidden">
          <div className="min-h-screen bg-slate-50 py-8 px-4 font-sans text-slate-900 md:py-12">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden print:shadow-none ring-1 ring-slate-900/5">
                {/* Header */}
                <header className="bg-primary text-white p-8 text-center print:bg-white print:text-black print:p-0 print:border-b-2 print:border-black print:mb-8">
                    {quote.companyInfo ? (
                        <div className="flex flex-col items-center mb-6">
                            {quote.companyInfo.logo && (
                                <img src={quote.companyInfo.logo} alt="Logo" className="h-20 w-auto object-contain mb-4 bg-white p-2 rounded-lg" />
                            )}
                            <h2 className="text-xl font-bold opacity-90">{quote.companyInfo.companyName || quote.companyInfo.name}</h2>
                            <div className="text-xs opacity-75 mt-1 space-x-2">
                                <span>{quote.companyInfo.document}</span>
                                {quote.companyInfo.phone && <span>• {quote.companyInfo.phone}</span>}
                            </div>
                        </div>
                    ) : (
                        <p className="opacity-80 text-xs font-bold tracking-widest uppercase mb-2">Proposta Comercial</p>
                    )}

                    <h1 className="text-4xl font-black mb-1 tracking-tight">{quote.contractNumber || quote.number}</h1>
                    <p className="text-sm opacity-90 mt-2 font-medium bg-white/10 inline-block px-3 py-1 rounded-full">
                        Emitido em {new Date(quote.date || new Date().toISOString()).toLocaleDateString('pt-BR')}
                    </p>
                </header>

                <main className="p-8 space-y-8">

                    {/* Status Banner */}
                    {quote.status === QuoteStatus.APPROVED && (
                        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl flex items-center gap-3 border border-emerald-100">
                            <span className="material-symbols-outlined filled">check_circle</span>
                            <div>
                                <p className="font-bold">Proposta Aprovada</p>
                                <p className="text-xs">Obrigado pela preferência!</p>
                            </div>
                        </div>
                    )}

                    {/* Client Info */}
                    <section>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b pb-2">Cliente</h3>
                        <div className="flex items-start gap-4">
                            <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 font-bold text-xl uppercase">
                                {(quote.client?.name || 'C').charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-lg">{quote.client?.name || 'Cliente'}</p>
                                <p className="text-sm text-slate-500">{quote.client?.document || ''}</p>
                                <p className="text-sm text-slate-500">{quote.client?.address || ''}</p>
                            </div>
                        </div>
                    </section>

                    {/* Items */}
                    <section>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b pb-2">Serviços e Materiais</h3>
                        <div className="space-y-4">
                            {quote.services?.map(s => (
                                <div key={s.id} className="flex justify-between items-start">
                                    <div className="pr-4">
                                        <p className="font-bold text-sm">{s.name}</p>
                                        <p className="text-xs text-slate-500">{s.description}</p>
                                    </div>
                                    <p className="font-bold text-sm">R$ {s.price.toLocaleString('pt-BR')}</p>
                                </div>
                            ))}
                            {quote.materials && quote.materials.length > 0 && (
                                <div className="pt-4 border-t border-dashed">
                                    {quote.materials.map(m => (
                                        <div key={m.id} className="flex justify-between items-center py-1 text-sm text-slate-600">
                                            <span>{m.quantity}x {m.name}</span>
                                            <span>R$ {m.totalPrice.toLocaleString('pt-BR')}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="mt-6 pt-6 border-t flex justify-between items-center">
                            <span className="font-black text-slate-400 text-xs uppercase">Valor Total</span>
                            <span className="font-black text-3xl text-primary">R$ {total.toLocaleString('pt-BR')}</span>
                        </div>
                    </section>

                    {/* Terms */}
                    {/* Terms */}
                    <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <h3 className="font-bold text-slate-700 uppercase mb-4 text-xs tracking-widest">Condições Gerais</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Validade da Proposta</p>
                                <p className="font-bold text-slate-900">
                                    {new Date(quote.validUntil).toLocaleDateString('pt-BR')}
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Garantia</p>
                                <p className="font-bold text-slate-900">
                                    {quote.warrantyDuration} Meses
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Pagamento</p>
                                <p className="font-bold text-slate-900">
                                    {quote.paymentTerms || 'A combinar'}
                                </p>
                            </div>
                        </div>
                    </section>

                </main>

                {/* Actions Footer */}
                {quote.status === QuoteStatus.SENT && (
                    <footer className="bg-slate-50 p-6 border-t flex flex-col sm:flex-row gap-4 justify-center print:hidden">
                        <button
                            onClick={() => window.print()}
                            className="bg-white border border-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">print</span> Imprimir / PDF
                        </button>
                        <button
                            onClick={handleApprove}
                            className="bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">check</span> Aprovar Orçamento
                        </button>
                    </footer>
                )}
            </div>

            <footer className="text-center mt-12 text-xs text-slate-400 pb-8 no-print flex flex-col items-center">
                <img src="https://i.imgur.com/6i2hhmf.png" className="h-6 w-auto opacity-50 mb-2 grayscale" alt="Gestor Pro" />
                <p>Gerado via Gestor Pro</p>
                <p className="mt-1 opacity-50">Tecnologia Segura</p>
            </footer>
          </div>
        </div>
        <div className="hidden print:block">
            <QuotePrintView quote={quote} profile={quote.companyInfo || null} onBack={() => {}} />
        </div>
      </>
    );
};

export default PublicQuoteView;
