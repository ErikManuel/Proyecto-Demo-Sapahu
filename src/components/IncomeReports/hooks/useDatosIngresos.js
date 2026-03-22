import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function useDatosIngresos(periodo = 'semanal', rangoPersonalizado = null) {
  const [datos, setDatos] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIngresos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let url = `${API_BASE_URL}/ingresos/${periodo}`;
        const params = new URLSearchParams();

        // Si es rango personalizado, usar endpoint diferente
        if (periodo === 'personalizado' && rangoPersonalizado) {
          url = `${API_BASE_URL}/ingresos/rango`;
          params.append('desde', rangoPersonalizado.desde);
          params.append('hasta', rangoPersonalizado.hasta);
        }

        const queryString = params.toString();
        const finalUrl = queryString ? `${url}?${queryString}` : url;

        console.log(`🔍 Iniciando fetch a: ${finalUrl}`);
        
        const token = getTokenFromStorage();
        console.log('🔑 Token disponible:', !!token);

        if (!token) {
          throw new Error('No hay token de autenticación disponible');
        }

        const response = await fetch(finalUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('📡 Response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${response.statusText}. Body: ${errorText}`);
        }

        const result = await response.json();
        console.log('✅ Response data completa:', result);

        if (result.success) {
          setDatos(result.data.datos);
          setLabels(result.data.labels);
          console.log(`📊 Datos de ingresos recibidos correctamente`);
        } else {
          throw new Error(result.message || 'Error en la respuesta del servidor');
        }

      } catch (err) {
        console.error('💥 Error completo:', err);
        setError(err.message);
        
        // Fallback a datos mock
        console.log('🔄 Usando datos mock como fallback');
        const mockData = getMockIngresosData(periodo);
        setDatos(mockData.datos);
        setLabels(mockData.labels);
        if (err.message.includes('404') && periodo === 'personalizado') {
            console.log('🔄 Endpoint de rango no disponible, usando datos mock personalizados');
            const mockData = getMockRangoPersonalizado(rangoPersonalizado);
            setDatos(mockData.datos);
            setLabels(mockData.labels);
          } else {
            // Fallback normal para otros errores
            console.log('🔄 Usando datos mock como fallback');
            const mockData = getMockIngresosData(periodo);
            setDatos(mockData.datos);
            setLabels(mockData.labels);
          }
      } 
      finally {
        setLoading(false);
      }
    };

    fetchIngresos();
  }, [periodo, rangoPersonalizado]); // ✅ Agregar rangoPersonalizado como dependencia

  return { datos, labels, loading, error };
}
// Agregar esta función para mock de rango personalizado
function getMockRangoPersonalizado(rango) {
  // Generar datos de ejemplo basados en el rango
  const dias = Math.ceil((new Date(rango.hasta) - new Date(rango.desde)) / (1000 * 60 * 60 * 24)) + 1;
  const datos = Array.from({ length: dias }, (_, i) => 
    Math.floor(Math.random() * 20000) + 5000
  );
  const labels = Array.from({ length: dias }, (_, i) => 
    `Día ${i + 1}`
  );
  
  return { datos, labels };
}
// Función para buscar token en todos los lugares posibles
function getTokenFromStorage() {
  // Buscar en localStorage
  const localStorageToken = localStorage.getItem('token');
  if (localStorageToken) {
    console.log('✅ Token encontrado en localStorage');
    return localStorageToken;
  }
  
  // Buscar en sessionStorage
  const sessionStorageToken = sessionStorage.getItem('token');
  if (sessionStorageToken) {
    console.log('✅ Token encontrado en sessionStorage');
    return sessionStorageToken;
  }
  
  // Buscar con diferentes nombres de clave
  const possibleKeys = ['authToken', 'userToken', 'jwtToken', 'accessToken'];
  for (const key of possibleKeys) {
    const token = localStorage.getItem(key) || sessionStorage.getItem(key);
    if (token) {
      console.log(`✅ Token encontrado con clave: ${key}`);
      return token;
    }
  }
  
  console.log('❌ No se encontró token en ningún almacenamiento');
  return null;
}

// Mock data para ingresos
function getMockIngresosData(periodo) {
  switch(periodo) {
    case 'semanal':
      return {
        datos: [12000, 15200, 9800, 13200, 18500, 22000, 14500],
        labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']
      };
    
    case 'mensual':
      return {
        datos: [450000, 520000, 480000, 510000, 490000, 550000, 530000, 510000, 570000, 590000, 560000, 620000],
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
      };
    
    case 'anual':
      return {
        datos: [5800000, 6200000, 5500000, 7100000, 6800000, 7500000],
        labels: ['2019', '2020', '2021', '2022', '2023', '2024']
      };
    
    default:
      return {
        datos: [12000, 15200, 9800, 13200, 18500, 22000, 14500],
        labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']
      };
  }
}