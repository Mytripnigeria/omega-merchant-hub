import { createContext, useContext, useState, ReactNode } from 'react';
import { Store } from '@/types';

interface StoreContextType {
  stores: Store[];
  currentStore: Store | null;
  setCurrentStore: (store: Store) => void;
  isLoading: boolean;
}

const mockStores: Store[] = [
  {
    id: 'store-1',
    name: 'Lekki Phase 1',
    address: '15 Admiralty Way, Lekki Phase 1, Lagos',
    phone: '+234 812 345 6789',
    email: 'lekki@toasty.ng',
    isActive: true,
    createdAt: '2024-01-15',
  },
  {
    id: 'store-2',
    name: 'Victoria Island',
    address: '25 Adeola Odeku Street, VI, Lagos',
    phone: '+234 812 345 6790',
    email: 'vi@toasty.ng',
    isActive: true,
    createdAt: '2024-03-20',
  },
  {
    id: 'store-3',
    name: 'Ikeja City Mall',
    address: 'Shop 45, Ikeja City Mall, Lagos',
    phone: '+234 812 345 6791',
    email: 'ikeja@toasty.ng',
    isActive: true,
    createdAt: '2024-06-10',
  },
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [stores] = useState<Store[]>(mockStores);
  const [currentStore, setCurrentStore] = useState<Store>(mockStores[0]);
  const [isLoading] = useState(false);

  return (
    <StoreContext.Provider value={{ stores, currentStore, setCurrentStore, isLoading }}>
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
