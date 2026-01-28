// hooks/useDeals.ts
import { useState, useEffect, useCallback } from 'react';
import {
  type Deal,
  getDeals,
  addDeal as addDealToStorage,
  updateDeal as updateDealInStorage,
  deleteDeal as deleteDealFromStorage,
  moveDeal as moveDealInStorage,
  initializeStorage
} from '@/lib/storage';

export function useDeals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar deals al montar
  useEffect(() => {
    initializeStorage();
    loadDeals();
  }, []);

  const loadDeals = useCallback(() => {
    setLoading(true);
    // Simular delay de red para UX realista
    setTimeout(() => {
      const data = getDeals();
      setDeals(data);
      setLoading(false);
    }, 300);
  }, []);

  const addDeal = useCallback((deal: Omit<Deal, 'id' | 'createdAt'>) => {
    const newDeal = addDealToStorage(deal);
    setDeals(prev => [...prev, newDeal]);
    return newDeal;
  }, []);

  const updateDeal = useCallback((id: string, updates: Partial<Deal>) => {
    const updated = updateDealInStorage(id, updates);
    if (updated) {
      setDeals(prev => 
        prev.map(d => d.id === id ? updated : d)
      );
    }
    return updated;
  }, []);

  const deleteDeal = useCallback((id: string) => {
    const success = deleteDealFromStorage(id);
    if (success) {
      setDeals(prev => prev.filter(d => d.id !== id));
    }
    return success;
  }, []);

  const moveDeal = useCallback((id: string, newStage: Deal['stage']) => {
    const updated = moveDealInStorage(id, newStage);
    if (updated) {
      setDeals(prev => 
        prev.map(d => d.id === id ? updated : d)
      );
    }
    return updated;
  }, []);

  const getDealsByStage = useCallback((stage: Deal['stage']) => {
    return deals.filter(d => d.stage === stage);
  }, [deals]);

  return {
    deals,
    loading,
    addDeal,
    updateDeal,
    deleteDeal,
    moveDeal,
    getDealsByStage,
    refreshDeals: loadDeals
  };
}
