import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useDialog } from '../contexts/DialogContext';
import { profileService } from '../services/database';
import { supabase } from '../lib/supabase';
import { getGeminiApiKey, saveGeminiApiKey } from '../services/ai';

interface UserProfile {
  name: string;
  email: string;
  companyName: string;
  document?: string;
  phone?: string;
  address?: string;
  logo?: string;
  pixKey?: string;
  bankInfo?: string;
  [key: string]: any;
}

const getAppSettings = () => {
  try {
    const saved = localStorage.getItem('gestor_pro_settings');
    return saved ? JSON.parse(saved) : { pushNotifications: true };
  } catch {
    return { pushNotifications: true };
  }
};

const saveAppSettings = (settings: any) => {
  localStorage.setItem('gestor_pro_settings', JSON.stringify(settings));
};

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { confirm } = useDialog();
  const [activeTab, setActiveTab] = useState('geral');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState(getAppSettings());
  const [apiKey, setApiKey] = useState(getGeminiApiKey() || '');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    loadProfile();
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  useEffect(() => {
    saveAppSettings(settings);
  }, [settings]);

  const loadProfile = async () => {
    try {
      const data = await profileService.getProfile();
      setProfile(data as any);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    setIsSaving(true);
    try {
      await profileService.updateProfile(profile);
      saveGeminiApiKey(apiKey);
      toast.success('Configurações salvas com sucesso!');
    } catch (e: any) {
      console.error('Erro ao salvar:', e);
      toast.error(`Erro ao salvar: ${e.message || 'Tente novamente'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearCatalog = async () => {
    const confirmed = await confirm({
      title: 'Limpar Catálogo',
      message: 'Isso apagará todas as sugestões de produtos salvas na nuvem. Deseja continuar?',
      confirmLabel: 'Limpar Tudo',
      cancelLabel: 'Cancelar',
      variant: 'danger'
    });

    if (confirmed) {
      try {
        await profileService.updateProfile({ materialCatalog: [] });
        toast.success('Catálogo de materiais limpo com sucesso.');
      } catch (e) {
        toast.error('Erro ao limpar catálogo.');
      }
    }
  };

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

  if (isLoading) return <div className="h-screen flex items-center justify-center animate-pulse">Carregando...</div>;
  if (!profile) return <div className="p-10 text-center">Erro ao carregar perfil.</div>;

  const tabs = [
    { id: 'geral', label: 'Geral', icon: 'person' },
    { id: 'financeiro', label: 'Financeiro', icon: 'payments' },
    { id: 'sistema', label: 'Sistema', icon: 'settings' },
  ];

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 dark:bg-background-dark md:flex-row">
      {/* Sidebar de Navegação (Desktop) / Topbar (Mobile) */}
      <div className="md:w-64 bg-white dark:bg-surface-dark border-r border-slate-200 dark:border-white/5 flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-slate-100 dark:border-white/5 hidden md:block">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Ajustes</h2>
          <p className="text-xs text-slate-500 mt-1">Gerencie sua conta</p>
        </div>
        
        {/* Mobile Header */}
        <div className="md:hidden p-4 bg-white dark:bg-surface-dark border-b border-slate-200 dark:border-white/5 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="font-bold text-lg">Configurações</h1>
          </div>
          <button onClick={handleLogout} className="p-2 text-red-500 rounded-full hover:bg-red-50">
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>

        {/* Mobile Tabs (Horizontal) */}
        <div className="md:hidden flex overflow-x-auto p-2 gap-2 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-background-dark scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
          <button
              onClick={() => navigate('/subscription')}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[18px]">diamond</span>
              Assinatura
          </button>
        </div>

        {/* Desktop Nav (Vertical) */}
        <nav className="hidden md:flex flex-1 overflow-y-auto p-4 space-y-1 flex-col">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
          
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/5">
             <button
              onClick={() => navigate('/subscription')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
            >
              <span className="material-symbols-outlined text-purple-500">diamond</span>
              Assinatura
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
            >
              <span className="material-symbols-outlined">logout</span>
              Sair da Conta
            </button>
          </div>
        </nav>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        <div className="max-w-3xl mx-auto space-y-6 pb-20">
          
          {/* Header da Seção */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white capitalize">
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>
              <p className="text-slate-500 text-xs md:text-sm mt-1">
                {activeTab === 'geral' && 'Dados pessoais e da empresa'}
                {activeTab === 'financeiro' && 'Informações de pagamento e recebimento'}
                {activeTab === 'sistema' && 'Configurações do aplicativo e IA'}
              </p>
            </div>
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="hidden md:flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 shadow-lg shadow-primary/20"
            >
              {isSaving ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                  Salvando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">save</span>
                  Salvar Alterações
                </>
              )}
            </button>
          </div>

          {/* Abas */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            {activeTab === 'geral' && (
              <div className="space-y-6">
                {/* Avatar / Logo Upload */}
                <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
                  <h3 className="font-bold text-slate-800 dark:text-white mb-4">Identidade Visual</h3>
                  <div className="flex flex-wrap gap-8">
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative group cursor-pointer">
                         <img 
                          src={profile.logo || profile.avatar || "https://ui-avatars.com/api/?name=" + profile.name} 
                          className="size-24 rounded-full border-4 border-slate-100 dark:border-white/5 object-cover" 
                          alt="Logo" 
                        />
                        <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <span className="material-symbols-outlined text-white">photo_camera</span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setProfile({ ...profile, logo: reader.result as string });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                      <span className="text-xs font-medium text-slate-500">Logo da Empresa</span>
                    </div>
                  </div>
                </div>

                {/* Dados Básicos */}
                <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm space-y-4">
                  <h3 className="font-bold text-slate-800 dark:text-white mb-2">Informações Básicas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      label="Nome Completo" 
                      value={profile.name} 
                      onChange={v => setProfile({...profile, name: v})} 
                    />
                    <Input 
                      label="Nome da Empresa" 
                      value={profile.companyName} 
                      onChange={v => setProfile({...profile, companyName: v})} 
                    />
                    <Input 
                      label="CPF / CNPJ" 
                      value={profile.document} 
                      onChange={v => setProfile({...profile, document: v})} 
                    />
                    <Input 
                      label="Email" 
                      type="email"
                      value={profile.email} 
                      onChange={v => setProfile({...profile, email: v})} 
                    />
                    <Input 
                      label="Telefone / WhatsApp" 
                      value={profile.phone} 
                      onChange={v => setProfile({...profile, phone: v})} 
                    />
                  </div>
                  <div className="mt-4">
                    <Input 
                      label="Endereço Completo" 
                      value={profile.address} 
                      onChange={v => setProfile({...profile, address: v})} 
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'financeiro' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg text-green-600">
                      <span className="material-symbols-outlined">pix</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-white">Chave Pix</h3>
                      <p className="text-xs text-slate-500">Para receber pagamentos via Pix</p>
                    </div>
                  </div>
                  <Input 
                    label="Chave Pix" 
                    placeholder="CPF, Email, Telefone ou Chave Aleatória"
                    value={profile.pixKey} 
                    onChange={v => setProfile({...profile, pixKey: v})} 
                  />
                </div>

                <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-600">
                      <span className="material-symbols-outlined">account_balance</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-white">Dados Bancários</h3>
                      <p className="text-xs text-slate-500">Para transferências TED/DOC</p>
                    </div>
                  </div>
                  <textarea
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all h-32 resize-none"
                    placeholder="Banco: NuBank&#10;Agência: 0001&#10;Conta: 12345-6"
                    value={profile.bankInfo || ''}
                    onChange={e => setProfile({ ...profile, bankInfo: e.target.value })}
                  />
                </div>
              </div>
            )}

            {activeTab === 'sistema' && (
              <div className="space-y-6">
                {/* IA Settings */}
                <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg text-purple-600">
                      <span className="material-symbols-outlined">auto_awesome</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-white">Inteligência Artificial</h3>
                      <p className="text-xs text-slate-500">Configure a geração automática de contratos</p>
                    </div>
                  </div>
                  
                  {profile.subscriptionStatus === 'active' ? (
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-500 uppercase">Chave de API do Google Gemini</label>
                      <div className="flex gap-2">
                        <input
                          type="password"
                          className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500"
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder="AIza..."
                        />
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Sua chave é armazenada localmente no seu dispositivo por segurança.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl text-center">
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">Recurso exclusivo para assinantes PRO</p>
                      <button 
                        onClick={() => navigate('/subscription')}
                        className="text-primary font-bold text-sm hover:underline"
                      >
                        Fazer Upgrade Agora
                      </button>
                    </div>
                  )}
                </div>

                {/* Preferências */}
                <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-50 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg text-yellow-600">
                        <span className="material-symbols-outlined">notifications</span>
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white">Notificações Push</span>
                    </div>
                     <button
                      onClick={() => setSettings({ ...settings, pushNotifications: !settings.pushNotifications })}
                      className={`w-12 h-6 rounded-full relative p-1 transition-colors duration-300 flex items-center ${settings.pushNotifications ? 'bg-primary justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}
                    >
                      <div className="size-4 bg-white rounded-full shadow-md"></div>
                    </button>
                  </div>

                  <button
                    onClick={() => navigate('/contract-templates')}
                    className="w-full p-4 border-b border-slate-50 dark:border-white/5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg text-orange-600">
                        <span className="material-symbols-outlined">description</span>
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white">Gerenciar Modelos de Contrato</span>
                    </div>
                    <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                  </button>
                  
                  <button
                    onClick={() => navigate('/tech-signature')}
                    className="w-full p-4 border-b border-slate-50 dark:border-white/5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg text-indigo-600">
                        <span className="material-symbols-outlined">ink_pen</span>
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white">Assinatura Técnica</span>
                    </div>
                    <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                  </button>

                  <button
                    onClick={handleClearCatalog}
                    className="w-full p-4 flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg text-red-500">
                        <span className="material-symbols-outlined">delete_sweep</span>
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white group-hover:text-red-600 transition-colors">Limpar Catálogo de Materiais</span>
                    </div>
                  </button>
                </div>

                 {/* Install App */}
                {deferredPrompt && (
                   <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg shadow-blue-500/20 text-white flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition-transform" onClick={handleInstallClick}>
                    <div className="size-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl">download</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Instalar Aplicativo</h3>
                      <p className="text-sm opacity-90">Adicione à tela inicial para acesso rápido</p>
                    </div>
                   </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Save Button (Floating) */}
        <div className="md:hidden fixed bottom-[90px] left-4 right-4 z-50">
          <button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="w-full bg-primary text-white py-3.5 rounded-xl font-bold shadow-xl shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
             {isSaving ? (
                <>
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                  Salvando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">save</span>
                  Salvar Alterações
                </>
              )}
          </button>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, value, onChange, type = "text", placeholder }: any) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-wider">{label}</label>
    <input
      type={type}
      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

export default Settings;
