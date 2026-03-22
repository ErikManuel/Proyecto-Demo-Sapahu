import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faUndo, 
  faTimes, 
  faCheckCircle,
  faExclamationTriangle,
  faSpinner,
  faList,
  faRedoAlt,
  faCheckSquare,
  faSquare
} from '@fortawesome/free-solid-svg-icons';
import styles from './ClientManagement.module.scss';

export function RestoreClientsModal({ 
  isOpen, 
  onClose, 
  onRestoreSuccess 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deletedClients, setDeletedClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [selectedClients, setSelectedClients] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [results, setResults] = useState({ success: 0, errors: 0 });

  // Cargar clientes eliminados
 const fetchDeletedClients = async () => {
  if (!isOpen) return;
  
  setLoading(true);
  try {
    const token = localStorage.getItem('authToken');
    
    // Verificar que tenemos token
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const queryParams = new URLSearchParams({
      search: searchTerm,
      limit: '100'
    }).toString();

    console.log('🔍 Solicitando clientes eliminados...');
    
    const response = await fetch(`http://localhost:5000/api/clientes/deleted/list?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 Respuesta del servidor:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error del servidor:', errorText);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('📊 Datos recibidos:', data);
    
    if (data.success) {
      setDeletedClients(data.data || []);
      console.log(`✅ ${data.data?.length || 0} clientes eliminados cargados`);
    } else {
      throw new Error(data.message || 'Error en la respuesta del servidor');
    }
  } catch (error) {
    console.error('💥 Error completo:', error);
    alert(`Error al cargar clientes eliminados: ${error.message}`);
  } finally {
    setLoading(false);
  }
};

  // Restaurar cliente individual
  const restoreClient = async (clientId, contrato) => {
    if (!window.confirm(`¿Restaurar cliente ${contrato}?`)) return;

    setRestoring(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/clientes/${clientId}/restore`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setResults(prev => ({ ...prev, success: prev.success + 1 }));
        // Remover de la lista
        setDeletedClients(prev => prev.filter(client => client._id !== clientId));
        setSelectedClients(prev => {
          const newSet = new Set(prev);
          newSet.delete(clientId);
          return newSet;
        });
        if (onRestoreSuccess) onRestoreSuccess();
      } else {
        setResults(prev => ({ ...prev, errors: prev.errors + 1 }));
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      setResults(prev => ({ ...prev, errors: prev.errors + 1 }));
      alert('Error al restaurar cliente');
    } finally {
      setRestoring(false);
    }
  };

  // Restaurar múltiples clientes
  const restoreMultipleClients = async () => {
    if (selectedClients.size === 0) {
      alert('Selecciona al menos un cliente para restaurar');
      return;
    }

    if (!window.confirm(`¿Restaurar ${selectedClients.size} cliente(s) seleccionado(s)?`)) return;

    setRestoring(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/clientes/restore/multiple', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clienteIds: Array.from(selectedClients)
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setResults({ 
          success: data.data.restaurados, 
          errors: data.data.errores 
        });
        
        // Remover los restaurados exitosamente de la lista
        const successfulIds = data.data.detalles
          .filter(item => item.success)
          .map(item => item.id);
        
        setDeletedClients(prev => 
          prev.filter(client => !successfulIds.includes(client._id))
        );
        setSelectedClients(new Set());
        setSelectAll(false);
        
        if (onRestoreSuccess) onRestoreSuccess();
        
        alert(`✅ ${data.data.restaurados} cliente(s) restaurado(s) exitosamente`);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert('Error al restaurar clientes');
    } finally {
      setRestoring(false);
    }
  };

  // Restaurar todos los clientes
  const restoreAllClients = async () => {
    if (deletedClients.length === 0) {
      alert('No hay clientes para restaurar');
      return;
    }

    if (!window.confirm(`¿Restaurar TODOS los ${deletedClients.length} clientes eliminados?`)) return;

    setRestoring(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/clientes/restore/all', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setResults({ 
          success: data.data.restaurados, 
          errors: data.data.errores 
        });
        
        // Limpiar lista si se restauraron todos
        if (data.data.errores === 0) {
          setDeletedClients([]);
        } else {
          // Recargar lista para ver los que quedan
          fetchDeletedClients();
        }
        
        setSelectedClients(new Set());
        setSelectAll(false);
        
        if (onRestoreSuccess) onRestoreSuccess();
        
        alert(`✅ ${data.data.restaurados} cliente(s) restaurado(s) exitosamente`);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert('Error al restaurar todos los clientes');
    } finally {
      setRestoring(false);
    }
  };

  // Toggle selección individual
  const toggleClientSelection = (clientId) => {
    setSelectedClients(prev => {
      const newSet = new Set(prev);
      if (newSet.has(clientId)) {
        newSet.delete(clientId);
      } else {
        newSet.add(clientId);
      }
      return newSet;
    });
  };

  // Toggle seleccionar todos
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedClients(new Set());
    } else {
      const allIds = new Set(deletedClients.map(client => client._id));
      setSelectedClients(allIds);
    }
    setSelectAll(!selectAll);
  };

  // Efectos
  useEffect(() => {
    if (isOpen) {
      fetchDeletedClients();
      setResults({ success: 0, errors: 0 });
    }
  }, [isOpen, searchTerm]);

  useEffect(() => {
    setSelectAll(selectedClients.size === deletedClients.length && deletedClients.length > 0);
  }, [selectedClients, deletedClients]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal} style={{ maxWidth: '800px', maxHeight: '90vh' }}>
        <div className={styles.modalHeader}>
          <h3>
            <FontAwesomeIcon icon={faUndo} style={{ marginRight: '10px', color: '#0D47F9' }} />
            Restaurar Clientes Eliminados
          </h3>
          <button 
            onClick={onClose}
            className={styles.closeButton}
            disabled={restoring}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className={styles.modalContent}>
          {/* Barra de búsqueda y controles */}
          <div className={styles.restoreControls}>
            <div className={styles.searchContainer}>
              <div className={styles.searchInputWrapper}>
                <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Buscar clientes eliminados..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </div>

            <div className={styles.bulkActions}>
              <button
                onClick={restoreMultipleClients}
                disabled={restoring || selectedClients.size === 0}
                className={styles.restoreSelectedButton}
              >
                <FontAwesomeIcon icon={faRedoAlt} />
                Restaurar Seleccionados ({selectedClients.size})
              </button>
              
              <button
                onClick={restoreAllClients}
                disabled={restoring || deletedClients.length === 0}
                className={styles.restoreAllButton}
              >
                <FontAwesomeIcon icon={faUndo} />
                Restaurar Todo ({deletedClients.length})
              </button>
            </div>
          </div>

          {/* Resultados de operaciones recientes */}
          {(results.success > 0 || results.errors > 0) && (
            <div className={styles.resultsSummary}>
              {results.success > 0 && (
                <span className={styles.successCount}>
                  <FontAwesomeIcon icon={faCheckCircle} />
                  {results.success} restaurado(s)
                </span>
              )}
              {results.errors > 0 && (
                <span className={styles.errorCount}>
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                  {results.errors} error(es)
                </span>
              )}
            </div>
          )}

          {/* Lista de clientes eliminados */}
          <div className={styles.deletedClientsList}>
            {loading ? (
              <div className={styles.loading}>
                <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                <p>Cargando clientes eliminados...</p>
              </div>
            ) : deletedClients.length === 0 ? (
              <div className={styles.noData}>
                <FontAwesomeIcon icon={faList} size="3x" />
                <p>No hay clientes eliminados</p>
                {searchTerm && <small>Intenta con otros términos de búsqueda</small>}
              </div>
            ) : (
              <>
                <div className={styles.tableWrapper} style={{ maxHeight: '400px', overflow: 'auto' }}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}>
                          <button
                            onClick={toggleSelectAll}
                            className={styles.selectAllButton}
                          >
                            <FontAwesomeIcon 
                              icon={selectAll ? faCheckSquare : faSquare} 
                            />
                          </button>
                        </th>
                        <th>Contrato</th>
                        <th>Nombre</th>
                        <th>Dirección</th>
                        <th>Fecha Eliminación</th>
                        <th>Motivo</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deletedClients.map((client) => (
                        <tr key={client._id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedClients.has(client._id)}
                              onChange={() => toggleClientSelection(client._id)}
                              disabled={restoring}
                            />
                          </td>
                          <td className={styles.contrato}>{client.contrato}</td>
                          <td className={styles.nombre}>{client.nombre}</td>
                          <td className={styles.direccion}>{client.direccion}</td>
                          <td className={styles.fechaEliminacion}>
                            {client.fechaEliminacion 
                              ? new Date(client.fechaEliminacion).toLocaleDateString()
                              : 'N/A'
                            }
                          </td>
                          <td className={styles.motivo}>
                            {client.motivoEliminacion || 'No especificado'}
                          </td>
                          <td className={styles.acciones}>
                            <button
                              onClick={() => restoreClient(client._id, client.contrato)}
                              disabled={restoring}
                              className={styles.restoreSingleButton}
                            >
                              <FontAwesomeIcon icon={faRedoAlt} />
                              Restaurar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className={styles.selectionInfo}>
                  <small>
                    {selectedClients.size} de {deletedClients.length} cliente(s) seleccionado(s)
                  </small>
                </div>
              </>
            )}
          </div>
        </div>

        <div className={styles.modalActions}>          
          <div className={styles.restoreInfo}>
            <small>
              Los clientes restaurados volverán a estar activos en el sistema
            </small>
          </div>
        </div>

        {/* Overlay de carga */}
        {restoring && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner}>
              <FontAwesomeIcon icon={faSpinner} spin size="2x" />
            </div>
            <p>Restaurando clientes...</p>
          </div>
        )}
      </div>
    </div>
  );
}