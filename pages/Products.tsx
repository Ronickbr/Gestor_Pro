import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { profileService } from '../services/database';
import { MaterialItem } from '../types';

const ProductCatalog: React.FC = () => {
  const navigate = useNavigate();
  const [catalog, setCatalog] = useState<MaterialItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    unitPrice: 0
  });

  useEffect(() => {
    loadCatalog();
  }, []);

  const loadCatalog = async () => {
    try {
      const profile = await profileService.getProfile();
      setCatalog(profile.materialCatalog || []);
    } catch (e) {
      console.error(e);
      toast.error('Erro ao carregar catálogo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Nome do produto é obrigatório');
      return;
    }

    setIsSaving(true);
    try {
      let updatedCatalog = [...catalog];
      const safeId = () => crypto.randomUUID?.() || Math.random().toString(36).substring(2, 15);
      
      if (editingId) {
        updatedCatalog = updatedCatalog.map(item => 
          item.id === editingId ? { ...item, ...formData, totalPrice: formData.unitPrice } : item
        );
      } else {
        const newItem: MaterialItem = {
          id: safeId(),
          ...formData,
          quantity: 1,
          totalPrice: formData.unitPrice
        };
        updatedCatalog.push(newItem);
      }

      await profileService.updateProfile({ materialCatalog: updatedCatalog });
      setCatalog(updatedCatalog);
      setShowForm(false);
      resetForm();
      toast.success(editingId ? 'Produto atualizado' : 'Produto adicionado');
    } catch (e) {
      console.error(e);
      toast.error('Erro ao salvar produto');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      const updatedCatalog = catalog.filter(item => item.id !== id);
      await profileService.updateProfile({ materialCatalog: updatedCatalog });
      setCatalog(updatedCatalog);
      toast.success('Produto removido');
    } catch (e) {
      console.error(e);
      toast.error('Erro ao excluir produto');
    }
  };

  const handleEdit = (item: MaterialItem) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      brand: item.brand,
      unitPrice: item.unitPrice
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', brand: '', unitPrice: 0 });
  };

  const filteredCatalog = catalog.filter(item => 
    (item.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (item.brand?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-background-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background-dark p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Minha Lista de Produtos</h1>
            <p className="text-slate-500 text-sm">Gerencie os produtos e serviços que você mais utiliza.</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">add</span>
            Novo Produto
          </button>
        </header>

        {/* Search Bar */}
        <div className="bg-white dark:bg-surface-dark p-2 rounded-2xl border dark:border-white/5 mb-6 flex items-center gap-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <span className="material-symbols-outlined text-slate-400 ml-2">search</span>
          <input
            type="text"
            placeholder="Buscar produto ou marca..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Form Modal/Section */}
        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in transition-all">
            <div className="bg-white dark:bg-surface-dark w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">{editingId ? 'Editar Produto' : 'Novo Produto'}</h3>
                <button onClick={() => setShowForm(false)} className="material-symbols-outlined text-slate-400 hover:text-red-500 transition-colors">close</button>
              </div>
              
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Nome do Produto/Serviço</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-50 dark:bg-background-dark border-none rounded-xl h-12 px-4 focus:ring-2 focus:ring-primary/20 transition-all"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Instalação de Ar Condicionado"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Marca/Categoria</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 dark:bg-background-dark border-none rounded-xl h-12 px-4 focus:ring-2 focus:ring-primary/20 transition-all"
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Ex: Springer Midea"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Preço Sugerido (R$)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      className="w-full bg-slate-50 dark:bg-background-dark border-none rounded-xl h-12 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                      value={formData.unitPrice || ''}
                      onChange={e => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                      placeholder="0,00"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-4 rounded-xl font-bold bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 py-4 rounded-xl font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Salvando...' : 'Salvar Produto'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Catalog List */}
        <div className="grid gap-4">
          {filteredCatalog.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-surface-dark rounded-3xl border border-dashed border-slate-200 dark:border-white/10">
              <span className="material-symbols-outlined text-5xl text-slate-200 mb-4 block">inventory_2</span>
              <p className="text-slate-400">Nenhum produto cadastrado que corresponda à busca.</p>
            </div>
          ) : (
            filteredCatalog.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-surface-dark p-4 md:p-6 rounded-2xl border dark:border-white/5 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 dark:text-white truncate">{item.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{item.brand || 'Sem marca'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-primary">R$ {(item.unitPrice || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <div className="flex items-center justify-end gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(item)}
                        className="size-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all"
                      >
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="size-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;
