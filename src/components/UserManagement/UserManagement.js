import { useState, useMemo } from 'react'; // ✅ Agregar useMemo
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers,
  faUserPlus,
  faSearch,
  faSync,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { UserTable } from './UserTable';
import { UserForm } from './UserForm';
import { useUsers } from './hooks/useUsers';
import styles from './UserManagement.module.scss';

export function GestionUsuarios() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [filtro, setFiltro] = useState('');
  
  // ✅ Estados para paginación frontend
  const [paginaActual, setPaginaActual] = useState(1);
  const [usuariosPorPagina, setUsuariosPorPagina] = useState(5); // ← Cambiar a 5
  
  const { 
    usuarios, 
    loading, 
    error, 
    recargarUsuarios
  } = useUsers();

  const handleCrearUsuario = () => {
    setUsuarioEditando(null);
    setMostrarFormulario(true);
  };

  const handleEditarUsuario = (usuario) => {
    setUsuarioEditando(usuario);
    setMostrarFormulario(true);
  };

  const handleCerrarFormulario = () => {
    setMostrarFormulario(false);
    setUsuarioEditando(null);
    recargarUsuarios();
  };

  // ✅ Filtrar usuarios
  const usuariosFiltrados = usuarios.filter(usuario =>
    usuario.name.toLowerCase().includes(filtro.toLowerCase()) ||
    usuario.email.toLowerCase().includes(filtro.toLowerCase()) ||
    usuario.role.toLowerCase().includes(filtro.toLowerCase())
  );

  // ✅ Calcular paginación frontend
  const totalUsuarios = usuariosFiltrados.length;
  const totalPaginas = Math.ceil(totalUsuarios / usuariosPorPagina);
  
  // ✅ Obtener usuarios de la página actual
  const usuariosPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * usuariosPorPagina;
    const fin = inicio + usuariosPorPagina;
    return usuariosFiltrados.slice(inicio, fin);
  }, [usuariosFiltrados, paginaActual, usuariosPorPagina]);

  // ✅ Función para cambiar página
  const cambiarPagina = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
  };

  // ✅ Función para cambiar cantidad por página
  const cambiarUsuariosPorPagina = (nuevaCantidad) => {
    setUsuariosPorPagina(nuevaCantidad);
    setPaginaActual(1); // Volver a la primera página
  };

  // ✅ Resetear a página 1 cuando cambia el filtro
  useState(() => {
    setPaginaActual(1);
  }, [filtro]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <FontAwesomeIcon icon={faSync} spin /> Cargando usuarios...
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <FontAwesomeIcon icon={faExclamationTriangle} />
        <div>
          <strong>Error al cargar usuarios</strong>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.gestionUsuarios}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1>
            <FontAwesomeIcon icon={faUsers} /> Gestión de Usuarios
          </h1>
          <p>Administra los usuarios del sistema SAPAHU</p>
          <div className={styles.paginationInfoHeader}>
            Total: {usuarios.length} usuarios | 
            Filtrados: {usuariosFiltrados.length} | 
            Página {paginaActual} de {totalPaginas}
          </div>
        </div>
        
        <button 
          className={styles.primaryButton}
          onClick={handleCrearUsuario}
        >
          <FontAwesomeIcon icon={faUserPlus} /> Nuevo Usuario
        </button>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className={styles.searchBar}>
        <div className={styles.searchInput}>
          <FontAwesomeIcon icon={faSearch} />
          <input
            type="text"
            placeholder="Buscar por nombre, email o rol..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
        
        <div className={styles.stats}>
          <span>{usuariosFiltrados.length} usuarios encontrados</span>
        </div>
      </div>

      {/* Tabla de usuarios con paginación frontend */}
      <UserTable
        usuarios={usuariosPaginados} // ✅ Pasar usuarios paginados
        onEditarUsuario={handleEditarUsuario}
        onUsuarioEliminado={recargarUsuarios}
        paginacion={{ // ✅ Pasar estado de paginación frontend
          paginaActual,
          totalPaginas,
          totalUsuarios: usuariosFiltrados.length,
          usuariosPorPagina
        }}
        onChangePagina={cambiarPagina}
        onChangeElementosPorPagina={cambiarUsuariosPorPagina}
      />

      {/* Modal de formulario */}
      {mostrarFormulario && (
        <UserForm
          usuario={usuarioEditando}
          onClose={handleCerrarFormulario}
          onUsuarioGuardado={handleCerrarFormulario}
        />
      )}
    </div>
  );
}