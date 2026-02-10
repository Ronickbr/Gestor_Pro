
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useDialog } from '../contexts/DialogContext';
import { ContractTemplate } from '../types';
import { SERVICE_CATEGORIES } from '../constants';
import { profileService } from '../services/database';

import { CONTRACT_VARIABLES_HELP } from '../services/contractGenerator';

const ContractTemplates: React.FC = () => {
  const navigate = useNavigate();
  const { confirm } = useDialog();
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [editing, setEditing] = useState<ContractTemplate | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  /* Note: To implement Delete properly, we'd need a deleteTemplate in storage.ts. 
     For now, we just edit/add. If user needs delete, I can add it later. */

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const profile = await profileService.getProfile();
      if (profile.contractTemplates && profile.contractTemplates.length > 0) {
        setTemplates(profile.contractTemplates);
      } else {
        // Load defaults
        const defaults = SERVICE_CATEGORIES.map(cat => ({
          id: cat.id,
          name: cat.name,
          icon: cat.icon,
          content: cat.contractTemplate
        }));
        setTemplates(defaults);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleGenerateAI = async () => {
    if (!editing?.name) return toast.error('Dê um nome ao modelo primeiro para orientar a IA.');
    
    setIsGenerating(true);
    try {
      const { generateTemplate } = await import('../services/ai');
      const text = await generateTemplate(editing.name);
      setEditing(prev => prev ? { ...prev, content: text } : null);
    } catch (error: any) {
      if (error.message === 'MISSING_API_KEY' || error.message === 'INVALID_API_KEY') {
        const confirmed = await confirm({
            title: 'Configurar IA',
            message: 'Para usar a Inteligência Artificial, você precisa configurar sua chave de API do Google Gemini. Deseja configurar agora? É gratuito.',
            confirmLabel: 'Configurar',
            cancelLabel: 'Depois',
            variant: 'info'
        });
        if (confirmed) {
          navigate('/settings');
        }
      } else {
        toast.error('Erro ao gerar modelo: ' + (error.message || 'Erro desconhecido'));
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (editing) {
      if (!editing.name.trim()) return toast.error('Nome é obrigatório');

      try {
        const newTemplates = [...templates];
        const index = newTemplates.findIndex(t => t.id === editing.id);
        if (index >= 0) {
          newTemplates[index] = editing;
        } else {
          newTemplates.push(editing);
        }

        await profileService.updateProfile({ contractTemplates: newTemplates });
        setTemplates(newTemplates);
        setEditing(null);
        toast.success('Modelo salvo!');
      } catch (e) {
        toast.error('Erro ao salvar modelo.');
      }
    }
  };

  const handleCreate = () => {
    setEditing({
      id: crypto.randomUUID(),
      name: '',
      icon: 'description',
      content: ''
    });
  };

  /* Note: To implement Delete properly, we'd need a deleteTemplate in storage.ts. 
     For now, we just edit/add. If user needs delete, I can add it later. */

  if (editing) {
    return (
      <div className="flex flex-col h-screen w-full md:max-w-5xl mx-auto bg-background-light dark:bg-background-dark md:py-8 md:px-4">
        <div className="w-full h-full md:bg-white md:dark:bg-surface-dark md:rounded-3xl md:shadow-xl md:border md:dark:border-white/5 md:overflow-hidden relative flex flex-col">
          <header className="p-4 bg-white dark:bg-surface-dark border-b dark:border-white/5 flex items-center gap-4 md:px-8">
            <button onClick={() => setEditing(null)} className="material-symbols-outlined hover:bg-slate-100 dark:hover:bg-white/5 p-2 rounded-full transition-colors">close</button>
            <h2 className="font-bold flex-1 text-sm md:text-lg">{editing.name ? 'Editar Modelo' : 'Novo Modelo'}</h2>
            <button onClick={() => setShowHelp(!showHelp)} className="text-primary font-bold text-xs bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors">
              {showHelp ? 'Ocultar Variáveis' : 'Ver Variáveis'}
            </button>
            <button onClick={handleSave} className="text-primary font-bold text-sm bg-primary/10 px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors">Salvar</button>
          </header>

          {showHelp && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800 text-[10px] text-slate-500 font-mono whitespace-pre-wrap border-b dark:border-white/5 md:px-8 max-h-40 overflow-y-auto">
              {CONTRACT_VARIABLES_HELP}
            </div>
          )}

          <main className="flex-1 p-4 space-y-4 overflow-y-auto md:p-8">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nome do Modelo</label>
              <input
                className="w-full bg-white dark:bg-surface-dark border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary ring-1 ring-slate-200 dark:ring-white/10"
                value={editing.name}
                onChange={e => setEditing({ ...editing, name: e.target.value })}
                placeholder="Ex: Contrato de Manutenção"
              />
            </div>

            <div className="space-y-1 flex-1 flex flex-col min-h-[400px]">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cláusulas contratuais</label>
                <button 
                  onClick={handleGenerateAI}
                  disabled={isGenerating || !editing.name}
                  className="flex items-center gap-1 text-[10px] font-bold text-purple-600 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Gera um modelo de contrato baseado no nome usando IA"
                >
                  <span className={`material-symbols-outlined text-sm ${isGenerating ? 'animate-spin' : ''}`}>
                    {isGenerating ? 'sync' : 'auto_awesome'}
                  </span>
                  {isGenerating ? 'Gerando...' : 'Gerar com IA'}
                </button>
              </div>
              <textarea
                className="w-full flex-1 bg-white dark:bg-surface-dark border-none rounded-2xl p-4 text-sm focus:ring-1 focus:ring-primary leading-relaxed resize-none ring-1 ring-slate-200 dark:ring-white/10 font-mono"
                value={editing.content}
                onChange={e => setEditing({ ...editing, content: e.target.value })}
                placeholder="Escreva as cláusulas padrão aqui..."
              />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full md:max-w-5xl mx-auto bg-background-light dark:bg-background-dark md:py-8 md:px-4">
      <div className="w-full h-full md:bg-white md:dark:bg-surface-dark md:rounded-3xl md:shadow-xl md:border md:dark:border-white/5 md:overflow-hidden relative flex flex-col">
        <header className="p-4 bg-white dark:bg-surface-dark border-b dark:border-white/5 flex items-center justify-between md:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="material-symbols-outlined hover:bg-slate-100 dark:hover:bg-white/5 p-2 rounded-full transition-colors">arrow_back</button>
            <h2 className="font-bold text-lg">Modelos de Contrato</h2>
          </div>
          <button onClick={handleCreate} className="text-primary font-bold text-sm bg-primary/10 px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors">+ Novo</button>
        </header>
        <main className="p-4 space-y-3 md:p-8 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
          {templates.map(t => (
            <button
              key={t.id}
              onClick={() => setEditing(t)}
              className="w-full bg-white dark:bg-surface-dark p-4 rounded-2xl flex items-center gap-4 border dark:border-white/5 text-left active:scale-[0.98] transition-all hover:shadow-md hover:border-primary/30 group"
            >
              <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">{t.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{t.name}</p>
                <p className="text-[10px] text-slate-500 line-clamp-2">{t.content}</p>
              </div>
              <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">edit</span>
            </button>
          ))}
        </main>
      </div>
    </div>
  );
};

export default ContractTemplates;
