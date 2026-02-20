
export enum QuoteStatus {
  DRAFT = 'DRAFT', // Rascunho
  SENT = 'SENT', // Enviado / Pendente
  APPROVED = 'APPROVED', // Aprovado
  REJECTED = 'REJECTED', // Rejeitado / Cancelado
  COMPLETED = 'COMPLETED' // Concluído
}

export const QuoteStatusLabels: Record<QuoteStatus, string> = {
  [QuoteStatus.DRAFT]: 'Rascunho',
  [QuoteStatus.SENT]: 'Pendente',
  [QuoteStatus.APPROVED]: 'Aprovado',
  [QuoteStatus.REJECTED]: 'Cancelado',
  [QuoteStatus.COMPLETED]: 'Concluído'
};

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface MaterialItem {
  id: string;
  name: string;
  brand: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Client {
  id: string;
  name: string;
  address: string;
  phone: string;
  avatar: string;
  document: string;
  email?: string;
  createdAt?: string;
}

export interface ContractTemplate {
  id: string;
  name: string;
  icon: string;
  content: string;
}

export interface CompanyInfo {
  name: string;
  logo?: string;
  avatar?: string; // Legacy/Alternative
  email?: string;
  phone?: string;
  address?: string;
  document?: string;
  techSignature?: string;
  pixKey?: string;
  bankInfo?: string;
  companyName?: string;
  subscriptionStatus?: 'trial' | 'active' | 'expired';
  trialEndsAt?: string;
  subscriptionEndsAt?: string;
  subscriptionPlan?: 'mensal' | 'semestral' | 'anual';
  subscriptionActivatedAt?: string;
}

export interface UserProfile extends CompanyInfo {
  id: string;
  materialCatalog?: MaterialItem[];
  contractTemplates?: ContractTemplate[];
}

export interface Quote {
  id: string;
  number: string;
  contractNumber?: string;
  client: Client;
  services: ServiceItem[];
  materials: MaterialItem[];
  warrantyDuration: number;
  paymentTerms: string;
  status: QuoteStatus;
  date: string;
  validUntil: string;
  contractTerms?: string;
  completionDate?: string;
  warrantyUntil?: string;
  signatureData?: string;
  viewedAt?: string;
  publicToken?: string;
  accessPassword?: string;
  viewed?: boolean;
  companyInfo?: CompanyInfo;
}
