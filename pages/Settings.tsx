
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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState(getAppSettings());
  const [apiKey, setApiKey] = useState(getGeminiApiKey() || '');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!tempProfile) return;
    try {
      await profileService.updateProfile(tempProfile);
      setProfile(tempProfile);
      setIsEditingProfile(false);
      toast.success('Perfil salvo com sucesso!');
    } catch (e: any) {
      console.error('Erro ao salvar perfil:', e);
      toast.error(`Erro ao salvar perfil: ${e.message || 'Tente novamente'}`);
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

  const toggleNotifications = () => {
    setSettings({ ...settings, pushNotifications: !settings.pushNotifications });
  };

  const handleSaveApiKey = () => {
    saveGeminiApiKey(apiKey);
    setIsApiModalOpen(false);
    toast.success('Chave de API salva com sucesso!');
  };



  if (isLoading || !profile) return <div className="p-10 text-center">Carregando perfil...</div>;

  if (isEditingProfile && tempProfile) {
    return (
      <div className="flex flex-col h-screen w-full md:max-w-2xl mx-auto bg-background-light dark:bg-background-dark">
        <header className="sticky top-0 z-50 flex items-center p-4 border-b dark:border-white/5 bg-white dark:bg-surface-dark shrink-0 gap-4">
          <button 
            onClick={() => setIsEditingProfile(false)} 
            className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            aria-label="Fechar edição"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          <h2 className="font-bold flex-1 text-base text-slate-900 dark:text-white">Editar Perfil</h2>
          <button 
            onClick={handleSaveProfile} 
            className="bg-primary text-white font-bold text-sm px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors shadow-sm active:scale-95"
          >
            Salvar
          </button>
        </header>
        <main className="flex-1 p-4 space-y-6 overflow-y-auto">
          <div className="flex flex-col items-center py-6">
            <div className="relative group cursor-pointer">
              <img src={tempProfile.logo || tempProfile.avatar} className="size-24 rounded-full border-4 border-primary/20 shadow-xl object-cover" alt="Preview" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white">photo_camera</span>
              </div>
            </div>
            <p className="mt-3 text-xs font-semibold text-primary">Alterar foto de perfil</p>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 ml-1">Logo da Empresa</label>
              <div className="flex flex-wrap items-center gap-4">
                {tempProfile.logo ? (
                  <div className="relative group">
                    <img src={tempProfile.logo} className="h-16 w-auto object-contain border rounded-lg p-1 bg-white" alt="Logo" />
                    <button
                      onClick={() => setTempProfile({ ...tempProfile, logo: undefined })}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  </div>
                ) : (
                  <div className="h-16 w-32 bg-slate-100 dark:bg-white/5 border border-dashed border-slate-300 dark:border-white/10 rounded-lg flex items-center justify-center text-slate-400 text-xs">
                    Sem Logo
                  </div>
                )}
                <label className="cursor-pointer bg-primary/10 text-primary px-4 py-2 rounded-lg font-bold text-xs hover:bg-primary/20 transition-colors">
                  Escolher Imagem
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setTempProfile({ ...tempProfile, logo: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
              <p className="text-[10px] text-slate-400">Recomendado: Imagem PNG com fundo transparente.</p>
            </div>

            <div className="space-y-1">
              <label htmlFor="name" className="text-xs font-semibold text-slate-600 dark:text-slate-400 ml-1">Nome Completo</label>
              <input
                id="name"
                className="w-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                value={tempProfile.name || ''}
                onChange={e => setTempProfile({ ...tempProfile, name: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="company" className="text-xs font-semibold text-slate-600 dark:text-slate-400 ml-1">Nome da Empresa / Fantasia</label>
              <input
                id="company"
                className="w-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                value={tempProfile.companyName || ''}
                onChange={e => setTempProfile({ ...tempProfile, companyName: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="doc" className="text-xs font-semibold text-slate-600 dark:text-slate-400 ml-1">CPF ou CNPJ</label>
              <input
                id="doc"
                className="w-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                value={tempProfile.document || ''}
                onChange={e => setTempProfile({ ...tempProfile, document: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="email" className="text-xs font-semibold text-slate-600 dark:text-slate-400 ml-1">E-mail de Contato</label>
              <input
                id="email"
                type="email"
                className="w-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                value={tempProfile.email || ''}
                onChange={e => setTempProfile({ ...tempProfile, email: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="phone" className="text-xs font-semibold text-slate-600 dark:text-slate-400 ml-1">Telefone / WhatsApp</label>
              <input
                id="phone"
                className="w-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                value={tempProfile.phone || ''}
                onChange={e => setTempProfile({ ...tempProfile, phone: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="address" className="text-xs font-semibold text-slate-600 dark:text-slate-400 ml-1">Endereço Completo</label>
              <input
                id="address"
                className="w-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                value={tempProfile.address || ''}
                onChange={e => setTempProfile({ ...tempProfile, address: e.target.value })}
              />
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-white/5">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
                <span className="material-symbols-outlined text-primary">payments</span>
                Dados para Recebimento
              </h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="pix" className="text-xs font-semibold text-slate-600 dark:text-slate-400 ml-1">Chave Pix</label>
                  <input
                    id="pix"
                    className="w-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-mono text-primary"
                    value={tempProfile.pixKey || ''}
                    onChange={e => setTempProfile({ ...tempProfile, pixKey: e.target.value })}
                    placeholder="CPF, E-mail ou Aleatória"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="bank" className="text-xs font-semibold text-slate-600 dark:text-slate-400 ml-1">Dados Bancários (Banco/Ag/Conta)</label>
                  <textarea
                    id="bank"
                    className="w-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all h-24 resize-none"
                    value={tempProfile.bankInfo || ''}
                    onChange={e => setTempProfile({ ...tempProfile, bankInfo: e.target.value })}
                    placeholder="Ex: Banco Itaú, Ag 0000, Conta 12345-6"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isApiModalOpen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white dark:bg-surface-dark w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-600">auto_awesome</span>
            Configurar IA
          </h3>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Insira sua chave de API do Gemini para habilitar a geração automática de contratos inteligentes.
          </p>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Chave de API do Google Gemini</label>
              <input
                type="password"
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Cole sua chave aqui (AIza...)"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsApiModalOpen(false)}
                className="flex-1 py-3 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveApiKey}
                className="flex-1 py-3 bg-purple-600 text-white font-bold rounded-xl text-xs hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/30"
              >
                Salvar Chave
              </button>
            </div>
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="block text-center text-[10px] text-purple-500 hover:underline">
              Obter chave gratuitamente
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full md:max-w-5xl mx-auto bg-background-light dark:bg-background-dark md:py-8 md:px-4">
      <div className="w-full h-full md:bg-white md:dark:bg-surface-dark md:rounded-3xl md:shadow-xl md:border md:dark:border-white/5 md:overflow-hidden relative flex flex-col">
        <header className="sticky top-0 z-50 flex items-center p-4 border-b border-slate-200 dark:border-slate-800 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md md:bg-white md:dark:bg-surface-dark">
          <button onClick={() => navigate(-1)} className="size-10 flex items-center justify-center rounded-full -ml-2 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h2 className="font-bold text-lg flex-1 text-center pr-8">Configurações</h2>
        </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-6 md:p-8">
          <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm flex flex-col md:flex-row items-center gap-4 md:gap-6 md:bg-slate-50 md:dark:bg-white/5">
            <img src={profile.logo || profile.avatar} className="size-20 rounded-full border-4 border-white dark:border-surface-dark shadow-lg object-cover ring-2 ring-primary/20" alt="User" />
            <div className="flex-1 min-w-0 text-center md:text-left w-full md:w-auto">
              <h3 className="text-xl md:text-2xl font-black truncate text-slate-900 dark:text-white">{profile.name}</h3>
              <p className="text-sm text-slate-500 font-medium truncate">{profile.companyName}</p>
            </div>
            <button
              onClick={() => { setTempProfile(profile); setIsEditingProfile(true); }}
              className="w-full md:w-auto px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg uppercase tracking-widest hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
            >
              Editar
            </button>
          </div>

          <div onClick={() => navigate('/subscription')} className="bg-gradient-to-r from-primary to-blue-600 p-4 rounded-2xl shadow-lg shadow-primary/30 flex items-center justify-between cursor-pointer active:scale-95 transition-transform">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <span className="material-symbols-outlined text-white">diamond</span>
              </div>
              <div>
                <p className="text-white text-xs font-medium opacity-90">Seu Plano</p>
                <p className="text-white font-black text-lg leading-none">PRO TRIAL</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-white/50">chevron_right</span>
          </div>

          <SettingsSection title="Dados da Empresa">
            <SettingsItem
              icon="domain"
              label="Perfil da Empresa"
              sub={profile.document}
              color="text-primary"
              onClick={() => setIsEditingProfile(true)}
            />
            <SettingsItem
              icon="ink_pen"
              label="Sua Assinatura Técnica"
              sub="Gerenciar traço padrão"
              color="text-primary"
              onClick={() => navigate('/tech-signature')}
            />
          </SettingsSection>

          <SettingsSection title="Inteligência Artificial">
            <SettingsItem
              icon="auto_awesome"
              label="Assistente de Contratos"
              sub={
                profile.subscriptionStatus === 'active'
                  ? (apiKey ? 'Chave de API Configurada' : 'Configurar geração automática')
                  : 'Disponível apenas para assinantes'
              }
              color={profile.subscriptionStatus === 'active' ? "text-purple-600" : "text-slate-400"}
              onClick={() => {
                if (profile.subscriptionStatus === 'active') {
                  setIsApiModalOpen(true);
                } else {
                  toast.error('Configure sua assinatura para acessar recursos de IA.');
                  navigate('/subscription');
                }
              }}
            />
          </SettingsSection>

          <SettingsSection title="Operacional">
            <SettingsItem
              icon="description"
              label="Modelos de Contrato"
              sub="Gerenciar modelos"
              color="text-orange-500"
              onClick={() => navigate('/contract-templates')}
            />
            <SettingsItem
              icon="format_list_bulleted"
              label="Limpar Catálogo"
              sub="Resetar histórico de materiais"
              color="text-green-500"
              onClick={handleClearCatalog}
            />
            <SettingsItem
              icon="groups"
              label="Gerenciar Clientes"
              sub="Acessar base de clientes"
              color="text-purple-500"
              onClick={() => navigate('/clients')}
            />
            {deferredPrompt && (
              <div
                onClick={handleInstallClick}
                className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30 cursor-pointer mt-4 hover:scale-[1.02] transition-transform"
              >
                <div className="size-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">download</span>
                </div>
                <div className="flex-1">
                  <p className="font-black text-sm text-white">Instalar Aplicativo</p>
                  <p className="text-[10px] text-white/80">Adicionar à tela inicial (PWA)</p>
                </div>
                <span className="material-symbols-outlined text-white/50">chevron_right</span>
              </div>
            )}
          </SettingsSection>

          <SettingsSection title="Preferências">
            <div className="flex items-center justify-between p-4 bg-white dark:bg-surface-dark border-b border-slate-50 dark:border-white/5">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-500 flex items-center justify-center">
                  <span className="material-symbols-outlined">notifications</span>
                </div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">Notificações Push</p>
              </div>
              <button
                onClick={toggleNotifications}
                className={`w-12 h-6 rounded-full relative p-1 transition-colors duration-300 flex items-center ${settings.pushNotifications ? 'bg-primary justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}
              >
                <div className="size-4 bg-white rounded-full shadow-md"></div>
              </button>
            </div>
            <SettingsItem icon="lock" label="Segurança" sub="FaceID e Senha ativados" color="text-blue-500" />
          </SettingsSection>



          <SettingsSection title="Sair">
            <div
              onClick={async () => {
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
              }}
              className="flex items-center gap-4 p-4 bg-white dark:bg-surface-dark rounded-b-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
            >
              <div className="size-10 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-500 flex items-center justify-center">
                <span className="material-symbols-outlined">logout</span>
              </div>
              <p className="font-bold text-sm text-red-500">Sair da Conta</p>
            </div>
          </SettingsSection>

          <div className="text-center pb-10 flex flex-col items-center">
            <img src="https://i.imgur.com/6i2hhmf.png" className="h-8 w-auto mb-2 opacity-50 grayscale" alt="Gestor Pro" />
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Versão 1.0.5 • Gestor Pro</p>
          </div>
        </main>
      </div>
    </div>
  );
};

const SettingsSection = ({ title, children }: any) => (
  <div className="space-y-3">
    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-2">{title}</h3>
    <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm bg-white dark:bg-surface-dark">
      {children}
    </div>
  </div>
);

const SettingsItem = ({ icon, label, sub, color, onClick }: any) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-4 p-4 bg-white dark:bg-surface-dark border-b last:border-b-0 border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group active:bg-slate-100 dark:active:bg-white/10"
  >
    <div className={`size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${color} group-hover:bg-primary group-hover:text-white transition-colors`}>
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <div className="flex-1 text-left">
      <p className="font-semibold text-sm text-slate-900 dark:text-white">{label}</p>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
    <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">chevron_right</span>
  </button>
);

export default Settings;
