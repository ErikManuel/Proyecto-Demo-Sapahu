import { useState, useEffect } from 'react';

export function useUsers() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // ✅ Agregar estados para paginación
  const [paginacion, setPaginacion] = useState({
    paginaActual: 1,
    totalPaginas: 1,
    totalUsuarios: 0,
    usuariosPorPagina: 5
  });

  const API_URL = 'http://localhost:5000/api';

  // ✅ Modificar fetchUsuarios para soportar paginación
  const fetchUsuarios = async (pagina = 1, limite = 5) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No autenticado');
      }

      // ✅ Agregar parámetros de paginación a la URL
      const response = await fetch(`${API_URL}/users?pagina=${pagina}&limite=${limite}`, {
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
        setUsuarios(data.users || []);
        // ✅ Actualizar estado de paginación
        setPaginacion({
          paginaActual: data.paginaActual || 1,
          totalPaginas: data.totalPaginas || 1,
          totalUsuarios: data.totalUsuarios || 0,
          usuariosPorPagina: limite
        });
      } else {
        throw new Error(data.message || 'Error en la respuesta del servidor');
      }
      
    } catch (err) {
      console.error('❌ Error fetching usuarios:', err);
      setError(err.message);
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // ✅ Agregar función para cambiar de página
  const cambiarPagina = (nuevaPagina) => {
    fetchUsuarios(nuevaPagina, paginacion.usuariosPorPagina);
  };

  // ✅ Agregar función para cambiar cantidad por página
  const cambiarUsuariosPorPagina = (nuevaCantidad) => {
    fetchUsuarios(1, nuevaCantidad);
  };

  const crearUsuario = async (userData) => {
    try {
      setError(null);
      
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No autenticado');
      }

      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear usuario');
      }

      const data = await response.json();
      // ✅ Recargar página actual después de crear
      await fetchUsuarios(paginacion.paginaActual, paginacion.usuariosPorPagina);
      return data;
      
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const actualizarUsuario = async (id, userData) => {
    try {
      setError(null);
      
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No autenticado');
      }

      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar usuario');
      }

      const data = await response.json();
      // ✅ Recargar página actual después de actualizar
      await fetchUsuarios(paginacion.paginaActual, paginacion.usuariosPorPagina);
      return data;
      
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const eliminarUsuario = async (id) => {
    try {
      setError(null);
      
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No autenticado');
      }

      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar usuario');
      }

      const data = await response.json();
      // ✅ Recargar página actual después de eliminar
      // Si la página actual queda vacía, ir a la página anterior
      const usuariosEnPaginaActual = usuarios.length;
      if (usuariosEnPaginaActual === 1 && paginacion.paginaActual > 1) {
        await fetchUsuarios(paginacion.paginaActual - 1, paginacion.usuariosPorPagina);
      } else {
        await fetchUsuarios(paginacion.paginaActual, paginacion.usuariosPorPagina);
      }
      return data;
      
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    usuarios,
    loading,
    error,
    paginacion, // ✅ Exportar estado de paginación
    recargarUsuarios: () => fetchUsuarios(paginacion.paginaActual, paginacion.usuariosPorPagina),
    cambiarPagina, // ✅ Exportar función cambiar página
    cambiarUsuariosPorPagina, // ✅ Exportar función cambiar cantidad
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
  };
}