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

const INITIAL_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '+1 (555) 123-4567',
    company: 'Acme Corp',
    status: 'active',
    value: 125000,
    createdAt: '2024-01-15',
    lastContact: '2024-01-16',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Acme'
  },
  {
    id: '2',
    name: 'TechStart Inc',
    email: 'hello@techstart.io',
    phone: '+1 (555) 234-5678',
    company: 'TechStart',
    status: 'active',
    value: 85000,
    createdAt: '2024-01-10',
    lastContact: '2024-01-17',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TechStart'
  },
  {
    id: '3',
    name: 'Global Solutions',
    email: 'info@globalsolutions.com',
    phone: '+1 (555) 345-6789',
    company: 'Global Solutions Ltd',
    status: 'prospect',
    value: 250000,
    createdAt: '2024-01-18',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Global'
  },
  {
    id: '4',
    name: 'Innovation Labs',
    email: 'contact@innovationlabs.com',
    phone: '+1 (555) 456-7890',
    company: 'Innovation Labs',
    status: 'active',
    value: 175000,
    createdAt: '2024-01-05',
    lastContact: '2024-01-16',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Innovation'
  }
];

const INITIAL_DEALS: Deal[] = [
  {
    id: '1',
    title: 'Migración Cloud Platform',
    client: 'Acme SA',
    value: 45000,
    stage: 'lead',
    probability: 75,
    expectedCloseDate: '2025-02-14',
    createdAt: '2024-01-10',
    owner: 'Mike Johnson'
  },
  {
    id: '2',
    title: 'Consultoría DevOps',
    client: 'Initech',
    value: 12000,
    stage: 'lead',
    probability: 20,
    expectedCloseDate: '2025-03-09',
    createdAt: '2024-01-12',
    owner: 'Ana Silva'
  },
  {
    id: '3',
    title: 'Sistema CRM Enterprise',
    client: 'Globex Corp',
    value: 89000,
    stage: 'qualified',
    probability: 60,
    expectedCloseDate: '2025-01-29',
    createdAt: '2024-01-18',
    owner: 'John Davis'
  },
  {
    id: '4',
    title: 'Auditoría de Seguridad',
    client: 'Wayne Enterprises',
    value: 34000,
    stage: 'qualified',
    probability: 50,
    expectedCloseDate: '2025-02-04',
    createdAt: '2024-01-05',
    owner: 'Ana Silva'
  },
  {
    id: '5',
    title: 'Desarrollo Web App',
    client: 'Umbrella Co',
    value: 67000,
    stage: 'proposal',
    probability: 40,
    expectedCloseDate: '2025-02-27',
    createdAt: '2024-01-08',
    owner: 'Mike Johnson'
  },
  {
    id: '6',
    title: 'Integración API B2B',
    client: 'Stark Industries',
    value: 125000,
    stage: 'closed',
    probability: 100,
    expectedCloseDate: '2025-01-19',
    createdAt: '2024-01-19',
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