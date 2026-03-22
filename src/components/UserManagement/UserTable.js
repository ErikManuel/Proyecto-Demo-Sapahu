import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, 
  faTrash, 
  faInbox,
  faUser,
  faUserShield,
  faEye,
  faSync,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { useUsers } from './hooks/useUsers';
import { ConfirmModal } from './ConfirmModal';
import { Pagination } from './Pagination';
import styles from './UserManagement.module.scss';

export function UserTable({ 
  usuarios, 
  onEditarUsuario, 
  onUsuarioEliminado,
  paginacion, // ✅ Recibir prop de paginación
  onChangePagina, // ✅ Recibir función cambiar página
  onChangeElementosPorPagina // ✅ Recibir función cambiar cantidad
}) {
  const { eliminarUsuario, actualizarUsuario } = useUsers();
  const [usuarioEliminando, setUsuarioEliminando] = useState(null);
  const [usuarioActivando, setUsuarioActivando] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [accionSeleccionada, setAccionSeleccionada] = useState('');

  const handleAbrirConfirmacion = (usuario, accion) => {
    setUsuarioSeleccionado(usuario);
    setAccionSeleccionada(accion);
    setShowConfirmModal(true);
  };

  const handleCerrarConfirmacion = () => {
    setShowConfirmModal(false);
    setUsuarioSeleccionado(null);
    setAccionSeleccionada('');
  };

  const handleConfirmarAccion = async (usuario) => {
    try {
      if (accionSeleccionada === 'deactivate') {
        setUsuarioEliminando(usuario._id);
        await eliminarUsuario(usuario._id);
      } else if (accionSeleccionada === 'activate') {
        setUsuarioActivando(usuario._id);
        await actualizarUsuario(usuario._id, { active: true });
      }
      
      onUsuarioEliminado();
      handleCerrarConfirmacion();
    } catch (error) {
      console.error(`Error ${accionSeleccionada === 'deactivate' ? 'desactivando' : 'activando'} usuario:`, error);
      alert(`Error al ${accionSeleccionada === 'deactivate' ? 'desactivar' : 'activar'} usuario: ` + error.message);
    } finally {
      setUsuarioEliminando(null);
      setUsuarioActivando(null);
    }
  };

  const getBadgeClass = (role, active) => {
    if (!active) return styles.badgeInactive;
    
    switch (role) {
      case 'admin': return styles.badgeAdmin;
      case 'cobrador': return styles.badgeCobrador;
      case 'consultor': return styles.badgeConsultor;
      default: return styles.badgeInactive;
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return faUserShield;
      case 'cobrador': return faUser;
      case 'consultor': return faEye;
      default: return faUser;
    }
  };

  const formatRole = (role) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'cobrador': return 'Cobrador';
      case 'consultor': return 'Consultor';
      default: return role;
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return 'Nunca';
    return new Date(fecha).toLocaleDateString('es-MX');
  };

  if (usuarios.length === 0) {
    return (
      <div className={styles.tableContainer}>
        <div className={styles.emptyState}>
          <FontAwesomeIcon icon={faInbox} size="3x" />
          <h4>No hay usuarios</h4>
          <p>No se encontraron usuarios en el sistema</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h4>Lista de Usuarios</h4>
          <span className={styles.tableSubtitle}>
            Página {paginacion.paginaActual} de {paginacion.totalPaginas}
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Municipio</th>
                <th>Estado</th>
                <th>Último Login</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario._id}>
                  <td>
                    <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                      {usuario.name}
                    </div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>
                      {usuario.email}
                    </div>
                  </td>
                  
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FontAwesomeIcon 
                        icon={getRoleIcon(usuario.role)} 
                        style={{ 
                          color: usuario.active ? '#3b82f6' : '#9ca3af'
                        }} 
                      />
                      <span className={`${styles.badge} ${getBadgeClass(usuario.role, usuario.active)}`}>
                        {formatRole(usuario.role)}
                      </span>
                    </div>
                  </td>
                  
                  <td>
                    <span style={{ fontSize: '14px' }}>
                      {usuario.municipio || 'No especificado'}
                    </span>
                  </td>
                  
                  <td>
                    <span className={usuario.active ? styles.statusActive : styles.statusInactive}>
                      {usuario.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  
                  <td>
                    <div style={{ fontSize: '13px' }}>
                      {formatFecha(usuario.lastLogin)}
                    </div>
                  </td>
                  
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={`${styles.btn} ${styles.btnEdit}`}
                        onClick={() => onEditarUsuario(usuario)}
                        disabled={usuarioEliminando === usuario._id || usuarioActivando === usuario._id}
                      >
                        <FontAwesomeIcon icon={faEdit} /> Editar
                      </button>
                      
                      {usuario.active ? (
                        <button
                          className={`${styles.btn} ${styles.btnDelete}`}
                          onClick={() => handleAbrirConfirmacion(usuario, 'deactivate')}
                          disabled={usuarioEliminando === usuario._id || usuarioActivando === usuario._id}
                        >
                          <FontAwesomeIcon 
                            icon={usuarioEliminando === usuario._id ? faSync : faTrash} 
                            spin={usuarioEliminando === usuario._id}
                          /> 
                          {usuarioEliminando === usuario._id ? '...' : 'Desactivar'}
                        </button>
                      ) : (
                        <button
                          className={`${styles.btn} ${styles.btnActivate}`}
                          onClick={() => handleAbrirConfirmacion(usuario, 'activate')}
                          disabled={usuarioEliminando === usuario._id || usuarioActivando === usuario._id}
                        >
                          <FontAwesomeIcon 
                            icon={usuarioActivando === usuario._id ? faSync : faCheckCircle} 
                            spin={usuarioActivando === usuario._id}
                          /> 
                          {usuarioActivando === usuario._id ? '...' : 'Activar'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ Agregar componente de paginación */}
        <Pagination
          paginaActual={paginacion.paginaActual}
          totalPaginas={paginacion.totalPaginas}
          totalElementos={paginacion.totalUsuarios}
          elementosPorPagina={paginacion.usuariosPorPagina}
          onChangePagina={onChangePagina}
          onChangeElementosPorPagina={onChangeElementosPorPagina}
        />
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={handleCerrarConfirmacion}
        onConfirm={handleConfirmarAccion}
        usuario={usuarioSeleccionado}
        actionType={accionSeleccionada}
        loading={usuarioEliminando || usuarioActivando}
      />
    </>
  );
}