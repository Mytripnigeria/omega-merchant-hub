import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { Store } from '@/types';
import {
  apiRequest,
  tokenStorage,
  AUTH_CHANGED_EVENT,
  AUTH_CLEARED_EVENT,
} from '@/lib/api-client';

interface StoreContextType {
  stores: Store[];
  currentStore: Store | null;
  setCurrentStore: (store: Store) => void;
  isLoading: boolean;
  isAllStoresMode: boolean;
  setAllStoresMode: (value: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const SELECTED_STORE_KEY = 'omega_selected_store_id';

function readPersistedStoreId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(SELECTED_STORE_KEY);
  } catch {
    return null;
  }
}

function writePersistedStoreId(id: string | null) {
  if (typeof window === 'undefined') return;
  try {
    if (id) window.localStorage.setItem(SELECTED_STORE_KEY, id);
    else window.localStorage.removeItem(SELECTED_STORE_KEY);
  } catch {
    // ignore quota / disabled storage
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [stores, setStores] = useState<Store[]>([]);
  const [currentStore, setCurrentStoreState] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAllStoresMode, setAllStoresMode] = useState(false);

  // Persist the current selection so the next page-load doesn't snap back to
  // the first store. Wraps the setter so every call-site benefits.
  const setCurrentStore = useCallback((store: Store) => {
    setCurrentStoreState(store);
    writePersistedStoreId(store.id);
  }, []);

  const fetchStores = useCallback(async () => {
    if (!tokenStorage.getToken()) {
      // Logged-out — nothing to fetch. Clear any stale selection so we
      // don't render bad data behind a route guard race.
      setStores([]);
      setCurrentStoreState(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await apiRequest<{ data: Store[] } | Store[]>(
        '/stores?limit=100',
      );
      const list = Array.isArray(res)
        ? res
        : (res as { data: Store[] }).data ?? [];
      setStores(list);

      if (list.length === 0) {
        setCurrentStoreState(null);
        writePersistedStoreId(null);
        return;
      }

      // Prefer the previously-selected store from localStorage; fall back to
      // the first store if the persisted id no longer exists (deleted, or
      // the admin switched businesses).
      const persistedId = readPersistedStoreId();
      const persisted = persistedId
        ? list.find((s) => s.id === persistedId) ?? null
        : null;
      const selected = persisted ?? list[0];
      setCurrentStoreState(selected);
      writePersistedStoreId(selected.id);
    } catch {
      // Most likely a 401 because we mounted before login. The auth-changed
      // event below will re-trigger this once a token arrives.
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch on mount.
  useEffect(() => {
    void fetchStores();
  }, [fetchStores]);

  // React to auth changes (login fires AUTH_CHANGED_EVENT, logout fires
  // AUTH_CLEARED_EVENT) so the store list reflects reality without a refresh.
  useEffect(() => {
    const onAuthChanged = () => {
      void fetchStores();
    };
    const onAuthCleared = () => {
      setStores([]);
      setCurrentStoreState(null);
      writePersistedStoreId(null);
      setIsLoading(false);
    };
    window.addEventListener(AUTH_CHANGED_EVENT, onAuthChanged);
    window.addEventListener(AUTH_CLEARED_EVENT, onAuthCleared);
    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, onAuthChanged);
      window.removeEventListener(AUTH_CLEARED_EVENT, onAuthCleared);
    };
  }, [fetchStores]);

  return (
    <StoreContext.Provider
      value={{
        stores,
        currentStore,
        setCurrentStore,
        isLoading,
        isAllStoresMode,
        setAllStoresMode,
      }}
    >
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
