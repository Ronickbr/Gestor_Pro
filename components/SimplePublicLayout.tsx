import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SimplePublicLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export const SimplePublicLayout: React.FC<SimplePublicLayoutProps> = ({ children, title }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-primary selection:text-white">
            <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <img src="https://i.imgur.com/6i2hhmf.png" className="size-10 object-contain rounded-xl shadow-lg shadow-primary/20" alt="Logo" />
                        <span className="font-black text-xl tracking-tight">Gestor<span className="text-primary">Pro</span></span>
                    </div>
                    <button onClick={() => navigate('/')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        Voltar
                    </button>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-6 pt-32 pb-20">
                {title && <h1 className="text-4xl font-black mb-8">{title}</h1>}
                {children}
            </div>

            <footer className="py-10 border-t border-white/5 text-center text-slate-500 text-sm">
                <p>&copy; 2024 Gestor Pro. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};
