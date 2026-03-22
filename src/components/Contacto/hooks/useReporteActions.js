import { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useReporteContext } from '../../../contexts/ReporteContext';

export function useReporteActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { agregarReporte, actualizarReporte: actualizarEnContexto } = useReporteContext();

  const API_URL = 'http://localhost:5000/api';

  const crearReporte = async (reporteData) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No autenticado. Por favor, inicia sesión nuevamente.');
      }

      console.log('🔄 Enviando reporte al backend...', reporteData);

      const response = await fetch(`${API_URL}/reportes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reporteData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status} al crear reporte`);
      }

      const data = await response.json();
      
      console.log('✅ Reporte creado en backend:', data.data);
      
      // Agregar al contexto global también para actualización inmediata
      if (data.data) {
        agregarReporte(data.data);
      }
      
      return data;
      
    } catch (err) {
      console.error('❌ Error creando reporte:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const actualizarReporte = async (id, updateData) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No autenticado');
      }

      console.log('🔄 Actualizando reporte en backend:', id, updateData);

      const response = await fetch(`${API_URL}/reportes/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar reporte');
      }

      const data = await response.json();
      
      console.log('✅ Reporte actualizado en backend');
      
      // Actualizar en contexto global también
      if (data.data) {
        actualizarEnContexto(id, updateData);
      }
      
      return data;
      
    } catch (err) {
      console.error('❌ Error actualizando reporte:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    crearReporte,
    actualizarReporte,
    loading,
    error
  };
}