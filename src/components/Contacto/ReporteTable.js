import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch,
  faFilter,
  faEdit,
  faSync,
  faExclamationTriangle,
  faClock,
  faCheckCircle,
  faTint,
  faWater,
  faGauge,
  faFileInvoiceDollar,
  faBan,
  faTools,
  faCircle,
  faInbox
} from '@fortawesome/free-solid-svg-icons';
import { useReportes } from './hooks/useReportes';
import { useReporteActions } from './hooks/useReporteActions';
import styles from './Contacto.module.scss';

export function ReporteTable() {
  const [filtros, setFiltros] = useState({
    estado: '',
    categoria: '',
    prioridad: '',
    page: 1,
    limit: 10
  });
  
  const [reporteEditando, setReporteEditando] = useState(null);
  const { reportes, loading, error } = useReportes(filtros);
  const { actualizarReporte, loading: updating } = useReporteActions();

  const categorias = {
    fuga_agua: { label: 'Fuga de Agua', icon: faTint, color: '#3B82F6' },
    agua_no_llega: { label: 'Agua No Llega', icon: faWater, color: '#06B6D4' },
    medidor_danado: { label: 'Medidor Dañado', icon: faGauge, color: '#8B5CF6' },
    calidad_agua: { label: 'Calidad del Agua', icon: faExclamationTriangle, color: '#F59E0B' },
    presion_baja: { label: 'Presión Baja', icon: faGauge, color: '#84CC16' },
    facturacion_erronea: { label: 'Facturación', icon: faFileInvoiceDollar, color: '#10B981' },
    conexion_ilegal: { label: 'Conexión Ilegal', icon: faBan, color: '#EF4444' },
    dano_infraestructura: { label: 'Infraestructura', icon: faTools, color: '#6B7280' },
    otro: { label: 'Otro', icon: faCircle, color: '#9CA3AF' }
  };

  const estados = {
    pendiente: { label: 'Pendiente', icon: faClock, color: '#F59E0B' },
    en_proceso: { label: 'En Proceso', icon: faSync, color: '#3B82F6' },
    resuelto: { label: 'Resuelto', icon: faCheckCircle, color: '#10B981' }
  };

  const prioridades = {
    baja: { label: 'Baja', color: '#10B981' },
    media: { label: 'Media', color: '#F59E0B' },
    alta: { label: 'Alta', color: '#EF4444' },
    urgente: { label: 'Urgente', color: '#DC2626' }
  };

  const handleFiltroChange = (key, value) => {
    setFiltros(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handleEstadoChange = async (reporteId, nuevoEstado) => {
    try {
      await actualizarReporte(reporteId, { estado: nuevoEstado });
      setReporteEditando(null);
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

  // ✅ FUNCIÓN CORREGIDA: Obtener información del usuario que creó el reporte
  const obtenerInfoCreador = (reporte) => {
    if (!reporte.creadoPor) return { nombre: 'N/A', role: 'N/A' };
    
    // Si creadoPor.userId es un objeto (contiene datos del usuario)
    if (typeof reporte.creadoPor.userId === 'object' && reporte.creadoPor.userId !== null) {
      return {
        nombre: reporte.creadoPor.userId.name || reporte.creadoPor.nombre || 'N/A',
        role: reporte.creadoPor.userId.role || reporte.creadoPor.role || 'N/A'
      };
    }
    
    // Si creadoPor tiene nombre y role directamente
    if (reporte.creadoPor.nombre && reporte.creadoPor.role) {
      return {
        nombre: reporte.creadoPor.nombre,
        role: reporte.creadoPor.role
      };
    }
    
    return { nombre: 'N/A', role: 'N/A' };
  };

  const formatFecha = (fecha) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <FontAwesomeIcon icon={faSync} spin /> Cargando reportes...
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorMessage}>
        <FontAwesomeIcon icon={faExclamationTriangle} />
        <div>
          <strong>Error al cargar reportes</strong>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.contactForm}>
      <div className={styles.formHeader}>
        <h3><FontAwesomeIcon icon={faFilter} /> Gestión de Reportes</h3>
        <p>Administra y da seguimiento a los reportes de problemas</p>
      </div>

      {/* Filtros */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px', 
        marginBottom: '24px',
        padding: '20px',
        background: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid #e2e8f0'
      }}>
        <div className={styles.formGroup}>
          <label>Estado</label>
          <select 
            value={filtros.estado} 
            onChange={(e) => handleFiltroChange('estado', e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="en_proceso">En Proceso</option>
            <option value="resuelto">Resuelto</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Categoría</label>
          <select 
            value={filtros.categoria} 
            onChange={(e) => handleFiltroChange('categoria', e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {Object.entries(categorias).map(([key, cat]) => (
              <option key={key} value={key}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Prioridad</label>
          <select 
            value={filtros.prioridad} 
            onChange={(e) => handleFiltroChange('prioridad', e.target.value)}
          >
            <option value="">Todas las prioridades</option>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
            <option value="urgente">Urgente</option>
          </select>
        </div>
      </div>

      {/* Tabla de Reportes */}
      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          padding: '20px', 
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
            Reportes ({reportes.length})
          </h4>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            minWidth: '800px'
          }}>
            <thead>
              <tr style={{ 
                backgroundColor: '#f8fafc',
                borderBottom: '2px solid #e2e8f0'
              }}>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Título</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Categoría</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Prioridad</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Estado</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Reportado por</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Fecha</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reportes.map((reporte) => {
                const infoCreador = obtenerInfoCreador(reporte);
                
                return (
                  <tr key={reporte._id} style={{ 
                    borderBottom: '1px solid #f1f5f9',
                    backgroundColor: reporteEditando === reporte._id ? '#f0f9ff' : 'transparent'
                  }}>
                    <td style={{ padding: '16px', verticalAlign: 'top' }}>
                      <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                        {reporte.titulo}
                      </div>
                      <div style={{ 
                        fontSize: '13px', 
                        color: '#6b7280',
                        lineHeight: '1.4'
                      }}>
                        {reporte.descripcion}
                      </div>
                      {reporte.ubicacion && (
                        <div style={{ 
                          fontSize: '12px', 
                          color: '#3b82f6',
                          marginTop: '4px'
                        }}>
                          📍 {reporte.ubicacion}
                        </div>
                      )}
                    </td>
                    
                    <td style={{ padding: '16px', verticalAlign: 'top' }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px' 
                      }}>
                        <FontAwesomeIcon 
                          icon={categorias[reporte.categoria]?.icon || faTools} 
                          style={{ color: categorias[reporte.categoria]?.color }} 
                        />
                        <span>{categorias[reporte.categoria]?.label}</span>
                      </div>
                    </td>
                    
                    <td style={{ padding: '16px', verticalAlign: 'top' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: `${prioridades[reporte.prioridad]?.color}20`,
                        color: prioridades[reporte.prioridad]?.color,
                        border: `1px solid ${prioridades[reporte.prioridad]?.color}40`
                      }}>
                        {prioridades[reporte.prioridad]?.label}
                      </span>
                    </td>
                    
                    <td style={{ padding: '16px', verticalAlign: 'top' }}>
                      {reporteEditando === reporte._id ? (
                        <select 
                          value={reporte.estado}
                          onChange={(e) => handleEstadoChange(reporte._id, e.target.value)}
                          disabled={updating}
                          style={{ 
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid #d1d5db',
                            fontSize: '14px'
                          }}
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="en_proceso">En Proceso</option>
                          <option value="resuelto">Resuelto</option>
                        </select>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <FontAwesomeIcon 
                            icon={estados[reporte.estado]?.icon} 
                            style={{ color: estados[reporte.estado]?.color }} 
                          />
                          <span>{estados[reporte.estado]?.label}</span>
                        </div>
                      )}
                    </td>
                    
                    <td style={{ padding: '16px', verticalAlign: 'top' }}>
                      <div style={{ fontWeight: '500' }}>
                        {infoCreador.nombre}
                      </div>
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#6b7280',
                        textTransform: 'capitalize'
                      }}>
                        {infoCreador.role}
                      </div>
                    </td>
                    
                    <td style={{ padding: '16px', verticalAlign: 'top' }}>
                      <div style={{ fontSize: '13px' }}>
                        {formatFecha(reporte.createdAt)}
                      </div>
                    </td>
                    
                    <td style={{ padding: '16px', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => setReporteEditando(
                            reporteEditando === reporte._id ? null : reporte._id
                          )}
                          style={{
                            padding: '6px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            background: 'white',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} /> Editar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {reportes.length === 0 && (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center', 
            color: '#6b7280' 
          }}>
            <FontAwesomeIcon icon={faInbox} size="2x" style={{ marginBottom: '16px', opacity: 0.5 }} />
            <div>No se encontraron reportes con los filtros seleccionados</div>
          </div>
        )}
      </div>
    </div>
  );
}