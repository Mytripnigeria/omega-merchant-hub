import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  authService,
  type AdminLoginPayload,
  type AdminRegisterPayload,
  type AdminUser,
} from "@/services/api/auth";
import { tokenStorage } from "@/lib/api-client";

interface AuthContextValue {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: AdminLoginPayload) => Promise<void>;
  register: (payload: AdminRegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const hasToken = !!tokenStorage.getToken();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(hasToken);

  const refresh = useCallback(async () => {
    if (!tokenStorage.getToken()) {
      setAdmin(null);
      setIsLoading(false);
      return;
    }
    try {
      const me = await authService.me();
      setAdmin(me);
    } catch {
      // Token invalid / expired — clear and bail.
      tokenStorage.clear();
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(async (payload: AdminLoginPayload) => {
    const result = await authService.login(payload);
    setAdmin(result.admin);
  }, []);

  const register = useCallback(async (payload: AdminRegisterPayload) => {
    const result = await authService.register(payload);
    setAdmin(result.admin);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        isLoading,
        login,
        register,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
