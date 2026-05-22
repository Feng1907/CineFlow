import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY   = 'cineflow_token';
const REFRESH_KEY = 'cineflow_refresh';

const AuthContext = createContext(null);

// Axios instance dùng riêng cho auth — tránh circular interceptor
const authApi = axios.create({ baseURL: API });

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const refreshTimer = useRef(null);

  const getToken    = () => localStorage.getItem(TOKEN_KEY);
  const getRefresh  = () => localStorage.getItem(REFRESH_KEY);

  const saveTokens = (token, refreshToken) => {
    localStorage.setItem(TOKEN_KEY, token);
    if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
  };

  const clearTokens = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  };

  // Tự động refresh access token trước khi hết hạn (14 phút)
  const scheduleRefresh = useCallback(() => {
    clearTimeout(refreshTimer.current);
    refreshTimer.current = setTimeout(async () => {
      const rt = getRefresh();
      if (!rt) return;
      try {
        const res = await authApi.post('/auth/refresh', { refreshToken: rt });
        localStorage.setItem(TOKEN_KEY, res.data.token);
        scheduleRefresh(); // đặt lịch lần tiếp theo
      } catch {
        // Refresh token hết hạn → đăng xuất
        clearTokens();
        setUser(null);
      }
    }, 14 * 60 * 1000); // 14 phút (access token sống 15 phút)
  }, []);

  // Khôi phục session khi mount
  useEffect(() => {
    const token = getToken();
    if (!token) { setLoading(false); return; }

    authApi.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setUser(res.data.user);
        scheduleRefresh();
      })
      .catch(async () => {
        // Access token hết hạn → thử refresh ngay
        const rt = getRefresh();
        if (!rt) { clearTokens(); setLoading(false); return; }
        try {
          const res = await authApi.post('/auth/refresh', { refreshToken: rt });
          localStorage.setItem(TOKEN_KEY, res.data.token);
          const me = await authApi.get('/auth/me', {
            headers: { Authorization: `Bearer ${res.data.token}` },
          });
          setUser(me.data.user);
          scheduleRefresh();
        } catch {
          clearTokens();
        }
      })
      .finally(() => setLoading(false));

    return () => clearTimeout(refreshTimer.current);
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authApi.post('/auth/login', { email, password });
    saveTokens(res.data.token, res.data.refreshToken);
    setUser(res.data.user);
    scheduleRefresh();
    return res.data.user;
  }, [scheduleRefresh]);

  const register = useCallback(async (name, email, password) => {
    const res = await authApi.post('/auth/register', { name, email, password });
    saveTokens(res.data.token, res.data.refreshToken);
    setUser(res.data.user);
    scheduleRefresh();
    return res.data.user;
  }, [scheduleRefresh]);

  const logout = useCallback(async () => {
    clearTimeout(refreshTimer.current);
    const token = getToken();
    if (token) {
      authApi.post('/auth/logout', {}, {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    clearTokens();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
