import styles from './ClientManagement.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faMapMarker } from '@fortawesome/free-solid-svg-icons';

export function ClientTable({
  clients,
  loading,
  sortField,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
  totalClients
}) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Cargando clientes...</p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <h3>Clientes Registrados</h3>
        <div className={styles.tableInfo}>
          Mostrando {clients.length} de {totalClients} clientes
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th 
                className={styles.sortable}
                onClick={() => onSort('contrato')}
              >
                Contrato {getSortIcon('contrato')}
              </th>
              <th 
                className={styles.sortable}
                onClick={() => onSort('nombre')}
              >
                Nombre {getSortIcon('nombre')}
              </th>
              <th 
                className={styles.sortable}
                onClick={() => onSort('colonia')}
              >
                Colonia {getSortIcon('colonia')}
              </th>
              <th>Dirección</th>
              <th>Tipo de Tarifa</th>
              <th 
                className={styles.sortable}
                onClick={() => onSort('deuda')}
              >
                Deuda {getSortIcon('deuda')}
              </th>
              <th>Ubicación</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan="9" className={styles.noData}>
                  No se encontraron clientes
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr key={client.id}>
                  <td className={styles.contrato}>{client.contrato}</td>
                  <td className={styles.nombre}>{client.nombre}</td>
                  <td className={styles.colonia}>{client.colonia}</td>
                  <td className={styles.direccion}>{client.direccion}</td>
                  <td className={styles.tarifa}>
                    <span className={styles.tarifaBadge}>
                      {client.tipoTarifa}
                    </span>
                  </td>
                  <td className={styles.deuda}>
                    {formatCurrency(client.deuda)}
                  </td>
                  <td className={styles.ubicacion}>
                    <span className={(client.coordenadas && client.coordenadas.lat && client.coordenadas.lng) ? styles.locationSet : styles.locationMissing}>
                      <FontAwesomeIcon 
                        icon={(client.coordenadas && client.coordenadas.lat && client.coordenadas.lng) ? faMapMarkerAlt : faMapMarker}
                        className={client.coordenadas ? styles.locationIconSet : styles.locationIconMissing}
                      />
                      {(client.coordenadas && client.coordenadas.lat && client.coordenadas.lng) ? 'Definida' : 'Sin ubicación'}
                    </span>
                  </td>
                  <td className={styles.estado}>
                    <span className={`${styles.statusBadge} ${
                      client.estado === 'Activo' ? styles.active : styles.suspended
                    }`}>
                      {client.estado}
                    </span>
                  </td>
                  <td className={styles.acciones}>
                    <button
                      className={styles.editButton}
                      onClick={() => onEdit(client)}
                    >
                      Modificar
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => onDelete(client)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageButton}
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            ← Anterior
          </button>
          
          <div className={styles.pageInfo}>
            Página {currentPage} de {totalPages}
          </div>
          
          <button
            className={styles.pageButton}
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}