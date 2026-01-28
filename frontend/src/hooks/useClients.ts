// hooks/useClients.ts
import { useState, useEffect, useCallback } from 'react';
import {
  type Client,
  getClients,
  addClient as addClientToStorage,
  updateClient as updateClientInStorage,
  deleteClient as deleteClientFromStorage,
  initializeStorage
} from '@/lib/storage';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar clientes al montar
  useEffect(() => {
    initializeStorage();
    loadClients();
  }, []);

  const loadClients = useCallback(() => {
    setLoading(true);
    // Simular delay de red para UX realista
    setTimeout(() => {
      const data = getClients();
      setClients(data);
      setLoading(false);
    }, 300);
  }, []);

  const addClient = useCallback((client: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient = addClientToStorage(client);
    setClients(prev => [...prev, newClient]);
    return newClient;
  }, []);

  const updateClient = useCallback((id: string, updates: Partial<Client>) => {
    const updated = updateClientInStorage(id, updates);
    if (updated) {
      setClients(prev => 
        prev.map(c => c.id === id ? updated : c)
      );
    }
    return updated;
  }, []);

  const deleteClient = useCallback((id: string) => {
    const success = deleteClientFromStorage(id);
    if (success) {
      setClients(prev => prev.filter(c => c.id !== id));
    }
    return success;
  }, []);

  const getClientByName = useCallback((name: string) => {
    return clients.find(c => c.name === name);
  }, [clients]);

  return {
    clients,
    loading,
    addClient,
    updateClient,
    deleteClient,
    getClientByName,
    refreshClients: loadClients
  };
}
