import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function useDeudasData(periodo = 'mensual') {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeudas = async () => {
      try {
        setLoading(true);
        setError(null);
        //console.log(`🔍 Iniciando fetch a: ${API_BASE_URL}/deudas/dashboard?periodo=${periodo}`);
        const token = localStorage.getItem('authToken');
        //console.log('🔑 Token disponible:', !!token);
        const response = await fetch(
          `${API_BASE_URL}/deudas/dashboard?periodo=${periodo}`, 
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        //console.log('📡 Response status:', response.status);
        //console.log('📡 Response ok:', response.ok);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${response.statusText}. Body: ${errorText}`);
        }

        const result = await response.json();
        //console.log('✅ Response data completa:', result);

        if (result.success) {
          setDashboardData(result.data);
          //console.log(`📊 Datos completos del dashboard para ${periodo} guardados`);
        } else {
          throw new Error(result.message || 'Error en la respuesta del servidor');
        }

      } catch (err) {
       // console.error('💥 Error completo:', err);
        setError(err.message);
        
        // Fallback a datos mock completos
       // console.log('🔄 Usando datos mock como fallback');
        setDashboardData(getMockDashboardData(periodo));
      } finally {
        setLoading(false);
      }
    };

    fetchDeudas();
  }, [periodo]); // ✅ Se ejecuta cuando cambia el periodo

  return { dashboardData, loading, error };
}

// Mock data actualizado para soportar periodos
function getMockDashboardData(periodo) {


  // Generar historial según el periodo
  const ahora = new Date();
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  let historialDeuda = [];
  let cantidadMeses;

  switch(periodo) {
    case 'mensual':
      cantidadMeses = 6;
      break;
    case 'trimestral':
      cantidadMeses = 12;
      break;
    case 'anual':
      cantidadMeses = 24;
      break;
    default:
      cantidadMeses = 6;
  }

  // Meses anteriores (vacíos)
  for (let i = cantidadMeses - 1; i >= 1; i--) {
    const mesIndex = (ahora.getMonth() - i + 12) % 12;
    const año = ahora.getFullYear() - Math.floor((ahora.getMonth() - i) / 12);
    const etiqueta = periodo === 'anual' ? `${meses[mesIndex]} ${año}` : meses[mesIndex];
    
    historialDeuda.push({
      mes: etiqueta,
      deuda: 0,
      real: false
    });
  }

  // Mes actual (datos reales)
  const etiquetaActual = periodo === 'anual' 
    ? `${meses[ahora.getMonth()]} ${ahora.getFullYear()}`
    : meses[ahora.getMonth()];
    
  historialDeuda.push({
    mes: etiquetaActual,
    deuda: 2950.5,
    real: true
  });

  return {
    ...baseData,
    historialDeuda
  };
}