import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClock,
  faCheckCircle,
  faSync,
  faTint,
  faWater,
  faGauge,
  faFileInvoiceDollar,
  faBan,
  faTools,
  faExclamationTriangle,
  faInfoCircle,
  faInbox // ✅ Nuevo icono para "sin reportes"
} from '@fortawesome/free-solid-svg-icons';
import { useReportes } from './hooks/useReportes';
import styles from './Contacto.module.scss';

export function ReporteList() {
  const { reportes, loading, error } = useReportes();

  const categorias = {
    fuga_agua: { label: 'Fuga de Agua', icon: faTint, color: '#3B82F6' },
    agua_no_llega: { label: 'Agua No Llega', icon: faWater, color: '#06B6D4' },
    medidor_danado: { label: 'Medidor Dañado', icon: faGauge, color: '#8B5CF6' },
    calidad_agua: { label: 'Calidad del Agua', icon: faExclamationTriangle, color: '#F59E0B' },
    presion_baja: { label: 'Presión Baja', icon: faGauge, color: '#84CC16' },
    facturacion_erronea: { label: 'Facturación', icon: faFileInvoiceDollar, color: '#10B981' },
    conexion_ilegal: { label: 'Conexión Ilegal', icon: faBan, color: '#EF4444' },
    dano_infraestructura: { label: 'Infraestructura', icon: faTools, color: '#6B7280' },
    otro: { label: 'Otro', icon: faInfoCircle, color: '#9CA3AF' }
  };

  const estados = {
    pendiente: { label: 'Pendiente', icon: faClock, color: '#F59E0B' },
    en_proceso: { label: 'En Proceso', icon: faSync, color: '#3B82F6' },
    resuelto: { label: 'Resuelto', icon: faCheckCircle, color: '#10B981' }
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <FontAwesomeIcon icon={faSync} spin /> Cargando tus reportes...
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

  // ✅ MOSTRAR MENSAJE CUANDO NO HAY REPORTES
  if (reportes.length === 0) {
    return (
      <div className={styles.contactForm}>
        <div className={styles.formHeader}>
          <h3>📋 Mis Reportes Anteriores</h3>
          <p>Historial de problemas que has reportado</p>
        </div>
        
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px', 
          color: '#6b7280',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <FontAwesomeIcon 
            icon={faInbox} 
            size="3x" 
            style={{ marginBottom: '20px', opacity: 0.3 }} 
          />
          <h4 style={{ margin: '0 0 12px 0', color: '#374151' }}>
            No tienes reportes anteriores
          </h4>
          <p style={{ margin: 0, fontSize: '16px' }}>
            Los reportes que hagas aparecerán aquí para que puedas darles seguimiento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.contactForm}>
      <div className={styles.formHeader}>
        <h3>📋 Mis Reportes Anteriores</h3>
        <p>Historial de problemas que has reportado ({reportes.length} reportes)</p>
      </div>

      <div className={styles.contactGrid}>
        {reportes.map((reporte) => (
          <div key={reporte._id} className={styles.contactItem}>
            <div className={styles.contactIcon} style={{ 
              backgroundColor: `${categorias[reporte.categoria]?.color}20`,
              color: categorias[reporte.categoria]?.color
            }}>
              <FontAwesomeIcon icon={categorias[reporte.categoria]?.icon || faTools} />
            </div>
            <div className={styles.contactContent}>
              <div className={styles.contactType}>{reporte.titulo}</div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                marginBottom: '8px'
              }}>
                <FontAwesomeIcon 
                  icon={estados[reporte.estado]?.icon} 
                  style={{ 
                    color: estados[reporte.estado]?.color,
                    fontSize: '14px'
                  }} 
                />
                <span style={{ 
                  fontSize: '13px',
                  color: estados[reporte.estado]?.color,
                  fontWeight: '600'
                }}>
                  {estados[reporte.estado]?.label}
                </span>
                <span style={{ 
                  fontSize: '12px',
                  color: '#6b7280',
                  marginLeft: 'auto'
                }}>
                  {formatFecha(reporte.createdAt)}
                </span>
              </div>
              <div className={styles.contactDesc}>
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
              {reporte.comentariosAdmin && (
                <div style={{ 
                  fontSize: '12px', 
                  color: '#10b981',
                  marginTop: '8px',
                  padding: '8px',
                  background: '#f0fdf4',
                  borderRadius: '6px',
                  borderLeft: '3px solid #10b981'
                }}>
                  <strong>Comentario del admin:</strong> {reporte.comentariosAdmin}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}