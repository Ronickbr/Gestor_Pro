
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { profileService } from '../services/database';
import SignaturePad from '../components/SignaturePad';

const TechSignature: React.FC = () => {
  const navigate = useNavigate();
  const [signature, setSignature] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadSignature();
  }, []);

  const loadSignature = async () => {
    try {
      const profile = await profileService.getProfile();
      setSignature(profile.techSignature || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await profileService.updateProfile({ techSignature: signature });
      toast.success('Assinatura salva com sucesso!');
      navigate('/settings');
    } catch (e) {
      toast.error('Erro ao salvar assinatura.');
    }
  };

  const renderSignature = (sig: string | null) => {
      if (!sig) return <p className="text-xs text-slate-400 italic">Nenhuma assinatura registrada.</p>;
      if (sig.startsWith('data:image')) {
          return <img src={sig} alt="Assinatura" className="h-full w-auto object-contain p-4" />;
      }
      return (
          <svg className="w-full h-full max-h-32" viewBox="0 0 400 150">
            <path d={sig} fill="none" stroke="#137fec" strokeWidth="4" strokeLinecap="round" />
          </svg>
      );
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-background-light dark:bg-background-dark">
      <header className="p-4 bg-white dark:bg-surface-dark border-b dark:border-white/5 flex items-center">
        <button onClick={() => navigate(-1)} className="material-symbols-outlined mr-4">arrow_back</button>
        <h2 className="font-bold">Sua Assinatura Técnica</h2>
      </header>
      <main className="p-4 space-y-6">

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <span className="material-symbols-outlined animate-spin text-3xl text-primary">sync</span>
          </div>
        ) : (
          <>
            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30">
              <p className="text-xs text-blue-700 dark:text-blue-400">
                Esta assinatura será aplicada em todos os seus contratos e garantias de forma automática.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Assinatura Atual</label>
              
              <div className="h-48 bg-white dark:bg-surface-dark rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 overflow-hidden relative">
                {isEditing ? (
                     <div className="w-full h-full relative">
                        <SignaturePad 
                            onSave={(data) => setSignature(data)}
                            className="w-full h-full bg-white"
                            initialData={signature}
                        />
                        <button 
                            onClick={() => setIsEditing(false)}
                            className="absolute bottom-2 right-2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-lg shadow-sm z-20"
                        >
                            Concluir
                        </button>
                    </div>
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        {renderSignature(signature)}
                    </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {!isEditing && (
                <button
                    onClick={() => setIsEditing(true)}
                    className="w-full py-4 bg-primary/10 text-primary font-bold rounded-xl flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined">draw</span>
                    {signature ? 'Redefinir Assinatura' : 'Criar Nova Assinatura'}
                </button>
              )}

              <button
                disabled={!signature || isEditing}
                onClick={handleSave}
                className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 disabled:opacity-50"
              >
                Salvar Assinatura Padrão
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default TechSignature;

