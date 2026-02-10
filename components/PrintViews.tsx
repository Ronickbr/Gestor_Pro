import React from 'react';
import { Quote, CompanyInfo } from '../types';

interface PrintViewProps {
  quote: Quote;
  profile: CompanyInfo | null;
  onBack: () => void;
}

const PrintHeader: React.FC<{ profile: CompanyInfo | null, title: string, subTitle: string }> = ({ profile, title, subTitle }) => (
  <div className="flex justify-between items-start mb-8 border-b border-slate-900 pb-6">
    <div className="flex-1">
      {profile?.logo && (
        <img src={profile.logo} className="h-20 w-auto object-contain mb-4" alt="Logo" />
      )}
      <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{title}</h1>
      <p className="text-sm font-bold text-slate-500">{subTitle}</p>
    </div>
    <div className="text-right">
      <h2 className="font-bold text-lg text-slate-900">{profile?.companyName}</h2>
      <p className="text-xs text-slate-500">{profile?.document}</p>
      <p className="text-xs text-slate-500">{profile?.address}</p>
      <p className="text-xs text-slate-500">{profile?.email}</p>
      <p className="text-xs text-slate-500">{profile?.phone}</p>
    </div>
  </div>
);

const PrintFooter: React.FC<{ quote: Quote, profile: CompanyInfo | null }> = ({ quote, profile }) => (
  <div className="mt-12 pt-8 border-t border-slate-200 break-inside-avoid">
    <div className="flex justify-between gap-8">
      <div className="flex-1 flex flex-col items-center">
        <div className="h-16 w-full border-b border-slate-900 mb-2 flex items-end justify-center">
             {quote.signatureData && (
                quote.signatureData.startsWith('data:image') ? (
                    <img src={quote.signatureData} className="h-full w-auto object-contain" alt="Assinatura Cliente" />
                ) : (
                    <img src={`data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 150"><path d="' + quote.signatureData + '" fill="none" stroke="black" stroke-width="3" stroke-linecap="round"/></svg>')}`} className="h-full w-auto" alt="Assinatura Cliente" />
                )
             )}
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">CONTRATANTE</p>
        <p className="text-xs font-bold text-slate-900">{quote.client?.name || 'Cliente'}</p>
        <p className="text-[10px] text-slate-400">{quote.client?.document || ''}</p>
      </div>
      <div className="flex-1 flex flex-col items-center">
        <div className="h-16 w-full border-b border-slate-900 mb-2 flex items-end justify-center">
             {profile?.techSignature && (
                profile.techSignature.startsWith('data:image') ? (
                    <img src={profile.techSignature} className="h-full w-auto object-contain" alt="Assinatura Técnico" />
                ) : (
                    <img src={`data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 150"><path d="' + profile.techSignature + '" fill="none" stroke="black" stroke-width="3" stroke-linecap="round"/></svg>')}`} className="h-full w-auto" alt="Assinatura Técnico" />
                )
             )}
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">CONTRATADO</p>
        <p className="text-xs font-bold text-slate-900">{profile?.companyName || profile?.name}</p>
        <p className="text-[10px] text-slate-400">{profile?.document}</p>
      </div>
    </div>
    <div className="text-center mt-8 text-[10px] text-slate-400">
        Documento gerado em {new Date().toLocaleDateString('pt-BR')} via Gestor Pro
    </div>
  </div>
);

const PrintControls: React.FC<{ onBack: () => void }> = ({ onBack }) => (
    <div className="fixed top-4 right-4 print:hidden flex gap-2 z-50">
        <button onClick={() => window.print()} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 font-bold flex items-center gap-2">
            <span className="material-symbols-outlined">print</span> Imprimir
        </button>
        <button onClick={onBack} className="bg-white text-slate-700 px-4 py-2 rounded-lg shadow-lg hover:bg-slate-50 font-bold border border-slate-200">
            Voltar
        </button>
    </div>
);

export const ContractPrintView: React.FC<PrintViewProps> = ({ quote, profile, onBack }) => {
  return (
    <div className="bg-white min-h-screen p-8 md:p-16 max-w-4xl mx-auto text-slate-900">
      <PrintControls onBack={onBack} />
      <PrintHeader profile={profile} title="Contrato de Prestação de Serviços" subTitle={`Nº ${quote.contractNumber || quote.number}`} />

      <div className="mb-8">
        <h3 className="font-bold text-sm uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">Dados do Cliente</h3>
        <p className="text-sm"><span className="font-bold">Nome:</span> {quote.client?.name || 'Cliente'}</p>
        <p className="text-sm"><span className="font-bold">Documento:</span> {quote.client?.document || ''}</p>
        <p className="text-sm"><span className="font-bold">Endereço:</span> {quote.client?.address || ''}</p>
        <p className="text-sm"><span className="font-bold">Telefone:</span> {quote.client?.phone || ''}</p>
      </div>

      <div className="mb-8 prose prose-sm max-w-none text-justify whitespace-pre-wrap leading-relaxed font-serif text-slate-800">
        {quote.contractTerms}
      </div>

      <PrintFooter quote={quote} profile={profile} />
    </div>
  );
};

export const WarrantyPrintView: React.FC<PrintViewProps> = ({ quote, profile, onBack }) => {
    return (
      <div className="bg-white min-h-screen p-8 md:p-16 max-w-4xl mx-auto text-slate-900 border-8 border-double border-slate-200 m-4">
        <PrintControls onBack={onBack} />
        <div className="text-center mb-12">
            {profile?.logo && <img src={profile.logo} className="h-24 w-auto object-contain mx-auto mb-6" alt="Logo" />}
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-widest mb-2">Certificado de Garantia</h1>
            <p className="text-slate-500 font-bold">Nº {quote.contractNumber || quote.number}</p>
        </div>

        <div className="mb-12 text-center max-w-2xl mx-auto">
            <p className="text-lg leading-relaxed">
                Certificamos para os devidos fins que o serviço realizado para <span className="font-bold">{quote.client?.name || 'Cliente'}</span> possui garantia ativa conforme as condições abaixo.
            </p>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-12">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Data de Conclusão</p>
                <p className="text-2xl font-black text-slate-900">{quote.completionDate ? new Date(quote.completionDate).toLocaleDateString('pt-BR') : '-'}</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Válido Até</p>
                <p className="text-2xl font-black text-emerald-600">{quote.warrantyUntil ? new Date(quote.warrantyUntil).toLocaleDateString('pt-BR') : '-'}</p>
            </div>
        </div>

        <div className="mb-12">
            <h3 className="font-bold text-center text-sm uppercase tracking-widest border-b border-slate-200 pb-2 mb-6">Serviços Cobertos</h3>
            <ul className="list-disc pl-5 space-y-2">
                {quote.services?.map(s => (
                    <li key={s.id} className="text-sm">
                        <span className="font-bold">{s.name}</span> - {s.description}
                    </li>
                ))}
            </ul>
        </div>

        <div className="mb-12">
            <h3 className="font-bold text-center text-sm uppercase tracking-widest border-b border-slate-200 pb-2 mb-6">Equipamentos Instalados</h3>
            <ul className="list-disc pl-5 space-y-2">
                {quote.materials?.map(m => (
                    <li key={m.id} className="text-sm">
                        {m.quantity}x <span className="font-bold">{m.name}</span> ({m.brand})
                    </li>
                ))}
            </ul>
        </div>

        <div className="mt-auto">
             <PrintFooter quote={quote} profile={profile} />
        </div>
      </div>
    );
  };

export const QuotePrintView: React.FC<PrintViewProps> = ({ quote, profile, onBack }) => {
    const servicesTotal = quote.services?.reduce((acc, s) => acc + s.price, 0) || 0;
    const materialsTotal = quote.materials?.reduce((acc, m) => acc + m.totalPrice, 0) || 0;
    const total = servicesTotal + materialsTotal;

    return (
      <div className="bg-white min-h-screen p-8 md:p-16 max-w-4xl mx-auto text-slate-900">
        <PrintControls onBack={onBack} />
        <PrintHeader profile={profile} title="Orçamento de Serviço" subTitle={`Nº ${quote.number}`} />

        {/* Client & Info Grid */}
        <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
                <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-2">Cliente</h3>
                <p className="font-bold text-sm">{quote.client?.name || 'Cliente'}</p>
                <p className="text-xs text-slate-500">{quote.client?.address || ''}</p>
                <p className="text-xs text-slate-500">Doc: {quote.client?.document || ''}</p>
                <p className="text-xs text-slate-500">Tel: {quote.client?.phone || ''}</p>
            </div>
            <div className="text-right">
                <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-2">Resumo</h3>
                <p className="text-xs text-slate-500">Data: {new Date(quote.date).toLocaleDateString('pt-BR')}</p>
                <p className="text-xs text-slate-500">Validade: {new Date(quote.validUntil).toLocaleDateString('pt-BR')}</p>
                <p className="text-xs text-slate-500">Garantia: {quote.warrantyDuration} Meses</p>
            </div>
        </div>

        {/* Services Table */}
        <div className="mb-8">
            <h3 className="font-bold text-sm uppercase tracking-widest border-b-2 border-slate-900 pb-2 mb-4">Serviços</h3>
            <table className="w-full text-sm text-left">
                <thead>
                    <tr className="border-b border-slate-200">
                        <th className="py-2 font-bold">Descrição</th>
                        <th className="py-2 text-right w-32">Valor</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {quote.services?.map(s => (
                        <tr key={s.id}>
                            <td className="py-3">
                                <p className="font-bold">{s.name}</p>
                                <p className="text-xs text-slate-500">{s.description}</p>
                            </td>
                            <td className="py-3 text-right font-medium">R$ {s.price.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Materials Table */}
        {quote.materials && quote.materials.length > 0 && (
            <div className="mb-8">
                <h3 className="font-bold text-sm uppercase tracking-widest border-b-2 border-slate-900 pb-2 mb-4">Materiais</h3>
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="border-b border-slate-200">
                            <th className="py-2 font-bold">Item</th>
                            <th className="py-2 text-center w-24">Qtd</th>
                            <th className="py-2 text-right w-32">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {quote.materials.map(m => (
                            <tr key={m.id}>
                                <td className="py-3">
                                    <p className="font-bold">{m.name}</p>
                                    <p className="text-xs text-slate-500">{m.brand}</p>
                                </td>
                                <td className="py-3 text-center">{m.quantity}</td>
                                <td className="py-3 text-right font-medium">R$ {m.totalPrice.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        {/* Totals */}
        <div className="flex justify-end mb-12">
            <div className="w-64 bg-slate-50 p-6 rounded-xl border border-slate-200">
                <div className="flex justify-between mb-2 text-xs text-slate-500">
                    <span>Serviços</span>
                    <span>R$ {servicesTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-4 text-xs text-slate-500">
                    <span>Materiais</span>
                    <span>R$ {materialsTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-slate-200 font-black text-lg text-slate-900">
                    <span>Total</span>
                    <span>R$ {total.toFixed(2)}</span>
                </div>
            </div>
        </div>

        {/* Payment Terms */}
        <div className="mb-8 p-4 border border-slate-200 rounded-lg text-sm bg-slate-50">
            <p className="font-bold mb-1">Forma de Pagamento:</p>
            <p>{quote.paymentTerms}</p>
        </div>
        
        <div className="mt-auto">
           {/* Only show signatures if signed or forced */}
           <PrintFooter quote={quote} profile={profile} />
        </div>
      </div>
    );
  };
