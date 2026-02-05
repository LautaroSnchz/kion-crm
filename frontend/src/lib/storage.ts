// lib/storage.ts
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive' | 'prospect';
  value: number;
  createdAt: string;
  lastContact?: string;
  avatar?: string;
}

export interface Deal {
  id: string;
  title: string;
  client: string;
  value: number;
  stage: 'lead' | 'qualified' | 'proposal' | 'closed';
  probability: number;
  expectedCloseDate: string;
  createdAt: string;
  owner: string;
  notes?: string;
}

const STORAGE_KEYS = {
  CLIENTS: 'kioncrm_clients',
  DEALS: 'kioncrm_deals',
  INITIALIZED: 'kioncrm_initialized'
};

// 9 CLIENTES - Mix de estados para realismo
const INITIAL_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Acme SA',
    email: 'contact@acmesa.com',
    phone: '+54 11 4567-8900',
    company: 'Acme Corporation',
    status: 'active',
    value: 45000,
    createdAt: '2026-01-15',
    lastContact: '2026-01-16',
  },
  {
    id: '2',
    name: 'Initech',
    email: 'info@initech.com',
    phone: '+54 11 4567-8901',
    company: 'Initech Solutions',
    status: 'active',
    value: 12000,
    createdAt: '2026-01-10',
    lastContact: '2026-01-17',
  },
  {
    id: '3',
    name: 'Globex Corp',
    email: 'sales@globex.com',
    phone: '+54 11 4567-8902',
    company: 'Globex Industries',
    status: 'active',
    value: 89000,
    createdAt: '2026-01-18',
    lastContact: '2026-01-18',
  },
  {
    id: '4',
    name: 'Wayne Enterprises',
    email: 'bruce@wayne.com',
    phone: '+54 11 4567-8903',
    company: 'Wayne Corp',
    status: 'active',
    value: 34000,
    createdAt: '2026-01-05',
    lastContact: '2026-01-16',
  },
  {
    id: '5',
    name: 'Umbrella Co',
    email: 'contact@umbrella.com',
    phone: '+54 11 4567-8904',
    company: 'Umbrella Corporation',
    status: 'active',
    value: 67000,
    createdAt: '2026-01-08',
    lastContact: '2026-01-15',
  },
  {
    id: '6',
    name: 'Stark Industries',
    email: 'tony@stark.com',
    phone: '+54 11 4567-8905',
    company: 'Stark Industries Inc',
    status: 'active',
    value: 125000,
    createdAt: '2026-01-19',
    lastContact: 'Hoy',
  },
  {
    id: '7',
    name: 'Cyberdyne Systems',
    email: 'info@cyberdyne.com',
    phone: '+54 11 4567-8906',
    company: 'Cyberdyne Corp',
    status: 'prospect',
    value: 0,
    createdAt: '2026-01-20',
    lastContact: 'Hace 3 días',
  },
  {
    id: '8',
    name: 'Tyrell Corporation',
    email: 'contact@tyrell.com',
    phone: '+54 11 4567-8907',
    company: 'Tyrell Inc',
    status: 'prospect',
    value: 0,
    createdAt: '2026-01-22',
    lastContact: 'Hace 1 semana',
  },
  {
    id: '9',
    name: 'Weyland-Yutani',
    email: 'sales@weyland.com',
    phone: '+54 11 4567-8908',
    company: 'Weyland-Yutani Corp',
    status: 'inactive',
    value: 0,
    createdAt: '2025-11-15',
    lastContact: 'Hace 2 meses',
  }
];

// 6 DEALS - Ahora coinciden con los clientes de arriba
const INITIAL_DEALS: Deal[] = [
  {
    id: '1',
    title: 'Migración Cloud Platform',
    client: 'Acme SA',
    value: 45000,
    stage: 'lead',
    probability: 75,
    expectedCloseDate: '2026-04-22',
    createdAt: '2026-01-10',
    owner: 'Mike Johnson'
  },
  {
    id: '2',
    title: 'Consultoría DevOps',
    client: 'Initech',
    value: 12000,
    stage: 'lead',
    probability: 20,
    expectedCloseDate: '2026-04-10',
    createdAt: '2026-01-12',
    owner: 'Orion Castillo'
  },
  {
    id: '3',
    title: 'Sistema CRM Enterprise',
    client: 'Globex Corp',
    value: 89000,
    stage: 'qualified',
    probability: 60,
    expectedCloseDate: '2026-05-15',
    createdAt: '2026-01-18',
    owner: 'John Davis'
  },
  {
    id: '4',
    title: 'Auditoría de Seguridad',
    client: 'Wayne Enterprises',
    value: 34000,
    stage: 'qualified',
    probability: 50,
    expectedCloseDate: '2026-05-30',
    createdAt: '2026-01-05',
    owner: 'Orion Castillo'
  },
  {
    id: '5',
    title: 'Desarrollo Web App',
    client: 'Umbrella Co',
    value: 67000,
    stage: 'proposal',
    probability: 40,
    expectedCloseDate: '2026-06-12',
    createdAt: '2026-01-08',
    owner: 'Mike Johnson'
  },
  {
    id: '6',
    title: 'Integración API B2B',
    client: 'Stark Industries',
    value: 125000,
    stage: 'closed',
    probability: 100,
    expectedCloseDate: '2026-01-19',
    createdAt: '2026-01-19',
    owner: 'John Davis'
  }
];

export function initializeStorage(): void {
  const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  if (!isInitialized) {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
    localStorage.setItem(STORAGE_KEYS.DEALS, JSON.stringify(INITIAL_DEALS));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }
}

export function getClients(): Client[] {
  const data = localStorage.getItem(STORAGE_KEYS.CLIENTS);
  return data ? JSON.parse(data) : [];
}

export function getClientById(id: string): Client | undefined {
  return getClients().find(c => c.id === id);
}

export function addClient(client: Omit<Client, 'id' | 'createdAt'>): Client {
  const clients = getClients();
  const newClient: Client = {
    ...client,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split('T')[0]
  };
  clients.push(newClient);
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  return newClient;
}

export function updateClient(id: string, updates: Partial<Client>): Client | null {
  const clients = getClients();
  const index = clients.findIndex(c => c.id === id);
  if (index === -1) return null;
  clients[index] = { ...clients[index], ...updates };
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  return clients[index];
}

export function deleteClient(id: string): boolean {
  const clients = getClients();
  const filtered = clients.filter(c => c.id !== id);
  if (filtered.length === clients.length) return false;
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(filtered));
  return true;
}

export function getDeals(): Deal[] {
  const data = localStorage.getItem(STORAGE_KEYS.DEALS);
  return data ? JSON.parse(data) : [];
}

export function getDealById(id: string): Deal | undefined {
  return getDeals().find(d => d.id === id);
}

export function addDeal(deal: Omit<Deal, 'id' | 'createdAt'>): Deal {
  const deals = getDeals();
  const newDeal: Deal = {
    ...deal,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split('T')[0]
  };
  deals.push(newDeal);
  localStorage.setItem(STORAGE_KEYS.DEALS, JSON.stringify(deals));
  return newDeal;
}

export function updateDeal(id: string, updates: Partial<Deal>): Deal | null {
  const deals = getDeals();
  const index = deals.findIndex(d => d.id === id);
  if (index === -1) return null;
  deals[index] = { ...deals[index], ...updates };
  localStorage.setItem(STORAGE_KEYS.DEALS, JSON.stringify(deals));
  return deals[index];
}

export function deleteDeal(id: string): boolean {
  const deals = getDeals();
  const filtered = deals.filter(d => d.id !== id);
  if (filtered.length === deals.length) return false;
  localStorage.setItem(STORAGE_KEYS.DEALS, JSON.stringify(filtered));
  return true;
}

export function moveDeal(id: string, newStage: Deal['stage']): Deal | null {
  return updateDeal(id, { stage: newStage });
}

export function getDashboardStats() {
  const clients = getClients();
  const deals = getDeals();
  
  const totalRevenue = deals
    .filter(d => d.stage === 'closed')
    .reduce((sum, d) => sum + d.value, 0);
  
  const activeDeals = deals.filter(d => 
    d.stage !== 'closed'
  ).length;
  
  const activeClients = clients.filter(c => c.status === 'active').length;
  
  const totalDeals = deals.length;
  
  const winRate = totalDeals > 0 
    ? Math.round((deals.filter(d => d.stage === 'closed').length / totalDeals) * 100)
    : 0;
  
  return {
    totalRevenue,
    activeDeals,
    activeClients,
    winRate
  };
}

export function resetToInitialData(): void {
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
  localStorage.setItem(STORAGE_KEYS.DEALS, JSON.stringify(INITIAL_DEALS));
}

if (typeof window !== 'undefined') {
  (window as any).__resetCRM = () => {
    resetToInitialData();
    window.location.reload();
    console.log('✅ CRM reset');
  };
}
