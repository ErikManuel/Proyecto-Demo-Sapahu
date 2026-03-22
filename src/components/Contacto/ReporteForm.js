import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPaperPlane,
  faCheckCircle,
  faExclamationCircle,
  faTag,
  faComment,
  faMapMarkerAlt,
  faInfoCircle,
  faSpinner,
  faExclamationTriangle,
  faTint,
  faWater,
  faGauge,
  faFileInvoiceDollar,
  faBan,
  faTools
} from '@fortawesome/free-solid-svg-icons';
import { useReporteActions } from './hooks/useReporteActions';
import styles from './Contacto.module.scss';

export function ReporteForm({ onReporteCreado }) {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria: 'fuga_agua',
    prioridad: 'media',
    ubicacion: ''
  });

  const { crearReporte, loading, error } = useReporteActions();
  const [submitStatus, setSubmitStatus] = useState(null);

  const categorias = [
    { value: 'fuga_agua', label: 'Fuga de Agua', icon: faTint },
    { value: 'agua_no_llega', label: 'Agua No Llega', icon: faWater },
    { value: 'medidor_danado', label: 'Medidor Dañado', icon: faGauge },
    { value: 'calidad_agua', label: 'Calidad del Agua', icon: faExclamationTriangle },
    { value: 'presion_baja', label: 'Presión Baja', icon: faGauge },
    { value: 'facturacion_erronea', label: 'Facturación Errónea', icon: faFileInvoiceDollar },
    { value: 'conexion_ilegal', label: 'Conexión Ilegal', icon: faBan },
    { value: 'dano_infraestructura', label: 'Daño en Infraestructura', icon: faTools },
    { value: 'otro', label: 'Otro Problema', icon: faInfoCircle }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);

    try {
      const result = await crearReporte(formData);
      setSubmitStatus('success');
      
      // Resetear formulario
      setFormData({
        titulo: '',
        descripcion: '',
        categoria: 'fuga_agua',
        prioridad: 'media',
        ubicacion: ''
      });
      
      // Notificar que se creó un reporte
      if (onReporteCreado) {
        onReporteCreado(result.data);
      }
      
    } catch (err) {
      setSubmitStatus('error');
    }
  };

  return (
    <div className={styles.contactForm}>
      <div className={styles.formHeader}>
        <h3><FontAwesomeIcon icon={faPaperPlane} /> Reportar Problema</h3>
        <p>Reporta problemas relacionados al servicio de agua para atención inmediata</p>
      </div>

      {submitStatus === 'success' && (
        <div className={styles.successMessage}>
          <FontAwesomeIcon icon={faCheckCircle} />
          <div>
            <strong>¡Reporte enviado exitosamente!</strong>
            <p>Hemos recibido tu reporte y lo atenderemos a la brevedad.</p>
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className={styles.errorMessage}>
          <FontAwesomeIcon icon={faExclamationCircle} />
          <div>
            <strong>Error al enviar el reporte</strong>
            <p>{error || 'Por favor, intenta nuevamente.'}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="titulo">
            <FontAwesomeIcon icon={faTag} /> Título del Reporte *
          </label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
            placeholder="Ej: Fuga de agua en calle principal"
            maxLength={100}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="categoria">
              <FontAwesomeIcon icon={faInfoCircle} /> Categoría *
            </label>
            <select
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              required
            >
              {categorias.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="prioridad">
              <FontAwesomeIcon icon={faExclamationTriangle} /> Prioridad *
            </label>
            <select
              id="prioridad"
              name="prioridad"
              value={formData.prioridad}
              onChange={handleChange}
              required
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="ubicacion">
            <FontAwesomeIcon icon={faMapMarkerAlt} /> Ubicación
          </label>
          <input
            type="text"
            id="ubicacion"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
            placeholder="Ej: Calle Principal #123, Colonia Centro"
            maxLength={200}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="descripcion">
            <FontAwesomeIcon icon={faComment} /> Descripción Detallada *
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
            rows="6"
            placeholder="Describe el problema con todos los detalles necesarios..."
            maxLength={500}
          />
          <small style={{ color: '#6b7280', fontSize: '12px' }}>
            {formData.descripcion.length}/500 caracteres
          </small>
        </div>

        <div className={styles.formActions}>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin /> Enviando...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faPaperPlane} /> Enviar Reporte
              </>
            )}
          </button>

          <div className={styles.formNote}>
            <p><FontAwesomeIcon icon={faInfoCircle} /> Los campos marcados con * son obligatorios</p>
          </div>
        </div>
      </form>
    </div>
  );
}