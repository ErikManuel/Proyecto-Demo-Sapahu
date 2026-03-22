import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faExclamationTriangle, 
  faEnvelope, 
  faLock, 
  faSpinner,
  faSignInAlt
} from '@fortawesome/free-solid-svg-icons';

export function LoginForm() {
  const demoUsers = [
    {
      label: 'Entrar como Admin',
      email: 'admin@sapahu.demo',
      password: 'Admin123!'
    },
    {
      label: 'Entrar como Cobrador',
      email: 'cobrador@sapahu.demo',
      password: 'Cobrador123!'
    },
    {
      label: 'Entrar como Consultor',
      email: 'consultor@sapahu.demo',
      password: 'Consultor123!'
    }
  ];

  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  // Limpiar error cuando cambien los campos
  useEffect(() => {
    if (error) {
      setError('');
    }
  }, [credentials.email, credentials.password]);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/home');
    }
  }, [isAuthenticated]);

  const executeLogin = async (loginCredentials) => {
    setError('');
    setIsLoading(true);

    // Validaciones básicas
    if (!loginCredentials.email || !loginCredentials.password) {
      setError('Por favor completa todos los campos');
      setIsLoading(false);
      return;
    }

    if (!loginCredentials.email.includes('@')) {
      setError('Por favor ingresa un email válido');
      setIsLoading(false);
      return;
    }

    try {
      await login(loginCredentials);
      // La redirección se maneja en el useEffect de isAuthenticated
    } catch (error) {
      setError(error.message || 'Error al iniciar sesión. Por favor intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await executeLogin(credentials);
  };

  const handleQuickAccess = (email, password) => {
    const selectedCredentials = { email, password };
    setCredentials(selectedCredentials);
    if (!isLoading) {
      executeLogin(selectedCredentials);
    }
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} style={{
      background: 'white',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
      width: '100%',
      maxWidth: '400px',
      position: 'relative'
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        marginBottom: '2rem', 
        color: '#333',
        fontSize: '1.5rem',
        fontWeight: '600'
      }}>
        <FontAwesomeIcon icon={faSignInAlt} style={{ marginRight: '10px', color: '#667eea' }} />
        Iniciar Sesión - SAPAHU
      </h2>

      <div style={{
        marginBottom: '1.5rem',
        padding: '0.9rem',
        background: '#edf2f7',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{
          fontSize: '0.85rem',
          color: '#4a5568',
          marginBottom: '0.6rem',
          fontWeight: '600'
        }}>
          Acceso rapido demo:
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '0.45rem'
        }}>
          {demoUsers.map((demoUser) => (
            <button
              key={demoUser.email}
              type="button"
              disabled={isLoading}
              onClick={() => handleQuickAccess(demoUser.email, demoUser.password)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: '1px solid #cbd5e0',
                borderRadius: '6px',
                background: isLoading ? '#f7fafc' : 'white',
                color: '#2d3748',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                textAlign: 'left'
              }}
            >
              {demoUser.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Mensaje de Error */}
      {error && (
        <div style={{
          background: '#fed7d7',
          color: '#c53030',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          border: '1px solid #feb2b2',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <span>{error}</span>
        </div>
      )}
      
      {/* Campo Email */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '0.5rem', 
          fontWeight: '600',
          color: '#4a5568',
          fontSize: '14px'
        }}>
          <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '8px', width: '14px' }} />
          Email:
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type="email"
            value={credentials.email}
            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            required
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px 16px 12px 40px',
              border: error ? '2px solid #e53e3e' : '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '16px',
              transition: 'all 0.2s ease',
              backgroundColor: isLoading ? '#f7fafc' : 'white'
            }}
            placeholder="tu@email.com"
          />
          <FontAwesomeIcon 
            icon={faEnvelope} 
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#a0aec0',
              fontSize: '14px'
            }} 
          />
        </div>
      </div>
      
      {/* Campo Contraseña */}
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '0.5rem', 
          fontWeight: '600',
          color: '#4a5568',
          fontSize: '14px'
        }}>
          <FontAwesomeIcon icon={faLock} style={{ marginRight: '8px', width: '14px' }} />
          Contraseña:
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            required
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px 16px 12px 40px',
              border: error ? '2px solid #e53e3e' : '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '16px',
              transition: 'all 0.2s ease',
              backgroundColor: isLoading ? '#f7fafc' : 'white'
            }}
            placeholder="••••••••"
          />
          <FontAwesomeIcon 
            icon={faLock} 
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#a0aec0',
              fontSize: '14px'
            }} 
          />
        </div>
      </div>
      
      {/* Botón de Login */}
      <button 
        type="submit" 
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '14px 16px',
          background: isLoading ? '#a0aec0' : '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          position: 'relative'
        }}
      >
        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <FontAwesomeIcon 
              icon={faSpinner} 
              spin 
              style={{ fontSize: '16px' }} 
            />
            Iniciando sesión...
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <FontAwesomeIcon icon={faSignInAlt} />
            Ingresar al Sistema
          </div>
        )}
      </button>

      {/* Demo Info */}
      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem',
        background: '#f7fafc', 
        borderRadius: '8px',
        fontSize: '0.875rem',
        color: '#718096',
        textAlign: 'center',
        border: '1px solid #e2e8f0'
      }}>
        <strong>Acceso Demo para Reclutadores:</strong><br/>
        Admin: admin@sapahu.demo / Admin123!<br/>
        Cobrador: cobrador@sapahu.demo / Cobrador123!<br/>
        Consultor: consultor@sapahu.demo / Consultor123!
      </div>
    </form>
  );
}