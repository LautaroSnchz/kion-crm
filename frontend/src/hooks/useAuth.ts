import { useState, useEffect, useMemo, useCallback } from "react";
import { 
  getAuth, 
  setAuth, 
  logout as logoutFn, 
  login as loginFn,
  loginAsDemo as loginAsDemoFn,
  type User 
} from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario al montar
  useEffect(() => {
    let isMounted = true;
    
    const currentUser = getAuth();
    
    if (isMounted) {
      setUser(currentUser);
      setLoading(false);
    }
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Login memoizado
  const login = useCallback((email: string, password: string) => {
    const authenticatedUser = loginFn(email, password);
    
    if (authenticatedUser) {
      setAuth(authenticatedUser);
      setUser(authenticatedUser);
      return true;
    }
    
    return false;
  }, []);

  // Login demo memoizado
  const loginAsDemo = useCallback(() => {
    const demoUser = loginAsDemoFn();
    setAuth(demoUser);
    setUser(demoUser);
  }, []);

  // Logout memoizado
  const logout = useCallback(() => {
    logoutFn();
    setUser(null);
  }, []);

  // Estados derivados memoizados
  const isAuthenticated = useMemo(() => user !== null, [user]);
  const isAdmin = useMemo(() => user?.role === "admin", [user]);
  const isDemo = useMemo(() => user?.role === "demo", [user]);

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    isDemo,
    login,
    loginAsDemo,
    logout,
  };
}
