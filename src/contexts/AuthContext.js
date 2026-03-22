import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { initializeDemoApi } from '@/mocks/demoApi';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // API base URL
  const API_URL = 'http://localhost:5000/api';

  // Verificar autenticación al iniciar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      initializeDemoApi();
      const token = localStorage.getItem('authToken');
      const storedUserRaw = localStorage.getItem('userData');
      const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;

      if (token) {
        // Verificar token con backend
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          if (storedUser) {
            // Fallback para evitar logout falso si falla verificación remota
            setUser(storedUser);
          } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
          }
        }
      }
    } catch (error) {
      const storedUserRaw = localStorage.getItem('userData');
      const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;

      if (storedUser) {
        setUser(storedUser);
      } else {
        console.error('Error checking auth:', error);
        setError('Error al verificar la sesión');
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      initializeDemoApi();
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en el login');
      }

      if (data.success) {
        // Guardar token y datos del usuario
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
      } else {
        throw new Error(data.message || 'Error en el login');
      }
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setError(null);
    router.push('/login');
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      loading,
      error,
      clearError,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};