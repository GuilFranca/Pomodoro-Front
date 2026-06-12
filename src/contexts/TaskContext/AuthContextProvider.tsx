import { useCallback, useMemo, useState } from 'react';
import { AuthContext } from './AuthContext';
import { authApi, type AuthUser } from '../../services/api';

const TOKEN_KEY = 'chronos-token';
const USER_KEY = 'chronos-user';

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem(TOKEN_KEY),
  );
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  });

  const isAuthenticated = Boolean(token);

  const persist = (t: string, u: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, t);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setToken(t);
    setUser(u);
  };

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    persist(res.token, res.user);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await authApi.register({ name, email, password });
    persist(res.token, res.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('state');
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, user, login, register, logout }),
    [isAuthenticated, user, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
