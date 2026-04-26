import React, { useState, useEffect } from 'react';
import { usePwaInstall } from '../hooks/usePwaInstall';
import { Button } from './ui/Button';

export const PwaInstallBanner: React.FC = () => {
  const { isInstallable, isStandalone, isIos, showInstallPrompt } = usePwaInstall();
  const [isVisible, setIsVisible] = useState(false);
  const [isIosPromptOpen, setIsIosPromptOpen] = useState(false);

  useEffect(() => {
    // Só mostra se não estiver instalado
    if (!isStandalone) {
      // Pequeno delay para não assustar o usuário
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [isStandalone]);

  // Se já estiver em modo standalone ou o navegador não for compatível com o prompt (e não for iOS), não mostra nada
  if (isStandalone) return null;
  if (!isInstallable && !isIos) return null;
  if (!isVisible) return null;

  return (
    <>
      <div className="fixed bottom-24 left-4 right-4 z-[60] animate-in slide-in-from-bottom-8 duration-500 md:bottom-8 md:right-8 md:left-auto md:w-80">
        <div className="glass shadow-2xl shadow-primary/20 rounded-2xl p-5 border border-primary/10 overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
          
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">download_for_offline</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Instalar Gestor Pro</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                Use como aplicativo para acesso offline e melhor experiência.
              </p>
              
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  className="px-4 text-[11px]" 
                  onClick={isIos ? () => setIsIosPromptOpen(true) : showInstallPrompt}
                >
                  Instalar agora
                </Button>
                <button 
                  onClick={() => setIsVisible(false)}
                  className="text-[11px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2"
                >
                  Depois
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Instruções iOS */}
      {isIosPromptOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsIosPromptOpen(false)}>
          <div className="w-full max-w-sm bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-4" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center">
              <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-4xl">apple</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Instalar no iPhone</h3>
              <p className="text-sm text-slate-500 mb-6">Siga estes passos para adicionar à sua tela de início:</p>
              
              <div className="space-y-4 w-full text-left">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-sm font-bold">1</div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Toque no ícone de <span className="font-bold">Compartilhar</span> <span className="material-symbols-outlined text-primary text-sm inline-block translate-y-0.5">ios_share</span> na barra inferior do Safari.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-sm font-bold">2</div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Role para baixo e selecione <span className="font-bold">"Adicionar à Tela de Início"</span>.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-sm font-bold">3</div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Toque em <span className="font-bold">"Adicionar"</span> no canto superior direito.</p>
                </div>
              </div>

              <Button className="w-full mt-8" onClick={() => setIsIosPromptOpen(false)}>Entendi</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
