
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Quote, QuoteStatus, ServiceItem, MaterialItem, Client } from '../types';
import toast from 'react-hot-toast';

import { profileService } from '../services/database';
import { generateContractText } from '../services/contractGenerator';

import { quotesService } from '../services/database';

interface ValidationError {
  [key: string]: {
    [field: string]: string;
  };
}

interface CatalogItem {
  id?: string;
  name: string;
  price: number;
  category: string;
}

const NewQuoteForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: editId } = useParams();
  const category = location.state?.category;

  const [isEditing, setIsEditing] = useState(false);
  const [storedClients, setStoredClients] = useState<Client[]>([]);
  const [client, setClient] = useState<Client>({} as Client);
  const [warrantyDuration, setWarrantyDuration] = useState(12);
  const [paymentTerms, setPaymentTerms] = useState('50% na entrada e 50% na conclusão');
  const [validUntil, setValidUntil] = useState(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]); // Default 15 days
  const [services, setServices] = useState<ServiceItem[]>([
    { id: crypto.randomUUID(), name: category?.name || '', description: category?.description || '', price: 0 }
  ]);
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<{ id: string, index: number } | null>(null);

  const [errors, setErrors] = useState<ValidationError>({});
  const [showErrors, setShowErrors] = useState(false);

  const [contractTemplates, setContractTemplates] = useState<any[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [accessPassword, setAccessPassword] = useState('');

  useEffect(() => {
    loadInitialData();
  }, [editId]);

  const loadInitialData = async () => {
    try {
      // Load clients
      const fetchedClients = await quotesService.fetchClients();
      if (fetchedClients.length > 0) {
        setStoredClients(fetchedClients);
        // Default to first client if none selected and not editing
        if (!editId) setClient(fetchedClients[0]);
      } else {
        setStoredClients([]);
        setClient({} as Client); // Ensure client is an empty object if no clients are found
      }

      let profileData = null;
      try {
        profileData = await profileService.getProfile();
        setCatalog(profileData.materialCatalog || []);

        if (profileData.contractTemplates && profileData.contractTemplates.length > 0) {
          setContractTemplates(profileData.contractTemplates);
          // Default to first template if not editing
          if (!editId) setSelectedTemplateId(profileData.contractTemplates[0].id);
        }
      } catch (e) {
        console.error('Erro ao carregar catálogo/templates', e);
      }

      // Load existing quote if editing
      if (editId) {
        const _quotes = await quotesService.fetchQuotes(); // Optimize: fetch single
        const existing = _quotes.find(q => q.id === editId);
        if (existing) {
          setIsEditing(true);
          setClient(existing.client);
          setWarrantyDuration(existing.warrantyDuration);
          setServices(existing.services);
          setMaterials(existing.materials);
          if (existing.paymentTerms) setPaymentTerms(existing.paymentTerms);
          if (existing.validUntil) setValidUntil(existing.validUntil.split('T')[0]);
          if (existing.accessPassword) setAccessPassword(existing.accessPassword);

          // Select default template so user can regenerate if needed
          if (profileData && profileData.contractTemplates && profileData.contractTemplates.length > 0) {
            setSelectedTemplateId(profileData.contractTemplates[0].id);
          }
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar dados.');
    }
  };

  const handleAddService = () => {
    setServices([...services, { id: crypto.randomUUID(), name: '', description: '', price: 0 }]);
  };

  const handleRemoveService = (id: string) => {
    if (services.length > 1) {
      setServices(services.filter(s => s.id !== id));
      const newErrors = { ...errors };
      delete newErrors[id];
      setErrors(newErrors);
    }
  };

  const handleAddMaterial = () => {
    setMaterials([...materials, {
      id: crypto.randomUUID(),
      name: '',
      brand: 'Genérica',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0
    }]);
  };

  const handleRemoveMaterial = (id: string) => {
    setMaterials(materials.filter(m => m.id !== id));
    const newErrors = { ...errors };
    delete newErrors[id];
    setErrors(newErrors);
  };

  const updateService = (id: string, field: keyof ServiceItem, value: any) => {
    setServices(services.map(s => s.id === id ? { ...s, [field]: value } : s));
    if (errors[id]?.[field]) {
      const newErrors = { ...errors };
      delete newErrors[id][field];
      setErrors(newErrors);
    }
  };

  const updateMaterial = (id: string, field: keyof MaterialItem, value: any) => {
    setMaterials(materials.map(m => {
      if (m.id === id) {
        const updatedItem = { ...m, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.totalPrice = updatedItem.quantity * updatedItem.unitPrice;
        }
        return updatedItem;
      }
      return m;
    }));
    if (errors[id]?.[field]) {
      const newErrors = { ...errors };
      delete newErrors[id][field];
      setErrors(newErrors);
    }
  };

  const selectFromCatalog = (id: string, item: CatalogItem) => {
    updateMaterial(id, 'name', item.name);
    updateMaterial(id, 'unitPrice', item.price);
    setActiveSuggestionIndex(null);
  };

  const validate = (): boolean => {
    const newErrors: ValidationError = {};
    let isValid = true;

    if (!client.id) {
      toast.error('Por favor, selecione um cliente para continuar.');
      isValid = false;
    }

    services.forEach(s => {
      newErrors[s.id] = {};
      if (!s.name.trim()) {
        newErrors[s.id].name = 'Obrigatório';
        isValid = false;
      }
      if (s.price <= 0) {
        newErrors[s.id].price = 'Maior que 0';
        isValid = false;
      }
    });

    materials.forEach(m => {
      newErrors[m.id] = {};
      if (!m.name.trim()) {
        newErrors[m.id].name = 'Obrigatório';
        isValid = false;
      }
      if (m.quantity <= 0) {
        newErrors[m.id].quantity = 'Qtd > 0';
        isValid = false;
      }
      if (m.unitPrice <= 0) {
        newErrors[m.id].unitPrice = 'Preço > 0';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const calculateTotal = () => {
    const sTotal = services.reduce((acc, s) => acc + s.price, 0);
    const mTotal = materials.reduce((acc, m) => acc + m.totalPrice, 0);
    return sTotal + mTotal;
  };

  const handleSave = async () => {
    setShowErrors(true);
    if (!validate()) return;

    // Save new items to catalog
    try {
      const profile = await profileService.getProfile();
      const currentCatalog = profile.materialCatalog || [];
      const newItems: any[] = [];

      materials.forEach(m => {
        if (!currentCatalog.find((c: any) => c.name === m.name)) {
          newItems.push({ name: m.name, price: m.unitPrice, category: 'Geral' });
        }
      });

      if (newItems.length > 0) {
        await profileService.updateProfile({
          materialCatalog: [...currentCatalog, ...newItems]
        });
      }
    } catch (error) {
      console.error('Erro ao salvar catálogo', error);
    }

    try {
      const quoteData = {
        number: '#' + Math.floor(1000 + Math.random() * 9000), // Should probably stay same if editing
        status: QuoteStatus.SENT, // Or keep existing status
        services,
        materials,
        warrantyDuration,
        paymentTerms,
        contractTerms: '', // Will be generated or updated separately?
        date: new Date().toISOString().split('T')[0],
        validUntil: validUntil, // Use state value
        accessPassword: accessPassword // Send empty string if empty to clear password
      };

      if (isEditing && editId) {
        // We need to fetch the existing quote to keep some fields like number, status, etc if not changed
        // For now, let's assume updateQuote handles merge or we pass what we have
        const quoteToUpdate: Quote = {
          id: editId,
          client,
          ...quoteData,
          status: QuoteStatus.SENT, // Simplification: resets status on edit? Or should fetch current?
          // Ideally we'd keep original number and status.
          // For MVP let's assume we just update the content fields.
        } as any;

        // Better:
        const existingQuotes = await quotesService.fetchQuotes();
        const original = existingQuotes.find(q => q.id === editId);

        // Generate contract text (regenerate on edit to ensure it matches current data/template)
        let templateContent = category?.contractTemplate || 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS\n\nCONTRATANTE: {{CLIENTE_NOME}}\nCONTRATADO: {{CONTRATADO_EMPRESA}}\n\nSERVIÇOS:\n{{LISTA_SERVICOS}}\n\nVALOR: {{VALOR_TOTAL}}\n\nPAGAMENTO: {{FORMA_PAGAMENTO}}';

        if (selectedTemplateId) {
          const selected = contractTemplates.find(t => t.id === selectedTemplateId);
          if (selected) templateContent = selected.content;
        }

        const profile = await profileService.getProfile();
        const contractText = generateContractText(
          templateContent,
          { id: editId, number: original?.number || quoteData.number, client, services, materials, warrantyDuration, paymentTerms, status: QuoteStatus.SENT, date: quoteData.date, validUntil: quoteData.validUntil } as any,
          {
            id: profile.id,
            name: profile.name,
            companyName: profile.companyName || '',
            document: profile.document || '',
            email: profile.email || '',
            phone: profile.phone,
            address: profile.address,
            logo: profile.logo,
            techSignature: profile.techSignature
          } as any
        );

        if (original) {
          await quotesService.updateQuote({
            ...original,
            client,
            services,
            materials,
            validUntil: quoteData.validUntil,
            warrantyDuration: quoteData.warrantyDuration,
            paymentTerms: quoteData.paymentTerms,
            // Only update contract text if it was explicitly regenerated? 
            // Currently we regenerate it on every save if template is selected.
            contractTerms: contractText,
            contractNumber: original.number || quoteData.number, // Ensure number persistence
            accessPassword: accessPassword || undefined
          } as any);
          navigate(`/quote/${editId}`, { state: { updated: true } });
        }

      } else {
        // Create
        let templateContent = category?.contractTemplate || 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS\n\nCONTRATANTE: {{CLIENTE_NOME}}\nCONTRATADO: {{CONTRATADO_EMPRESA}}\n\nSERVIÇOS:\n{{LISTA_SERVICOS}}\n\nVALOR: {{VALOR_TOTAL}}\n\nPAGAMENTO: {{FORMA_PAGAMENTO}}';

        if (selectedTemplateId) {
          const selected = contractTemplates.find(t => t.id === selectedTemplateId);
          if (selected) templateContent = selected.content;
        }

        const contractText = generateContractText(
          templateContent,
          { id: '', number: '', client, services, materials, warrantyDuration, paymentTerms, status: QuoteStatus.SENT, date: '', validUntil: '' } as any,
          await profileService.getProfile().then(p => ({
            id: p.id,
            name: p.name,
            companyName: p.companyName || '',
            document: p.document || '',
            email: p.email || '',
            phone: p.phone,
            address: p.address,
            logo: p.logo,
            techSignature: p.techSignature
          })) as any
        );

        const data = await quotesService.createQuote({
          number: quoteData.number,
          status: quoteData.status,
          date: quoteData.date,
          validUntil: quoteData.validUntil,
          warrantyDuration,
          paymentTerms,
          client: client,
          services,
          materials,
          contractTerms: contractText
        } as any);

        // We also need to save the contract text to contracts table?
        // Strategy: The 'contractTerms' in Quote model was likely just for local storage.
        // In Supabase schema we separated 'contracts' table.
        // Let's save the contract draft.
        navigate(`/quote/${data.id}`, { state: { created: true } });
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || 'Erro ao salvar orçamento. Verifique se todos os campos estão preenchidos.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full mx-auto bg-background-light dark:bg-background-dark md:py-8 md:px-4">
      <div className="w-full max-w-5xl mx-auto md:bg-white md:dark:bg-surface-dark md:rounded-3xl md:shadow-xl md:border md:dark:border-white/5 md:overflow-hidden relative">
        <header className="sticky top-0 z-50 flex items-center p-4 bg-white dark:bg-surface-dark border-b dark:border-white/5 md:px-8">
          <button onClick={() => navigate(-1)} className="material-symbols-outlined mr-4">close</button>
          <div className="flex-1 flex flex-col">
            <h2 className="font-bold text-sm">{isEditing ? 'Editar Orçamento' : 'Novo Orçamento'}</h2>
            <span className="text-[10px] text-slate-500">Total: R$ {calculateTotal().toLocaleString('pt-BR')}</span>
          </div>
          <button onClick={handleSave} className="text-primary font-bold text-sm px-4 py-2 bg-primary/10 rounded-full">
            {isEditing ? 'Atualizar' : 'Salvar'}
          </button>
        </header>

        <main className="p-4 space-y-6 pb-40 md:p-8 md:pb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">

            {/* Left Column: Client Data & Settings */}
            <div className="md:col-span-4 space-y-6">
              <section className="bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-sm border dark:border-white/5 md:border md:border-slate-100 md:shadow-none">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cliente</h3>
                  <button
                    onClick={() => navigate('/new-client')}
                    className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    novo
                  </button>
                </div>

                <div className="space-y-3">
                  <select
                    className="w-full bg-slate-50 dark:bg-background-dark border-none rounded-xl text-sm font-medium h-12 px-4 focus:ring-1 focus:ring-primary"
                    value={client.id}
                    onChange={(e) => {
                      const selected = storedClients.find(c => c.id === e.target.value);
                      if (selected) setClient(selected);
                    }}
                  >
                    {storedClients.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>

                  <div className="flex items-center gap-3 p-3 border border-slate-100 dark:border-white/5 rounded-xl">
                    <img src={client.avatar} className="size-10 rounded-full border border-primary/20" alt="Avatar" />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm truncate">{client.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{client.document || 'CPF/CNPJ não informado'}</p>
                      <p className="text-[10px] text-slate-500 truncate">{client.address}</p>
                      <p className="text-[10px] text-slate-400 truncate">{client.phone}</p>
                    </div>
                  </div>
                </div>
              </section>

              {category && !isEditing && (
                <div className="bg-primary/10 border border-primary/20 p-3 rounded-xl flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">{category.icon}</span>
                  <div>
                    <p className="text-[10px] font-bold text-primary uppercase">Categoria Selecionada</p>
                    <p className="text-xs font-bold">{category.name}</p>
                  </div>
                </div>
              )}

              <section className="bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-sm border dark:border-white/5 space-y-3 md:border md:border-slate-100 md:shadow-none">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-primary text-lg">verified_user</span>
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Configuração</h3>
                </div>
                {contractTemplates.length > 0 && (
                  <div className="space-y-1 mb-3">
                    <label className="text-xs font-medium text-slate-500">Modelo de Contrato</label>
                    <select
                      className="w-full bg-slate-50 dark:bg-background-dark border-none rounded-xl text-sm font-bold h-12 px-4 focus:ring-1 focus:ring-primary"
                      value={selectedTemplateId}
                      onChange={(e) => setSelectedTemplateId(e.target.value)}
                    >
                      {contractTemplates.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex gap-4">
                  <div className="flex-1 space-y-1">
                    <label className="text-xs font-medium text-slate-500">Validade</label>
                    <input
                      type="date"
                      className="w-full bg-slate-50 dark:bg-background-dark border-none rounded-xl text-xs font-bold h-10 px-3 focus:ring-1 focus:ring-primary"
                      value={validUntil}
                      onChange={(e) => setValidUntil(e.target.value)}
                    />
                  </div>

                  <div className="flex-1 space-y-1">
                    <label className="text-xs font-medium text-slate-500">Garantia</label>
                    <select
                      className="w-full bg-slate-50 dark:bg-background-dark border-none rounded-xl text-xs font-bold h-10 px-3 focus:ring-1 focus:ring-primary"
                      value={warrantyDuration}
                      onChange={(e) => setWarrantyDuration(Number(e.target.value))}
                    >
                      <option value={3}>3 Meses</option>
                      <option value={6}>6 Meses</option>
                      <option value={12}>12 Meses</option>
                      <option value={24}>24 Meses</option>
                      <option value={36}>36 Meses</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500">Senha de Acesso (Opcional)</label>
                  <div className="relative">
                      <input
                          type="text"
                          placeholder="Deixe em branco para acesso livre"
                          className="w-full bg-slate-50 dark:bg-background-dark border-none rounded-xl text-xs font-bold h-10 pl-3 pr-16 focus:ring-1 focus:ring-primary"
                          value={accessPassword}
                          onChange={(e) => setAccessPassword(e.target.value)}
                      />
                      <button 
                          onClick={() => setAccessPassword(Math.floor(1000 + Math.random() * 9000).toString())}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-primary text-[10px] font-bold hover:bg-primary/10 px-2 py-1 rounded"
                          title="Gerar Senha"
                      >
                          GERAR
                      </button>
                  </div>
                  <p className="text-[10px] text-slate-400">O cliente precisará desta senha para visualizar.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-500">Pagamento</label>

                  {/* Quick Selectors */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {['Pix', 'Cartão de Crédito', 'Cartão de Débito', 'Transferência', 'Dinheiro'].map(method => (
                      <button
                        key={method}
                        onClick={() => {
                          // Exclusive selection: Replace content
                          if (paymentTerms.includes(method)) {
                            setPaymentTerms('');
                          } else {
                            setPaymentTerms(method);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${paymentTerms.includes(method)
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white dark:bg-surface-dark border-slate-200 dark:border-white/10 text-slate-500'
                          }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>

                  {/* Installments Helper - Only visible if 'Cartão de Crédito' is selected */}
                  {paymentTerms.includes('Cartão de Crédito') && (
                    <div className="flex items-center gap-2 mb-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Parcelamento:</span>
                      <select
                        className="bg-transparent border-none text-xs font-bold focus:ring-0 p-0 text-slate-700 dark:text-slate-300"
                        onChange={(e) => {
                          const val = e.target.value;
                          if (!val) return;

                          // Clean existing installment text if any
                          let baseTerm = paymentTerms.split(' (')[0];
                          if (baseTerm !== 'Cartão de Crédito') baseTerm = 'Cartão de Crédito';

                          setPaymentTerms(`${baseTerm} (${val})`);
                        }}
                      >
                        <option value="">Selecione...</option>
                        {[...Array(12)].map((_, i) => (
                          <option key={i} value={`${i + 1}x`}>{i + 1}x</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <textarea
                    className="w-full bg-slate-50 dark:bg-background-dark border-none rounded-xl text-xs font-medium p-3 focus:ring-1 focus:ring-primary min-h-[60px]"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    placeholder="Detalhes do pagamento..."
                  />
                </div>
              </section>
            </div>

            {/* Right Column: Services & Materials */}
            <div className="md:col-span-8 space-y-6">

              {/* Serviços */}
              <section className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Serviços</h3>
                  <button onClick={handleAddService} className="text-primary text-[10px] font-bold uppercase tracking-widest hover:bg-primary/5 px-2 py-1 rounded transition-colors">+ Adicionar Serviço</button>
                </div>
                <div className="space-y-3">
                  {services.map((s) => (
                    <div key={s.id} className="bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-sm border dark:border-white/5 flex gap-4 items-start md:border md:border-slate-100 md:shadow-none transition-all hover:border-primary/30">
                      <div className="flex-1 space-y-2">
                        <input
                          placeholder="Descrição do serviço"
                          className={`w-full bg-transparent border-none p-0 text-sm font-medium focus:ring-0 placeholder:text-slate-300 ${showErrors && errors[s.id]?.name ? 'text-red-500' : ''}`}
                          value={s.name}
                          onChange={e => updateService(s.id, 'name', e.target.value)}
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="relative w-32">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">R$</span>
                          <input
                            type="number"
                            placeholder="0,00"
                            className={`w-full bg-slate-50 dark:bg-background-dark border-none rounded-xl text-sm pl-8 pr-3 py-2 focus:ring-1 focus:ring-primary font-bold ${showErrors && errors[s.id]?.price ? 'ring-1 ring-red-500' : ''}`}
                            value={s.price || ''}
                            onChange={e => updateService(s.id, 'price', Number(e.target.value))}
                          />
                        </div>
                        <button onClick={() => handleRemoveService(s.id)} className="size-8 flex items-center justify-center rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Materiais */}
              <section className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Produtos/Materiais</h3>
                  <button onClick={handleAddMaterial} className="text-primary text-[10px] font-bold uppercase tracking-widest hover:bg-primary/5 px-2 py-1 rounded transition-colors">+ Adicionar Produto</button>
                </div>

                <div className="space-y-3">
                  {materials.map((m, mIdx) => {
                    const suggestions = m.name.length > 1 ? catalog.filter(c => c.name.toLowerCase().includes(m.name.toLowerCase())) : [];
                    return (
                      <div key={m.id} className="bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-sm border dark:border-white/5 relative md:border md:border-slate-100 md:shadow-none transition-all hover:border-primary/30">
                        <div className="flex flex-col md:flex-row gap-4 items-start">
                          <div className="flex-1 w-full relative">
                            <input
                              placeholder="Buscar ou digitar produto..."
                              className={`w-full bg-transparent border-none p-0 text-sm font-medium focus:ring-0 placeholder:text-slate-300 ${showErrors && errors[m.id]?.name ? 'text-red-500' : ''}`}
                              value={m.name}
                              onFocus={() => setActiveSuggestionIndex({ id: m.id, index: mIdx })}
                              onChange={e => updateMaterial(m.id, 'name', e.target.value)}
                            />

                            {activeSuggestionIndex?.id === m.id && suggestions.length > 0 && (
                              <div className="absolute left-0 right-0 top-8 z-[60] bg-white dark:bg-surface-dark border dark:border-white/10 rounded-xl shadow-xl max-h-40 overflow-y-auto divide-y dark:divide-white/5">
                                {suggestions.map((item, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => selectFromCatalog(m.id, item)}
                                    className="w-full px-4 py-3 text-left text-sm hover:bg-primary/10 flex justify-between items-center"
                                  >
                                    <span className="font-medium">{item.name}</span>
                                    <span className="text-[10px] font-bold text-primary">R$ {item.unitPrice}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex gap-3 w-full md:w-auto items-center">
                            <div className="w-20">
                              <input
                                type="number"
                                placeholder="Qtd"
                                className="w-full bg-slate-50 dark:bg-background-dark border-none rounded-xl text-sm px-3 py-2 focus:ring-1 focus:ring-primary font-bold text-center"
                                value={m.quantity}
                                onChange={e => updateMaterial(m.id, 'quantity', Number(e.target.value))}
                              />
                            </div>
                            <span className="text-slate-300 text-xs">x</span>
                            <div className="w-28 relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">R$</span>
                              <input
                                type="number"
                                placeholder="Unit."
                                className="w-full bg-slate-50 dark:bg-background-dark border-none rounded-xl text-sm pl-8 pr-3 py-2 focus:ring-1 focus:ring-primary font-bold"
                                value={m.unitPrice || ''}
                                onChange={e => updateMaterial(m.id, 'unitPrice', Number(e.target.value))}
                              />
                            </div>

                            <div className="w-24 text-right">
                              <p className="text-xs font-bold text-primary">R$ {m.totalPrice.toLocaleString('pt-BR')}</p>
                            </div>

                            <button onClick={() => handleRemoveMaterial(m.id)} className="size-8 flex items-center justify-center rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors ml-2">
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {materials.length === 0 && (
                  <div className="p-8 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-2xl text-center text-slate-400">
                    <span className="material-symbols-outlined text-3xl block mb-2">shopping_bag</span>
                    <p className="text-xs">Nenhum produto adicionado.</p>
                  </div>
                )}
              </section>

            </div>
          </div>
        </main>

        <footer className="fixed bottom-[90px] left-0 right-0 p-4 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-t dark:border-white/5 z-50 md:absolute md:bottom-0 md:left-0 md:right-0 md:border-t md:border-slate-100">
          <div className="max-w-md mx-auto md:max-w-none md:flex md:justify-end">
            <button
              onClick={handleSave}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-transform md:w-auto md:px-12 md:py-3 md:text-sm md:rounded-lg md:shadow-primary/30"
            >
              {isEditing ? 'Atualizar Orçamento' : 'Finalizar e Gerar Contrato'}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default NewQuoteForm;
