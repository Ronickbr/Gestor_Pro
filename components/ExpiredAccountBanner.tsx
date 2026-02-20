import React from 'react';

export const ExpiredAccountBanner: React.FC = () => {
    return (
        <div className="flex flex-col items-center text-center gap-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Período de teste ou assinatura expirado
            </span>
            <div className="space-y-3 max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
                    Desbloqueie seu acesso
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                    Sua conta está pausada. Escolha um plano abaixo para retomar o acesso imediato a todas as ferramentas do Gestor Pro.
                </p>
            </div>
        </div>
    );
};

