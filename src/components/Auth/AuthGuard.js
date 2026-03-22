import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const publicRoutes = ['/login'];

export function AuthGuard({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const { pathname, push } = router;

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated && !publicRoutes.includes(pathname)) {
        push('/login');
      } else if (isAuthenticated && publicRoutes.includes(pathname)) {
        push('/home');
      }
    }
  }, [isAuthenticated, loading, pathname, push]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <FontAwesomeIcon 
          icon={faSpinner} 
          spin 
          style={{ fontSize: '40px' }} 
        />
        <div style={{ fontSize: '18px', fontWeight: '500' }}>
          Cargando aplicación...
        </div>
      </div>
    );
  }

  return children;
}