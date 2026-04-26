import * as React from 'react';
import type { MaterialItem } from '../types';
import { Button } from './ui/Button';
import { Field } from './ui/Field';
import { Input } from './ui/Input';
import { cn } from '../lib/utils';
import { findCatalogDuplicate, generateNextCatalogCode, getCatalogCategory, normalizeKey } from '../lib/catalog';

type PickerMode = 'material' | 'service';

type CatalogPickerModalProps = {
  open: boolean;
  mode: PickerMode;
  items: MaterialItem[];
  allowCreate: boolean;
  onClose: () => void;
  onSelect: (item: MaterialItem) => void;
  onCreate: (item: MaterialItem) => void;
};

const PAGE_SIZE = 10;

export const CatalogPickerModal: React.FC<CatalogPickerModalProps> = ({
  open,
  mode,
  items,
  allowCreate,
  onClose,
  onSelect,
  onCreate,
}) => {
  const [view, setView] = React.useState<'list' | 'create'>('list');
  const [page, setPage] = React.useState(1);

  const [qName, setQName] = React.useState('');
  const [qCode, setQCode] = React.useState('');
  const [qCategory, setQCategory] = React.useState('');
  const [minPrice, setMinPrice] = React.useState('');
  const [maxPrice, setMaxPrice] = React.useState('');

  const [form, setForm] = React.useState({
    kind: mode === 'service' ? ('service' as const) : ('product' as const),
    name: '',
    description: '',
    category: mode === 'service' ? 'Serviços' : 'Geral',
    unit: mode === 'service' ? 'serv' : 'un',
    code: '',
    unitPrice: '',
    cost: '',
    margin: '',
  });
  const [createError, setCreateError] = React.useState<string>('');

  React.useEffect(() => {
    if (!open) return;
    setView('list');
    setPage(1);
    setQName('');
    setQCode('');
    setQCategory('');
    setMinPrice('');
    setMaxPrice('');
    setForm({
      kind: mode === 'service' ? 'service' : 'product',
      name: '',
      description: '',
      category: mode === 'service' ? 'Serviços' : 'Geral',
      unit: mode === 'service' ? 'serv' : 'un',
      code: '',
      unitPrice: '',
      cost: '',
      margin: '',
    });
    setCreateError('');
  }, [open, mode]);

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const categories = React.useMemo(() => {
    const set = new Set<string>();
    for (const item of items) set.add(getCatalogCategory(item));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const filtered = React.useMemo(() => {
    const nameKey = normalizeKey(qName);
    const codeKey = normalizeKey(qCode);
    const categoryKey = normalizeKey(qCategory);
    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;

    return items
      .filter((it) => (mode === 'service' ? it.kind === 'service' || !it.kind : it.kind !== 'service'))
      .filter((it) => {
        const inName = !nameKey || normalizeKey(it.name || '').includes(nameKey);
        const inCode = !codeKey || normalizeKey(it.code || '').includes(codeKey);
        const inCategory = !categoryKey || normalizeKey(getCatalogCategory(it)) === categoryKey;
        const price = Number(it.unitPrice || 0);
        const inMin = min === null || price >= min;
        const inMax = max === null || price <= max;
        return inName && inCode && inCategory && inMin && inMax;
      })
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [items, mode, qName, qCode, qCategory, minPrice, maxPrice]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  React.useEffect(() => {
    if (!open) return;
    setPage(1);
  }, [open, qName, qCode, qCategory, minPrice, maxPrice]);

  const onChangeUnitPrice = (value: string) => {
    const next = { ...form, unitPrice: value };
    const price = Number(value);
    const cost = next.cost ? Number(next.cost) : NaN;
    if (Number.isFinite(price) && price > 0 && Number.isFinite(cost) && cost >= 0) {
      next.margin = String(((price - cost) / price) * 100);
    }
    setForm(next);
  };

  const onChangeCost = (value: string) => {
    const next = { ...form, cost: value };
    const price = next.unitPrice ? Number(next.unitPrice) : NaN;
    const cost = Number(value);
    if (Number.isFinite(price) && price > 0 && Number.isFinite(cost) && cost >= 0) {
      next.margin = String(((price - cost) / price) * 100);
    }
    setForm(next);
  };

  const onChangeMargin = (value: string) => {
    const next = { ...form, margin: value };
    const price = next.unitPrice ? Number(next.unitPrice) : NaN;
    const margin = Number(value);
    if (Number.isFinite(price) && price > 0 && Number.isFinite(margin)) {
      next.cost = String(price * (1 - margin / 100));
    }
    setForm(next);
  };

  const submitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allowCreate) return;

    const name = form.name.trim();
    const unitPrice = Number(form.unitPrice);
    const cost = form.cost ? Number(form.cost) : undefined;
    const margin = form.margin ? Number(form.margin) : undefined;

    if (!name) {
      setCreateError('Informe um nome.');
      return;
    }
    if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
      setCreateError('Informe um preço unitário válido.');
      return;
    }
    if (!form.category.trim()) {
      setCreateError('Informe uma categoria.');
      return;
    }
    if (!form.unit.trim()) {
      setCreateError('Informe uma unidade.');
      return;
    }
    if (cost !== undefined && (!Number.isFinite(cost) || cost < 0)) {
      setCreateError('Informe um custo válido.');
      return;
    }
    if (margin !== undefined && !Number.isFinite(margin)) {
      setCreateError('Informe uma margem válida.');
      return;
    }

    const code = form.code.trim() ? form.code.trim().toUpperCase() : generateNextCatalogCode(items, form.kind);
    const dup = findCatalogDuplicate(items, { name, code });
    if (dup) {
      setCreateError('Já existe um item com este nome ou código no catálogo.');
      return;
    }

    const item: MaterialItem = {
      id: crypto.randomUUID(),
      catalogItemId: undefined,
      kind: form.kind,
      status: 'active',
      code,
      category: form.category.trim(),
      unit: form.unit.trim(),
      description: form.description.trim() || undefined,
      cost,
      margin,
      name,
      brand: form.category.trim(),
      quantity: 1,
      unitPrice,
      totalPrice: unitPrice,
    };

    setCreateError('');
    onCreate(item);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-white dark:bg-surface-dark shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-200/70 dark:border-white/10">
          <div className="min-w-0">
            <div className="text-sm font-black text-slate-900 dark:text-white">Catálogo</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {mode === 'service' ? 'Selecione um serviço' : 'Selecione um produto/material'}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {allowCreate ? (
              <Button type="button" variant={view === 'create' ? 'primary' : 'secondary'} size="sm" onClick={() => setView(view === 'create' ? 'list' : 'create')}>
                {view === 'create' ? 'Voltar' : 'Criar novo'}
              </Button>
            ) : null}
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>

        {view === 'list' ? (
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <Field label="Nome">
                <Input value={qName} onChange={(e) => setQName(e.target.value)} placeholder="Buscar por nome" startIcon="search" />
              </Field>
              <Field label="Código">
                <Input value={qCode} onChange={(e) => setQCode(e.target.value)} placeholder="Ex: PRD-000123" startIcon="qr_code" />
              </Field>
              <Field label="Categoria">
                <select
                  className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 transition-all focus-ring dark:border-white/10 dark:bg-white/5 dark:text-white"
                  value={qCategory}
                  onChange={(e) => setQCategory(e.target.value)}
                >
                  <option value="">Todas</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Preço mín.">
                <Input value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="0" inputMode="decimal" />
              </Field>
              <Field label="Preço máx.">
                <Input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="9999" inputMode="decimal" />
              </Field>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
              <div className="grid grid-cols-12 gap-0 bg-slate-50 dark:bg-white/5 text-xs font-black text-slate-500 dark:text-slate-300">
                <div className="col-span-3 px-4 py-3">Código</div>
                <div className="col-span-5 px-4 py-3">Item</div>
                <div className="col-span-2 px-4 py-3">Categoria</div>
                <div className="col-span-2 px-4 py-3 text-right">Preço</div>
              </div>
              <div className="divide-y divide-slate-200 dark:divide-white/10 max-h-[360px] overflow-y-auto">
                {pageItems.length === 0 ? (
                  <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">Nenhum item encontrado.</div>
                ) : (
                  pageItems.map((it) => (
                    <button
                      key={it.id}
                      type="button"
                      onClick={() => onSelect(it)}
                      className={cn(
                        'grid grid-cols-12 gap-0 w-full text-left px-0 py-0 hover:bg-primary/5 transition-colors',
                        'focus-ring',
                      )}
                    >
                      <div className="col-span-3 px-4 py-3 text-xs font-bold text-slate-600 dark:text-slate-300">
                        {it.code || '—'}
                      </div>
                      <div className="col-span-5 px-4 py-3">
                        <div className="text-sm font-bold text-slate-900 dark:text-white">{it.name}</div>
                        {it.description ? (
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{it.description}</div>
                        ) : null}
                      </div>
                      <div className="col-span-2 px-4 py-3 text-xs text-slate-600 dark:text-slate-300">{getCatalogCategory(it)}</div>
                      <div className="col-span-2 px-4 py-3 text-right text-xs font-black text-primary">
                        R$ {Number(it.unitPrice || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {filtered.length} itens • página {safePage} de {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" size="sm" variant="secondary" disabled={safePage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  Anterior
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  disabled={safePage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Próxima
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-5">
            <form onSubmit={submitCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Tipo">
                  <select
                    className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 transition-all focus-ring dark:border-white/10 dark:bg-white/5 dark:text-white"
                    value={form.kind}
                    onChange={(e) => setForm({ ...form, kind: e.target.value as any })}
                    disabled={mode === 'service' || mode === 'material'}
                  >
                    <option value="product">Produto</option>
                    <option value="service">Serviço</option>
                  </select>
                </Field>
                <Field label="Código (opcional)">
                  <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="Ex: PRD-000123" />
                </Field>
              </div>

              <Field label="Nome" htmlFor="newCatalogName">
                <Input id="newCatalogName" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Instalação" />
              </Field>

              <Field label="Descrição" htmlFor="newCatalogDesc">
                <input
                  id="newCatalogDesc"
                  className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 transition-all focus-ring dark:border-white/10 dark:bg-white/5 dark:text-white"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Detalhes do item (opcional)"
                />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Categoria">
                  <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Ex: Elétrica" />
                </Field>
                <Field label="Unidade">
                  <Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="Ex: un / m / h" />
                </Field>
                <Field label="Preço unitário (R$)">
                  <Input value={form.unitPrice} onChange={(e) => onChangeUnitPrice(e.target.value)} placeholder="0,00" inputMode="decimal" />
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Custo (R$)">
                  <Input value={form.cost} onChange={(e) => onChangeCost(e.target.value)} placeholder="0,00" inputMode="decimal" />
                </Field>
                <Field label="Margem (%)">
                  <Input value={form.margin} onChange={(e) => onChangeMargin(e.target.value)} placeholder="0" inputMode="decimal" />
                </Field>
              </div>

              {createError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
                  {createError}
                </div>
              ) : null}

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setView('list')}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={!allowCreate}>
                  Criar e selecionar
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
