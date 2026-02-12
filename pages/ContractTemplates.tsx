import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useDialog } from '../contexts/DialogContext';
import { ContractTemplate } from '../types';
import { SERVICE_CATEGORIES } from '../constants';
import { profileService } from '../services/database';
import { CONTRACT_VARIABLES_HELP } from '../services/contractGenerator';

const ADDITIONAL_TEMPLATES: ContractTemplate[] = [
    // CFTV
    {
        id: 'cat1_extra1',
        name: 'CFTV - Manutenção Mensal',
        icon: 'videocam',
        content: `CONTRATO DE MANUTENÇÃO MENSAL DE CFTV

CONTRATANTE: {{CLIENTE_NOME}}
CONTRATADO: {{CONTRATADO_EMPRESA}}

OBJETO: Manutenção preventiva e corretiva do sistema de câmeras de segurança instalado no endereço {{CLIENTE_ENDERECO}}.

COBERTURA:
- Limpeza de lentes e caixas de proteção;
- Ajuste de foco e posicionamento;
- Verificação de gravação e HD;
- Troca de conectores oxidados.

VALOR MENSAL: {{VALOR_TOTAL}}

PRAZO DO CONTRATO: 12 meses, renováveis automaticamente.
ATENDIMENTO: Chamados técnicos serão atendidos em até 24h úteis.`
    },
    {
        id: 'cat1_extra2',
        name: 'CFTV - Locação de Equipamentos',
        icon: 'videocam',
        content: `CONTRATO DE LOCAÇÃO DE EQUIPAMENTOS (COMODATO)

CONTRATANTE: {{CLIENTE_NOME}}
CONTRATADO: {{CONTRATADO_EMPRESA}}

OBJETO: Locação de sistema de CFTV composto por:
{{LISTA_MATERIAIS}}

VALOR MENSAL: {{VALOR_TOTAL}}

PROPRIEDADE:
Os equipamentos permanecem de propriedade da CONTRATADA, sendo cedidos para uso da CONTRATANTE durante a vigência deste contrato.

MANUTENÇÃO:
Inclusa durante todo o período, exceto para danos causados por mau uso ou vandalismo.`
    },
    // Redes
    {
        id: 'cat2_extra1',
        name: 'Redes - Gestão Corporativa',
        icon: 'wifi',
        content: `CONTRATO DE GESTÃO DE REDE CORPORATIVA

CONTRATANTE: {{CLIENTE_NOME}}
CONTRATADO: {{CONTRATADO_EMPRESA}}

OBJETO: Monitoramento e gestão da infraestrutura de rede da empresa.

SERVIÇOS INCLUSOS:
- Monitoramento de link de internet;
- Gestão de usuários e acessos;
- Configuração de firewall e VPN;
- Relatórios mensais de tráfego.

VALOR MENSAL: {{VALOR_TOTAL}}

NÍVEL DE SERVIÇO (SLA):
Tempo de resposta crítico: 2 horas.
Tempo de solução: 8 horas.`
    },
    {
        id: 'cat2_extra2',
        name: 'Redes - Link Dedicado',
        icon: 'router',
        content: `CONTRATO DE INSTALAÇÃO DE LINK DEDICADO

CONTRATANTE: {{CLIENTE_NOME}}
CONTRATADO: {{CONTRATADO_EMPRESA}}

OBJETO: Instalação física e lógica para recebimento de link dedicado de fibra óptica.

ESCOPO TÉCNICO:
{{LISTA_SERVICOS}}

EQUIPAMENTOS DE BORDA:
{{LISTA_MATERIAIS}}

VALOR DO PROJETO: {{VALOR_TOTAL}}

GARANTIA:
Garantia de {{GARANTIA_MESES}} meses sobre a fusão de fibra e infraestrutura interna.`
    },
    // Alarme
    {
        id: 'cat3_extra1',
        name: 'Alarme - Monitoramento 24h',
        icon: 'shield',
        content: `CONTRATO DE MONITORAMENTO 24H

CONTRATANTE: {{CLIENTE_NOME}}
CONTRATADO: {{CONTRATADO_EMPRESA}}

OBJETO: Monitoramento remoto de sistema de alarme.

SERVIÇOS:
- Monitoramento 24 horas por dia, 7 dias por semana;
- Acionamento de tático móvel em caso de disparo confirmado;
- Relatório de armazém e desarme via aplicativo.

VALOR MENSAL: {{VALOR_TOTAL}}

RESPONSABILIDADES:
O CONTRATADO não realiza segurança patrimonial armada, apenas monitoramento eletrônico.`
    },
    {
        id: 'cat3_extra2',
        name: 'Alarme - Manutenção Perimetral',
        icon: 'fence',
        content: `CONTRATO DE MANUTENÇÃO DE PERÍMETRO

CONTRATANTE: {{CLIENTE_NOME}}
CONTRATADO: {{CONTRATADO_EMPRESA}}

OBJETO: Manutenção de cerca elétrica e sensores de barreira.

ESCOPO:
- Medição de tensão da cerca elétrica;
- Ajuste de sensibilidade de sensores IVA;
- Troca de isoladores ressecados;
- Poda de vegetação próxima à cerca (até 50cm).

VALOR POR VISITA: {{VALOR_TOTAL}}

GARANTIA:
Serviço pontual com garantia de 3 meses.`
    },
    // TI
    {
        id: 'cat4_extra1',
        name: 'TI - Consultoria de Segurança',
        icon: 'lock',
        content: `CONTRATO DE CONSULTORIA EM SEGURANÇA DA INFORMAÇÃO

CONTRATANTE: {{CLIENTE_NOME}}
CONTRATADO: {{CONTRATADO_EMPRESA}}

OBJETO: Análise de vulnerabilidades e implementação de políticas de segurança.

ENTREGÁVEIS:
- Relatório de vulnerabilidades da rede;
- Plano de backup e recuperação de desastres;
- Instalação de antivírus corporativo;
- Treinamento básico de segurança para funcionários.

VALOR DO PROJETO: {{VALOR_TOTAL}}

CONFIDENCIALIDADE:
Ambas as partes comprometem-se a manter sigilo absoluto sobre os dados acessados.`
    },
    {
        id: 'cat4_extra2',
        name: 'TI - Setup de Computadores',
        icon: 'computer',
        content: `CONTRATO DE FORMATAÇÃO E CONFIGURAÇÃO

CONTRATANTE: {{CLIENTE_NOME}}
CONTRATADO: {{CONTRATADO_EMPRESA}}

OBJETO: Preparação de parque informático.

SERVIÇOS:
- Formatação e instalação de Sistema Operacional;
- Instalação de pacote Office e drivers;
- Configuração de impressoras em rede;
- Otimização de desempenho.

VALOR POR MÁQUINA: {{VALOR_TOTAL}}

GARANTIA:
Garantia de 30 dias sobre o software instalado (exceto vírus ou mau uso).`
    }
];

const ContractTemplates: React.FC = () => {
  const navigate = useNavigate();
  const { confirm } = useDialog();
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [editing, setEditing] = useState<ContractTemplate | null>(null);
  const [showVariables, setShowVariables] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      const profile = await profileService.getProfile();
      let currentTemplates: ContractTemplate[] = [];

      // 1. Start with default categories from constants
      const defaultTemplates = SERVICE_CATEGORIES.map(cat => ({
        id: cat.id,
        name: cat.name,
        icon: cat.icon,
        content: cat.contractTemplate
      }));

      // 2. Combine with extra templates
      const allSystemTemplates = [...defaultTemplates, ...ADDITIONAL_TEMPLATES];

      if (profile.contractTemplates && profile.contractTemplates.length > 0) {
        currentTemplates = [...profile.contractTemplates];
        
        // Smart Merge: Add missing system templates
        allSystemTemplates.forEach(sysTemplate => {
            if (!currentTemplates.find(t => t.id === sysTemplate.id)) {
                currentTemplates.push(sysTemplate);
            }
        });
      } else {
        // First load: use all system templates
        currentTemplates = allSystemTemplates;
      }
      
      setTemplates(currentTemplates);
    } catch (e) {
      console.error(e);
      toast.error('Erro ao carregar modelos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAI = async () => {
    if (!editing?.name) return toast.error('Dê um nome ao modelo primeiro para orientar a IA.');
    
    setIsGenerating(true);
    try {
      const { generateTemplate } = await import('../services/ai');
      const text = await generateTemplate(editing.name);
      setEditing(prev => prev ? { ...prev, content: text } : null);
      toast.success('Modelo gerado com sucesso!');
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
        toast.success('Modelo salvo com sucesso!');
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
    setShowVariables(true);
  };

  if (editing) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-background-dark flex flex-col md:flex-row">
        {/* Editor Main Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <header className="bg-white dark:bg-surface-dark border-b dark:border-white/5 p-4 flex items-center justify-between shadow-sm z-10">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setEditing(null)} 
                className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors text-slate-500"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              <div>
                <h2 className="font-bold text-lg text-slate-900 dark:text-white">
                  {editing.name || 'Novo Modelo'}
                </h2>
                <p className="text-xs text-slate-500 hidden md:block">Edite as cláusulas e variáveis do contrato</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowVariables(!showVariables)}
                className="md:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full"
                title="Ver variáveis"
              >
                <span className="material-symbols-outlined">data_object</span>
              </button>
              <button 
                onClick={handleSave} 
                className="bg-primary text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                Salvar
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 dark:bg-background-dark">
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* Name Input */}
              <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Nome do Modelo</label>
                <div className="flex gap-4">
                  <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">{editing.icon || 'description'}</span>
                  </div>
                  <input
                    className="flex-1 bg-transparent border-b-2 border-slate-100 dark:border-white/10 px-0 py-2 text-lg font-bold focus:border-primary focus:outline-none transition-colors placeholder:text-slate-300"
                    value={editing.name}
                    onChange={e => setEditing({ ...editing, name: e.target.value })}
                    placeholder="Ex: Contrato de Manutenção"
                  />
                </div>
              </div>

              {/* Content Editor */}
              <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 flex flex-col min-h-[500px]">
                <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">gavel</span>
                    Cláusulas Contratuais
                  </label>
                  
                  <button 
                    onClick={handleGenerateAI}
                    disabled={isGenerating || !editing.name}
                    className="flex items-center gap-1.5 text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-purple-100 dark:border-purple-500/20"
                  >
                    <span className={`material-symbols-outlined text-[16px] ${isGenerating ? 'animate-spin' : ''}`}>
                      {isGenerating ? 'sync' : 'auto_awesome'}
                    </span>
                    {isGenerating ? 'Gerando com IA...' : 'Gerar Texto com IA'}
                  </button>
                </div>
                <textarea
                  className="flex-1 w-full p-6 bg-transparent border-none resize-none focus:ring-0 font-mono text-sm leading-relaxed text-slate-700 dark:text-slate-300"
                  value={editing.content}
                  onChange={e => setEditing({ ...editing, content: e.target.value })}
                  placeholder="Escreva as cláusulas do contrato aqui... Use as variáveis ao lado para preenchimento automático."
                />
              </div>
            </div>
          </main>
        </div>

        {/* Sidebar Variables - Desktop: Always visible, Mobile: Toggle */}
        <div className={`
          fixed inset-y-0 right-0 w-80 bg-white dark:bg-surface-dark border-l dark:border-white/5 shadow-2xl transform transition-transform duration-300 z-20
          md:relative md:transform-none md:shadow-none md:w-80 md:flex md:flex-col
          ${showVariables ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
        `}>
          <div className="h-full flex flex-col">
            <header className="p-4 border-b dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">data_object</span>
                Variáveis Disponíveis
              </h3>
              <button onClick={() => setShowVariables(false)} className="md:hidden material-symbols-outlined text-slate-400">close</button>
            </header>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <p className="text-xs text-slate-500 mb-4">
                Copie e cole estas variáveis no texto do contrato. Elas serão substituídas automaticamente pelos dados reais.
              </p>
              
              <div className="space-y-6">
                {CONTRACT_VARIABLES_HELP.split('\n\n').map((section, idx) => {
                  const [title, ...vars] = section.split('\n');
                  if (!title) return null;
                  return (
                    <div key={idx}>
                      <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2 border-b border-primary/10 pb-1">{title.replace(':', '')}</h4>
                      <ul className="space-y-2">
                        {vars.map((v, vIdx) => {
                          const [variable, desc] = v.split(' - ');
                          return (
                            <li key={vIdx} className="group cursor-pointer" onClick={() => {
                                navigator.clipboard.writeText(variable);
                                toast.success('Copiado!', { position: 'bottom-center', duration: 1000 });
                            }}>
                              <code className="block bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 px-2 py-1 rounded text-[11px] font-bold border border-slate-200 dark:border-white/5 group-hover:border-primary/50 group-hover:text-primary transition-colors">
                                {variable}
                              </code>
                              {desc && <span className="text-[10px] text-slate-400 ml-1">{desc}</span>}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-background-dark pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-white dark:bg-surface-dark border-b dark:border-white/5 px-4 py-6 md:px-8 md:py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors">
              <span className="material-symbols-outlined text-slate-500">arrow_back</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Modelos de Contrato</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Gerencie seus modelos jurídicos para automação de propostas.
              </p>
            </div>
          </div>
          <button 
            onClick={handleCreate}
            className="w-full md:w-auto bg-primary text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            Novo Modelo
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 md:p-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-white dark:bg-surface-dark rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map(t => (
              <div 
                key={t.id}
                className="group bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-white/5 hover:shadow-md hover:border-primary/30 transition-all flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <span className="material-symbols-outlined text-2xl">{t.icon}</span>
                  </div>
                  <button 
                    onClick={() => setEditing(t)}
                    className="p-2 text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-white/5 rounded-full transition-colors"
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                </div>
                
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 line-clamp-1">{t.name}</h3>
                
                <div className="flex-1 bg-slate-50 dark:bg-white/5 rounded-lg p-3 mb-4">
                  <p className="text-xs text-slate-500 font-mono line-clamp-4 leading-relaxed">
                    {t.content || '(Modelo vazio)'}
                  </p>
                </div>

                <button 
                  onClick={() => setEditing(t)}
                  className="w-full py-2 text-sm font-bold text-slate-500 hover:text-primary border border-slate-200 dark:border-white/10 rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-all"
                >
                  Editar Modelo
                </button>
              </div>
            ))}

            {/* Empty State / Add New Card */}
            <button 
              onClick={handleCreate}
              className="group border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-primary/5 transition-all min-h-[250px]"
            >
              <div className="size-16 rounded-full bg-slate-100 dark:bg-white/5 text-slate-400 group-hover:text-primary group-hover:bg-primary/10 flex items-center justify-center mb-4 transition-colors">
                <span className="material-symbols-outlined text-3xl">add_circle</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">Criar Personalizado</h3>
              <p className="text-xs text-slate-500 max-w-[200px]">
                Crie um modelo do zero ou use a IA para gerar um contrato específico.
              </p>
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ContractTemplates;
