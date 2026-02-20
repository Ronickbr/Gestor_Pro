
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Client } from '../types';
import { quotesService } from '../services/database';
import { supabase } from '../lib/supabase';
import { Avatar } from '../components/ui/Avatar';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

const NewClient: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Client>({
    id: 'c' + Date.now(),
    name: '',
    address: '',
    phone: '',
    avatar: '',
    document: '',
    email: '',
    createdAt: new Date().toLocaleDateString('pt-BR')
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 2MB');
      return;
    }

    const toastId = toast.loading('Enviando imagem...');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${formData.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload
      const { error: uploadError } = await supabase.storage
        .from('client-avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('client-avatars')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, avatar: publicUrl }));
      toast.success('Foto atualizada!', { id: toastId });
    } catch (error: any) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao enviar foto: ' + error.message, { id: toastId });
    }
  };

  useEffect(() => {
    const loadClient = async () => {
      if (id) {
        try {
          const clientData = await quotesService.getClient(id);
          setFormData(clientData);
        } catch (error) {
          console.error('Erro ao carregar cliente:', error);
          navigate('/clients');
        }
      }
    };
    loadClient();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      await quotesService.deleteClient(id);
      toast.success('Cliente deletado com sucesso!');
      navigate('/clients');
    } catch (error: any) {
      console.error('Erro ao deletar cliente:', error);
      toast.error('Não foi possível deletar o cliente. Verifique se existem orçamentos vinculados.');
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleSave = async () => {
    // Basic validation
    if (!formData.name) {
      toast.error('Nome é obrigatório.');
      return;
    }

    try {
      if (id) {
        // Update
        await quotesService.updateClient(formData);
        toast.success('Cliente atualizado com sucesso!');
      } else {
        // Create
        await quotesService.createClient({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          document: formData.document,
          // avatar etc are still local-only in DB schema for now mostly
          // but let's assume we pass them if we update schema later
        } as any);
        toast.success('Cliente criado com sucesso!');
      }
      navigate('/clients');
    } catch (e: any) {
      toast.error('Erro ao salvar cliente: ' + e.message);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-background-light dark:bg-background-dark">
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Excluir Cliente"
        message="Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
      <header className="sticky top-0 z-50 flex items-center p-4 bg-white dark:bg-surface-dark border-b dark:border-white/5">
        <button onClick={() => navigate(-1)} className="material-symbols-outlined mr-4">arrow_back</button>
        <h2 className="font-bold flex-1">{id ? 'Editar Cliente' : 'Novo Cliente'}</h2>
        <button onClick={handleSave} className="text-primary font-bold text-sm">Salvar</button>
      </header>

      <main className="p-4 space-y-4 overflow-y-auto">
        <div className="flex flex-col items-center py-4">
          <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
            <Avatar 
              src={formData.avatar} 
              name={formData.name} 
              size="size-24" 
              className="border-4 border-primary/20 shadow-lg group-hover:border-primary transition-colors" 
            />
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-white">photo_camera</span>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Foto do Cliente</p>
          <p className="text-[10px] text-slate-400">Clique para alterar</p>
        </div>

        <div className="space-y-4">
          <InputField label="Nome Completo" value={formData.name} onChange={v => setFormData({ ...formData, name: v })} />
          <InputField label="CPF ou CNPJ" value={formData.document} onChange={v => setFormData({ ...formData, document: v })} />
          <InputField label="WhatsApp" value={formData.phone} onChange={v => setFormData({ ...formData, phone: v })} />
          <InputField label="E-mail" value={formData.email || ''} onChange={v => setFormData({ ...formData, email: v })} />
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Endereço Completo</label>
            <textarea
              rows={3}
              className="w-full bg-white dark:bg-surface-dark border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
        </div>

        {id && (
          <div className="pt-4">
            <button
              onClick={() => setDeleteDialogOpen(true)}
              className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 font-bold py-3 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">delete</span>
              Excluir cliente
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

const InputField = ({ label, value, onChange }: any) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input
      className="w-full bg-white dark:bg-surface-dark border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

export default NewClient;
