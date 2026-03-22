import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useReporteContext } from '../../../contexts/ReporteContext';

export function useReportes(filtros = {}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { reportes, setReportes } = useReporteContext();

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    // Solo cargar reportes si hay usuario autenticado
    if (!user) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchReportes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Construir query string con filtros
        const params = new URLSearchParams();
        if (filtros.estado) params.append('estado', filtros.estado);
        if (filtros.categoria) params.append('categoria', filtros.categoria);
        if (filtros.prioridad) params.append('prioridad', filtros.prioridad);

        const response = await fetch(`${API_URL}/reportes?${params.toString()}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
          setReportes(data.data || []);
        } else {
          throw new Error(data.message || 'Error en la respuesta del servidor');
        }
        
      } catch (err) {
        console.error('❌ Error fetching reportes:', err);
        setError(err.message);
        setReportes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReportes();
  }, [filtros.estado, filtros.categoria, filtros.prioridad, user, setReportes]);

  // ✅ CORREGIDO: Manejar objeto creadoPor.userId
  const reportesFiltrados = reportes.filter(reporte => {
    // Solo aplicamos el filtro de usuario para cobradores en el frontend
    if (user?.role === 'cobrador') {
      // Verificar si creadoPor.userId es un objeto o un string
      const userIdEnReporte = 
        typeof reporte.creadoPor.userId === 'object' 
          ? reporte.creadoPor.userId._id // Si es objeto, tomar el _id
          : reporte.creadoPor.userId;    // Si es string, usarlo directamente
      
      const esReporteDelUsuario = 
        userIdEnReporte === user._id || 
        userIdEnReporte?.toString() === user._id;
      
    }
    
    return true;
  });

 

  return { reportes: reportesFiltrados, loading, error };
}