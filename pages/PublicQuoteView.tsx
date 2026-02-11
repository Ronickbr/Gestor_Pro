
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Quote, QuoteStatus, QuoteStatusLabels } from '../types';
import { quotesService } from '../services/database';
import toast from 'react-hot-toast';
import DocumentLayout from '../components/DocumentLayout';
import WhatsAppFab from '../components/WhatsAppFab';

const PublicQuoteView: React.FC = () => {
    const { token } = useParams();
    const [quote, setQuote] = useState<Quote | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    // View state
    const [activeTab, setActiveTab] = useState<'quote' | 'contract'>('quote');

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
                setError(prev => prev || 'Erro ao verificar acesso.');
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
            
            // Mark as viewed (update timestamp to latest view)
            await quotesService.markAsViewed(data.id);
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
        if (confirm('Deseja realmente aprovar este orçamento?')) {
             try {
                await quotesService.publicUpdateStatus(quote.id, QuoteStatus.APPROVED);
                setQuote({ ...quote, status: QuoteStatus.APPROVED });
                toast.success('Orçamento aprovado com sucesso! Entraremos em contato em breve.');
            } catch (e) {
                toast.error('Erro ao aprovar orçamento.');
            }
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    if (requiresPassword) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <div className="mb-6 bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-primary">
                        <span className="material-symbols-outlined text-3xl">lock</span>
                    </div>
                    <h1 className="text-2xl font-bold mb-2 text-slate-800">Acesso Protegido</h1>
                    <p className="text-slate-500 mb-6">Este orçamento está protegido por senha. Por favor, digite a senha fornecida.</p>
                    
                    <form onSubmit={handlePasswordSubmit}>
                        <input
                            type="password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 mb-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            placeholder="Digite a senha"
                            autoFocus
                        />
                        {passwordError && <p className="text-red-500 text-sm mb-4">{passwordError}</p>}
                        <button
                            type="submit"
                            disabled={isVerifying}
                            className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors disabled:opacity-50"
                        >
                            {isVerifying ? 'Verificando...' : 'Acessar Orçamento'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (error || !quote) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 flex-col gap-4 p-4 text-center">
            <span className="material-symbols-outlined text-4xl">error</span>
            <p className="font-medium text-lg">{error || 'Orçamento não encontrado'}</p>
            <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
                Tentar Novamente
            </button>
        </div>
    );

    const servicesTotal = quote.services?.reduce((acc, s) => acc + (s.price || 0), 0) || 0;
    const materialsTotal = quote.materials?.reduce((acc, m) => acc + (m.totalPrice || 0), 0) || 0;
    const total = servicesTotal + materialsTotal;

    return (
        <div className="min-h-screen bg-slate-100 py-8 px-4 print:p-0 print:bg-white">
            {/* View Toggle - Hide on Print */}
            {quote.contractTerms && (
                <div className="max-w-4xl mx-auto mb-6 flex justify-center gap-4 print:hidden">
                    <button
                        onClick={() => setActiveTab('quote')}
                        className={`px-6 py-2 rounded-full font-medium transition-colors ${
                            activeTab === 'quote' ? 'bg-primary text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        Orçamento
                    </button>
                    <button
                        onClick={() => setActiveTab('contract')}
                        className={`px-6 py-2 rounded-full font-medium transition-colors ${
                            activeTab === 'contract' ? 'bg-primary text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        Contrato
                    </button>
                </div>
            )}

            <DocumentLayout
                company={quote.companyInfo}
                title={activeTab === 'quote' ? 'Orçamento de Serviço' : 'Contrato de Prestação de Serviços'}
                status={quote.status}
                watermark={true}
            >
                {/* Client Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 border-b border-slate-100 pb-8">
                    <div>
                        <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-3">Cliente</h3>
                        <p className="font-bold text-lg text-slate-800">{quote.client?.name || 'Cliente'}</p>
                        {quote.client?.document && <p className="text-sm text-slate-500 mb-1">CPF/CNPJ: {quote.client.document}</p>}
                        {quote.client?.address && <p className="text-sm text-slate-500 mb-1">{quote.client.address}</p>}
                        {quote.client?.phone && <p className="text-sm text-slate-500">{quote.client.phone}</p>}
                    </div>
                    <div className="md:text-right">
                        <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-3">Detalhes</h3>
                        <div className="space-y-1">
                            <p className="text-sm text-slate-600">
                                <span className="font-medium text-slate-400 mr-2">Número:</span> 
                                <span className="font-bold text-slate-800">#{quote.number}</span>
                            </p>
                            <p className="text-sm text-slate-600">
                                <span className="font-medium text-slate-400 mr-2">Data:</span> 
                                {new Date(quote.date).toLocaleDateString('pt-BR')}
                            </p>
                            <p className="text-sm text-slate-600">
                                <span className="font-medium text-slate-400 mr-2">Validade:</span> 
                                {new Date(quote.validUntil).toLocaleDateString('pt-BR')}
                            </p>
                        </div>
                    </div>
                </div>

                {activeTab === 'quote' ? (
                    <>
                        {/* Services Table */}
                        <div className="mb-10">
                            <h3 className="font-bold text-sm uppercase tracking-widest border-b-2 border-slate-900 pb-2 mb-4">Serviços</h3>
                            <table className="w-full text-sm text-left">
                                <thead>
                                    <tr className="border-b border-slate-200 text-slate-500">
                                        <th className="py-2 font-medium">Descrição</th>
                                        <th className="py-2 text-right w-32 font-medium">Valor</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {quote.services?.map(s => (
                                        <tr key={s.id}>
                                            <td className="py-3">
                                                <p className="font-bold text-slate-800">{s.name}</p>
                                                {s.description && <p className="text-xs text-slate-500 mt-0.5">{s.description}</p>}
                                            </td>
                                            <td className="py-3 text-right font-medium text-slate-700">
                                                {s.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Materials Table */}
                        {quote.materials && quote.materials.length > 0 && (
                            <div className="mb-10">
                                <h3 className="font-bold text-sm uppercase tracking-widest border-b-2 border-slate-900 pb-2 mb-4">Materiais</h3>
                                <table className="w-full text-sm text-left">
                                    <thead>
                                        <tr className="border-b border-slate-200 text-slate-500">
                                            <th className="py-2 font-medium">Item</th>
                                            <th className="py-2 text-center w-20 font-medium">Qtd</th>
                                            <th className="py-2 text-right w-32 font-medium">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {quote.materials.map(m => (
                                            <tr key={m.id}>
                                                <td className="py-3">
                                                    <p className="font-bold text-slate-800">{m.name}</p>
                                                    {m.brand && <p className="text-xs text-slate-500 mt-0.5">{m.brand}</p>}
                                                </td>
                                                <td className="py-3 text-center text-slate-600">{m.quantity}</td>
                                                <td className="py-3 text-right font-medium text-slate-700">
                                                    {m.totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Totals Section */}
                        <div className="flex flex-col md:flex-row gap-8 justify-end items-start border-t border-slate-200 pt-8 mb-12">
                            <div className="flex-1 w-full">
                                <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-3">Condições de Pagamento</h4>
                                <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-700 border border-slate-100">
                                    {quote.paymentTerms}
                                </div>
                                <div className="mt-4">
                                    <p className="text-xs text-slate-500"><span className="font-bold">Garantia:</span> {quote.warrantyDuration} meses</p>
                                    {quote.completionDate && (
                                        <p className="text-xs text-slate-500"><span className="font-bold">Previsão de Entrega:</span> {new Date(quote.completionDate).toLocaleDateString('pt-BR')}</p>
                                    )}
                                </div>
                            </div>
                            <div className="w-full md:w-64">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-slate-500">
                                        <span>Serviços</span>
                                        <span>{servicesTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-slate-500">
                                        <span>Materiais</span>
                                        <span>{materialsTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                    </div>
                                    <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between items-end">
                                        <span className="font-bold text-slate-800">TOTAL</span>
                                        <span className="font-black text-2xl text-primary">
                                            {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="prose prose-sm max-w-none text-justify whitespace-pre-wrap leading-relaxed font-serif text-slate-800">
                        {quote.contractTerms}
                    </div>
                )}

                {/* Signatures */}
                <div className="mt-16 pt-8 border-t border-slate-200 break-inside-avoid">
                    <div className="grid grid-cols-2 gap-12">
                        <div className="text-center">
                            <div className="h-20 border-b border-slate-900 mb-2 flex items-end justify-center">
                                {quote.signatureData && (
                                    quote.signatureData.startsWith('data:image') ? (
                                        <img src={quote.signatureData} className="h-full w-auto object-contain" alt="Assinatura Cliente" />
                                    ) : (
                                        <img src={`data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 150"><path d="' + quote.signatureData + '" fill="none" stroke="black" stroke-width="3" stroke-linecap="round"/></svg>')}`} className="h-full w-auto" alt="Assinatura Cliente" />
                                    )
                                )}
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Contratante</p>
                            <p className="font-bold text-sm text-slate-800">{quote.client?.name}</p>
                        </div>
                        <div className="text-center">
                            <div className="h-20 border-b border-slate-900 mb-2 flex items-end justify-center">
                                {quote.companyInfo?.techSignature && (
                                    quote.companyInfo.techSignature.startsWith('data:image') ? (
                                        <img src={quote.companyInfo.techSignature} className="h-full w-auto object-contain" alt="Assinatura Técnico" />
                                    ) : (
                                        <img src={`data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 150"><path d="' + quote.companyInfo.techSignature + '" fill="none" stroke="black" stroke-width="3" stroke-linecap="round"/></svg>')}`} className="h-full w-auto" alt="Assinatura Técnico" />
                                    )
                                )}
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Contratado</p>
                            <p className="font-bold text-sm text-slate-800">{quote.companyInfo?.companyName || quote.companyInfo?.name}</p>
                        </div>
                    </div>
                </div>

                {/* Actions Bar (Print Only Hidden) */}
                <div className="mt-12 flex justify-center gap-4 print:hidden">
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 font-medium text-slate-700 transition-all"
                    >
                        <span className="material-symbols-outlined">print</span>
                        Imprimir / Salvar PDF
                    </button>
                    
                    {quote.status !== QuoteStatus.APPROVED && quote.status !== QuoteStatus.REJECTED && quote.status !== QuoteStatus.COMPLETED && (
                        <button
                            onClick={handleApprove}
                            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 font-bold transition-all transform hover:scale-105"
                        >
                            <span className="material-symbols-outlined">check_circle</span>
                            Aprovar Orçamento
                        </button>
                    )}
                </div>
            </DocumentLayout>

            <WhatsAppFab 
                phone={quote.companyInfo?.phone}
                status={quote.status}
                mode="client"
                companyName={quote.companyInfo?.companyName || quote.companyInfo?.name}
                quoteNumber={quote.number}
                publicUrl={quote.publicToken ? `${window.location.origin}/#/v/${quote.publicToken}` : undefined}
            />
        </div>
    );
};

export default PublicQuoteView;
