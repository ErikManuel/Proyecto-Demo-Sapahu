// hooks/useTarifas.js
import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

export function useTarifas() {
  const [tarifas, setTarifas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  const fetchTarifas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch(`${API_BASE_URL}/export/tarifas`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Convertir el array de nombres de tarifas al formato que espera tu frontend
        const tarifasFormateadas = data.tarifas.map((nombre, index) => ({
          id: index + 1,
          nombre: nombre,
          activo: true
        }));
        
        setTarifas(tarifasFormateadas);
      } else {
        throw new Error(data.message || 'Error al cargar tarifas');
      }
    } catch (err) {
      setError(err.message || 'Error al cargar tipos de tarifa');
      console.error('Error fetching tarifas:', err);
      
      // Fallback con las tarifas reales del backend
      const tarifasFallback = [
        { id: 1, nombre: 'SERVICIO DOMESTICO PARTICULAR', activo: true },
        { id: 2, nombre: 'SERVICIO DOMESTICO RESIDENCIAL', activo: true },
        { id: 3, nombre: 'SERVICIO DOMESTICO TERCERA EDAD, JUBILADOS Y PENSIONADOS', activo: true },
        { id: 4, nombre: 'SERVICIO COMERCIAL', activo: true },
        { id: 5, nombre: 'DOMESTICO TUBO PRINCIPAL', activo: true },
        { id: 6, nombre: 'SERVICIO PARA PLANTELES EDUCATIVOS', activo: true },
        { id: 7, nombre: 'SERVICIO DOMESTICO PARTICULAR (INAPAM)', activo: true },
        { id: 8, nombre: 'SERVICIO DOMESTICO PARTICULAR (CASA SOLA)', activo: true },
        { id: 9, nombre: 'SERVICIO DOMESTICO PARTICULAR (TERRENO)', activo: true },
        { id: 10, nombre: 'DOMESTICO COMERCIAL', activo: true },
        { id: 11, nombre: 'COMERCIAL BASICO', activo: true }
      ];
      setTarifas(tarifasFallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTarifas();
  }, []);

  return {
    tarifas,
    loading,
    error,
    refetch: fetchTarifas
  };
}