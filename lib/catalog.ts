import type { MaterialItem, ServiceItem, UserProfile } from '../types';

export const normalizeKey = (value: string) => value.trim().toLowerCase();

export const getCatalogCategory = (item: MaterialItem) => item.category || item.brand || 'Geral';

export const canCreateCatalogItems = (profile: Pick<UserProfile, 'subscriptionStatus'> | null) => {
  if (!profile) return false;
  return profile.subscriptionStatus === 'active' || profile.subscriptionStatus === 'trial' || !profile.subscriptionStatus;
};

export const findCatalogDuplicate = (catalog: MaterialItem[], candidate: Pick<MaterialItem, 'name' | 'code'>) => {
  const nameKey = normalizeKey(candidate.name || '');
  const codeKey = candidate.code ? normalizeKey(candidate.code) : '';

  return (
    catalog.find((c) => (candidate.code ? normalizeKey(c.code || '') === codeKey : false)) ||
    catalog.find((c) => normalizeKey(c.name || '') === nameKey)
  );
};

export const generateNextCatalogCode = (catalog: MaterialItem[], kind: 'product' | 'service') => {
  const prefix = kind === 'service' ? 'SRV' : 'PRD';
  const re = new RegExp(`^${prefix}-(\\d{6})$`, 'i');
  const max = catalog.reduce((acc, item) => {
    const code = (item.code || '').toUpperCase();
    const m = re.exec(code);
    if (!m) return acc;
    const n = Number(m[1]);
    return Number.isFinite(n) ? Math.max(acc, n) : acc;
  }, 0);

  return `${prefix}-${String(max + 1).padStart(6, '0')}`;
};

export const toCatalogItemFromMaterial = (m: MaterialItem): MaterialItem => {
  const unitPrice = Number(m.unitPrice || 0);
  const cost = m.cost !== undefined ? Number(m.cost) : undefined;
  const margin = m.margin !== undefined ? Number(m.margin) : cost !== undefined && unitPrice > 0 ? ((unitPrice - cost) / unitPrice) * 100 : undefined;

  return {
    id: m.id,
    catalogItemId: undefined,
    kind: m.kind || 'product',
    status: m.status || 'active',
    code: m.code,
    category: m.category || m.brand || 'Geral',
    unit: m.unit || 'un',
    description: m.description,
    cost,
    margin,
    name: m.name,
    brand: m.brand || m.category || 'Geral',
    quantity: 1,
    unitPrice,
    totalPrice: unitPrice,
  };
};

export const toCatalogItemFromService = (s: ServiceItem, options?: { defaultCategory?: string }): MaterialItem => {
  const unitPrice = Number(s.price || 0);
  const cost = s.cost !== undefined ? Number(s.cost) : undefined;
  const margin = s.margin !== undefined ? Number(s.margin) : cost !== undefined && unitPrice > 0 ? ((unitPrice - cost) / unitPrice) * 100 : undefined;

  return {
    id: s.catalogItemId || crypto.randomUUID(),
    catalogItemId: s.catalogItemId,
    kind: 'service',
    status: 'active',
    code: s.code,
    category: s.category || options?.defaultCategory || 'Serviços',
    unit: s.unit || 'serv',
    description: s.description,
    cost,
    margin,
    name: s.name,
    brand: s.category || options?.defaultCategory || 'Serviços',
    quantity: 1,
    unitPrice,
    totalPrice: unitPrice,
  };
};

export const mergeCatalogItems = (catalog: MaterialItem[], additions: MaterialItem[]) => {
  const nextCatalog = [...catalog];
  const idMap = new Map<string, string>();
  const codeMap = new Map<string, string>();

  for (const raw of additions) {
    const item = toCatalogItemFromMaterial(raw);
    const code = item.code || generateNextCatalogCode(nextCatalog, item.kind || 'product');
    const candidate = { ...item, code };
    const dup = findCatalogDuplicate(nextCatalog, { name: candidate.name, code: candidate.code });

    if (dup) {
      idMap.set(raw.id, dup.id);
      if (dup.code) codeMap.set(raw.id, dup.code);
      continue;
    }

    nextCatalog.push({ ...candidate, status: 'active' });
    idMap.set(raw.id, candidate.id);
    codeMap.set(raw.id, candidate.code || code);
  }

  return { catalog: nextCatalog, idMap, codeMap };
};
