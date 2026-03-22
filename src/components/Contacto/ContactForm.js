import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPaperPlane,
  faCheckCircle,
  faExclamationCircle,
  faUser,
  faEnvelope,
  faPhone,
  faQuestionCircle,
  faTag,
  faComment,
  faInfoCircle,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import styles from './Contacto.module.scss';

export function ContactForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: '',
    tipoConsulta: 'general'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Formulario enviado:', formData);
      setSubmitStatus('success');
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        asunto: '',
        mensaje: '',
        tipoConsulta: 'general'
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.contactForm}>
      <div className={styles.formHeader}>
        <h3><FontAwesomeIcon icon={faPaperPlane} /> Envíanos un Mensaje</h3>
        <p>Completa el formulario y nos pondremos en contacto contigo a la brevedad</p>
      </div>

      {submitStatus === 'success' && (
        <div className={styles.successMessage}>
          <FontAwesomeIcon icon={faCheckCircle} />
          <div>
            <strong>¡Mensaje enviado exitosamente!</strong>
            <p>Te contactaremos dentro de las próximas 24 horas.</p>
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className={styles.errorMessage}>
          <FontAwesomeIcon icon={faExclamationCircle} />
          <div>
            <strong>Error al enviar el mensaje</strong>
            <p>Por favor, intenta nuevamente o contacta por teléfono.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="nombre">
              <FontAwesomeIcon icon={faUser} /> Nombre Completo *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Ingresa tu nombre completo"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">
              <FontAwesomeIcon icon={faEnvelope} /> Correo Electrónico *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="tu@email.com"
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="telefono">
              <FontAwesomeIcon icon={faPhone} /> Teléfono
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="555-123-4567"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tipoConsulta">
              <FontAwesomeIcon icon={faQuestionCircle} /> Tipo de Consulta
            </label>
            <select
              id="tipoConsulta"
              name="tipoConsulta"
              value={formData.tipoConsulta}
              onChange={handleChange}
            >
              <option value="general">Consulta General</option>
              <option value="soporte">Soporte Técnico</option>
              <option value="facturacion">Facturación</option>
              <option value="queja">Queja o Reclamación</option>
              <option value="sugerencia">Sugerencia</option>
              <option value="emergencia">Emergencia</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="asunto">
            <FontAwesomeIcon icon={faTag} /> Asunto *
          </label>
          <input
            type="text"
            id="asunto"
            name="asunto"
            value={formData.asunto}
            onChange={handleChange}
            required
            placeholder="Breve descripción del asunto"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="mensaje">
            <FontAwesomeIcon icon={faComment} /> Mensaje *
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            required
            rows="6"
            placeholder="Describe detalladamente tu consulta, queja o sugerencia..."
          />
        </div>

        <div className={styles.formActions}>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin /> Enviando...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faPaperPlane} /> Enviar Mensaje
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