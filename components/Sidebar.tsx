import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDialog } from '../contexts/DialogContext';
import { supabase } from '../lib/supabase';

export const Sidebar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { confirm } = useDialog();

    const handleLogout = async () => {
        const confirmed = await confirm({
            title: 'Sair da Conta',
            message: 'Tem certeza que deseja sair?',
            confirmLabel: 'Sair',
            cancelLabel: 'Cancelar',
            variant: 'danger'
        });

        if (confirmed) {
            await supabase.auth.signOut();
            localStorage.removeItem('gestor_pro_auth');
            navigate('/login');
        }
    };

    // Don't show nav on these pages
    if (['/', '/login', '/subscription', '/landing', '/terms', '/privacy', '/contact'].includes(location.pathname) || location.pathname.startsWith('/v/')) return null;

    const tabs = [
        { path: '/dashboard', label: 'Início', icon: 'dashboard' },
        { path: '/quotes', label: 'Orçamentos', icon: 'request_quote' },
        { path: '/clients', label: 'Clientes', icon: 'group' },
        { path: '/contract-templates', label: 'Modelos de Contrato', icon: 'description' },
        { path: '/feedback', label: 'Feedback', icon: 'rate_review' },
        { path: '/settings', label: 'Configurações', icon: 'settings' }
    ];

    return (
        <aside className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full bg-white dark:bg-surface-dark border-r border-slate-200 dark:border-white/5 md:translate-x-0 hidden md:flex flex-col">
            <div className="h-20 flex items-center px-6 border-b border-slate-100 dark:border-white/5">
                <img src="https://i.imgur.com/6i2hhmf.png" className="h-8 w-auto object-contain" alt="Gestor Pro" />
                <span className="ml-3 font-black text-lg text-slate-900 dark:text-white tracking-tight">Gestor<span className="text-primary">Pro</span></span>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                {tabs.map((tab) => {
                    const isActive = location.pathname === tab.path;
                    return (
                        <button
                            key={tab.path}
                            onClick={() => navigate(tab.path)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm group ${isActive
                                ? 'bg-primary/10 text-primary font-bold'
                                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            <span className={`material-symbols-outlined ${isActive ? 'filled' : ''}`}>{tab.icon}</span>
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-white/5 space-y-3">
                <button
                    onClick={() => navigate('/new-quote')}
                    className="w-full bg-primary text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined">add</span>
                    Novo Orçamento
                </button>

                <button
                    onClick={handleLogout}
                    className="w-full bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-bold py-3 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-all flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined">logout</span>
                    Sair
                </button>
            </div>

            <div className="p-4 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Versão {import.meta.env.PACKAGE_VERSION}</p>
            </div>
        </aside>
    );
};
