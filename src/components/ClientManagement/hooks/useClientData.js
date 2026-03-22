import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

export function useClientData() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener el token de autenticación
  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  // Función helper para hacer requests
  const makeRequest = async (endpoint, options = {}) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    if (options.body) {
      config.body = options.body;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      throw err;
    }
  };

  // Función para obtener el próximo contrato disponible
  const getNextContract = async () => {
    try {
      const data = await makeRequest('/clientes/next-contract');
      if (data.success) {
        return { 
          success: true, 
          nextContract: data.data.nextContract,
          nextNumber: data.data.nextNumber
        };
      } else {
        throw new Error(data.message || 'Error obteniendo próximo contrato');
      }
    } catch (err) {
      const errorMessage = err.message || 'Error obteniendo próximo contrato';
      console.error('Error getting next contract:', err);
      return { success: false, error: errorMessage };
    }
  };

  // Función principal para cargar clientes
  const fetchClients = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        ...filters,
        limit: '1000'
      }).toString();

      const data = await makeRequest(`/clientes?${queryParams}`);
      
      // Mapear los datos del backend al formato que espera tu frontend
      const mappedClients = data.data.map(client => ({
        id: client._id,
        contrato: client.contrato,
        nombre: client.nombre,
        colonia: client.colonia,
        direccion: client.direccion,
        tipoTarifa: client.tipoTarifa,
        deuda: client.deuda,
        estado: client.estado,
        telefono: client.telefono,
        email: client.email,
        municipio: client.municipio,
        activo: client.activo,
        coordenadas: client.coordenadas || null
      }));
      
      setClients(mappedClients);
      return mappedClients;
    } catch (err) {
      const errorMessage = err.message || 'Error al cargar clientes';
      setError(errorMessage);
      console.error('Error fetching clients:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Función para crear cliente
  const createClient = async (clientData) => {
    try {
      const data = await makeRequest('/clientes', {
        method: 'POST',
        body: JSON.stringify(clientData)
      });

      // Actualizar la lista local
      const newClient = {
        id: data.data._id,
        contrato: data.data.contrato,
        nombre: data.data.nombre,
        colonia: data.data.colonia,
        direccion: data.data.direccion,
        tipoTarifa: data.data.tipoTarifa,
        deuda: data.data.deuda,
        estado: data.data.estado,
        telefono: data.data.telefono,
        email: data.data.email,
        municipio: data.data.municipio,
        activo: true,
        coordenadas: data.data.coordenadas || null
      };

      setClients(prev => [...prev, newClient]);
      return { success: true, client: newClient };
    } catch (err) {
      const errorMessage = err.message || 'Error al crear cliente';
      console.error('Error creating client:', err);
      return { success: false, error: errorMessage };
    }
  };

  // Función para actualizar cliente
  const updateClient = async (id, clientData) => {
    try {
      const data = await makeRequest(`/clientes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(clientData)
      });

      // Actualizar la lista local
      setClients(prev => prev.map(client => 
        client.id === id ? { ...client, ...clientData } : client
      ));

      return { success: true, client: data.data };
    } catch (err) {
      const errorMessage = err.message || 'Error al actualizar cliente';
      console.error('Error updating client:', err);
      return { success: false, error: errorMessage };
    }
  };

  // Función para eliminar cliente (soft delete) - VERSIÓN CORREGIDA
  const deleteClient = async (id, motivo = 'Eliminado desde el sistema') => {
    try {
      const data = await makeRequest(`/clientes/${id}`, {
        method: 'DELETE',
        body: JSON.stringify({ motivo })
      });

      // Verificar si la operación fue exitosa
      if (data.success === true) {
        // Soft delete: marcar como inactivo
        setClients(prev => prev.map(client => 
          client.id === id ? { ...client, activo: false } : client
        ));
        return { success: true };
      } else {
        throw new Error(data.message || 'Error al eliminar cliente');
      }
    } catch (err) {
      const errorMessage = err.message || 'Error al eliminar cliente';
      console.error('Error deleting client:', err);
      return { success: false, error: errorMessage };
    }
  };

  // Cargar clientes al montar el componente
  useEffect(() => {
    fetchClients();
  }, []);

  return { 
    clients, 
    loading, 
    error,
    refetch: fetchClients,
    createClient,
    updateClient,
    deleteClient,
    getNextContract
  };
}