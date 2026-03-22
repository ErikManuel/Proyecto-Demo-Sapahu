import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPhoneAlt, 
  faEnvelope, 
  faTint, 
  faClock, 
  faPhone,
  faExclamationTriangle,
  faListAlt,
  faHistory
} from '@fortawesome/free-solid-svg-icons';
import { ContactCard } from './ContactCard';
import { ContactForm } from './ContactForm';
import { ReporteForm } from './ReporteForm';
import { ReporteTable } from './ReporteTable';
import { ReporteList } from './ReporteList';
import { useContactData } from './hooks/useContactData';
import { useAuth } from '../../hooks/useAuth';
import styles from './Contacto.module.scss';

export function Contacto() {
  const [activeTab, setActiveTab] = useState('informacion');
  const { contactInfo, loading } = useContactData();
  const { user } = useAuth();

  // Determinar qué contenido mostrar en la pestaña "Enviar Mensaje" según el rol
  const renderFormContent = () => {
    switch (user?.role) {
      case 'admin':
        return <ReporteTable />;
      case 'cobrador':
        return (
          <div>
            <ReporteForm />
            <div style={{ marginTop: '40px' }}>
              <ReporteList />
            </div>
          </div>
        );
      case 'consultor':
      default:
        return <ContactForm />;
    }
  };

  // Determinar el texto del tab según el rol
  const getFormTabText = () => {
    switch (user?.role) {
      case 'admin':
        return 'Gestión de Reportes';
      case 'cobrador':
        return 'Reportar Problema';
      case 'consultor':
      default:
        return 'Enviar Mensaje';
    }
  };

  // Determinar el ícono del tab según el rol
  const getFormTabIcon = () => {
    switch (user?.role) {
      case 'admin':
        return faListAlt;
      case 'cobrador':
        return faExclamationTriangle;
      case 'consultor':
      default:
        return faEnvelope;
    }
  };

  return (
    <div className={styles.contacto}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1>Contacto</h1>
          <p>Estamos aquí para atenderte. Elige la forma de contacto que prefieras</p>
        </div>
      </div>

      {/* Tabs de navegación */}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'informacion' ? styles.active : ''}`}
          onClick={() => setActiveTab('informacion')}
        >
          <FontAwesomeIcon icon={faPhoneAlt} /> Información de Contacto
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'formulario' ? styles.active : ''}`}
          onClick={() => setActiveTab('formulario')}
        >
          <FontAwesomeIcon icon={getFormTabIcon()} /> {getFormTabText()}
        </button>
      </div>

      {/* Contenido */}
      <div className={styles.content}>
        {activeTab === 'informacion' ? (
          <ContactCard contactInfo={contactInfo} />
        ) : (
          renderFormContent()
        )}
      </div>

      {/* Información adicional */}
      <div className={styles.additionalInfo}>
        <div className={styles.infoCard}>
          <h3><FontAwesomeIcon icon={faTint} /> Servicio de Emergencias 24/7</h3>
          <p>Para reportar fugas, cortes de agua o emergencias fuera de horario de oficina</p>
          <div className={styles.emergencyContact}>
            <span><FontAwesomeIcon icon={faPhone} /> Línea directa: </span>
            <strong>555-EMERGENCIA (555-36373642)</strong>
          </div>
        </div>

        <div className={styles.infoCard}>
          <h3><FontAwesomeIcon icon={faClock} /> Horarios de Atención</h3>
          <div className={styles.schedule}>
            <div className={styles.scheduleItem}>
              <span>Lunes a Viernes:</span>
              <strong>8:00 AM - 6:00 PM</strong>
            </div>
            <div className={styles.scheduleItem}>
              <span>Sábados:</span>
              <strong>9:00 AM - 2:00 PM</strong>
            </div>
            <div className={styles.scheduleItem}>
              <span>Domingos:</span>
              <strong>Cerrado</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}