import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faMapMarkerAlt, 
  faMoneyBillWave, 
  faCheckCircle, 
  faExclamationTriangle,
  faCreditCard,
  faMoneyBill,
  faReceipt,
  faUser,
  faList,
  faCrosshairs,
  faEdit,
  faSpinner,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import styles from './ClientSearch.module.scss';

// Componente de mapa simple (sin Leaflet por ahora para simplicidad)
const SimpleMapPreview = ({ lat, lng, onCoordinateChange }) => {
  return (
    <div className={styles.simpleMap}>
      <div className={styles.mapContainer}>
        <div className={styles.mapPlaceholderInteractive}>
          <FontAwesomeIcon icon={faMapMarkerAlt} size="2x" className={styles.mapIcon} />
          <p>Vista previa de ubicación</p>
          <div className={styles.coordinatesDisplay}>
            <strong>Lat:</strong> {(lat && lat !== null) ? lat.toFixed(6) : 'No definida'}
            <br />
            <strong>Lng:</strong> {(lng && lng !== null) ? lng.toFixed(6) : 'No definida'}
          </div>
          <small>Las coordenadas se actualizarán automáticamente</small>
        </div>
      </div>
    </div>
  );
};

export function ClientSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [clientData, setClientData] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showResultsList, setShowResultsList] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [tempCoordinates, setTempCoordinates] = useState(null);

  const API_BASE_URL = 'http://localhost:5000/api';

  // Función para obtener token
  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  // Función para buscar clientes en el backend
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Por favor ingrese un número de contrato o nombre');
      return;
    }

    setLoading(true);
    setError('');
    setClientData(null);
    setShowResultsList(false);

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No hay token de autenticación. Por favor inicie sesión.');
      }

      const response = await fetch(`${API_BASE_URL}/clientes/buscar?q=${encodeURIComponent(searchTerm)}`, {
        method: 'GET',
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

      if (data.data && data.data.length > 0) {
        // Guardamos TODOS los resultados en el estado
        setSearchResults(data.data);
        
        if (data.data.length === 1) {
          // Si solo hay un resultado, mostrarlo directamente
          selectClient(data.data[0]);
        } else {
          // Si hay múltiples resultados, mostrar la lista
          setShowResultsList(true);
        }
      } else {
        setError('No se encontró ningún cliente con ese número de contrato o nombre');
        setSearchResults([]); // Limpiar resultados si no hay coincidencias
      }
    } catch (err) {
      setError(err.message || 'Error al buscar cliente');
      console.error('Error searching client:', err);
      setSearchResults([]); // Limpiar resultados en caso de error
    } finally {
      setLoading(false);
    }
  };

  // Función para seleccionar un cliente de la lista
  const selectClient = (cliente) => {
    setClientData({
      id: cliente._id,
      name: cliente.nombre,
      contract: cliente.contrato,
      address: `${cliente.direccion}, ${cliente.colonia}`,
      coordinates: cliente.coordenadas || null,
      tariff: cliente.tipoTarifa,
      debt: cliente.deuda || 0,
      status: cliente.deuda > 0 ? 'pending' : 'current',
      telefono: cliente.telefono,
      email: cliente.email,
      municipio: cliente.municipio
    });
    setShowResultsList(false);
  };

  // Función para volver a la lista de resultados
  const backToResults = () => {
    setClientData(null);
    setShowResultsList(true);
  };

  // Función para abrir modal de edición de ubicación
  const handleEditLocation = () => {
    if (!clientData) return;
    
    setTempCoordinates(clientData.coordinates);
    setShowLocationModal(true);
  };

  // Función para obtener ubicación actual
  const getCurrentLocation = () => {
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
          setTempCoordinates({ 
            lat: parseFloat(latitude.toFixed(6)), 
            lng: parseFloat(longitude.toFixed(6)) 
          });
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

  // Función para guardar la ubicación
const handleSaveLocation = async () => {
  if (!clientData || !tempCoordinates) {
    alert('No hay coordenadas para guardar');
    return;
  }

  setEditingLocation(true);

  try {
    const token = getAuthToken();
    
    console.log('📍 Enviando coordenadas a nueva ruta:', {
      clienteId: clientData.id,
      coordenadas: tempCoordinates
    });

    // USAR LA NUEVA RUTA ESPECÍFICA PARA COORDENADAS
    const response = await fetch(`${API_BASE_URL}/clientes/${clientData.id}/coordenadas`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        coordenadas: tempCoordinates
      })
    });

    console.log('📡 Response status:', response.status);
    
    const responseText = await response.text();
    console.log('📡 Response body:', responseText);

    if (!response.ok) {
      let errorMessage = `Error ${response.status}`;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = responseText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const result = JSON.parse(responseText);
    console.log('✅ Respuesta del servidor:', result);

    // Actualizar datos locales
    setClientData(prev => ({
      ...prev,
      coordinates: tempCoordinates
    }));

    // Actualizar en la lista de resultados si existe
    setSearchResults(prevResults => 
      prevResults.map(cliente => 
        cliente._id === clientData.id 
          ? { ...cliente, coordenadas: tempCoordinates }
          : cliente
      )
    );

    alert('✅ Ubicación guardada exitosamente');
    setShowLocationModal(false);
    
  } catch (error) {
    console.error('❌ Error guardando ubicación:', error);
    alert(`❌ Error guardando ubicación: ${error.message}`);
  } finally {
    setEditingLocation(false);
  }
};

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const openGoogleMaps = () => {
    if (clientData && clientData.coordinates && clientData.coordinates.lat && clientData.coordinates.lng) {
    const { lat, lng } = clientData.coordinates;
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, '_blank');
    } else {
      alert('Este cliente no tiene ubicación definida. Use "Editar Ubicación" para agregarla.');
    }
  };

  const handlePayNow = () => {
    // SOLUCIÓN PROBLEMA 1: Establecer el monto automáticamente igual a la deuda
    setPaymentAmount(clientData.debt.toFixed(2));
    setShowPaymentModal(true);
  };

  // FUNCIÓN CORREGIDA PARA PROCESAR PAGO
  const processPayment = async () => {
  if (!paymentMethod) {
    alert('Por favor seleccione un método de pago');
    return;
  }

  // ✅ MODIFICADO: Permitir montos menores o iguales a la deuda
  const montoPago = parseFloat(paymentAmount);
  if (montoPago <= 0 || montoPago > clientData.debt) {
    alert(`El monto debe ser mayor a $0 y no puede exceder la deuda de $${clientData.debt.toFixed(2)}`);
    return;
  }

  setProcessingPayment(true);

  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_BASE_URL}/clientes/${clientData.id}/pago`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        monto: montoPago, // ✅ Ahora puede ser parcial
        metodoPago: paymentMethod,
        fechaPago: new Date().toISOString()
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.success) {
      // ✅ MODIFICADO: Calcular nueva deuda basada en el monto pagado
      const nuevaDeuda = clientData.debt - montoPago;
      
      // Actualizar datos locales
      setClientData(prev => ({
        ...prev,
        debt: nuevaDeuda,
        status: nuevaDeuda > 0 ? 'pending' : 'current'
      }));

      // Actualizar en la lista de resultados si existe
      setSearchResults(prevResults => 
        prevResults.map(cliente => 
          cliente._id === clientData.id 
            ? { ...cliente, deuda: nuevaDeuda }
            : cliente
        )
      );

      // Cerrar modal primero
      setShowPaymentModal(false);
      setPaymentMethod('');
      setPaymentAmount('');
      
      // Luego generar recibo (actualizado para pagos parciales)
      setTimeout(() => {
        generateReceipt(montoPago, nuevaDeuda);
      }, 100);
      
    } else {
      throw new Error(result.message || 'Error al procesar el pago');
    }

  } catch (error) {
    console.error('Error procesando pago:', error);
    alert(`❌ Error procesando el pago: ${error.message}`);
  } finally {
    setProcessingPayment(false);
  }
};

  const generateReceipt = (montoPagado, deudaRestante) => {
  if (!clientData) return;

  try {
    const esPagoParcial = montoPagado < clientData.debt;
    
    const receiptContent = `
      📄 RECIBO DE PAGO - SAPAHU
      ----------------------------
      Cliente: ${clientData.name}
      Contrato: ${clientData.contract}
      Dirección: ${clientData.address}
      Fecha: ${new Date().toLocaleDateString()}
      Hora: ${new Date().toLocaleTimeString()}
      ----------------------------
      Monto Pagado: $${montoPagado.toFixed(2)}
      Método: ${paymentMethod}
      ${esPagoParcial ? 'PAGO PARCIAL' : 'PAGO TOTAL'}
      Deuda Restante: $${deudaRestante.toFixed(2)}
      ----------------------------
      ¡Gracias por su pago!
    `;

    // Verificar si window está disponible
    if (typeof window === 'undefined') return;

    const printWindow = window.open('', '_blank');
    
    // Verificar si el popup fue bloqueado
    if (!printWindow || printWindow.closed || typeof printWindow.closed === 'undefined') {
      // Si el popup fue bloqueado, mostrar el recibo en la misma ventana
      const receiptHtml = `
        <html>
          <head>
            <title>Recibo de Pago - ${clientData.name}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .receipt { border: 2px solid #000; padding: 20px; max-width: 400px; margin: 0 auto; }
              .header { text-align: center; margin-bottom: 20px; }
              .divider { border-top: 1px solid #000; margin: 10px 0; }
              .success { color: green; font-weight: bold; }
              .partial { color: orange; font-weight: bold; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            <div class="receipt">
              <div class="header">
                <h2>RECIBO DE PAGO - SAPAHU</h2>
                ${esPagoParcial ? '<div class="partial">PAGO PARCIAL</div>' : '<div class="success">PAGO TOTAL</div>'}
              </div>
              <div class="divider"></div>
              <p><strong>Cliente:</strong> ${clientData.name}</p>
              <p><strong>Contrato:</strong> ${clientData.contract}</p>
              <p><strong>Dirección:</strong> ${clientData.address}</p>
              <p><strong>Fecha:</strong> ${new Date().toLocaleDateString()}</p>
              <p><strong>Hora:</strong> ${new Date().toLocaleTimeString()}</p>
              <div class="divider"></div>
              <p><strong>Monto Pagado:</strong> $${montoPagado.toFixed(2)}</p>
              <p><strong>Método:</strong> ${paymentMethod}</p>
              <p><strong>Deuda Restante:</strong> $${deudaRestante.toFixed(2)}</p>
              <div class="divider"></div>
              <p style="text-align: center;" class="${esPagoParcial ? 'partial' : 'success'}">
                ${esPagoParcial ? '✅ Pago parcial exitoso' : '✅ Pago total exitoso'} 
              </p>
              <p style="text-align: center;"><strong>¡Gracias por su pago!</strong></p>
              <div style="text-align: center; margin-top: 20px;">
                <button onclick="window.print()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
                  Imprimir Recibo
                </button>
                <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">
                  Cerrar
                </button>
              </div>
            </div>
          </body>
        </html>
      `;
      
      // Crear una nueva ventana o usar la actual
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(receiptHtml);
        newWindow.document.close();
      } else {
        // Si no se puede abrir ventana, mostrar alerta
        alert('✅ Pago procesado exitosamente. Recibo generado.\n\n' + receiptContent);
      }
      return;
    }

    // Si el popup se abrió correctamente
    printWindow.document.write(`
      <html>
        <head>
          <title>Recibo de Pago - ${clientData.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .receipt { border: 2px solid #000; padding: 20px; max-width: 400px; }
            .header { text-align: center; margin-bottom: 20px; }
            .divider { border-top: 1px solid #000; margin: 10px 0; }
            .partial { color: orange; font-weight: bold; }
            .success { color: green; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <h2>RECIBO DE PAGO - SAPAHU</h2>
              ${esPagoParcial ? '<div class="partial">PAGO PARCIAL</div>' : '<div class="success">PAGO TOTAL</div>'}
            </div>
            <div class="divider"></div>
            <p><strong>Cliente:</strong> ${clientData.name}</p>
            <p><strong>Contrato:</strong> ${clientData.contract}</p>
            <p><strong>Dirección:</strong> ${clientData.address}</p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Hora:</strong> ${new Date().toLocaleTimeString()}</p>
            <div class="divider"></div>
            <p><strong>Monto Pagado:</strong> $${montoPagado.toFixed(2)}</p>
            <p><strong>Método:</strong> ${paymentMethod}</p>
            <p><strong>Deuda Restante:</strong> $${deudaRestante.toFixed(2)}</p>
            <div class="divider"></div>
            <p style="text-align: center;" class="${esPagoParcial ? 'partial' : 'success'}">
              <strong>${esPagoParcial ? '¡Pago parcial exitoso!' : '¡Pago total exitoso!'}</strong>
            </p>
            <p style="text-align: center;"><strong>¡Gracias por su pago!</strong></p>
          </div>
          <script>
            window.onload = function() {
              window.print();
              // No cerrar automáticamente, dejar que el usuario decida
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    
  } catch (error) {
    console.error('Error generando recibo:', error);
    // Si hay error al generar recibo, al menos mostrar alerta de éxito
    alert(`✅ Pago ${montoPagado < clientData.debt ? 'parcial' : 'total'} procesado exitosamente\nMétodo: ${paymentMethod}\nMonto: $${montoPagado.toFixed(2)}\nDeuda restante: $${deudaRestante.toFixed(2)}`);
  }
};

  return (
    <div className={styles.clientSearch}>
      {/* Sección de Búsqueda */}
      <div className={styles.searchSection}>
        <h1>Buscar Cliente - Cobrador</h1>
        <p>Busque por número de contrato o nombre del cliente</p>
        
        <div className={styles.searchBox}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ej: CTO-001 o Juan Pérez..."
            className={styles.searchInput}
            disabled={loading}
          />
          <button 
            onClick={handleSearch} 
            className={styles.searchButton}
            disabled={loading}
          >
            <FontAwesomeIcon icon={faSearch} />
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
      </div>

      {/* Lista de Resultados Múltiples */}
      {showResultsList && searchResults.length > 0 && (
        <div className={styles.resultsListContainer}>
          <div className={styles.resultsListHeader}>
            <FontAwesomeIcon icon={faList} />
            <h3>Se encontraron {searchResults.length} resultados</h3>
            <p>Seleccione el cliente correcto:</p>
          </div>
          
          <div className={styles.resultsGrid}>
            {searchResults.map((cliente, index) => (
              <div 
                key={cliente._id || index}
                className={styles.clientCard}
                onClick={() => selectClient(cliente)}
              >
                <div className={styles.clientCardHeader}>
                  <FontAwesomeIcon icon={faUser} className={styles.clientIcon} />
                  <div>
                    <h4>{cliente.nombre}</h4>
                    <span className={styles.contract}>Contrato: {cliente.contrato}</span>
                  </div>
                </div>
                
                <div className={styles.clientCardInfo}>
                  <p><strong>Dirección:</strong> {cliente.direccion}, {cliente.colonia}</p>
                  <p><strong>Municipio:</strong> {cliente.municipio}</p>
                  <p><strong>Teléfono:</strong> {cliente.telefono || 'No proporcionado'}</p>
                  <p><strong>Ubicación:</strong> 
                    <span className={(cliente.coordenadas && cliente.coordenadas.lat && cliente.coordenadas.lng) ? styles.locationDefined : styles.locationUndefined}>
                      {(cliente.coordenadas && cliente.coordenadas.lat && cliente.coordenadas.lng) ? '✅ Definida' : '❌ Sin ubicación'}
                    </span>
                  </p>
                  <p><strong>Deuda:</strong> 
                    <span className={cliente.deuda > 0 ? styles.debtPending : styles.debtCurrent}>
                      ${cliente.deuda?.toFixed(2) || '0.00'} MXN
                    </span>
                  </p>
                </div>
                
                <button className={styles.selectButton}>
                  Seleccionar Cliente
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resultados de Búsqueda Individual */}
      {clientData && !showResultsList && (
        <div className={styles.resultsContainer}>
          <div className={styles.resultsHeader}>
            <button onClick={backToResults} className={styles.backButton}>
              ← Volver a resultados ({searchResults.length})
            </button>
            <span>Cliente seleccionado</span>
          </div>
          
          <div className={styles.resultsGrid}>
            
            {/* Columna Izquierda - Información del Cliente */}
            <div className={styles.clientInfo}>
              <div className={styles.clientHeader}>
                <h2>{clientData.name}</h2>
                <span className={styles.contract}>Contrato: {clientData.contract}</span>
              </div>

              <div className={styles.infoSection}>
                <div className={styles.infoItem}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.infoIcon} />
                  <div>
                    <strong>Ubicación</strong>
                    <p>{clientData.address}</p>
                    <p>{clientData.municipio}</p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.infoIcon} />
                  <div>
                    <strong>Coordenadas GPS</strong>
                    {(clientData.coordinates && clientData.coordinates.lat && clientData.coordinates.lng) ? (
                        <>
                          <p>Lat: {clientData.coordinates.lat?.toFixed(6)}</p>
                          <p>Lng: {clientData.coordinates.lng?.toFixed(6)}</p>
                        </>
                      ) : (
                        <p className={styles.noCoordinates}>Ubicación no definida</p>
                      )}
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <FontAwesomeIcon icon={faMoneyBillWave} className={styles.infoIcon} />
                  <div>
                    <strong>Información de Servicio</strong>
                    <p>Tipo de Tarifa: {clientData.tariff}</p>
                    <p>Teléfono: {clientData.telefono || 'No proporcionado'}</p>
                    <p>Email: {clientData.email || 'No proporcionado'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha - Mapa y Estado de Cuenta */}
            <div className={styles.clientActions}>
              
              {/* Mini Mapa */}
              <div className={styles.mapSection}>
                <h3>Ubicación en Mapa</h3>
                <div className={styles.miniMap}>
                  {(clientData.coordinates && clientData.coordinates.lat && clientData.coordinates.lng) ? (
                    <div className={styles.mapPlaceholder}>
                      <FontAwesomeIcon icon={faMapMarkerAlt} size="2x" className={styles.mapIconActive} />
                      <p>{clientData.municipio}</p>
                      <small>Coordenadas: {clientData.coordinates.lat?.toFixed(4)}, {clientData.coordinates.lng?.toFixed(4)}</small>
                    </div>
                  ) : (
                    <div className={styles.mapPlaceholderEmpty}>
                      <FontAwesomeIcon icon={faMapMarkerAlt} size="2x" className={styles.mapIconInactive} />
                      <p>Ubicación no definida</p>
                      <small>Use &quot;Editar Ubicación&quot; para agregar coordenadas</small>
                    </div>
                  )}
                </div>
                <div className={styles.mapButtons}>
                  <button 
                    onClick={openGoogleMaps}
                    className={styles.mapButton}
                    disabled={!(clientData.coordinates && clientData.coordinates.lat && clientData.coordinates.lng)}
                  >
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    Ver en Google Maps
                  </button>
                  <button 
                    onClick={handleEditLocation}
                    className={styles.editLocationButton}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    Editar Ubicación
                  </button>
                </div>
              </div>

              {/* Estado de Cuenta */}
              <div className={styles.accountStatus}>
                <h3>Estado de Cuenta</h3>
                <div className={`${styles.statusCard} ${clientData.debt > 0 ? styles.pending : styles.current}`}>
                  <div className={styles.statusHeader}>
                    <FontAwesomeIcon 
                      icon={clientData.debt > 0 ? faExclamationTriangle : faCheckCircle} 
                      className={styles.statusIcon}
                    />
                    <span>
                      {clientData.debt > 0 ? 'Adeudo Pendiente' : 'Al corriente'}
                    </span>
                  </div>
                  
                  <div className={styles.debtAmount}>
                    ${clientData.debt.toFixed(2)} MXN
                  </div>

                  {clientData.debt > 0 && (
                    <button 
                      onClick={handlePayNow}
                      className={styles.payButton}
                    >
                      <FontAwesomeIcon icon={faMoneyBillWave} />
                      Realizar Pago
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Modal de Edición de Ubicación */}
      {showLocationModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.paymentModal}>
            <div className={styles.modalHeader}>
              <h3>Editar Ubicación - {clientData?.name}</h3>
              <button 
                onClick={() => setShowLocationModal(false)}
                className={styles.closeButton}
                disabled={editingLocation}
              >
                ×
              </button>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.locationInfo}>
                <p><strong>Cliente:</strong> {clientData?.name}</p>
                <p><strong>Contrato:</strong> {clientData?.contract}</p>
                <p><strong>Dirección:</strong> {clientData?.address}</p>
              </div>

              {/* Vista previa del mapa */}
              <SimpleMapPreview 
                lat={tempCoordinates?.lat} 
                lng={tempCoordinates?.lng} 
              />

              <div className={styles.locationForm}>
                <div className={styles.coordinateInputs}>
                  <div className={styles.coordinateGroup}>
                    <label>Latitud:</label>
                    <input
                      type="number"
                      step="any"
                      value={tempCoordinates?.lat || ''}
                      onChange={(e) => setTempCoordinates(prev => ({
                        ...prev,
                        lat: parseFloat(e.target.value) || null
                      }))}
                      placeholder="Ej: 19.4326"
                      disabled={editingLocation}
                    />
                  </div>
                  <div className={styles.coordinateGroup}>
                    <label>Longitud:</label>
                    <input
                      type="number"
                      step="any"
                      value={tempCoordinates?.lng || ''}
                      onChange={(e) => setTempCoordinates(prev => ({
                        ...prev,
                        lng: parseFloat(e.target.value) || null
                      }))}
                      placeholder="Ej: -99.1332"
                      disabled={editingLocation}
                    />
                  </div>
                </div>

                <button
                  onClick={getCurrentLocation}
                  disabled={gettingLocation || editingLocation}
                  className={styles.getLocationButton}
                >
                  <FontAwesomeIcon 
                    icon={gettingLocation ? faSpinner : faCrosshairs} 
                    spin={gettingLocation}
                  />
                  {gettingLocation ? ' Obteniendo ubicación...' : ' Usar mi ubicación actual'}
                </button>

                {tempCoordinates && (
                  <div className={styles.coordinatesPreview}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    <span>
                      Coordenadas: {tempCoordinates.lat?.toFixed(6)}, {tempCoordinates.lng?.toFixed(6)}
                    </span>
                  </div>
                )}
              </div>

              <div className={styles.modalActions}>
                <button
                  onClick={() => setShowLocationModal(false)}
                  className={styles.cancelButton}
                  disabled={editingLocation}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveLocation}
                  className={styles.confirmButton}
                  disabled={editingLocation || !tempCoordinates}
                >
                  {editingLocation ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin style={{marginRight: '8px'}} />
                      Guardando...
                    </>
                  ) : (
                    'Guardar Ubicación'
                  )}
                </button>
              </div>

              {editingLocation && (
                <div className={styles.processing}>
                  <div className={styles.spinner}></div>
                  <p>Guardando ubicación...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Pago MODIFICADO PARA PAGOS PARCIALES */}
{showPaymentModal && (
  <div className={styles.modalOverlay}>
    <div className={styles.paymentModal}>
      <div className={styles.modalHeader}>
        <h3>Procesar Pago</h3>
        <button 
          onClick={() => setShowPaymentModal(false)}
          className={styles.closeButton}
          disabled={processingPayment}
        >
          ×
        </button>
      </div>

      <div className={styles.modalContent}>
        <div className={styles.paymentInfo}>
          <p><strong>Cliente:</strong> {clientData?.name}</p>
          <p><strong>Contrato:</strong> {clientData?.contract}</p>
          <p><strong>Deuda Total:</strong> ${clientData?.debt.toFixed(2)}</p>
        </div>

        <div className={styles.paymentForm}>
          <div className={styles.formGroup}>
            <label>Monto a Pagar:</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max={clientData?.debt || 0}
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              disabled={processingPayment}
              className={styles.amountInput}
              placeholder={`Máximo: $${clientData?.debt.toFixed(2)}`}
            />
            <small className={styles.amountHint}>
              Ingrese el monto a pagar (máximo: ${clientData?.debt.toFixed(2)})
            </small>
          </div>

          <div className={styles.paymentMethods}>
            <label>Método de Pago:</label>
            <div className={styles.methodOptions}>
              <label className={styles.methodOption}>
                <input
                  type="radio"
                  value="efectivo"
                  checked={paymentMethod === 'efectivo'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  disabled={processingPayment}
                />
                <FontAwesomeIcon icon={faMoneyBill} />
                <span>Efectivo</span>
              </label>
              
              {/* Agregar más métodos si es necesario */}
            </div>
          </div>

          {/* Información de pago parcial */}
          {parseFloat(paymentAmount) < clientData?.debt && parseFloat(paymentAmount) > 0 && (
            <div className={styles.partialPaymentInfo}>
              <FontAwesomeIcon icon={faExclamationTriangle} />
              <span>
                <strong>Pago Parcial:</strong> Después de este pago, la deuda restante será: 
                <strong> ${(clientData.debt - parseFloat(paymentAmount)).toFixed(2)}</strong>
              </span>
            </div>
          )}

          {/* Información de pago total */}
          {parseFloat(paymentAmount) === clientData?.debt && (
            <div className={styles.fullPaymentInfo}>
              <FontAwesomeIcon icon={faCheckCircle} />
              <span>
                <strong>Pago Total:</strong> El cliente quedará al corriente después de este pago
              </span>
            </div>
          )}
        </div>

        <div className={styles.modalActions}>
          <button
            onClick={() => setShowPaymentModal(false)}
            className={styles.cancelButton}
            disabled={processingPayment}
          >
            Cancelar
          </button>
          <button
            onClick={processPayment}
            className={styles.confirmButton}
            disabled={processingPayment || !paymentMethod || !paymentAmount || parseFloat(paymentAmount) <= 0}
          >
            {processingPayment ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin style={{marginRight: '8px'}} />
                Procesando...
              </>
            ) : (
              parseFloat(paymentAmount) === clientData?.debt ? 'Pagar Totalidad' : 'Realizar Pago Parcial'
            )}
          </button>
        </div>

        {processingPayment && (
          <div className={styles.processing}>
            <div className={styles.spinner}></div>
            <p>Procesando pago...</p>
          </div>
        )}
      </div>
    </div>
  </div>
)}
    </div>
  );
}