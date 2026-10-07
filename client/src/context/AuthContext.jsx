import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    try {
      const { data } = await authService.getMe();
      setUser(data.data.user);
      setProfile(data.data.profile);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = async (credentials) => {
    const { data } = await authService.login(credentials);
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    setUser(data.data.user);
    await loadUser();
    return data.data.user;
  };

  const register = async (formData) => {
    const { data } = await authService.register(formData);
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    setUser(data.data.user);
    await loadUser();
    return data.data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setProfile(null);
    authService.logout().catch(() => {});
  };

  const isStudent = user?.role === 'STUDENT';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout, loadUser, isStudent, isAdmin, setProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
