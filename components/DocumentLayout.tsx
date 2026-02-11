
import React from 'react';
import { CompanyInfo, QuoteStatus, QuoteStatusLabels } from '../types';

interface DocumentLayoutProps {
  children: React.ReactNode;
  company?: CompanyInfo;
  title: string;
  status?: QuoteStatus;
  watermark?: boolean;
}

const DocumentLayout: React.FC<DocumentLayoutProps> = ({ 
  children, 
  company, 
  title, 
  status,
  watermark = false
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-xl print:shadow-none min-h-[29.7cm] relative overflow-hidden">
      {/* Watermark for Draft/Cancelled */}
      {watermark && status && (status === QuoteStatus.DRAFT || status === QuoteStatus.REJECTED) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-10">
          <span className="text-9xl font-bold -rotate-45 uppercase text-slate-500">
            {QuoteStatusLabels[status]}
          </span>
        </div>
      )}

      {/* Header */}
      <header className="bg-slate-50 border-b border-slate-200 p-8 print:p-6 flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="flex items-center gap-4">
          {company?.logo ? (
            <img src={company.logo} alt="Logo" className="h-20 w-auto object-contain max-w-[200px]" />
          ) : (
            <div className="h-20 w-20 bg-slate-200 rounded flex items-center justify-center text-slate-400">
              Logo
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{company?.companyName || company?.name}</h1>
            <p className="text-sm text-slate-500">{company?.document}</p>
          </div>
        </div>

        <div className="text-right text-sm text-slate-600">
          <p className="font-medium">{company?.email}</p>
          <p>{company?.phone}</p>
          <p className="max-w-[250px] ml-auto">{company?.address}</p>
        </div>
      </header>

      {/* Document Title Bar */}
      <div className="bg-primary/5 border-y border-primary/10 px-8 py-3 print:px-6 flex justify-between items-center">
        <h2 className="text-lg font-bold text-primary uppercase tracking-wide">{title}</h2>
        {status && (
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
            ${status === QuoteStatus.APPROVED ? 'bg-green-100 text-green-700' : 
              status === QuoteStatus.SENT ? 'bg-blue-100 text-blue-700' : 
              'bg-slate-100 text-slate-700'}`}>
            {QuoteStatusLabels[status]}
          </span>
        )}
      </div>

      {/* Content Body */}
      <main className="p-8 print:p-6 relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-100 p-8 print:p-6 text-center text-xs text-slate-400">
        <p>Documento gerado digitalmente em {new Date().toLocaleDateString()}</p>
        <p className="mt-1">{company?.companyName} • {company?.email}</p>
      </footer>
    </div>
  );
};

export default DocumentLayout;
