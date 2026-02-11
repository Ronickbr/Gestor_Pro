
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Client } from '../types';
import { quotesService } from '../services/database';

const NewClient: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Client>({
    id: 'c' + Date.now(),
    name: '',
    address: '',
    phone: '',
    avatar: `https://picsum.photos/seed/${Date.now()}/100/100`,
    document: '',
    email: '',
    createdAt: new Date().toLocaleDateString('pt-BR')
  });

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
      <header className="sticky top-0 z-50 flex items-center p-4 bg-white dark:bg-surface-dark border-b dark:border-white/5">
        <button onClick={() => navigate(-1)} className="material-symbols-outlined mr-4">arrow_back</button>
        <h2 className="font-bold flex-1">{id ? 'Editar Cliente' : 'Novo Cliente'}</h2>
        <button onClick={handleSave} className="text-primary font-bold text-sm">Salvar</button>
      </header>

      <main className="p-4 space-y-4 overflow-y-auto">
        <div className="flex flex-col items-center py-4">
          <img src={formData.avatar} className="size-20 rounded-full border-4 border-primary/20 shadow-lg" alt="" />
          <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Foto do Cliente</p>
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
