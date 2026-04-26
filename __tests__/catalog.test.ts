import { describe, it, expect } from 'vitest';
import { generateNextCatalogCode, mergeCatalogItems } from '../lib/catalog';
import type { MaterialItem } from '../types';

const makeCatalogItem = (overrides: Partial<MaterialItem> = {}): MaterialItem => ({
  id: 'id-1',
  name: 'Lampada',
  brand: 'Elétrica',
  quantity: 1,
  unitPrice: 10,
  totalPrice: 10,
  status: 'active',
  kind: 'product',
  code: 'PRD-000001',
  ...overrides,
});

describe('catalog helpers', () => {
  it('generates sequential product codes', () => {
    const catalog: MaterialItem[] = [makeCatalogItem({ code: 'PRD-000009' }), makeCatalogItem({ id: 'x', code: 'PRD-000010' })];
    expect(generateNextCatalogCode(catalog, 'product')).toBe('PRD-000011');
  });

  it('generates sequential service codes', () => {
    const catalog: MaterialItem[] = [makeCatalogItem({ code: 'SRV-000003', kind: 'service' })];
    expect(generateNextCatalogCode(catalog, 'service')).toBe('SRV-000004');
  });

  it('merges new items and avoids duplicates by name or code', () => {
    const existing: MaterialItem[] = [makeCatalogItem({ id: 'existing-1', name: 'Lampada', code: 'PRD-000001' })];
    const additions: MaterialItem[] = [makeCatalogItem({ id: 'new-1', name: 'Lampada', code: 'PRD-000999' })];

    const result = mergeCatalogItems(existing, additions);
    expect(result.catalog).toHaveLength(1);
    expect(result.idMap.get('new-1')).toBe('existing-1');
  });
});

