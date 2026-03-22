import { useState, useEffect } from 'react';
import { ClientTable } from './ClientTable';
import { ClientMetrics } from './ClientMetrics';
import { ClientFilters } from './ClientFilters';
import { useClientData } from './hooks/useClientData';
import { useClientMetrics } from './hooks/useClientMetrics';
import { useTarifas } from './hooks/useTarifas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RestoreClientsModal } from './RestoreClientsModal';
import { 
  faPlus, 
  faSearch, 
  faClock,
  faExclamationTriangle,
  faCheckCircle,
  faSpinner,
  faTimes,
  faFileExport,
  faMapMarkerAlt,
  faCrosshairs,
  faMapPin,faUndo
} from '@fortawesome/free-solid-svg-icons';
import styles from './ClientManagement.module.scss';

export function ClientManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [tarifaFilter, setTarifaFilter] = useState('todas');
  const [sortField, setSortField] = useState('contrato');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [newClientData, setNewClientData] = useState({
    contrato: '',
    nombre: '',
    direccion: '',
    colonia: '',
    tipoTarifa: '',
    deuda: 0,
    estado: 'Activo',
    telefono: '',
    email: '',
    municipio: '',
    coordenadas: null
  });
  const [nextContractNumber, setNextContractNumber] = useState(1);
  const [creatingClient, setCreatingClient] = useState(false);
  const [editingClient, setEditingClient] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  
  // Usar el hook que conecta con el backend
  const { 
    clients, 
    loading, 
    error,
    createClient, 
    updateClient, 
    deleteClient,
    refetch,
    getNextContract 
  } = useClientData();
  
  const clientsList = clients ?? [];
  const metrics = useClientMetrics(clientsList);

 // Usar el hook de tarifas
  const { tarifas, loading: loadingTarifas } = useTarifas();
 // Filtrar tarifas activas
  const tarifasActivas = tarifas.filter(tarifa => tarifa.activo !== false);


  // Función para obtener ubicación actual
  const getCurrentLocation = (isEditModal = false) => {
    setGettingLocation(true);
    
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización');
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Validar que las coordenadas estén en México aproximadamente
        if (latitude >= 14 && latitude <= 33 && longitude >= -118 && longitude <= -86) {
          if (!isEditModal && showCreateModal) {
            setNewClientData(prev => ({
              ...prev,
              coordenadas: { lat: parseFloat(latitude.toFixed(6)), lng: parseFloat(longitude.toFixed(6)) }
            }));
          } else if (isEditModal && showEditModal && selectedClient) {
            setSelectedClient(prev => ({
              ...prev,
              coordenadas: { lat: parseFloat(latitude.toFixed(6)), lng: parseFloat(longitude.toFixed(6)) }
            }));
          }
        } else {
          alert('Las coordenadas obtenidas no parecen estar en México. Por favor verifica.');
        }
        setGettingLocation(false);
      },
      (error) => {
        console.error('Error obteniendo ubicación:', error);
        let errorMessage = 'Error obteniendo ubicación: ';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Permiso denegado por el usuario';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Ubicación no disponible';
            break;
          case error.TIMEOUT:
            errorMessage += 'Tiempo de espera agotado';
            break;
          default:
            errorMessage += 'Error desconocido';
        }
        alert(errorMessage);
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000
      }
    );
  };

  // Obtener próximo contrato cuando se abra el modal
  useEffect(() => {
    if (showCreateModal) {
      const fetchNextContract = async () => {
        const result = await getNextContract();
        if (result.success) {
          setNewClientData(prev => ({
            ...prev,
            contrato: result.nextContract
          }));
          setNextContractNumber(result.nextNumber);
        } else {
          // Fallback: calcular en frontend si el backend falla
          console.log('Usando cálculo de contrato en frontend como fallback');
          const activeClients = clientsList.filter(client => client.activo !== false);
          if (activeClients.length > 0) {
            const contractNumbers = activeClients.map(client => {
              const match = client.contrato.match(/CTO-(\d+)/);
              return match ? parseInt(match[1]) : 0;
            }).filter(num => num > 0);
            
            const maxNumber = contractNumbers.length > 0 ? Math.max(...contractNumbers) : 0;
            const nextNumber = maxNumber + 1;
            const nextContract = `CTO-${String(nextNumber).padStart(3, '0')}`;
            
            setNewClientData(prev => ({ ...prev, contrato: nextContract }));
            setNextContractNumber(nextNumber);
          } else {
            setNewClientData(prev => ({ ...prev, contrato: 'CTO-001' }));
            setNextContractNumber(1);
          }
        }
      };

      fetchNextContract();
    }
  }, [showCreateModal, clientsList, getNextContract]);

  // Validar si el contrato ya existe (globalmente)
  const isContractUnique = (contract) => {
    return !clientsList.some(client => 
      client.contrato === contract
    );
  };

  // Filtrar y ordenar clientes - MOSTRAR SOLO ACTIVOS
  const filteredClients = clientsList.filter(client => {
    // Solo mostrar clientes activos
   // if (client.activo === false) return false;
    
    const nombre = (client?.nombre ?? '').toString();
    const contrato = (client?.contrato ?? '').toString();
    const direccion = (client?.direccion ?? '').toString();
    const term = (searchTerm ?? '').toString().toLowerCase();

    const matchesSearch =
      nombre.toLowerCase().includes(term) ||
      contrato.toLowerCase().includes(term) ||
      direccion.toLowerCase().includes(term);
    
    const matchesStatus = statusFilter === 'todos' || client?.estado === statusFilter;
    const matchesTarifa = tarifaFilter === 'todas' || client?.tipoTarifa === tarifaFilter;
    
    return matchesSearch && matchesStatus && matchesTarifa;
  });

  // Ordenar clientes
  const sortedClients = [...filteredClients].sort((a, b) => {
    const va = a?.[sortField];
    const vb = b?.[sortField];

    if (va == null) return 1;
    if (vb == null) return -1;

    if (typeof va === 'number' && typeof vb === 'number') {
      return sortDirection === 'asc' ? va - vb : vb - va;
    }

    const sa = String(va).toLowerCase();
    const sb = String(vb).toLowerCase();
    return sortDirection === 'asc' ? sa.localeCompare(sb) : sb.localeCompare(sa);
  });

  // Reiniciar paginación al cambiar filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, tarifaFilter, sortField, sortDirection]);

  // Paginación
  const itemsPerPage = 5;
  const totalPages = Math.ceil(sortedClients.length / itemsPerPage);
  const paginatedClients = sortedClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleExport = async (format = 'excel') => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Error: No hay token de autenticación');
        return;
      }

      let url = '';
      let filename = '';

      switch (format) {
        case 'excel':
          url = 'http://localhost:5000/api/export/clientes/excel';
          filename = `clientes_${new Date().toISOString().split('T')[0]}.xlsx`;
          break;
        case 'csv':
          url = 'http://localhost:5000/api/export/clientes/csv';
          filename = `clientes_activos_${new Date().toISOString().split('T')[0]}.csv`;
          break;
        case 'metricas':
          url = 'http://localhost:5000/api/export/metricas';
          filename = `metricas_clientes_${new Date().toISOString().split('T')[0]}.xlsx`;
          break;
        default:
          return;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Crear blob y descargar
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      alert(`✅ Archivo ${filename} descargado exitosamente`);

    } catch (error) {
      console.error('Error exportando datos:', error);
      alert(`❌ Error al exportar: ${error.message}`);
    }
  };

  // Abrir modal para crear cliente con contrato automático
  const handleCreateClient = async () => {
    try {
      // Obtener el próximo contrato del backend
      const result = await getNextContract();
      
      if (result.success) {
        setNewClientData({
          contrato: result.nextContract,
          nombre: '',
          direccion: '',
          colonia: '',
          tipoTarifa: '',
          deuda: 0,
          estado: 'Activo',
          telefono: '',
          email: '',
          municipio: '',
          coordenadas: null
        });
        setNextContractNumber(result.nextNumber);
      } else {
        // Fallback si el backend falla
        console.warn('No se pudo obtener el próximo contrato, usando cálculo local');
        const activeClients = clientsList.filter(c => c.activo !== false);
        const maxNumber = activeClients.length > 0 ? 
          Math.max(...activeClients.map(c => {
            const match = c.contrato.match(/CTO-(\d+)/);
            return match ? parseInt(match[1]) : 0;
          }).filter(num => num > 0)) : 0;
        
        const nextNumber = maxNumber + 1;
        setNewClientData({
          contrato: `CTO-${String(nextNumber).padStart(3, '0')}`,
          nombre: '',
          direccion: '',
          colonia: '',
          tipoTarifa: '',
          deuda: 0,
          estado: 'Activo',
          telefono: '',
          email: '',
          municipio: 'Huetamo',
          coordenadas: null
        });
        setNextContractNumber(nextNumber);
      }
      
      setShowCreateModal(true);
    } catch (error) {
      console.error('Error al obtener próximo contrato:', error);
      // En caso de error, usar un valor por defecto
      setNewClientData({
        contrato: 'CTO-001',
        nombre: '',
        direccion: '',
        colonia: '',
        tipoTarifa: '',
        deuda: 0,
        estado: 'Activo',
        telefono: '',
        email: '',
        municipio: 'Huetamo',
        coordenadas: null
      });
      setShowCreateModal(true);
    }
  };

  // FUNCIÓN MEJORADA: Guardar nuevo cliente con protección contra doble clic
  const handleSaveNewClient = async () => {
    // Prevenir doble clic
    if (creatingClient) {
      console.log('⚠️ Creación de cliente ya en progreso...');
      return;
    }

    if (!newClientData.contrato || !newClientData.nombre || !newClientData.direccion || !newClientData.colonia) {
      alert('Por favor complete los campos requeridos: Contrato, Nombre, Dirección y Colonia');
      return;
    }

    // Validar formato del contrato
    if (!/^CTO-\d{3,}$/.test(newClientData.contrato)) {
      alert('El formato del contrato debe ser CTO- seguido de números (ej: CTO-011)');
      return;
    }

    // Validar que el contrato sea único (solo en clientes activos)
    if (!isContractUnique(newClientData.contrato)) {
      alert('❌ Este número de contrato ya existe. Por favor use otro.');
      return;
    }

    // Iniciar estado de loading
    setCreatingClient(true);

    try {
      const result = await createClient(newClientData);
      
      if (result.success) {
        alert('✅ Cliente creado exitosamente');
        
        // Cerrar modal inmediatamente
        setShowCreateModal(false);
        
        // Recargar la lista después de un breve delay
        setTimeout(() => {
          refetch();
        }, 500);
        
      } else {
        alert(`❌ Error creando cliente: ${result.error}`);
      }
    } catch (error) {
      console.error('Error en handleSaveNewClient:', error);
      alert(`❌ Error inesperado: ${error.message}`);
    } finally {
      // Siempre resetear el estado de loading
      setCreatingClient(false);
    }
  };

  // FUNCIÓN MEJORADA: Abrir modal para editar cliente
  const handleEdit = (client) => {
    setSelectedClient({...client});
    setShowEditModal(true);
  };

  // FUNCIÓN MEJORADA: Guardar cambios de edición con protección contra doble clic
  const handleSaveEdit = async () => {
    // Prevenir doble clic
    if (editingClient || !selectedClient) {
      return;
    }

    // Iniciar estado de loading
    setEditingClient(true);

    try {
      const result = await updateClient(selectedClient.id, {
        nombre: selectedClient.nombre,
        direccion: selectedClient.direccion,
        colonia: selectedClient.colonia,
        tipoTarifa: selectedClient.tipoTarifa,
        deuda: selectedClient.deuda,
        estado: selectedClient.estado,
        telefono: selectedClient.telefono,
        email: selectedClient.email,
        municipio: selectedClient.municipio,
        coordenadas: selectedClient.coordenadas
      });

      if (result.success) {
        alert('✅ Cliente actualizado exitosamente');
        
        // Cerrar modal inmediatamente
        setShowEditModal(false);
        setSelectedClient(null);
        
        // Recargar la lista después de un breve delay
        setTimeout(() => {
          refetch();
        }, 500);
        
      } else {
        alert(`❌ Error actualizando cliente: ${result.error}`);
      }
    } catch (error) {
      console.error('Error en handleSaveEdit:', error);
      alert(`❌ Error inesperado: ${error.message}`);
    } finally {
      // Siempre resetear el estado de loading
      setEditingClient(false);
    }
  };

  // FUNCIÓN MEJORADA: Manejar cierre del modal de creación
  const handleCloseCreateModal = () => {
    if (!creatingClient) {
      setShowCreateModal(false);
    }
  };

  // FUNCIÓN MEJORADA: Manejar cierre del modal de edición
  const handleCloseEditModal = () => {
    if (!editingClient) {
      setShowEditModal(false);
      setSelectedClient(null);
    }
  };

  const handleDelete = async (client) => {
    // Pedir el motivo al usuario
    const motivo = window.prompt(
      `¿Estás seguro de eliminar al cliente ${client.nombre} (Contrato: ${client.contrato})?\n\nPor favor ingresa el motivo de eliminación (mínimo 5 caracteres):`,
      'Eliminado por el administrador'
    );

    // Validar que se ingresó un motivo
    if (motivo === null) {
      return; // Usuario canceló
    }

    if (!motivo || motivo.trim().length < 5) {
      alert('Debe proporcionar un motivo de eliminación (mínimo 5 caracteres)');
      return;
    }

    if (window.confirm(`¿Confirmas eliminar al cliente ${client.nombre}?`)) {
      const result = await deleteClient(client.id, motivo.trim());
      if (result.success) {
        alert('✅ Cliente eliminado exitosamente');
        refetch(); // Recargar para actualizar números
      } else {
        alert(`❌ Error eliminando cliente: ${result.error}`);
      }
    }
  };

  // Manejar estado de error
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <h3>
            <FontAwesomeIcon icon={faExclamationTriangle} style={{color: '#dc2626', marginRight: '10px'}} />
            Error al cargar los datos
          </h3>
          <p>{error}</p>
          <div className={styles.errorActions}>
            <button 
              className={styles.retryButton}
              onClick={() => refetch()}
            >
              <FontAwesomeIcon icon={faSpinner} spin style={{marginRight: '8px'}} />
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.clientManagement}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1>Gestión de Clientes</h1>
          <p>Administración de clientes del servicio de agua</p>
          <div className={styles.contractInfo}>
          </div>
        </div>
         <div className={styles.headerActions}>.
          {/* Boton de restaurar clientes */}
          <button 
            className={styles.restoreClientsButton}
            onClick={() => setShowRestoreModal(true)}
            disabled={loading}>
            <FontAwesomeIcon icon={faUndo} />
            Restaurar Eliminados
          </button>
          {/* Boton de nuevo cliente */}
        <button 
          className={styles.createButton}
          onClick={handleCreateClient}
          disabled={loading || creatingClient}>
          <FontAwesomeIcon icon={loading || creatingClient ? faSpinner : faPlus} spin={loading || creatingClient} />
          {loading || creatingClient ? ' Cargando...' : ' Nuevo Cliente'}
        </button>
      </div>
      </div>

      {/* Métricas */}
      <ClientMetrics metrics={metrics} />

      {/* Filtros y controles */}
      <ClientFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        tarifaFilter={tarifaFilter}
        onTarifaFilterChange={setTarifaFilter}
        onExport={handleExport}
        tarifas={tarifas} // Pasar tarifas como prop
        loadingTarifas={loadingTarifas} // Pasar estado de carga
      />

      {/* Tabla de clientes */}
      <ClientTable
        clients={paginatedClients}
        loading={loading}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalClients={sortedClients.length}
      />

      {/* Modal para Crear Cliente */}
      {showCreateModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Crear Nuevo Cliente</h3>
              <button 
                onClick={handleCloseCreateModal}
                className={styles.closeButton}
                disabled={creatingClient}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.contractAlert}>
                <span>
                  <FontAwesomeIcon icon={faCheckCircle} style={{color: '#10b981', marginRight: '8px'}} />
                  Numero de Contrato: <strong>{newClientData.contrato}</strong>
                </span>
              </div>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Contrato *</label>
                  <input
                    type="text"
                    value={newClientData.contrato}
                    onChange={(e) => setNewClientData({...newClientData, contrato: e.target.value.toUpperCase()})}
                    placeholder="Ej: CTO-011"
                    className={styles.contractInput}
                    disabled={creatingClient}
                  />
                  <small>Formato: CTO- seguido de números</small>
                </div>
                <div className={styles.formGroup}>
                  <label>Nombre *</label>
                  <input
                    type="text"
                    value={newClientData.nombre}
                    onChange={(e) => setNewClientData({...newClientData, nombre: e.target.value})}
                    placeholder="Nombre completo"
                    disabled={creatingClient}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Dirección *</label>
                  <input
                    type="text"
                    value={newClientData.direccion}
                    onChange={(e) => setNewClientData({...newClientData, direccion: e.target.value})}
                    placeholder="Dirección completa"
                    disabled={creatingClient}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Colonia *</label>
                  <input
                    type="text"
                    value={newClientData.colonia}
                    onChange={(e) => setNewClientData({...newClientData, colonia: e.target.value})}
                    placeholder="Colonia"
                    disabled={creatingClient}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Tipo de Tarifa</label>
                    <select
                          value={newClientData.tipoTarifa}
                          onChange={(e) => setNewClientData({...newClientData, tipoTarifa: e.target.value})}
                          disabled={creatingClient || loadingTarifas}>
                          <option value="">Seleccione una tarifa</option>
                          {tarifasActivas.map(tarifa => (
                            <option key={tarifa.id} value={tarifa.nombre}>
                              {tarifa.nombre}
                            </option>
                          ))}
                    </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Deuda Inicial</label>
                  <input
                    type="number"
                    value={newClientData.deuda}
                    onChange={(e) => setNewClientData({...newClientData, deuda: parseFloat(e.target.value) || 0})}
                    step="0.01"
                    min="0"
                    disabled={creatingClient}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Estado</label>
                  <select
                    value={newClientData.estado}
                    onChange={(e) => setNewClientData({...newClientData, estado: e.target.value})}
                    disabled={creatingClient}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Suspendido">Suspendido</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Teléfono</label>
                  <input
                    type="text"
                    value={newClientData.telefono}
                    onChange={(e) => setNewClientData({...newClientData, telefono: e.target.value})}
                    placeholder="Teléfono"
                    disabled={creatingClient}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    value={newClientData.email}
                    onChange={(e) => setNewClientData({...newClientData, email: e.target.value})}
                    placeholder="Email"
                    disabled={creatingClient}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Municipio</label>
                  <input
                    type="text"
                    value={newClientData.municipio}
                    onChange={(e) => setNewClientData({...newClientData, municipio: e.target.value})}
                    placeholder="Municipio"
                    disabled={creatingClient}
                  />
                </div>

                {/* Sección de Ubicación */}
                <div className={styles.formGroup}>
                  <label>Ubicación (Opcional)</label>
                  <div className={styles.locationSection}>
                    <div className={styles.coordinateInputs}>
                      <div className={styles.coordinateRow}>
                        <input
                          type="number"
                          step="any"
                          value={newClientData.coordenadas?.lat || ''}
                          onChange={(e) => setNewClientData({
                            ...newClientData,
                            coordenadas: {
                              ...newClientData.coordenadas,
                              lat: parseFloat(e.target.value) || null
                            }
                          })}
                          placeholder="Latitud"
                          disabled={creatingClient}
                          className={styles.coordinateInput}
                        />
                        <input
                          type="number"
                          step="any"
                          value={newClientData.coordenadas?.lng || ''}
                          onChange={(e) => setNewClientData({
                            ...newClientData,
                            coordenadas: {
                              ...newClientData.coordenadas,
                              lng: parseFloat(e.target.value) || null
                            }
                          })}
                          placeholder="Longitud"
                          disabled={creatingClient}
                          className={styles.coordinateInput}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => getCurrentLocation(false)}
                      disabled={gettingLocation || creatingClient}
                      className={styles.locationButton}
                    >
                      <FontAwesomeIcon 
                        icon={gettingLocation ? faSpinner : faCrosshairs} 
                        spin={gettingLocation}
                      />
                      {gettingLocation ? ' Obteniendo...' : ' Usar mi ubicación actual'}
                    </button>
                    {(newClientData.coordenadas?.lat && newClientData.coordenadas?.lng) && (
                      <div className={styles.locationPreview}>
                        <FontAwesomeIcon icon={faMapMarkerAlt} style={{color: '#0D47F9'}} />
                        <small>
                          Lat: {newClientData.coordenadas.lat.toFixed(6)}, 
                          Lng: {newClientData.coordenadas.lng.toFixed(6)}
                        </small>
                      </div>
                    )}
                  </div>
                  <small>Coordenadas GPS para ubicación exacta del cliente</small>
                </div>
              </div>
              
              {/* Loading indicator */}
              {creatingClient && (
                <div className={styles.loadingOverlay}>
                  <div className={styles.spinner}>
                    <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                  </div>
                  <p>Creando cliente...</p>
                </div>
              )}
              
              <div className={styles.modalActions}>
                <button
                  onClick={handleCloseCreateModal}
                  className={styles.cancelButton}
                  disabled={creatingClient}
                >
                  <FontAwesomeIcon icon={faTimes} style={{marginRight: '8px'}} />
                  Cancelar
                </button>
                <button
                  onClick={handleSaveNewClient}
                  className={styles.confirmButton}
                  disabled={creatingClient || !newClientData.contrato || !newClientData.nombre || !newClientData.direccion || !newClientData.colonia}
                >
                  {creatingClient ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin style={{marginRight: '8px'}} />
                      Creando...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faPlus} style={{marginRight: '8px'}} />
                      Crear Cliente
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal para Editar Cliente */}
      {showEditModal && selectedClient && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Editar Cliente: {selectedClient.contrato}</h3>
              <button 
                onClick={handleCloseEditModal}
                className={styles.closeButton}
                disabled={editingClient}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Contrato</label>
                  <input
                    type="text"
                    value={selectedClient.contrato}
                    disabled
                    className={styles.disabledInput}
                  />
                  <small>El contrato no se puede modificar</small>
                </div>
                <div className={styles.formGroup}>
                  <label>Nombre *</label>
                  <input
                    type="text"
                    value={selectedClient.nombre}
                    onChange={(e) => setSelectedClient({...selectedClient, nombre: e.target.value})}
                    disabled={editingClient}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Dirección *</label>
                  <input
                    type="text"
                    value={selectedClient.direccion}
                    onChange={(e) => setSelectedClient({...selectedClient, direccion: e.target.value})}
                    disabled={editingClient}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Colonia *</label>
                  <input
                    type="text"
                    value={selectedClient.colonia}
                    onChange={(e) => setSelectedClient({...selectedClient, colonia: e.target.value})}
                    disabled={editingClient}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Tipo de Tarifa</label>
                  <select
                    value={selectedClient.tipoTarifa}
                    onChange={(e) => setSelectedClient({...selectedClient, tipoTarifa: e.target.value})}
                    disabled={editingClient || loadingTarifas}>
                    <option value="">Seleccione una tarifa</option>
                    {tarifasActivas.map(tarifa => (
                      <option key={tarifa.id} value={tarifa.nombre}>
                        {tarifa.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Deuda</label>
                  <input
                    type="number"
                    value={selectedClient.deuda}
                    onChange={(e) => setSelectedClient({...selectedClient, deuda: parseFloat(e.target.value) || 0})}
                    step="0.01"
                    min="0"
                    disabled={editingClient}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Estado</label>
                  <select
                    value={selectedClient.estado}
                    onChange={(e) => setSelectedClient({...selectedClient, estado: e.target.value})}
                    disabled={editingClient}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Suspendido">Suspendido</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Teléfono</label>
                  <input
                    type="text"
                    value={selectedClient.telefono || ''}
                    onChange={(e) => setSelectedClient({...selectedClient, telefono: e.target.value})}
                    disabled={editingClient}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    value={selectedClient.email || ''}
                    onChange={(e) => setSelectedClient({...selectedClient, email: e.target.value})}
                    disabled={editingClient}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Municipio</label>
                  <input
                    type="text"
                    value={selectedClient.municipio || ''}
                    onChange={(e) => setSelectedClient({...selectedClient, municipio: e.target.value})}
                    disabled={editingClient}
                  />
                </div>

                {/* Sección de Ubicación en Edición */}
                <div className={styles.formGroup}>
                  <label>Ubicación (Opcional)</label>
                  <div className={styles.locationSection}>
                    <div className={styles.coordinateInputs}>
                      <div className={styles.coordinateRow}>
                        <input
                          type="number"
                          step="any"
                          value={selectedClient.coordenadas?.lat || ''}
                          onChange={(e) => setSelectedClient({
                            ...selectedClient,
                            coordenadas: {
                              ...selectedClient.coordenadas,
                              lat: parseFloat(e.target.value) || null
                            }
                          })}
                          placeholder="Latitud"
                          disabled={editingClient}
                          className={styles.coordinateInput}
                        />
                        <input
                          type="number"
                          step="any"
                          value={selectedClient.coordenadas?.lng || ''}
                          onChange={(e) => setSelectedClient({
                            ...selectedClient,
                            coordenadas: {
                              ...selectedClient.coordenadas,
                              lng: parseFloat(e.target.value) || null
                            }
                          })}
                          placeholder="Longitud"
                          disabled={editingClient}
                          className={styles.coordinateInput}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => getCurrentLocation(true)}
                      disabled={gettingLocation || editingClient}
                      className={styles.locationButton}
                    >
                      <FontAwesomeIcon 
                        icon={gettingLocation ? faSpinner : faCrosshairs} 
                        spin={gettingLocation}
                      />
                      {gettingLocation ? ' Obteniendo...' : ' Usar mi ubicación actual'}
                    </button>
                    {(selectedClient.coordenadas?.lat && selectedClient.coordenadas?.lng) && (
                      <div className={styles.locationPreview}>
                        <FontAwesomeIcon icon={faMapMarkerAlt} style={{color: '#0D47F9'}} />
                        <small>
                          Lat: {selectedClient.coordenadas.lat.toFixed(6)}, 
                          Lng: {selectedClient.coordenadas.lng.toFixed(6)}
                        </small>
                      </div>
                    )}
                  </div>
                  <small>Coordenadas GPS para ubicación exacta del cliente</small>
                </div>
              </div>
              
              {/* Loading indicator */}
              {editingClient && (
                <div className={styles.loadingOverlay}>
                  <div className={styles.spinner}>
                    <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                  </div>
                  <p>Actualizando cliente...</p>
                </div>
              )}
              
              <div className={styles.modalActions}>
                <button
                  onClick={handleCloseEditModal}
                  className={styles.cancelButton}
                  disabled={editingClient}
                >
                  <FontAwesomeIcon icon={faTimes} style={{marginRight: '8px'}} />
                  Cancelar
                </button>
                <button
                  onClick={handleSaveEdit}
                  className={styles.confirmButton}
                  disabled={editingClient || !selectedClient.nombre || !selectedClient.direccion || !selectedClient.colonia}
                >
                  {editingClient ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin style={{marginRight: '8px'}} />
                      Actualizando...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faCheckCircle} style={{marginRight: '8px'}} />
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal de Restauración */}
      <RestoreClientsModal
        isOpen={showRestoreModal}
        onClose={() => setShowRestoreModal(false)}
        onRestoreSuccess={() => {
          refetch(); // Recargar la lista de clientes activos
        }}
      />
    </div>
  );
}