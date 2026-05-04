import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Store } from '@/types';
import { apiRequest } from '@/lib/api-client';

interface StoreContextType {
  stores: Store[];
  currentStore: Store | null;
  setCurrentStore: (store: Store) => void;
  isLoading: boolean;
  isAllStoresMode: boolean;
  setAllStoresMode: (value: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [stores, setStores] = useState<Store[]>([]);
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAllStoresMode, setAllStoresMode] = useState(false);

  useEffect(() => {
    apiRequest<{ data: Store[] }>('/stores?limit=100')
      .then((res) => {
        const list = Array.isArray(res) ? res : (res as { data: Store[] }).data ?? [];
        setStores(list);
        if (list.length > 0) setCurrentStore(list[0]);
      })
      .catch(() => {
        // keep empty if not authenticated yet
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <StoreContext.Provider value={{ 
      stores, 
      currentStore, 
      setCurrentStore, 
      isLoading,
      isAllStoresMode,
      setAllStoresMode,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
